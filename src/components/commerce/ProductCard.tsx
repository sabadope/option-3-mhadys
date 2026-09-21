import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { StatusBadge } from "@/components/kit";
import { peso } from "@/lib/format";
import { productStock } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product, to, variant = "admin" }: { product: Product; to?: string; variant?: "admin" | "store" }) {
  const stock = productStock(product);
  const image = product.images[0];
  const soldOut = product.status === "out_of_stock";

  const content = (
    <div className="group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-2">
        {image && (
          <img
            src={image}
            alt={product.name}
            className={cn(
              "h-full w-full object-cover transition-transform duration-500 ease-out",
              variant === "store" && "group-hover:scale-[1.06]",
            )}
          />
        )}
        {variant === "admin" && (
          <span className="absolute right-2.5 top-2.5">
            <StatusBadge status={product.status} />
          </span>
        )}
        {variant === "store" && soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
            <span className="rounded-full bg-foreground px-3 py-1 text-[11px] font-semibold text-background">Sold out</span>
          </div>
        )}
      </div>
      <div className="mt-3 flex-1 space-y-1">
        <p className="truncate text-[15px] font-medium tracking-tight">{product.name}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="tabular font-semibold">{peso(product.price)}</span>
          {product.compareAtPrice && <span className="tabular text-muted-foreground line-through">{peso(product.compareAtPrice)}</span>}
        </div>
        {variant === "admin" && <p className="text-xs text-muted-foreground">{stock} in stock</p>}
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="h-full">
      {to ? (
        <Link to={to} className="press block h-full">
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.div>
  );
}
