import type { ActivityItem, Notification, Payment } from "@/types";

export const notifications: Notification[] = [
  { id: "n_1", module: "autocare", title: "Appointment reminder", body: "Toyota GR86 — Ceramic Coating is scheduled today at 1:00 PM in Bay 02.", createdAt: "2026-09-18T07:30:00", read: false, href: "/app/autocare/appointments" },
  { id: "n_2", module: "commerce", title: "Order #10427 has been shipped", body: "J&T tracking JT8845120PH. Estimated delivery Sep 19.", createdAt: "2026-09-17T15:31:00", read: false, href: "/app/commerce/orders/o_2" },
  { id: "n_3", module: "event", title: "Booking confirmed", body: "Rafael Tan booked 2 × VIP for Tech & Innovation Summit.", createdAt: "2026-09-17T09:51:00", read: false, href: "/app/events/bookings" },
  { id: "n_4", module: "commerce", title: "Low stock: Limited Edition Cap", body: "Only 8 units remaining. Reorder point is 10.", createdAt: "2026-09-17T08:00:00", read: true, href: "/app/commerce/inventory" },
  { id: "n_5", module: "event", title: "Creative Business Workshop is today", body: "54 of 60 seats sold. Check-in opens at 12:30 PM.", createdAt: "2026-09-18T06:00:00", read: true, href: "/app/events/checkin" },
  { id: "n_6", module: "autocare", title: "Bay 04 under maintenance", body: "Coating Room lighting replacement scheduled until 3:00 PM.", createdAt: "2026-09-18T06:15:00", read: true, href: "/app/autocare/bays" },
  { id: "n_7", module: "system", title: "Weekly report ready", body: "Your Sep 11–17 performance summary is available in Reports.", createdAt: "2026-09-18T05:00:00", read: true, href: "/app/reports" },
];

export const payments: Payment[] = [
  { id: "pay_1", module: "event", referenceId: "bk_1", referenceCode: "BK-20481", customerId: "c_1", subtotal: 4500, discount: 0, tax: 0, deposit: 0, total: 4500, balance: 0, method: "card", status: "paid", createdAt: "2026-09-10T09:12:00" },
  { id: "pay_2", module: "commerce", referenceId: "o_1", referenceCode: "#10428", customerId: "c_1", subtotal: 4570, discount: 1072, tax: 0, deposit: 0, total: 3498, balance: 0, method: "card", status: "paid", createdAt: "2026-09-17T14:20:00" },
  { id: "pay_3", module: "autocare", referenceId: "wo_4", referenceCode: "WO-1191", customerId: "c_1", subtotal: 20000, discount: 0, tax: 0, deposit: 5000, total: 20000, balance: 15000, method: "online", status: "partial", createdAt: "2026-09-14T11:50:00" },
  { id: "pay_4", module: "autocare", referenceId: "wo_2", referenceCode: "WO-1189", customerId: "c_4", subtotal: 5100, discount: 0, tax: 0, deposit: 0, total: 5100, balance: 5100, method: "cash", status: "unpaid", createdAt: "2026-09-18T09:10:00" },
  { id: "pay_5", module: "autocare", referenceId: "wo_5", referenceCode: "WO-1187", customerId: "c_10", subtotal: 350, discount: 0, tax: 0, deposit: 0, total: 350, balance: 0, method: "cash", status: "paid", createdAt: "2026-09-17T15:34:00" },
  { id: "pay_6", module: "autocare", referenceId: "wo_6", referenceCode: "WO-1180", customerId: "c_1", subtotal: 9800, discount: 0, tax: 0, deposit: 0, total: 9800, balance: 0, method: "card", status: "paid", createdAt: "2026-09-12T15:20:00" },
  { id: "pay_7", module: "commerce", referenceId: "o_2", referenceCode: "#10427", customerId: "c_5", subtotal: 4980, discount: 0, tax: 0, deposit: 0, total: 5130, balance: 0, method: "online", status: "paid", createdAt: "2026-09-16T10:02:00" },
  { id: "pay_8", module: "event", referenceId: "bk_9", referenceCode: "BK-20489", customerId: "c_6", subtotal: 9000, discount: 0, tax: 0, deposit: 0, total: 9000, balance: 0, method: "card", status: "paid", createdAt: "2026-09-17T09:50:00" },
];

export const activity: ActivityItem[] = [
  { id: "ac_1", module: "autocare", customerId: "c_10", title: "Work order started", detail: "WO-1188 · Toyota Vios · Premium Wash · Bay 01", at: "2026-09-18T09:05:00" },
  { id: "ac_2", module: "commerce", customerId: "c_2", title: "New order #10423", detail: "Event Jacket · ₱3,890 · paid by card", at: "2026-09-18T11:02:00" },
  { id: "ac_3", module: "event", customerId: "c_10", title: "New booking BK-20490", detail: "Student · Tech & Innovation Summit · pending payment", at: "2026-09-18T07:15:00" },
  { id: "ac_4", module: "commerce", customerId: "c_3", title: "Order #10425 packed", detail: "3 × Classic Shirt · ready for courier", at: "2026-09-18T10:05:00" },
  { id: "ac_5", module: "event", customerId: "c_3", title: "Checked in", detail: "Alex Rivera · Creative Business Workshop", at: "2026-09-18T12:48:00" },
  { id: "ac_6", module: "autocare", customerId: "c_6", title: "Vehicle arrived", detail: "Ford Ranger · Exterior Detailing", at: "2026-09-18T09:48:00" },
  { id: "ac_7", module: "commerce", customerId: "c_5", title: "Order #10427 shipped", detail: "JT8845120PH", at: "2026-09-17T15:30:00" },
  { id: "ac_8", module: "event", customerId: "c_6", title: "Booking confirmed BK-20489", detail: "2 × VIP · ₱9,000", at: "2026-09-17T09:50:00" },
];
