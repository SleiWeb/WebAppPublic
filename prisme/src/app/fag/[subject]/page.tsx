import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { getSession } from "@/lib/auth/session";
import { getCourseMapForSubject } from "@/lib/data/content";
import { subjectById, MASTERY_META } from "@/lib/subjects";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

/**
 * Fagkortet (doc 04 §4.5): den visuelle læringssti — moduler → lektioner
 * med mestringsfarver og bløde låse (anbefalinger, ikke forbud).
 */
export default async function SubjectMapPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { subject: subjectId } = await params;
  const subject = subjectById(subjectId);
  if (!subject) notFound();

  const map = await getCourseMapForSubject(subjectId, session.userId);

  return (
    <AppShell session={session}>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-3xl font-bold" style={{ color: subject.hex }}>
            {subject.emoji} {subject.name}
          </h1>
          {map && <p className="text-slate-600">{map.courseTitle}</p>}
          <div className="ml-auto flex flex-wrap gap-3 text-sm">
            {MASTERY_META.map((m) => (
              <span key={m.level} className="inline-flex items-center gap-1.5 text-slate-600">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />
                {m.name}
              </span>
            ))}
          </div>
        </div>

        {!map ? (
          <EmptyState
            title={`${subject.name} kommer snart`}
            body="Vi bygger fagene ét ad gangen — matematik er først. Samme motor, nyt indhold."
          />
        ) : (
          <ol className="relative space-y-6 border-l-2 border-slate-200 pl-6">
            {map.modules.map((mod) => (
              <li key={mod.id} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-white"
                  style={{
                    background: mod.comingSoon
                      ? "#cbd5e1"
                      : mod.lessons.every((l) => l.state === "completed")
                        ? "#10b981"
                        : "#2563eb",
                  }}
                />
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold">{mod.title}</h2>
                  {mod.locked && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                      🔓 Anbefales efter forrige modul
                    </span>
                  )}
                  {mod.comingSoon && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                      Kommer snart
                    </span>
                  )}
                </div>

                {mod.lessons.length > 0 && (
                  <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                    {mod.lessons.map((lesson) => {
                      const meta = MASTERY_META[lesson.masteryLevel];
                      return (
                        <li key={lesson.id}>
                          <Link
                            href={`/lektion/${lesson.slug}`}
                            className="block rounded-2xl border-2 bg-white p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
                            style={{ borderColor: meta.hex }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{lesson.title}</span>
                              {lesson.state === "completed" && <span aria-hidden>✓</span>}
                            </div>
                            <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                              <span
                                aria-hidden
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ background: meta.color }}
                              />
                              {lesson.state === "completed"
                                ? meta.name
                                : lesson.state === "in_progress"
                                  ? `${meta.name} · fortsæt (${Math.round(lesson.percent)} %)`
                                  : "Ikke startet"}
                              {lesson.estMinutes && (
                                <span className="ml-auto">~{lesson.estMinutes} min</span>
                              )}
                            </p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </AppShell>
  );
}
