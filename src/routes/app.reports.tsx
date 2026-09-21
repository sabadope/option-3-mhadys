import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MetricCard, PageHeader, RankedBars, SectionCard, SimpleBarChart, TrendAreaChart } from "@/components/kit";
import { useApp, eventRevenue, eventSold } from "@/lib/store";
import { peso } from "@/lib/format";
import { ticketSalesSeries } from "@/data/events";
import { salesSeries } from "@/data/commerce";
import { autocareSeries } from "@/data/autocare";
import { modules } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { ModuleId } from "@/types";

export const Route = createFileRoute("/app/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Nimbus" },
      { name: "description", content: "Performance reporting for events, merchandise, and auto care operations." },
      { property: "og:title", content: "Reports — Nimbus" },
      { property: "og:description", content: "Revenue, volume, and utilization by module." },
    ],
  }),
  component: Page,
});

function Page() {
  const [mod, setMod] = useState<ModuleId>("event");
  const { state } = useApp();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Platform"
        title="Reports"
        description="Last 14 days, by module."
        actions={
          <Button variant="secondary" onClick={() => toast.success("Export queued", { description: "A CSV will be emailed to you shortly." })}>
            <Download /> Export
          </Button>
        }
      />
      <div className="flex gap-1 rounded-full bg-surface-2 p-1 w-fit max-w-full overflow-x-auto scrollbar-none">
        {modules.map((m) => (
          <button key={m.id} type="button" onClick={() => setMod(m.id)} data-module={m.id} className={cn("flex h-9 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors", mod === m.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>
            <m.icon className="size-4" /> {m.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={mod} data-module={mod} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="space-y-4">
          {mod === "event" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Bookings" value={String(state.bookings.length + 480)} delta={11.2} />
                <MetricCard label="Tickets sold" value={String(ticketSalesSeries.reduce((a, d) => a + d.tickets, 0))} delta={9.4} />
                <MetricCard label="Attendance rate" value="87%" delta={2.1} hint="checked in / expected" />
                <MetricCard label="Revenue" value={peso(ticketSalesSeries.reduce((a, d) => a + d.revenue, 0))} delta={14.8} />
              </div>
              <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                <SectionCard eyebrow="Ticket revenue" title="Daily">
                  <TrendAreaChart data={ticketSalesSeries} dataKey="revenue" format={(v) => peso(v, { compact: true })} id="rep-ev" />
                </SectionCard>
                <SectionCard eyebrow="By event" title="Revenue">
                  <RankedBars items={state.events.map((e) => ({ label: e.name, value: eventRevenue(e), sub: `${eventSold(e)} / ${e.capacity} sold` }))} format={(v) => peso(v, { compact: true })} />
                </SectionCard>
              </div>
            </>
          )}
          {mod === "commerce" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Sales" value={peso(salesSeries.reduce((a, d) => a + d.sales, 0))} delta={18.4} />
                <MetricCard label="Orders" value={String(salesSeries.reduce((a, d) => a + d.orders, 0))} delta={12.0} />
                <MetricCard label="Avg order value" value={peso(Math.round(salesSeries.reduce((a, d) => a + d.sales, 0) / salesSeries.reduce((a, d) => a + d.orders, 0)))} delta={5.6} />
                <MetricCard label="Inventory value" value={peso(state.products.reduce((a, p) => a + p.variants.reduce((b, v) => b + v.stock * v.price, 0), 0))} hint="at retail" />
              </div>
              <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                <SectionCard eyebrow="Sales" title="Daily">
                  <SimpleBarChart data={salesSeries} dataKey="sales" format={(v) => peso(v, { compact: true })} />
                </SectionCard>
                <SectionCard eyebrow="Top products" title="Units sold">
                  <RankedBars items={state.products.filter((p) => p.soldCount > 0).sort((a, b) => b.soldCount - a.soldCount).map((p) => ({ label: p.name, value: p.soldCount, sub: peso(p.soldCount * p.price, { compact: true }) }))} />
                </SectionCard>
              </div>
            </>
          )}
          {mod === "autocare" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Vehicles serviced" value={String(autocareSeries.reduce((a, d) => a + d.vehicles, 0))} delta={7.3} hint="7 days" />
                <MetricCard label="Revenue" value={peso(autocareSeries.reduce((a, d) => a + d.revenue, 0))} delta={10.9} />
                <MetricCard label="Bay utilization" value="72%" delta={3.4} />
                <MetricCard label="Avg ticket" value={peso(Math.round(autocareSeries.reduce((a, d) => a + d.revenue, 0) / autocareSeries.reduce((a, d) => a + d.vehicles, 0)))} />
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                <SectionCard eyebrow="Vehicles" title="Per day" className="lg:col-span-2">
                  <SimpleBarChart data={autocareSeries} dataKey="vehicles" />
                </SectionCard>
                <SectionCard eyebrow="Staff workload" title="Jobs this week">
                  <RankedBars items={state.staff.filter((s) => s.status !== "off").map((s) => ({ label: s.name, value: state.appointments.filter((a) => a.staffId === s.id).length + 6, sub: s.role }))} />
                </SectionCard>
              </div>
              <SectionCard eyebrow="Services" title="Revenue mix">
                <RankedBars items={state.services.map((s) => ({ label: s.name, value: state.appointments.filter((a) => a.serviceId === s.id).reduce((x, a) => x + a.total, 0) + s.price })).sort((a, b) => b.value - a.value).slice(0, 6)} format={(v) => peso(v, { compact: true })} />
              </SectionCard>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
