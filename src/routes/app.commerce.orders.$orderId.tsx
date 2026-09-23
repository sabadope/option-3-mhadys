import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, MapPin, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, EmptyState, PageHeader, PageSkeleton, PaymentPanel, PersonCell, SectionCard, StatusBadge } from "@/components/kit";
import { OrderTimeline } from "@/components/commerce/OrderTimeline";
import { useAsyncAction, useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { useApp } from "@/lib/store";
import { peso } from "@/lib/format";
import type { OrderStatus } from "@/types";

export const Route = createFileRoute("/app/commerce/orders/$orderId")({
  head: () => ({
    meta: [
      { title: "Order — Nimbus Commerce" },
      { name: "description", content: "Order detail, fulfillment timeline, and payment status." },
      { property: "og:title", content: "Order — Nimbus Commerce" },
      { property: "og:description", content: "Track and advance a single merchandise order." },
    ],
  }),
  component: OrderDetail,
});

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  pending: "Confirm order",
  confirmed: "Start processing",
  processing: "Mark as packed",
  packed: "Mark as shipped",
  shipped: "Mark as delivered",
};

function OrderDetail() {
  const loading = useSimulatedLoading();
  const { orderId } = Route.useParams();
  const { state, actions } = useApp();
  const { pending, run } = useAsyncAction();
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (loading) return <PageSkeleton />;

  const order = state.orders.find((o) => o.id === orderId);
  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description="This order may have been removed."
        action={
          <Button asChild variant="module">
            <Link to="/app/commerce/orders">Back to orders</Link>
          </Button>
        }
      />
    );
  }

  const customer = state.customers.find((c) => c.id === order.customerId);
  const nextLabel = NEXT_LABEL[order.status];
  const canAdvance = !!nextLabel && order.status !== "delivered" && order.status !== "cancelled";

  const advance = () =>
    run(() => {
      actions.advanceOrder(order.id);
      toast.success("Order advanced");
    });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Order"
        title={order.number}
        description={`Placed ${new Date(order.createdAt).toLocaleString()}`}
        actions={
          <>
            <Button asChild variant="ghost">
              <Link to="/app/commerce/orders">
                <ArrowLeft /> Back
              </Link>
            </Button>
            {order.status !== "cancelled" && order.status !== "delivered" && (
              <Button variant="secondary" onClick={() => setConfirmCancel(true)}>
                Cancel order
              </Button>
            )}
            {canAdvance && (
              <Button variant="module" onClick={advance} disabled={pending}>
                {pending ? "Updating…" : nextLabel} <ArrowRight />
              </Button>
            )}
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={order.status} />
        <StatusBadge status={order.paymentStatus} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <SectionCard title="Items" eyebrow="Order contents">
            <ul className="divide-y divide-border">
              {order.items.map((it) => (
                <li key={it.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-surface-2">
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
            <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular">{peso(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span className="tabular">− {peso(order.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="tabular">{order.shipping === 0 ? "Free" : peso(order.shipping)}</span></div>
              <div className="flex justify-between text-base font-semibold"><span>Total</span><span className="tabular">{peso(order.total)}</span></div>
            </div>
          </SectionCard>

          <SectionCard title="Shipping" eyebrow="Delivery">
            <p className="flex items-center gap-2 text-sm"><MapPin className="size-4 text-muted-foreground" /> {order.shippingAddress}</p>
            {order.trackingNumber && (
              <p className="mt-2 flex items-center gap-2 text-sm"><Truck className="size-4 text-muted-foreground" /> Tracking: <span className="font-mono">{order.trackingNumber}</span></p>
            )}
          </SectionCard>

          <SectionCard title="Fulfillment timeline" eyebrow="Progress">
            <OrderTimeline order={order} />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Customer" eyebrow="Contact">
            {customer ? (
              <>
                <PersonCell name={customer.name} sub={customer.email} />
                <Link to="/app/customers/$customerId" params={{ customerId: customer.id }} className="mt-3 inline-block text-xs font-medium text-module hover:underline">
                  View customer profile →
                </Link>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Guest checkout</p>
            )}
          </SectionCard>

          <PaymentPanel
            summary={{ subtotal: order.subtotal, discount: order.discount, total: order.total, status: order.paymentStatus }}
            defaultMethod={order.paymentMethod}
            onPay={
              order.paymentStatus === "unpaid"
                ? (method) => {
                    actions.recordPayment({
                      module: "commerce",
                      referenceId: order.id,
                      referenceCode: order.number,
                      customerId: order.customerId,
                      subtotal: order.subtotal,
                      discount: order.discount,
                      tax: 0,
                      deposit: 0,
                      total: order.total,
                      method,
                      amountPaid: order.total,
                    });
                    toast.success("Payment recorded");
                  }
                : undefined
            }
          />
        </div>
      </div>

      <ConfirmDialog
        open={confirmCancel}
        onOpenChange={setConfirmCancel}
        title="Cancel this order?"
        description="This will stop fulfillment. The customer will need to reorder if this was a mistake."
        confirmLabel="Cancel order"
        destructive
        onConfirm={() => {
          actions.cancelOrder(order.id);
          toast.success("Order cancelled");
          setConfirmCancel(false);
        }}
      />
    </div>
  );
}
