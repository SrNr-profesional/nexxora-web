import {
  Home,
  Target,
  Building2,
  KanbanSquare,
  Phone,
  CheckSquare,
  CalendarDays,
  Briefcase,
  DollarSign,
  FileText,
  Rocket,
  Brain,
  TrendingUp,
  XCircle,
  Activity,
  Settings,
  Inbox,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "General",
    items: [
      { href: "/admin", label: "Dashboard", icon: Home },
      { href: "/admin/hoy", label: "Hoy", icon: Target },
    ],
  },
  {
    label: "Ventas",
    items: [
      { href: "/admin/prospectos", label: "Prospectos", icon: Building2 },
      { href: "/admin/pipeline", label: "Pipeline", icon: KanbanSquare },
      { href: "/admin/seguimientos", label: "Seguimientos", icon: Phone },
      { href: "/admin/tareas", label: "Tareas", icon: CheckSquare },
      { href: "/admin/agenda", label: "Agenda", icon: CalendarDays },
    ],
  },
  {
    label: "Clientes",
    items: [
      { href: "/admin/clientes", label: "Clientes", icon: Briefcase },
      { href: "/admin/ventas", label: "Ventas / MRR", icon: DollarSign },
      { href: "/admin/propuestas", label: "Propuestas", icon: FileText },
      { href: "/admin/implementaciones", label: "Implementaciones", icon: Rocket },
    ],
  },
  {
    label: "Análisis",
    items: [
      { href: "/admin/inteligencia", label: "Inteligencia comercial", icon: Brain },
      { href: "/admin/estadisticas", label: "Estadísticas", icon: TrendingUp },
      { href: "/admin/perdidos", label: "Leads perdidos", icon: XCircle },
      { href: "/admin/actividad", label: "Actividad", icon: Activity },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/admin/formulario-web", label: "Formulario web", icon: Inbox },
      { href: "/admin/configuracion", label: "Configuración", icon: Settings },
    ],
  },
];

// Los 5 accesos prioritarios para el uso diario desde celular (punto 42).
export const MOBILE_PRIORITY: NavItem[] = [
  { href: "/admin/hoy", label: "Hoy", icon: Target },
  { href: "/admin/prospectos", label: "Prospectos", icon: Building2 },
  { href: "/admin/tareas", label: "Tareas", icon: CheckSquare },
  { href: "/admin/seguimientos", label: "Seguim.", icon: Phone },
];
