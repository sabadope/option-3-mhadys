import { createFileRoute, Link } from "@tanstack/react-router";
import { Car, ShoppingBag, Ticket } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Chip, PageHeader } from "@/components/kit";
import { InitialsAvatar } from "@/components/kit/Avatar";
import { activity } from "@/data/shared";
import { useApp } from "@/lib/store";
import { timeAgo } from "@/lib/format";
import type { ModuleId } from "@/types";

export const Route = createFileRoute("/app/activity")({
  head: () => ({
    meta: [
      { title: "Activity — Nimbus" },
      { name: "description", content: "A live feed of bookings, orders, and service events across your business." },
      { property: "og:title", content: "Activity — Nimbus" },
      { property: "og:description", content: "Recent activity across all modules." },
    ],
  }),
  component: Page,
});

const icons = { event: Ticket, commerce: ShoppingBag, autocare: Car };

function Page() {
  const { state } = useApp();
  const [filter, setFilter] = useState<ModuleId | "">("");
  const list = activity.filter((a) => (filter ? a.module === filter : true)).sort((a, b) => b.at.localeCompare(a.at));
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader eyebrow="Timeline" title="Activity" description="What's been happening across modules." />
      <div className="flex gap-1.5 rounded-full bg-surface-2 p-1 w-fit">
        <Chip selected={!filter} onClick={() => setFilter("")}>All</Chip>
        <Chip selected={filter === "event"} onClick={() => setFilter("event")}>Event</Chip>
        <Chip selected={filter === "commerce"} onClick={() => setFilter("commerce")}>Commerce</Chip>
        <Chip selected={filter === "autocare"} onClick={() => setFilter("autocare")}>Auto Care</Chip>
      </div>
      <ol className="space-y-2">
        {list.map((a, i) => {
          const Icon = icons[a.module];
          const c = state.customers.find((x) => x.id === a.customerId);
          return (
            <motion.li key={a.id} data-module={a.module} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="surface flex items-center gap-3 rounded-2xl p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-module-soft text-module">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="truncate text-xs text-muted-foreground">{a.detail}</p>
              </div>
              {c && (
                <Link to="/app/customers/$customerId" params={{ customerId: c.id }} aria-label={c.name} className="hidden sm:block">
                  <InitialsAvatar name={c.name} size="sm" />
                </Link>
              )}
              <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(a.at)}</span>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
