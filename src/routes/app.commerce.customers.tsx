import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { DataTable, PageHeader, PageSkeleton, PersonCell, type Column } from "@/components/kit";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { useApp } from "@/lib/store";
import { formatDate, peso } from "@/lib/format";
import type { Customer } from "@/types";

export const Route = createFileRoute("/app/commerce/customers")({
  head: () => ({
    meta: [
      { title: "Commerce customers — Nimbus" },
      { name: "description", content: "Customers who have placed merchandise orders." },
      { property: "og:title", content: "Commerce customers — Nimbus" },
      { property: "og:description", content: "Order counts and lifetime spend for shoppers." },
    ],
  }),
  component: CommerceCustomers,
});

function CommerceCustomers() {
  const loading = useSimulatedLoading();
  const { state } = useApp();
  const navigate = useNavigate();

  if (loading) return <PageSkeleton />;

  const buyers = state.customers
    .map((c) => {
      const orders = state.orders.filter((o) => o.customerId === c.id);
      const total = orders.filter((o) => o.status !== "cancelled").reduce((a, o) => a + o.total, 0);
      const last = orders.reduce<string | undefined>((latest, o) => (!latest || o.createdAt > latest ? o.createdAt : latest), undefined);
      return { customer: c, orderCount: orders.length, total, last };
    })
    .filter((b) => b.orderCount > 0)
    .sort((a, b) => b.total - a.total);

  const columns: Column<(typeof buyers)[number]>[] = [
    { key: "customer", header: "Customer", cell: (b) => <PersonCell name={b.customer.name} sub={b.customer.email} /> },
    { key: "orders", header: "Orders", cell: (b) => <span className="tabular">{b.orderCount}</span> },
    { key: "total", header: "Total spent", cell: (b) => <span className="tabular font-medium">{peso(b.total)}</span> },
    { key: "last", header: "Last order", cell: (b) => (b.last ? formatDate(b.last) : "—"), hideBelow: "lg" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Commerce" title="Customers" description="Shoppers who have placed merchandise orders." />
      <DataTable
        rows={buyers}
        rowKey={(b) => b.customer.id}
        searchable={(b) => `${b.customer.name} ${b.customer.email}`}
        searchPlaceholder="Search customers…"
        onRowClick={(b) => navigate({ to: "/app/customers/$customerId", params: { customerId: b.customer.id } })}
        empty={{ icon: <Users />, title: "No shoppers yet", description: "Customers will appear once they place orders." }}
        columns={columns}
      />
    </div>
  );
}
