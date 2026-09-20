import { Link } from "@tanstack/react-router";
import { Activity, Bell, Home, LayoutGrid, User } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const items = [
  { label: "Home", to: "/app", icon: Home, exact: true },
  { label: "Modules", to: "/app/modules", icon: LayoutGrid },
  { label: "Activity", to: "/app/activity", icon: Activity },
  { label: "Alerts", to: "/app/notifications", icon: Bell },
  { label: "Profile", to: "/app/settings", icon: User },
];

export function MobileNav() {
  const { state } = useApp();
  const unread = state.notifications.filter((n) => !n.read).length;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] lg:hidden" aria-label="Primary">
      <div className="glass-strong glass-highlight grid h-16 grid-cols-5 items-stretch rounded-2xl px-1">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            activeOptions={{ exact: it.exact ?? false }}
            className="group relative flex flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium text-muted-foreground data-[status=active]:text-foreground"
          >
            {({ isActive }) => (
              <>
                {isActive && <motion.span layoutId="mobile-nav-active" className="absolute inset-x-2 inset-y-1.5 rounded-xl bg-module-soft" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                <span className="relative">
                  <it.icon className={cn("size-5", isActive && "text-module")} />
                  {it.to === "/app/notifications" && unread > 0 && <span className="absolute -right-1 -top-1 size-2 rounded-full bg-module" />}
                </span>
                <span className="relative">{it.label}</span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
