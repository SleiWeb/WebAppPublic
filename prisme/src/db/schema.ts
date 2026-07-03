/**
 * Prisme — databaseskema (Drizzle ORM / PostgreSQL)
 *
 * Implementerer skemaet fra Prisme/07datamodel.md:
 * relationelt for identitet/roller/roster/afleveringer, JSONB for indhold
 * og forsøgs-payloads. Alle elevrelaterede tabeller er underlagt
 * dataminimering, adgangslogning (audit_log) og sletteregler.
 */
import {
  pgTable,
  uuid,
  text,
  integer,
  real,
  boolean,
  timestamp,
  jsonb,
  bigint,
  bigserial,
  date,
  primaryKey,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/* ---------------------------------------------------------------- *
 * 7.2 Identitet, roller, roster
 * ---------------------------------------------------------------- */

export const schools = pgTable("schools", {
  id: uuid("id").primaryKey().defaultRandom(),
  stilInstId: text("stil_inst_id").unique(), // institutionsnr fra STIL
  name: text("name").notNull(),
  municipality: text("municipality"),
  type: text("type"), // folkeskole | gymnasium | privat
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  uniloginId: text("unilogin_id").unique(), // elever
  mitidSub: text("mitid_sub").unique(), // lærere/forældre
  externalIdp: text("external_idp"), // lokal IdP-ref
  email: text("email").unique(), // egne konti (B2C/gym)
  displayName: text("display_name").notNull(),
  birthYear: integer("birth_year"), // dataminimering: kun år
  locale: text("locale").notNull().default("da"),
  a11yPrefs: jsonb("a11y_prefs").notNull().default(sql`'{}'::jsonb`), // TTS, kontrast, enkelt sprog
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
});

export const roles = pgTable("roles", {
  id: text("id").primaryKey(), // student | teacher | school_admin | author | super_admin
  name: text("name").notNull(),
});

export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id),
    schoolId: uuid("school_id").references(() => schools.id),
  },
  (t) => [unique().on(t.userId, t.roleId, t.schoolId)]
);

export const subjects = pgTable("subjects", {
  id: text("id").primaryKey(), // 'math','physics','chemistry','biology','geography'
  name: text("name").notNull(),
  color: text("color").notNull(),
  icon: text("icon"),
});

export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  stilGroupId: text("stil_group_id").unique(), // gruppe fra STIL roster
  name: text("name").notNull(), // fx "8.B Matematik"
  gradeLevel: integer("grade_level"), // 5..10, gym 10..12
  subjectId: text("subject_id").references(() => subjects.id),
  schoolYear: text("school_year"), // fx "2026/2027"
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const classMemberships = pgTable(
  "class_memberships",
  {
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleInClass: text("role_in_class").notNull(), // student | teacher | co_teacher
    levelOffset: integer("level_offset").notNull().default(0), // differentiering pr. elev
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.classId, t.userId] })]
);

/* ---------------------------------------------------------------- *
 * 7.3 Fag, kurser, indholdshierarki
 * ---------------------------------------------------------------- */

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  subjectId: text("subject_id")
    .notNull()
    .references(() => subjects.id),
  title: text("title").notNull(),
  stage: text("stage").notNull(), // 'grundskole' | 'gymnasium'
  gradeLevel: integer("grade_level"),
  gymLevel: text("gym_level"), // 'C'|'B'|'A'
  description: text("description"),
  published: boolean("published").notNull().default(false),
  position: integer("position"),
});

export const modules = pgTable("modules", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  position: integer("position").notNull(),
  prereqModuleIds: uuid("prereq_module_ids").array().default(sql`'{}'::uuid[]`), // bløde låse
});

export const lessons = pgTable(
  "lessons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    learningGoals: jsonb("learning_goals").notNull().default(sql`'[]'::jsonb`),
    position: integer("position").notNull(),
    estMinutes: integer("est_minutes"),
    version: integer("version").notNull().default(1),
    status: text("status").notNull().default("draft"), // draft | review | published
  },
  (t) => [unique().on(t.moduleId, t.slug)]
);

export const lessonBlocks = pgTable("lesson_blocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  blockType: text("block_type").notNull(), // text|figure|widget|simulation|worked_example|checkpoint|exercise_ref
  payload: jsonb("payload").notNull(), // indholdsspecifik (doc 08)
});

/* ---------------------------------------------------------------- *
 * 7.4 Fælles Mål & knowledge components
 * ---------------------------------------------------------------- */

export const curriculumGoals = pgTable("curriculum_goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  framework: text("framework").notNull(), // 'faelles_maal' | 'gym_laereplan'
  subjectId: text("subject_id").references(() => subjects.id),
  competenceArea: text("competence_area"), // fx 'tal_og_algebra'
  goalType: text("goal_type"), // 'kompetencemaal' | 'faerdigheds_videns'
  code: text("code"),
  text: text("text").notNull(),
  gradeSpan: text("grade_span"), // fx 'efter_9'
  binding: boolean("binding").notNull().default(false),
});

export const knowledgeComponents = pgTable("knowledge_components", {
  id: uuid("id").primaryKey().defaultRandom(),
  subjectId: text("subject_id")
    .notNull()
    .references(() => subjects.id),
  code: text("code").unique().notNull(), // fx 'MATH.BROEK.ADD.ULIGE_NAEVNER'
  name: text("name").notNull(),
  parentId: uuid("parent_id"),
});

export const lessonKc = pgTable(
  "lesson_kc",
  {
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    kcId: uuid("kc_id")
      .notNull()
      .references(() => knowledgeComponents.id),
  },
  (t) => [primaryKey({ columns: [t.lessonId, t.kcId] })]
);

export const contentCurriculumLinks = pgTable(
  "content_curriculum_links",
  {
    contentType: text("content_type").notNull(), // 'lesson' | 'exercise_template' | 'module'
    contentId: uuid("content_id").notNull(),
    goalId: uuid("goal_id")
      .notNull()
      .references(() => curriculumGoals.id),
  },
  (t) => [primaryKey({ columns: [t.contentType, t.contentId, t.goalId] })]
);

/* ---------------------------------------------------------------- *
 * 7.5 Opgaver, forsøg, hints, feedback
 * ---------------------------------------------------------------- */

export const exerciseTemplates = pgTable("exercise_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  subjectId: text("subject_id")
    .notNull()
    .references(() => subjects.id),
  slug: text("slug").unique(), // stabil reference fra indholds-JSON
  title: text("title"),
  difficulty: integer("difficulty").notNull().default(1), // 1..5
  variables: jsonb("variables").notNull(), // variabeldefinition + constraints
  promptTmpl: jsonb("prompt_tmpl").notNull(), // opgavetekst m. pladsholdere
  answerSpec: jsonb("answer_spec").notNull(), // validator-type + parametre
  solutionTmpl: jsonb("solution_tmpl"), // worked-example-skabelon
  version: integer("version").notNull().default(1),
  status: text("status").notNull().default("draft"),
});

export const exerciseKc = pgTable(
  "exercise_kc",
  {
    templateId: uuid("template_id")
      .notNull()
      .references(() => exerciseTemplates.id, { onDelete: "cascade" }),
    kcId: uuid("kc_id")
      .notNull()
      .references(() => knowledgeComponents.id),
    weight: real("weight").notNull().default(1),
  },
  (t) => [primaryKey({ columns: [t.templateId, t.kcId] })]
);

export const misconceptions = pgTable("misconceptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").unique().notNull(), // fx 'M-BROEK-ADDERER-NAEVNERE'
  subjectId: text("subject_id").references(() => subjects.id),
  name: text("name").notNull(),
  explanation: text("explanation"), // målrettet forklaring til eleven
});

export const distractors = pgTable("distractors", {
  id: uuid("id").primaryKey().defaultRandom(),
  templateId: uuid("template_id")
    .notNull()
    .references(() => exerciseTemplates.id, { onDelete: "cascade" }),
  rule: jsonb("rule").notNull(), // hvordan distraktoren dannes af variable
  misconceptionId: uuid("misconception_id").references(() => misconceptions.id),
});

export const hints = pgTable("hints", {
  id: uuid("id").primaryKey().defaultRandom(),
  templateId: uuid("template_id")
    .notNull()
    .references(() => exerciseTemplates.id, { onDelete: "cascade" }),
  level: integer("level").notNull(), // 1..n (retningsgivende → worked step)
  bodyTmpl: jsonb("body_tmpl").notNull(),
});

export const feedbackRules = pgTable("feedback_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  templateId: uuid("template_id")
    .notNull()
    .references(() => exerciseTemplates.id, { onDelete: "cascade" }),
  condition: jsonb("condition").notNull(), // fx {matchesMisconception:'M-...'}
  message: jsonb("message").notNull(),
});

export const exerciseInstances = pgTable("exercise_instances", {
  id: uuid("id").primaryKey().defaultRandom(),
  templateId: uuid("template_id")
    .notNull()
    .references(() => exerciseTemplates.id),
  seed: bigint("seed", { mode: "number" }).notNull(),
  rendered: jsonb("rendered").notNull(), // konkrete tal + facit + accepterede svar
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const attempts = pgTable(
  "attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    instanceId: uuid("instance_id")
      .notNull()
      .references(() => exerciseInstances.id),
    assignmentId: uuid("assignment_id").references(() => assignments.id),
    submittedAnswer: jsonb("submitted_answer"),
    isCorrect: boolean("is_correct"),
    closeness: real("closeness"), // 0..1
    misconceptionId: uuid("misconception_id").references(() => misconceptions.id),
    hintsUsed: integer("hints_used").notNull().default(0),
    durationMs: integer("duration_ms"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("attempts_user_created_idx").on(t.userId, t.createdAt)]
);

export const attemptEvents = pgTable("attempt_events", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  attemptId: uuid("attempt_id")
    .notNull()
    .references(() => attempts.id, { onDelete: "cascade" }),
  ts: timestamp("ts", { withTimezone: true }).notNull().defaultNow(),
  eventType: text("event_type").notNull(), // input | drag | slider | submit | hint | ...
  payload: jsonb("payload"),
});

export const hintViews = pgTable("hint_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  attemptId: uuid("attempt_id")
    .notNull()
    .references(() => attempts.id, { onDelete: "cascade" }),
  hintId: uuid("hint_id").references(() => hints.id),
  level: integer("level"),
  viewedAt: timestamp("viewed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const feedbackGiven = pgTable("feedback_given", {
  id: uuid("id").primaryKey().defaultRandom(),
  attemptId: uuid("attempt_id")
    .notNull()
    .references(() => attempts.id, { onDelete: "cascade" }),
  ruleId: uuid("rule_id").references(() => feedbackRules.id),
  message: jsonb("message"),
});

/* ---------------------------------------------------------------- *
 * 7.6 Afleveringer
 * ---------------------------------------------------------------- */

export const assignments = pgTable("assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  classId: uuid("class_id")
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  mode: text("mode").notNull().default("homework"), // homework | in_class | practice | review
  dueAt: timestamp("due_at", { withTimezone: true }),
  masteryGoal: integer("mastery_goal"), // 0..3
  settings: jsonb("settings").notNull().default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const assignmentItems = pgTable("assignment_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id")
    .notNull()
    .references(() => assignments.id, { onDelete: "cascade" }),
  itemType: text("item_type").notNull(), // lesson | template | module | review_set
  refId: uuid("ref_id").notNull(),
  position: integer("position").notNull(),
  targetCount: integer("target_count"),
});

export const assignmentTargets = pgTable(
  "assignment_targets",
  {
    assignmentId: uuid("assignment_id")
      .notNull()
      .references(() => assignments.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id), // NULL => hele holdet
    groupTag: text("group_tag"),
    levelOffset: integer("level_offset").notNull().default(0),
  },
  (t) => [unique().on(t.assignmentId, t.userId)]
);

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assignmentId: uuid("assignment_id")
      .notNull()
      .references(() => assignments.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("not_started"), // not_started|in_progress|submitted|graded
    score: real("score"),
    masteryReached: integer("mastery_reached"),
    completedItems: integer("completed_items").notNull().default(0),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    teacherNote: text("teacher_note"),
  },
  (t) => [
    unique().on(t.assignmentId, t.userId),
    index("submissions_assignment_idx").on(t.assignmentId),
  ]
);

/* ---------------------------------------------------------------- *
 * 7.7 Fremskridt, mestring, repetition
 * ---------------------------------------------------------------- */

export const masteryEstimates = pgTable(
  "mastery_estimates",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kcId: uuid("kc_id")
      .notNull()
      .references(() => knowledgeComponents.id),
    level: integer("level").notNull().default(0), // 0 Ny · 1 Øvet · 2 Sikker · 3 Mester
    pKnown: real("p_known").notNull().default(0), // BKT/Elo-normaliseret 0..1
    elo: real("elo"),
    attempts: integer("attempts").notNull().default(0),
    lastCorrectAt: timestamp("last_correct_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.kcId] }),
    index("mastery_user_idx").on(t.userId),
  ]
);

export const progress = pgTable(
  "progress",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    scopeType: text("scope_type").notNull(), // lesson | module | course
    scopeId: uuid("scope_id").notNull(),
    percent: real("percent").notNull().default(0),
    state: text("state").notNull().default("not_started"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.scopeType, t.scopeId] })]
);

export const reviewSchedule = pgTable(
  "review_schedule",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kcId: uuid("kc_id")
      .notNull()
      .references(() => knowledgeComponents.id),
    dueAt: timestamp("due_at", { withTimezone: true }).notNull(),
    intervalDays: real("interval_days").notNull().default(1),
    ease: real("ease").notNull().default(2.5),
    reps: integer("reps").notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.kcId] }),
    index("review_user_due_idx").on(t.userId, t.dueAt),
  ]
);

/* ---------------------------------------------------------------- *
 * 7.8 Analyse, revision, samtykke, licenser (stubs — til stede,
 * udfyldes af baggrundsjobs i senere faser)
 * ---------------------------------------------------------------- */

export const analyticsRollups = pgTable("analytics_rollups", {
  id: uuid("id").primaryKey().defaultRandom(),
  scopeType: text("scope_type").notNull(), // class | school | goal
  scopeId: uuid("scope_id").notNull(),
  metric: text("metric").notNull(), // mastery_dist | misconception_freq | activity | goal_coverage
  window: text("window").notNull(), // day | week | term
  data: jsonb("data").notNull(),
  computedAt: timestamp("computed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLog = pgTable("audit_log", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  actorId: uuid("actor_id").references(() => users.id),
  action: text("action").notNull(), // view_student_data | export | change_role | ...
  subjectUserId: uuid("subject_user_id"),
  context: jsonb("context"),
  ts: timestamp("ts", { withTimezone: true }).notNull().defaultNow(),
});

export const consents = pgTable("consents", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").references(() => schools.id),
  dpaVersion: text("dpa_version"),
  signedBy: text("signed_by"),
  signedAt: timestamp("signed_at", { withTimezone: true }),
  retentionPolicy: jsonb("retention_policy"),
});

export const licenses = pgTable("licenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").references(() => schools.id),
  plan: text("plan").notNull(), // trial | class | school | municipality
  subjects: text("subjects").array().notNull(),
  seats: integer("seats"),
  validFrom: date("valid_from"),
  validTo: date("valid_to"),
});
