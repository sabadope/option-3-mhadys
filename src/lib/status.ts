/** Maps domain statuses to a semantic tone used by <StatusBadge />. */
export type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "module";

const map: Record<string, Tone> = {
  // generic
  active: "success",
  inactive: "neutral",
  draft: "neutral",
  published: "success",
  completed: "success",
  cancelled: "danger",
  // bookings
  pending: "warning",
  confirmed: "info",
  checked_in: "success",
  // orders
  processing: "module",
  packed: "module",
  shipped: "info",
  delivered: "success",
  out_of_stock: "danger",
  // stock
  healthy: "success",
  low: "warning",
  out: "danger",
  // payments
  paid: "success",
  partial: "warning",
  unpaid: "danger",
  refunded: "neutral",
  // autocare
  booked: "neutral",
  arrived: "info",
  in_queue: "warning",
  in_progress: "module",
  quality_check: "info",
  available: "success",
  busy: "module",
  maintenance: "warning",
  off: "neutral",
};

export function toneFor(status: string): Tone {
  return map[status] ?? "neutral";
}
