// Tipos del CRM interno de Nexxora. Reflejan 1:1 el esquema de
// supabase/migration_crm.sql — cualquier cambio ahí debe reflejarse acá.

export type Industry =
  | "gastronomia"
  | "logistica"
  | "retail"
  | "hoteleria"
  | "inmobiliaria"
  | "distribuidora"
  | "otro";

export type CompanyStatus =
  | "nuevo"
  | "contactar"
  | "contactado"
  | "visita_agendada"
  | "visitado"
  | "interesado"
  | "demo"
  | "propuesta"
  | "negociacion"
  | "cliente"
  | "perdido";

export type Priority = "A" | "B" | "C";

export type NextActionType =
  | "llamar"
  | "whatsapp"
  | "visitar"
  | "reunion"
  | "demo"
  | "enviar_propuesta"
  | "follow_up"
  | "cobrar"
  | "implementar"
  | "otro";

export type ActivityType =
  | "nota"
  | "llamada"
  | "whatsapp"
  | "visita"
  | "reunion"
  | "demo"
  | "cambio_estado"
  | "propuesta_enviada"
  | "cierre"
  | "tarea_completada";

export type TaskStatus = "pendiente" | "en_progreso" | "completada" | "cancelada";

export type ProposalStatus = "borrador" | "enviada" | "vista" | "negociacion" | "aceptada" | "rechazada";

export type DecisionLevel = "decide" | "influye" | "usuario" | "no_decide";

export type PersonPosition = "dueño" | "socio" | "encargado" | "administrador" | "otro";

export type GoalMetric =
  | "clientes"
  | "mrr"
  | "visitas"
  | "demos"
  | "propuestas"
  | "prospectos"
  | "contactos"
  | "duenos_contactados";

export type ProfileRole = "socio" | "vendedor" | "sdr" | "soporte" | "developer" | "admin";

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  avatarColor: string;
  role: ProfileRole;
  createdAt: string;
}

export interface Company {
  id: string;
  createdAt: string;
  updatedAt: string;

  name: string;
  legalName: string | null;
  industry: Industry;
  subcategory: string | null;

  address: string | null;
  city: string | null;
  province: string | null;
  mapsUrl: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;

  employeesEstimate: string | null;
  branchesCount: string | null;
  sizeEstimate: string | null;
  notes: string | null;

  status: CompanyStatus;
  priority: Priority;

  painPoints: string[];

  score: number;
  probability: number;

  mrrPotential: number;
  mrrActual: number;
  setupFeeActual: number;

  nextActionType: NextActionType | null;
  nextActionDate: string | null;
  nextActionTime: string | null;
  nextActionComment: string | null;
  nextActionAssignedTo: string | null;

  lostReasonId: string | null;
  lostComment: string | null;

  source: string | null;
  sourceContactId: string | null;

  assignedTo: string | null;
  createdBy: string | null;

  clientSince: string | null;
  nextRenewalDate: string | null;

  archived: boolean;
  isDemo: boolean;
}

export interface Person {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string | null;
  position: PersonPosition;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  bestContactTime: string | null;
  decisionLevel: DecisionLevel;
  isPrimary: boolean;
  createdAt: string;
}

export interface Activity {
  id: string;
  companyId: string;
  type: ActivityType;
  content: string;
  metadata: Record<string, unknown>;
  createdBy: string | null;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  companyId: string | null;
  assignedTo: string | null;
  createdBy: string | null;
  priority: Priority;
  dueDate: string | null;
  dueTime: string | null;
  status: TaskStatus;
  createdAt: string;
  completedAt: string | null;
}

export interface Proposal {
  id: string;
  companyId: string;
  planName: string;
  setupFee: number;
  monthlyFee: number;
  currency: string;
  services: string[];
  sentDate: string | null;
  expiryDate: string | null;
  assignedTo: string | null;
  status: ProposalStatus;
  createdAt: string;
}

export interface Goal {
  id: string;
  profileId: string | null;
  periodMonth: string;
  metric: GoalMetric;
  target: number;
  createdAt: string;
}

export interface ImplementationItem {
  id: string;
  companyId: string;
  label: string;
  done: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface FeatureRequest {
  id: string;
  companyId: string | null;
  feature: string;
  createdAt: string;
}

export interface LostReason {
  id: string;
  label: string;
  sortOrder: number;
}

export interface AppNotification {
  id: string;
  profileId: string;
  type: string;
  content: string;
  relatedCompanyId: string | null;
  read: boolean;
  createdAt: string;
}

// Company enriquecida con relaciones, tal como la devuelve GET /api/admin/companies/[id]
export interface CompanyDetail extends Company {
  people: Person[];
  activities: Activity[];
  proposals: Proposal[];
  implementationItems: ImplementationItem[];
}
