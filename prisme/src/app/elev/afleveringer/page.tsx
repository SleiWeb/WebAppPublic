import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { getSession } from "@/lib/auth/session";
import { getStudentAssignments } from "@/lib/data/student";
import { db, tables as t } from "@/db";
import { eq, asc } from "drizzle-orm";
import { EmptyState, ProgressBar, formatDue } from "@/components/ui";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  not_started: "Ikke åbnet",
  in_progress: "I gang",
  submitted: "Afleveret",
  graded: "Rettet",
};

/** Elevens afleveringsoversigt (doc 04 §4.7): fag, titel, frist, status, fortsæt. */
export default async function StudentAssignmentsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const assignments = await getStudentAssignments(session.userId);

  // find "fortsæt"-mål for hver aflevering (første lesson-item)
  const targets = new Map<string, string>();
  for (const a of assignments) {
    const [item] = await db
      .select()
      .from(t.assignmentItems)
      .where(eq(t.assignmentItems.assignmentId, a.id))
      .orderBy(asc(t.assignmentItems.position))
      .limit(1);
    if (!item) continue;
    if (item.itemType === "lesson") {
      const [lesson] = await db
        .select({ slug: t.lessons.slug })
        .from(t.lessons)
        .where(eq(t.lessons.id, item.refId));
      if (lesson) targets.set(a.id, `/lektion/${lesson.slug}?aflevering=${a.id}`);
    } else if (item.itemType === "template") {
      const [tmpl] = await db
        .select({ slug: t.exerciseTemplates.slug })
        .from(t.exerciseTemplates)
        .where(eq(t.exerciseTemplates.id, item.refId));
      if (tmpl?.slug)
        targets.set(
          a.id,
          `/elev/repetition?skabelon=${tmpl.slug}&aflevering=${a.id}&antal=${item.targetCount ?? 6}`
        );
    }
  }

  return (
    <AppShell session={session}>
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold">Afleveringer</h1>
        {assignments.length === 0 ? (
          <EmptyState
            title="Ingen afleveringer endnu"
            body="Når din lærer tildeler opgaver, dukker de op her med frist og status."
          />
        ) : (
          <ul className="space-y-3">
            {assignments.map((a) => {
              const done = a.status === "submitted" || a.status === "graded";
              return (
                <li key={a.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <p className="text-lg font-semibold">{a.title}</p>
                      <p className="text-sm text-slate-500">
                        Matematik · {formatDue(a.dueAt)} ·{" "}
                        <span className={done ? "font-medium text-emerald-700" : ""}>
                          {STATUS_LABEL[a.status] ?? a.status}
                        </span>
                        {a.score != null && ` · ${Math.round(a.score * 100)} % rigtige`}
                      </p>
                    </div>
                    {!done && targets.get(a.id) && (
                      <Link
                        href={targets.get(a.id)!}
                        className="ml-auto rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
                      >
                        {a.status === "not_started" ? "Start" : "Fortsæt"} →
                      </Link>
                    )}
                  </div>
                  <div className="mt-3">
                    <ProgressBar
                      percent={a.percent}
                      color={done ? "#10b981" : "#2563eb"}
                      label={`${a.title}: ${a.percent} %`}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
