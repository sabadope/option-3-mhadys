import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { peso } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product, ProductVariant } from "@/types";

export function CartLineItem({
  product,
  variant,
  quantity,
  onQtyChange,
  onRemove,
}: {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-4 rounded-2xl surface p-4">
      <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-surface-2">
        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{product.name}</p>
            <p className="text-xs text-muted-foreground">{variant.name}</p>
          </div>
          <button type="button" aria-label="Remove item" onClick={onRemove} className="press text-muted-foreground hover:text-destructive">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full bg-surface-2 p-1">
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Decrease quantity" onClick={() => onQtyChange(quantity - 1)}>
              <Minus className="size-3.5" />
            </Button>
            <span className="tabular w-6 text-center text-sm font-medium">{quantity}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Increase quantity"
              disabled={quantity >= variant.stock}
              onClick={() => onQtyChange(quantity + 1)}
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
          <p className="tabular text-sm font-semibold">{peso(variant.price * quantity)}</p>
        </div>
      </div>
    </div>
  );
}

export function CartSummary({
  subtotal,
  discount,
  shipping,
  total,
  className,
  children,
}: {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("surface rounded-2xl p-5", className)}>
      <p className="eyebrow">Order summary</p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="tabular">{peso(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <dt>Discount</dt>
            <dd className="tabular">− {peso(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd className="tabular">{shipping === 0 ? "Free" : peso(shipping)}</dd>
        </div>
        <div className="my-2 border-t border-border" />
        <div className="flex justify-between text-base font-semibold">
          <dt>Total</dt>
          <dd className="tabular">{peso(total)}</dd>
        </div>
      </dl>
      {children}
    </div>
  );
}
