import { and, asc, eq, inArray } from "drizzle-orm";
import { db, tables as t } from "@/db";
import type { LessonBlock } from "@/lib/content/schema";

export type CourseMapLesson = {
  id: string;
  slug: string;
  title: string;
  estMinutes: number | null;
  percent: number;
  state: string;
  masteryLevel: number; // 0..3 (gennemsnit over lektionens KC'er)
};

export type CourseMapModule = {
  id: string;
  title: string;
  position: number;
  locked: boolean;
  comingSoon: boolean;
  lessons: CourseMapLesson[];
};

export type CourseMap = {
  courseId: string;
  courseTitle: string;
  description: string | null;
  modules: CourseMapModule[];
};

/** Fagkortet (doc 04 §4.5): moduler → lektioner med mestringsfarver og bløde låse. */
export async function getCourseMapForSubject(
  subjectId: string,
  userId?: string
): Promise<CourseMap | null> {
  const [course] = await db
    .select()
    .from(t.courses)
    .where(and(eq(t.courses.subjectId, subjectId), eq(t.courses.published, true)))
    .orderBy(asc(t.courses.position));
  if (!course) return null;

  const moduleRows = await db
    .select()
    .from(t.modules)
    .where(eq(t.modules.courseId, course.id))
    .orderBy(asc(t.modules.position));

  const moduleIds = moduleRows.map((m) => m.id);
  const lessonRows = moduleIds.length
    ? await db
        .select()
        .from(t.lessons)
        .where(inArray(t.lessons.moduleId, moduleIds))
        .orderBy(asc(t.lessons.position))
    : [];

  const lessonIds = lessonRows.map((l) => l.id);

  const progressRows =
    userId && lessonIds.length
      ? await db
          .select()
          .from(t.progress)
          .where(
            and(
              eq(t.progress.userId, userId),
              eq(t.progress.scopeType, "lesson"),
              inArray(t.progress.scopeId, lessonIds)
            )
          )
      : [];
  const progressByLesson = new Map(progressRows.map((p) => [p.scopeId, p]));

  // mestring pr. lektion = gennemsnit over lektionens KC'er
  const lessonKcRows = lessonIds.length
    ? await db.select().from(t.lessonKc).where(inArray(t.lessonKc.lessonId, lessonIds))
    : [];
  const kcIds = [...new Set(lessonKcRows.map((r) => r.kcId))];
  const masteryRows =
    userId && kcIds.length
      ? await db
          .select()
          .from(t.masteryEstimates)
          .where(
            and(
              eq(t.masteryEstimates.userId, userId),
              inArray(t.masteryEstimates.kcId, kcIds)
            )
          )
      : [];
  const masteryByKc = new Map(masteryRows.map((m) => [m.kcId, m.level]));

  const lessonsByModule = new Map<string, CourseMapLesson[]>();
  for (const lesson of lessonRows) {
    const kcsOfLesson = lessonKcRows.filter((r) => r.lessonId === lesson.id);
    const levels = kcsOfLesson.map((r) => masteryByKc.get(r.kcId) ?? 0);
    const avgLevel = levels.length
      ? Math.round(levels.reduce((a, b) => a + b, 0) / levels.length)
      : 0;
    const p = progressByLesson.get(lesson.id);
    const list = lessonsByModule.get(lesson.moduleId) ?? [];
    list.push({
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      estMinutes: lesson.estMinutes,
      percent: p?.percent ?? 0,
      state: p?.state ?? "not_started",
      masteryLevel: avgLevel,
    });
    lessonsByModule.set(lesson.moduleId, list);
  }

  const modulePercent = (moduleId: string) => {
    const lessons = lessonsByModule.get(moduleId) ?? [];
    if (lessons.length === 0) return 0;
    return lessons.reduce((a, l) => a + l.percent, 0) / lessons.length;
  };

  const modules: CourseMapModule[] = moduleRows.map((m) => {
    const prereqs = m.prereqModuleIds ?? [];
    // blød lås: anbefaling, ikke forbud (doc 04 §4.5)
    const locked =
      prereqs.length > 0 && prereqs.some((p) => modulePercent(p) < 60);
    const lessons = lessonsByModule.get(m.id) ?? [];
    return {
      id: m.id,
      title: m.title,
      position: m.position,
      locked,
      comingSoon: lessons.length === 0,
      lessons,
    };
  });

  return {
    courseId: course.id,
    courseTitle: course.title,
    description: course.description,
    modules,
  };
}

export async function getLessonWithBlocks(slug: string) {
  const [lesson] = await db.select().from(t.lessons).where(eq(t.lessons.slug, slug));
  if (!lesson) return null;
  const blockRows = await db
    .select()
    .from(t.lessonBlocks)
    .where(eq(t.lessonBlocks.lessonId, lesson.id))
    .orderBy(asc(t.lessonBlocks.position));
  return {
    ...lesson,
    blocks: blockRows.map((b) => b.payload as LessonBlock),
  };
}

/** Fremdrift pr. fag til fagvalgs-kortene (procent på tværs af lektioner). */
export async function getSubjectProgress(userId: string) {
  const lessonRows = await db
    .select({
      lessonId: t.lessons.id,
      subjectId: t.courses.subjectId,
    })
    .from(t.lessons)
    .innerJoin(t.modules, eq(t.modules.id, t.lessons.moduleId))
    .innerJoin(t.courses, eq(t.courses.id, t.modules.courseId))
    .where(eq(t.lessons.status, "published"));

  const lessonIds = lessonRows.map((l) => l.lessonId);
  const progressRows = lessonIds.length
    ? await db
        .select()
        .from(t.progress)
        .where(
          and(
            eq(t.progress.userId, userId),
            eq(t.progress.scopeType, "lesson"),
            inArray(t.progress.scopeId, lessonIds)
          )
        )
    : [];
  const byLesson = new Map(progressRows.map((p) => [p.scopeId, p.percent]));

  const totals = new Map<string, { sum: number; n: number }>();
  for (const l of lessonRows) {
    const cur = totals.get(l.subjectId) ?? { sum: 0, n: 0 };
    cur.sum += byLesson.get(l.lessonId) ?? 0;
    cur.n += 1;
    totals.set(l.subjectId, cur);
  }
  const result: Record<string, number> = {};
  for (const [subjectId, { sum, n }] of totals)
    result[subjectId] = n ? Math.round(sum / n) : 0;
  return result;
}
