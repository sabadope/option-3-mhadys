import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, Timeline } from "@/components/kit";
import { StoreLayout } from "@/components/commerce/StoreLayout";
import { useApp } from "@/lib/store";
import { peso } from "@/lib/format";

interface Search {
  order?: string;
}

export const Route = createFileRoute("/store/confirmation")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    order: typeof search.order === "string" ? search.order : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Order confirmed — Nimbus Shop" },
      { name: "description", content: "Your order has been placed successfully." },
      { property: "og:title", content: "Order confirmed — Nimbus Shop" },
      { property: "og:description", content: "Thank you for shopping with Nimbus." },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { order: orderId } = Route.useSearch();
  const { state } = useApp();
  const order = state.orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <StoreLayout>
        <EmptyState
          title="Order not found"
          description="We couldn't find that order."
          action={
            <Button asChild variant="module">
              <Link to="/store">Continue shopping</Link>
            </Button>
          }
        />
      </StoreLayout>
    );
  }

  const steps = [
    { key: "placed", label: "Order placed" },
    { key: "confirmed", label: "Confirmed" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
  ];
  const flow = ["pending", "confirmed", "processing", "packed", "shipped", "delivered"];
  const idx = Math.max(0, flow.indexOf(order.status));
  const currentIndex = order.status === "pending" ? 1 : idx + 1;

  return (
    <StoreLayout>
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-success/12 text-success">
          <CheckCircle2 className="size-8" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">Thank you for your order!</h1>
        <p className="mt-1 text-muted-foreground">Order {order.number} has been placed successfully.</p>
      </div>

      <div className="mx-auto mt-10 grid max-w-xl gap-6">
        <div className="surface rounded-2xl p-5">
          <p className="eyebrow mb-3">Items</p>
          <ul className="divide-y divide-border">
            {order.items.map((it) => (
              <li key={it.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                  <img src={it.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{it.name}</p>
                  <p className="text-xs text-muted-foreground">{it.variantName} · Qty {it.quantity}</p>
                </div>
                <span className="tabular text-sm font-medium">{peso(it.unitPrice * it.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-semibold">
            <span>Total</span>
            <span className="tabular">{peso(order.total)}</span>
          </div>
        </div>

        <div className="surface rounded-2xl p-5">
          <p className="eyebrow mb-4">Tracking</p>
          <Timeline steps={steps} currentIndex={currentIndex} />
        </div>

        <Button asChild size="lg" variant="module">
          <Link to="/store">Continue shopping</Link>
        </Button>
      </div>
    </StoreLayout>
  );
}
