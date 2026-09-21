import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutGrid, List, Package, Plus } from "lucide-react";
import { DataTable, PageHeader, PageSkeleton, StatusBadge } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/commerce/ProductCard";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { useApp, productStock } from "@/lib/store";
import { peso } from "@/lib/format";
import { categories } from "@/data/commerce";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/commerce/products/")({
  head: () => ({
    meta: [
      { title: "Products — Nimbus Commerce" },
      { name: "description", content: "Browse and manage your merchandise catalog." },
      { property: "og:title", content: "Products — Nimbus Commerce" },
      { property: "og:description", content: "Grid and table views of every product." },
    ],
  }),
  component: ProductsIndex,
});

function ProductsIndex() {
  const loading = useSimulatedLoading();
  const { state } = useApp();
  const [view, setView] = useState<"grid" | "table">("grid");
  const navigate = useNavigate();

  if (loading) return <PageSkeleton />;

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Commerce"
        title="Products"
        description={`${state.products.length} products in your catalog.`}
        actions={
          <>
            <div className="flex items-center gap-1 rounded-full bg-surface-2 p-1">
              <button
                aria-label="Grid view"
                onClick={() => setView("grid")}
                className={cn("grid size-8 place-items-center rounded-full", view === "grid" ? "bg-foreground text-background" : "text-muted-foreground")}
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                aria-label="Table view"
                onClick={() => setView("table")}
                className={cn("grid size-8 place-items-center rounded-full", view === "table" ? "bg-foreground text-background" : "text-muted-foreground")}
              >
                <List className="size-4" />
              </button>
            </div>
            <Button asChild variant="module">
              <Link to="/app/commerce/products/new">
                <Plus /> New product
              </Link>
            </Button>
          </>
        }
      />

      {view === "grid" ? (
        <ProductGrid products={state.products} />
      ) : (
        <DataTable<Product>
          rows={state.products}
          rowKey={(p) => p.id}
          searchable={(p) => `${p.name} ${p.sku}`}
          searchPlaceholder="Search products…"
          onRowClick={(p) => navigate({ to: "/app/commerce/products/$productId", params: { productId: p.id } })}
          filters={[
            { key: "status", label: "Status", options: [
              { value: "active", label: "Active" },
              { value: "draft", label: "Draft" },
              { value: "out_of_stock", label: "Out of stock" },
            ] },
            { key: "categoryId", label: "Category", options: categoryOptions },
          ]}
          filterFn={(p, active) =>
            (!active.status || p.status === active.status) && (!active.categoryId || p.categoryId === active.categoryId)
          }
          empty={{
            icon: <Package />,
            title: "Start building your catalog.",
            description: "Add your first product to begin selling merchandise.",
            action: (
              <Button asChild variant="module">
                <Link to="/app/commerce/products/new">
                  <Plus /> New product
                </Link>
              </Button>
            ),
          }}
          columns={[
            {
              key: "name",
              header: "Product",
              cell: (p) => (
                <div className="flex min-w-0 items-center gap-3">
                  <div className="size-9 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                    {p.images[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.sku}</p>
                  </div>
                </div>
              ),
            },
            { key: "category", header: "Category", cell: (p) => categories.find((c) => c.id === p.categoryId)?.name ?? "—", hideBelow: "lg" },
            { key: "price", header: "Price", cell: (p) => peso(p.price) },
            { key: "stock", header: "Stock", cell: (p) => productStock(p), hideBelow: "lg" },
            { key: "status", header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
          ]}
        />
      )}
    </div>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="surface rounded-2xl p-14 text-center">
        <p className="text-[15px] font-semibold">Start building your catalog.</p>
        <p className="mt-1 text-sm text-muted-foreground">Add your first product to begin selling merchandise.</p>
        <Button asChild variant="module" className="mt-5">
          <Link to="/app/commerce/products/new">
            <Plus /> New product
          </Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} to={`/app/commerce/products/${p.id}`} />
      ))}
    </div>
  );
}
