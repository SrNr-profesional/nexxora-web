import { Priority } from "@/lib/crm/types";
import { PRIORITY_ICON, PRIORITY_LABELS } from "@/lib/crm/constants";
import { cn } from "@/lib/utils";

export default function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-semibold text-slate-300", className)}>
      <span aria-hidden="true">{PRIORITY_ICON[priority]}</span>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
