import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronDown, HelpCircle, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarContent } from "./Sidebar";
import { NotificationCenter } from "./NotificationCenter";
import { moduleFromPath } from "@/lib/navigation";
import { currentUser, business } from "@/data/customers";
import { useApp } from "@/lib/store";
import { endSession } from "@/lib/session";
import { InitialsAvatar } from "@/components/kit/Avatar";
import { cn } from "@/lib/utils";

export function TopBar({ onOpenSearch }: { onOpenSearch: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const mod = moduleFromPath(pathname);
  const { state } = useApp();
  const unread = state.notifications.filter((n) => !n.read).length;
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 lg:px-8">
      <div className="glass glass-highlight grid h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-2xl px-2 pr-2 sm:px-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation" onClick={() => setMenuOpen(true)}>
              <Menu />
            </Button>
            <SheetContent side="left" className="w-[290px] border-r border-sidebar-border bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarContent onNavigate={() => setMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="flex min-w-0 items-center gap-2 px-1">
            <span className="hidden truncate text-sm text-muted-foreground sm:block">{business.name}</span>
            <span className="hidden text-muted-foreground/50 sm:block">/</span>
            <span className={cn("flex items-center gap-2 truncate text-sm font-semibold", mod && "text-module")}>
              {mod && <span className="size-1.5 rounded-full bg-module" />}
              {mod ? mod.name : "Overview"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden h-9 items-center gap-2 rounded-full border border-border-strong bg-background/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:flex"
            aria-label="Search (Command K)"
          >
            <Search className="size-4" />
            <span>Search</span>
            <kbd className="ml-4 rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">⌘K</kbd>
          </button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenSearch} aria-label="Search">
            <Search />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}>
                <Bell />
                {unread > 0 && <span className="absolute right-2 top-2 size-2 rounded-full bg-module ring-2 ring-background" />}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" sideOffset={10} className="glass-strong w-[min(92vw,400px)] rounded-2xl border p-0">
              <NotificationCenter />
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Help" asChild>
            <Link to="/pricing">
              <HelpCircle />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="ml-1 flex h-9 items-center gap-2 rounded-full pl-1 pr-2 transition-colors hover:bg-accent" aria-label="Account menu">
                <InitialsAvatar name={currentUser.name} size="sm" className="bg-module text-module-foreground ring-0" />
                <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={10} className="glass-strong w-56 rounded-2xl border p-1.5">
              <DropdownMenuLabel className="px-2.5 py-2">
                <p className="text-sm font-semibold">{currentUser.name}</p>
                <p className="text-xs font-normal text-muted-foreground">{currentUser.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="rounded-lg">
                <Link to="/app/settings">
                  <User className="mr-2 size-4" /> Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg">
                <Link to="/app/settings">
                  <Settings className="mr-2 size-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="rounded-lg text-destructive focus:text-destructive"
                onClick={() => {
                  endSession();
                  navigate({ to: "/login" });
                }}
              >
                <LogOut className="mr-2 size-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
