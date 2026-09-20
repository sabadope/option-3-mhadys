import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Brand } from "./Brand";
import { ModuleSwitcher } from "./ModuleSwitcher";
import { globalNav, moduleFromPath, settingsNav, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      activeOptions={{ exact: item.exact ?? false }}
      className="group relative flex h-9 items-center gap-3 rounded-lg px-3 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span layoutId="nav-active" className="absolute inset-0 rounded-lg bg-sidebar-accent" transition={{ type: "spring", stiffness: 480, damping: 38 }} />
          )}
          <item.icon className={cn("relative size-4 transition-colors", isActive ? "text-module" : "text-muted-foreground group-hover:text-foreground")} />
          <span className="relative">{item.label}</span>
        </>
      )}
    </Link>
  );
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const mod = moduleFromPath(pathname);

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-5 pb-2">
        <Link to="/app" onClick={onNavigate} aria-label="Nimbus overview">
          <Brand />
        </Link>
      </div>

      <div className="scrollbar-none flex-1 overflow-y-auto px-3 pb-4">
        <p className="eyebrow px-3 pt-5 pb-2">Workspace</p>
        <ModuleSwitcher onNavigate={onNavigate} />

        <AnimatePresence mode="wait" initial={false}>
          {mod && (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              className="mt-5 rounded-2xl border border-border bg-surface/60 p-2"
            >
              <p className="eyebrow px-3 pt-2 pb-2 text-module">{mod.name}</p>
              <nav className="space-y-0.5" aria-label={`${mod.name} navigation`}>
                {mod.nav.map((n) => (
                  <NavLink key={n.to} item={n} onNavigate={onNavigate} />
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="eyebrow px-3 pt-6 pb-2">Platform</p>
        <nav className="space-y-0.5" aria-label="Platform navigation">
          {globalNav.map((n) => (
            <NavLink key={n.to} item={n} onNavigate={onNavigate} />
          ))}
        </nav>
      </div>

      <div className="border-t border-sidebar-border p-3">
        <NavLink item={settingsNav} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 border-r border-sidebar-border bg-sidebar lg:block" aria-label="Sidebar">
      <SidebarContent />
    </aside>
  );
}
