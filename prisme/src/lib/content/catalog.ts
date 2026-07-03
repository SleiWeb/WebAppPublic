/**
 * Indholdskatalog: læser og Zod-validerer alt seed-indhold fra /content.
 * Bruges af seed-scriptet og af CI-"self-test" (generér N instanser pr.
 * skabelon og tjek at facit/validator er konsistente — doc 08 §8.7).
 */
import { z } from "zod";
import {
  LessonContent,
  ExerciseTemplateContent,
  MisconceptionDef,
  KnowledgeComponentDef,
  CurriculumGoalDef,
  CourseDef,
} from "./schema";

import kcsJson from "../../../content/knowledge-components.json";
import goalsJson from "../../../content/curriculum-goals.json";
import misconceptionsJson from "../../../content/misconceptions.json";
import coursesJson from "../../../content/courses.json";
import lessonBroeker from "../../../content/lessons/math-broeker-faelles-naevner.json";
import lessonLigninger from "../../../content/lessons/math-ligninger.json";
import lessonFunktioner from "../../../content/lessons/math-lineaere-funktioner.json";
import templatesBroeker from "../../../content/templates/broeker.json";
import templatesLigninger from "../../../content/templates/ligninger.json";
import templatesFunktioner from "../../../content/templates/lineaere-funktioner.json";

export const knowledgeComponents = z
  .array(KnowledgeComponentDef)
  .parse(kcsJson);

export const curriculumGoals = z.array(CurriculumGoalDef).parse(goalsJson);

export const misconceptionCatalog = z
  .array(MisconceptionDef)
  .parse(misconceptionsJson);

export const courses = z.array(CourseDef).parse(coursesJson);

export const lessonCatalog: LessonContent[] = [
  lessonBroeker,
  lessonLigninger,
  lessonFunktioner,
].map((l) => LessonContent.parse(l));

export const templateCatalog: ExerciseTemplateContent[] = [
  ...templatesBroeker,
  ...templatesLigninger,
  ...templatesFunktioner,
].map((t) => ExerciseTemplateContent.parse(t));

export function getTemplate(slug: string): ExerciseTemplateContent {
  const t = templateCatalog.find((t) => t.id === slug);
  if (!t) throw new Error(`Ukendt opgaveskabelon: ${slug}`);
  return t;
}

/** Krydstjek af referencer i indholdet (kaldes i tests og seed). */
export function verifyCatalogIntegrity(): string[] {
  const errors: string[] = [];
  const kcCodes = new Set(knowledgeComponents.map((k) => k.code));
  const goalCodes = new Set(curriculumGoals.map((g) => g.code));
  const misconceptionCodes = new Set(misconceptionCatalog.map((m) => m.code));
  const templateIds = new Set(templateCatalog.map((t) => t.id));
  const lessonIds = new Set(lessonCatalog.map((l) => l.id));

  for (const t of templateCatalog) {
    for (const kc of t.knowledgeComponents)
      if (!kcCodes.has(kc)) errors.push(`${t.id}: ukendt KC ${kc}`);
    for (const cl of t.curriculumLinks)
      if (!goalCodes.has(cl.code)) errors.push(`${t.id}: ukendt mål ${cl.code}`);
    for (const d of t.distractors)
      if (!misconceptionCodes.has(d.misconception))
        errors.push(`${t.id}: ukendt misforståelse ${d.misconception}`);
    if (t.answer.validator === "mcq" || t.answer.validator === "multi") {
      for (const o of t.answer.options)
        if (o.misconception && !misconceptionCodes.has(o.misconception))
          errors.push(`${t.id}: ukendt misforståelse ${o.misconception}`);
      if (!t.answer.options.some((o) => o.correct))
        errors.push(`${t.id}: mcq uden korrekt svarmulighed`);
    }
  }
  for (const l of lessonCatalog) {
    for (const kc of l.knowledgeComponents)
      if (!kcCodes.has(kc)) errors.push(`${l.id}: ukendt KC ${kc}`);
    for (const cl of l.curriculumLinks)
      if (!goalCodes.has(cl.code)) errors.push(`${l.id}: ukendt mål ${cl.code}`);
    for (const b of l.blocks) {
      if (b.type === "exerciseRef" && !templateIds.has(b.templateId))
        errors.push(`${l.id}: ukendt skabelon ${b.templateId}`);
      if (b.type === "checkpoint")
        for (const id of b.templateIds)
          if (!templateIds.has(id)) errors.push(`${l.id}: ukendt skabelon ${id}`);
    }
  }
  for (const c of courses)
    for (const m of c.modules)
      for (const ls of m.lessons)
        if (!lessonIds.has(ls)) errors.push(`${c.id}/${m.id}: ukendt lektion ${ls}`);
  return errors;
}
