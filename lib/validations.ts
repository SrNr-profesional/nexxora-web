import { z } from "zod";

export const diagnosticSchema = z.object({
  // Paso 1 - Información del negocio
  fullName: z.string().trim().min(3, "Ingresá tu nombre y apellido."),
  role: z.string().trim().min(2, "Contanos tu cargo o relación con el restaurante."),
  restaurantName: z.string().trim().min(2, "Ingresá el nombre del restaurante."),
  city: z.string().trim().min(2, "Ingresá tu ciudad."),
  phone: z
    .string()
    .trim()
    .min(6, "Ingresá un teléfono válido.")
    .regex(/^[\d\s+()-]+$/, "Ingresá un teléfono válido."),
  email: z.string().trim().email("Ingresá un email válido."),
  instagram: z.string().trim().optional(),
  branchesCount: z.string().min(1, "Seleccioná una opción."),

  // Paso 2 - Operación actual
  dailyOrders: z.string().min(1, "Seleccioná una opción."),
  employeesCount: z.string().min(1, "Seleccioná una opción."),
  businessType: z.string().min(1, "Seleccioná un tipo de negocio."),
  orderChannels: z.array(z.string()).min(1, "Seleccioná al menos una opción."),
  currentSystem: z.string().min(1, "Seleccioná una opción."),

  // Paso 3 - Problemas
  problems: z.array(z.string()).min(1, "Seleccioná al menos un problema."),
  mainProblem: z.string().trim().min(5, "Contanos brevemente cuál es el principal problema."),

  // Paso 4 - Funciones deseadas
  desiredFeatures: z.array(z.string()).min(1, "Seleccioná al menos una función."),

  // Paso 5 - Prioridad y contacto
  urgency: z.string().min(1, "Seleccioná una opción."),
  bestContactTime: z.string().trim().min(2, "Indicá un horario aproximado."),
  contactPreference: z.string().min(1, "Seleccioná una opción."),
  extraComments: z.string().trim().optional(),
  acceptsPrivacyPolicy: z.literal(true, {
    errorMap: () => ({ message: "Debés aceptar la política de privacidad para continuar." }),
  }),

  // Metadata (no visible en el formulario)
  source: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  // Honeypot antispam
  website: z.string().max(0, "Campo inválido.").optional(),
});

export type DiagnosticSchema = z.infer<typeof diagnosticSchema>;

export const STEP_FIELDS: Record<number, (keyof DiagnosticSchema)[]> = {
  1: ["fullName", "role", "restaurantName", "city", "phone", "email", "branchesCount"],
  2: ["dailyOrders", "employeesCount", "businessType", "orderChannels", "currentSystem"],
  3: ["problems", "mainProblem"],
  4: ["desiredFeatures"],
  5: ["urgency", "bestContactTime", "contactPreference", "acceptsPrivacyPolicy"],
};

export const BUSINESS_TYPES = [
  "Restaurante",
  "Hamburguesería",
  "Pizzería",
  "Cafetería",
  "Bar",
  "Sushi",
  "Comida rápida",
  "Rotisería",
  "Otro",
];

export const ORDER_CHANNELS = [
  "Mozos",
  "Caja",
  "WhatsApp",
  "Teléfono",
  "Página web",
  "PedidosYa",
  "Rappi",
  "Mostrador",
  "Otro",
];

export const CURRENT_SYSTEMS = [
  "Ninguno",
  "Papel y anotaciones",
  "Planillas",
  "Software gastronómico",
  "Sistema propio",
  "Otro",
];

export const PROBLEM_OPTIONS = [
  "Pedidos incorrectos",
  "Pedidos perdidos",
  "Demoras en cocina",
  "Falta de organización",
  "Control de stock",
  "Control de caja",
  "Actualización del menú",
  "Pedidos por WhatsApp",
  "Delivery",
  "Estadísticas de ventas",
  "Gestión de empleados",
  "Fidelización de clientes",
  "Control de varias sucursales",
  "Otro",
];

export const FEATURE_OPTIONS = [
  "Menú digital con QR",
  "Pedidos online",
  "Pantalla de cocina",
  "Código para retirar pedidos",
  "Control de stock",
  "Panel administrativo",
  "Estadísticas",
  "Caja",
  "Delivery",
  "Programa de puntos",
  "Base de clientes",
  "Gestión de empleados",
  "Automatizaciones",
  "Inteligencia artificial",
  "Integración con WhatsApp",
  "Sistema para varias sucursales",
  "No estoy seguro, necesito asesoramiento",
];

export const URGENCY_OPTIONS = [
  "Lo antes posible",
  "Durante este mes",
  "En los próximos tres meses",
  "Solo estoy averiguando",
];

export const CONTACT_PREFERENCE_OPTIONS = ["WhatsApp", "Llamada", "Email", "Reunión presencial"];

export const BRANCHES_OPTIONS = ["1", "2 a 3", "4 a 10", "Más de 10"];
export const DAILY_ORDERS_OPTIONS = ["Menos de 30", "30 a 80", "80 a 150", "Más de 150"];
export const EMPLOYEES_OPTIONS = ["1 a 5", "6 a 15", "16 a 30", "Más de 30"];
