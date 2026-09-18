import {
  BarChart3,
  Boxes,
  CalendarDays,
  CalendarRange,
  Car,
  ClipboardList,
  CreditCard,
  FolderTree,
  Home,
  LayoutGrid,
  Package,
  Percent,
  QrCode,
  Receipt,
  ScanLine,
  Settings,
  ShoppingBag,
  Sparkles,
  Ticket,
  Users,
  UsersRound,
  Warehouse,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ModuleId } from "@/types";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  exact?: boolean;
}

export interface ModuleMeta {
  id: ModuleId;
  name: string;
  shortName: string;
  tagline: string;
  icon: LucideIcon;
  base: string;
  nav: NavItem[];
}

export const modules: ModuleMeta[] = [
  {
    id: "event",
    name: "Event",
    shortName: "Events",
    tagline: "Booking & Management",
    icon: Ticket,
    base: "/app/events",
    nav: [
      { label: "Overview", to: "/app/events", icon: Home, exact: true },
      { label: "Events", to: "/app/events/list", icon: Sparkles },
      { label: "Calendar", to: "/app/events/calendar", icon: CalendarDays },
      { label: "Bookings", to: "/app/events/bookings", icon: ClipboardList },
      { label: "Attendees", to: "/app/events/attendees", icon: UsersRound },
      { label: "Tickets", to: "/app/events/tickets", icon: Ticket },
      { label: "Check-in", to: "/app/events/checkin", icon: ScanLine },
    ],
  },
  {
    id: "commerce",
    name: "Commerce",
    shortName: "Commerce",
    tagline: "Merchandise & Inventory",
    icon: ShoppingBag,
    base: "/app/commerce",
    nav: [
      { label: "Overview", to: "/app/commerce", icon: Home, exact: true },
      { label: "Products", to: "/app/commerce/products", icon: Package },
      { label: "Categories", to: "/app/commerce/categories", icon: FolderTree },
      { label: "Inventory", to: "/app/commerce/inventory", icon: Boxes },
      { label: "Orders", to: "/app/commerce/orders", icon: Receipt },
      { label: "Customers", to: "/app/commerce/customers", icon: Users },
      { label: "Discounts", to: "/app/commerce/discounts", icon: Percent },
    ],
  },
  {
    id: "autocare",
    name: "Auto Care",
    shortName: "Auto Care",
    tagline: "Car Wash & Detailing",
    icon: Car,
    base: "/app/autocare",
    nav: [
      { label: "Overview", to: "/app/autocare", icon: Home, exact: true },
      { label: "Appointments", to: "/app/autocare/appointments", icon: ClipboardList },
      { label: "Calendar", to: "/app/autocare/calendar", icon: CalendarRange },
      { label: "Vehicles", to: "/app/autocare/vehicles", icon: Car },
      { label: "Services", to: "/app/autocare/services", icon: Sparkles },
      { label: "Work Orders", to: "/app/autocare/work-orders", icon: Wrench },
      { label: "Staff", to: "/app/autocare/staff", icon: UsersRound },
      { label: "Bays", to: "/app/autocare/bays", icon: Warehouse },
      { label: "Customers", to: "/app/autocare/customers", icon: Users },
      { label: "Payments", to: "/app/autocare/payments", icon: CreditCard },
    ],
  },
];

export const globalNav: NavItem[] = [
  { label: "Overview", to: "/app", icon: LayoutGrid, exact: true },
  { label: "Customers", to: "/app/customers", icon: Users },
  { label: "Reports", to: "/app/reports", icon: BarChart3 },
];

export const settingsNav: NavItem = { label: "Settings", to: "/app/settings", icon: Settings };

export { QrCode };

export function moduleFromPath(pathname: string): ModuleMeta | null {
  return modules.find((m) => pathname === m.base || pathname.startsWith(m.base + "/")) ?? null;
}

export function moduleById(id: ModuleId) {
  return modules.find((m) => m.id === id)!;
}
