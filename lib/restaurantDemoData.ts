export type BusinessType = "hamburgueseria" | "pizzeria" | "cafeteria";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  current: number;
  max: number;
  min: number;
  updatedLabel: string;
}

export type RecipeMap = Record<string, { ingredientId: string; qty: number }[]>;

export type OrderStatus = "nuevo" | "preparacion" | "listo" | "entregado";

export interface DemoOrder {
  id: number;
  items: { name: string; qty: number; extras?: string[] }[];
  total: number;
  channel: string;
  deliveryType: "Retiro" | "Salón" | "Delivery";
  paymentMethod: string;
  status: OrderStatus;
  createdAt: number;
}

export interface CustomerProfile {
  name: string;
  points: number;
  level: string;
  ordersCount: number;
  favorite: string;
  lastPurchase: string;
}

export type InsightLevel = "alta" | "oportunidad" | "info";

export interface RestaurantProfile {
  id: BusinessType;
  label: string;
  name: string;
  menu: MenuItem[];
  ingredients: Ingredient[];
  recipes: RecipeMap;
  topProduct: string;
  aiInsights: { text: string; level: InsightLevel }[];
  customer: CustomerProfile;
  seedOrders: DemoOrder[];
  hourlySales: number[];
  channelSplit: { channel: string; value: number }[];
  weeklyComparison: { day: string; actual: number; anterior: number }[];
  extras: string[];
  salesToday: number;
  ordersToday: number;
  weeklyGrowth: number;
}

const now = () => Date.now();

const PROFILES: Record<BusinessType, RestaurantProfile> = {
  hamburgueseria: {
    id: "hamburgueseria",
    label: "Hamburguesería",
    name: "Distrito Burger",
    menu: [
      { id: "h-clasica", name: "Burger Clásica", price: 8900, category: "Hamburguesas", available: true },
      { id: "h-doble", name: "Burger Doble", price: 10900, category: "Hamburguesas", available: true },
      { id: "h-papas", name: "Papas con cheddar", price: 5200, category: "Acompañamientos", available: true },
      { id: "h-combo", name: "Combo Nexxora", price: 14500, category: "Combos", available: true },
    ],
    ingredients: [
      { id: "h-pan", name: "Pan brioche", unit: "unidades", current: 34, max: 120, min: 20, updatedLabel: "Hace 5 min" },
      { id: "h-medallon", name: "Medallones", unit: "unidades", current: 58, max: 150, min: 30, updatedLabel: "Hace 8 min" },
      { id: "h-cheddar", name: "Queso cheddar", unit: "porciones", current: 22, max: 100, min: 25, updatedLabel: "Hace 2 min" },
      { id: "h-papas-ing", name: "Papas", unit: "kg", current: 14, max: 40, min: 8, updatedLabel: "Hace 12 min" },
      { id: "h-bebidas", name: "Bebidas", unit: "unidades", current: 46, max: 80, min: 15, updatedLabel: "Hace 20 min" },
    ],
    recipes: {
      "h-clasica": [{ ingredientId: "h-pan", qty: 1 }, { ingredientId: "h-medallon", qty: 1 }, { ingredientId: "h-cheddar", qty: 1 }],
      "h-doble": [{ ingredientId: "h-pan", qty: 1 }, { ingredientId: "h-medallon", qty: 2 }, { ingredientId: "h-cheddar", qty: 2 }],
      "h-papas": [{ ingredientId: "h-papas-ing", qty: 1 }],
      "h-combo": [{ ingredientId: "h-pan", qty: 1 }, { ingredientId: "h-medallon", qty: 2 }, { ingredientId: "h-cheddar", qty: 2 }, { ingredientId: "h-papas-ing", qty: 1 }, { ingredientId: "h-bebidas", qty: 1 }],
    },
    topProduct: "Burger Doble",
    aiInsights: [
      { text: "El cheddar alcanzará aproximadamente para dos días.", level: "alta" },
      { text: "El Combo Nexxora vende más entre las 20:00 y las 22:00.", level: "info" },
      { text: "La Burger Doble tiene mayor margen que la Burger Clásica.", level: "oportunidad" },
      { text: "Se detectaron más pedidos los viernes por la noche.", level: "info" },
      { text: "Conviene revisar el stock de pan antes de mañana.", level: "alta" },
      { text: "Podrías crear una promoción para clientes que no compran hace 30 días.", level: "oportunidad" },
    ],
    customer: { name: "Martina López", points: 320, level: "Frecuente", ordersCount: 14, favorite: "Burger Doble", lastPurchase: "Hace 3 días" },
    seedOrders: [
      { id: 124, items: [{ name: "Burger Clásica", qty: 2 }, { name: "Papas con cheddar", qty: 1 }], total: 23000, channel: "Salón", deliveryType: "Salón", paymentMethod: "Efectivo", status: "listo", createdAt: now() - 14 * 60000 },
      { id: 125, items: [{ name: "Combo Nexxora", qty: 1 }], total: 14500, channel: "App", deliveryType: "Delivery", paymentMethod: "Online", status: "preparacion", createdAt: now() - 6 * 60000 },
      { id: 126, items: [{ name: "Burger Doble", qty: 1, extras: ["Extra bacon"] }], total: 11900, channel: "WhatsApp", deliveryType: "Retiro", paymentMethod: "Transferencia", status: "nuevo", createdAt: now() - 2 * 60000 },
    ],
    hourlySales: [42000, 168000, 210000, 96000, 41000, 38000, 52000, 89000, 154000, 236000, 158000],
    channelSplit: [{ channel: "Salón", value: 38 }, { channel: "App", value: 34 }, { channel: "WhatsApp", value: 16 }, { channel: "Delivery", value: 12 }],
    weeklyComparison: [
      { day: "Lun", actual: 780000, anterior: 690000 },
      { day: "Mar", actual: 820000, anterior: 710000 },
      { day: "Mié", actual: 910000, anterior: 780000 },
      { day: "Jue", actual: 960000, anterior: 840000 },
      { day: "Vie", actual: 1180000, anterior: 1020000 },
      { day: "Sáb", actual: 1420000, anterior: 1190000 },
      { day: "Dom", actual: 1284500, anterior: 1080000 },
    ],
    extras: ["Extra cheddar", "Extra bacon", "Sin cebolla"],
    salesToday: 1284500,
    ordersToday: 147,
    weeklyGrowth: 18,
  },
  pizzeria: {
    id: "pizzeria",
    label: "Pizzería",
    name: "Forno Pizza",
    menu: [
      { id: "p-muzza", name: "Muzza grande", price: 11900, category: "Pizzas", available: true },
      { id: "p-especial", name: "Especial", price: 14200, category: "Pizzas", available: true },
      { id: "p-fugazzeta", name: "Fugazzeta", price: 13600, category: "Pizzas", available: true },
      { id: "p-combo", name: "Combo familiar", price: 24900, category: "Combos", available: true },
    ],
    ingredients: [
      { id: "p-harina", name: "Harina", unit: "kg", current: 28, max: 80, min: 15, updatedLabel: "Hace 10 min" },
      { id: "p-mozza", name: "Mozzarella", unit: "kg", current: 12, max: 60, min: 15, updatedLabel: "Hace 4 min" },
      { id: "p-salsa", name: "Salsa de tomate", unit: "litros", current: 18, max: 50, min: 10, updatedLabel: "Hace 15 min" },
      { id: "p-jamon", name: "Jamón", unit: "kg", current: 9, max: 30, min: 8, updatedLabel: "Hace 7 min" },
      { id: "p-aceitunas", name: "Aceitunas", unit: "kg", current: 6, max: 20, min: 5, updatedLabel: "Hace 25 min" },
    ],
    recipes: {
      "p-muzza": [{ ingredientId: "p-harina", qty: 1 }, { ingredientId: "p-mozza", qty: 1 }, { ingredientId: "p-salsa", qty: 1 }],
      "p-especial": [{ ingredientId: "p-harina", qty: 1 }, { ingredientId: "p-mozza", qty: 1 }, { ingredientId: "p-jamon", qty: 1 }, { ingredientId: "p-aceitunas", qty: 1 }],
      "p-fugazzeta": [{ ingredientId: "p-harina", qty: 1 }, { ingredientId: "p-mozza", qty: 2 }],
      "p-combo": [{ ingredientId: "p-harina", qty: 2 }, { ingredientId: "p-mozza", qty: 2 }, { ingredientId: "p-salsa", qty: 1 }, { ingredientId: "p-jamon", qty: 1 }],
    },
    topProduct: "Especial",
    aiInsights: [
      { text: "La mozzarella alcanzará aproximadamente para dos días.", level: "alta" },
      { text: "El Combo familiar vende más entre las 20:00 y las 22:00.", level: "info" },
      { text: "La pizza Especial tiene mayor margen que la Muzza grande.", level: "oportunidad" },
      { text: "Se detectaron más pedidos los viernes por la noche.", level: "info" },
      { text: "Conviene revisar el stock de harina antes de mañana.", level: "alta" },
      { text: "Podrías crear una promoción para clientes que no compran hace 30 días.", level: "oportunidad" },
    ],
    customer: { name: "Julián Ferreyra", points: 280, level: "Frecuente", ordersCount: 11, favorite: "Especial", lastPurchase: "Hace 5 días" },
    seedOrders: [
      { id: 124, items: [{ name: "Muzza grande", qty: 1 }, { name: "Fugazzeta", qty: 1 }], total: 25500, channel: "Salón", deliveryType: "Salón", paymentMethod: "Efectivo", status: "listo", createdAt: now() - 16 * 60000 },
      { id: 125, items: [{ name: "Combo familiar", qty: 1 }], total: 24900, channel: "App", deliveryType: "Delivery", paymentMethod: "Online", status: "preparacion", createdAt: now() - 7 * 60000 },
      { id: 126, items: [{ name: "Especial", qty: 1, extras: ["Borde relleno"] }], total: 15700, channel: "WhatsApp", deliveryType: "Retiro", paymentMethod: "Transferencia", status: "nuevo", createdAt: now() - 3 * 60000 },
    ],
    hourlySales: [30000, 120000, 165000, 88000, 36000, 34000, 48000, 96000, 175000, 260000, 190000],
    channelSplit: [{ channel: "Salón", value: 30 }, { channel: "App", value: 30 }, { channel: "WhatsApp", value: 22 }, { channel: "Delivery", value: 18 }],
    weeklyComparison: [
      { day: "Lun", actual: 690000, anterior: 610000 },
      { day: "Mar", actual: 720000, anterior: 640000 },
      { day: "Mié", actual: 800000, anterior: 700000 },
      { day: "Jue", actual: 860000, anterior: 760000 },
      { day: "Vie", actual: 1320000, anterior: 1080000 },
      { day: "Sáb", actual: 1560000, anterior: 1290000 },
      { day: "Dom", actual: 1180000, anterior: 990000 },
    ],
    extras: ["Extra muzzarella", "Borde relleno", "Sin aceitunas"],
    salesToday: 1180000,
    ordersToday: 132,
    weeklyGrowth: 15,
  },
  cafeteria: {
    id: "cafeteria",
    label: "Cafetería",
    name: "Norte Café",
    menu: [
      { id: "c-latte", name: "Café latte", price: 3800, category: "Bebidas calientes", available: true },
      { id: "c-cappuccino", name: "Cappuccino", price: 4200, category: "Bebidas calientes", available: true },
      { id: "c-tostado", name: "Tostado", price: 6900, category: "Comidas", available: true },
      { id: "c-combo", name: "Combo desayuno", price: 9800, category: "Combos", available: true },
    ],
    ingredients: [
      { id: "c-cafe", name: "Café", unit: "kg", current: 6, max: 20, min: 5, updatedLabel: "Hace 6 min" },
      { id: "c-leche", name: "Leche", unit: "litros", current: 14, max: 40, min: 10, updatedLabel: "Hace 3 min" },
      { id: "c-pan", name: "Pan", unit: "unidades", current: 26, max: 90, min: 20, updatedLabel: "Hace 9 min" },
      { id: "c-queso", name: "Queso", unit: "kg", current: 4, max: 15, min: 5, updatedLabel: "Hace 11 min" },
      { id: "c-vasos", name: "Vasos", unit: "unidades", current: 60, max: 200, min: 40, updatedLabel: "Hace 18 min" },
    ],
    recipes: {
      "c-latte": [{ ingredientId: "c-cafe", qty: 1 }, { ingredientId: "c-leche", qty: 1 }, { ingredientId: "c-vasos", qty: 1 }],
      "c-cappuccino": [{ ingredientId: "c-cafe", qty: 1 }, { ingredientId: "c-leche", qty: 1 }, { ingredientId: "c-vasos", qty: 1 }],
      "c-tostado": [{ ingredientId: "c-pan", qty: 2 }, { ingredientId: "c-queso", qty: 1 }],
      "c-combo": [{ ingredientId: "c-cafe", qty: 1 }, { ingredientId: "c-leche", qty: 1 }, { ingredientId: "c-pan", qty: 2 }, { ingredientId: "c-queso", qty: 1 }, { ingredientId: "c-vasos", qty: 1 }],
    },
    topProduct: "Cappuccino",
    aiInsights: [
      { text: "El queso alcanzará aproximadamente para dos días.", level: "alta" },
      { text: "El Combo desayuno vende más entre las 8:00 y las 10:00.", level: "info" },
      { text: "El Cappuccino tiene mayor margen que el Café latte.", level: "oportunidad" },
      { text: "Se detectaron más pedidos los sábados a la mañana.", level: "info" },
      { text: "Conviene revisar el stock de café antes de mañana.", level: "alta" },
      { text: "Podrías crear una promoción para clientes que no compran hace 30 días.", level: "oportunidad" },
    ],
    customer: { name: "Sofía Ramallo", points: 210, level: "Nuevo", ordersCount: 4, favorite: "Cappuccino", lastPurchase: "Hace 1 día" },
    seedOrders: [
      { id: 124, items: [{ name: "Café latte", qty: 2 }, { name: "Tostado", qty: 1 }], total: 14500, channel: "Mostrador", deliveryType: "Salón", paymentMethod: "Efectivo", status: "listo", createdAt: now() - 10 * 60000 },
      { id: 125, items: [{ name: "Combo desayuno", qty: 1 }], total: 9800, channel: "App", deliveryType: "Retiro", paymentMethod: "Online", status: "preparacion", createdAt: now() - 5 * 60000 },
      { id: 126, items: [{ name: "Cappuccino", qty: 1, extras: ["Extra shot"] }], total: 4900, channel: "Mostrador", deliveryType: "Salón", paymentMethod: "Efectivo", status: "nuevo", createdAt: now() - 1 * 60000 },
    ],
    hourlySales: [96000, 150000, 88000, 52000, 44000, 40000, 58000, 62000, 74000, 90000, 60000],
    channelSplit: [{ channel: "Mostrador", value: 46 }, { channel: "App", value: 28 }, { channel: "WhatsApp", value: 14 }, { channel: "Delivery", value: 12 }],
    weeklyComparison: [
      { day: "Lun", actual: 420000, anterior: 380000 },
      { day: "Mar", actual: 440000, anterior: 400000 },
      { day: "Mié", actual: 460000, anterior: 410000 },
      { day: "Jue", actual: 480000, anterior: 430000 },
      { day: "Vie", actual: 520000, anterior: 470000 },
      { day: "Sáb", actual: 680000, anterior: 590000 },
      { day: "Dom", actual: 540000, anterior: 480000 },
    ],
    extras: ["Leche deslactosada", "Extra shot", "Sin azúcar"],
    salesToday: 614000,
    ordersToday: 98,
    weeklyGrowth: 11,
  },
};

export function getInitialProfile(type: BusinessType): RestaurantProfile {
  return JSON.parse(JSON.stringify(PROFILES[type]));
}

export const BUSINESS_TYPES: { id: BusinessType; label: string }[] = [
  { id: "hamburgueseria", label: "Hamburguesería" },
  { id: "pizzeria", label: "Pizzería" },
  { id: "cafeteria", label: "Cafetería" },
];
