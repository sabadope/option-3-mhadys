import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Car, ShoppingBag, Ticket } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/shell/Brand";
import { startSession } from "@/lib/session";
import bg from "@/assets/auth-bg.jpg";
import studio from "@/assets/autocare/studio.jpg";
import summit from "@/assets/events/summit.jpg";
import hoodie from "@/assets/products/hoodie.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nimbus — One platform for events, merchandise, and auto care" },
      { name: "description", content: "Nimbus is a premium business OS that unifies event booking, merchandise commerce, and car wash & detailing operations in one account." },
      { property: "og:title", content: "Nimbus — One platform for events, merchandise, and auto care" },
      { property: "og:description", content: "Run event bookings, merchandise, and auto detailing operations from a single premium workspace." },
    ],
  }),
  component: Landing,
});

const pillars = [
  { id: "event", icon: Ticket, name: "Event", tagline: "Booking & Management", image: summit, points: ["Ticketing & capacity", "Calendar & schedules", "QR check-in"] },
  { id: "commerce", icon: ShoppingBag, name: "Commerce", tagline: "Merchandise & Inventory", image: hoodie, points: ["Products & variants", "Inventory alerts", "Order fulfillment"] },
  { id: "autocare", icon: Car, name: "Auto Care", tagline: "Car Wash & Detailing", image: studio, points: ["Bay & staff scheduling", "Work orders", "Vehicle service records"] },
] as const;

function Landing() {
  const navigate = useNavigate();
  const demo = () => {
    startSession("demo");
    navigate({ to: "/app" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <img src={bg} alt="" width={1920} height={1080} className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Brand />
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link to="/pricing">Pricing</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button onClick={demo}>Explore Demo</Button>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }} className="max-w-3xl">
          <p className="eyebrow mb-5">Business OS · Manila</p>
          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
            Three businesses. <span className="text-muted-foreground">One quiet, precise platform.</span>
          </h1>
          <p className="mt-6 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
            Nimbus unifies event booking, merchandise commerce, and auto detailing operations — with shared customers, payments, and reporting.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={demo}>
              Explore Demo <ArrowRight />
            </Button>
            <Button size="lg" variant="glass" asChild>
              <Link to="/login">Sign in to your workspace</Link>
            </Button>
          </div>
        </motion.div>

        <div className="mt-20 grid gap-4 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.article
              key={p.id}
              data-module={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
              className="glass glass-highlight group relative overflow-hidden rounded-3xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={p.image} alt={p.name} width={1536} height={864} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <span className="absolute left-4 top-4 grid size-9 place-items-center rounded-xl bg-module text-module-foreground">
                  <p.icon className="size-4" />
                </span>
              </div>
              <div className="p-5">
                <p className="eyebrow text-module">{p.tagline}</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">{p.name}</h2>
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2">
                      <span className="size-1 rounded-full bg-module" /> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 grid gap-6 rounded-3xl surface p-6 sm:grid-cols-3 sm:p-8">
          {[
            ["₱48,250", "processed today across modules"],
            ["1 account", "for events, merch, and detailing"],
            ["⌘K", "search customers, orders, and vehicles"],
          ].map(([v, l]) => (
            <div key={v}>
              <p className="text-3xl font-semibold tracking-tight">{v}</p>
              <p className="mt-1 text-sm text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
