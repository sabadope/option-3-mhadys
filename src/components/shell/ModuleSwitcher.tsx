import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import { modules, moduleFromPath } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Workspace-style module switcher. Selecting a module feels like changing
 * workspaces: the accent, sidebar section, and atmosphere all shift together.
 */
export function ModuleSwitcher({ className, onNavigate, layout = "list" }: { className?: string; onNavigate?: () => void; layout?: "list" | "grid" }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = moduleFromPath(pathname);

  return (
    <div className={cn(layout === "grid" ? "grid gap-3 sm:grid-cols-3" : "space-y-1", className)} role="radiogroup" aria-label="Workspace">
      {modules.map((m) => {
        const active = current?.id === m.id;
        return (
          <Link
            key={m.id}
            to={m.base}
            onClick={onNavigate}
            role="radio"
            aria-checked={active}
            data-module={m.id}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
              layout === "grid" && "surface flex-col items-start gap-4 p-5",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && layout === "list" && (
              <motion.span
                layoutId="module-active"
                className="absolute inset-0 rounded-xl bg-module-soft ring-1 ring-module/30"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span
              className={cn(
                "relative grid size-9 shrink-0 place-items-center rounded-[10px] transition-colors",
                active ? "bg-module text-module-foreground" : "bg-surface-2 text-muted-foreground group-hover:text-foreground",
              )}
            >
              <m.icon className="size-4" />
            </span>
            <span className="relative min-w-0">
              <span className="block text-sm font-semibold leading-tight">{m.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{m.tagline}</span>
            </span>
            <span
              aria-hidden
              className={cn(
                "relative ml-auto size-2 rounded-full transition-colors",
                layout === "grid" && "absolute right-5 top-5",
                active ? "bg-module" : "bg-border-strong",
              )}
            />
          </Link>
        );
      })}
    </div>
  );
}
