import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { getSession } from "@/lib/auth/session";
import {
  getActiveAssignments,
  getClassMastery,
  getClassStudents,
  getNeedsAttention,
  getTeacherClass,
} from "@/lib/data/teacher";
import { MASTERY_META } from "@/lib/subjects";
import { EmptyState, formatDue } from "@/components/ui";

export const dynamic = "force-dynamic";

/**
 * Lærer-dashboard (doc 04 §4.4): åbner på "hvad kræver min opmærksomhed" —
 * hvem sidder fast, hvem har ikke åbnet, og holdets typiske fejlmønstre,
 * aggregeret live fra attempts.
 */
export default async function TeacherDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "teacher") redirect("/elev");

  const klass = await getTeacherClass(session.userId);
  if (!klass)
    return (
      <AppShell session={session}>
        <EmptyState title="Intet hold endnu" body="Opret et hold, eller vent på roster-synk fra STIL." />
      </AppShell>
    );

  const [attention, assignments, mastery, students] = await Promise.all([
    getNeedsAttention(klass.id),
    getActiveAssignments(klass.id),
    getClassMastery(klass.id),
    getClassStudents(klass.id),
  ]);

  const week = getWeekNumber(new Date());

  return (
    <AppShell session={session}>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-3xl font-bold">{klass.name}</h1>
          <span className="text-slate-500">Uge {week}</span>
          <Link
            href="/laerer/tildel"
            className="ml-auto rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            + Ny tildeling
          </Link>
        </div>

        {/* Kræver opmærksomhed */}
        <section aria-labelledby="attention-h" className="rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-5">
          <h2 id="attention-h" className="text-lg font-bold text-amber-950">
            ⚠️ Kræver opmærksomhed
          </h2>
          <ul className="mt-3 space-y-2 text-amber-950">
            {attention.stuck.length > 0 && (
              <li>
                • <strong>{attention.stuck.length} elever</strong> sidder fast
                {attention.stuckTopic && (
                  <> i <strong>”{attention.stuckTopic}”</strong></>
                )}
                : {attention.stuck.slice(0, 5).join(", ")}
                {attention.stuck.length > 5 && ` +${attention.stuck.length - 5}`}
              </li>
            )}
            {attention.notOpened.map((n) => (
              <li key={n.name}>
                • <strong>{n.name}</strong> har ikke åbnet {n.count}{" "}
                {n.count === 1 ? "aflevering" : "afleveringer"}
              </li>
            ))}
            {attention.misconceptions[0] && attention.totalWrong > 0 && (
              <li>
                • Typisk fejl i klassen:{" "}
                <strong>
                  {attention.misconceptions[0].name.toLowerCase()} (
                  {Math.round(
                    (attention.misconceptions[0].count / attention.totalWrong) * 100
                  )}
                  % af fejlene)
                </strong>
              </li>
            )}
            {attention.stuck.length === 0 &&
              attention.notOpened.length === 0 &&
              attention.misconceptions.length === 0 && (
                <li>Alt ser roligt ud — ingen advarsler lige nu. 🌿</li>
              )}
          </ul>
          {attention.misconceptions.length > 1 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-medium text-amber-900">
                Alle fejlmønstre (14 dage)
              </summary>
              <ul className="mt-2 space-y-1 text-sm">
                {attention.misconceptions.map((m) => (
                  <li key={m.code} className="flex items-center gap-2">
                    <span className="font-mono text-xs text-amber-700">{m.code}</span>
                    {m.name} — {m.count} gange
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Aktive tildelinger */}
          <section aria-labelledby="tildelinger-h">
            <h2 id="tildelinger-h" className="text-lg font-bold">📋 Aktive tildelinger</h2>
            <div className="mt-3 space-y-3">
              {assignments.length === 0 ? (
                <EmptyState title="Ingen tildelinger" body="Opret din første tildeling — det tager under et minut." />
              ) : (
                assignments.map((a) => (
                  <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold">{a.title}</p>
                      <span className="ml-auto text-sm text-slate-500">{formatDue(a.dueAt)}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div
                        className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200"
                        role="progressbar"
                        aria-valuenow={a.submitted}
                        aria-valuemin={0}
                        aria-valuemax={a.total}
                        aria-label={`${a.title}: ${a.submitted} af ${a.total} afleveret`}
                      >
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${a.total ? (a.submitted / a.total) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-sm tabular-nums text-slate-600">
                        {a.submitted}/{a.total} afleveret
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Holdets mestring */}
          <section aria-labelledby="mestring-h">
            <h2 id="mestring-h" className="text-lg font-bold">
              📊 Holdets mestring <span className="font-normal text-slate-500">(Fælles Mål: Tal & algebra)</span>
            </h2>
            <div className="mt-3 space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
              {mastery.length === 0 ? (
                <p className="text-slate-500">Ingen data endnu.</p>
              ) : (
                mastery
                  .filter((kc) => !["MATH.BROEK", "MATH.LIN", "MATH.LIGN"].includes(kc.kcCode))
                  .map((kc) => {
                    const total = kc.levels.reduce((a, b) => a + b, 0);
                    return (
                      <div key={kc.kcCode}>
                        <p className="text-sm font-medium text-slate-700">{kc.kcName}</p>
                        <div
                          className="mt-1 flex h-3 overflow-hidden rounded-full"
                          role="img"
                          aria-label={`${kc.kcName}: ${kc.levels
                            .map((n, i) => `${n} ${MASTERY_META[i].name}`)
                            .join(", ")}`}
                        >
                          {kc.levels.map((n, i) =>
                            n > 0 ? (
                              <div
                                key={i}
                                style={{
                                  width: `${(n / total) * 100}%`,
                                  background: MASTERY_META[i].hex,
                                }}
                              />
                            ) : null
                          )}
                        </div>
                      </div>
                    );
                  })
              )}
              <p className="flex flex-wrap gap-3 pt-1 text-xs text-slate-500">
                {MASTERY_META.map((m) => (
                  <span key={m.level} className="inline-flex items-center gap-1">
                    <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: m.color }} />
                    {m.name}
                  </span>
                ))}
              </p>
            </div>
          </section>
        </div>

        {/* Elevliste → drill-down */}
        <section aria-labelledby="elever-h">
          <h2 id="elever-h" className="text-lg font-bold">👥 Elever ({students.length})</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {students.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/laerer/elev/${s.id}`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 hover:border-blue-300 hover:shadow-sm"
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="text-sm text-slate-400">Se forsøg →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}

function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
