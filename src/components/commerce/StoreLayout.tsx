import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import { useApp } from "@/lib/store";
import { categories } from "@/data/commerce";

export function StoreLayout({ children }: { children: ReactNode }) {
  const { state } = useApp();
  const navigate = useNavigate();
  const cartCount = state.cart.reduce((a, l) => a + l.quantity, 0);

  return (
    <div data-module="commerce" className="min-h-screen bg-background text-foreground">
      <header className="glass glass-highlight sticky top-0 z-40 border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/store" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="grid size-8 place-items-center rounded-full bg-module text-module-foreground">
              <ShoppingBag className="size-4" />
            </span>
            Nimbus Shop
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
            <Link to="/store" className="text-muted-foreground transition-colors hover:text-foreground">
              Shop
            </Link>
            <button
              type="button"
              className="text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => {
                const el = document.getElementById("categories");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                else navigate({ to: "/store" });
              }}
            >
              Categories
            </button>
          </nav>
          <button
            type="button"
            aria-label="View cart"
            onClick={() => navigate({ to: "/store/cart" })}
            className="press relative grid size-10 place-items-center rounded-full bg-surface-2 hover:bg-accent"
          >
            <ShoppingBag className="size-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-module text-[10px] font-semibold text-module-foreground">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>

      <footer className="mt-16 border-t border-border py-10">
        <div className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground sm:px-6">
          <p className="font-semibold text-foreground">Nimbus Shop</p>
          <p className="mt-1 max-w-md">Merchandise made for the community. Shipping nationwide from Manila.</p>
          <div className="mt-4 flex flex-wrap gap-4">
            {categories.map((c) => (
              <span key={c.id}>{c.name}</span>
            ))}
          </div>
          <p className="mt-6 text-xs">© 2026 Nimbus Studio Manila. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
