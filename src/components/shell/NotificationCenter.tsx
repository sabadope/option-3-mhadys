import { Link } from "@tanstack/react-router";
import { Car, CheckCheck, Layers, ShoppingBag, Ticket } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";

const icons = { event: Ticket, commerce: ShoppingBag, autocare: Car, system: Layers } as const;

export function NotificationItem({ n, onRead }: { n: Notification; onRead: () => void }) {
  const Icon = icons[n.module];
  const inner = (
    <div className={cn("flex gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-accent/60", !n.read && "bg-accent/30")} data-module={n.module === "system" ? undefined : n.module}>
      <span className={cn("mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg", n.module === "system" ? "bg-surface-2 text-muted-foreground" : "bg-module-soft text-module")}>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm leading-snug", !n.read ? "font-semibold" : "font-medium")}>{n.title}</p>
          {!n.read && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-module" aria-label="Unread" />}
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
        <p className="mt-1 text-[11px] text-muted-foreground/70">{timeAgo(n.createdAt)}</p>
      </div>
    </div>
  );
  return n.href ? (
    <Link to={n.href} onClick={onRead} className="block">
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onRead} className="block w-full text-left">
      {inner}
    </button>
  );
}

export function NotificationCenter({ full }: { full?: boolean }) {
  const { state, actions } = useApp();
  const [tab, setTab] = useState<"all" | "unread">("all");
  const list = state.notifications.filter((n) => (tab === "unread" ? !n.read : true));
  const unread = state.notifications.filter((n) => !n.read).length;

  return (
    <div className={cn("flex flex-col", full ? "" : "max-h-[70vh]")}>
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-2">
        <div className="flex items-center gap-1 rounded-full bg-surface-2 p-0.5">
          {(["all", "unread"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn("h-7 rounded-full px-3 text-xs font-medium capitalize transition-colors", tab === t ? "bg-foreground text-background" : "text-muted-foreground")}
            >
              {t}
              {t === "unread" && unread > 0 && <span className="ml-1 opacity-70">{unread}</span>}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={actions.markAllRead} disabled={unread === 0}>
          <CheckCheck /> Mark all read
        </Button>
      </div>
      <div className="scrollbar-none flex-1 overflow-y-auto p-2">
        <AnimatePresence initial={false}>
          {list.length === 0 ? (
            <p className="px-3 py-10 text-center text-sm text-muted-foreground">You're all caught up.</p>
          ) : (
            list.map((n) => (
              <motion.div key={n.id} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <NotificationItem n={n} onRead={() => actions.markRead(n.id)} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      {!full && (
        <div className="border-t border-border p-2">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link to="/app/notifications">View all notifications</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
