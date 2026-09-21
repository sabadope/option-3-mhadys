import { motion } from "motion/react";
import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { humanize } from "@/lib/format";
import { StatusBadge } from "@/components/kit";
import type { Bay } from "@/types";

const edgeColor: Record<Bay["status"], string> = {
  available: "bg-success",
  busy: "bg-module",
  maintenance: "bg-warning",
};

export function BayCard({
  bay,
  headline,
  subline,
  footer,
  large,
  onClick,
  className,
}: {
  bay: Bay;
  /** e.g. "Toyota Vios · Premium Wash" or "Available" */
  headline?: string;
  subline?: string;
  footer?: React.ReactNode;
  large?: boolean;
  onClick?: () => void;
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
        "surface relative flex flex-col gap-3 overflow-hidden rounded-2xl p-4 text-left",
        large && "p-5",
        onClick && "press cursor-pointer hover:bg-accent/40",
        className,
      )}
    >
      <span className={cn("absolute inset-x-0 top-0 h-1", edgeColor[bay.status])} aria-hidden />
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn("eyebrow", large && "text-sm")}>Bay {bay.number}</span>
          {bay.status === "busy" && <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-module opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-module" /></span>}
        </div>
        <StatusBadge status={bay.status} />
      </div>
      <div>
        <p className={cn("font-semibold tracking-tight", large ? "text-lg" : "text-[15px]")}>{headline ?? humanize(bay.type) + " bay"}</p>
        {subline && <p className="mt-0.5 text-xs text-muted-foreground">{subline}</p>}
      </div>
      {bay.status === "maintenance" && !subline && (
        <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Wrench className="size-3.5" /> Under maintenance</p>
      )}
      {footer}
    </Comp>
  );
}
