import { Timeline, type TimelineStep } from "@/components/kit";
import { formatDateTime } from "@/lib/format";
import { WO_STEPS } from "./lib";
import type { WorkOrder } from "@/types";

/** Maps a work order's 7-stage flow to the shared Timeline component. */
export function ServiceTimeline({ wo }: { wo: WorkOrder }) {
  const currentIndex = WO_STEPS.findIndex((s) => s.key === wo.status);
  const steps: TimelineStep[] = WO_STEPS.map((s) => {
    const entry = wo.timeline.find((t) => t.status === s.key);
    return { key: s.key, label: s.label, at: entry ? formatDateTime(entry.at) : undefined };
  });
  return <Timeline steps={steps} currentIndex={currentIndex === WO_STEPS.length - 1 ? WO_STEPS.length : currentIndex + 1} />;
}
