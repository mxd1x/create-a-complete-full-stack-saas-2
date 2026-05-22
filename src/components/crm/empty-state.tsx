import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
        <Icon className="h-5 w-5 text-white/40" />
      </div>
      <h3 className="mt-4 text-sm font-medium text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-white/45">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
