import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/kit";
import { VehicleBadge } from "./VehicleBadge";
import { checklistProgress } from "./lib";
import type { Service, StaffMember, Vehicle, WorkOrder, Bay } from "@/types";

export function WorkOrderCard({
  wo,
  vehicle,
  service,
  staff,
  bay,
  onClick,
  className,
}: {
  wo: WorkOrder;
  vehicle?: Vehicle;
  service?: Service;
  staff?: StaffMember;
  bay?: Bay;
  onClick?: () => void;
  className?: string;
}) {
  const progress = checklistProgress(wo);
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("press surface flex w-full flex-col gap-3 rounded-2xl p-4 text-left transition-colors hover:bg-accent/40", className)}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground">{wo.code}</span>
        <StatusBadge status={wo.status} />
      </div>
      {vehicle && <VehicleBadge vehicle={vehicle} size="sm" />}
      <p className="text-sm text-muted-foreground">{service?.name ?? "Service"}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{staff?.name ?? "Unassigned"}</span>
        <span>{bay ? `Bay ${bay.number}` : "No bay"}</span>
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Checklist</span>
          <span className="tabular">{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-module transition-all" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </motion.button>
  );
}
