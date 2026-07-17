"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import {
  BusinessType,
  CustomerProfile,
  DemoOrder,
  Ingredient,
  InsightLevel,
  MenuItem,
  RecipeMap,
  getInitialProfile,
} from "@/lib/restaurantDemoData";

interface DemoState {
  businessType: BusinessType;
  name: string;
  menu: MenuItem[];
  ingredients: Ingredient[];
  recipes: RecipeMap;
  topProduct: string;
  aiInsights: { text: string; level: InsightLevel }[];
  customer: CustomerProfile;
  orders: DemoOrder[];
  hourlySales: number[];
  channelSplit: { channel: string; value: number }[];
  weeklyComparison: { day: string; actual: number; anterior: number }[];
  extras: string[];
  salesToday: number;
  ordersToday: number;
  weeklyGrowth: number;
  lastOrderId: number;
  notice: string | null;
}

type PlaceOrderPayload = {
  items: { itemId: string; name: string; qty: number; extras?: string[]; price: number }[];
  deliveryType: DemoOrder["deliveryType"];
  paymentMethod: string;
  channel: string;
};

type Action =
  | { type: "SET_BUSINESS_TYPE"; payload: BusinessType }
  | { type: "UPDATE_PRICE"; payload: { itemId: string; price: number } }
  | { type: "TOGGLE_AVAILABILITY"; payload: { itemId: string } }
  | { type: "PLACE_ORDER"; payload: PlaceOrderPayload }
  | { type: "ADVANCE_ORDER"; payload: { orderId: number } }
  | { type: "RESET" }
  | { type: "CLEAR_NOTICE" };

function buildInitialState(type: BusinessType): DemoState {
  const profile = getInitialProfile(type);
  const maxSeedId = profile.seedOrders.reduce((max, o) => Math.max(max, o.id), 0);
  return {
    businessType: profile.id,
    name: profile.name,
    menu: profile.menu,
    ingredients: profile.ingredients,
    recipes: profile.recipes,
    topProduct: profile.topProduct,
    aiInsights: profile.aiInsights,
    customer: profile.customer,
    orders: profile.seedOrders,
    hourlySales: profile.hourlySales,
    channelSplit: profile.channelSplit,
    weeklyComparison: profile.weeklyComparison,
    extras: profile.extras,
    salesToday: profile.salesToday,
    ordersToday: profile.ordersToday,
    weeklyGrowth: profile.weeklyGrowth,
    lastOrderId: maxSeedId + 1,
    notice: null,
  };
}

const ORDER_STEPS: DemoOrder["status"][] = ["nuevo", "preparacion", "listo", "entregado"];

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case "SET_BUSINESS_TYPE":
      return buildInitialState(action.payload);

    case "RESET":
      return buildInitialState(state.businessType);

    case "UPDATE_PRICE":
      return {
        ...state,
        menu: state.menu.map((m) => (m.id === action.payload.itemId ? { ...m, price: action.payload.price } : m)),
        notice: "Actualizado en tiempo real",
      };

    case "TOGGLE_AVAILABILITY":
      return {
        ...state,
        menu: state.menu.map((m) => (m.id === action.payload.itemId ? { ...m, available: !m.available } : m)),
      };

    case "PLACE_ORDER": {
      const { items, deliveryType, paymentMethod, channel } = action.payload;
      const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);
      const newId = state.lastOrderId + 1;

      const ingredientDeductions = new Map<string, number>();
      items.forEach((item) => {
        const recipe = state.recipes[item.itemId];
        if (!recipe) return;
        recipe.forEach((r) => {
          ingredientDeductions.set(r.ingredientId, (ingredientDeductions.get(r.ingredientId) || 0) + r.qty * item.qty);
        });
      });

      const newOrder: DemoOrder = {
        id: newId,
        items: items.map((i) => ({ name: i.name, qty: i.qty, extras: i.extras })),
        total,
        channel,
        deliveryType,
        paymentMethod,
        status: "nuevo",
        createdAt: Date.now(),
      };

      const hourlySales = [...state.hourlySales];
      hourlySales[hourlySales.length - 1] = hourlySales[hourlySales.length - 1] + total;

      const channelSplit = state.channelSplit.some((c) => c.channel === channel)
        ? state.channelSplit.map((c) => (c.channel === channel ? { ...c, value: c.value + 4 } : c))
        : [...state.channelSplit, { channel, value: 10 }];

      return {
        ...state,
        lastOrderId: newId,
        orders: [newOrder, ...state.orders],
        ingredients: state.ingredients.map((ing) => {
          const deduction = ingredientDeductions.get(ing.id);
          if (!deduction) return ing;
          return { ...ing, current: Math.max(0, ing.current - deduction), updatedLabel: "Recién" };
        }),
        salesToday: state.salesToday + total,
        ordersToday: state.ordersToday + 1,
        hourlySales,
        channelSplit,
        customer: {
          ...state.customer,
          points: state.customer.points + Math.max(5, Math.round(total / 100)),
          ordersCount: state.customer.ordersCount + 1,
          lastPurchase: "Recién",
        },
        notice: `Pedido #${newId} enviado a cocina`,
      };
    }

    case "ADVANCE_ORDER": {
      return {
        ...state,
        orders: state.orders.map((o) => {
          if (o.id !== action.payload.orderId) return o;
          const idx = ORDER_STEPS.indexOf(o.status);
          const next = ORDER_STEPS[Math.min(idx + 1, ORDER_STEPS.length - 1)];
          return { ...o, status: next };
        }),
        notice: (() => {
          const order = state.orders.find((o) => o.id === action.payload.orderId);
          if (!order) return state.notice;
          const idx = ORDER_STEPS.indexOf(order.status);
          const next = ORDER_STEPS[Math.min(idx + 1, ORDER_STEPS.length - 1)];
          return next === "listo" ? "Cliente notificado automáticamente" : state.notice;
        })(),
      };
    }

    case "CLEAR_NOTICE":
      return { ...state, notice: null };

    default:
      return state;
  }
}

interface DemoContextValue {
  state: DemoState;
  setBusinessType: (type: BusinessType) => void;
  updatePrice: (itemId: string, price: number) => void;
  toggleAvailability: (itemId: string) => void;
  placeOrder: (payload: PlaceOrderPayload) => void;
  advanceOrder: (orderId: number) => void;
  reset: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, "hamburgueseria", buildInitialState);
  const noticeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!state.notice) return;
    if (noticeTimeout.current) clearTimeout(noticeTimeout.current);
    noticeTimeout.current = setTimeout(() => dispatch({ type: "CLEAR_NOTICE" }), 3000);
    return () => {
      if (noticeTimeout.current) clearTimeout(noticeTimeout.current);
    };
  }, [state.notice]);

  const setBusinessType = useCallback((type: BusinessType) => dispatch({ type: "SET_BUSINESS_TYPE", payload: type }), []);
  const updatePrice = useCallback((itemId: string, price: number) => dispatch({ type: "UPDATE_PRICE", payload: { itemId, price } }), []);
  const toggleAvailability = useCallback((itemId: string) => dispatch({ type: "TOGGLE_AVAILABILITY", payload: { itemId } }), []);
  const advanceOrder = useCallback((orderId: number) => dispatch({ type: "ADVANCE_ORDER", payload: { orderId } }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const placeOrder = useCallback((payload: PlaceOrderPayload) => dispatch({ type: "PLACE_ORDER", payload }), []);

  const value = useMemo(
    () => ({ state, setBusinessType, updatePrice, toggleAvailability, placeOrder, advanceOrder, reset }),
    [state, setBusinessType, updatePrice, toggleAvailability, placeOrder, advanceOrder, reset]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo debe usarse dentro de <DemoProvider>");
  return ctx;
}

export function nextOrderIdPreview(state: DemoState) {
  return state.lastOrderId + 1;
}
