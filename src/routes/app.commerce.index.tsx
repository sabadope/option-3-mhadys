import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, ArrowRight, Boxes, ClipboardList, PackageCheck, Receipt, Wallet } from "lucide-react";
import {
  EmptyState,
  MetricCard,
  PageHeader,
  PageSkeleton,
  SectionCard,
  StatusBadge,
  TrendAreaChart,
} from "@/components/kit";
import { Button } from "@/components/ui/button";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { useApp, productStock, stockStatus } from "@/lib/store";
import { peso, formatDateTime } from "@/lib/format";
import { salesSeries } from "@/data/commerce";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/commerce/")({
  head: () => ({
    meta: [
      { title: "Commerce — Nimbus" },
      { name: "description", content: "Merchandise dashboard: sales, orders, inventory alerts, and top products." },
      { property: "og:title", content: "Commerce — Nimbus" },
      { property: "og:description", content: "Track merchandise sales and fulfillment at a glance." },
    ],
  }),
  component: CommerceDashboard,
});

function CommerceDashboard() {
  const loading = useSimulatedLoading();
  const { state, actions } = useApp();
  const [range, setRange] = useState<"7d" | "14d">("7d");

  const data = useMemo(() => (range === "7d" ? salesSeries.slice(-7) : salesSeries), [range]);
  const totalSales = data.reduce((a, d) => a + d.sales, 0);
  const prevHalf = salesSeries.slice(0, 7).reduce((a, d) => a + d.sales, 0);
  const lastHalf = salesSeries.slice(-7).reduce((a, d) => a + d.sales, 0);
  const delta = prevHalf > 0 ? ((lastHalf - prevHalf) / prevHalf) * 100 : 0;

  const orders = state.orders;
  const avgOrder = orders.length ? orders.reduce((a, o) => a + o.total, 0) / orders.length : 0;
  const pendingFulfillment = orders.filter((o) => !["shipped", "delivered", "cancelled"].includes(o.status)).length;
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((a, o) => a + o.total, 0);

  const topProducts = [...state.products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 5);
  const maxSold = Math.max(...topProducts.map((p) => p.soldCount), 1);

  const alerts = state.products
    .filter((p) => stockStatus(p) !== "healthy")
    .sort((a, b) => productStock(a) - productStock(b))
    .slice(0, 6);

  const actionable = orders
    .filter((o) => ["pending", "confirmed", "processing"].includes(o.status))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 6);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Commerce"
        title="Merchandise dashboard"
        description="Sales performance, fulfillment, and inventory health at a glance."
        atmosphere
        actions={
          <Button asChild variant="module">
            <Link to="/app/commerce/products">
              <Receipt /> Manage products
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <SectionCard
          eyebrow="Revenue"
          title="Sales"
          action={
            <div className="flex items-center gap-1 rounded-full bg-surface-2 p-1">
              {(["7d", "14d"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    "h-7 rounded-full px-3 text-xs font-medium transition-colors",
                    range === r ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          }
        >
          <div className="flex items-baseline gap-3">
            <p className="text-4xl font-semibold tracking-tight tabular">{peso(128450)}</p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-success">+18.4%</span>
          </div>
          <p className="mb-2 mt-1 text-sm text-muted-foreground">Total sales in the selected range: {peso(totalSales)} · trend {delta >= 0 ? "+" : ""}{delta.toFixed(1)}%</p>
          <TrendAreaChart data={data} dataKey="sales" format={(v) => peso(v, { compact: true })} height={240} id="commerce-sales" />
        </SectionCard>

        <div className="grid grid-cols-2 gap-4">
          <MetricCard label="Orders" value={String(orders.length)} icon={<Receipt />} hint="all time" />
          <MetricCard label="Avg order value" value={peso(Math.round(avgOrder))} icon={<Wallet />} />
          <MetricCard label="Pending fulfillment" value={String(pendingFulfillment)} icon={<ClipboardList />} hint="needs action" />
          <MetricCard label="Revenue" value={peso(revenue, { compact: true })} icon={<PackageCheck />} hint="excl. cancelled" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard eyebrow="Merchandise" title="Top products" action={<Link to="/app/commerce/products" className="text-xs font-medium text-module hover:underline">View all</Link>}>
          {topProducts.length === 0 ? (
            <EmptyState title="No sales yet" />
          ) : (
            <ul className="space-y-4">
              {topProducts.map((p, i) => (
                <li key={p.id}>
                  <div className="mb-1.5 flex items-center gap-3">
                    <div className="size-9 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                      {p.images[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="truncate font-medium">{p.name}</span>
                        <span className="tabular shrink-0 text-muted-foreground">{p.soldCount} sold</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(p.soldCount / maxSold) * 100}%` }}
                          transition={{ type: "spring", stiffness: 120, damping: 24, delay: i * 0.05 }}
                          className="h-full rounded-full bg-module"
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard eyebrow="Stock" title="Inventory alerts" action={<Link to="/app/commerce/inventory" className="text-xs font-medium text-module hover:underline">View inventory</Link>}>
          {alerts.length === 0 ? (
            <EmptyState icon={<Boxes />} title="Inventory is healthy" description="No products are low or out of stock." />
          ) : (
            <ul className="divide-y divide-border">
              {alerts.map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                  <div className="size-9 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                    {p.images[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{productStock(p)} units left</p>
                  </div>
                  <StatusBadge status={stockStatus(p)} label={stockStatus(p) === "out" ? "Out of stock" : "Low stock"} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard eyebrow="Fulfillment" title="Orders needing action" action={<Link to="/app/commerce/orders" className="text-xs font-medium text-module hover:underline">View all orders</Link>}>
        {actionable.length === 0 ? (
          <EmptyState icon={<AlertTriangle />} title="All caught up" description="No orders currently need action." />
        ) : (
          <ul className="divide-y divide-border">
            {actionable.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{o.number}</p>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">{o.items.length} item{o.items.length > 1 ? "s" : ""} · {peso(o.total)} · {formatDateTime(o.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      actions.advanceOrder(o.id);
                      toast.success(`${o.number} advanced`);
                    }}
                  >
                    Advance <ArrowRight />
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link to="/app/commerce/orders/$orderId" params={{ orderId: o.id }}>
                      View
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
