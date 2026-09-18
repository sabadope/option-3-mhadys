/**
 * Local application store.
 *
 * All domain collections live here and are mutated through `actions`.
 * This is the seam for a future backend: swap the initial state loading and the
 * action bodies for API calls (REST / GraphQL / Supabase) without touching UI.
 */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type {
  Appointment,
  Attendee,
  Bay,
  Booking,
  CartLine,
  Customer,
  Discount,
  Event,
  Notification,
  Order,
  OrderStatus,
  Payment,
  PaymentMethod,
  Product,
  Service,
  StaffMember,
  Vehicle,
  WorkOrder,
  WorkOrderStatus,
} from "@/types";
import { customers as seedCustomers } from "@/data/customers";
import { attendees as seedAttendees, bookings as seedBookings, events as seedEvents } from "@/data/events";
import { discounts as seedDiscounts, orders as seedOrders, products as seedProducts } from "@/data/commerce";
import {
  appointments as seedAppointments,
  bays as seedBays,
  services as seedServices,
  staff as seedStaff,
  vehicles as seedVehicles,
  workOrders as seedWorkOrders,
} from "@/data/autocare";
import { notifications as seedNotifications, payments as seedPayments } from "@/data/shared";
import { nextId } from "./format";

export interface AppState {
  customers: Customer[];
  events: Event[];
  bookings: Booking[];
  attendees: Attendee[];
  products: Product[];
  orders: Order[];
  discounts: Discount[];
  vehicles: Vehicle[];
  appointments: Appointment[];
  workOrders: WorkOrder[];
  bays: Bay[];
  staff: StaffMember[];
  services: Service[];
  payments: Payment[];
  notifications: Notification[];
  cart: CartLine[];
}

const initialState: AppState = {
  customers: seedCustomers,
  events: seedEvents,
  bookings: seedBookings,
  attendees: seedAttendees,
  products: seedProducts,
  orders: seedOrders,
  discounts: seedDiscounts,
  vehicles: seedVehicles,
  appointments: seedAppointments,
  workOrders: seedWorkOrders,
  bays: seedBays,
  staff: seedStaff,
  services: seedServices,
  payments: seedPayments,
  notifications: seedNotifications,
  cart: [],
};

const ORDER_FLOW: OrderStatus[] = ["pending", "confirmed", "processing", "packed", "shipped", "delivered"];
const WO_FLOW: WorkOrderStatus[] = ["booked", "confirmed", "arrived", "in_queue", "in_progress", "quality_check", "completed"];

function nowIso() {
  return new Date().toISOString().slice(0, 19);
}

function createActions(set: (fn: (s: AppState) => AppState) => void) {
  const patch = <K extends keyof AppState>(key: K, fn: (items: AppState[K]) => AppState[K]) =>
    set((s) => ({ ...s, [key]: fn(s[key]) }));

  const notify = (n: Omit<Notification, "id" | "createdAt" | "read">) =>
    patch("notifications", (list) => [{ ...n, id: nextId("n"), createdAt: nowIso(), read: false }, ...list]);

  return {
    /* ---- Notifications ---- */
    notify,
    markRead: (id: string) => patch("notifications", (l) => l.map((n) => (n.id === id ? { ...n, read: true } : n))),
    markAllRead: () => patch("notifications", (l) => l.map((n) => ({ ...n, read: true }))),

    /* ---- Customers ---- */
    addCustomer: (c: Omit<Customer, "id" | "joinedAt" | "tags">) => {
      const customer: Customer = { ...c, id: nextId("c"), joinedAt: nowIso().slice(0, 10), tags: [] };
      patch("customers", (l) => [customer, ...l]);
      return customer;
    },

    /* ---- Events ---- */
    addEvent: (e: Omit<Event, "id">) => {
      const ev: Event = { ...e, id: nextId("ev") };
      patch("events", (l) => [ev, ...l]);
      return ev;
    },
    updateEvent: (id: string, changes: Partial<Event>) =>
      patch("events", (l) => l.map((e) => (e.id === id ? { ...e, ...changes } : e))),
    addBooking: (b: Omit<Booking, "id" | "code" | "createdAt">, attendeeNames: string[], email: string) => {
      const booking: Booking = { ...b, id: nextId("bk"), code: `BK-${20490 + Math.floor(Math.random() * 400) + 1}`, createdAt: nowIso() };
      const newAttendees: Attendee[] = attendeeNames.map((name, i) => ({
        id: nextId("at"),
        bookingId: booking.id,
        eventId: b.eventId,
        ticketTypeId: b.ticketTypeId,
        name,
        email,
        qrCode: `NMB-${b.eventId.toUpperCase().replace("_", "")}-${Math.random().toString(36).slice(2, 7).toUpperCase()}${i}`,
        checkedIn: false,
      }));
      set((s) => ({
        ...s,
        bookings: [booking, ...s.bookings],
        attendees: [...newAttendees, ...s.attendees],
        events: s.events.map((e) =>
          e.id === b.eventId
            ? { ...e, ticketTypes: e.ticketTypes.map((t) => (t.id === b.ticketTypeId ? { ...t, sold: t.sold + b.quantity } : t)) }
            : e,
        ),
      }));
      notify({ module: "event", title: "Booking confirmed", body: `${booking.code} · ${b.quantity} ticket${b.quantity > 1 ? "s" : ""}`, href: "/app/events/bookings" });
      return { booking, attendees: newAttendees };
    },
    updateBookingStatus: (id: string, status: Booking["status"]) =>
      patch("bookings", (l) => l.map((b) => (b.id === id ? { ...b, status } : b))),
    checkInAttendee: (attendeeId: string) =>
      set((s) => {
        const at = s.attendees.find((a) => a.id === attendeeId);
        if (!at) return s;
        return {
          ...s,
          attendees: s.attendees.map((a) => (a.id === attendeeId ? { ...a, checkedIn: true, checkedInAt: nowIso() } : a)),
          bookings: s.bookings.map((b) => (b.id === at.bookingId ? { ...b, status: "checked_in" } : b)),
        };
      }),
    undoCheckIn: (attendeeId: string) =>
      patch("attendees", (l) => l.map((a) => (a.id === attendeeId ? { ...a, checkedIn: false, checkedInAt: undefined } : a))),

    /* ---- Commerce ---- */
    addProduct: (p: Omit<Product, "id" | "createdAt" | "soldCount">) => {
      const product: Product = { ...p, id: nextId("p"), createdAt: nowIso().slice(0, 10), soldCount: 0 };
      patch("products", (l) => [product, ...l]);
      return product;
    },
    updateProduct: (id: string, changes: Partial<Product>) =>
      patch("products", (l) => l.map((p) => (p.id === id ? { ...p, ...changes } : p))),
    adjustStock: (variantId: string, delta: number) =>
      patch("products", (l) =>
        l.map((p) => {
          if (!p.variants.some((v) => v.id === variantId)) return p;
          const variants = p.variants.map((v) => (v.id === variantId ? { ...v, stock: Math.max(0, v.stock + delta) } : v));
          const total = variants.reduce((a, v) => a + v.stock, 0);
          const status: Product["status"] = p.status === "draft" ? "draft" : total === 0 ? "out_of_stock" : "active";
          return { ...p, variants, status };
        }),
      ),
    advanceOrder: (id: string) =>
      set((s) => {
        const order = s.orders.find((o) => o.id === id);
        if (!order) return s;
        const idx = ORDER_FLOW.indexOf(order.status);
        if (idx < 0 || idx === ORDER_FLOW.length - 1) return s;
        const next = ORDER_FLOW[idx + 1]!;
        const changes: Partial<Order> = { status: next, timeline: [...order.timeline, { status: next, at: nowIso() }] };
        if (next === "shipped" && !order.trackingNumber) changes.trackingNumber = `JT88${Math.floor(Math.random() * 90000 + 10000)}PH`;
        if (next === "confirmed" && order.paymentStatus === "unpaid") {
          changes.paymentStatus = "paid";
          changes.timeline = [{ status: "payment_received", at: nowIso() }, ...changes.timeline!];
        }
        const notifications =
          next === "shipped"
            ? [{ id: nextId("n"), module: "commerce" as const, title: `Order ${order.number} has been shipped`, body: `Tracking ${changes.trackingNumber ?? order.trackingNumber}`, createdAt: nowIso(), read: false, href: `/app/commerce/orders/${order.id}` }, ...s.notifications]
            : s.notifications;
        return { ...s, notifications, orders: s.orders.map((o) => (o.id === id ? { ...o, ...changes } : o)) };
      }),
    cancelOrder: (id: string) =>
      patch("orders", (l) => l.map((o) => (o.id === id ? { ...o, status: "cancelled", timeline: [...o.timeline, { status: "cancelled", at: nowIso() }] } : o))),
    placeOrder: (o: Omit<Order, "id" | "number" | "createdAt" | "timeline" | "status">) => {
      const order: Order = {
        ...o,
        id: nextId("o"),
        number: `#${10429 + Math.floor(Math.random() * 60)}`,
        createdAt: nowIso(),
        status: o.paymentStatus === "paid" ? "confirmed" : "pending",
        timeline: o.paymentStatus === "paid" ? [{ status: "payment_received", at: nowIso() }, { status: "confirmed", at: nowIso() }] : [{ status: "pending", at: nowIso() }],
      };
      set((s) => ({
        ...s,
        orders: [order, ...s.orders],
        cart: [],
        products: s.products.map((p) => ({
          ...p,
          variants: p.variants.map((v) => {
            const line = o.items.find((i) => i.variantId === v.id);
            return line ? { ...v, stock: Math.max(0, v.stock - line.quantity) } : v;
          }),
        })),
      }));
      notify({ module: "commerce", title: `New order ${order.number}`, body: `${o.items.length} item${o.items.length > 1 ? "s" : ""} · ₱${o.total.toLocaleString()}`, href: `/app/commerce/orders/${order.id}` });
      return order;
    },
    toggleDiscount: (id: string) => patch("discounts", (l) => l.map((d) => (d.id === id ? { ...d, active: !d.active } : d))),
    addDiscount: (d: Omit<Discount, "id" | "usage">) => patch("discounts", (l) => [{ ...d, id: nextId("d"), usage: 0 }, ...l]),

    /* ---- Cart ---- */
    addToCart: (line: CartLine) =>
      patch("cart", (c) => {
        const existing = c.find((l) => l.variantId === line.variantId);
        return existing ? c.map((l) => (l.variantId === line.variantId ? { ...l, quantity: l.quantity + line.quantity } : l)) : [...c, line];
      }),
    setCartQty: (variantId: string, quantity: number) =>
      patch("cart", (c) => (quantity <= 0 ? c.filter((l) => l.variantId !== variantId) : c.map((l) => (l.variantId === variantId ? { ...l, quantity } : l)))),
    clearCart: () => patch("cart", () => []),

    /* ---- Auto Care ---- */
    addVehicle: (v: Omit<Vehicle, "id">) => {
      const vehicle: Vehicle = { ...v, id: nextId("vh") };
      patch("vehicles", (l) => [vehicle, ...l]);
      return vehicle;
    },
    addService: (sv: Omit<Service, "id">) => patch("services", (l) => [{ ...sv, id: nextId("sv") }, ...l]),
    updateService: (id: string, changes: Partial<Service>) =>
      patch("services", (l) => l.map((sv) => (sv.id === id ? { ...sv, ...changes } : sv))),
    addAppointment: (a: Omit<Appointment, "id" | "code" | "createdAt" | "status">) => {
      const appointment: Appointment = { ...a, id: nextId("ap"), code: `AP-${3026 + Math.floor(Math.random() * 80)}`, createdAt: nowIso(), status: "booked" };
      const wo: WorkOrder = {
        id: nextId("wo"),
        code: `WO-${1192 + Math.floor(Math.random() * 80)}`,
        appointmentId: appointment.id,
        customerId: a.customerId,
        vehicleId: a.vehicleId,
        serviceId: a.serviceId,
        addOnIds: a.addOnIds,
        staffId: a.staffId,
        bayId: a.bayId,
        status: "booked",
        notes: a.notes ?? "",
        checklist: [
          { id: "intake", label: "Intake walkaround", done: false },
          { id: "service", label: "Perform service", done: false },
          { id: "qc", label: "Quality check", done: false },
        ],
        beforePhotos: [],
        afterPhotos: [],
        timeline: [{ status: "booked", at: nowIso() }],
      };
      set((s) => ({ ...s, appointments: [appointment, ...s.appointments], workOrders: [wo, ...s.workOrders] }));
      notify({ module: "autocare", title: "Appointment booked", body: `${appointment.code} · ${a.date} ${a.time}`, href: "/app/autocare/appointments" });
      return appointment;
    },
    updateAppointment: (id: string, changes: Partial<Appointment>) =>
      patch("appointments", (l) => l.map((a) => (a.id === id ? { ...a, ...changes } : a))),
    advanceWorkOrder: (id: string) =>
      set((s) => {
        const wo = s.workOrders.find((w) => w.id === id);
        if (!wo) return s;
        const idx = WO_FLOW.indexOf(wo.status);
        if (idx === WO_FLOW.length - 1) return s;
        const next = WO_FLOW[idx + 1]!;
        const changes: Partial<WorkOrder> = { status: next, timeline: [...wo.timeline, { status: next, at: nowIso() }] };
        if (next === "in_progress") changes.startedAt = nowIso();
        if (next === "completed") changes.completedAt = nowIso();
        const apStatus: Appointment["status"] =
          next === "completed" ? "completed" : next === "in_progress" || next === "quality_check" ? "in_progress" : next === "arrived" || next === "in_queue" ? "arrived" : next === "confirmed" ? "confirmed" : "booked";
        const bays = s.bays.map((b) => {
          if (b.id !== wo.bayId) return b;
          if (next === "in_progress") return { ...b, status: "busy" as const, currentWorkOrderId: wo.id };
          if (next === "completed" && b.currentWorkOrderId === wo.id) return { ...b, status: "available" as const, currentWorkOrderId: undefined };
          return b;
        });
        const staff = s.staff.map((m) => {
          if (m.id !== wo.staffId) return m;
          if (next === "in_progress") return { ...m, status: "busy" as const };
          if (next === "completed") return { ...m, status: "available" as const };
          return m;
        });
        return {
          ...s,
          bays,
          staff,
          workOrders: s.workOrders.map((w) => (w.id === id ? { ...w, ...changes } : w)),
          appointments: s.appointments.map((a) => (a.id === wo.appointmentId ? { ...a, status: apStatus } : a)),
        };
      }),
    updateWorkOrder: (id: string, changes: Partial<WorkOrder>) =>
      patch("workOrders", (l) => l.map((w) => (w.id === id ? { ...w, ...changes } : w))),
    toggleChecklist: (woId: string, itemId: string) =>
      patch("workOrders", (l) =>
        l.map((w) => (w.id === woId ? { ...w, checklist: w.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c)) } : w)),
      ),
    setBayStatus: (id: string, status: Bay["status"]) =>
      patch("bays", (l) => l.map((b) => (b.id === id ? { ...b, status, currentWorkOrderId: status === "busy" ? b.currentWorkOrderId : undefined } : b))),
    assignAppointmentSlot: (id: string, changes: { bayId?: string; staffId?: string; time?: string; date?: string }) =>
      set((s) => ({
        ...s,
        appointments: s.appointments.map((a) => (a.id === id ? { ...a, ...changes } : a)),
        workOrders: s.workOrders.map((w) => (w.appointmentId === id ? { ...w, bayId: changes.bayId ?? w.bayId, staffId: changes.staffId ?? w.staffId } : w)),
      })),

    /* ---- Payments ---- */
    recordPayment: (p: Omit<Payment, "id" | "createdAt" | "status" | "balance"> & { amountPaid: number }) => {
      const balance = Math.max(0, p.total - p.deposit - p.amountPaid);
      const payment: Payment = {
        module: p.module,
        referenceId: p.referenceId,
        referenceCode: p.referenceCode,
        customerId: p.customerId,
        subtotal: p.subtotal,
        discount: p.discount,
        tax: p.tax,
        deposit: p.deposit,
        total: p.total,
        method: p.method,
        id: nextId("pay"),
        createdAt: nowIso(),
        balance,
        status: balance === 0 ? "paid" : p.amountPaid + p.deposit > 0 ? "partial" : "unpaid",
      };
      set((s) => ({
        ...s,
        payments: [payment, ...s.payments.filter((x) => x.referenceId !== p.referenceId)],
        workOrders: s.workOrders.map((w) => (w.id === p.referenceId ? { ...w, paymentId: payment.id } : w)),
        orders: s.orders.map((o) => (o.id === p.referenceId ? { ...o, paymentStatus: payment.status, paymentMethod: p.method as PaymentMethod } : o)),
      }));
      return payment;
    },
  };
}

export type AppActions = ReturnType<typeof createActions>;

interface Ctx {
  state: AppState;
  actions: AppActions;
}

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const set = useCallback((fn: (s: AppState) => AppState) => setState(fn), []);
  const actions = useMemo(() => createActions(set), [set]);
  const value = useMemo(() => ({ state, actions }), [state, actions]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

/* ---------- Derived selectors (pure helpers) ---------- */

export function productStock(p: Product) {
  return p.variants.reduce((a, v) => a + v.stock, 0);
}

export function stockStatus(p: Product): "healthy" | "low" | "out" {
  const total = productStock(p);
  if (total === 0) return "out";
  if (total <= p.lowStockThreshold) return "low";
  return "healthy";
}

export function eventSold(e: Event) {
  return e.ticketTypes.reduce((a, t) => a + t.sold, 0);
}

export function eventRevenue(e: Event) {
  return e.ticketTypes.reduce((a, t) => a + t.sold * t.price, 0);
}
