// Inteligencia comercial determinista: todo lo de acá se calcula a partir de
// campos reales del CRM (estado, prioridad, problemas, actividad, contactos).
// No hay llamadas a un LLM ni datos inventados — son reglas explícitas.

import type { Activity, Company, Person } from "./types";
import { painPointLabel } from "./constants";

const STAGE_BASE: Record<Company["status"], number> = {
  nuevo: 5,
  contactar: 10,
  contactado: 20,
  visita_agendada: 28,
  visitado: 35,
  interesado: 45,
  demo: 58,
  propuesta: 70,
  negociacion: 82,
  cliente: 100,
  perdido: 0,
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function daysSince(dateIso: string | null | undefined): number | null {
  if (!dateIso) return null;
  const ms = Date.now() - new Date(dateIso).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function lastActivityDate(company: Company, activities: Activity[]): string {
  const companyActivities = activities.filter((a) => a.companyId === company.id);
  if (companyActivities.length === 0) return company.createdAt;
  return companyActivities.reduce(
    (latest, a) => (new Date(a.createdAt) > new Date(latest) ? a.createdAt : latest),
    companyActivities[0].createdAt
  );
}

export function computeScore(company: Company, activities: Activity[], people: Person[]): number {
  if (company.status === "cliente") return 100;
  if (company.status === "perdido") return 0;

  let score = STAGE_BASE[company.status];

  const companyPeople = people.filter((p) => p.companyId === company.id);
  if (companyPeople.some((p) => p.decisionLevel === "decide")) score += 12;

  if (company.painPoints.length >= 3) score += 8;
  else if (company.painPoints.length > 0) score += 4;

  if (company.priority === "A") score += 10;
  else if (company.priority === "C") score -= 8;

  const companyActivities = activities.filter((a) => a.companyId === company.id);
  if (companyActivities.some((a) => a.type === "demo")) score += 8;
  if (companyActivities.some((a) => a.type === "propuesta_enviada")) score += 6;

  const days = daysSince(lastActivityDate(company, activities));
  if (days !== null) {
    if (days <= 2) score += 6;
    else if (days > 14) score -= 25;
    else if (days > 7) score -= 15;
    else if (days > 4) score -= 6;
  }

  return clamp(Math.round(score), 0, 100);
}

// La probabilidad de cierre reutiliza el mismo score (0-100 = 0%-100%):
// ambos miden qué tan avanzada y sana está la oportunidad.
export function computeProbability(company: Company, activities: Activity[], people: Person[]): number {
  return computeScore(company, activities, people);
}

export type Temperature = "muy_caliente" | "caliente" | "tibio" | "frio" | "riesgo";

export const TEMPERATURE_META: Record<Temperature, { label: string; icon: string }> = {
  muy_caliente: { label: "Muy caliente", icon: "🔥" },
  caliente: { label: "Caliente", icon: "🟢" },
  tibio: { label: "Tibio", icon: "🟡" },
  frio: { label: "Frío", icon: "🔵" },
  riesgo: { label: "Riesgo", icon: "🔴" },
};

export function computeTemperature(company: Company, score: number): Temperature {
  if (company.status === "perdido") return "riesgo";
  const days = company.status !== "cliente" ? daysSince(company.updatedAt) : 0;
  if (days !== null && days > 10 && company.status !== "cliente") return "riesgo";
  if (score >= 80) return "muy_caliente";
  if (score >= 60) return "caliente";
  if (score >= 35) return "tibio";
  return "frio";
}

export function computeReasons(company: Company, activities: Activity[], people: Person[]): string[] {
  const reasons: string[] = [];
  const companyPeople = people.filter((p) => p.companyId === company.id);
  const companyActivities = activities.filter((a) => a.companyId === company.id);

  if (companyPeople.some((p) => p.decisionLevel === "decide")) reasons.push("Contacto directo con el decisor.");
  if (company.painPoints.length > 0) reasons.push(`${company.painPoints.length} problema(s) detectado(s).`);
  if (companyActivities.some((a) => a.type === "demo")) reasons.push("Demo realizada.");
  if (companyActivities.some((a) => a.type === "propuesta_enviada")) reasons.push("Propuesta enviada.");
  if (company.priority === "A") reasons.push("Prioridad alta.");

  const days = daysSince(lastActivityDate(company, activities));
  if (days !== null && days > 5 && company.status !== "cliente" && company.status !== "perdido") {
    reasons.push(`Hace ${days} días que no recibe seguimiento.`);
  }

  return reasons;
}

export function recommendAction(company: Company, activities: Activity[]): string {
  if (company.status === "cliente" || company.status === "perdido") return "";

  if (!company.nextActionType || !company.nextActionDate) {
    return "Definir una próxima acción hoy.";
  }

  const days = daysSince(lastActivityDate(company, activities));

  if (company.status === "propuesta" && days !== null && days > 3) {
    return "Contactar hoy sobre la propuesta enviada.";
  }
  if (company.status === "demo" && days !== null && days > 2) {
    return "Enviar propuesta.";
  }
  if (company.status === "visitado" && days !== null && days > 4) {
    return "Nara debería volver a visitar o llamar.";
  }
  if (days !== null && days > 7) {
    return "Contactar hoy — está estancado.";
  }
  if (days !== null && days <= 1) {
    return "Esperar la respuesta antes de insistir.";
  }
  return "Seguir el plan de la próxima acción.";
}

export interface ProfileLike {
  id: string;
  fullName: string;
}

// "Resumen para Nara" (punto 12): un párrafo armado a partir de datos
// estructurados reales. Nunca inventa información que no esté en el CRM.
export function buildVisitSummary(
  company: Company,
  people: Person[],
  activities: Activity[],
  profilesById: Record<string, ProfileLike>
): string {
  const companyPeople = people.filter((p) => p.companyId === company.id);
  const companyActivities = activities
    .filter((a) => a.companyId === company.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const decisionMaker = companyPeople.find((p) => p.decisionLevel === "decide") || companyPeople[0];
  const lastNote = companyActivities.find((a) => a.type === "nota" || a.type === "llamada" || a.type === "whatsapp");
  const lastAuthor = lastNote?.createdBy ? profilesById[lastNote.createdBy]?.fullName : null;

  const sentences: string[] = [];

  if (company.painPoints.length > 0) {
    const labels = company.painPoints.slice(0, 2).map((id) => painPointLabel(company.industry, id).toLowerCase());
    sentences.push(`${company.name} parece tener como principal problema: ${labels.join(" y ")}.`);
  } else {
    sentences.push(`Todavía no registramos problemas específicos de ${company.name}.`);
  }

  if (decisionMaker) {
    const fullName = [decisionMaker.firstName, decisionMaker.lastName].filter(Boolean).join(" ");
    const role = decisionMaker.position === "dueño" ? "el dueño" : decisionMaker.position;
    if (lastAuthor) {
      sentences.push(`${lastAuthor} habló con ${fullName}, ${role}.`);
    } else {
      sentences.push(`El contacto principal es ${fullName}, ${role}.`);
    }
    if (decisionMaker.bestContactTime) {
      sentences.push(`Suele estar disponible ${decisionMaker.bestContactTime}.`);
    }
  } else {
    sentences.push("Todavía no tenemos un contacto principal identificado.");
  }

  if (lastNote) {
    sentences.push(`Última nota: "${lastNote.content}"`);
  }

  return sentences.join(" ");
}

export interface PipelineHealth {
  score: number;
  reasons: string[];
}

// Salud general del pipeline (punto 52): combina volumen de actividad,
// seguimientos vencidos, oportunidades calientes y actividad reciente.
export function computePipelineHealth(companies: Company[], activities: Activity[], people: Person[]): PipelineHealth {
  const active = companies.filter((c) => c.status !== "cliente" && c.status !== "perdido" && !c.archived);
  if (active.length === 0) return { score: 0, reasons: ["No hay prospectos activos todavía."] };

  let score = 50;
  const reasons: string[] = [];

  const overdue = active.filter((c) => c.nextActionDate && daysSince(c.nextActionDate)! > 0).length;
  const overduePct = overdue / active.length;
  if (overduePct > 0.3) {
    score -= 20;
    reasons.push(`${Math.round(overduePct * 100)}% de los prospectos tienen seguimientos vencidos.`);
  } else if (overduePct < 0.1) {
    score += 10;
    reasons.push("Casi no hay seguimientos vencidos.");
  }

  const withoutAction = active.filter((c) => !c.nextActionDate).length;
  if (withoutAction > 0) {
    score -= Math.min(20, withoutAction * 3);
    reasons.push(`${withoutAction} prospecto(s) sin próxima acción definida.`);
  }

  const hot = active.filter((c) => computeScore(c, activities, people) >= 75).length;
  if (hot > 0) {
    score += Math.min(15, hot * 4);
    reasons.push(`${hot} oportunidad(es) caliente(s) en el pipeline.`);
  }

  const recentlyActive = active.filter((c) => {
    const days = daysSince(lastActivityDate(c, activities));
    return days !== null && days <= 3;
  }).length;
  const recentPct = recentlyActive / active.length;
  if (recentPct > 0.5) {
    score += 15;
    reasons.push("Más de la mitad del pipeline tuvo actividad en los últimos 3 días.");
  } else if (recentPct < 0.2) {
    score -= 15;
    reasons.push("Poca actividad reciente en el pipeline.");
  }

  return { score: clamp(Math.round(score), 0, 100), reasons };
}

export interface Alert {
  level: "info" | "warning" | "danger" | "success";
  icon: string;
  text: string;
}

export function buildAlerts(
  companies: Company[],
  activities: Activity[],
  people: Person[]
): Alert[] {
  const alerts: Alert[] = [];
  const active = companies.filter((c) => c.status !== "cliente" && c.status !== "perdido" && !c.archived);

  const stale = active.filter((c) => {
    const days = daysSince(lastActivityDate(c, activities));
    return days !== null && days >= 5;
  });
  stale
    .sort((a, b) => (daysSince(lastActivityDate(b, activities)) ?? 0) - (daysSince(lastActivityDate(a, activities)) ?? 0))
    .slice(0, 3)
    .forEach((c) => {
      const days = daysSince(lastActivityDate(c, activities));
      alerts.push({ level: "warning", icon: "⚠️", text: `${c.name} lleva ${days} días sin seguimiento.` });
    });

  const hot = active
    .map((c) => ({ c, score: computeScore(c, activities, people) }))
    .filter((x) => x.score >= 75)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
  hot.forEach(({ c, score }) => {
    alerts.push({ level: "success", icon: "🔥", text: `${c.name} tiene ${score}% de probabilidad de cierre.` });
  });

  const proposalMrr = companies
    .filter((c) => c.status === "propuesta" || c.status === "negociacion")
    .reduce((sum, c) => sum + (c.mrrPotential || 0), 0);
  if (proposalMrr > 0) {
    alerts.push({
      level: "info",
      icon: "💰",
      text: `Hay $${proposalMrr.toLocaleString("es-AR")} de MRR en propuestas abiertas.`,
    });
  }

  const noNextAction = active.filter((c) => !c.nextActionType || !c.nextActionDate);
  if (noNextAction.length > 0) {
    alerts.push({
      level: "danger",
      icon: "🚨",
      text: `${noNextAction.length} oportunidad(es) no tienen próxima acción definida.`,
    });
  }

  return alerts;
}
