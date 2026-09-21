import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ExternalLink, Minus, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState, FormField, PageHeader, PageSkeleton, SectionCard, StatusBadge, inputClass } from "@/components/kit";
import { StockAdjustDialog } from "@/components/commerce/StockAdjustDialog";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { useApp, productStock } from "@/lib/store";
import { peso, formatDate } from "@/lib/format";
import { categories } from "@/data/commerce";
import type { ProductStatus, ProductVariant } from "@/types";

export const Route = createFileRoute("/app/commerce/products/$productId")({
  head: () => ({
    meta: [
      { title: "Product — Nimbus Commerce" },
      { name: "description", content: "Product detail, inventory, and sales performance." },
      { property: "og:title", content: "Product — Nimbus Commerce" },
      { property: "og:description", content: "View variants, stock, and recent orders for this product." },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const loading = useSimulatedLoading();
  const { productId } = Route.useParams();
  const { state, actions } = useApp();
  const [adjustVariant, setAdjustVariant] = useState<ProductVariant | undefined>();
  const [editing, setEditing] = useState(false);

  if (loading) return <PageSkeleton />;

  const product = state.products.find((p) => p.id === productId);
  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="This product may have been removed."
        action={
          <Button asChild variant="module">
            <Link to="/app/commerce/products">Back to products</Link>
          </Button>
        }
      />
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const relatedOrders = state.orders.filter((o) => o.items.some((i) => i.productId === product.id)).slice(0, 6);
  const revenueEstimate = product.soldCount * product.price;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Product"
        title={product.name}
        description={product.sku}
        actions={
          <>
            <Button asChild variant="ghost">
              <Link to="/app/commerce/products">
                <ArrowLeft /> Back
              </Link>
            </Button>
            <Button variant="secondary" onClick={() => setEditing(true)}>
              <Pencil /> Edit
            </Button>
            <Button asChild variant="module">
              <Link to="/store/$slug" params={{ slug: product.slug }} target="_blank">
                <ExternalLink /> View in storefront
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="aspect-square overflow-hidden rounded-3xl bg-surface-2">
          {product.images[0] && <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />}
        </div>

        <div className="space-y-4">
          <SectionCard>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={product.status} />
              <span className="text-sm text-muted-foreground">{category?.name ?? "Uncategorized"}</span>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <p className="text-3xl font-semibold tracking-tight tabular">{peso(product.price)}</p>
              {product.compareAtPrice && <p className="tabular text-muted-foreground line-through">{peso(product.compareAtPrice)}</p>}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{product.description}</p>
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Sold</p>
                <p className="tabular font-semibold">{product.soldCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Est. revenue</p>
                <p className="tabular font-semibold">{peso(revenueEstimate, { compact: true })}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">In stock</p>
                <p className="tabular font-semibold">{productStock(product)}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Inventory by variant">
            <ul className="divide-y divide-border">
              {product.variants.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.sku}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="tabular text-sm font-medium">{v.stock} units</span>
                    <div className="flex items-center gap-1">
                      <Button size="icon-sm" variant="secondary" aria-label={`Decrease ${v.name}`} onClick={() => actions.adjustStock(v.id, -1)}>
                        <Minus className="size-3.5" />
                      </Button>
                      <Button size="icon-sm" variant="secondary" aria-label={`Increase ${v.name}`} onClick={() => actions.adjustStock(v.id, 1)}>
                        <Plus className="size-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setAdjustVariant(v)}>
                        Adjust
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>

      <SectionCard title="Recent orders" eyebrow="Activity">
        {relatedOrders.length === 0 ? (
          <EmptyState title="No orders yet" description="This product hasn't been ordered." />
        ) : (
          <ul className="divide-y divide-border">
            {relatedOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                <div>
                  <Link to="/app/commerce/orders/$orderId" params={{ orderId: o.id }} className="text-sm font-medium hover:underline">
                    {o.number}
                  </Link>
                  <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</p>
                </div>
                <StatusBadge status={o.status} />
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <StockAdjustDialog open={!!adjustVariant} onOpenChange={(o) => !o && setAdjustVariant(undefined)} product={product} variant={adjustVariant} />
      <EditProductSheet open={editing} onOpenChange={setEditing} productId={product.id} />
    </div>
  );
}

function EditProductSheet({ open, onOpenChange, productId }: { open: boolean; onOpenChange: (o: boolean) => void; productId: string }) {
  const { state, actions } = useApp();
  const product = state.products.find((p) => p.id === productId);
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(String(product?.price ?? 0));
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? "draft");
  const [description, setDescription] = useState(product?.description ?? "");

  if (!product) return null;

  const save = () => {
    actions.updateProduct(product.id, { name: name.trim() || product.name, price: Number(price) || product.price, status, description });
    toast.success("Product updated");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="glass-strong w-full max-w-md rounded-l-3xl border overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit product</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4 px-1">
          <FormField label="Name" htmlFor="e-name">
            <Input id="e-name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </FormField>
          <FormField label="Price (₱)" htmlFor="e-price">
            <Input id="e-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
          </FormField>
          <FormField label="Status" htmlFor="e-status">
            <Select value={status} onValueChange={(v) => setStatus(v as ProductStatus)}>
              <SelectTrigger id="e-status" className={inputClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="out_of_stock">Out of stock</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Description" htmlFor="e-desc">
            <Textarea id="e-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </FormField>
          <Button variant="module" className="w-full" onClick={save}>
            Save changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
