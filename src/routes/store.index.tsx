import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { StoreLayout } from "@/components/commerce/StoreLayout";
import { ProductCard } from "@/components/commerce/ProductCard";
import { useApp } from "@/lib/store";
import { categories } from "@/data/commerce";
import hoodie from "@/assets/products/hoodie.jpg";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/store/")({
  head: () => ({
    meta: [
      { title: "Nimbus Shop — Made for the crew" },
      { name: "description", content: "Official Nimbus merchandise: hoodies, tees, caps, and more." },
      { property: "og:title", content: "Nimbus Shop" },
      { property: "og:description", content: "Merchandise made for the community." },
    ],
  }),
  component: StorePage,
});

function StorePage() {
  const { state } = useApp();
  const [category, setCategory] = useState<string>("");

  const shoppable = useMemo(() => state.products.filter((p) => p.status === "active" || p.status === "out_of_stock"), [state.products]);
  const filtered = category ? shoppable.filter((p) => p.categoryId === category) : shoppable;

  return (
    <StoreLayout>
      <section className="relative overflow-hidden rounded-3xl bg-surface-2">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="order-2 space-y-5 p-8 sm:p-12 lg:order-1">
            <p className="eyebrow">New drop</p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Made for the crew.</h1>
            <p className="max-w-md text-muted-foreground">
              Heavyweight essentials built for community events, studio days, and everything in between.
            </p>
            <Link
              to="/store/$slug"
              params={{ slug: shoppable[0]?.slug ?? "" }}
              className="press inline-flex h-12 items-center rounded-full bg-foreground px-6 text-sm font-semibold text-background"
            >
              Shop the collection
            </Link>
          </div>
          <div className="order-1 aspect-[4/3] overflow-hidden lg:order-2 lg:aspect-auto lg:h-full">
            <img src={hoodie} alt="Premium hoodie" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section id="categories" className="mt-14">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Shop by category</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("")}
            className={cn(
              "h-9 rounded-full px-4 text-sm font-medium transition-colors",
              category === "" ? "bg-foreground text-background" : "bg-surface-2 text-muted-foreground hover:text-foreground",
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                "h-9 rounded-full px-4 text-sm font-medium transition-colors",
                category === c.id ? "bg-foreground text-background" : "bg-surface-2 text-muted-foreground hover:text-foreground",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} to={`/store/${p.slug}`} variant="store" />
        ))}
      </section>
    </StoreLayout>
  );
}
