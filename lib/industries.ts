import {
  type LucideIcon,
  Activity,
  BadgeCheck,
  BarChart3,
  BedDouble,
  BellRing,
  Bot,
  Boxes,
  BrainCircuit,
  Building2,
  CalendarCheck,
  Camera,
  CarFront,
  Cctv,
  ChartNoAxesCombined,
  ChefHat,
  ClipboardCheck,
  ClipboardList,
  ClipboardX,
  Clock,
  ConciergeBell,
  Construction,
  DoorOpen,
  Droplets,
  Eye,
  Factory,
  FileCheck2,
  FileText,
  Flame,
  Forklift,
  Fuel,
  Gauge,
  Grape,
  HardHat,
  HeartPulse,
  Hotel,
  IdCard,
  KeyRound,
  ListX,
  MapPinned,
  MessageSquareText,
  MessagesSquare,
  Monitor,
  Package,
  PackageCheck,
  PackageSearch,
  PackageX,
  Pickaxe,
  QrCode,
  Receipt,
  Route,
  ScanBarcode,
  ScanEye,
  ScanFace,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Siren,
  Smartphone,
  Sparkles,
  Sprout,
  Stethoscope,
  Store,
  Tag,
  Tags,
  ThermometerSnowflake,
  Timer,
  TrendingUp,
  Truck,
  Users,
  UsersRound,
  UtensilsCrossed,
  Warehouse,
  Wine,
  Workflow,
  Wrench,
} from "lucide-react";

/**
 * Fuente única de contenido por rubro. Toda la landing (hero, problemas,
 * soluciones, Visión IA, comparación, beneficios y formulario) lee de acá.
 *
 * Para sumar un rubro nuevo: agregar su id a IndustryId y un objeto a
 * INDUSTRIES. No hace falta tocar ningún componente.
 */

export type IndustryId =
  | "gastronomia"
  | "logistica"
  | "retail"
  | "industria"
  | "construccion"
  | "agro"
  | "salud"
  | "seguridad"
  | "hoteleria"
  | "mineria";

/** base = digitalización · ia = automatización con IA · vision = IA con cámaras (premium) */
export type ServiceTier = "base" | "ia" | "vision";

export type Tone = "ok" | "warn" | "alert";

export interface IndustryProblem {
  icon: LucideIcon;
  title: string;
  consequence: string;
  before: string[];
  after: string[];
}

export interface IndustryService {
  icon: LucideIcon;
  title: string;
  text: string;
  tier: ServiceTier;
}

export interface Industry {
  id: IndustryId;
  label: string;
  icon: LucideIcon;
  /** "tu restaurante", "tu flota"… se usa dentro de frases. */
  noun: string;
  /** "cada restaurante", "cada empresa de transporte"… */
  each: string;
  hero: { eyebrow: string; title: string; highlight: string; text: string };
  /** 5 nodos del flujo animado del hero. */
  flow: { icon: LucideIcon; label: string; status: string }[];
  /** 5 eslabones de la cadena "todo conectado". */
  chain: string[];
  problemsTitle: string;
  problems: IndustryProblem[];
  solutionsTitle: string;
  solutionsText: string;
  services: IndustryService[];
  vision: {
    zone: string;
    detections: { label: string; tone: Tone }[];
    events: { text: string; tone: Tone }[];
  };
  comparison: { before: string[]; after: string[] };
  benefits: string[];
  form: {
    nameLabel: string;
    namePlaceholder: string;
    volumeLabel: string;
    volumeOptions: string[];
    channelsLabel: string;
    channels: string[];
    subtypes: string[];
    currentSystems: string[];
    mainProblemPlaceholder: string;
  };
}

const GENERIC_SYSTEMS = ["Ninguno", "Papel y anotaciones", "Planillas de Excel", "Software del rubro", "Sistema propio", "Otro"];

export const INDUSTRIES: Industry[] = [
  /* ------------------------------------------------------------------ */
  {
    id: "gastronomia",
    label: "Gastronomía",
    icon: UtensilsCrossed,
    noun: "tu restaurante",
    each: "cada restaurante",
    hero: {
      eyebrow: "Automatización gastronómica inteligente",
      title: "Menos errores. Más control.",
      highlight: "Un restaurante más eficiente.",
      text: "Conectamos pedidos, cocina, stock, ventas y administración en un sistema diseñado alrededor de tu operación.",
    },
    flow: [
      { icon: Smartphone, label: "Cliente", status: "Pedido #128 enviado" },
      { icon: ClipboardCheck, label: "Pedido", status: "Confirmado" },
      { icon: ChefHat, label: "Cocina", status: "En preparación" },
      { icon: Package, label: "Stock", status: "-1 pan · -2 medallones" },
      { icon: BarChart3, label: "Administración", status: "Venta registrada" },
    ],
    chain: ["Pedidos", "Cocina", "Stock", "Ventas", "Clientes"],
    problemsTitle: "¿Estos problemas ocurren en tu restaurante?",
    problems: [
      {
        icon: ClipboardX,
        title: "Pedidos incorrectos",
        consequence: "Un error en la nota significa rehacer el plato y un cliente esperando de más.",
        before: ["Nota escrita a mano", "Modificación mal interpretada", "Pedido rehecho", "Cliente esperando"],
        after: ["Pedido estructurado", "Modificaciones registradas", "Cocina recibe información exacta", "Número y estado visibles"],
      },
      {
        icon: Clock,
        title: "Demoras entre salón y cocina",
        consequence: "Cada viaje entre el salón y la cocina suma minutos que el cliente sí nota.",
        before: ["Mozo anota en papel", "Camina hasta la cocina", "Cocina interpreta la letra", "El pedido arranca tarde"],
        after: ["El pedido se envía al instante", "Cocina lo recibe en pantalla", "Se prioriza automáticamente", "Arranca sin demoras"],
      },
      {
        icon: ListX,
        title: "Pedidos perdidos o duplicados",
        consequence: "Sin un registro único, un pedido puede cobrarse dos veces o no llegar nunca.",
        before: ["Comandas sueltas", "Pedidos que se traspapelan", "Se cobra dos veces o no se cobra", "Nadie sabe qué pasó"],
        after: ["Cada pedido con número único", "Estado visible para todo el equipo", "Historial completo y trazable", "Nada se pierde"],
      },
      {
        icon: PackageSearch,
        title: "Falta de control de stock",
        consequence: "Sin datos reales, te enterás que falta un insumo cuando ya es tarde.",
        before: ["Stock calculado a ojo", "Planillas desactualizadas", "Sorpresas a mitad de servicio", "Compras de urgencia"],
        after: ["Se descuenta con cada venta", "Alertas antes de quedarte sin insumos", "Historial de consumo real", "Compras planificadas"],
      },
      {
        icon: PackageX,
        title: "Productos agotados que siguen disponibles",
        consequence: "Vender algo que no tenés genera un pedido que después hay que cancelar.",
        before: ["El menú sigue mostrando el producto", "El cliente lo pide igual", "Hay que cancelarlo después", "Mala experiencia"],
        after: ["Se marca agotado automáticamente", "El cliente no puede pedirlo", "Se reactiva solo al reponer stock", "Cero cancelaciones por error"],
      },
      {
        icon: MessagesSquare,
        title: "Exceso de mensajes por WhatsApp",
        consequence: "Un chat saturado hace que un pedido se mezcle con una simple consulta.",
        before: ["Decenas de chats simultáneos", "Pedidos mezclados con consultas", "Fácil perder un mensaje", "Respuestas tardías"],
        after: ["El cliente pide desde un link propio", "El pedido llega ordenado al sistema", "WhatsApp queda libre para consultas", "Nada se mezcla"],
      },
      {
        icon: Tag,
        title: "Dificultad para actualizar precios",
        consequence: "Cada aumento de precio implica reimprimir cartas y avisar a todo el equipo.",
        before: ["Reimprimir el menú", "Avisar a todo el equipo", "Demora entre el cambio y su aplicación", "Errores de cobro"],
        after: ["Editás el precio en segundos", "Se actualiza en todos los canales", "Sin reimprimir nada", "Sin errores de cobro"],
      },
      {
        icon: BarChart3,
        title: "Falta de estadísticas de ventas",
        consequence: "Sin datos claros, es difícil saber qué producto realmente te conviene vender.",
        before: ["Decisiones a intuición", "Cierre de caja manual", "No sabés qué producto conviene", "Datos dispersos"],
        after: ["Panel con ventas en tiempo real", "Producto más vendido a la vista", "Reportes automáticos", "Decisiones con datos reales"],
      },
    ],
    solutionsTitle: "Un sistema diseñado alrededor de tu restaurante",
    solutionsText: "",
    services: [
      { icon: QrCode, title: "Menú digital con QR", text: "Carta editable en segundos, con fotos, variantes y productos agotados que se ocultan solos.", tier: "base" },
      { icon: ShoppingCart, title: "Pedidos online propios", text: "Tu canal de venta sin comisiones de terceros, conectado a cocina y caja.", tier: "base" },
      { icon: Monitor, title: "Pantalla de cocina", text: "Las comandas llegan ordenadas y priorizadas, sin papel ni gritos.", tier: "base" },
      { icon: Package, title: "Control de stock por receta", text: "Cada venta descuenta insumos y te avisa antes de quedarte sin nada.", tier: "base" },
      { icon: ChartNoAxesCombined, title: "Panel administrativo", text: "Ventas, ticket promedio y productos más rentables en tiempo real.", tier: "base" },
      { icon: Bot, title: "Asistente IA por WhatsApp", text: "Responde consultas, toma reservas y pedidos las 24 horas.", tier: "ia" },
      { icon: TrendingUp, title: "Predicción de demanda", text: "Anticipa cuánto vas a vender para comprar y producir lo justo.", tier: "ia" },
      { icon: ScanEye, title: "Control de emplatado y porciones", text: "Una cámara sobre el pase verifica que cada plato salga completo y con la porción correcta.", tier: "vision" },
      { icon: ShieldCheck, title: "Higiene y BPM en cocina", text: "Detecta cofia, guantes y delantal, y deja registro para auditorías bromatológicas.", tier: "vision" },
      { icon: UsersRound, title: "Ocupación de mesas y espera", text: "Sabé cuántas mesas están ocupadas, cuánto esperan y cuándo se libera cada una.", tier: "vision" },
      { icon: Eye, title: "Control de caja y mostrador", text: "Cruza lo que ve la cámara con lo que se cobra para detectar ventas sin registrar.", tier: "vision" },
    ],
    vision: {
      zone: "Cocina · pase",
      detections: [
        { label: "Plato completo", tone: "ok" },
        { label: "Sin cofia", tone: "alert" },
        { label: "Mesa 7 · 18 min", tone: "warn" },
      ],
      events: [
        { text: "Pedido #128 emplatado correctamente", tone: "ok" },
        { text: "Mesa 7 lleva 18 min sin atención", tone: "warn" },
        { text: "Personal sin cofia en línea caliente", tone: "alert" },
        { text: "Hora pico detectada: 42 personas en salón", tone: "ok" },
      ],
    },
    comparison: {
      before: [
        "Pedidos por varios canales",
        "Información escrita manualmente",
        "Stock estimado",
        "Precios difíciles de actualizar",
        "Datos separados",
        "El dueño depende de estar presente",
      ],
      after: [
        "Pedidos centralizados",
        "Información directa a cocina",
        "Stock actualizado",
        "Menú editable",
        "Ventas y estadísticas en un panel",
        "Acceso desde dispositivos autorizados",
      ],
    },
    benefits: [
      "Menos errores en los pedidos.",
      "Mayor rapidez entre caja y cocina.",
      "Más control sobre el stock.",
      "Mayor facilidad para actualizar precios.",
      "Mejor experiencia para el cliente.",
      "Información del negocio desde el celular.",
    ],
    form: {
      nameLabel: "Nombre del restaurante",
      namePlaceholder: "Ej: Distrito Burger",
      volumeLabel: "Cantidad aproximada de pedidos por día",
      volumeOptions: ["Menos de 30", "30 a 80", "80 a 150", "Más de 150"],
      channelsLabel: "¿Cómo reciben los pedidos actualmente?",
      channels: ["Mozos", "Caja", "WhatsApp", "Teléfono", "Página web", "PedidosYa", "Rappi", "Mostrador", "Otro"],
      subtypes: ["Restaurante", "Hamburguesería", "Pizzería", "Cafetería", "Bar", "Sushi", "Comida rápida", "Rotisería", "Otro"],
      currentSystems: ["Ninguno", "Papel y anotaciones", "Planillas", "Software gastronómico", "Sistema propio", "Otro"],
      mainProblemPlaceholder: "Ej: Perdemos pedidos entre el salón y la cocina...",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    id: "logistica",
    label: "Logística y transporte",
    icon: Truck,
    noun: "tu operación logística",
    each: "cada empresa de transporte",
    hero: {
      eyebrow: "Logística y transporte conectados",
      title: "Cada viaje bajo control.",
      highlight: "Cada entrega, comprobada.",
      text: "Unimos flota, depósito, choferes y clientes en un solo sistema: sabés dónde está cada carga, qué se entregó y cuánto costó cada kilómetro.",
    },
    flow: [
      { icon: ClipboardList, label: "Orden", status: "Viaje #5120 asignado" },
      { icon: Warehouse, label: "Depósito", status: "24 bultos cargados" },
      { icon: Truck, label: "En ruta", status: "A 12 km del destino" },
      { icon: FileCheck2, label: "Entrega", status: "Remito firmado" },
      { icon: Receipt, label: "Facturación", status: "Viaje liquidado" },
    ],
    chain: ["Órdenes", "Depósito", "Flota", "Entregas", "Facturación"],
    problemsTitle: "¿Estos problemas frenan tu operación logística?",
    problems: [
      {
        icon: MapPinned,
        title: "No sabés dónde está cada unidad",
        consequence: "El cliente llama a preguntar y nadie tiene una respuesta cierta.",
        before: ["Llamadas al chofer en ruta", "Horarios estimados a ojo", "Cliente sin información", "Desvíos que nadie ve"],
        after: ["Flota en un mapa en vivo", "Hora de llegada calculada", "Link de seguimiento para el cliente", "Alertas ante desvíos y paradas"],
      },
      {
        icon: FileText,
        title: "Remitos que se pierden o vuelven tarde",
        consequence: "Sin el remito conformado no podés facturar, y la plata queda parada.",
        before: ["Papel que viaja en la cabina", "Firmas ilegibles", "Remitos que vuelven a la semana", "Facturación demorada"],
        after: ["Remito digital en el celular", "Firma, foto y ubicación de la entrega", "Disponible al instante en oficina", "Facturás el mismo día"],
      },
      {
        icon: Timer,
        title: "Tiempos muertos en carga y descarga",
        consequence: "Un camión esperando en dársena es un viaje menos al final del día.",
        before: ["Turnos de dársena por teléfono", "Camiones haciendo fila", "Nadie mide cuánto se espera", "Horas extra sin explicación"],
        after: ["Turnos de dársena programados", "Tiempo de espera medido por unidad", "Cámaras que cuentan bultos al cargar", "Cuellos de botella a la vista"],
      },
      {
        icon: Fuel,
        title: "Combustible y mantenimiento sin control",
        consequence: "Los dos mayores costos de la flota se manejan con tickets y memoria.",
        before: ["Tickets de carga sueltos", "Service cuando se rompe", "Vencimientos que se pasan", "Costo por km desconocido"],
        after: ["Consumo por unidad y por chofer", "Mantenimiento preventivo programado", "Alertas de VTV, seguro y licencias", "Costo real por kilómetro"],
      },
    ],
    solutionsTitle: "Un sistema diseñado alrededor de tu flota y tu depósito",
    solutionsText:
      "Desde el pedido hasta la factura: cada viaje queda registrado, medido y comprobado. Elegís solo los módulos que tu operación necesita.",
    services: [
      { icon: MapPinned, title: "Seguimiento de flota en vivo", text: "Todas las unidades en un mapa, con hora estimada de llegada y link de tracking para tu cliente.", tier: "base" },
      { icon: FileCheck2, title: "Remito y prueba de entrega digital", text: "Firma, foto y geolocalización desde el celular del chofer. Sin papel que vuelva tarde.", tier: "base" },
      { icon: Wrench, title: "Mantenimiento y vencimientos", text: "Service preventivo por km u horas y alertas de VTV, seguros, RUTA y licencias.", tier: "base" },
      { icon: Warehouse, title: "Gestión de depósito", text: "Ubicaciones, picking y stock por cliente con lectura de códigos.", tier: "base" },
      { icon: Route, title: "Ruteo y asignación automática", text: "La IA arma los recorridos y asigna cada viaje a la unidad más conveniente.", tier: "ia" },
      { icon: Fuel, title: "Control de combustible", text: "Cruza cargas, kilómetros y rutas para detectar consumos fuera de lo normal.", tier: "ia" },
      { icon: Receipt, title: "Liquidación automática de fleteros", text: "Calcula cada viaje con tus tarifas y genera la liquidación sin planillas.", tier: "ia" },
      { icon: ScanLine, title: "Lectura de patentes en accesos", text: "La cámara reconoce cada patente, registra ingreso y egreso y abre la barrera a unidades autorizadas.", tier: "vision" },
      { icon: Boxes, title: "Conteo de bultos y pallets en dársena", text: "Cuenta lo que sube y baja de cada camión y lo compara contra el remito.", tier: "vision" },
      { icon: ScanFace, title: "Fatiga y distracción en cabina", text: "Detecta microsueños, uso de celular y falta de cinturón, y avisa en el momento.", tier: "vision" },
      { icon: ShieldAlert, title: "Estado de carga y precintos", text: "Registro visual de cómo salió y cómo llegó la mercadería para respaldar cualquier reclamo.", tier: "vision" },
    ],
    vision: {
      zone: "Playa · dársena 3",
      detections: [
        { label: "Patente AE 418 KD", tone: "ok" },
        { label: "Pallets: 23 / 24", tone: "warn" },
        { label: "Peatón en zona de maniobra", tone: "alert" },
      ],
      events: [
        { text: "AE 418 KD ingresó a playa · turno confirmado", tone: "ok" },
        { text: "Dársena 3: faltó un pallet respecto del remito", tone: "warn" },
        { text: "Persona en zona de maniobra de autoelevador", tone: "alert" },
        { text: "Tiempo de carga promedio de hoy: 38 min", tone: "ok" },
      ],
    },
    comparison: {
      before: [
        "Ubicación de las unidades por teléfono",
        "Remitos en papel",
        "Rutas armadas de memoria",
        "Combustible sin seguimiento",
        "Mantenimiento cuando algo se rompe",
        "Liquidaciones en planillas",
      ],
      after: [
        "Flota visible en tiempo real",
        "Entregas comprobadas con firma y foto",
        "Rutas optimizadas automáticamente",
        "Consumo medido por unidad",
        "Mantenimiento preventivo programado",
        "Liquidación automática por viaje",
      ],
    },
    benefits: [
      "Menos llamadas para saber dónde está la carga.",
      "Facturación más rápida al tener el remito al instante.",
      "Menor costo por kilómetro recorrido.",
      "Menos reclamos por faltantes o daños.",
      "Unidades más tiempo en ruta y menos en taller.",
      "Clientes que siguen su envío sin llamarte.",
    ],
    form: {
      nameLabel: "Nombre de la empresa",
      namePlaceholder: "Ej: Transportes Andinos",
      volumeLabel: "Viajes o entregas por día",
      volumeOptions: ["Menos de 10", "10 a 40", "40 a 150", "Más de 150"],
      channelsLabel: "¿Cómo coordinan hoy los viajes?",
      channels: ["Teléfono", "WhatsApp", "Planillas", "Email", "Sistema de gestión", "GPS de terceros", "Otro"],
      subtypes: ["Transporte de cargas", "Distribución urbana", "Depósito y almacenamiento", "Última milla / paquetería", "Transporte de pasajeros", "Cargas refrigeradas", "Otro"],
      currentSystems: GENERIC_SYSTEMS,
      mainProblemPlaceholder: "Ej: Los remitos vuelven tarde y no podemos facturar...",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    id: "retail",
    label: "Retail y supermercados",
    icon: Store,
    noun: "tu comercio",
    each: "cada comercio",
    hero: {
      eyebrow: "Retail conectado de punta a punta",
      title: "Góndolas llenas. Cajas ágiles.",
      highlight: "Pérdidas bajo control.",
      text: "Stock, precios, cajas y clientes en un mismo sistema, con cámaras que te avisan lo que pasa en el salón mientras está pasando.",
    },
    flow: [
      { icon: UsersRound, label: "Cliente", status: "Ingresa al local" },
      { icon: Tags, label: "Góndola", status: "Precio actualizado" },
      { icon: ScanBarcode, label: "Caja", status: "Ticket #8841" },
      { icon: Package, label: "Stock", status: "-3 unidades" },
      { icon: PackageCheck, label: "Reposición", status: "Pedido a proveedor" },
    ],
    chain: ["Salón", "Precios", "Cajas", "Stock", "Proveedores"],
    problemsTitle: "¿Estos problemas le cuestan ventas a tu comercio?",
    problems: [
      {
        icon: PackageX,
        title: "Góndolas vacías con stock en depósito",
        consequence: "El producto está en el local, pero el cliente no lo ve y se va sin comprarlo.",
        before: ["Recorridas manuales del salón", "Faltantes que se descubren tarde", "Depósito desconectado del salón", "Ventas perdidas sin registro"],
        after: ["Cámaras que detectan huecos en góndola", "Aviso inmediato al repositor", "Stock de salón y depósito unificado", "Faltantes medidos por categoría"],
      },
      {
        icon: UsersRound,
        title: "Colas largas en caja",
        consequence: "Cada minuto de espera aumenta los carritos abandonados.",
        before: ["Cajas abiertas por intuición", "Colas en hora pico", "Clientes que dejan la compra", "Sin datos de afluencia"],
        after: ["Conteo de personas por fila", "Alerta para abrir otra caja", "Afluencia medida por hora", "Turnos de personal según demanda real"],
      },
      {
        icon: ShieldAlert,
        title: "Mermas y robo hormiga",
        consequence: "La diferencia de inventario aparece cuando ya no se puede explicar.",
        before: ["Inventarios una vez por mes", "Diferencias sin causa", "Cámaras que nadie mira", "Anulaciones sin control"],
        after: ["Inventario permanente", "Alertas de anulaciones y descuentos atípicos", "Video vinculado a cada ticket", "Mermas clasificadas por motivo"],
      },
      {
        icon: Tag,
        title: "Precios distintos en góndola y caja",
        consequence: "Un precio mal cargado es una discusión en caja o una multa.",
        before: ["Etiquetas impresas a mano", "Cambios que llegan tarde a caja", "Reclamos de clientes", "Listas distintas por sucursal"],
        after: ["Precios centralizados", "Etiquetas generadas automáticamente", "Mismo precio en todos los canales", "Cambios masivos en minutos"],
      },
    ],
    solutionsTitle: "Un sistema diseñado alrededor de tu salón de ventas",
    solutionsText:
      "Para comercios, cadenas, mayoristas, farmacias y estaciones de servicio: desde el stock hasta lo que ocurre frente a la góndola.",
    services: [
      { icon: Package, title: "Stock unificado entre sucursales", text: "Un solo inventario para salón, depósito y tienda online, actualizado con cada venta.", tier: "base" },
      { icon: Tags, title: "Precios y etiquetas centralizados", text: "Cambiás un precio una vez y se actualiza en cajas, etiquetas y e-commerce.", tier: "base" },
      { icon: ShoppingCart, title: "Tienda online conectada", text: "Vendé por web y WhatsApp con el mismo stock y los mismos precios del local.", tier: "base" },
      { icon: Users, title: "Fidelización y promociones", text: "Puntos, cupones y promos segmentadas según lo que compra cada cliente.", tier: "base" },
      { icon: PackageCheck, title: "Reposición automática", text: "La IA calcula qué pedir, cuánto y a qué proveedor según ventas y estacionalidad.", tier: "ia" },
      { icon: Bot, title: "Vendedor IA por WhatsApp", text: "Responde stock y precios, toma pedidos y recupera carritos abandonados.", tier: "ia" },
      { icon: ScanEye, title: "Detección de góndolas vacías", text: "Las cámaras identifican huecos y productos mal ubicados y avisan al repositor.", tier: "vision" },
      { icon: UsersRound, title: "Conteo de personas y mapas de calor", text: "Cuántos entran, por dónde circulan y qué sectores casi nadie visita.", tier: "vision" },
      { icon: BellRing, title: "Alerta de colas en caja", text: "Cuando una fila supera el límite que definas, el encargado recibe el aviso.", tier: "vision" },
      { icon: ShieldAlert, title: "Prevención de pérdidas en línea de cajas", text: "Cruza video y ticket para detectar productos que pasan sin escanearse.", tier: "vision" },
    ],
    vision: {
      zone: "Salón · pasillo 4",
      detections: [
        { label: "Góndola con faltante", tone: "warn" },
        { label: "Fila caja 2: 7 personas", tone: "alert" },
        { label: "Cliente", tone: "ok" },
      ],
      events: [
        { text: "Pasillo 4: hueco detectado en lácteos", tone: "warn" },
        { text: "Caja 2 superó el límite de 6 personas", tone: "alert" },
        { text: "Ingresaron 312 personas en la última hora", tone: "ok" },
        { text: "Producto sin escanear en caja 5 · ticket #8841", tone: "alert" },
      ],
    },
    comparison: {
      before: [
        "Stock distinto en cada sistema",
        "Faltantes descubiertos por el cliente",
        "Cajas abiertas por intuición",
        "Precios cargados a mano",
        "Mermas sin explicación",
        "Compras según la memoria del encargado",
      ],
      after: [
        "Un solo stock en tiempo real",
        "Faltantes detectados por cámara",
        "Personal asignado según afluencia",
        "Precios centralizados",
        "Pérdidas identificadas por causa",
        "Reposición calculada con datos",
      ],
    },
    benefits: [
      "Menos ventas perdidas por faltantes.",
      "Menos espera en línea de cajas.",
      "Mermas más bajas y explicadas.",
      "Precios consistentes en todos los canales.",
      "Compras a proveedores mejor planificadas.",
      "Datos reales de cuánta gente entra y compra.",
    ],
    form: {
      nameLabel: "Nombre del comercio",
      namePlaceholder: "Ej: Autoservicio El Trébol",
      volumeLabel: "Tickets o ventas por día",
      volumeOptions: ["Menos de 100", "100 a 500", "500 a 2.000", "Más de 2.000"],
      channelsLabel: "¿Por dónde venden actualmente?",
      channels: ["Salón de ventas", "WhatsApp", "Tienda online", "Mercado Libre", "Mayorista", "Redes sociales", "Otro"],
      subtypes: ["Supermercado / autoservicio", "Mayorista", "Farmacia", "Indumentaria", "Ferretería / corralón", "Estación de servicio", "Kiosco / drugstore", "Otro"],
      currentSystems: GENERIC_SYSTEMS,
      mainProblemPlaceholder: "Ej: Tenemos diferencias de inventario todos los meses...",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    id: "industria",
    label: "Industria y manufactura",
    icon: Factory,
    noun: "tu planta",
    each: "cada planta",
    hero: {
      eyebrow: "Producción medida en tiempo real",
      title: "Menos paradas. Menos descarte.",
      highlight: "Una planta que se explica sola.",
      text: "Conectamos líneas, calidad, mantenimiento y seguridad para que sepas qué se produjo, qué falló y por qué, sin esperar al parte del día siguiente.",
    },
    flow: [
      { icon: ClipboardList, label: "Orden", status: "OP #2207 liberada" },
      { icon: Factory, label: "Línea", status: "1.240 u/h" },
      { icon: ScanEye, label: "Calidad", status: "99,1% conforme" },
      { icon: Boxes, label: "Lote", status: "L-0418 trazado" },
      { icon: Truck, label: "Despacho", status: "Listo para envío" },
    ],
    chain: ["Órdenes", "Línea", "Calidad", "Lotes", "Despacho"],
    problemsTitle: "¿Estos problemas se repiten en tu planta?",
    problems: [
      {
        icon: Timer,
        title: "Paradas de línea que nadie registra",
        consequence: "Si la parada no se anota, la causa se repite la semana siguiente.",
        before: ["Parte de producción en papel", "Paradas anotadas de memoria", "Causas sin clasificar", "Eficiencia real desconocida"],
        after: ["Cada parada registrada al instante", "Motivos clasificados por máquina", "Eficiencia (OEE) en un tablero", "Problemas repetidos a la vista"],
      },
      {
        icon: ScanEye,
        title: "Defectos detectados demasiado tarde",
        consequence: "Cuando el defecto aparece al final, ya hay un lote entero para reprocesar.",
        before: ["Inspección por muestreo", "Depende del ojo del operario", "Lotes completos rechazados", "Reclamos de clientes"],
        after: ["Inspección visual de cada pieza", "Alerta apenas aparece el defecto", "Imagen guardada de cada rechazo", "Descarte medido por causa"],
      },
      {
        icon: HardHat,
        title: "Incumplimientos de seguridad",
        consequence: "Un accidente cuesta mucho más que cualquier sistema de prevención.",
        before: ["Controles de EPP esporádicos", "Zonas de riesgo sin vigilancia", "Incidentes sin registro", "Auditorías con datos incompletos"],
        after: ["Detección de casco, chaleco y guantes", "Alerta al ingresar a zonas peligrosas", "Historial de incidentes con video", "Reportes listos para la ART"],
      },
      {
        icon: FileText,
        title: "Producción anotada en planillas",
        consequence: "Los números llegan al día siguiente, cuando ya no se puede corregir nada.",
        before: ["Planillas por turno", "Carga doble en Excel", "Trazabilidad incompleta", "Decisiones con datos viejos"],
        after: ["Órdenes de trabajo digitales", "Datos cargados una sola vez", "Trazabilidad por lote", "Indicadores del turno en vivo"],
      },
    ],
    solutionsTitle: "Un sistema diseñado alrededor de tus líneas de producción",
    solutionsText:
      "Para plantas alimenticias, metalúrgicas, plásticas, textiles y de envasado: desde la orden de producción hasta el despacho.",
    services: [
      { icon: Gauge, title: "Tablero de producción y OEE", text: "Unidades, velocidad, paradas y eficiencia de cada línea en una pantalla.", tier: "base" },
      { icon: ClipboardList, title: "Órdenes de trabajo digitales", text: "El operario recibe y cierra cada orden desde una tablet, sin planillas.", tier: "base" },
      { icon: Boxes, title: "Trazabilidad por lote", text: "De la materia prima al producto terminado, lista para auditorías y recalls.", tier: "base" },
      { icon: Wrench, title: "Mantenimiento preventivo", text: "Plan de mantenimiento por horas de uso, con historial de cada equipo.", tier: "base" },
      { icon: BrainCircuit, title: "Predicción de fallas", text: "La IA analiza vibración, temperatura y consumo para anticipar roturas.", tier: "ia" },
      { icon: Workflow, title: "Planificación automática", text: "Ordena la producción según pedidos, stock y capacidad disponible.", tier: "ia" },
      { icon: ScanEye, title: "Control de calidad visual", text: "Cámaras sobre la línea que detectan defectos, faltantes y etiquetas mal puestas en cada pieza.", tier: "vision" },
      { icon: HardHat, title: "Detección de EPP", text: "Verifica casco, chaleco, guantes y anteojos en cada sector, con registro por turno.", tier: "vision" },
      { icon: Forklift, title: "Zonas de riesgo y autoelevadores", text: "Alerta cuando una persona entra en una zona de maniobra o de exclusión.", tier: "vision" },
      { icon: Activity, title: "Conteo de piezas en línea", text: "Cuenta producción real sin sensores adicionales y la compara con lo planificado.", tier: "vision" },
      { icon: Flame, title: "Detección temprana de humo y fuego", text: "Identifica principios de incendio antes que los detectores convencionales.", tier: "vision" },
    ],
    vision: {
      zone: "Línea 2 · envasado",
      detections: [
        { label: "Pieza conforme", tone: "ok" },
        { label: "Etiqueta desalineada", tone: "warn" },
        { label: "Operario sin casco", tone: "alert" },
      ],
      events: [
        { text: "Línea 2: 1.240 unidades/hora · conforme", tone: "ok" },
        { text: "Etiqueta desalineada en 3 unidades seguidas", tone: "warn" },
        { text: "Operario sin casco en sector prensas", tone: "alert" },
        { text: "Persona en zona de exclusión de autoelevador", tone: "alert" },
      ],
    },
    comparison: {
      before: [
        "Parte de producción en papel",
        "Calidad por muestreo",
        "Paradas sin causa registrada",
        "Mantenimiento correctivo",
        "Controles de seguridad esporádicos",
        "Trazabilidad incompleta",
      ],
      after: [
        "Producción medida en tiempo real",
        "Inspección visual del 100% de las piezas",
        "Paradas clasificadas por motivo",
        "Mantenimiento preventivo y predictivo",
        "Seguridad monitoreada todo el turno",
        "Trazabilidad completa por lote",
      ],
    },
    benefits: [
      "Menos descarte y reproceso.",
      "Más horas productivas por turno.",
      "Menos incidentes de seguridad.",
      "Trazabilidad lista para auditorías.",
      "Decisiones con datos del turno actual.",
      "Menos reclamos de clientes por calidad.",
    ],
    form: {
      nameLabel: "Nombre de la empresa",
      namePlaceholder: "Ej: Envases del Oeste",
      volumeLabel: "Líneas o puestos de producción",
      volumeOptions: ["1 a 2", "3 a 5", "6 a 15", "Más de 15"],
      channelsLabel: "¿Cómo registran hoy la producción?",
      channels: ["Papel", "Planillas de Excel", "ERP", "Tablero manual", "Sensores / PLC", "No se registra", "Otro"],
      subtypes: ["Alimentos y bebidas", "Metalúrgica", "Plásticos y envases", "Textil", "Química / farmacéutica", "Maderera", "Otro"],
      currentSystems: GENERIC_SYSTEMS,
      mainProblemPlaceholder: "Ej: No sabemos por qué la línea 2 para tantas veces por turno...",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    id: "construccion",
    label: "Construcción y obras",
    icon: HardHat,
    noun: "tu obra",
    each: "cada obra",
    hero: {
      eyebrow: "Obras controladas a distancia",
      title: "Avance real. Materiales cuidados.",
      highlight: "Seguridad todos los días.",
      text: "Parte diario, materiales, contratistas y cámaras de obra en un mismo sistema, para saber cómo va cada frente sin tener que estar ahí.",
    },
    flow: [
      { icon: ClipboardList, label: "Plan", status: "Semana 14 cargada" },
      { icon: IdCard, label: "Ingreso", status: "38 presentes" },
      { icon: Construction, label: "Frente", status: "Losa 3º piso" },
      { icon: Boxes, label: "Materiales", status: "-120 bolsas" },
      { icon: BarChart3, label: "Avance", status: "62% certificado" },
    ],
    chain: ["Plan", "Personal", "Frentes", "Materiales", "Certificación"],
    problemsTitle: "¿Estos problemas aparecen en tus obras?",
    problems: [
      {
        icon: TrendingUp,
        title: "Avance de obra sin datos confiables",
        consequence: "El atraso se descubre al certificar, cuando ya no hay margen para recuperarlo.",
        before: ["Parte diario por WhatsApp", "Fotos sueltas en el celular", "Avance estimado a ojo", "Desvíos que aparecen tarde"],
        after: ["Parte diario digital por frente", "Fotos ordenadas por fecha y sector", "Avance medido contra el plan", "Alertas tempranas de atraso"],
      },
      {
        icon: ShieldAlert,
        title: "Robo y faltante de materiales",
        consequence: "Lo que desaparece del obrador sale directo de la rentabilidad.",
        before: ["Sereno como única vigilancia", "Ingresos sin remito controlado", "Herramientas sin responsable", "Faltantes sin explicación"],
        after: ["Cámaras con alerta nocturna de intrusos", "Control de camiones por patente", "Herramientas asignadas por persona", "Consumo comparado con lo presupuestado"],
      },
      {
        icon: HardHat,
        title: "Riesgos de seguridad e higiene",
        consequence: "Un incumplimiento puede frenar la obra completa.",
        before: ["Recorridas de control ocasionales", "Trabajo en altura sin arnés", "Incidentes sin evidencia", "Documentación dispersa"],
        after: ["Detección automática de casco y arnés", "Alertas en zonas de riesgo", "Registro con imagen de cada evento", "Informes para la ART y el comitente"],
      },
      {
        icon: UsersRound,
        title: "Contratistas y presentismo sin control",
        consequence: "Pagás jornales que no podés comprobar y habilitaciones que no verificaste.",
        before: ["Planilla de asistencia en papel", "ART y seguros sin verificar", "Horas difíciles de auditar", "Ingresos de personal no autorizado"],
        after: ["Presentismo digital en el ingreso", "Vencimientos de documentación alertados", "Horas por contratista y por frente", "Solo ingresa personal habilitado"],
      },
    ],
    solutionsTitle: "Un sistema diseñado alrededor de tus obras",
    solutionsText:
      "Para constructoras, desarrolladoras y estudios: todas las obras en un tablero, con evidencia de lo que pasa en cada una.",
    services: [
      { icon: ClipboardList, title: "Parte diario digital", text: "Tareas, personal, clima y novedades cargados desde el celular en cada frente.", tier: "base" },
      { icon: BarChart3, title: "Avance y certificaciones", text: "Avance por rubro contra el plan de obra y certificados generados con esos datos.", tier: "base" },
      { icon: Boxes, title: "Control de materiales y acopio", text: "Ingresos, consumos y stock de obrador comparados con el cómputo.", tier: "base" },
      { icon: Receipt, title: "Presupuesto contra gasto real", text: "Cada compra imputada a su rubro para ver el desvío mientras ocurre.", tier: "base" },
      { icon: FileCheck2, title: "Documentación de contratistas", text: "La IA lee ART, seguros y altas, controla vencimientos y bloquea a quien no esté habilitado.", tier: "ia" },
      { icon: Bot, title: "Asistente de obra por WhatsApp", text: "El capataz dicta el parte por audio y el sistema lo ordena solo.", tier: "ia" },
      { icon: HardHat, title: "Detección de EPP y trabajo en altura", text: "Las cámaras verifican casco, chaleco y arnés y alertan en el momento.", tier: "vision" },
      { icon: Siren, title: "Vigilancia nocturna del obrador", text: "Detecta personas y vehículos fuera de horario y avisa con imagen al responsable.", tier: "vision" },
      { icon: Camera, title: "Timelapse y avance con IA", text: "Registro visual diario que mide el progreso y deja evidencia para el comitente.", tier: "vision" },
      { icon: ScanLine, title: "Control de ingreso de camiones", text: "Lee la patente, registra hora y vincula cada camión con su remito.", tier: "vision" },
    ],
    vision: {
      zone: "Obra · frente norte",
      detections: [
        { label: "Con casco y arnés", tone: "ok" },
        { label: "Sin arnés en altura", tone: "alert" },
        { label: "Camión AD 207 PL", tone: "ok" },
      ],
      events: [
        { text: "38 personas registradas en el ingreso", tone: "ok" },
        { text: "Trabajo en altura sin arnés · 3º piso", tone: "alert" },
        { text: "Camión AD 207 PL ingresó con remito 0045", tone: "ok" },
        { text: "Movimiento en obrador fuera de horario", tone: "alert" },
      ],
    },
    comparison: {
      before: [
        "Parte diario por mensajes",
        "Avance estimado a ojo",
        "Materiales sin control de consumo",
        "Vigilancia solo presencial",
        "Documentación de contratistas en carpetas",
        "Desvíos descubiertos al certificar",
      ],
      after: [
        "Parte diario digital por frente",
        "Avance medido contra el plan",
        "Consumo comparado con el cómputo",
        "Cámaras que alertan solas",
        "Vencimientos controlados automáticamente",
        "Desvíos visibles semana a semana",
      ],
    },
    benefits: [
      "Menos faltantes de materiales y herramientas.",
      "Avance de obra comprobable para el comitente.",
      "Menos incidentes de seguridad.",
      "Contratistas con documentación siempre al día.",
      "Control de varias obras sin viajar a cada una.",
      "Desvíos de presupuesto detectados a tiempo.",
    ],
    form: {
      nameLabel: "Nombre de la empresa",
      namePlaceholder: "Ej: Constructora Cordillera",
      volumeLabel: "Obras activas en simultáneo",
      volumeOptions: ["1", "2 a 3", "4 a 10", "Más de 10"],
      channelsLabel: "¿Cómo hacen hoy el seguimiento de obra?",
      channels: ["WhatsApp", "Papel", "Planillas de Excel", "Visitas a obra", "Software de gestión", "Cámaras sin análisis", "Otro"],
      subtypes: ["Constructora", "Desarrolladora inmobiliaria", "Estudio de arquitectura", "Obra pública", "Obra vial", "Contratista / subcontratista", "Otro"],
      currentSystems: GENERIC_SYSTEMS,
      mainProblemPlaceholder: "Ej: Nos faltan materiales y no sabemos en qué frente se usaron...",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    id: "agro",
    label: "Agro y bodegas",
    icon: Grape,
    noun: "tu finca o bodega",
    each: "cada finca o bodega",
    hero: {
      eyebrow: "Del cuartel a la botella",
      title: "Trazabilidad completa.",
      highlight: "Decisiones a tiempo.",
      text: "Campo, cosecha, bodega y ventas conectados: cada labor registrada, cada lote trazado y alertas antes de que el clima o un desvío te cuesten la temporada.",
    },
    flow: [
      { icon: Sprout, label: "Cuartel", status: "Malbec · lote 7" },
      { icon: UsersRound, label: "Cosecha", status: "412 tachos" },
      { icon: Gauge, label: "Báscula", status: "8.240 kg" },
      { icon: Wine, label: "Bodega", status: "Tanque 12" },
      { icon: PackageCheck, label: "Despacho", status: "Lote trazado" },
    ],
    chain: ["Campo", "Cosecha", "Recepción", "Bodega", "Ventas"],
    problemsTitle: "¿Estos problemas aparecen en tu finca o bodega?",
    problems: [
      {
        icon: FileText,
        title: "Trazabilidad armada a mano",
        consequence: "Cada auditoría o certificación obliga a reconstruir la historia de un lote.",
        before: ["Cuaderno de campo en papel", "Planillas distintas por sector", "Lotes difíciles de reconstruir", "Días preparando una auditoría"],
        after: ["Cuaderno de campo digital", "Cada labor ligada a su cuartel", "Historia completa del lote en un clic", "Reportes listos para certificar"],
      },
      {
        icon: ThermometerSnowflake,
        title: "Heladas y riego que avisan tarde",
        consequence: "Una noche sin aviso puede comprometer la cosecha de todo un cuartel.",
        before: ["Recorridas nocturnas", "Riego por turno fijo", "Datos del clima generales", "Reacción cuando el daño ya ocurrió"],
        after: ["Sensores de temperatura y humedad", "Alerta al celular antes de la helada", "Riego según necesidad real", "Historial por cuartel"],
      },
      {
        icon: UsersRound,
        title: "Cosecha y cuadrillas difíciles de liquidar",
        consequence: "Contar fichas y tachos a mano genera errores y discusiones al pagar.",
        before: ["Fichas y conteo manual", "Liquidaciones con errores", "Rendimiento desconocido", "Reclamos de cuadrillas"],
        after: ["Registro digital por cosechador", "Liquidación automática", "Rendimiento por cuadrilla y cuartel", "Pagos sin discusiones"],
      },
      {
        icon: ShieldAlert,
        title: "Fincas extensas sin vigilancia",
        consequence: "Robos de producción, insumos y cables que se descubren al día siguiente.",
        before: ["Perímetro sin control", "Ingresos sin registro", "Robos detectados tarde", "Cámaras que solo graban"],
        after: ["Detección de intrusos con aviso inmediato", "Lectura de patentes en tranqueras", "Registro de cada ingreso", "Evidencia lista para la denuncia"],
      },
    ],
    solutionsTitle: "Un sistema diseñado alrededor de tu campo y tu bodega",
    solutionsText:
      "Para fincas, bodegas, empaques y establecimientos agroindustriales: desde la labor en el cuartel hasta la venta de cada lote.",
    services: [
      { icon: ClipboardList, title: "Cuaderno de campo digital", text: "Labores, aplicaciones y riegos registrados por cuartel desde el celular, incluso sin señal.", tier: "base" },
      { icon: Boxes, title: "Trazabilidad de lote a botella", text: "Seguí cada lote desde la cosecha hasta el fraccionamiento y el despacho.", tier: "base" },
      { icon: Wine, title: "Gestión de bodega", text: "Tanques, barricas, movimientos, análisis y stock de insumos secos en un solo lugar.", tier: "base" },
      { icon: CalendarCheck, title: "Enoturismo y visitas", text: "Reservas online, cobro anticipado y venta de vinos al visitante.", tier: "base" },
      { icon: ThermometerSnowflake, title: "Alertas de helada y riego", text: "Sensores e IA que avisan antes del daño y recomiendan cuándo regar.", tier: "ia" },
      { icon: Receipt, title: "Liquidación de cosecha", text: "Registro por cosechador y cuadrilla con liquidación automática.", tier: "ia" },
      { icon: ScanEye, title: "Clasificación de fruta en línea", text: "Cámaras que cuentan, calibran y separan por calidad en la cinta de empaque.", tier: "vision" },
      { icon: ScanLine, title: "Patentes y pesaje en báscula", text: "Identifica cada camión, lo vincula con su pesada y evita errores de carga.", tier: "vision" },
      { icon: Cctv, title: "Vigilancia perimetral de fincas", text: "Detecta personas y vehículos en zonas y horarios no permitidos, con aviso al celular.", tier: "vision" },
      { icon: Droplets, title: "Control de línea de embotellado", text: "Verifica nivel de llenado, tapado y etiqueta en cada botella.", tier: "vision" },
    ],
    vision: {
      zone: "Recepción · báscula",
      detections: [
        { label: "Patente AC 903 RT", tone: "ok" },
        { label: "Botella sin etiqueta", tone: "warn" },
        { label: "Persona en perímetro", tone: "alert" },
      ],
      events: [
        { text: "AC 903 RT · 8.240 kg de Malbec, lote 7", tone: "ok" },
        { text: "Línea de fraccionado: botella sin etiqueta", tone: "warn" },
        { text: "Movimiento en perímetro sur · 02:14", tone: "alert" },
        { text: "Temperatura en cuartel 3: 1,2 °C y bajando", tone: "warn" },
      ],
    },
    comparison: {
      before: [
        "Cuaderno de campo en papel",
        "Trazabilidad reconstruida a mano",
        "Riego por calendario",
        "Cosecha contada con fichas",
        "Fincas sin vigilancia activa",
        "Stock de bodega en planillas",
      ],
      after: [
        "Labores registradas por cuartel",
        "Historia completa de cada lote",
        "Riego según datos del suelo",
        "Liquidación automática de cosecha",
        "Alertas de intrusos y de clima",
        "Bodega y ventas conectadas",
      ],
    },
    benefits: [
      "Auditorías y certificaciones más simples.",
      "Menos pérdidas por heladas y robos.",
      "Liquidaciones de cosecha sin errores.",
      "Uso más eficiente del agua de riego.",
      "Stock de bodega confiable.",
      "Más ventas directas a visitantes.",
    ],
    form: {
      nameLabel: "Nombre de la finca o bodega",
      namePlaceholder: "Ej: Finca Los Álamos",
      volumeLabel: "Superficie o escala de la operación",
      volumeOptions: ["Menos de 20 ha", "20 a 100 ha", "100 a 500 ha", "Más de 500 ha"],
      channelsLabel: "¿Cómo registran hoy las labores y la producción?",
      channels: ["Cuaderno en papel", "Planillas de Excel", "WhatsApp", "Software agrícola", "Software de bodega", "No se registra", "Otro"],
      subtypes: ["Finca / viñedo", "Bodega", "Empaque de fruta", "Olivícola", "Ganadería / feedlot", "Agroindustria", "Otro"],
      currentSystems: GENERIC_SYSTEMS,
      mainProblemPlaceholder: "Ej: Armar la trazabilidad de un lote nos lleva días...",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    id: "salud",
    label: "Salud y clínicas",
    icon: Stethoscope,
    noun: "tu clínica",
    each: "cada institución",
    hero: {
      eyebrow: "Gestión para instituciones de salud",
      title: "Menos turnos perdidos.",
      highlight: "Más tiempo para atender.",
      text: "Turnos, documentación, facturación y espacios monitoreados en un mismo sistema, para que el equipo se dedique a los pacientes y no a los papeles.",
    },
    flow: [
      { icon: CalendarCheck, label: "Turno", status: "Confirmado por WhatsApp" },
      { icon: DoorOpen, label: "Recepción", status: "Paciente acreditado" },
      { icon: Stethoscope, label: "Consulta", status: "En atención" },
      { icon: FileText, label: "Historia", status: "Registro firmado" },
      { icon: Receipt, label: "Facturación", status: "Prestación presentada" },
    ],
    chain: ["Turnos", "Recepción", "Atención", "Historia clínica", "Facturación"],
    problemsTitle: "¿Estos problemas se repiten en tu institución?",
    problems: [
      {
        icon: CalendarCheck,
        title: "Turnos que no se presentan",
        consequence: "Cada ausencia es un consultorio vacío y un paciente que quedó sin lugar.",
        before: ["Turnos por teléfono", "Recordatorios manuales", "Ausentismo alto", "Agenda con huecos"],
        after: ["Turnos online las 24 horas", "Recordatorio y confirmación por WhatsApp", "Reasignación automática de cancelados", "Agenda completa"],
      },
      {
        icon: UsersRound,
        title: "Sala de espera saturada",
        consequence: "Demoras que nadie mide terminan en quejas y pacientes que no vuelven.",
        before: ["Espera sin información", "Recepción desbordada", "Demoras sin registrar", "Quejas frecuentes"],
        after: ["Acreditación ágil desde el celular", "Tiempo de espera medido", "Aviso al paciente cuando es su turno", "Ocupación de sala a la vista"],
      },
      {
        icon: Receipt,
        title: "Facturación a obras sociales con rechazos",
        consequence: "Los débitos por errores administrativos son ingresos que no se recuperan.",
        before: ["Autorizaciones en papel", "Carga manual de prestaciones", "Débitos por errores de carga", "Cobros demorados"],
        after: ["Validación antes de presentar", "Prestaciones cargadas una sola vez", "Alertas de documentación faltante", "Seguimiento de cada liquidación"],
      },
      {
        icon: ShieldAlert,
        title: "Internación sin supervisión continua",
        consequence: "Una caída o una salida no advertida puede pasar minutos sin que nadie lo sepa.",
        before: ["Rondas cada cierto tiempo", "Pacientes solos entre controles", "Incidentes detectados tarde", "Sin registro del evento"],
        after: ["Alertas de caída en el momento", "Aviso de salida de cama o de sector", "Respuesta más rápida del equipo", "Registro de cada evento"],
      },
    ],
    solutionsTitle: "Un sistema diseñado alrededor de tu institución",
    solutionsText:
      "Para clínicas, centros médicos, consultorios, laboratorios y residencias: menos carga administrativa y más visibilidad sobre lo que ocurre en cada sector.",
    services: [
      { icon: CalendarCheck, title: "Turnos online y recordatorios", text: "Agenda por profesional con confirmación automática por WhatsApp.", tier: "base" },
      { icon: FileText, title: "Historia clínica digital", text: "Registros, estudios y documentación del paciente en un solo lugar, con acceso por perfil.", tier: "base" },
      { icon: Package, title: "Insumos y farmacia", text: "Stock con lote y vencimiento, consumos por sector y reposición planificada.", tier: "base" },
      { icon: ChartNoAxesCombined, title: "Tablero de gestión", text: "Ocupación, ausentismo y producción por profesional y por especialidad.", tier: "base" },
      { icon: Bot, title: "Recepcionista IA por WhatsApp", text: "Da turnos, reprograma y responde preguntas frecuentes a cualquier hora.", tier: "ia" },
      { icon: Receipt, title: "Facturación a obras sociales", text: "Controla cada prestación antes de presentarla para reducir débitos.", tier: "ia" },
      { icon: HeartPulse, title: "Detección de caídas", text: "Cámaras que alertan al equipo cuando un paciente cae o sale de la cama, pensadas para internación y residencias.", tier: "vision" },
      { icon: UsersRound, title: "Ocupación y espera en salas", text: "Mide cuánta gente espera y cuánto demora cada sector, sin identificar personas.", tier: "vision" },
      { icon: KeyRound, title: "Control de áreas restringidas", text: "Avisa cuando alguien ingresa a quirófano, farmacia o neonatología sin autorización.", tier: "vision" },
      { icon: ShieldCheck, title: "Cumplimiento de higiene y EPP", text: "Verifica lavado de manos y uso de barbijo y guantes en zonas críticas.", tier: "vision" },
    ],
    vision: {
      zone: "Internación · ala B",
      detections: [
        { label: "Paciente en cama", tone: "ok" },
        { label: "Posible caída · hab. 204", tone: "alert" },
        { label: "Sala de espera: 14", tone: "warn" },
      ],
      events: [
        { text: "Hab. 204: posible caída · enfermería notificada", tone: "alert" },
        { text: "Sala de espera con 14 personas · demora 35 min", tone: "warn" },
        { text: "Ingreso no autorizado a farmacia", tone: "alert" },
        { text: "Higiene de manos registrada en UTI", tone: "ok" },
      ],
    },
    comparison: {
      before: [
        "Turnos por teléfono",
        "Recordatorios manuales",
        "Historias en papel",
        "Débitos por errores de carga",
        "Supervisión solo por rondas",
        "Sin datos de espera ni ocupación",
      ],
      after: [
        "Turnos online con confirmación",
        "Recordatorios automáticos",
        "Historia clínica digital",
        "Prestaciones validadas antes de presentar",
        "Alertas continuas en internación",
        "Tiempos y ocupación medidos",
      ],
    },
    benefits: [
      "Menos ausentismo en los turnos.",
      "Menos carga administrativa en recepción.",
      "Menos débitos de obras sociales.",
      "Respuesta más rápida ante incidentes.",
      "Pacientes mejor informados.",
      "Indicadores claros por especialidad.",
    ],
    form: {
      nameLabel: "Nombre de la institución",
      namePlaceholder: "Ej: Centro Médico Aconcagua",
      volumeLabel: "Turnos o pacientes por día",
      volumeOptions: ["Menos de 30", "30 a 100", "100 a 400", "Más de 400"],
      channelsLabel: "¿Cómo se gestionan hoy los turnos?",
      channels: ["Teléfono", "WhatsApp", "Presencial", "Web propia", "Plataforma de terceros", "Otro"],
      subtypes: ["Clínica / sanatorio", "Centro médico", "Consultorio", "Odontología", "Laboratorio / diagnóstico", "Residencia geriátrica", "Veterinaria", "Otro"],
      currentSystems: GENERIC_SYSTEMS,
      mainProblemPlaceholder: "Ej: Tenemos mucho ausentismo y la recepción no da abasto...",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    id: "seguridad",
    label: "Barrios y consorcios",
    icon: ShieldCheck,
    noun: "tu barrio o edificio",
    each: "cada barrio o consorcio",
    hero: {
      eyebrow: "Accesos y seguridad inteligentes",
      title: "Cámaras que avisan.",
      highlight: "Accesos que se gestionan solos.",
      text: "Visitas, accesos, expensas y cámaras con inteligencia artificial en una sola plataforma, para que la guardia actúe sobre alertas reales y no sobre cuarenta monitores.",
    },
    flow: [
      { icon: Smartphone, label: "Vecino", status: "Visita autorizada" },
      { icon: ScanLine, label: "Acceso", status: "Patente reconocida" },
      { icon: DoorOpen, label: "Barrera", status: "Apertura automática" },
      { icon: Cctv, label: "Monitoreo", status: "Perímetro sin novedades" },
      { icon: FileText, label: "Registro", status: "Ingreso guardado" },
    ],
    chain: ["Vecinos", "Accesos", "Cámaras", "Guardia", "Administración"],
    problemsTitle: "¿Estos problemas ocurren en tu barrio o edificio?",
    problems: [
      {
        icon: CarFront,
        title: "Filas en el ingreso",
        consequence: "La guardia llama casa por casa mientras los autos se acumulan en la entrada.",
        before: ["Llamado telefónico por cada visita", "Planilla de ingresos a mano", "Filas en horas pico", "Datos ilegibles o incompletos"],
        after: ["El vecino autoriza desde su celular", "Lectura automática de patentes", "Ingreso en segundos", "Registro completo y consultable"],
      },
      {
        icon: Cctv,
        title: "Cámaras que nadie puede mirar",
        consequence: "Con decenas de cámaras, el evento importante pasa sin que nadie lo vea.",
        before: ["Un operador para muchos monitores", "Grabaciones que se revisan después", "Falsas alarmas constantes", "Intrusiones detectadas tarde"],
        after: ["La IA vigila todas las cámaras a la vez", "Alerta solo ante eventos reales", "Imagen del evento en el celular", "Búsqueda por persona, vehículo o color"],
      },
      {
        icon: MessageSquareText,
        title: "Reclamos y expensas por WhatsApp",
        consequence: "Los pedidos se pierden en los grupos y la cobranza se atrasa.",
        before: ["Reclamos en grupos de chat", "Expensas enviadas por email", "Pagos sin identificar", "Morosidad sin seguimiento"],
        after: ["Reclamos con número y estado", "Expensas y pago desde la app", "Conciliación automática", "Recordatorios de deuda automáticos"],
      },
      {
        icon: KeyRound,
        title: "Espacios comunes sin control",
        consequence: "Reservas superpuestas y uso indebido que terminan en conflictos entre vecinos.",
        before: ["Reservas por planilla", "Turnos superpuestos", "Sin control de uso real", "Daños sin responsable"],
        after: ["Reservas desde el celular", "Reglas y cupos automáticos", "Ocupación medida por cámara", "Registro de quién usó cada espacio"],
      },
    ],
    solutionsTitle: "Un sistema diseñado alrededor de tu comunidad",
    solutionsText:
      "Para barrios privados, edificios, administraciones, parques industriales y estacionamientos: seguridad activa y gestión sin fricción.",
    services: [
      { icon: Smartphone, title: "Autorización de visitas", text: "El vecino genera un QR o autoriza con un toque; la guardia solo valida.", tier: "base" },
      { icon: CalendarCheck, title: "Reservas de espacios comunes", text: "SUM, canchas y parrillas con reglas, cupos y cobro si corresponde.", tier: "base" },
      { icon: MessageSquareText, title: "Reclamos y mantenimiento", text: "Cada pedido con responsable, estado y aviso al vecino cuando se resuelve.", tier: "base" },
      { icon: Receipt, title: "Expensas y cobranza automática", text: "Liquidación, medios de pago, conciliación y recordatorios sin intervención manual.", tier: "ia" },
      { icon: Bot, title: "Asistente para vecinos", text: "Responde consultas de reglamento, saldos y reservas por WhatsApp.", tier: "ia" },
      { icon: ScanLine, title: "Lectura de patentes en accesos", text: "Reconoce vehículos de vecinos y visitas autorizadas y abre la barrera sin frenar el ingreso.", tier: "vision" },
      { icon: Siren, title: "Detección perimetral de intrusos", text: "Distingue personas de animales y sombras para alertar solo cuando hay un riesgo real.", tier: "vision" },
      { icon: Cctv, title: "Cámaras que avisan solas", text: "Merodeo, vehículo detenido, portón abierto u objeto abandonado, con aviso a la guardia.", tier: "vision" },
      { icon: CarFront, title: "Ocupación de estacionamientos", text: "Lugares libres por sector, tiempo de estadía y cobro automático por patente.", tier: "vision" },
      { icon: Monitor, title: "Central de monitoreo multisede", text: "Varias sedes supervisadas desde un solo puesto con priorización de alertas.", tier: "vision" },
    ],
    vision: {
      zone: "Acceso principal",
      detections: [
        { label: "Patente AF 552 MN · vecino", tone: "ok" },
        { label: "Merodeo · 4 min", tone: "warn" },
        { label: "Intruso en perímetro", tone: "alert" },
      ],
      events: [
        { text: "AF 552 MN · vecino lote 48 · barrera abierta", tone: "ok" },
        { text: "Persona merodeando en acceso de servicio", tone: "warn" },
        { text: "Cruce de perímetro en sector laguna", tone: "alert" },
        { text: "Portón de proveedores abierto hace 10 min", tone: "warn" },
      ],
    },
    comparison: {
      before: [
        "Visitas autorizadas por teléfono",
        "Planilla de ingresos manual",
        "Cámaras que solo graban",
        "Falsas alarmas permanentes",
        "Reclamos perdidos en grupos",
        "Cobranza con seguimiento manual",
      ],
      after: [
        "Visitas autorizadas desde el celular",
        "Ingresos registrados por patente",
        "Cámaras que alertan en vivo",
        "Avisos solo ante eventos reales",
        "Reclamos con estado y responsable",
        "Cobranza y conciliación automáticas",
      ],
    },
    benefits: [
      "Ingresos más rápidos y sin filas.",
      "Detección de intrusos en el momento.",
      "Guardia enfocada en eventos reales.",
      "Menor morosidad en expensas.",
      "Menos conflictos por espacios comunes.",
      "Registro completo ante cualquier incidente.",
    ],
    form: {
      nameLabel: "Nombre del barrio, edificio o administración",
      namePlaceholder: "Ej: Barrio Los Olivos",
      volumeLabel: "Cantidad de unidades o lotes",
      volumeOptions: ["Menos de 50", "50 a 200", "200 a 600", "Más de 600"],
      channelsLabel: "¿Cómo controlan hoy los accesos?",
      channels: ["Guardia con planilla", "Teléfono / intercomunicador", "Tarjetas o llaveros", "App de accesos", "Cámaras sin análisis", "Sin control", "Otro"],
      subtypes: ["Barrio privado", "Edificio / consorcio", "Administración de consorcios", "Parque industrial", "Estacionamiento", "Empresa de seguridad", "Otro"],
      currentSystems: GENERIC_SYSTEMS,
      mainProblemPlaceholder: "Ej: Tenemos 60 cámaras y nadie llega a mirarlas todas...",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    id: "hoteleria",
    label: "Hotelería y turismo",
    icon: Hotel,
    noun: "tu hotel",
    each: "cada alojamiento",
    hero: {
      eyebrow: "Hospitalidad sin fricción",
      title: "Reservas ordenadas.",
      highlight: "Huéspedes mejor atendidos.",
      text: "Reservas, check-in, housekeeping y atención al huésped conectados, con un conserje de inteligencia artificial que responde a toda hora.",
    },
    flow: [
      { icon: CalendarCheck, label: "Reserva", status: "Directa · 3 noches" },
      { icon: Smartphone, label: "Check-in", status: "Online completado" },
      { icon: BedDouble, label: "Habitación", status: "204 lista" },
      { icon: ConciergeBell, label: "Servicios", status: "Cena reservada" },
      { icon: Receipt, label: "Check-out", status: "Cuenta cerrada" },
    ],
    chain: ["Reservas", "Check-in", "Habitaciones", "Servicios", "Facturación"],
    problemsTitle: "¿Estos problemas afectan a tu alojamiento?",
    problems: [
      {
        icon: CalendarCheck,
        title: "Reservas repartidas en muchos canales",
        consequence: "Una disponibilidad mal actualizada termina en sobreventa y un huésped sin habitación.",
        before: ["Disponibilidad cargada a mano", "Riesgo de sobreventa", "Comisiones altas de intermediarios", "Tarifas desactualizadas"],
        after: ["Disponibilidad sincronizada", "Motor de reservas propio", "Más reservas directas", "Tarifas actualizadas en todos los canales"],
      },
      {
        icon: Timer,
        title: "Check-in lento",
        consequence: "La primera impresión del huésped es una fila en recepción.",
        before: ["Fichas en papel", "Datos cargados dos veces", "Filas al llegar", "Recepción saturada"],
        after: ["Check-in online antes de llegar", "Datos cargados por el huésped", "Entrega de llave en minutos", "Recepción con tiempo para atender"],
      },
      {
        icon: BedDouble,
        title: "Housekeeping descoordinado",
        consequence: "Habitaciones listas que nadie informó y huéspedes esperando en el lobby.",
        before: ["Estado de habitaciones por radio", "Planillas de limpieza", "Mantenimiento que se olvida", "Entradas demoradas"],
        after: ["Estado de cada habitación en vivo", "Tareas asignadas en el celular", "Pedidos de mantenimiento con seguimiento", "Habitaciones liberadas antes"],
      },
      {
        icon: MessageSquareText,
        title: "Las mismas consultas todo el día",
        consequence: "El equipo responde lo mismo decenas de veces y las consultas nocturnas quedan sin contestar.",
        before: ["Mensajes sin responder de noche", "Respuestas repetidas", "Ventas adicionales perdidas", "Demoras en horas pico"],
        after: ["Respuesta inmediata a toda hora", "Reservas tomadas por el asistente", "Ofertas de servicios en el momento justo", "El equipo atiende lo importante"],
      },
    ],
    solutionsTitle: "Un sistema diseñado alrededor de tus huéspedes",
    solutionsText:
      "Para hoteles, cabañas, apart hoteles, complejos y operadores turísticos: más reservas directas y una operación coordinada.",
    services: [
      { icon: CalendarCheck, title: "Motor de reservas propio", text: "Reservas directas con cobro online y disponibilidad sincronizada con los demás canales.", tier: "base" },
      { icon: Smartphone, title: "Check-in y check-out online", text: "El huésped completa sus datos antes de llegar y recibe su cuenta en el celular.", tier: "base" },
      { icon: BedDouble, title: "Housekeeping y mantenimiento", text: "Estado de habitaciones en vivo y tareas asignadas a cada mucama y técnico.", tier: "base" },
      { icon: ChartNoAxesCombined, title: "Tablero de ocupación e ingresos", text: "Ocupación, tarifa promedio e ingresos por habitación al día.", tier: "base" },
      { icon: ConciergeBell, title: "Conserje IA por WhatsApp", text: "Responde consultas, toma reservas y gestiona pedidos durante la estadía, las 24 horas.", tier: "ia" },
      { icon: TrendingUp, title: "Tarifas dinámicas", text: "Sugiere precios según demanda, temporada y eventos de la zona.", tier: "ia" },
      { icon: Sparkles, title: "Ventas adicionales automáticas", text: "Ofrece mejoras de habitación, traslados y experiencias en el momento oportuno.", tier: "ia" },
      { icon: UsersRound, title: "Ocupación de áreas comunes", text: "Cuánta gente hay en lobby, desayunador, pileta y spa para asignar personal a tiempo.", tier: "vision" },
      { icon: Cctv, title: "Seguridad de accesos y pasillos", text: "Detecta ingresos fuera de horario y permanencias inusuales sin intervención del personal.", tier: "vision" },
      { icon: CarFront, title: "Control de estacionamiento", text: "Reconoce el vehículo del huésped y registra cada entrada y salida.", tier: "vision" },
    ],
    vision: {
      zone: "Lobby · recepción",
      detections: [
        { label: "Fila recepción: 5", tone: "warn" },
        { label: "Huésped · hab. 204", tone: "ok" },
        { label: "Acceso de servicio abierto", tone: "alert" },
      ],
      events: [
        { text: "Recepción con 5 personas esperando", tone: "warn" },
        { text: "Desayunador al 85% de ocupación", tone: "ok" },
        { text: "Acceso de servicio abierto fuera de horario", tone: "alert" },
        { text: "Vehículo del huésped 204 ingresó a cochera", tone: "ok" },
      ],
    },
    comparison: {
      before: [
        "Disponibilidad cargada a mano",
        "Check-in con fichas en papel",
        "Habitaciones coordinadas por radio",
        "Consultas sin responder de noche",
        "Tarifas fijas todo el año",
        "Servicios adicionales sin ofrecer",
      ],
      after: [
        "Disponibilidad sincronizada",
        "Check-in online",
        "Estado de habitaciones en vivo",
        "Atención automática las 24 horas",
        "Tarifas según la demanda",
        "Ofertas automáticas durante la estadía",
      ],
    },
    benefits: [
      "Más reservas directas y menos comisiones.",
      "Llegadas más ágiles.",
      "Habitaciones disponibles antes.",
      "Consultas respondidas a toda hora.",
      "Más ingresos por servicios adicionales.",
      "Mejor ocupación en temporada baja.",
    ],
    form: {
      nameLabel: "Nombre del alojamiento",
      namePlaceholder: "Ej: Posada del Valle",
      volumeLabel: "Cantidad de habitaciones o unidades",
      volumeOptions: ["Menos de 10", "10 a 30", "30 a 100", "Más de 100"],
      channelsLabel: "¿Por dónde reciben hoy las reservas?",
      channels: ["Booking", "Airbnb", "WhatsApp", "Teléfono", "Web propia", "Agencias", "Redes sociales", "Otro"],
      subtypes: ["Hotel", "Cabañas / complejo", "Apart hotel", "Hostel", "Bodega con alojamiento", "Agencia / operador turístico", "Otro"],
      currentSystems: GENERIC_SYSTEMS,
      mainProblemPlaceholder: "Ej: Perdemos reservas porque de noche nadie responde...",
    },
  },

  /* ------------------------------------------------------------------ */
  {
    id: "mineria",
    label: "Minería y energía",
    icon: Pickaxe,
    noun: "tu operación",
    each: "cada operación",
    hero: {
      eyebrow: "Operaciones críticas bajo control",
      title: "Seguridad verificada.",
      highlight: "Equipos produciendo.",
      text: "Personas, equipos, contratistas y procesos monitoreados en sitios remotos, con alertas que llegan antes de que un desvío se convierta en un incidente.",
    },
    flow: [
      { icon: IdCard, label: "Ingreso", status: "Personal habilitado" },
      { icon: HardHat, label: "Seguridad", status: "EPP verificado" },
      { icon: Truck, label: "Equipos", status: "14 en operación" },
      { icon: Activity, label: "Proceso", status: "Cinta 3 normal" },
      { icon: BarChart3, label: "Reporte", status: "Turno cerrado" },
    ],
    chain: ["Accesos", "Seguridad", "Equipos", "Proceso", "Reportes"],
    problemsTitle: "¿Estos riesgos están presentes en tu operación?",
    problems: [
      {
        icon: HardHat,
        title: "Seguridad en zonas críticas",
        consequence: "En un sitio remoto, cada minuto sin detectar un riesgo cuenta.",
        before: ["Supervisión por rondas", "Zonas de exclusión señalizadas, no vigiladas", "Incidentes informados después", "Evidencia incompleta"],
        after: ["Detección continua de EPP", "Alerta al cruzar zonas de exclusión", "Aviso inmediato a supervisión", "Registro con imagen de cada evento"],
      },
      {
        icon: Wrench,
        title: "Equipos parados sin aviso previo",
        consequence: "Una hora de equipo pesado detenido cuesta más que todo su plan de mantenimiento.",
        before: ["Mantenimiento por calendario", "Fallas imprevistas", "Repuestos pedidos de urgencia", "Disponibilidad desconocida"],
        after: ["Mantenimiento según uso real", "Alertas tempranas de falla", "Repuestos planificados", "Disponibilidad por equipo en vivo"],
      },
      {
        icon: FileText,
        title: "Reportes de turno manuales",
        consequence: "La información del turno llega tarde y distinta según quién la cargue.",
        before: ["Parte de turno en papel", "Datos recargados en planillas", "Diferencias entre turnos", "Indicadores con días de atraso"],
        after: ["Parte de turno digital", "Datos cargados una sola vez", "Mismo criterio en todos los turnos", "Indicadores disponibles al cierre"],
      },
      {
        icon: IdCard,
        title: "Contratistas e ingresos al sitio",
        consequence: "Un ingreso con habilitaciones vencidas es un riesgo legal y operativo.",
        before: ["Documentación en carpetas", "Controles manuales en garita", "Vencimientos que se pasan", "Demoras en cada ingreso"],
        after: ["Legajos digitales por persona", "Vencimientos alertados", "Ingreso validado automáticamente", "Trazabilidad de quién está en sitio"],
      },
    ],
    solutionsTitle: "Un sistema diseñado alrededor de tu operación",
    solutionsText:
      "Para minería, petróleo y gas, energía renovable y servicios en sitios remotos: seguridad, disponibilidad y cumplimiento con evidencia.",
    services: [
      { icon: ClipboardList, title: "Parte de turno digital", text: "Producción, novedades y relevos cargados una vez y disponibles para todos.", tier: "base" },
      { icon: Wrench, title: "Mantenimiento de equipos pesados", text: "Planes por horas de uso, historial y disponibilidad de cada equipo.", tier: "base" },
      { icon: ChartNoAxesCombined, title: "Tablero de indicadores", text: "Producción, disponibilidad y seguridad por turno, sector y contratista.", tier: "base" },
      { icon: BadgeCheck, title: "Gestión de contratistas", text: "La IA lee habilitaciones, controla vencimientos y valida cada ingreso al sitio.", tier: "ia" },
      { icon: BrainCircuit, title: "Predicción de fallas", text: "Analiza datos de los equipos para anticipar paradas no programadas.", tier: "ia" },
      { icon: FileCheck2, title: "Reportes ambientales y regulatorios", text: "Arma los informes periódicos con los datos que ya registra la operación.", tier: "ia" },
      { icon: HardHat, title: "EPP y zonas de exclusión", text: "Detecta falta de casco, chaleco o arnés y personas en áreas restringidas.", tier: "vision" },
      { icon: ScanFace, title: "Fatiga de operadores", text: "Identifica somnolencia y distracción en cabina de equipos y camiones.", tier: "vision" },
      { icon: Activity, title: "Monitoreo de cintas transportadoras", text: "Detecta derrames, desalineación, atascos y material fuera de medida.", tier: "vision" },
      { icon: Flame, title: "Detección de humo, fuego y fugas", text: "Aviso temprano en plantas, subestaciones y áreas de almacenamiento.", tier: "vision" },
      { icon: ScanLine, title: "Control vehicular por patente", text: "Registra cada vehículo que entra y sale del sitio y su tiempo de permanencia.", tier: "vision" },
    ],
    vision: {
      zone: "Planta · cinta 3",
      detections: [
        { label: "EPP completo", tone: "ok" },
        { label: "Derrame en cinta 3", tone: "warn" },
        { label: "Zona de exclusión", tone: "alert" },
      ],
      events: [
        { text: "Turno B: 46 personas con EPP completo", tone: "ok" },
        { text: "Derrame detectado en cinta 3", tone: "warn" },
        { text: "Persona en zona de exclusión de carga", tone: "alert" },
        { text: "Signos de fatiga · operador de camión 12", tone: "alert" },
      ],
    },
    comparison: {
      before: [
        "Supervisión de seguridad por rondas",
        "Mantenimiento por calendario",
        "Parte de turno en papel",
        "Habilitaciones en carpetas",
        "Incidentes informados después",
        "Indicadores con días de atraso",
      ],
      after: [
        "Monitoreo continuo con cámaras e IA",
        "Mantenimiento según uso real",
        "Parte de turno digital",
        "Ingresos validados automáticamente",
        "Alertas en el momento",
        "Indicadores al cierre de cada turno",
      ],
    },
    benefits: [
      "Menos exposición a incidentes graves.",
      "Mayor disponibilidad de equipos.",
      "Evidencia para auditorías y autoridades.",
      "Contratistas siempre habilitados.",
      "Información uniforme entre turnos.",
      "Supervisión de sitios remotos a distancia.",
    ],
    form: {
      nameLabel: "Nombre de la empresa",
      namePlaceholder: "Ej: Servicios Mineros del Sur",
      volumeLabel: "Personas en el sitio por turno",
      volumeOptions: ["Menos de 30", "30 a 100", "100 a 400", "Más de 400"],
      channelsLabel: "¿Cómo registran hoy la operación?",
      channels: ["Papel", "Planillas de Excel", "ERP", "Sistema de despacho", "Cámaras sin análisis", "Otro"],
      subtypes: ["Minería", "Petróleo y gas", "Energía solar / eólica", "Servicios para minería", "Cantera / áridos", "Planta de procesamiento", "Otro"],
      currentSystems: GENERIC_SYSTEMS,
      mainProblemPlaceholder: "Ej: Necesitamos controlar el uso de EPP en todos los turnos...",
    },
  },
];

export const DEFAULT_INDUSTRY: IndustryId = "gastronomia";

export function getIndustry(id: string | null | undefined): Industry {
  return INDUSTRIES.find((i) => i.id === id) ?? INDUSTRIES[0];
}

export const TIER_META: Record<ServiceTier, { label: string; icon: LucideIcon }> = {
  base: { label: "Digitalización", icon: Building2 },
  ia: { label: "Automatización con IA", icon: Sparkles },
  vision: { label: "Visión IA con cámaras", icon: Cctv },
};
