/**
 * Domain types for the Nimbus OS platform.
 * These mirror what a future backend (REST/GraphQL/Supabase) would return.
 */

export type ModuleId = "event" | "commerce" | "autocare";
export type ID = string;

export interface User {
  id: ID;
  name: string;
  email: string;
  role: "owner" | "admin" | "staff";
  avatarInitials: string;
}

export interface Business {
  id: ID;
  name: string;
  legalName: string;
  email: string;
  phone: string;
  address: string;
  currency: "PHP";
  timezone: string;
  plan: "starter" | "professional" | "business";
}

export interface Customer {
  id: ID;
  name: string;
  email: string;
  phone: string;
  city: string;
  joinedAt: string; // ISO
  tags: string[];
  notes?: string | undefined;
}

/* ---------------- Events ---------------- */

export type EventStatus = "draft" | "published" | "completed" | "cancelled";

export interface TicketType {
  id: ID;
  eventId: ID;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold: number;
}

export interface Event {
  id: ID;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  category: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;
  venue: string;
  address: string;
  capacity: number;
  status: EventStatus;
  ticketTypes: TicketType[];
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "checked_in";

export interface Booking {
  id: ID;
  code: string; // e.g. BK-20481
  customerId: ID;
  eventId: ID;
  ticketTypeId: ID;
  quantity: number;
  amount: number;
  status: BookingStatus;
  createdAt: string;
  paymentMethod: PaymentMethod;
}

export interface Attendee {
  id: ID;
  bookingId: ID;
  eventId: ID;
  ticketTypeId: ID;
  name: string;
  email: string;
  qrCode: string;
  checkedIn: boolean;
  checkedInAt?: string | undefined;
}

export interface CheckIn {
  id: ID;
  attendeeId: ID;
  eventId: ID;
  at: string;
  gate: string;
}

/* ---------------- Commerce ---------------- */

export type ProductStatus = "active" | "draft" | "out_of_stock";

export interface ProductVariant {
  id: ID;
  productId: ID;
  name: string; // e.g. "Black / M"
  option1: string; // color
  option2?: string | undefined; // size
  sku: string;
  price: number;
  stock: number;
}

export interface Product {
  id: ID;
  name: string;
  slug: string;
  description: string;
  images: string[];
  categoryId: ID;
  sku: string;
  price: number;
  compareAtPrice?: number | undefined;
  status: ProductStatus;
  variants: ProductVariant[];
  lowStockThreshold: number;
  soldCount: number;
  createdAt: string;
}

export interface Category {
  id: ID;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

export interface InventoryItem {
  productId: ID;
  variantId: ID;
  stock: number;
  reserved: number;
  reorderPoint: number;
  location: string;
}

export interface InventoryAdjustment {
  id: ID;
  variantId: ID;
  delta: number;
  reason: string;
  at: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: ID;
  productId: ID;
  variantId: ID;
  name: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  image: string;
}

export interface OrderEvent {
  status: OrderStatus | "payment_received";
  at: string;
  note?: string | undefined;
}

export interface Order {
  id: ID;
  number: string; // #10428
  customerId: ID;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  trackingNumber?: string | undefined;
  createdAt: string;
  timeline: OrderEvent[];
}

export interface Discount {
  id: ID;
  code: string;
  type: "percent" | "fixed";
  value: number;
  usage: number;
  limit?: number | undefined;
  active: boolean;
  expiresAt?: string | undefined;
}

export interface CartLine {
  productId: ID;
  variantId: ID;
  quantity: number;
}

/* ---------------- Auto Care ---------------- */

export type BayType = "wash" | "detail" | "coating";
export type BayStatus = "available" | "busy" | "maintenance";

export interface Bay {
  id: ID;
  number: string; // "01"
  name: string;
  type: BayType;
  status: BayStatus;
  currentWorkOrderId?: ID | undefined;
}

export interface Service {
  id: ID;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  bayType: BayType;
  status: "active" | "inactive";
  category: "wash" | "interior" | "exterior" | "detailing" | "protection";
}

export interface ServiceAddOn {
  id: ID;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface Vehicle {
  id: ID;
  customerId: ID;
  make: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  type: "sedan" | "suv" | "pickup" | "coupe" | "hatchback" | "van";
  notes?: string | undefined;
}

export interface StaffMember {
  id: ID;
  name: string;
  role: "Detailer" | "Wash Technician" | "Supervisor" | "Coating Specialist";
  status: "available" | "busy" | "off";
  initials: string;
  skills: BayType[];
  shift: string; // "08:00 – 17:00"
}

export type AppointmentStatus =
  | "booked"
  | "confirmed"
  | "arrived"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Appointment {
  id: ID;
  code: string; // AP-3021
  customerId: ID;
  vehicleId: ID;
  serviceId: ID;
  addOnIds: ID[];
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  bayId?: ID | undefined;
  staffId?: ID | undefined;
  status: AppointmentStatus;
  total: number;
  notes?: string | undefined;
  createdAt: string;
}

export type WorkOrderStatus =
  | "booked"
  | "confirmed"
  | "arrived"
  | "in_queue"
  | "in_progress"
  | "quality_check"
  | "completed";

export interface ChecklistItem {
  id: ID;
  label: string;
  done: boolean;
}

export interface WorkOrder {
  id: ID;
  code: string; // WO-1188
  appointmentId: ID;
  customerId: ID;
  vehicleId: ID;
  serviceId: ID;
  addOnIds: ID[];
  staffId?: ID | undefined;
  bayId?: ID | undefined;
  status: WorkOrderStatus;
  notes: string;
  checklist: ChecklistItem[];
  beforePhotos: string[];
  afterPhotos: string[];
  paymentId?: ID | undefined;
  startedAt?: string | undefined;
  completedAt?: string | undefined;
  timeline: { status: WorkOrderStatus; at: string }[];
}

/* ---------------- Shared ---------------- */

export type PaymentMethod = "cash" | "card" | "online";
export type PaymentStatus = "unpaid" | "partial" | "paid" | "refunded";

export interface Payment {
  id: ID;
  module: ModuleId;
  referenceId: ID; // booking / order / work order id
  referenceCode: string;
  customerId: ID;
  subtotal: number;
  discount: number;
  tax: number;
  deposit: number;
  total: number;
  balance: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
}

export interface Notification {
  id: ID;
  module: ModuleId | "system";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string | undefined;
}

export interface ActivityItem {
  id: ID;
  module: ModuleId;
  customerId?: ID | undefined;
  title: string;
  detail: string;
  at: string;
}
