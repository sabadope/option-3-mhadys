import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const axisStyle = { fontSize: 11, fill: "var(--muted-foreground)" } as const;

function GlassTooltip({ active, payload, label, format }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string; format?: (v: number) => string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-3 py-2 text-xs">
      <p className="text-muted-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="tabular mt-0.5 font-semibold">
          {format ? format(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

export function TrendAreaChart({
  data,
  dataKey,
  xKey = "day",
  height = 220,
  format,
  className,
  id = "trend",
}: {
  data: Record<string, string | number>[];
  dataKey: string;
  xKey?: string;
  height?: number;
  format?: (v: number) => string;
  className?: string;
  id?: string;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className={cn("w-full min-w-0", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--module)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--module)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey={xKey} tick={axisStyle} axisLine={false} tickLine={false} minTickGap={24} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => (format ? format(Number(v)) : String(v))} width={64} />
          <Tooltip content={<GlassTooltip format={format} />} cursor={{ stroke: "var(--border-strong)" }} />
          <Area type="monotone" dataKey={dataKey} stroke="var(--module)" strokeWidth={2} fill={`url(#fill-${id})`} isAnimationActive animationDuration={900} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function SimpleBarChart({
  data,
  dataKey,
  xKey = "day",
  height = 200,
  format,
  className,
}: {
  data: Record<string, string | number>[];
  dataKey: string;
  xKey?: string;
  height?: number;
  format?: (v: number) => string;
  className?: string;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className={cn("w-full min-w-0", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -16, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey={xKey} tick={axisStyle} axisLine={false} tickLine={false} minTickGap={24} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => (format ? format(Number(v)) : String(v))} width={64} />
          <Tooltip content={<GlassTooltip format={format} />} cursor={{ fill: "var(--accent)" }} />
          <Bar dataKey={dataKey} fill="var(--module)" radius={[6, 6, 2, 2]} isAnimationActive animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

/** Tiny inline sparkline with no axes. */
export function Sparkline({ data, dataKey, width = 96, height = 32 }: { data: Record<string, string | number>[]; dataKey: string; width?: number; height?: number }) {
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <Area type="monotone" dataKey={dataKey} stroke="var(--module)" strokeWidth={1.5} fill="var(--module)" fillOpacity={0.12} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Horizontal bar list — good for "top products" style rankings. */
export function RankedBars({ items, format }: { items: { label: string; value: number; sub?: string }[]; format?: (v: number) => string }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={it.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate font-medium">{it.label}</span>
            <span className="tabular shrink-0 text-muted-foreground">{format ? format(it.value) : it.value}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(it.value / max) * 100}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 24, delay: i * 0.05 }}
              className="h-full rounded-full bg-module"
            />
          </div>
          {it.sub && <p className="mt-1 text-xs text-muted-foreground">{it.sub}</p>}
        </li>
      ))}
    </ul>
  );
}
