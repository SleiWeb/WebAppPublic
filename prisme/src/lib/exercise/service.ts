/**
 * Opgave-service: server-autoritativ generering og retning.
 * Facit forlader aldrig serveren — klienten får kun det sanerede
 * opgavebillede, og alle svar valideres her (doc 06 §6.7–6.8).
 */
import { and, count, eq, sql } from "drizzle-orm";
import { db, tables as t } from "@/db";
import { generateInstance } from "@/lib/engine/generate";
import { seedFor } from "@/lib/engine/prng";
import { validateAnswer } from "@/lib/engine/validate";
import type {
  RenderedInstance,
  SubmittedAnswer,
  ValidationResult,
} from "@/lib/engine/types";
import {
  levelFromEstimate,
  updateMastery,
  type MasteryLevel,
} from "@/lib/mastery/model";
import {
  INITIAL_REVIEW,
  nextDueDate,
  qualityOf,
  updateReview,
} from "@/lib/review/sm2";
import {
  kcIdsByCodes,
  loadTemplateBySlug,
  misconceptionByCode,
} from "@/lib/data/templates";
import type { WidgetSpec } from "@/lib/content/schema";

/** Det, klienten må se om en instans (uden facit). */
export type ClientExercise = {
  instanceId: string;
  templateSlug: string;
  title: string;
  difficulty: number;
  prompt: { text: string; inputWidget?: WidgetSpec };
  input:
    | { kind: "numeric"; unitHint?: string }
    | { kind: "expression" }
    | { kind: "mcq"; options: { id: string; text: string }[] }
    | { kind: "multi"; options: { id: string; text: string }[] }
    | { kind: "point" };
  hintCount: number;
};

export async function startExercise(
  userId: string,
  templateSlug: string
): Promise<ClientExercise> {
  const { dbId, content } = await loadTemplateBySlug(templateSlug);

  const [{ n: priorAttempts }] = await db
    .select({ n: count() })
    .from(t.attempts)
    .innerJoin(t.exerciseInstances, eq(t.exerciseInstances.id, t.attempts.instanceId))
    .where(
      and(
        eq(t.attempts.userId, userId),
        eq(t.exerciseInstances.templateId, dbId)
      )
    );

  const seed = seedFor(userId, templateSlug, Number(priorAttempts) + 1);
  const instance = generateInstance(content, seed);

  const [row] = await db
    .insert(t.exerciseInstances)
    .values({ templateId: dbId, seed, rendered: instance })
    .returning();

  return sanitize(row.id, content.title, instance);
}

function sanitize(
  instanceId: string,
  title: string,
  instance: RenderedInstance
): ClientExercise {
  const answer = instance.answer;
  const input: ClientExercise["input"] =
    answer.validator === "numeric"
      ? { kind: "numeric", unitHint: answer.unit }
      : answer.validator === "expression"
        ? { kind: "expression" }
        : answer.validator === "mcq" || answer.validator === "multi"
          ? {
              kind: answer.validator,
              options: answer.options.map((o) => ({ id: o.id, text: o.text })),
            }
          : { kind: "point" };
  return {
    instanceId,
    templateSlug: instance.templateId,
    title,
    difficulty: instance.difficulty,
    prompt: instance.prompt,
    input,
    hintCount: instance.hints.length,
  };
}

export type SubmitResult = {
  correct: boolean;
  closeness: number;
  feedbackMessage?: string;
  misconception?: { code: string; name: string; explanation: string | null };
  solutionSteps: string[];
  masteryUpdates: { kcCode: string; level: MasteryLevel; pKnown: number }[];
};

export async function submitAnswer(params: {
  userId: string;
  instanceId: string;
  answer: SubmittedAnswer;
  hintsUsed: number;
  durationMs?: number;
  assignmentId?: string;
  context: "lesson" | "checkpoint" | "review" | "assignment";
}): Promise<SubmitResult> {
  const [instanceRow] = await db
    .select()
    .from(t.exerciseInstances)
    .where(eq(t.exerciseInstances.id, params.instanceId));
  if (!instanceRow) throw new Error("Ukendt opgaveinstans");

  const instance = instanceRow.rendered as RenderedInstance;
  const result: ValidationResult = validateAnswer(instance, params.answer);

  const misconception = result.misconceptionCode
    ? await misconceptionByCode(result.misconceptionCode)
    : null;

  const [attemptRow] = await db
    .insert(t.attempts)
    .values({
      userId: params.userId,
      instanceId: params.instanceId,
      assignmentId: params.assignmentId,
      submittedAnswer: params.answer,
      isCorrect: result.correct,
      closeness: result.closeness,
      misconceptionId: misconception?.id,
      hintsUsed: params.hintsUsed,
      durationMs: params.durationMs,
    })
    .returning();

  if (params.hintsUsed > 0) {
    await db.insert(t.hintViews).values(
      Array.from({ length: params.hintsUsed }, (_, i) => ({
        attemptId: attemptRow.id,
        level: i + 1,
      }))
    );
  }
  if (result.feedbackMessage) {
    await db.insert(t.feedbackGiven).values({
      attemptId: attemptRow.id,
      message: { text: result.feedbackMessage },
    });
  }

  const masteryUpdates = await applyMasteryUpdate(
    params.userId,
    instance.knowledgeComponents,
    result.correct,
    params.hintsUsed,
    params.context
  );

  if (params.assignmentId) {
    await touchSubmission(params.userId, params.assignmentId);
  }

  return {
    correct: result.correct,
    closeness: result.closeness,
    feedbackMessage: result.feedbackMessage,
    misconception: misconception
      ? {
          code: misconception.code,
          name: misconception.name,
          explanation: misconception.explanation,
        }
      : undefined,
    solutionSteps: instance.solutionSteps,
    masteryUpdates,
  };
}

async function applyMasteryUpdate(
  userId: string,
  kcCodes: string[],
  correct: boolean,
  hintsUsed: number,
  context: "lesson" | "checkpoint" | "review" | "assignment"
) {
  const kcIds = await kcIdsByCodes(kcCodes);
  const updates: SubmitResult["masteryUpdates"] = [];

  for (const code of kcCodes) {
    const kcId = kcIds.get(code);
    if (!kcId) continue;

    const [existing] = await db
      .select()
      .from(t.masteryEstimates)
      .where(
        and(eq(t.masteryEstimates.userId, userId), eq(t.masteryEstimates.kcId, kcId))
      );

    const state = updateMastery(
      { pKnown: existing?.pKnown ?? 0.12, attempts: existing?.attempts ?? 0 },
      { correct, hintsUsed }
    );
    const level = levelFromEstimate(state);

    await db
      .insert(t.masteryEstimates)
      .values({
        userId,
        kcId,
        level,
        pKnown: state.pKnown,
        attempts: state.attempts,
        lastCorrectAt: correct ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [t.masteryEstimates.userId, t.masteryEstimates.kcId],
        set: {
          level,
          pKnown: state.pKnown,
          attempts: state.attempts,
          updatedAt: new Date(),
          ...(correct ? { lastCorrectAt: new Date() } : {}),
        },
      });

    // repetitionsplan: opdateres altid ved repetition; oprettes når
    // et checkpoint viser, at emnet er lært (Sikker/Mester)
    const [schedule] = await db
      .select()
      .from(t.reviewSchedule)
      .where(
        and(eq(t.reviewSchedule.userId, userId), eq(t.reviewSchedule.kcId, kcId))
      );
    if (context === "review" && schedule) {
      const next = updateReview(
        { intervalDays: schedule.intervalDays, ease: schedule.ease, reps: schedule.reps },
        qualityOf(correct, hintsUsed)
      );
      await db
        .update(t.reviewSchedule)
        .set({
          dueAt: nextDueDate(next),
          intervalDays: next.intervalDays,
          ease: next.ease,
          reps: next.reps,
        })
        .where(
          and(eq(t.reviewSchedule.userId, userId), eq(t.reviewSchedule.kcId, kcId))
        );
    } else if (!schedule && level >= 2) {
      const first = updateReview(INITIAL_REVIEW, qualityOf(correct, hintsUsed));
      await db.insert(t.reviewSchedule).values({
        userId,
        kcId,
        dueAt: nextDueDate(first),
        intervalDays: first.intervalDays,
        ease: first.ease,
        reps: first.reps,
      });
    }

    updates.push({ kcCode: code, level, pKnown: state.pKnown });
  }
  return updates;
}

async function touchSubmission(userId: string, assignmentId: string) {
  await db
    .insert(t.submissions)
    .values({ assignmentId, userId, status: "in_progress" })
    .onConflictDoNothing();
  await db
    .update(t.submissions)
    .set({ status: "in_progress" })
    .where(
      and(
        eq(t.submissions.userId, userId),
        eq(t.submissions.assignmentId, assignmentId),
        eq(t.submissions.status, "not_started")
      )
    );
}

/** Hent ét hint (rendret server-side; niveauet logges ved svar-afgivelse). */
export async function getHint(
  instanceId: string,
  level: number
): Promise<{ level: number; text: string } | null> {
  const [row] = await db
    .select()
    .from(t.exerciseInstances)
    .where(eq(t.exerciseInstances.id, instanceId));
  if (!row) return null;
  const instance = row.rendered as RenderedInstance;
  const hint = instance.hints.find((h) => h.level === level);
  return hint ?? null;
}

/** Checkpoint bestået → markér lektionen som gennemført + aflevér. */
export async function completeCheckpoint(params: {
  userId: string;
  lessonSlug: string;
  passed: boolean;
  correctCount: number;
  totalCount: number;
  assignmentId?: string;
}) {
  const [lesson] = await db
    .select()
    .from(t.lessons)
    .where(eq(t.lessons.slug, params.lessonSlug));
  if (lesson) {
    await db
      .insert(t.progress)
      .values({
        userId: params.userId,
        scopeType: "lesson",
        scopeId: lesson.id,
        percent: params.passed ? 100 : 80,
        state: params.passed ? "completed" : "in_progress",
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [t.progress.userId, t.progress.scopeType, t.progress.scopeId],
        set: {
          percent: params.passed ? 100 : 80,
          state: params.passed ? "completed" : "in_progress",
          updatedAt: new Date(),
        },
      });
  }
  if (params.assignmentId && params.passed) {
    await db
      .update(t.submissions)
      .set({
        status: "submitted",
        score: params.correctCount / params.totalCount,
        completedItems: sql`${t.submissions.completedItems} + 1`,
        submittedAt: new Date(),
      })
      .where(
        and(
          eq(t.submissions.userId, params.userId),
          eq(t.submissions.assignmentId, params.assignmentId)
        )
      );
  }
}

/** Grovkornet lektionsfremdrift, mens eleven arbejder sig gennem blokkene. */
export async function updateLessonProgress(params: {
  userId: string;
  lessonSlug: string;
  percent: number;
}) {
  const [lesson] = await db
    .select()
    .from(t.lessons)
    .where(eq(t.lessons.slug, params.lessonSlug));
  if (!lesson) return;
  const percent = Math.max(0, Math.min(100, Math.round(params.percent)));
  const [existing] = await db
    .select()
    .from(t.progress)
    .where(
      and(
        eq(t.progress.userId, params.userId),
        eq(t.progress.scopeType, "lesson"),
        eq(t.progress.scopeId, lesson.id)
      )
    );
  if (existing?.state === "completed") return; // gå aldrig baglæns
  await db
    .insert(t.progress)
    .values({
      userId: params.userId,
      scopeType: "lesson",
      scopeId: lesson.id,
      percent,
      state: percent >= 100 ? "completed" : "in_progress",
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [t.progress.userId, t.progress.scopeType, t.progress.scopeId],
      set: {
        percent: Math.max(existing?.percent ?? 0, percent),
        state: percent >= 100 ? "completed" : "in_progress",
        updatedAt: new Date(),
      },
    });
}
