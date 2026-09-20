import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNav } from "./MobileNav";
import { SearchCommand } from "./SearchCommand";
import { moduleFromPath } from "@/lib/navigation";
import { getSession } from "@/lib/session";

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const mod = moduleFromPath(pathname);
  const [searchOpen, setSearchOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  // Demo/session gate: no backend auth — a local session is enough to enter.
  useEffect(() => {
    if (!getSession()) {
      navigate({ to: "/login", replace: true });
      return;
    }
    setReady(true);
  }, [navigate]);

  if (!ready) return <div className="min-h-screen bg-background" aria-busy />;

  return (
    <div data-module={mod?.id} className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onOpenSearch={() => setSearchOpen(true)} />
        <main className="flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mod?.id ?? "global"}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="mx-auto w-full max-w-[1400px]"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <MobileNav />
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
