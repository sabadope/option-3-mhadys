import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/format";
import type { Event } from "@/types";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export function monthMatrix(cursor: Date) {
  const start = startOfWeek(startOfMonth(cursor));
  const end = endOfWeek(endOfMonth(cursor));
  return eachDayOfInterval({ start, end });
}

export function weekDays(cursor: Date) {
  const start = startOfWeek(cursor);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function eventsOn(events: Event[], day: Date) {
  return events.filter((e) => isSameDay(new Date(`${e.date}T00:00:00`), day));
}

export function MonthView({
  cursor,
  today,
  events,
  onSelectEvent,
  onSelectDay,
}: {
  cursor: Date;
  today: Date;
  events: Event[];
  onSelectEvent: (e: Event) => void;
  onSelectDay?: (d: Date) => void;
}) {
  const days = monthMatrix(cursor);
  return (
    <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-border bg-border">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
        <div key={d} className="bg-surface-2 px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {d}
        </div>
      ))}
      {days.map((day) => {
        const dayEvents = eventsOn(events, day);
        const inMonth = isSameMonth(day, cursor);
        const isToday = isSameDay(day, today);
        return (
          <div
            key={day.toISOString()}
            onClick={() => onSelectDay?.(day)}
            className={cn(
              "flex min-h-[92px] cursor-pointer flex-col items-start gap-1 bg-surface p-2 text-left transition-colors hover:bg-accent/50",
              !inMonth && "opacity-40",
            )}
          >
            <button
              type="button"
              aria-label={format(day, "MMMM d")}
              onClick={(ev) => {
                ev.stopPropagation();
                onSelectDay?.(day);
              }}
              className={cn(
                "grid size-6 place-items-center rounded-full text-xs font-medium",
                isToday && "bg-module text-module-foreground",
              )}
            >
              {format(day, "d")}
            </button>
            <div className="flex w-full flex-col gap-1">
              {dayEvents.slice(0, 2).map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    onSelectEvent(e);
                  }}
                  className="truncate rounded-md bg-module-soft px-1.5 py-0.5 text-left text-[10px] font-medium text-module hover:brightness-110"
                >
                  {e.name}
                </button>
              ))}
              {dayEvents.length > 2 && <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 2} more</span>}
              {dayEvents.length > 0 && <span className="sm:hidden inline-flex size-1.5 rounded-full bg-module" aria-hidden />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function WeekView({
  cursor,
  events,
  today,
  onSelectEvent,
}: {
  cursor: Date;
  events: Event[];
  today: Date;
  onSelectEvent: (e: Event) => void;
}) {
  const days = weekDays(cursor);
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
      {days.map((day) => {
        const dayEvents = eventsOn(events, day);
        const isToday = isSameDay(day, today);
        return (
          <div key={day.toISOString()} className={cn("surface min-h-[160px] rounded-2xl p-3", isToday && "ring-1 ring-module")}>
            <p className="text-xs font-semibold text-muted-foreground">{format(day, "EEE")}</p>
            <p className={cn("mt-0.5 text-lg font-semibold", isToday && "text-module")}>{format(day, "d")}</p>
            <div className="mt-2 space-y-1.5">
              {dayEvents.map((e) => (
                <motion.button
                  key={e.id}
                  type="button"
                  whileHover={{ y: -1 }}
                  onClick={() => onSelectEvent(e)}
                  className="w-full rounded-lg bg-module-soft px-2 py-1.5 text-left text-[11px] font-medium text-module"
                >
                  <p className="truncate">{e.name}</p>
                  <p className="text-[10px] opacity-80">{formatTime(e.startTime)}</p>
                </motion.button>
              ))}
              {dayEvents.length === 0 && <p className="text-[11px] text-muted-foreground">—</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7am - 9pm

export function DayView({ cursor, events, onSelectEvent }: { cursor: Date; events: Event[]; onSelectEvent: (e: Event) => void }) {
  const dayEvents = eventsOn(events, cursor);
  return (
    <div className="surface rounded-2xl">
      {HOURS.map((h) => {
        const label = format(new Date(2000, 0, 1, h), "h a");
        const hourEvents = dayEvents.filter((e) => Number(e.startTime.split(":")[0]) === h);
        return (
          <div key={h} className="flex gap-4 border-b border-border px-4 py-3 last:border-0">
            <span className="w-14 shrink-0 text-xs text-muted-foreground">{label}</span>
            <div className="min-w-0 flex-1 space-y-1.5">
              {hourEvents.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => onSelectEvent(e)}
                  className="block w-full truncate rounded-lg bg-module-soft px-3 py-2 text-left text-sm font-medium text-module"
                >
                  {e.name} <span className="text-xs opacity-75">· {formatTime(e.startTime)}–{formatTime(e.endTime)}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
      {dayEvents.length === 0 && <p className="px-4 py-10 text-center text-sm text-muted-foreground">No events scheduled this day.</p>}
    </div>
  );
}
