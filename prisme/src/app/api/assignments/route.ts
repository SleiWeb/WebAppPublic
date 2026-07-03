import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, tables as t } from "@/db";
import { getSession } from "@/lib/auth/session";
import { getClassStudents, getTeacherClass } from "@/lib/data/teacher";

const Body = z.object({
  title: z.string().min(1).max(200),
  itemType: z.enum(["lesson", "template"]),
  refSlug: z.string(),
  mode: z.enum(["homework", "in_class", "practice", "review"]),
  dueAt: z.string().nullable(),
  masteryGoal: z.number().int().min(0).max(3).nullable(),
  targetCount: z.number().int().min(1).max(50).optional(),
  recipients: z.union([
    z.literal("all"),
    z.array(z.object({ userId: z.string().uuid(), levelOffset: z.number().int().min(-2).max(2) })),
  ]),
});

/** Opret tildeling (doc 04 §4.7): indhold → modtagere → rammer → Tildel. */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "teacher")
    return NextResponse.json({ error: "Kun for lærere" }, { status: 403 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Ugyldigt kald" }, { status: 400 });
  const data = parsed.data;

  const klass = await getTeacherClass(session.userId);
  if (!klass)
    return NextResponse.json({ error: "Intet hold" }, { status: 400 });

  // slå indholdet op
  let refId: string | null = null;
  if (data.itemType === "lesson") {
    const [lesson] = await db
      .select({ id: t.lessons.id })
      .from(t.lessons)
      .where(eq(t.lessons.slug, data.refSlug));
    refId = lesson?.id ?? null;
  } else {
    const [tmpl] = await db
      .select({ id: t.exerciseTemplates.id })
      .from(t.exerciseTemplates)
      .where(eq(t.exerciseTemplates.slug, data.refSlug));
    refId = tmpl?.id ?? null;
  }
  if (!refId)
    return NextResponse.json({ error: "Ukendt indhold" }, { status: 400 });

  const [assignment] = await db
    .insert(t.assignments)
    .values({
      classId: klass.id,
      createdBy: session.userId,
      title: data.title,
      mode: data.mode,
      dueAt: data.dueAt ? new Date(data.dueAt) : null,
      masteryGoal: data.masteryGoal,
      settings: { hintsAllowed: true, targetCount: data.targetCount },
    })
    .returning();

  await db.insert(t.assignmentItems).values({
    assignmentId: assignment.id,
    itemType: data.itemType,
    refId,
    position: 1,
    targetCount: data.targetCount,
  });

  const students = await getClassStudents(klass.id);
  const recipients =
    data.recipients === "all"
      ? students.map((s) => ({ userId: s.id, levelOffset: 0 }))
      : data.recipients;

  if (data.recipients === "all") {
    await db
      .insert(t.assignmentTargets)
      .values({ assignmentId: assignment.id, userId: null });
  } else {
    await db.insert(t.assignmentTargets).values(
      recipients.map((r) => ({
        assignmentId: assignment.id,
        userId: r.userId,
        levelOffset: r.levelOffset,
      }))
    );
  }

  await db.insert(t.submissions).values(
    recipients.map((r) => ({
      assignmentId: assignment.id,
      userId: r.userId,
      status: "not_started",
    }))
  );

  return NextResponse.json({ id: assignment.id });
}
