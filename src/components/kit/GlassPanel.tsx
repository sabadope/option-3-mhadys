import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  /** "glass" floats; "surface" is solid primary content; "minimal" has no chrome. */
  material?: "glass" | "glass-strong" | "surface" | "surface-2" | "minimal";
  padded?: boolean;
}

export function GlassPanel({ material = "surface", padded = true, className, ...rest }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        material === "glass" && "glass glass-highlight",
        material === "glass-strong" && "glass-strong glass-highlight",
        material === "surface" && "surface",
        material === "surface-2" && "surface-2",
        padded && "p-5 sm:p-6",
        className,
      )}
      {...rest}
    />
  );
}

export function SectionCard({
  title,
  eyebrow,
  action,
  children,
  className,
  material = "surface",
  bodyClassName,
}: {
  title?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  material?: Props["material"];
}) {
  return (
    <GlassPanel material={material} padded={false} className={cn("flex flex-col overflow-hidden", className)}>
      {(title || eyebrow || action) && (
        <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6">
          <div className="min-w-0">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h3 className="mt-0.5 truncate text-[15px] font-semibold tracking-tight">{title}</h3>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn("p-5 sm:p-6", bodyClassName)}>{children}</div>
    </GlassPanel>
  );
}
