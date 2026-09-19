import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

export function InitialsAvatar({ name, className, size = "md" }: { name: string; className?: string; size?: "sm" | "md" | "lg" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-surface-2 font-semibold text-foreground ring-1 ring-border",
        size === "sm" && "size-7 text-[10px]",
        size === "md" && "size-9 text-xs",
        size === "lg" && "size-14 text-base",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

export function PersonCell({ name, sub, size = "md" }: { name: string; sub?: string; size?: "sm" | "md" }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <InitialsAvatar name={name} size={size} />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{name}</p>
        {sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}
