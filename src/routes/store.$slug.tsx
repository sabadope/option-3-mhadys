import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/kit";
import { StoreLayout } from "@/components/commerce/StoreLayout";
import { ProductCard } from "@/components/commerce/ProductCard";
import { useApp } from "@/lib/store";
import { peso } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/store/$slug")({
  head: () => ({
    meta: [
      { title: "Product — Nimbus Shop" },
      { name: "description", content: "Product detail, sizing, and colors." },
      { property: "og:title", content: "Product — Nimbus Shop" },
      { property: "og:description", content: "Shop Nimbus merchandise." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { state, actions } = useApp();
  const product = state.products.find((p) => p.slug === slug);

  const colors = useMemo(() => (product ? Array.from(new Set(product.variants.map((v) => v.option1))) : []), [product]);
  const [color, setColor] = useState(colors[0] ?? "");
  const [size, setSize] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [image, setImage] = useState(0);

  if (!product) {
    return (
      <StoreLayout>
        <EmptyState
          title="Product not found"
          description="This item may no longer be available."
          action={
            <Button asChild variant="module">
              <Link to="/store">Continue shopping</Link>
            </Button>
          }
        />
      </StoreLayout>
    );
  }

  const sizesForColor = product.variants.filter((v) => v.option1 === color).map((v) => v.option2).filter(Boolean) as string[];
  const activeVariant = product.variants.find((v) => v.option1 === color && (v.option2 === size || (!v.option2 && !size)));
  const related = state.products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.status !== "draft").slice(0, 4);

  const addToCart = () => {
    if (!activeVariant) {
      toast.error("Select a color and size first.");
      return;
    }
    if (activeVariant.stock === 0) {
      toast.error("This variant is out of stock.");
      return;
    }
    actions.addToCart({ productId: product.id, variantId: activeVariant.id, quantity: qty });
    toast.success("Added to cart", { description: `${product.name} · ${activeVariant.name}` });
  };

  return (
    <StoreLayout>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="aspect-square overflow-hidden rounded-3xl bg-surface-2">
            <img src={product.images[image]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setImage(i)}
                  className={cn("size-16 overflow-hidden rounded-xl ring-2", i === image ? "ring-module" : "ring-transparent")}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="tabular text-xl font-semibold">{peso(activeVariant?.price ?? product.price)}</span>
              {product.compareAtPrice && <span className="tabular text-muted-foreground line-through">{peso(product.compareAtPrice)}</span>}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{product.description}</p>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Color</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c);
                    setSize(undefined);
                  }}
                  className={cn(
                    "h-10 rounded-full border px-4 text-sm font-medium transition-colors",
                    color === c ? "border-foreground bg-foreground text-background" : "border-border-strong hover:bg-accent",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {sizesForColor.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizesForColor.map((s) => {
                  const v = product.variants.find((x) => x.option1 === color && x.option2 === s);
                  const disabled = !v || v.stock === 0;
                  return (
                    <button
                      key={s}
                      disabled={disabled}
                      onClick={() => setSize(s)}
                      className={cn(
                        "h-10 min-w-10 rounded-full border px-3 text-sm font-medium transition-colors",
                        disabled && "cursor-not-allowed opacity-40 line-through",
                        size === s && !disabled ? "border-foreground bg-foreground text-background" : "border-border-strong hover:bg-accent",
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-surface-2 p-1">
              <Button type="button" variant="ghost" size="icon-sm" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <Minus className="size-3.5" />
              </Button>
              <span className="tabular w-6 text-center text-sm font-medium">{qty}</span>
              <Button type="button" variant="ghost" size="icon-sm" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>
                <Plus className="size-3.5" />
              </Button>
            </div>
            <Button size="lg" variant="module" className="flex-1" onClick={addToCart} disabled={!activeVariant || activeVariant.stock === 0}>
              {activeVariant?.stock === 0 ? "Out of stock" : "Add to cart"}
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold tracking-tight">You may also like</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} to={`/store/${p.slug}`} variant="store" />
            ))}
          </div>
        </section>
      )}
    </StoreLayout>
  );
}
