import { z } from "zod";

// Un campo que nunca se tocó llega como `undefined`, y ahí zod responde "Required" (en inglés) en lugar
// del mensaje del campo. Estos atajos usan el mismo mensaje también para ese caso.
const str = (message: string) => z.string({ required_error: message, invalid_type_error: message });

/** Texto libre obligatorio, con un mínimo de caracteres. */
const text = (min: number, message: string) => str(message).trim().min(min, message);

/** Una opción elegida de una lista (chips o desplegable). */
const choice = (message = "Seleccioná una opción.") => str(message).min(1, message);

/** Lista con al menos una opción elegida. */
const choices = (message: string) =>
  z.array(z.string(), { required_error: message, invalid_type_error: message }).min(1, message);

export const diagnosticSchema = z.object({
  // Paso 1 - Información del negocio
  fullName: text(3, "Ingresá tu nombre y apellido."),
  role: text(2, "Contanos tu cargo o relación con el negocio."),
  restaurantName: text(2, "Ingresá el nombre del negocio."),
  city: text(2, "Ingresá tu ciudad."),
  phone: text(6, "Ingresá un teléfono válido.").regex(/^[\d\s+()-]+$/, "Ingresá un teléfono válido."),
  email: str("Ingresá un email válido.").trim().email("Ingresá un email válido."),
  instagram: z.string().trim().optional(),
  branchesCount: choice(),

  // Paso 2 - Operación actual
  dailyOrders: choice(),
  employeesCount: choice(),
  businessType: choice("Seleccioná un tipo de negocio."),
  orderChannels: choices("Seleccioná al menos una opción."),
  currentSystem: choice(),

  // Paso 3 - Problemas
  problems: choices("Seleccioná al menos un problema."),
  mainProblem: text(5, "Contanos brevemente cuál es el principal problema."),

  // Paso 4 - Funciones deseadas
  desiredFeatures: choices("Seleccioná al menos una función."),

  // Paso 5 - Prioridad y contacto
  urgency: choice(),
  bestContactTime: text(2, "Indicá un horario aproximado."),
  contactPreference: choice(),
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
