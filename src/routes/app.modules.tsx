import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Users } from "lucide-react";
import { PageHeader } from "@/components/kit";
import { ModuleSwitcher } from "@/components/shell/ModuleSwitcher";

export const Route = createFileRoute("/app/modules")({
  head: () => ({
    meta: [
      { title: "Modules — Nimbus" },
      { name: "description", content: "Switch between the Event, Commerce, and Auto Care workspaces." },
      { property: "og:title", content: "Modules — Nimbus" },
      { property: "og:description", content: "Choose a workspace." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader eyebrow="Workspace" title="Modules" description="One account, three operations. Pick where you want to work." />
      <ModuleSwitcher layout="grid" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/app/customers" className="surface press flex items-center gap-3 rounded-2xl p-4">
          <span className="grid size-9 place-items-center rounded-xl bg-surface-2">
            <Users className="size-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold">Customers</span>
            <span className="block text-xs text-muted-foreground">Shared across modules</span>
          </span>
        </Link>
        <Link to="/app/reports" className="surface press flex items-center gap-3 rounded-2xl p-4">
          <span className="grid size-9 place-items-center rounded-xl bg-surface-2">
            <BarChart3 className="size-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold">Reports</span>
            <span className="block text-xs text-muted-foreground">Performance by module</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
