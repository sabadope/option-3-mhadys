import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CalendarDays, MapPin } from "lucide-react";
import type { Event } from "@/types";
import { eventRevenue, eventSold } from "@/lib/store";
import { formatDate, formatTime, peso } from "@/lib/format";
import { StatusBadge } from "@/components/kit";
import { CapacityBar } from "./CapacityBar";

export function EventCard({ event, index = 0 }: { event: Event; index?: number }) {
  const sold = eventSold(event);
  const revenue = eventRevenue(event);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.32, 0.72, 0, 1] }}
    >
      <Link
        to="/app/events/$eventId"
        params={{ eventId: event.id }}
        className="press surface group block overflow-hidden rounded-2xl"
      >
        <div className="relative h-36 w-full overflow-hidden">
          <img
            src={event.coverImage}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
          <div className="absolute right-3 top-3">
            <StatusBadge status={event.status} />
          </div>
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <p className="truncate text-sm font-semibold tracking-tight">{event.name}</p>
          </div>
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {formatDate(event.date)} · {formatTime(event.startTime)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            <span className="truncate">{event.venue}</span>
          </div>
          <CapacityBar sold={sold} capacity={event.capacity} size="sm" />
          <div className="flex items-center justify-between pt-1 text-sm">
            <span className="text-muted-foreground">Revenue</span>
            <span className="tabular font-semibold">{peso(revenue, { compact: true })}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
