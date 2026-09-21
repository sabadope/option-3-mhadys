import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/kit";
import { cn } from "@/lib/utils";
import { addMinutes, formatTime, humanize, NOW, TODAY } from "@/lib/format";
import { useApp } from "@/lib/store";
import { addOnsDuration, serviceById } from "./lib";
import type { Appointment, Bay, StaffMember } from "@/types";

const HOUR_START = 8;
const HOUR_END = 18;
const ROW_HEIGHT = 64;
const COL_WIDTH = 176;
const TIME_COL_WIDTH = 56;

function minutesFromStart(hhmm: string) {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  return (h - HOUR_START) * 60 + m;
}

function snapMinutes(m: number) {
  return Math.max(0, Math.min((HOUR_END - HOUR_START) * 60 - 30, Math.round(m / 30) * 30));
}

function timeFromMinutes(m: number) {
  const total = HOUR_START * 60 + m;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

interface Column {
  id: string;
  label: string;
  sub: string;
  maintenance?: boolean;
}

export function ResourceScheduler({ date, appointments }: { date: string; appointments: Appointment[] }) {
  const { state, actions } = useApp();
  const [lane, setLane] = useState<"bay" | "staff">("bay");
  const gridRef = useRef<HTMLDivElement>(null);

  const columns: Column[] = useMemo(() => {
    if (lane === "bay") {
      return state.bays.map((b) => ({ id: b.id, label: `Bay ${b.number}`, sub: humanize(b.type), maintenance: b.status === "maintenance" }));
    }
    return state.staff.map((s) => ({ id: s.id, label: s.name, sub: s.role }));
  }, [lane, state.bays, state.staff]);

  const rows = HOUR_END - HOUR_START;
  const gridHeight = rows * ROW_HEIGHT;
  const gridWidth = columns.length * COL_WIDTH;

  const dayAppointments = appointments.filter((a) => a.date === date && a.status !== "cancelled");

  const reassign = (apt: Appointment, columnId: string, time: string) => {
    const changes = lane === "bay" ? { bayId: columnId, time } : { staffId: columnId, time };
    actions.assignAppointmentSlot(apt.id, changes);
    const col = columns.find((c) => c.id === columnId);
    toast.success(`Moved to ${col?.label ?? "new slot"} · ${formatTime(time)}`);
  };

  const nowTop = date === TODAY ? ((NOW.getHours() - HOUR_START) * 60 + NOW.getMinutes()) * (ROW_HEIGHT / 60) : null;

  return (
    <div className="surface overflow-hidden rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 text-xs">
          <LegendDot tone="bg-surface-2 border border-border-strong" label="Booked / Confirmed" />
          <LegendDot tone="bg-info" label="Arrived" />
          <LegendDot tone="bg-warning" label="In queue" />
          <LegendDot tone="bg-module" label="In progress" />
          <LegendDot tone="bg-success" label="Completed" />
        </div>
        <div className="flex items-center gap-1 rounded-full bg-surface-2 p-1">
          <button
            type="button"
            onClick={() => setLane("bay")}
            className={cn("h-7 rounded-full px-3 text-xs font-medium transition-colors", lane === "bay" ? "bg-foreground text-background" : "text-muted-foreground")}
          >
            Bays
          </button>
          <button
            type="button"
            onClick={() => setLane("staff")}
            className={cn("h-7 rounded-full px-3 text-xs font-medium transition-colors", lane === "staff" ? "bg-foreground text-background" : "text-muted-foreground")}
          >
            Staff
          </button>
        </div>
      </div>

      <div className="scrollbar-none overflow-x-auto">
        <div style={{ width: gridWidth + TIME_COL_WIDTH, minWidth: "100%" }}>
          {/* Header */}
          <div className="sticky top-0 z-10 flex border-b border-border bg-surface">
            <div className="sticky left-0 z-10 shrink-0 bg-surface" style={{ width: TIME_COL_WIDTH }} />
            {columns.map((c) => (
              <div key={c.id} className={cn("shrink-0 border-l border-border px-3 py-2.5", c.maintenance && "bg-warning/8")} style={{ width: COL_WIDTH }}>
                <p className="truncate text-xs font-semibold">{c.label}</p>
                <p className="truncate text-[11px] text-muted-foreground">{c.sub}</p>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="relative flex" ref={gridRef}>
            {/* Time labels */}
            <div className="sticky left-0 z-10 shrink-0 bg-surface" style={{ width: TIME_COL_WIDTH }}>
              {Array.from({ length: rows + 1 }).map((_, i) => (
                <div key={i} className="relative text-right text-[11px] text-muted-foreground" style={{ height: ROW_HEIGHT }}>
                  <span className="absolute -top-2 right-2">{i < rows ? formatTime(`${String(HOUR_START + i).padStart(2, "0")}:00`) : ""}</span>
                </div>
              ))}
            </div>

            {/* Gridlines + columns */}
            <div className="relative" style={{ width: gridWidth, height: gridHeight }}>
              {columns.map((c, ci) => (
                <div
                  key={c.id}
                  className={cn("absolute top-0 border-l border-border", c.maintenance && "bg-warning/6")}
                  style={{ left: ci * COL_WIDTH, width: COL_WIDTH, height: gridHeight }}
                >
                  {Array.from({ length: rows }).map((_, ri) => (
                    <div key={ri} className="border-b border-border/70" style={{ height: ROW_HEIGHT }}>
                      <div className="h-1/2 border-b border-dashed border-border/40" />
                    </div>
                  ))}
                </div>
              ))}

              {nowTop !== null && nowTop >= 0 && nowTop <= gridHeight && (
                <div className="pointer-events-none absolute inset-x-0 z-20 flex items-center" style={{ top: nowTop }}>
                  <span className="-ml-1 size-2 rounded-full bg-destructive" />
                  <div className="h-px flex-1 bg-destructive/70" />
                </div>
              )}

              {dayAppointments.map((apt) => {
                const columnId = lane === "bay" ? apt.bayId : apt.staffId;
                const colIndex = columns.findIndex((c) => c.id === columnId);
                if (colIndex < 0) return null;
                const top = minutesFromStart(apt.time) * (ROW_HEIGHT / 60);
                const height = Math.max(28, apt.durationMinutes * (ROW_HEIGHT / 60));
                if (top + height < 0 || top > gridHeight) return null;
                return (
                  <SchedulerBlock
                    key={`${apt.id}-${apt.bayId}-${apt.staffId}-${apt.time}`}
                    apt={apt}
                    left={colIndex * COL_WIDTH}
                    top={top}
                    height={height}
                    columns={columns}
                    lane={lane}
                    gridWidth={gridWidth}
                    gridHeight={gridHeight}
                    onMove={(colId, time) => reassign(apt, colId, time)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendDot({ tone, label }: { tone: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className={cn("size-2 rounded-full", tone)} />
      {label}
    </span>
  );
}

const statusFill: Record<Appointment["status"], string> = {
  booked: "bg-surface-2 border border-border-strong",
  confirmed: "bg-surface-2 border border-border-strong",
  arrived: "bg-info/20 border border-info/40",
  in_progress: "bg-module/25 border border-module/50",
  completed: "bg-success/20 border border-success/40",
  cancelled: "bg-destructive/15 border border-destructive/30",
};

function SchedulerBlock({
  apt,
  left,
  top,
  height,
  columns,
  lane,
  gridWidth,
  gridHeight,
  onMove,
}: {
  apt: Appointment;
  left: number;
  top: number;
  height: number;
  columns: Column[];
  lane: "bay" | "staff";
  gridWidth: number;
  gridHeight: number;
  onMove: (columnId: string, time: string) => void;
}) {
  const { state } = useApp();
  const vehicle = state.vehicles.find((v) => v.id === apt.vehicleId);
  const service = serviceById(apt.serviceId);
  const staff = state.staff.find((s) => s.id === apt.staffId);
  const [open, setOpen] = useState(false);
  const [pendingColumn, setPendingColumn] = useState(lane === "bay" ? apt.bayId : apt.staffId);
  const [pendingTime, setPendingTime] = useState(apt.time);

  const timeOptions = Array.from({ length: (HOUR_END - HOUR_START) * 2 }).map((_, i) => timeFromMinutes(i * 30));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={{ left: 0, right: gridWidth - COL_WIDTH, top: 0, bottom: gridHeight - height }}
          onDragEnd={(_, info) => {
            const newLeft = left + info.offset.x;
            const newTop = top + info.offset.y;
            const colIndex = Math.max(0, Math.min(columns.length - 1, Math.round(newLeft / COL_WIDTH)));
            const minutes = snapMinutes(newTop / (ROW_HEIGHT / 60));
            const col = columns[colIndex];
            if (col) onMove(col.id, timeFromMinutes(minutes));
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ position: "absolute", left: left + 3, top: top + 2, width: COL_WIDTH - 6, height: height - 4 }}
          className={cn(
            "cursor-grab overflow-hidden rounded-lg p-2 text-left text-[11px] leading-tight shadow-soft active:cursor-grabbing",
            statusFill[apt.status],
          )}
          role="button"
          tabIndex={0}
        >
          <p className="truncate font-semibold">{vehicle ? `${vehicle.make} ${vehicle.model}` : apt.code}</p>
          <p className="truncate text-muted-foreground">{service?.name}</p>
          <div className="mt-1 flex items-center justify-between">
            <span className="rounded-full bg-surface px-1.5 py-0.5 text-[10px] font-semibold">{staff?.initials ?? "—"}</span>
            <StatusBadge status={apt.status} dot={false} className="h-4 px-1.5 text-[9px]" />
          </div>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="glass-strong w-64 rounded-2xl border p-4" align="start">
        <p className="mb-3 text-sm font-semibold">{apt.code}</p>
        <div className="space-y-3">
          <div>
            <p className="eyebrow mb-1.5">{lane === "bay" ? "Bay" : "Staff"}</p>
            <Select value={pendingColumn} onValueChange={setPendingColumn}>
              <SelectTrigger className="h-9 rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent>
                {columns.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="eyebrow mb-1.5">Time</p>
            <Select value={pendingTime} onValueChange={setPendingTime}>
              <SelectTrigger className="h-9 rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent className="max-h-56">
                {timeOptions.map((t) => (
                  <SelectItem key={t} value={t}>{formatTime(t)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            size="sm"
            variant="module"
            className="w-full"
            onClick={() => {
              if (pendingColumn) onMove(pendingColumn, pendingTime);
              setOpen(false);
            }}
          >
            Reassign
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
