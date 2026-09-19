import { useMemo, useState, type ReactNode } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { EmptyState } from "./States";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  align?: "left" | "right";
  /** Hide on smaller desktop widths. */
  hideBelow?: "lg" | "xl";
}

export interface FilterDef {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface Props<T> {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  /** Mobile card renderer. Falls back to a stacked list of columns. */
  renderCard?: (row: T) => ReactNode;
  searchable?: (row: T) => string;
  searchPlaceholder?: string;
  filters?: FilterDef[];
  filterFn?: (row: T, active: Record<string, string>) => boolean;
  onRowClick?: (row: T) => void;
  empty?: { title: string; description?: string; action?: ReactNode; icon?: ReactNode };
  toolbarExtra?: ReactNode;
  className?: string;
  dense?: boolean;
}

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  renderCard,
  searchable,
  searchPlaceholder = "Search…",
  filters = [],
  filterFn,
  onRowClick,
  empty,
  toolbarExtra,
  className,
  dense,
}: Props<T>) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    let out = rows;
    if (q && searchable) {
      const needle = q.toLowerCase();
      out = out.filter((r) => searchable(r).toLowerCase().includes(needle));
    }
    if (filterFn && Object.values(active).some(Boolean)) out = out.filter((r) => filterFn(r, active));
    return out;
  }, [rows, q, active, searchable, filterFn]);

  const activeCount = Object.values(active).filter(Boolean).length;

  const FilterControls = (
    <div className="flex flex-col gap-4">
      {filters.map((f) => (
        <div key={f.key}>
          <p className="eyebrow mb-2">{f.label}</p>
          <div className="flex flex-wrap gap-1.5">
            <Chip selected={!active[f.key]} onClick={() => setActive((a) => ({ ...a, [f.key]: "" }))}>
              All
            </Chip>
            {f.options.map((o) => (
              <Chip key={o.value} selected={active[f.key] === o.value} onClick={() => setActive((a) => ({ ...a, [f.key]: o.value }))}>
                {o.label}
              </Chip>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={cn("space-y-3", className)}>
      {(searchable || filters.length > 0 || toolbarExtra) && (
        <div className="flex flex-wrap items-center gap-2">
          {searchable && (
            <div className="relative min-w-0 flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="h-10 rounded-full border-border-strong bg-surface-2 pl-9"
              />
            </div>
          )}
          {filters.length > 0 && (
            <>
              {/* Desktop: inline chips */}
              <div className="hidden flex-wrap items-center gap-1.5 lg:flex">
                {filters.map((f) => (
                  <div key={f.key} className="flex items-center gap-1.5 rounded-full bg-surface-2 p-1">
                    <Chip selected={!active[f.key]} onClick={() => setActive((a) => ({ ...a, [f.key]: "" }))}>
                      All
                    </Chip>
                    {f.options.map((o) => (
                      <Chip key={o.value} selected={active[f.key] === o.value} onClick={() => setActive((a) => ({ ...a, [f.key]: o.value }))}>
                        {o.label}
                      </Chip>
                    ))}
                  </div>
                ))}
              </div>
              {/* Mobile: sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary" size="sm" className="lg:hidden">
                    <SlidersHorizontal /> Filters{activeCount > 0 && <span className="ml-1 rounded-full bg-module px-1.5 text-[10px] text-module-foreground">{activeCount}</span>}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="glass-strong rounded-t-3xl border-t pb-10">
                  <SheetHeader className="text-left">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">{FilterControls}</div>
                </SheetContent>
              </Sheet>
            </>
          )}
          {toolbarExtra && <div className="ml-auto flex items-center gap-2">{toolbarExtra}</div>}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={q || activeCount ? "No results" : (empty?.title ?? "Nothing here yet")}
          description={q || activeCount ? "Try a different search or clear the filters." : empty?.description}
          action={!q && !activeCount ? empty?.action : undefined}
          icon={empty?.icon}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="surface hidden overflow-hidden rounded-2xl md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    {columns.map((c) => (
                      <th
                        key={c.key}
                        className={cn(
                          "eyebrow px-5 py-3 font-semibold",
                          c.align === "right" && "text-right",
                          c.hideBelow === "lg" && "hidden lg:table-cell",
                          c.hideBelow === "xl" && "hidden xl:table-cell",
                          c.className,
                        )}
                      >
                        {c.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {filtered.map((row) => (
                      <motion.tr
                        key={rowKey(row)}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                        tabIndex={onRowClick ? 0 : undefined}
                        onKeyDown={onRowClick ? (e) => e.key === "Enter" && onRowClick(row) : undefined}
                        className={cn(
                          "border-b border-border last:border-0 transition-colors",
                          onRowClick && "cursor-pointer hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:outline-none",
                        )}
                      >
                        {columns.map((c) => (
                          <td
                            key={c.key}
                            className={cn(
                              "px-5 align-middle",
                              dense ? "py-2.5" : "py-3.5",
                              c.align === "right" && "text-right",
                              c.hideBelow === "lg" && "hidden lg:table-cell",
                              c.hideBelow === "xl" && "hidden xl:table-cell",
                              c.className,
                            )}
                          >
                            {c.cell(row)}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 md:hidden">
            {filtered.map((row) => (
              <motion.div
                key={rowKey(row)}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                role={onRowClick ? "button" : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={onRowClick ? (e) => e.key === "Enter" && onRowClick(row) : undefined}
                className={cn("surface rounded-2xl p-4", onRowClick && "press cursor-pointer")}
              >
                {renderCard ? (
                  renderCard(row)
                ) : (
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {columns.map((c) => (
                      <div key={c.key} className="min-w-0">
                        <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.header}</dt>
                        <dd className="truncate">{c.cell(row)}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function Chip({ selected, onClick, children }: { selected?: boolean; onClick?: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "h-8 rounded-full px-3 text-xs font-medium transition-colors",
        selected ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
