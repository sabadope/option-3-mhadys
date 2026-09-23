import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, MetricCard, PageHeader, PageSkeleton, StatusBadge, type Column } from "@/components/kit";
import { StockAdjustDialog } from "@/components/commerce/StockAdjustDialog";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { useApp, stockStatus } from "@/lib/store";
import { peso } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product, ProductVariant } from "@/types";

export const Route = createFileRoute("/app/commerce/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — Nimbus Commerce" },
      { name: "description", content: "Track stock levels across every product variant." },
      { property: "og:title", content: "Inventory — Nimbus Commerce" },
      { property: "og:description", content: "Search, filter, and adjust stock for every SKU." },
    ],
  }),
  component: InventoryPage,
});

interface Row {
  product: Product;
  variant: ProductVariant;
}

function InventoryPage() {
  const loading = useSimulatedLoading();
  const { state } = useApp();
  const [adjust, setAdjust] = useState<Row | undefined>();

  const rows: Row[] = useMemo(
    () => state.products.flatMap((p) => p.variants.map((v) => ({ product: p, variant: v }))),
    [state.products],
  );

  if (loading) return <PageSkeleton />;

  const rowStatus = (r: Row): "healthy" | "low" | "out" => {
    if (r.variant.stock === 0) return "out";
    if (r.variant.stock <= r.product.lowStockThreshold) return "low";
    return "healthy";
  };

  const skuCount = rows.length;
  const lowCount = rows.filter((r) => rowStatus(r) === "low").length;
  const outCount = rows.filter((r) => rowStatus(r) === "out").length;
  const inventoryValue = rows.reduce((a, r) => a + r.variant.stock * r.variant.price, 0);

  const columns: Column<Row>[] = [
    {
      key: "product",
      header: "Product",
      cell: (r) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="size-9 shrink-0 overflow-hidden rounded-lg bg-surface-2">
            {r.product.images[0] && <img src={r.product.images[0]} alt="" className="h-full w-full object-cover" />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{r.product.name}</p>
            <p className="truncate text-xs text-muted-foreground">{r.variant.sku}</p>
          </div>
        </div>
      ),
    },
    { key: "variant", header: "Variant", cell: (r) => r.variant.name, hideBelow: "lg" },
    { key: "stock", header: "Stock", cell: (r) => <span className="tabular font-medium">{r.variant.stock}</span> },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={rowStatus(r)} label={rowStatus(r) === "out" ? "Out of stock" : rowStatus(r) === "low" ? "Low stock" : "Healthy"} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (r) => (
        <Button size="sm" variant="secondary" onClick={() => setAdjust(r)}>
          Adjust
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Commerce" title="Inventory" description="Stock levels across every product variant." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="SKUs" value={String(skuCount)} icon={<Boxes />} />
        <MetricCard label="Low stock" value={String(lowCount)} hint="needs reorder" />
        <MetricCard label="Out of stock" value={String(outCount)} />
        <MetricCard label="Inventory value" value={peso(inventoryValue, { compact: true })} />
      </div>

      <DataTable<Row>
        rows={rows}
        rowKey={(r) => r.variant.id}
        searchable={(r) => `${r.product.name} ${r.variant.sku} ${r.variant.name}`}
        searchPlaceholder="Search products or SKUs…"
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { value: "healthy", label: "Healthy" },
              { value: "low", label: "Low stock" },
              { value: "out", label: "Out of stock" },
            ],
          },
        ]}
        filterFn={(r, active) => !active.status || rowStatus(r) === active.status}
        empty={{ icon: <Boxes />, title: "No inventory", description: "Add products to track stock." }}
        columns={columns}
        renderCard={(r) => (
          <div className={cn("space-y-2", rowStatus(r) === "low" && "-m-4 rounded-2xl border border-warning/40 p-4")}>
            <div className="flex items-center gap-3">
              <div className="size-9 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                {r.product.images[0] && <img src={r.product.images[0]} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{r.product.name}</p>
                <p className="truncate text-xs text-muted-foreground">{r.variant.name} · {r.variant.sku}</p>
              </div>
              <StatusBadge status={rowStatus(r)} label={rowStatus(r) === "out" ? "Out" : rowStatus(r) === "low" ? "Low" : "Healthy"} />
            </div>
            <div className="flex items-center justify-between">
              <span className="tabular text-sm font-medium">{r.variant.stock} units</span>
              <Button size="sm" variant="secondary" onClick={() => setAdjust(r)}>
                Adjust
              </Button>
            </div>
          </div>
        )}
      />

      <StockAdjustDialog open={!!adjust} onOpenChange={(o) => !o && setAdjust(undefined)} product={adjust?.product} variant={adjust?.variant} />
    </div>
  );
}
