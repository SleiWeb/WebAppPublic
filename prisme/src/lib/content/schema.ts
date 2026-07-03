/**
 * Prisme — indholdsmodel (Zod)
 *
 * Implementerer JSON-indholdsformatet fra Prisme/08indholdsmodel.md.
 * Indhold er data, ikke kode: samme skema driver alle fem fag.
 * Delt mellem frontend og backend (validering af seed-indhold og API-payloads).
 */
import { z } from "zod";

export const SubjectId = z.enum([
  "math",
  "physics",
  "chemistry",
  "biology",
  "geography",
]);
export type SubjectId = z.infer<typeof SubjectId>;

/* ---------------------------------------------------------------- *
 * Fælles Mål-links og KC-tags
 * ---------------------------------------------------------------- */

export const CurriculumLink = z.object({
  framework: z.enum(["faelles_maal", "gym_laereplan"]),
  subject: z.string().optional(),
  competenceArea: z.string().optional(),
  goalType: z.enum(["kompetencemaal", "faerdigheds_videns"]).optional(),
  code: z.string(),
  binding: z.boolean().optional(),
});
export type CurriculumLink = z.infer<typeof CurriculumLink>;

/* ---------------------------------------------------------------- *
 * 8.3 Widget-spec — fælles format for widgets og simuleringer
 * ---------------------------------------------------------------- */

export const WidgetParam = z.object({
  min: z.number(),
  max: z.number(),
  default: z.number(),
  step: z.number().optional(),
  unit: z.string().optional(),
  label: z.string().optional(),
  bind: z.string().optional(), // fx "var.a" — bind til genereret variabel
});
export type WidgetParam = z.infer<typeof WidgetParam>;

export const WidgetSpec = z.object({
  widgetType: z.string(), // registreret i widget-registret (fraction-bar, graph-plotter, ...)
  params: z.record(z.string(), WidgetParam).default({}),
  render: z.record(z.string(), z.unknown()).optional(), // widget-specifik (fx expr, domain)
  interactions: z.array(z.string()).default([]),
  readout: z.array(z.string()).default([]),
  emits: z.array(z.string()).default([]),
  prompt: z.string().optional(), // udforsk-spørgsmålet ved widget'en
});
export type WidgetSpec = z.infer<typeof WidgetSpec>;

/* ---------------------------------------------------------------- *
 * 8.2 Lektionsblokke — den fælles byggeklods
 * ---------------------------------------------------------------- */

export const TextBlock = z.object({
  type: z.literal("text"),
  body: z.string(), // markdown + LaTeX ($...$)
  readingLevel: z.enum(["enkel", "standard"]).optional(),
});

export const FigureBlock = z.object({
  type: z.literal("figure"),
  src: z.string().optional(),
  svg: z.string().optional(),
  caption: z.string().optional(),
  alt: z.string(), // WCAG: alt-tekst er obligatorisk
});

export const WidgetBlock = WidgetSpec.extend({
  type: z.literal("widget"),
});

export const SimulationBlock = z.object({
  type: z.literal("simulation"),
  simType: z.string(),
  initialState: z.record(z.string(), z.unknown()),
  controls: z.array(z.string()).default([]),
  rules: z.record(z.string(), z.unknown()).optional(),
  prompt: z.string().optional(),
});

export const WorkedExampleBlock = z.object({
  type: z.literal("workedExample"),
  title: z.string().optional(),
  steps: z.array(z.string()), // markdown + LaTeX pr. trin
  fade: z.boolean().default(false), // fade-princippet (§05.6)
});

export const ExerciseRefBlock = z.object({
  type: z.literal("exerciseRef"),
  templateId: z.string(), // slug-reference til exercise_template
  count: z.number().int().min(1).default(3),
  difficultyRange: z.tuple([z.number(), z.number()]).optional(),
});

export const CheckpointBlock = z.object({
  type: z.literal("checkpoint"),
  templateIds: z.array(z.string()).min(1),
  passRule: z.object({
    correctOf: z.number().int().min(1), // antal opgaver i tjekket
    need: z.number().int().min(1), // antal korrekte for at bestå
  }),
});

export const LessonBlock = z.discriminatedUnion("type", [
  TextBlock,
  FigureBlock,
  WidgetBlock,
  SimulationBlock,
  WorkedExampleBlock,
  ExerciseRefBlock,
  CheckpointBlock,
]);
export type LessonBlock = z.infer<typeof LessonBlock>;

/* ---------------------------------------------------------------- *
 * 8.1 Lektion — topniveau
 * ---------------------------------------------------------------- */

export const LessonContent = z.object({
  id: z.string(), // slug, fx "math-8-broker-faelles-naevner"
  subject: SubjectId,
  course: z.string(),
  module: z.string(),
  title: z.string(),
  estMinutes: z.number().int().optional(),
  learningGoals: z.array(z.string()).default([]),
  curriculumLinks: z.array(CurriculumLink).default([]),
  knowledgeComponents: z.array(z.string()).default([]), // KC-koder
  teacherNotes: z.string().optional(),
  blocks: z.array(LessonBlock).min(1),
});
export type LessonContent = z.infer<typeof LessonContent>;

/* ---------------------------------------------------------------- *
 * 8.4 Opgaveskabelon (exercise_template)
 * variable → prompt → answer → hints → misconceptions → feedback
 * ---------------------------------------------------------------- */

export const VariableDef = z.union([
  z.object({
    type: z.enum(["int", "float"]),
    min: z.number(),
    max: z.number(),
    step: z.number().optional(),
    exclude: z.array(z.number()).optional(), // fx a ≠ 0
    unit: z.string().optional(),
  }),
  z.object({
    expr: z.string(), // afledt variabel, fx "m * a" — sikrer pæne tal
    unit: z.string().optional(),
  }),
  z.object({
    pick: z.array(z.union([z.number(), z.string()])).min(1), // vælg fra liste
  }),
]);
export type VariableDef = z.infer<typeof VariableDef>;

/** Constraints evalueres mod de trukne variable; generatoren re-sampler til alle holder. */
export const VariableConstraint = z.string(); // fx "b != d", "gcd(b,d) == 1"

export const NumericAnswer = z.object({
  validator: z.literal("numeric"),
  value: z.string(), // udtryk i variable, fx "{{a}}" eller "F / m"
  unit: z.string().optional(),
  tolerance: z.number().default(0.001),
  requireUnit: z.boolean().default(false),
});

export const ExpressionAnswer = z.object({
  validator: z.literal("expression"),
  value: z.string(), // kanonisk udtryk m. pladsholdere, fx "{{t}}/{{n}}"
  variables: z.array(z.string()).default([]), // frie variable i svaret, fx ["x"]
  requireSimplified: z.boolean().default(false),
});

export const McqAnswer = z.object({
  validator: z.enum(["mcq", "multi"]),
  options: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(), // m. pladsholdere
        correct: z.boolean().default(false),
        misconception: z.string().optional(), // distraktor-tag
      })
    )
    .min(2),
  shuffle: z.boolean().default(true),
});

export const PointAnswer = z.object({
  validator: z.enum(["point", "graph"]),
  x: z.string(), // udtryk i variable
  y: z.string(),
  tolerance: z.number().default(0.35), // geometrisk tolerance i akse-enheder
});

export const AnswerSpec = z.discriminatedUnion("validator", [
  NumericAnswer,
  ExpressionAnswer,
  McqAnswer,
  PointAnswer,
]);
export type AnswerSpec = z.infer<typeof AnswerSpec>;

export const HintDef = z.object({
  level: z.number().int().min(1), // 1 retningsgivende → 4 worked step
  text: z.string(), // m. pladsholdere
});
export type HintDef = z.infer<typeof HintDef>;

export const DistractorDef = z.object({
  rule: z.string(), // udtryk i variable, fx "(a+c)/(b+d)"
  misconception: z.string(), // misforståelses-kode
});

export const FeedbackRuleDef = z.object({
  condition: z.object({
    matchesMisconception: z.string().optional(),
    correct: z.boolean().optional(),
    missingUnit: z.boolean().optional(),
    closenessBelow: z.number().optional(),
    closenessAbove: z.number().optional(),
  }),
  message: z.string(), // m. pladsholdere
});
export type FeedbackRuleDef = z.infer<typeof FeedbackRuleDef>;
export type DistractorDef = z.infer<typeof DistractorDef>;

export const ExerciseTemplateContent = z.object({
  id: z.string(), // slug, fx "tmpl-broek-add-ulige-naevner"
  subject: SubjectId,
  title: z.string(),
  difficulty: z.number().int().min(1).max(5).default(1),
  knowledgeComponents: z.array(z.string()).min(1),
  curriculumLinks: z.array(CurriculumLink).default([]),
  variables: z.record(z.string(), VariableDef),
  constraints: z.array(VariableConstraint).default([]),
  prompt: z.object({
    text: z.string(), // m. {{pladsholdere}}, markdown + LaTeX
    media: z.union([WidgetSpec, z.null()]).optional(),
    inputWidget: WidgetSpec.optional(), // fx graph-plotter i punkt-vælg-tilstand
  }),
  answer: AnswerSpec,
  hints: z.array(HintDef).default([]),
  distractors: z.array(DistractorDef).default([]),
  feedbackRules: z.array(FeedbackRuleDef).default([]),
  solution: z.object({ steps: z.array(z.string()) }).optional(),
  teacherNotes: z.string().optional(),
});
export type ExerciseTemplateContent = z.infer<typeof ExerciseTemplateContent>;

/* ---------------------------------------------------------------- *
 * 8.6 Misforståelseskatalog
 * ---------------------------------------------------------------- */

export const MisconceptionDef = z.object({
  code: z.string(), // fx "M-BROEK-ADDERER-NAEVNERE"
  subject: SubjectId,
  name: z.string(),
  explanation: z.string(), // den målrettede forklaring eleven ser
  linkedWidget: z.string().optional(),
  remediationLesson: z.string().optional(),
});
export type MisconceptionDef = z.infer<typeof MisconceptionDef>;

/* ---------------------------------------------------------------- *
 * Kursus-/modulstruktur (fagkortet) + KC- og målkataloger
 * ---------------------------------------------------------------- */

export const KnowledgeComponentDef = z.object({
  code: z.string(),
  subject: SubjectId,
  name: z.string(),
  parent: z.string().optional(),
});

export const CurriculumGoalDef = z.object({
  framework: z.enum(["faelles_maal", "gym_laereplan"]),
  subject: SubjectId,
  competenceArea: z.string(),
  goalType: z.enum(["kompetencemaal", "faerdigheds_videns"]),
  code: z.string(),
  text: z.string(),
  gradeSpan: z.string().optional(),
  binding: z.boolean().default(false),
});

export type KnowledgeComponentDef = z.infer<typeof KnowledgeComponentDef>;
export type CurriculumGoalDef = z.infer<typeof CurriculumGoalDef>;

export const CourseDef = z.object({
  id: z.string(), // slug, fx "math-grundskole-8"
  subject: SubjectId,
  title: z.string(),
  stage: z.enum(["grundskole", "gymnasium"]),
  gradeLevel: z.number().int().optional(),
  description: z.string().optional(),
  modules: z.array(
    z.object({
      id: z.string(), // slug
      title: z.string(),
      prereqModules: z.array(z.string()).default([]), // bløde låse
      lessons: z.array(z.string()), // lesson-slugs i rækkefølge
    })
  ),
});
export type CourseDef = z.infer<typeof CourseDef>;
