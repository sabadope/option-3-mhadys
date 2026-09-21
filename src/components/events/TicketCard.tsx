import { motion } from "motion/react";
import type { Event, TicketType } from "@/types";
import { peso } from "@/lib/format";
import { StatusBadge } from "@/components/kit";
import { CapacityBar } from "./CapacityBar";

function ticketStatus(t: TicketType, eventStatus: Event["status"]): { status: string; label: string } {
  if (eventStatus === "draft") return { status: "draft", label: "Draft" };
  if (t.sold >= t.quantity) return { status: "out", label: "Sold out" };
  return { status: "active", label: "On sale" };
}

export function TicketCard({ event, ticketType, index = 0 }: { event: Event; ticketType: TicketType; index?: number }) {
  const revenue = ticketType.sold * ticketType.price;
  const { status, label } = ticketStatus(ticketType, event.status);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="surface rounded-2xl p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{ticketType.name}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{ticketType.description}</p>
        </div>
        <StatusBadge status={status} label={label} />
      </div>
      <p className="tabular mt-3 text-lg font-semibold tracking-tight">{peso(ticketType.price)}</p>
      <div className="mt-3">
        <CapacityBar sold={ticketType.sold} capacity={ticketType.quantity} label="Sold" size="sm" />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Revenue</span>
        <span className="tabular font-medium">{peso(revenue)}</span>
      </div>
    </motion.div>
  );
}
