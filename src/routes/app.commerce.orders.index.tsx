import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Receipt } from "lucide-react";
import { DataTable, PageHeader, PageSkeleton, PersonCell, StatusBadge, type Column } from "@/components/kit";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { useApp } from "@/lib/store";
import { formatDateTime, peso } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

export const Route = createFileRoute("/app/commerce/orders/")({
  head: () => ({
    meta: [
      { title: "Orders — Nimbus Commerce" },
      { name: "description", content: "Track and fulfill merchandise orders." },
      { property: "og:title", content: "Orders — Nimbus Commerce" },
      { property: "og:description", content: "Filterable order pipeline with fulfillment status." },
    ],
  }),
  component: OrdersIndex,
});

const PIPELINE: { key: OrderStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

function OrdersIndex() {
  const loading = useSimulatedLoading();
  const { state } = useApp();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");

  const counts = useMemo(() => {
    const map = new Map<OrderStatus, number>();
    for (const o of state.orders) map.set(o.status, (map.get(o.status) ?? 0) + 1);
    return map;
  }, [state.orders]);

  if (loading) return <PageSkeleton />;

  const customerFor = (id: string) => state.customers.find((c) => c.id === id);

  const columns: Column<Order>[] = [
    { key: "number", header: "Order", cell: (o) => <span className="font-medium">{o.number}</span> },
    {
      key: "customer",
      header: "Customer",
      cell: (o) => {
        const c = customerFor(o.customerId);
        return <PersonCell name={c?.name ?? "Guest"} sub={c?.email} />;
      },
    },
    { key: "items", header: "Items", cell: (o) => `${o.items.length} item${o.items.length > 1 ? "s" : ""}`, hideBelow: "lg" },
    { key: "total", header: "Total", cell: (o) => <span className="tabular font-medium">{peso(o.total)}</span> },
    { key: "payment", header: "Payment", cell: (o) => <StatusBadge status={o.paymentStatus} />, hideBelow: "lg" },
    { key: "status", header: "Status", cell: (o) => <StatusBadge status={o.status} /> },
    { key: "date", header: "Date", cell: (o) => <span className="text-muted-foreground">{formatDateTime(o.createdAt)}</span>, hideBelow: "xl" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Commerce" title="Orders" description={`${state.orders.length} orders across every status.`} />

      <div className="surface flex flex-wrap gap-2 overflow-x-auto rounded-2xl p-2">
        <button
          onClick={() => setStatusFilter("")}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
            statusFilter === "" ? "bg-foreground text-background" : "hover:bg-accent",
          )}
        >
          All <span className="tabular text-xs opacity-70">{state.orders.length}</span>
        </button>
        {PIPELINE.map((p) => (
          <button
            key={p.key}
            onClick={() => setStatusFilter(p.key)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
              statusFilter === p.key ? "bg-foreground text-background" : "hover:bg-accent",
            )}
          >
            {p.label} <span className="tabular text-xs opacity-70">{counts.get(p.key) ?? 0}</span>
          </button>
        ))}
      </div>

      <DataTable<Order>
        rows={state.orders.filter((o) => !statusFilter || o.status === statusFilter)}
        rowKey={(o) => o.id}
        searchable={(o) => `${o.number} ${customerFor(o.customerId)?.name ?? ""}`}
        searchPlaceholder="Search orders…"
        onRowClick={(o) => navigate({ to: "/app/commerce/orders/$orderId", params: { orderId: o.id } })}
        filters={[
          {
            key: "paymentStatus",
            label: "Payment",
            options: [
              { value: "paid", label: "Paid" },
              { value: "unpaid", label: "Unpaid" },
              { value: "partial", label: "Partial" },
              { value: "refunded", label: "Refunded" },
            ],
          },
        ]}
        filterFn={(o, active) => !active.paymentStatus || o.paymentStatus === active.paymentStatus}
        empty={{ icon: <Receipt />, title: "No orders yet", description: "Orders placed through the storefront will show here." }}
        columns={columns}
      />
    </div>
  );
}
