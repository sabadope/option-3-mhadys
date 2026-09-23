import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/kit";
import { StoreLayout } from "@/components/commerce/StoreLayout";
import { CartLineItem, CartSummary } from "@/components/commerce/Cart";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/store/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — Nimbus Shop" },
      { name: "description", content: "Review your cart before checkout." },
      { property: "og:title", content: "Your cart — Nimbus Shop" },
      { property: "og:description", content: "Merchandise cart summary." },
    ],
  }),
  component: CartPage,
});

const SHIPPING = 150;
const FREE_SHIPPING_THRESHOLD = 3000;

function CartPage() {
  const { state, actions } = useApp();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);

  const lines = useMemo(
    () =>
      state.cart
        .map((l) => {
          const product = state.products.find((p) => p.id === l.productId);
          const variant = product?.variants.find((v) => v.id === l.variantId);
          return product && variant ? { line: l, product, variant } : undefined;
        })
        .filter(Boolean) as { line: (typeof state.cart)[number]; product: (typeof state.products)[number]; variant: NonNullable<(typeof state.products)[number]["variants"][number]> }[],
    [state.cart, state.products],
  );

  const subtotal = lines.reduce((a, l) => a + l.variant.price * l.line.quantity, 0);
  const discount = state.discounts.find((d) => d.code === applied && d.active);
  const discountAmount = discount ? (discount.type === "percent" ? Math.round((subtotal * discount.value) / 100) : discount.value) : 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const applyCode = () => {
    const found = state.discounts.find((d) => d.code === code.trim().toUpperCase() && d.active);
    if (!found) {
      toast.error("Invalid or inactive discount code.");
      return;
    }
    setApplied(found.code);
    toast.success(`Applied ${found.code}`);
  };

  if (lines.length === 0) {
    return (
      <StoreLayout>
        <EmptyState
          icon={<ShoppingBag />}
          title="Your cart is empty"
          description="Browse the shop to find something for the crew."
          action={
            <Button asChild variant="module">
              <Link to="/store">Continue shopping</Link>
            </Button>
          }
        />
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Your cart</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-3">
          {lines.map(({ line, product, variant }) => (
            <CartLineItem
              key={variant.id}
              product={product}
              variant={variant}
              quantity={line.quantity}
              onQtyChange={(q) => actions.setCartQty(variant.id, q)}
              onRemove={() => actions.setCartQty(variant.id, 0)}
            />
          ))}
        </div>
        <CartSummary subtotal={subtotal} discount={discountAmount} shipping={shipping} total={total}>
          <div className="mt-5 space-y-2">
            <div className="flex gap-2">
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Discount code" className="h-10" />
              <Button variant="secondary" onClick={applyCode}>
                Apply
              </Button>
            </div>
            {applied && <p className="text-xs text-success">{applied} applied</p>}
          </div>
          <Button asChild size="lg" variant="module" className="mt-5 w-full">
            <Link to="/store/checkout">Checkout</Link>
          </Button>
        </CartSummary>
      </div>
    </StoreLayout>
  );
}
