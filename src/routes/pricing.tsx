import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/shell/Brand";
import { cn } from "@/lib/utils";
import { startSession } from "@/lib/session";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Nimbus" },
      { name: "description", content: "Starter, Professional, and Business plans for running events, merchandise, and auto care from one Nimbus workspace." },
      { property: "og:title", content: "Pricing — Nimbus" },
      { property: "og:description", content: "Simple plans that grow with your business." },
    ],
  }),
  component: Pricing,
});

export const plans = [
  { id: "starter", name: "Starter", price: 1490, blurb: "For a single location getting organized.", features: ["1 module", "Up to 3 team members", "500 customers", "Email support"] },
  { id: "professional", name: "Professional", price: 3990, blurb: "All three modules with shared customers.", features: ["Event, Commerce & Auto Care", "Up to 10 team members", "Unlimited customers", "Reports & exports", "Priority support"], highlight: true },
  { id: "business", name: "Business", price: 8990, blurb: "Multi-location operations at scale.", features: ["Everything in Professional", "Unlimited team members", "Multiple workspaces", "API access", "Dedicated onboarding"] },
] as const;

function Pricing() {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(true);
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Link to="/">
          <Brand />
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button
            onClick={() => {
              startSession("demo");
              navigate({ to: "/app" });
            }}
          >
            Explore Demo
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">Pricing</p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Simple plans that grow with your business.</h1>
          <p className="mt-4 text-muted-foreground">Billing is a placeholder in this MVP. Plans below show how Nimbus would be packaged.</p>
        </div>
        <div className="mt-8 inline-flex items-center gap-1 rounded-full bg-surface-2 p-1">
          {[
            ["Monthly", false],
            ["Annual · save 20%", true],
          ].map(([label, val]) => (
            <button
              key={String(label)}
              type="button"
              onClick={() => setAnnual(val as boolean)}
              className={cn("h-9 rounded-full px-4 text-sm font-medium transition-colors", annual === val ? "bg-foreground text-background" : "text-muted-foreground")}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
              className={cn("flex flex-col rounded-3xl p-7", "highlight" in p && p.highlight ? "glass-strong glass-highlight ring-1 ring-foreground/20" : "surface")}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">{p.name}</h2>
                {"highlight" in p && p.highlight && <span className="rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-background">Popular</span>}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
              <p className="mt-6 text-4xl font-semibold tracking-tight">
                ₱{Math.round(annual ? p.price * 0.8 : p.price).toLocaleString()}
                <span className="text-base font-normal text-muted-foreground">/mo</span>
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className="size-4 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full" variant={"highlight" in p && p.highlight ? "default" : "secondary"} onClick={() => toast.success(`${p.name} selected`, { description: "Subscription billing will be connected in a later release." })}>
                Choose {p.name}
              </Button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
