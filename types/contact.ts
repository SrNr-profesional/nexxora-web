export type ContactStatus =
  | "nuevo"
  | "contactado"
  | "reunion_agendada"
  | "propuesta_enviada"
  | "negociacion"
  | "cliente_cerrado"
  | "no_interesado";

export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  reunion_agendada: "Reunión agendada",
  propuesta_enviada: "Propuesta enviada",
  negociacion: "Negociación",
  cliente_cerrado: "Cliente cerrado",
  no_interesado: "No interesado",
};

export interface DiagnosticFormData {
  // Paso 1
  fullName: string;
  role: string;
  restaurantName: string;
  city: string;
  phone: string;
  email: string;
  instagram?: string;
  branchesCount: string;

  // Paso 2
  dailyOrders: string;
  employeesCount: string;
  businessType: string;
  orderChannels: string[];
  currentSystem: string;

  // Paso 3
  problems: string[];
  mainProblem: string;

  // Paso 4
  desiredFeatures: string[];

  // Paso 5
  urgency: string;
  bestContactTime: string;
  contactPreference: string;
  extraComments?: string;
  acceptsPrivacyPolicy: boolean;

  // meta
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface ContactRecord extends DiagnosticFormData {
  id: string;
  status: ContactStatus;
  internalNotes?: string;
  nextFollowUpDate?: string | null;
  createdAt: string;
}
