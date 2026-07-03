import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { AppShell } from "@/components/shell/AppShell";
import { getSession } from "@/lib/auth/session";
import { getClassStudents, getTeacherClass } from "@/lib/data/teacher";
import { db, tables as t } from "@/db";
import { AssignmentWizard } from "@/components/teacher/AssignmentWizard";

export const dynamic = "force-dynamic";

/** Tildelingsflow (doc 04 §4.7): vælg indhold → vælg modtagere → sæt rammer. ≤ 3 skridt. */
export default async function AssignPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "teacher") redirect("/elev");

  const klass = await getTeacherClass(session.userId);
  if (!klass) redirect("/laerer");

  const [students, lessons, templates] = await Promise.all([
    getClassStudents(klass.id),
    db
      .select({
        slug: t.lessons.slug,
        title: t.lessons.title,
        moduleTitle: t.modules.title,
      })
      .from(t.lessons)
      .innerJoin(t.modules, eq(t.modules.id, t.lessons.moduleId))
      .where(eq(t.lessons.status, "published"))
      .orderBy(t.modules.position, t.lessons.position),
    db
      .select({
        slug: t.exerciseTemplates.slug,
        title: t.exerciseTemplates.title,
        difficulty: t.exerciseTemplates.difficulty,
      })
      .from(t.exerciseTemplates)
      .where(eq(t.exerciseTemplates.status, "published")),
  ]);

  return (
    <AppShell session={session}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Ny tildeling · {klass.name}</h1>
          <p className="mt-1 text-slate-600">
            Tre skridt: indhold → modtagere → rammer. Retningen klarer Prisme.
          </p>
        </div>
        <AssignmentWizard
          students={students}
          lessons={lessons}
          templates={templates.filter((x) => x.slug != null) as { slug: string; title: string | null; difficulty: number }[]}
        />
      </div>
    </AppShell>
  );
}
