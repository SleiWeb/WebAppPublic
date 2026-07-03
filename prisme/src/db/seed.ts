/**
 * Seed: demo-skole, 8.B Matematik, alt indhold fra /content — plus 14 dages
 * simuleret elevaktivitet genereret gennem den RIGTIGE opgavemotor
 * (generator + validatorer), så lærer-dashboardets fejlmønstre og
 * mestringsfordelinger er ægte data, ikke attrap.
 *
 * Kør: npm run db:seed
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db, tables as t } from "./index";
import {
  courses as courseCatalog,
  curriculumGoals as goalCatalog,
  knowledgeComponents as kcCatalog,
  lessonCatalog,
  misconceptionCatalog,
  templateCatalog,
  getTemplate,
  verifyCatalogIntegrity,
} from "@/lib/content/catalog";
import { generateInstance } from "@/lib/engine/generate";
import { validateAnswer } from "@/lib/engine/validate";
import { hashString, mulberry32, seedFor, type Rng } from "@/lib/engine/prng";
import type { RenderedInstance, SubmittedAnswer } from "@/lib/engine/types";
import {
  levelFromEstimate,
  updateMastery,
  type MasteryState,
} from "@/lib/mastery/model";
import { INITIAL_REVIEW, qualityOf, updateReview } from "@/lib/review/sm2";

const DAY = 24 * 60 * 60 * 1000;

const SUBJECTS = [
  { id: "math", name: "Matematik", color: "#2563eb", icon: "graf" },
  { id: "physics", name: "Fysik", color: "#7c3aed", icon: "pendul" },
  { id: "chemistry", name: "Kemi", color: "#16a34a", icon: "molekyle" },
  { id: "biology", name: "Biologi", color: "#ea580c", icon: "celle" },
  { id: "geography", name: "Geografi", color: "#ca8a04", icon: "klode" },
];

const STUDENT_NAMES = [
  "Freja Andersen", "Mikkel Jensen", "Alma Nielsen", "Noah Hansen",
  "Ida Pedersen", "Oscar Christensen", "Emma Larsen", "William Sørensen",
  "Sofia Rasmussen", "Elias Jørgensen", "Clara Madsen", "Malthe Kristensen",
  "Laura Olsen", "Victor Thomsen", "Josefine Poulsen", "August Johansen",
  "Karla Møller", "Emil Mortensen", "Agnes Bruun", "Storm Vestergaard",
];

async function main() {
  const integrityErrors = verifyCatalogIntegrity();
  if (integrityErrors.length > 0) {
    console.error("Indholdskataloget er inkonsistent:", integrityErrors);
    process.exit(1);
  }

  console.log("Rydder eksisterende data …");
  await db.execute(sql`
    TRUNCATE TABLE
      attempt_events, hint_views, feedback_given, attempts, exercise_instances,
      submissions, assignment_targets, assignment_items, assignments,
      review_schedule, mastery_estimates, progress,
      feedback_rules, hints, distractors, exercise_kc, exercise_templates,
      misconceptions, content_curriculum_links, lesson_kc, lesson_blocks,
      lessons, modules, courses, curriculum_goals, knowledge_components,
      class_memberships, classes, user_roles, users, roles, subjects, schools,
      analytics_rollups, audit_log, consents, licenses
    CASCADE
  `);

  /* ------------------------------------------------ roller, fag, skole */
  await db.insert(t.roles).values([
    { id: "student", name: "Elev" },
    { id: "teacher", name: "Lærer" },
    { id: "school_admin", name: "Skoleadmin" },
    { id: "author", name: "Forfatter" },
    { id: "super_admin", name: "Superadmin" },
  ]);
  await db.insert(t.subjects).values(SUBJECTS);

  const [school] = await db
    .insert(t.schools)
    .values({
      name: "Prisme Demoskole",
      municipality: "København",
      type: "folkeskole",
    })
    .returning();

  /* ------------------------------------------------ brugere og hold */
  const [teacher] = await db
    .insert(t.users)
    .values({
      displayName: "Jonas Holm",
      email: "laerer@demo.prisme.dk",
      locale: "da",
    })
    .returning();
  await db.insert(t.userRoles).values({
    userId: teacher.id,
    roleId: "teacher",
    schoolId: school.id,
  });

  const students = await db
    .insert(t.users)
    .values(
      STUDENT_NAMES.map((name, i) => ({
        displayName: name,
        uniloginId: `demo-elev-${i + 1}`,
        birthYear: 2012,
        locale: "da",
      }))
    )
    .returning();
  await db.insert(t.userRoles).values(
    students.map((s) => ({
      userId: s.id,
      roleId: "student",
      schoolId: school.id,
    }))
  );

  const [klass] = await db
    .insert(t.classes)
    .values({
      schoolId: school.id,
      name: "8.B Matematik",
      gradeLevel: 8,
      subjectId: "math",
      schoolYear: "2025/2026",
    })
    .returning();
  await db.insert(t.classMemberships).values([
    { classId: klass.id, userId: teacher.id, roleInClass: "teacher" },
    ...students.map((s) => ({
      classId: klass.id,
      userId: s.id,
      roleInClass: "student" as const,
    })),
  ]);

  /* ------------------------------------------------ vidensstruktur */
  const kcIdByCode = new Map<string, string>();
  for (const kc of kcCatalog) {
    const [row] = await db
      .insert(t.knowledgeComponents)
      .values({
        subjectId: kc.subject,
        code: kc.code,
        name: kc.name,
        parentId: kc.parent ? kcIdByCode.get(kc.parent) : undefined,
      })
      .returning();
    kcIdByCode.set(kc.code, row.id);
  }

  const goalIdByCode = new Map<string, string>();
  for (const g of goalCatalog) {
    const [row] = await db
      .insert(t.curriculumGoals)
      .values({
        framework: g.framework,
        subjectId: g.subject,
        competenceArea: g.competenceArea,
        goalType: g.goalType,
        code: g.code,
        text: g.text,
        gradeSpan: g.gradeSpan,
        binding: g.binding,
      })
      .returning();
    goalIdByCode.set(g.code, row.id);
  }

  const misconceptionIdByCode = new Map<string, string>();
  for (const m of misconceptionCatalog) {
    const [row] = await db
      .insert(t.misconceptions)
      .values({
        code: m.code,
        subjectId: m.subject,
        name: m.name,
        explanation: m.explanation,
      })
      .returning();
    misconceptionIdByCode.set(m.code, row.id);
  }

  /* ------------------------------------------------ opgaveskabeloner */
  const templateIdBySlug = new Map<string, string>();
  for (const tmpl of templateCatalog) {
    const [row] = await db
      .insert(t.exerciseTemplates)
      .values({
        subjectId: tmpl.subject,
        slug: tmpl.id,
        title: tmpl.title,
        difficulty: tmpl.difficulty,
        variables: { defs: tmpl.variables, constraints: tmpl.constraints },
        promptTmpl: tmpl.prompt,
        answerSpec: tmpl.answer,
        solutionTmpl: tmpl.solution ?? null,
        status: "published",
      })
      .returning();
    templateIdBySlug.set(tmpl.id, row.id);

    for (const kc of tmpl.knowledgeComponents)
      await db.insert(t.exerciseKc).values({
        templateId: row.id,
        kcId: kcIdByCode.get(kc)!,
      });
    for (const link of tmpl.curriculumLinks)
      await db.insert(t.contentCurriculumLinks).values({
        contentType: "exercise_template",
        contentId: row.id,
        goalId: goalIdByCode.get(link.code)!,
      });
    if (tmpl.hints.length)
      await db.insert(t.hints).values(
        tmpl.hints.map((h) => ({
          templateId: row.id,
          level: h.level,
          bodyTmpl: { text: h.text },
        }))
      );
    if (tmpl.distractors.length)
      await db.insert(t.distractors).values(
        tmpl.distractors.map((d) => ({
          templateId: row.id,
          rule: { expr: d.rule },
          misconceptionId: misconceptionIdByCode.get(d.misconception)!,
        }))
      );
    if (tmpl.feedbackRules.length)
      await db.insert(t.feedbackRules).values(
        tmpl.feedbackRules.map((r) => ({
          templateId: row.id,
          condition: r.condition,
          message: { text: r.message },
        }))
      );
  }

  /* ------------------------------------------------ kurser og lektioner */
  const lessonIdBySlug = new Map<string, string>();
  for (const course of courseCatalog) {
    const [courseRow] = await db
      .insert(t.courses)
      .values({
        subjectId: course.subject,
        title: course.title,
        stage: course.stage,
        gradeLevel: course.gradeLevel,
        description: course.description,
        published: true,
        position: 1,
      })
      .returning();

    const moduleIdBySlug = new Map<string, string>();
    for (const [mi, mod] of course.modules.entries()) {
      const [moduleRow] = await db
        .insert(t.modules)
        .values({
          courseId: courseRow.id,
          title: mod.title,
          position: mi + 1,
          prereqModuleIds: mod.prereqModules
            .map((p) => moduleIdBySlug.get(p)!)
            .filter(Boolean),
        })
        .returning();
      moduleIdBySlug.set(mod.id, moduleRow.id);

      for (const [li, lessonSlug] of mod.lessons.entries()) {
        const lesson = lessonCatalog.find((l) => l.id === lessonSlug)!;
        const [lessonRow] = await db
          .insert(t.lessons)
          .values({
            moduleId: moduleRow.id,
            slug: lesson.id,
            title: lesson.title,
            learningGoals: lesson.learningGoals,
            position: li + 1,
            estMinutes: lesson.estMinutes,
            status: "published",
          })
          .returning();
        lessonIdBySlug.set(lesson.id, lessonRow.id);

        await db.insert(t.lessonBlocks).values(
          lesson.blocks.map((block, bi) => ({
            lessonId: lessonRow.id,
            position: bi + 1,
            blockType: block.type,
            payload: block,
          }))
        );
        for (const kc of lesson.knowledgeComponents)
          await db.insert(t.lessonKc).values({
            lessonId: lessonRow.id,
            kcId: kcIdByCode.get(kc)!,
          });
        for (const link of lesson.curriculumLinks)
          await db.insert(t.contentCurriculumLinks).values({
            contentType: "lesson",
            contentId: lessonRow.id,
            goalId: goalIdByCode.get(link.code)!,
          });
      }
    }
  }

  /* ------------------------------------------------ tildelinger */
  const now = new Date();
  const friday = new Date(now.getTime() + ((5 - now.getDay() + 7) % 7 || 7) * DAY);
  friday.setHours(15, 0, 0, 0);
  const nextMonday = new Date(now.getTime() + ((1 - now.getDay() + 7) % 7 || 7) * DAY);
  nextMonday.setHours(8, 0, 0, 0);

  const [assignmentLigninger] = await db
    .insert(t.assignments)
    .values({
      classId: klass.id,
      createdBy: teacher.id,
      title: "Ligninger: Balanceprincippet",
      mode: "homework",
      dueAt: friday,
      masteryGoal: 2,
      settings: { hintsAllowed: true },
    })
    .returning();
  await db.insert(t.assignmentItems).values({
    assignmentId: assignmentLigninger.id,
    itemType: "lesson",
    refId: lessonIdBySlug.get("math-ligninger")!,
    position: 1,
  });
  await db
    .insert(t.assignmentTargets)
    .values({ assignmentId: assignmentLigninger.id, userId: null });

  const [assignmentBroeker] = await db
    .insert(t.assignments)
    .values({
      classId: klass.id,
      createdBy: teacher.id,
      title: "Brøker: Repetition af fælles nævner",
      mode: "review",
      dueAt: nextMonday,
      masteryGoal: 2,
      settings: { hintsAllowed: true, targetCount: 6 },
    })
    .returning();
  await db.insert(t.assignmentItems).values({
    assignmentId: assignmentBroeker.id,
    itemType: "template",
    refId: templateIdBySlug.get("tmpl-broek-add-ulige-naevner")!,
    position: 1,
    targetCount: 6,
  });
  await db
    .insert(t.assignmentTargets)
    .values({ assignmentId: assignmentBroeker.id, userId: null });

  /* ------------------------------------------------ simuleret aktivitet */
  console.log("Simulerer 14 dages elevaktivitet gennem opgavemotoren …");

  const mastery = new Map<string, MasteryState>(); // `${userId}|${kcCode}`
  const attemptCounter = new Map<string, number>(); // `${userId}|${tmplSlug}`

  type SimAttempt = {
    userId: string;
    templateSlug: string;
    daysAgo: number;
    assignmentId?: string;
    forceWrongMisconception?: string;
  };

  async function simulateAttempt(sim: SimAttempt, rng: Rng, ability: number) {
    const template = getTemplate(sim.templateSlug);
    const key = `${sim.userId}|${sim.templateSlug}`;
    const attemptNo = (attemptCounter.get(key) ?? 0) + 1;
    attemptCounter.set(key, attemptNo);

    const seed = seedFor(sim.userId, sim.templateSlug, attemptNo);
    const instance = generateInstance(template, seed);

    const answersCorrectly =
      !sim.forceWrongMisconception && rng() < ability + 0.12;
    const hintsUsed = answersCorrectly
      ? rng() < ability ? 0 : Math.floor(rng() * 2)
      : Math.floor(rng() * 3);

    const submitted = buildSimulatedAnswer(
      instance,
      answersCorrectly,
      sim.forceWrongMisconception,
      rng
    );
    const result = validateAnswer(instance, submitted);

    const createdAt = new Date(
      now.getTime() - sim.daysAgo * DAY - Math.floor(rng() * 6) * 60 * 60 * 1000
    );

    const [instanceRow] = await db
      .insert(t.exerciseInstances)
      .values({
        templateId: templateIdBySlug.get(sim.templateSlug)!,
        seed,
        rendered: instance,
        createdAt,
      })
      .returning();

    const [attemptRow] = await db
      .insert(t.attempts)
      .values({
        userId: sim.userId,
        instanceId: instanceRow.id,
        assignmentId: sim.assignmentId,
        submittedAnswer: submitted,
        isCorrect: result.correct,
        closeness: result.closeness,
        misconceptionId: result.misconceptionCode
          ? misconceptionIdByCode.get(result.misconceptionCode)
          : undefined,
        hintsUsed,
        durationMs: 20_000 + Math.floor(rng() * 100_000),
        createdAt,
      })
      .returning();

    if (hintsUsed > 0) {
      await db.insert(t.hintViews).values(
        Array.from({ length: hintsUsed }, (_, i) => ({
          attemptId: attemptRow.id,
          level: i + 1,
          viewedAt: createdAt,
        }))
      );
    }

    for (const kcCode of template.knowledgeComponents) {
      const mKey = `${sim.userId}|${kcCode}`;
      const state = mastery.get(mKey) ?? { pKnown: 0.12, attempts: 0 };
      mastery.set(
        mKey,
        updateMastery(state, { correct: result.correct, hintsUsed })
      );
    }
    return result;
  }

  const abilities = new Map<string, number>();
  students.forEach((s, i) => {
    const r = mulberry32(hashString(`ability:${i}`))();
    abilities.set(s.id, 0.3 + r * 0.62);
  });
  // Freja er mønsterelev med streak; Mikkel har ikke åbnet afleveringerne
  abilities.set(students[0].id, 0.9);
  abilities.set(students[1].id, 0.38);

  const stuckStudents = new Set(
    students.filter((s) => (abilities.get(s.id) ?? 1) < 0.48).map((s) => s.id)
  );

  const broekTemplates = [
    "tmpl-broek-find-faelles-naevner",
    "tmpl-broek-forlaeng",
    "tmpl-broek-add-ulige-naevner",
  ];
  const lignTemplates = [
    "tmpl-lign-naeste-skridt",
    "tmpl-lign-loes-x",
    "tmpl-lign-reducer",
  ];
  const funkTemplates = ["tmpl-lin-beregn-y", "tmpl-lin-aflaes-b", "tmpl-lin-haeldning"];

  for (const [si, student] of students.entries()) {
    const rng = mulberry32(hashString(`sim:${si}`));
    const ability = abilities.get(student.id)!;
    const isMikkel = si === 1;

    // Brøk-modulet: afsluttet for de fleste (3–12 dage siden)
    const broekCount = 5 + Math.floor(rng() * 6);
    for (let i = 0; i < broekCount; i++) {
      await simulateAttempt(
        {
          userId: student.id,
          templateSlug: broekTemplates[i % broekTemplates.length],
          daysAgo: 3 + Math.floor(rng() * 9),
        },
        rng,
        ability
      );
    }

    // Lignings-afleveringen: i gang de sidste 5 dage — medmindre man er Mikkel
    if (!isMikkel) {
      const lignCount = 3 + Math.floor(rng() * 6);
      for (let i = 0; i < lignCount; i++) {
        const stuckNow = stuckStudents.has(student.id) && rng() < 0.6;
        await simulateAttempt(
          {
            userId: student.id,
            templateSlug: lignTemplates[i % lignTemplates.length],
            daysAgo: Math.floor(rng() * 5),
            assignmentId: assignmentLigninger.id,
            forceWrongMisconception: stuckNow
              ? rng() < 0.7
                ? "M-LIGN-FORTEGNSFEJL"
                : "M-LIGN-GLEMMER-AT-DIVIDERE"
              : undefined,
          },
          rng,
          ability
        );
      }
    }

    // Funktioner: kun de dygtigste er begyndt
    if (ability > 0.72) {
      for (let i = 0; i < 2 + Math.floor(rng() * 3); i++) {
        await simulateAttempt(
          {
            userId: student.id,
            templateSlug: funkTemplates[i % funkTemplates.length],
            daysAgo: Math.floor(rng() * 2),
          },
          rng,
          ability
        );
      }
    }

    // Frejas streak: aktivitet hver af de sidste 7 dage
    if (si === 0) {
      for (let d = 0; d < 7; d++) {
        await simulateAttempt(
          {
            userId: student.id,
            templateSlug: lignTemplates[d % lignTemplates.length],
            daysAgo: d,
            assignmentId: d < 3 ? assignmentLigninger.id : undefined,
          },
          rng,
          ability
        );
      }
    }
  }

  /* ------------------------------------------------ mestring + repetition */
  console.log("Skriver mestringsestimater og repetitionsplan …");
  const masteryRows = [];
  const reviewRows = [];
  for (const [key, state] of mastery) {
    const [userId, kcCode] = key.split("|");
    const level = levelFromEstimate(state);
    masteryRows.push({
      userId,
      kcId: kcIdByCode.get(kcCode)!,
      level,
      pKnown: state.pKnown,
      attempts: state.attempts,
      lastCorrectAt: now,
    });
    // repetitionsplan for alt, der er øvet: nogle KC'er forfalder i dag
    const rng = mulberry32(hashString(`review:${key}`));
    let review = INITIAL_REVIEW;
    const reps = Math.min(4, state.attempts);
    for (let i = 0; i < reps; i++)
      review = updateReview(review, qualityOf(rng() < state.pKnown, 0));
    const dueOffsetDays = rng() < 0.35 ? 0 : Math.floor(rng() * review.intervalDays);
    reviewRows.push({
      userId,
      kcId: kcIdByCode.get(kcCode)!,
      dueAt: new Date(now.getTime() + (dueOffsetDays === 0 ? -2 * 60 * 60 * 1000 : dueOffsetDays * DAY)),
      intervalDays: review.intervalDays,
      ease: review.ease,
      reps: review.reps,
    });
  }
  if (masteryRows.length) await db.insert(t.masteryEstimates).values(masteryRows);
  if (reviewRows.length) await db.insert(t.reviewSchedule).values(reviewRows);

  /* ------------------------------------------------ fremskridt + afleveringsstatus */
  const progressRows = [];
  const submissionRows = [];
  for (const [si, student] of students.entries()) {
    const ability = abilities.get(student.id)!;
    const isMikkel = si === 1;
    progressRows.push({
      userId: student.id,
      scopeType: "lesson",
      scopeId: lessonIdBySlug.get("math-broeker-faelles-naevner")!,
      percent: ability > 0.5 ? 100 : 60,
      state: ability > 0.5 ? "completed" : "in_progress",
    });
    if (!isMikkel)
      progressRows.push({
        userId: student.id,
        scopeType: "lesson",
        scopeId: lessonIdBySlug.get("math-ligninger")!,
        percent: ability > 0.75 ? 100 : Math.round(30 + ability * 50),
        state: ability > 0.75 ? "completed" : "in_progress",
      });
    if (ability > 0.72)
      progressRows.push({
        userId: student.id,
        scopeType: "lesson",
        scopeId: lessonIdBySlug.get("math-lineaere-funktioner")!,
        percent: 30,
        state: "in_progress",
      });

    submissionRows.push({
      assignmentId: assignmentLigninger.id,
      userId: student.id,
      status: isMikkel
        ? "not_started"
        : ability > 0.7
          ? "submitted"
          : ability > 0.45
            ? "in_progress"
            : "in_progress",
      score: ability > 0.7 ? Math.round(ability * 100) / 100 : null,
      completedItems: isMikkel ? 0 : ability > 0.7 ? 1 : 0,
      submittedAt: ability > 0.7 && !isMikkel ? new Date(now.getTime() - DAY) : null,
    });
    submissionRows.push({
      assignmentId: assignmentBroeker.id,
      userId: student.id,
      status: isMikkel ? "not_started" : ability > 0.8 ? "submitted" : "not_started",
      score: null,
      completedItems: ability > 0.8 && !isMikkel ? 1 : 0,
      submittedAt: ability > 0.8 && !isMikkel ? new Date(now.getTime() - DAY / 2) : null,
    });
  }
  await db.insert(t.progress).values(progressRows);
  await db.insert(t.submissions).values(submissionRows);

  const attemptCount = await db.select({ n: sql<number>`count(*)` }).from(t.attempts);
  console.log(`Færdig ✔  (${attemptCount[0].n} forsøg simuleret)`);
  console.log(`Lærer: ${teacher.displayName} · Elever: ${students.length} · Hold: ${klass.name}`);
  process.exit(0);
}

/** Byg et simuleret elevsvar: korrekt, distraktor-baseret eller tilfældigt forkert. */
function buildSimulatedAnswer(
  instance: RenderedInstance,
  correct: boolean,
  forceMisconception: string | undefined,
  rng: Rng
): SubmittedAnswer {
  const answer = instance.answer;
  switch (answer.validator) {
    case "numeric": {
      if (correct) return { kind: "numeric", raw: String(answer.value) };
      const target = forceMisconception
        ? instance.distractors.find((d) => d.misconception === forceMisconception)
        : rng() < 0.65 && instance.distractors.length
          ? instance.distractors[Math.floor(rng() * instance.distractors.length)]
          : undefined;
      if (target?.value != null)
        return { kind: "numeric", raw: String(target.value) };
      return { kind: "numeric", raw: String(answer.value + 1 + Math.floor(rng() * 5)) };
    }
    case "expression": {
      if (correct) return { kind: "expression", raw: answer.value };
      const target = forceMisconception
        ? instance.distractors.find((d) => d.misconception === forceMisconception)
        : rng() < 0.7 && instance.distractors.length
          ? instance.distractors[Math.floor(rng() * instance.distractors.length)]
          : undefined;
      if (target)
        return {
          kind: "expression",
          raw: target.expr ?? String(target.value),
        };
      return { kind: "expression", raw: "0" };
    }
    case "mcq": {
      if (correct)
        return {
          kind: "mcq",
          optionId: answer.options.find((o) => o.correct)!.id,
        };
      const withMisconception = answer.options.filter(
        (o) => !o.correct && o.misconception
      );
      const pool = forceMisconception
        ? answer.options.filter((o) => o.misconception === forceMisconception)
        : withMisconception;
      const wrongPool = pool.length
        ? pool
        : answer.options.filter((o) => !o.correct);
      return {
        kind: "mcq",
        optionId: wrongPool[Math.floor(rng() * wrongPool.length)].id,
      };
    }
    case "multi":
      return {
        kind: "multi",
        optionIds: answer.options
          .filter((o) => (correct ? o.correct : !o.correct))
          .map((o) => o.id),
      };
    case "point":
    case "graph": {
      if (correct)
        return {
          kind: "point",
          x: answer.x + (rng() - 0.5) * answer.tolerance,
          y: answer.y + (rng() - 0.5) * answer.tolerance,
        };
      return {
        kind: "point",
        x: answer.x + 1.5 + rng() * 2,
        y: answer.y - 1 - rng() * 2,
      };
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
