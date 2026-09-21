import { Timeline } from "@/components/kit";
import { formatDateTime } from "@/lib/format";
import type { Order, OrderStatus } from "@/types";

const FLOW: { key: OrderStatus; label: string }[] = [
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export function OrderTimeline({ order }: { order: Order }) {
  const paymentEvent = order.timeline.find((t) => t.status === "payment_received");
  const steps = [
    { key: "payment", label: "Payment received", at: paymentEvent ? formatDateTime(paymentEvent.at) : undefined },
    ...FLOW.map((f) => {
      const ev = order.timeline.find((t) => t.status === f.key);
      return { key: f.key, label: f.label, at: ev ? formatDateTime(ev.at) : undefined };
    }),
  ];

  if (order.status === "cancelled") {
    return (
      <Timeline
        steps={[{ key: "cancelled", label: "Order cancelled", hint: "This order will not proceed further." }]}
        currentIndex={1}
      />
    );
  }

  const flowIdx = FLOW.findIndex((f) => f.key === order.status);
  // currentIndex counts payment step as index 0, so flow steps start at 1
  const currentIndex = paymentEvent ? flowIdx + 1 + 1 : 0;

  return <Timeline steps={steps} currentIndex={Math.min(currentIndex, steps.length)} />;
}
