import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { db, tables as t } from "@/db";

const DAY = 24 * 60 * 60 * 1000;

/** Elev-dashboardets data (doc 04 §4.3): ind i arbejdet på < 5 sekunder. */
export async function getStudentDashboard(userId: string) {
  const [continueLesson, assignments, reviews, streak, masterCount] =
    await Promise.all([
      getContinueLesson(userId),
      getStudentAssignments(userId),
      getDueReviews(userId),
      getStreak(userId),
      getMasterCount(userId),
    ]);
  return { continueLesson, assignments, reviews, streak, masterCount };
}

async function getContinueLesson(userId: string) {
  const rows = await db
    .select({
      slug: t.lessons.slug,
      title: t.lessons.title,
      moduleTitle: t.modules.title,
      subjectId: t.courses.subjectId,
      percent: t.progress.percent,
      updatedAt: t.progress.updatedAt,
    })
    .from(t.progress)
    .innerJoin(t.lessons, eq(t.lessons.id, t.progress.scopeId))
    .innerJoin(t.modules, eq(t.modules.id, t.lessons.moduleId))
    .innerJoin(t.courses, eq(t.courses.id, t.modules.courseId))
    .where(
      and(
        eq(t.progress.userId, userId),
        eq(t.progress.scopeType, "lesson"),
        eq(t.progress.state, "in_progress")
      )
    )
    .orderBy(desc(t.progress.updatedAt))
    .limit(1);
  if (rows[0]) return rows[0];

  // intet i gang: foreslå første ikke-startede lektion
  const next = await db
    .select({
      slug: t.lessons.slug,
      title: t.lessons.title,
      moduleTitle: t.modules.title,
      subjectId: t.courses.subjectId,
    })
    .from(t.lessons)
    .innerJoin(t.modules, eq(t.modules.id, t.lessons.moduleId))
    .innerJoin(t.courses, eq(t.courses.id, t.modules.courseId))
    .where(eq(t.lessons.status, "published"))
    .orderBy(t.modules.position, t.lessons.position)
    .limit(1);
  return next[0] ? { ...next[0], percent: 0, updatedAt: null } : null;
}

export async function getStudentAssignments(userId: string) {
  const classIds = (
    await db
      .select({ classId: t.classMemberships.classId })
      .from(t.classMemberships)
      .where(eq(t.classMemberships.userId, userId))
  ).map((r) => r.classId);
  if (classIds.length === 0) return [];

  const rows = await db
    .select({
      id: t.assignments.id,
      title: t.assignments.title,
      mode: t.assignments.mode,
      dueAt: t.assignments.dueAt,
      status: t.submissions.status,
      score: t.submissions.score,
      subjectId: t.classes.subjectId,
    })
    .from(t.assignments)
    .innerJoin(t.classes, eq(t.classes.id, t.assignments.classId))
    .leftJoin(
      t.submissions,
      and(
        eq(t.submissions.assignmentId, t.assignments.id),
        eq(t.submissions.userId, userId)
      )
    )
    .where(inArray(t.assignments.classId, classIds))
    .orderBy(t.assignments.dueAt);

  // fremdrift pr. aflevering: andel korrekte forsøg mod målet
  const result = [];
  for (const row of rows) {
    const [counts] = await db
      .select({
        attempts: sql<number>`count(*)`,
        correct: sql<number>`count(*) filter (where ${t.attempts.isCorrect})`,
      })
      .from(t.attempts)
      .where(
        and(eq(t.attempts.userId, userId), eq(t.attempts.assignmentId, row.id))
      );
    const percent =
      row.status === "submitted" || row.status === "graded"
        ? 100
        : Math.min(90, Number(counts.correct) * 20);
    result.push({ ...row, status: row.status ?? "not_started", percent });
  }
  return result;
}

/** "Repetition i dag": forfaldne KC'er + en skabelon at træne dem med. */
export async function getDueReviews(userId: string) {
  const due = await db
    .select({
      kcId: t.reviewSchedule.kcId,
      dueAt: t.reviewSchedule.dueAt,
      kcCode: t.knowledgeComponents.code,
      kcName: t.knowledgeComponents.name,
    })
    .from(t.reviewSchedule)
    .innerJoin(
      t.knowledgeComponents,
      eq(t.knowledgeComponents.id, t.reviewSchedule.kcId)
    )
    .where(
      and(eq(t.reviewSchedule.userId, userId), lte(t.reviewSchedule.dueAt, new Date()))
    )
    .orderBy(t.reviewSchedule.dueAt)
    .limit(8);

  const result = [];
  for (const d of due) {
    const [tmpl] = await db
      .select({ slug: t.exerciseTemplates.slug })
      .from(t.exerciseKc)
      .innerJoin(
        t.exerciseTemplates,
        eq(t.exerciseTemplates.id, t.exerciseKc.templateId)
      )
      .where(eq(t.exerciseKc.kcId, d.kcId))
      .limit(1);
    if (tmpl?.slug) result.push({ ...d, templateSlug: tmpl.slug });
  }
  return result;
}

/** Afdæmpet streak (doc 01 princip 9): antal sammenhængende dage med aktivitet. */
async function getStreak(userId: string): Promise<number> {
  const rows = await db
    .select({
      day: sql<string>`date_trunc('day', ${t.attempts.createdAt})::date::text`,
    })
    .from(t.attempts)
    .where(
      and(
        eq(t.attempts.userId, userId),
        gte(t.attempts.createdAt, new Date(Date.now() - 30 * DAY))
      )
    )
    .groupBy(sql`1`)
    .orderBy(desc(sql`1`));
  const days = new Set(rows.map((r) => r.day));
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(Date.now() - i * DAY).toISOString().slice(0, 10);
    if (days.has(d)) streak++;
    else if (i === 0) continue; // dagen er ung — tæl videre fra i går
    else break;
  }
  return streak;
}

async function getMasterCount(userId: string): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.masteryEstimates)
    .where(
      and(eq(t.masteryEstimates.userId, userId), eq(t.masteryEstimates.level, 3))
    );
  return Number(row.n);
}

/** Fremskridtsoversigt (doc 04 §4.6): mestring pr. emne. */
export async function getStudentMastery(userId: string) {
  return db
    .select({
      kcCode: t.knowledgeComponents.code,
      kcName: t.knowledgeComponents.name,
      level: t.masteryEstimates.level,
      pKnown: t.masteryEstimates.pKnown,
      attempts: t.masteryEstimates.attempts,
    })
    .from(t.masteryEstimates)
    .innerJoin(
      t.knowledgeComponents,
      eq(t.knowledgeComponents.id, t.masteryEstimates.kcId)
    )
    .where(eq(t.masteryEstimates.userId, userId))
    .orderBy(t.knowledgeComponents.code);
}
