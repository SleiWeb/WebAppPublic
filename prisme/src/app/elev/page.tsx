import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { getSession } from "@/lib/auth/session";
import { getStudentDashboard } from "@/lib/data/student";
import { getSubjectProgress } from "@/lib/data/content";
import { SUBJECTS } from "@/lib/subjects";
import { EmptyState, ProgressBar, formatDue } from "@/components/ui";

export const dynamic = "force-dynamic";

/** Elev-dashboard (doc 04 §4.3): Fortsæt · Afleveringer · Repetition · Fagkort · streak. */
export default async function StudentDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "teacher") redirect("/laerer");

  const [data, subjectProgress] = await Promise.all([
    getStudentDashboard(session.userId),
    getSubjectProgress(session.userId),
  ]);
  const firstName = session.displayName.split(" ")[0];

  return (
    <AppShell session={session}>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-3xl font-bold">Hej {firstName} 👋</h1>
          <div className="ml-auto flex gap-3 text-sm">
            {data.streak > 0 && (
              <span className="rounded-full bg-orange-50 px-3 py-1.5 font-medium text-orange-800">
                🔥 {data.streak} {data.streak === 1 ? "dags" : "dages"} streak
              </span>
            )}
            {data.masterCount > 0 && (
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-800">
                ⭐ Mester i {data.masterCount} {data.masterCount === 1 ? "emne" : "emner"}
              </span>
            )}
          </div>
        </div>

        {/* Fortsæt */}
        {data.continueLesson && (
          <section className="rounded-2xl border-2 border-blue-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              ▶ Fortsæt hvor du slap
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xl font-bold">{data.continueLesson.title}</p>
                <p className="text-slate-600">
                  Matematik · {data.continueLesson.moduleTitle}
                </p>
              </div>
              <Link
                href={`/lektion/${data.continueLesson.slug}`}
                className="ml-auto rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Fortsæt →
              </Link>
            </div>
            {data.continueLesson.percent > 0 && (
              <div className="mt-3 max-w-md">
                <ProgressBar percent={data.continueLesson.percent} label="Lektionens fremdrift" />
              </div>
            )}
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Afleveringer */}
          <section aria-labelledby="afleveringer-h">
            <h2 id="afleveringer-h" className="text-lg font-bold">
              📌 Afleveringer ({data.assignments.filter((a) => a.status !== "submitted" && a.status !== "graded").length})
            </h2>
            <div className="mt-3 space-y-3">
              {data.assignments.length === 0 ? (
                <EmptyState title="Ingen afleveringer" body="Din lærer har ikke tildelt noget endnu — du kan altid træne via fagkortet." />
              ) : (
                data.assignments.map((a) => (
                  <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-semibold">{a.title}</p>
                        <p className="text-sm text-slate-500">
                          Matematik · {formatDue(a.dueAt)}
                          {(a.status === "submitted" || a.status === "graded") && " · afleveret ✓"}
                        </p>
                      </div>
                      <Link
                        href="/elev/afleveringer"
                        className="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50"
                      >
                        Åbn
                      </Link>
                    </div>
                    <div className="mt-3">
                      <ProgressBar
                        percent={a.percent}
                        color={a.status === "submitted" || a.status === "graded" ? "#10b981" : "#2563eb"}
                        label={`${a.title}: ${a.percent} %`}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Repetition i dag */}
          <section aria-labelledby="repetition-h">
            <h2 id="repetition-h" className="text-lg font-bold">
              🔁 Repetition i dag
            </h2>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
              {data.reviews.length === 0 ? (
                <p className="text-slate-600">
                  Alt er frisk i hukommelsen — ingen repetition i dag. 🌿
                </p>
              ) : (
                <>
                  <p className="text-slate-700">
                    Genopfrisk ({data.reviews.length} emner, ca. 5 min):
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {data.reviews.slice(0, 4).map((r) => (
                      <li key={r.kcCode} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        {r.kcName}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/elev/repetition"
                    className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700"
                  >
                    Start repetition →
                  </Link>
                </>
              )}
            </div>
          </section>
        </div>

        {/* Fagkort */}
        <section aria-labelledby="fagkort-h">
          <h2 id="fagkort-h" className="text-lg font-bold">
            🗺 Dine fagkort
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {SUBJECTS.map((s) => {
              const pct = subjectProgress[s.id] ?? 0;
              const inner = (
                <div
                  className={`rounded-2xl border-2 bg-white p-3 ${s.available ? "hover:shadow-md" : "opacity-60"}`}
                  style={{ borderColor: s.hex }}
                >
                  <p className="font-bold" style={{ color: s.hex }}>
                    {s.emoji} {s.name}
                  </p>
                  {s.available ? (
                    <>
                      <div className="mt-2">
                        <ProgressBar percent={pct} color={s.hex} label={`${s.name}: ${pct} %`} />
                      </div>
                      <p className="mt-1 text-sm tabular-nums text-slate-600">{pct} %</p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-slate-400">Kommer snart</p>
                  )}
                </div>
              );
              return s.available ? (
                <Link key={s.id} href={`/fag/${s.id}`}>{inner}</Link>
              ) : (
                <div key={s.id}>{inner}</div>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
