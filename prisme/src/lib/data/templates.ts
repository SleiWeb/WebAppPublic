import { eq, inArray } from "drizzle-orm";
import { db, tables as t } from "@/db";
import {
  ExerciseTemplateContent,
  AnswerSpec,
  type VariableDef,
} from "@/lib/content/schema";

/**
 * Indhold er data (doc 06 §6.6): skabelonen rekonstrueres fra de
 * normaliserede tabeller (exercise_templates + hints + distractors +
 * feedback_rules) til motorens ExerciseTemplateContent-format.
 */
export type LoadedTemplate = {
  dbId: string;
  content: ExerciseTemplateContent;
};

export async function loadTemplateBySlug(slug: string): Promise<LoadedTemplate> {
  const [row] = await db
    .select()
    .from(t.exerciseTemplates)
    .where(eq(t.exerciseTemplates.slug, slug));
  if (!row) throw new Error(`Ukendt opgaveskabelon: ${slug}`);
  return assembleTemplate(row);
}

export async function loadTemplateByDbId(id: string): Promise<LoadedTemplate> {
  const [row] = await db
    .select()
    .from(t.exerciseTemplates)
    .where(eq(t.exerciseTemplates.id, id));
  if (!row) throw new Error(`Ukendt opgaveskabelon: ${id}`);
  return assembleTemplate(row);
}

type TemplateRow = typeof t.exerciseTemplates.$inferSelect;

async function assembleTemplate(row: TemplateRow): Promise<LoadedTemplate> {
  const [hintRows, distractorRows, feedbackRows, kcRows] = await Promise.all([
    db.select().from(t.hints).where(eq(t.hints.templateId, row.id)),
    db
      .select({
        rule: t.distractors.rule,
        code: t.misconceptions.code,
      })
      .from(t.distractors)
      .innerJoin(
        t.misconceptions,
        eq(t.misconceptions.id, t.distractors.misconceptionId)
      )
      .where(eq(t.distractors.templateId, row.id)),
    db
      .select()
      .from(t.feedbackRules)
      .where(eq(t.feedbackRules.templateId, row.id)),
    db
      .select({ code: t.knowledgeComponents.code })
      .from(t.exerciseKc)
      .innerJoin(
        t.knowledgeComponents,
        eq(t.knowledgeComponents.id, t.exerciseKc.kcId)
      )
      .where(eq(t.exerciseKc.templateId, row.id)),
  ]);

  const variables = row.variables as {
    defs: Record<string, VariableDef>;
    constraints: string[];
  };

  const content = ExerciseTemplateContent.parse({
    id: row.slug ?? row.id,
    subject: row.subjectId,
    title: row.title ?? "",
    difficulty: row.difficulty,
    knowledgeComponents: kcRows.map((k) => k.code),
    variables: variables.defs,
    constraints: variables.constraints ?? [],
    prompt: row.promptTmpl,
    answer: AnswerSpec.parse(row.answerSpec),
    hints: hintRows
      .sort((a, b) => a.level - b.level)
      .map((h) => ({ level: h.level, text: (h.bodyTmpl as { text: string }).text })),
    distractors: distractorRows.map((d) => ({
      rule: (d.rule as { expr: string }).expr,
      misconception: d.code,
    })),
    feedbackRules: feedbackRows.map((f) => ({
      condition: f.condition,
      message: (f.message as { text: string }).text,
    })),
    solution: row.solutionTmpl ?? undefined,
  });

  return { dbId: row.id, content };
}

export async function misconceptionByCode(code: string) {
  const [row] = await db
    .select()
    .from(t.misconceptions)
    .where(eq(t.misconceptions.code, code));
  return row ?? null;
}

export async function kcIdsByCodes(codes: string[]) {
  if (codes.length === 0) return new Map<string, string>();
  const rows = await db
    .select({ id: t.knowledgeComponents.id, code: t.knowledgeComponents.code })
    .from(t.knowledgeComponents)
    .where(inArray(t.knowledgeComponents.code, codes));
  return new Map(rows.map((r) => [r.code, r.id]));
}
