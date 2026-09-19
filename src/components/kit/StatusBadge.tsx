import { cn } from "@/lib/utils";
import { humanize } from "@/lib/format";
import { toneFor, type Tone } from "@/lib/status";

const tones: Record<Tone, string> = {
  neutral: "bg-secondary text-muted-foreground",
  info: "bg-info/12 text-info",
  success: "bg-success/12 text-success",
  warning: "bg-warning/14 text-warning",
  danger: "bg-destructive/14 text-destructive",
  module: "bg-module-soft text-module",
};

export function StatusBadge({
  status,
  label,
  tone,
  dot = true,
  className,
}: {
  status: string;
  label?: string;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}) {
  const t = tone ?? toneFor(status);
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[11px] font-semibold tracking-wide",
        tones[t],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {label ?? humanize(status)}
    </span>
  );
}
