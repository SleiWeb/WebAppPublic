import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { getSession } from "@/lib/auth/session";
import { getStudentMastery } from "@/lib/data/student";
import { MASTERY_META } from "@/lib/subjects";
import { EmptyState, MasteryBadge, ProgressBar } from "@/components/ui";

export const dynamic = "force-dynamic";

/** Fremskridt (doc 04 §4.6): mestring pr. emne — opmuntrende, vækst-orienteret. */
export default async function ProgressPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const mastery = (await getStudentMastery(session.userId)).filter(
    (m) => m.attempts > 0
  );
  const counts = [0, 0, 0, 0];
  for (const m of mastery) counts[m.level]++;

  return (
    <AppShell session={session}>
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dit fremskridt</h1>
          <p className="mt-1 text-slate-600">
            Mestring vokser med øvelse — og alt, du mestrer, holder vi ved lige
            med repetition.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MASTERY_META.map((meta) => (
            <div key={meta.level} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-3xl font-extrabold tabular-nums" style={{ color: meta.hex }}>
                {counts[meta.level]}
              </p>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-600">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />
                {meta.name}
              </p>
            </div>
          ))}
        </div>

        {mastery.length === 0 ? (
          <EmptyState
            title="Ikke noget at vise endnu"
            body="Gå i gang med en lektion, så begynder dit mestringskort at tage form."
          />
        ) : (
          <ul className="space-y-3">
            {mastery.map((m) => (
              <li key={m.kcCode} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-semibold">{m.kcName}</p>
                  <span className="ml-auto">
                    <MasteryBadge level={m.level} />
                  </span>
                </div>
                <div className="mt-2 max-w-md">
                  <ProgressBar
                    percent={m.pKnown * 100}
                    color={MASTERY_META[m.level].hex}
                    label={`${m.kcName}: ${Math.round(m.pKnown * 100)} % sikkerhed`}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
