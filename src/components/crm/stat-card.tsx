import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  detail,
  className
}: {
  title: string;
  value: string | number;
  detail?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-white/[0.06] bg-[#111113] p-5", className)}>
      <p className="text-xs font-medium uppercase tracking-wide text-white/40">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
      {detail ? <p className="mt-1 text-sm text-white/45">{detail}</p> : null}
    </div>
  );
}
