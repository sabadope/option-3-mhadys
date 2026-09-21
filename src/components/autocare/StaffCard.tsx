import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { InitialsAvatar, StatusBadge } from "@/components/kit";
import { humanize } from "@/lib/format";
import type { StaffMember } from "@/types";

export function StaffCard({
  member,
  jobsToday,
  currentVehicle,
  onClick,
  className,
}: {
  member: StaffMember;
  jobsToday: number;
  currentVehicle?: string;
  onClick?: () => void;
  className?: string;
}) {
  const workload = Math.min(1, jobsToday / 5);
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("press surface flex w-full flex-col gap-3 rounded-2xl p-4 text-left transition-colors hover:bg-accent/40", className)}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <InitialsAvatar name={member.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{member.name}</p>
            <p className="truncate text-xs text-muted-foreground">{member.role}</p>
          </div>
        </div>
        <StatusBadge status={member.status} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {member.skills.map((s) => (
          <span key={s} className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {humanize(s)}
          </span>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Shift: {member.shift}</p>
      {currentVehicle && <p className="text-xs text-muted-foreground">Currently on: <span className="text-foreground">{currentVehicle}</span></p>}
      <div>
        <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Today's jobs</span>
          <span className="tabular">{jobsToday}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-module transition-all" style={{ width: `${workload * 100}%` }} />
        </div>
      </div>
    </motion.button>
  );
}
