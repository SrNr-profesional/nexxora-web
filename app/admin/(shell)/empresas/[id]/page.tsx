"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Phone,
  Car,
  StickyNote,
  CalendarClock,
  FileText,
  CheckCircle2,
  MapPin,
  Loader2,
  Plus,
  Building2,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import PriorityBadge from "@/components/admin/PriorityBadge";
import ScoreBadge from "@/components/admin/ScoreBadge";
import { SkeletonRows } from "@/components/admin/Skeleton";
import Button from "@/components/ui/Button";
import { buildWhatsappLink } from "@/lib/constants";
import type { Activity, CompanyDetail, DecisionLevel, PersonPosition, Profile } from "@/lib/crm/types";
import {
  ACTIVITY_TYPE_LABELS,
  COMPANY_STATUS_LABELS,
  DECISION_LEVEL_LABELS,
  getPainPointsCatalog,
  INDUSTRY_LABELS,
  NEXT_ACTION_LABELS,
  PERSON_POSITIONS,
  PIPELINE_STAGES,
} from "@/lib/crm/constants";
import { computeScore, computeReasons, buildVisitSummary } from "@/lib/crm/scoring";
import { formatCurrencyARS, cn } from "@/lib/utils";

const TABS = ["resumen", "datos", "contactos", "problemas", "timeline"] as const;
type Tab = (typeof TABS)[number];
const TAB_LABELS: Record<Tab, string> = {
  resumen: "Resumen",
  datos: "Datos",
  contactos: "Contactos",
  problemas: "Problemas",
  timeline: "Timeline",
};

export default function CompanyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("resumen");

  const load = async () => {
    const [companyRes, profilesRes] = await Promise.all([
      fetch(`/api/admin/companies/${params.id}`).then((r) => r.json()),
      fetch("/api/admin/profiles").then((r) => r.json()),
    ]);
    if (companyRes.ok) setCompany(companyRes.company);
    if (profilesRes.ok) setProfiles(profilesRes.profiles);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const patchCompany = async (update: Record<string, any>) => {
    const res = await fetch(`/api/admin/companies/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    const data = await res.json();
    if (data.ok) load();
  };

  const addActivity = async (type: Activity["type"], content: string) => {
    await fetch(`/api/admin/companies/${params.id}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, content }),
    });
    load();
  };

  const profileName = (id: string | null) => profiles.find((p) => p.id === id)?.fullName || "Sin asignar";

  if (loading || !company) {
    return (
      <div className="mx-auto max-w-5xl p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <SkeletonRows rows={6} />
      </div>
    );
  }

  const score = computeScore(company, company.activities, company.people);
  const primaryPerson = company.people.find((p) => p.isPrimary) || company.people[0];
  const waLink = primaryPerson?.whatsapp
    ? buildWhatsappLink(`Hola${primaryPerson.firstName ? " " + primaryPerson.firstName : ""}, te contacto de Nexxora.`)
    : null;

  return (
    <div className="mx-auto max-w-5xl p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      {/* Header */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-5 shadow-card sm:p-7">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-gradient">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white sm:text-2xl">{company.name}</h1>
              <p className="text-xs text-slate-500">{INDUSTRY_LABELS[company.industry]} · {profileName(company.assignedTo)}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={company.status} />
            <PriorityBadge priority={company.priority} />
            <ScoreBadge company={company} score={score} />
          </div>
        </div>

        {company.mrrPotential > 0 && (
          <p className="mb-4 text-sm text-slate-400">
            MRR potencial: <span className="font-semibold text-brand-cyan">{formatCurrencyARS(company.mrrPotential)}</span>
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {waLink && (
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="focus-ring flex items-center gap-1.5 rounded-full bg-[#25D366]/15 px-3.5 py-2 text-xs font-semibold text-[#25D366]">
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
          )}
          {primaryPerson?.phone && (
            <a href={`tel:${primaryPerson.phone}`} className="focus-ring flex items-center gap-1.5 rounded-full bg-brand-blue/15 px-3.5 py-2 text-xs font-semibold text-brand-cyan">
              <Phone className="h-3.5 w-3.5" /> Llamar
            </a>
          )}
          <button
            onClick={() => {
              const note = prompt("Nota de la visita:");
              if (note) addActivity("visita", note);
            }}
            className="focus-ring flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
          >
            <Car className="h-3.5 w-3.5" /> Registrar visita
          </button>
          <button
            onClick={() => {
              const note = prompt("Nota:");
              if (note) addActivity("nota", note);
            }}
            className="focus-ring flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
          >
            <StickyNote className="h-3.5 w-3.5" /> Agregar nota
          </button>
          <button
            onClick={() => setTab("resumen")}
            className="focus-ring flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
          >
            <CalendarClock className="h-3.5 w-3.5" /> Agendar seguimiento
          </button>
          {company.status !== "cliente" && (
            <button
              onClick={() => confirm("¿Marcar como cliente?") && patchCompany({ status: "cliente" })}
              className="focus-ring flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3.5 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/25"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Marcar como cliente
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-white/10">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t ? "border-brand-blue text-white" : "border-transparent text-slate-500 hover:text-slate-300"
            )}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === "resumen" && (
        <ResumenTab company={company} profiles={profiles} onPatch={patchCompany} />
      )}
      {tab === "datos" && <DatosTab company={company} onPatch={patchCompany} />}
      {tab === "contactos" && <ContactosTab companyId={company.id} people={company.people} onChange={load} />}
      {tab === "problemas" && <ProblemasTab company={company} onPatch={patchCompany} />}
      {tab === "timeline" && <TimelineTab activities={company.activities} profiles={profiles} onAdd={addActivity} />}
    </div>
  );
}

function ResumenTab({
  company,
  profiles,
  onPatch,
}: {
  company: CompanyDetail;
  profiles: Profile[];
  onPatch: (u: Record<string, any>) => void;
}) {
  const profileById = Object.fromEntries(profiles.map((p) => [p.id, p]));
  const summary = buildVisitSummary(company, company.people, company.activities, profileById);
  const reasons = computeReasons(company, company.activities, company.people);
  const primaryPerson = company.people.find((p) => p.isPrimary) || company.people[0];

  const [naType, setNaType] = useState(company.nextActionType || "llamar");
  const [naDate, setNaDate] = useState(company.nextActionDate || "");
  const [naComment, setNaComment] = useState(company.nextActionComment || "");

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="rounded-xl2 border border-brand-blue/20 bg-brand-blue/5 p-5">
          <h3 className="mb-2 text-sm font-bold text-white">Resumen para Nara</h3>
          <p className="text-sm leading-relaxed text-slate-300">{summary}</p>
        </div>

        <div className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-3 text-sm font-bold text-white">Preparación de visita</h3>
          <dl className="space-y-2 text-sm">
            {primaryPerson && (
              <div className="flex justify-between border-b border-white/5 py-1.5">
                <dt className="text-slate-500">Dueño/contacto</dt>
                <dd className="text-slate-200">{[primaryPerson.firstName, primaryPerson.lastName].filter(Boolean).join(" ")}</dd>
              </div>
            )}
            {primaryPerson?.bestContactTime && (
              <div className="flex justify-between border-b border-white/5 py-1.5">
                <dt className="text-slate-500">Horario recomendado</dt>
                <dd className="text-slate-200">{primaryPerson.bestContactTime}</dd>
              </div>
            )}
            {company.address && (
              <div className="flex justify-between border-b border-white/5 py-1.5">
                <dt className="text-slate-500">Dirección</dt>
                <dd className="text-slate-200">{company.address}</dd>
              </div>
            )}
            {company.instagram && (
              <div className="flex justify-between border-b border-white/5 py-1.5">
                <dt className="text-slate-500">Instagram</dt>
                <dd className="text-slate-200">{company.instagram}</dd>
              </div>
            )}
          </dl>
          {company.mapsUrl && (
            <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer" className="focus-ring mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-cyan">
              <MapPin className="h-3.5 w-3.5" /> Ver en Google Maps
            </a>
          )}
        </div>

        {reasons.length > 0 && (
          <div className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5">
            <h3 className="mb-2 text-sm font-bold text-white">Por qué este score</h3>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {reasons.map((r, i) => (
                <li key={i}>· {r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5">
        <h3 className="mb-3 text-sm font-bold text-white">Próxima acción</h3>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Tipo</label>
            <select value={naType} onChange={(e) => setNaType(e.target.value as any)} className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white">
              {Object.entries(NEXT_ACTION_LABELS).map(([id, label]) => (
                <option key={id} value={id} className="bg-base-900">{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Fecha</label>
            <input type="date" value={naDate} onChange={(e) => setNaDate(e.target.value)} className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Comentario</label>
            <textarea value={naComment} onChange={(e) => setNaComment(e.target.value)} rows={2} className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white" />
          </div>
          <Button onClick={() => onPatch({ nextActionType: naType, nextActionDate: naDate || null, nextActionComment: naComment })} className="w-full">
            Guardar próxima acción
          </Button>
        </div>

        <div className="mt-6">
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Cambiar estado</label>
          <select
            value={company.status}
            onChange={(e) => onPatch({ status: e.target.value })}
            className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
          >
            {PIPELINE_STAGES.map((s) => (
              <option key={s.id} value={s.id} className="bg-base-900">{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function DatosTab({ company, onPatch }: { company: CompanyDetail; onPatch: (u: Record<string, any>) => void }) {
  const [form, setForm] = useState({
    legalName: company.legalName || "",
    address: company.address || "",
    city: company.city || "",
    province: company.province || "",
    mapsUrl: company.mapsUrl || "",
    website: company.website || "",
    instagram: company.instagram || "",
    facebook: company.facebook || "",
    email: company.email || "",
    phone: company.phone || "",
    whatsapp: company.whatsapp || "",
    employeesEstimate: company.employeesEstimate || "",
    branchesCount: company.branchesCount || "",
    notes: company.notes || "",
  });
  const [saving, setSaving] = useState(false);

  const field = (key: keyof typeof form, label: string) => (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-400">{label}</label>
      <input
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
      />
    </div>
  );

  return (
    <div className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {field("legalName", "Razón social")}
        {field("address", "Dirección")}
        {field("city", "Ciudad")}
        {field("province", "Provincia")}
        {field("mapsUrl", "Link de Google Maps")}
        {field("website", "Web")}
        {field("instagram", "Instagram")}
        {field("facebook", "Facebook")}
        {field("email", "Email")}
        {field("phone", "Teléfono")}
        {field("whatsapp", "WhatsApp")}
        {field("employeesEstimate", "Cantidad estimada de empleados")}
        {field("branchesCount", "Cantidad de sucursales")}
      </div>
      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-medium text-slate-400">Observaciones</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          rows={3}
          className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
        />
      </div>
      <Button
        className="mt-4"
        disabled={saving}
        onClick={async () => {
          setSaving(true);
          await onPatch(form);
          setSaving(false);
        }}
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar datos"}
      </Button>
    </div>
  );
}

function ContactosTab({ companyId, people, onChange }: { companyId: string; people: CompanyDetail["people"]; onChange: () => void }) {
  const [adding, setAdding] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState<PersonPosition>("otro");
  const [phone, setPhone] = useState("");
  const [bestContactTime, setBestContactTime] = useState("");
  const [decisionLevel, setDecisionLevel] = useState<DecisionLevel>("usuario");

  const save = async () => {
    await fetch(`/api/admin/companies/${companyId}/people`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, position, phone, bestContactTime, decisionLevel, isPrimary: people.length === 0 }),
    });
    setFirstName("");
    setLastName("");
    setPhone("");
    setBestContactTime("");
    setAdding(false);
    onChange();
  };

  return (
    <div className="space-y-3">
      {people.map((p) => (
        <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div>
            <p className="text-sm font-semibold text-white">
              {[p.firstName, p.lastName].filter(Boolean).join(" ")}
              {p.isPrimary && <span className="ml-2 rounded-full bg-brand-blue/15 px-2 py-0.5 text-[10px] text-brand-cyan">Principal</span>}
            </p>
            <p className="text-xs text-slate-500">{p.position} · {p.phone || "sin teléfono"}</p>
          </div>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            {DECISION_LEVEL_LABELS[p.decisionLevel].icon} {DECISION_LEVEL_LABELS[p.decisionLevel].label}
          </span>
        </div>
      ))}

      {adding ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Nombre" className="focus-ring rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white" />
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Apellido" className="focus-ring rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white" />
            <select value={position} onChange={(e) => setPosition(e.target.value as PersonPosition)} className="focus-ring rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white">
              {PERSON_POSITIONS.map((p) => (
                <option key={p} value={p} className="bg-base-900">{p}</option>
              ))}
            </select>
            <select value={decisionLevel} onChange={(e) => setDecisionLevel(e.target.value as DecisionLevel)} className="focus-ring rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white">
              {Object.entries(DECISION_LEVEL_LABELS).map(([id, meta]) => (
                <option key={id} value={id} className="bg-base-900">{meta.icon} {meta.label}</option>
              ))}
            </select>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Teléfono" className="focus-ring rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white" />
            <input value={bestContactTime} onChange={(e) => setBestContactTime(e.target.value)} placeholder="Horario recomendado" className="focus-ring rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white" />
          </div>
          <div className="mt-3 flex gap-2">
            <Button onClick={save}>Guardar</Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>Cancelar</Button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="focus-ring flex items-center gap-1.5 text-sm font-medium text-brand-cyan">
          <Plus className="h-4 w-4" /> Agregar contacto
        </button>
      )}
    </div>
  );
}

function ProblemasTab({ company, onPatch }: { company: CompanyDetail; onPatch: (u: Record<string, any>) => void }) {
  const catalog = getPainPointsCatalog(company.industry);
  const [selected, setSelected] = useState<string[]>(company.painPoints);

  const toggle = (id: string) => {
    const next = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];
    setSelected(next);
    onPatch({ painPoints: next });
  };

  return (
    <div className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <p className="mb-4 text-sm text-slate-400">Marcá los problemas detectados en {company.name}.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {catalog.map((p) => (
          <button
            key={p.id}
            onClick={() => toggle(p.id)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors",
              selected.includes(p.id) ? "border-brand-blue bg-brand-blue/10 text-white" : "border-white/10 text-slate-400"
            )}
          >
            <span
              className={cn(
                "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border",
                selected.includes(p.id) ? "border-brand-blue bg-brand-blue" : "border-white/20"
              )}
            >
              {selected.includes(p.id) && <CheckCircle2 className="h-3 w-3 text-white" />}
            </span>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TimelineTab({
  activities,
  profiles,
  onAdd,
}: {
  activities: Activity[];
  profiles: Profile[];
  onAdd: (type: Activity["type"], content: string) => void;
}) {
  const [content, setContent] = useState("");
  const [type, setType] = useState<Activity["type"]>("nota");
  const profileName = (id: string | null) => profiles.find((p) => p.id === id)?.fullName || "Alguien";

  return (
    <div>
      <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex flex-wrap gap-2">
          <select value={type} onChange={(e) => setType(e.target.value as Activity["type"])} className="focus-ring rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white">
            {Object.entries(ACTIVITY_TYPE_LABELS).map(([id, label]) => (
              <option key={id} value={id} className="bg-base-900">{label}</option>
            ))}
          </select>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribí lo que pasó..."
            className="focus-ring flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
          />
          <Button
            size="sm"
            onClick={() => {
              if (content.trim()) {
                onAdd(type, content.trim());
                setContent("");
              }
            }}
          >
            Agregar
          </Button>
        </div>
      </div>

      <div className="space-y-3 border-l border-white/10 pl-5">
        {activities.length === 0 && <p className="text-sm text-slate-500">Sin actividad todavía.</p>}
        {activities.map((a) => (
          <div key={a.id} className="relative">
            <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-brand-cyan" />
            <p className="text-xs text-slate-500">
              {new Date(a.createdAt).toLocaleDateString("es-AR")} · {profileName(a.createdBy)} · {ACTIVITY_TYPE_LABELS[a.type]}
            </p>
            <p className="mt-0.5 text-sm text-slate-200">{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
