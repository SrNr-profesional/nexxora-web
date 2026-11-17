/**
 * Planes comerciales. El orden es de menor a mayor inversión y el último
 * (Visión IA con cámaras) es el plan premium.
 *
 * PRECIOS: `price` está en null a propósito, así la web muestra "A medida".
 * Cuando definan valores, completar acá (ej: "Desde USD 1.500") y aparecen
 * solos en la sección de planes.
 */
export interface Plan {
  id: "digital" | "conectado" | "ia" | "vision";
  name: string;
  tagline: string;
  /** 1 a 4: se dibuja como barras de nivel de inversión. */
  level: 1 | 2 | 3 | 4;
  price: string | null;
  features: string[];
  highlight?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "digital",
    name: "Digitalización",
    tagline: "El primer paso: sacar un proceso del papel.",
    level: 1,
    price: null,
    features: [
      "Un proceso clave digitalizado",
      "Panel básico desde el celular",
      "Capacitación del equipo",
      "Soporte por WhatsApp",
    ],
  },
  {
    id: "conectado",
    name: "Operación conectada",
    tagline: "Todas las áreas trabajando sobre la misma información.",
    level: 2,
    price: null,
    features: [
      "Varios módulos integrados entre sí",
      "Panel administrativo con reportes",
      "Usuarios y permisos por rol",
      "Varias sucursales o sedes",
      "Acompañamiento en la puesta en marcha",
    ],
  },
  {
    id: "ia",
    name: "Automatización con IA",
    tagline: "El sistema deja de registrar y empieza a decidir.",
    level: 3,
    price: null,
    features: [
      "Todo lo de Operación conectada",
      "Asistente de IA por WhatsApp",
      "Predicciones y alertas automáticas",
      "Lectura automática de documentos",
      "Integración con tus sistemas actuales",
    ],
  },
  {
    id: "vision",
    name: "Visión IA con cámaras",
    tagline: "Tus cámaras dejan de grabar y empiezan a avisar.",
    level: 4,
    price: null,
    highlight: true,
    features: [
      "Todo lo de Automatización con IA",
      "Análisis de video en tiempo real, las 24 horas",
      "Detecciones entrenadas para tu operación",
      "Alertas con imagen al celular y al panel",
      "Reportes y evidencia de cada evento",
      "Uso de cámaras existentes cuando son compatibles",
      "Soporte prioritario y ajustes continuos",
    ],
  },
];
