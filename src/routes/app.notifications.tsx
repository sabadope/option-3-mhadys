import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, GlassPanel } from "@/components/kit";
import { NotificationCenter } from "@/components/shell/NotificationCenter";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Nimbus" },
      { name: "description", content: "Booking confirmations, shipping updates, and appointment reminders across your modules." },
      { property: "og:title", content: "Notifications — Nimbus" },
      { property: "og:description", content: "All your business notifications in one place." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader eyebrow="Inbox" title="Notifications" description="Updates from Events, Commerce, and Auto Care." />
      <GlassPanel material="surface" padded={false} className="overflow-hidden">
        <NotificationCenter full />
      </GlassPanel>
    </div>
  );
}
