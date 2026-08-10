import type {
  ActivityType,
  CompanyStatus,
  DecisionLevel,
  GoalMetric,
  Industry,
  NextActionType,
  PersonPosition,
  Priority,
  ProposalStatus,
  TaskStatus,
} from "./types";

export const INDUSTRIES: { id: Industry; label: string; icon: string }[] = [
  { id: "gastronomia", label: "Gastronomía", icon: "🍽" },
  { id: "logistica", label: "Transporte / Logística", icon: "🚚" },
  { id: "retail", label: "Retail", icon: "🛍" },
  { id: "hoteleria", label: "Hotelería", icon: "🏨" },
  { id: "inmobiliaria", label: "Inmobiliarias", icon: "🏠" },
  { id: "distribuidora", label: "Distribuidoras", icon: "📦" },
  { id: "otro", label: "Otro", icon: "✦" },
];

export const INDUSTRY_LABELS: Record<Industry, string> = Object.fromEntries(
  INDUSTRIES.map((i) => [i.id, i.label])
) as Record<Industry, string>;

// Orden real del pipeline — se usa tanto en el Kanban como en filtros/ordenamientos.
export const PIPELINE_STAGES: { id: CompanyStatus; label: string }[] = [
  { id: "nuevo", label: "Nuevo" },
  { id: "contactar", label: "Contactar" },
  { id: "contactado", label: "Contactado" },
  { id: "visita_agendada", label: "Visita agendada" },
  { id: "visitado", label: "Visitado" },
  { id: "interesado", label: "Interesado" },
  { id: "demo", label: "Demo" },
  { id: "propuesta", label: "Propuesta" },
  { id: "negociacion", label: "Negociación" },
  { id: "cliente", label: "Cliente" },
  { id: "perdido", label: "Perdido" },
];

export const COMPANY_STATUS_LABELS: Record<CompanyStatus, string> = Object.fromEntries(
  PIPELINE_STAGES.map((s) => [s.id, s.label])
) as Record<CompanyStatus, string>;

// Estados que cuentan como "prospecto activo" para las reglas de próxima
// acción obligatoria y para las métricas del embudo.
export const ACTIVE_STATUSES: CompanyStatus[] = [
  "nuevo",
  "contactar",
  "contactado",
  "visita_agendada",
  "visitado",
  "interesado",
  "demo",
  "propuesta",
  "negociacion",
];

export const PRIORITY_LABELS: Record<Priority, string> = {
  A: "Alta",
  B: "Media",
  C: "Baja",
};

export const PRIORITY_ICON: Record<Priority, string> = {
  A: "🔥",
  B: "🟡",
  C: "⚪",
};

export const NEXT_ACTION_LABELS: Record<NextActionType, string> = {
  llamar: "Llamar",
  whatsapp: "WhatsApp",
  visitar: "Visitar",
  reunion: "Reunión",
  demo: "Demo",
  enviar_propuesta: "Enviar propuesta",
  follow_up: "Follow-up",
  cobrar: "Cobrar",
  implementar: "Implementar",
  otro: "Otro",
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  nota: "Nota",
  llamada: "Llamada",
  whatsapp: "WhatsApp",
  visita: "Visita",
  reunion: "Reunión",
  demo: "Demo",
  cambio_estado: "Cambio de estado",
  propuesta_enviada: "Propuesta enviada",
  cierre: "Cierre",
  tarea_completada: "Tarea completada",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pendiente: "Pendiente",
  en_progreso: "En progreso",
  completada: "Completada",
  cancelada: "Cancelada",
};

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  borrador: "Borrador",
  enviada: "Enviada",
  vista: "Vista",
  negociacion: "Negociación",
  aceptada: "Aceptada",
  rechazada: "Rechazada",
};

export const DECISION_LEVEL_LABELS: Record<DecisionLevel, { label: string; icon: string }> = {
  decide: { label: "Decide", icon: "🟢" },
  influye: { label: "Influye", icon: "🟡" },
  usuario: { label: "Usuario", icon: "⚪" },
  no_decide: { label: "No decide", icon: "🔴" },
};

export const PERSON_POSITIONS: PersonPosition[] = ["dueño", "socio", "encargado", "administrador", "otro"];

export const GOAL_METRIC_LABELS: Record<GoalMetric, string> = {
  clientes: "Clientes",
  mrr: "MRR",
  visitas: "Visitas",
  demos: "Demos",
  propuestas: "Propuestas",
  prospectos: "Prospectos",
  contactos: "Contactos",
  duenos_contactados: "Dueños contactados",
};

// Catálogo de problemas/dolores por industria — checklist configurable (punto 13).
export const PAIN_POINTS_BY_INDUSTRY: Record<string, { id: string; label: string }[]> = {
  gastronomia: [
    { id: "pedidos_desorganizados", label: "Pedidos desorganizados" },
    { id: "whatsapp_separado", label: "WhatsApp separado" },
    { id: "pedidos_salon_separados", label: "Pedidos de salón separados" },
    { id: "pedidos_delivery_separados", label: "Pedidos de delivery separados" },
    { id: "errores_cocina", label: "Errores de cocina" },
    { id: "comandas_manuales", label: "Comandas manuales" },
    { id: "stock_manual", label: "Stock manual" },
    { id: "falta_control_stock", label: "Falta control de stock" },
    { id: "falta_metricas", label: "Falta métricas" },
    { id: "falta_menu_qr", label: "Falta menú QR" },
    { id: "falta_trazabilidad", label: "Falta trazabilidad" },
    { id: "demoras", label: "Demoras" },
    { id: "problemas_caja_cocina", label: "Problemas caja/cocina" },
    { id: "sin_panel_administrativo", label: "Sin panel administrativo" },
    { id: "otro", label: "Otro" },
  ],
  logistica: [
    { id: "planificacion_manual", label: "Planificación manual" },
    { id: "rutas_manuales", label: "Rutas manuales" },
    { id: "facturacion_manual", label: "Facturación manual" },
    { id: "pedidos_desorganizados", label: "Pedidos desorganizados" },
    { id: "control_choferes", label: "Control de choferes" },
    { id: "control_entregas", label: "Control de entregas" },
    { id: "falta_trazabilidad", label: "Falta trazabilidad" },
    { id: "comprobantes", label: "Comprobantes" },
    { id: "stock", label: "Stock" },
    { id: "carga_camiones", label: "Carga de camiones" },
    { id: "administracion_repetitiva", label: "Administración repetitiva" },
    { id: "errores_facturacion", label: "Errores de facturación" },
    { id: "falta_metricas", label: "Falta métricas" },
    { id: "otro", label: "Otro" },
  ],
};

export function getPainPointsCatalog(industry: string) {
  return PAIN_POINTS_BY_INDUSTRY[industry] ?? PAIN_POINTS_BY_INDUSTRY.gastronomia;
}

export function painPointLabel(industry: string, id: string) {
  const all = [...PAIN_POINTS_BY_INDUSTRY.gastronomia, ...PAIN_POINTS_BY_INDUSTRY.logistica];
  return all.find((p) => p.id === id)?.label ?? id;
}

// Catálogo de funcionalidades que se pueden pedir (punto 30).
export const FEATURE_CATALOG: string[] = [
  "Integración WhatsApp",
  "Facturación",
  "Mercado Pago",
  "PedidosYa",
  "Rappi",
  "Impresora de cocina",
  "Multi-sucursal",
  "Gestión de empleados",
  "Proveedores",
  "Rutas",
  "GPS",
  "Otro",
];

// Plantilla de checklist de implementación al convertir un prospecto en cliente (punto 27).
export const IMPLEMENTATION_TEMPLATE: string[] = [
  "Datos recibidos",
  "Logo",
  "Menú / Catálogo",
  "Productos",
  "Precios",
  "Categorías",
  "Stock inicial",
  "Usuarios",
  "Configuración del sistema",
  "QR",
  "Pruebas",
  "Capacitación",
  "Sistema activo",
  "Seguimiento a 7 días",
];

export const TASK_TYPES_ICON: Record<NextActionType, string> = {
  llamar: "📞",
  whatsapp: "💬",
  visitar: "🚗",
  reunion: "🤝",
  demo: "🖥",
  enviar_propuesta: "📄",
  follow_up: "🔁",
  cobrar: "💰",
  implementar: "🚀",
  otro: "•",
};
