import { motion } from "motion/react";
import { Check, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { peso, minutesToLabel, humanize } from "@/lib/format";
import { Switch } from "@/components/ui/switch";
import type { Service } from "@/types";

export function ServiceCard({
  service,
  onClick,
  selected,
  action,
  onToggleStatus,
  className,
}: {
  service: Service;
  onClick?: () => void;
  selected?: boolean;
  action?: React.ReactNode;
  onToggleStatus?: (active: boolean) => void;
  className?: string;
}) {
  const Comp = onClick ? motion.button : motion.div;
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "press surface relative flex w-full flex-col gap-3 rounded-2xl p-4 text-left transition-colors",
        onClick && "cursor-pointer hover:bg-accent/40",
        selected && "ring-2 ring-module",
        service.status === "inactive" && "opacity-60",
        className,
      )}
    >
      {selected && (
        <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-module text-module-foreground">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      )}
      <div className="flex items-start justify-between gap-2 pr-6">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold tracking-tight">{service.name}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{service.description}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-module-soft px-2 py-1 font-medium text-module">
          <Sparkles className="size-3" /> {humanize(service.bayType)} bay
        </span>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Clock className="size-3" /> {minutesToLabel(service.durationMinutes)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <p className="tabular text-lg font-semibold tracking-tight">{peso(service.price)}</p>
        {onToggleStatus ? (
          <label className="flex items-center gap-2 text-xs text-muted-foreground" onClick={(e) => e.stopPropagation()}>
            {service.status === "active" ? "Active" : "Inactive"}
            <Switch checked={service.status === "active"} onCheckedChange={(v) => onToggleStatus(v)} />
          </label>
        ) : (
          action
        )}
      </div>
    </Comp>
  );
}
