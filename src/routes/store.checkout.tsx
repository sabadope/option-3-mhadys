import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, FormField, PaymentPanel, inputClass } from "@/components/kit";
import { StoreLayout } from "@/components/commerce/StoreLayout";
import { CartSummary } from "@/components/commerce/Cart";
import { useApp } from "@/lib/store";
import type { PaymentMethod } from "@/types";

export const Route = createFileRoute("/store/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Nimbus Shop" },
      { name: "description", content: "Enter your details and pay for your order." },
      { property: "og:title", content: "Checkout — Nimbus Shop" },
      { property: "og:description", content: "Secure merchandise checkout." },
    ],
  }),
  component: CheckoutPage,
});

const SHIPPING = 150;
const FREE_SHIPPING_THRESHOLD = 3000;

function CheckoutPage() {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

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
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING;
  const total = subtotal + shipping;

  if (lines.length === 0) {
    return (
      <StoreLayout>
        <EmptyState
          title="Your cart is empty"
          description="Add something to your cart before checking out."
          action={
            <Button asChild variant="module">
              <Link to="/store">Continue shopping</Link>
            </Button>
          }
        />
      </StoreLayout>
    );
  }

  const canPay = !!(name.trim() && email.includes("@") && phone.trim() && address.trim());

  const placeOrder = (method: PaymentMethod) => {
    let customerId = state.customers.find((c) => c.email.toLowerCase() === email.toLowerCase())?.id;
    if (!customerId) {
      customerId = actions.addCustomer({ name: name.trim(), email: email.trim(), phone: phone.trim(), city: "" }).id;
    }
    const order = actions.placeOrder({
      customerId,
      items: lines.map((l) => ({
        id: `oi_${l.variant.id}`,
        productId: l.product.id,
        variantId: l.variant.id,
        name: l.product.name,
        variantName: l.variant.name,
        quantity: l.line.quantity,
        unitPrice: l.variant.price,
        image: l.product.images[0] ?? "",
      })),
      subtotal,
      discount: 0,
      shipping,
      total,
      paymentStatus: "paid",
      paymentMethod: method,
      shippingAddress: address.trim(),
    });
    toast.success("Order placed!");
    navigate({ to: "/store/confirmation", search: { order: order.id } });
  };

  return (
    <StoreLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="surface rounded-2xl p-5">
            <p className="eyebrow mb-4">Contact & shipping</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full name" required>
                <Input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              </FormField>
              <FormField label="Email" required>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              </FormField>
              <FormField label="Phone" required>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
              </FormField>
              <FormField label="Shipping address" required className="sm:col-span-2">
                <Input value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
              </FormField>
            </div>
          </div>

          <PaymentPanel
            summary={{ subtotal, total, status: "unpaid" }}
            ctaLabel={`Pay ₱${total.toLocaleString()}`}
            onPay={canPay ? placeOrder : undefined}
            disabled={!canPay}
          />
          {!canPay && <p className="text-xs text-muted-foreground">Fill in your contact and shipping details to pay.</p>}
        </div>

        <CartSummary subtotal={subtotal} discount={0} shipping={shipping} total={total} />
      </div>
    </StoreLayout>
  );
}
