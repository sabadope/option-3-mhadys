import { cn } from "@/lib/utils";

/** Original Nimbus mark: three stacked layers hinting at the three modules. */
export function BrandMark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden className={cn("shrink-0", className)}>
      <rect x="4" y="18" width="24" height="8" rx="4" fill="currentColor" opacity="0.35" />
      <rect x="6" y="12" width="20" height="8" rx="4" fill="currentColor" opacity="0.6" />
      <rect x="8" y="6" width="16" height="8" rx="4" fill="currentColor" />
    </svg>
  );
}

export function Brand({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="grid size-8 place-items-center rounded-[10px] bg-foreground text-background">
        <BrandMark size={20} />
      </span>
      {!compact && (
        <div className="leading-none">
          <p className="text-[15px] font-semibold tracking-tight">Nimbus</p>
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Business OS</p>
        </div>
      )}
    </div>
  );
}
