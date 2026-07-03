import { MASTERY_META } from "@/lib/subjects";

export function ProgressBar({
  percent,
  color = "#2563eb",
  label,
}: {
  percent: number;
  color?: string;
  label?: string;
}) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div
      role="progressbar"
      aria-valuenow={p}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `${p} procent`}
      className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
    >
      <div className="h-full rounded-full" style={{ width: `${p}%`, background: color }} />
    </div>
  );
}

export function MasteryBadge({ level }: { level: number }) {
  const meta = MASTERY_META[Math.max(0, Math.min(3, level))];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-700">
      <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />
      {meta.name}
    </span>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="font-semibold text-slate-700">{title}</p>
      <p className="mt-1 text-slate-500">{body}</p>
    </div>
  );
}

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAYS = ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"];

export function formatDue(due: Date | null): string {
  if (!due) return "ingen frist";
  const now = new Date();
  const days = Math.floor((due.getTime() - now.getTime()) / DAY_MS);
  if (days < 0) return "overskredet";
  if (days === 0) return "i dag";
  if (days === 1) return "i morgen";
  if (days < 7) return `frist ${WEEKDAYS[due.getDay()]}`;
  return `frist ${due.toLocaleDateString("da-DK", { day: "numeric", month: "short" })}`;
}
