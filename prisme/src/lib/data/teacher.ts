import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { db, tables as t } from "@/db";

const DAY = 24 * 60 * 60 * 1000;

/** Lærerens hold (MVP: første hold hvor brugeren er lærer). */
export async function getTeacherClass(teacherId: string) {
  const [row] = await db
    .select({
      id: t.classes.id,
      name: t.classes.name,
      gradeLevel: t.classes.gradeLevel,
      subjectId: t.classes.subjectId,
    })
    .from(t.classMemberships)
    .innerJoin(t.classes, eq(t.classes.id, t.classMemberships.classId))
    .where(
      and(
        eq(t.classMemberships.userId, teacherId),
        inArray(t.classMemberships.roleInClass, ["teacher", "co_teacher"])
      )
    );
  return row ?? null;
}

export async function getClassStudents(classId: string) {
  return db
    .select({
      id: t.users.id,
      name: t.users.displayName,
      levelOffset: t.classMemberships.levelOffset,
    })
    .from(t.classMemberships)
    .innerJoin(t.users, eq(t.users.id, t.classMemberships.userId))
    .where(
      and(
        eq(t.classMemberships.classId, classId),
        eq(t.classMemberships.roleInClass, "student")
      )
    )
    .orderBy(t.users.displayName);
}

/**
 * "Kræver opmærksomhed" (doc 04 §4.4): hvem sidder fast, hvem har ikke
 * åbnet afleveringer, og hvilke fejlmønstre fylder — aggregeret direkte
 * fra attempts, så tallene altid er ægte.
 */
export async function getNeedsAttention(classId: string) {
  const students = await getClassStudents(classId);
  const studentIds = students.map((s) => s.id);
  const nameById = new Map(students.map((s) => [s.id, s.name]));
  if (studentIds.length === 0)
    return { stuck: [], notOpened: [], misconceptions: [], totalWrong: 0 };

  const since = new Date(Date.now() - 7 * DAY);

  // sidder fast: ≥2 forkerte og ≥50 % fejlrate den seneste uge
  const recent = await db
    .select({
      userId: t.attempts.userId,
      total: sql<number>`count(*)`,
      wrong: sql<number>`count(*) filter (where not ${t.attempts.isCorrect})`,
    })
    .from(t.attempts)
    .where(and(inArray(t.attempts.userId, studentIds), gte(t.attempts.createdAt, since)))
    .groupBy(t.attempts.userId);

  const stuckIds = recent
    .filter((r) => Number(r.wrong) >= 2 && Number(r.wrong) / Number(r.total) >= 0.5)
    .map((r) => r.userId);

  // hvad sidder de fast i? (hyppigst fejlede skabelon blandt de fastlåste)
  let stuckTopic: string | null = null;
  if (stuckIds.length > 0) {
    const [topicRow] = await db
      .select({
        title: t.exerciseTemplates.title,
        n: sql<number>`count(*)`,
      })
      .from(t.attempts)
      .innerJoin(t.exerciseInstances, eq(t.exerciseInstances.id, t.attempts.instanceId))
      .innerJoin(
        t.exerciseTemplates,
        eq(t.exerciseTemplates.id, t.exerciseInstances.templateId)
      )
      .where(
        and(
          inArray(t.attempts.userId, stuckIds),
          gte(t.attempts.createdAt, since),
          eq(t.attempts.isCorrect, false)
        )
      )
      .groupBy(t.exerciseTemplates.title)
      .orderBy(desc(sql`count(*)`))
      .limit(1);
    stuckTopic = topicRow?.title ?? null;
  }

  // ikke åbnede afleveringer (kun elever med flere uåbnede — én er normalt)
  const notOpenedRows = await db
    .select({
      userId: t.submissions.userId,
      n: sql<number>`count(*)`,
    })
    .from(t.submissions)
    .innerJoin(t.assignments, eq(t.assignments.id, t.submissions.assignmentId))
    .where(
      and(
        eq(t.assignments.classId, classId),
        eq(t.submissions.status, "not_started"),
        inArray(t.submissions.userId, studentIds)
      )
    )
    .groupBy(t.submissions.userId);

  // fejlmønstre: misforståelser de sidste 14 dage
  const since14 = new Date(Date.now() - 14 * DAY);
  const misconceptionRows = await db
    .select({
      code: t.misconceptions.code,
      name: t.misconceptions.name,
      n: sql<number>`count(*)`,
    })
    .from(t.attempts)
    .innerJoin(t.misconceptions, eq(t.misconceptions.id, t.attempts.misconceptionId))
    .where(
      and(inArray(t.attempts.userId, studentIds), gte(t.attempts.createdAt, since14))
    )
    .groupBy(t.misconceptions.code, t.misconceptions.name)
    .orderBy(desc(sql`count(*)`))
    .limit(5);

  const [wrongTotal] = await db
    .select({ n: sql<number>`count(*)` })
    .from(t.attempts)
    .where(
      and(
        inArray(t.attempts.userId, studentIds),
        gte(t.attempts.createdAt, since14),
        eq(t.attempts.isCorrect, false)
      )
    );

  return {
    stuck: stuckIds.map((id) => nameById.get(id) ?? "?"),
    stuckTopic,
    notOpened: notOpenedRows
      .filter((r) => Number(r.n) >= 2)
      .sort((a, b) => Number(b.n) - Number(a.n))
      .slice(0, 5)
      .map((r) => ({
        name: nameById.get(r.userId) ?? "?",
        count: Number(r.n),
      })),
    misconceptions: misconceptionRows.map((m) => ({
      code: m.code,
      name: m.name,
      count: Number(m.n),
    })),
    totalWrong: Number(wrongTotal.n),
  };
}

export async function getActiveAssignments(classId: string) {
  const rows = await db
    .select({
      id: t.assignments.id,
      title: t.assignments.title,
      mode: t.assignments.mode,
      dueAt: t.assignments.dueAt,
      submitted: sql<number>`count(*) filter (where ${t.submissions.status} in ('submitted','graded'))`,
      total: sql<number>`count(${t.submissions.id})`,
    })
    .from(t.assignments)
    .leftJoin(t.submissions, eq(t.submissions.assignmentId, t.assignments.id))
    .where(eq(t.assignments.classId, classId))
    .groupBy(t.assignments.id)
    .orderBy(t.assignments.dueAt);
  return rows.map((r) => ({
    ...r,
    submitted: Number(r.submitted),
    total: Number(r.total),
  }));
}

/** Holdets mestringsfordeling pr. KC (Ny/Øvet/Sikker/Mester). */
export async function getClassMastery(classId: string) {
  const students = await getClassStudents(classId);
  const studentIds = students.map((s) => s.id);
  if (studentIds.length === 0) return [];

  const rows = await db
    .select({
      kcCode: t.knowledgeComponents.code,
      kcName: t.knowledgeComponents.name,
      level: t.masteryEstimates.level,
      n: sql<number>`count(*)`,
    })
    .from(t.masteryEstimates)
    .innerJoin(
      t.knowledgeComponents,
      eq(t.knowledgeComponents.id, t.masteryEstimates.kcId)
    )
    .where(inArray(t.masteryEstimates.userId, studentIds))
    .groupBy(t.knowledgeComponents.code, t.knowledgeComponents.name, t.masteryEstimates.level);

  const byKc = new Map<
    string,
    { kcCode: string; kcName: string; levels: [number, number, number, number] }
  >();
  for (const r of rows) {
    const cur =
      byKc.get(r.kcCode) ??
      ({ kcCode: r.kcCode, kcName: r.kcName, levels: [0, 0, 0, 0] } as const as {
        kcCode: string;
        kcName: string;
        levels: [number, number, number, number];
      });
    cur.levels[r.level as 0 | 1 | 2 | 3] += Number(r.n);
    byKc.set(r.kcCode, cur);
  }
  return [...byKc.values()].sort((a, b) => a.kcCode.localeCompare(b.kcCode));
}

/** Drill-down (doc 04 §4.4): elevens konkrete forsøg med svar, hints og diagnose. */
export async function getStudentDrilldown(studentId: string) {
  const [student] = await db
    .select()
    .from(t.users)
    .where(eq(t.users.id, studentId));
  if (!student) return null;

  const attempts = await db
    .select({
      id: t.attempts.id,
      createdAt: t.attempts.createdAt,
      isCorrect: t.attempts.isCorrect,
      closeness: t.attempts.closeness,
      hintsUsed: t.attempts.hintsUsed,
      durationMs: t.attempts.durationMs,
      submittedAnswer: t.attempts.submittedAnswer,
      templateTitle: t.exerciseTemplates.title,
      misconceptionName: t.misconceptions.name,
      misconceptionCode: t.misconceptions.code,
    })
    .from(t.attempts)
    .innerJoin(t.exerciseInstances, eq(t.exerciseInstances.id, t.attempts.instanceId))
    .innerJoin(
      t.exerciseTemplates,
      eq(t.exerciseTemplates.id, t.exerciseInstances.templateId)
    )
    .leftJoin(t.misconceptions, eq(t.misconceptions.id, t.attempts.misconceptionId))
    .where(eq(t.attempts.userId, studentId))
    .orderBy(desc(t.attempts.createdAt))
    .limit(40);

  const mastery = await db
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
    .where(eq(t.masteryEstimates.userId, studentId))
    .orderBy(t.knowledgeComponents.code);

  return { student, attempts, mastery };
}

/** GDPR (doc 07 §7.8): al læreradgang til elevdata logges. */
export async function logStudentDataAccess(actorId: string, subjectUserId: string) {
  await db.insert(t.auditLog).values({
    actorId,
    action: "view_student_data",
    subjectUserId,
    context: { surface: "teacher_drilldown" },
  });
}
