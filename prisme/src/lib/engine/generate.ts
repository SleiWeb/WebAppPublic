/**
 * Generator: Skabelon (JSON) + seed → deterministisk instans med konkrete
 * tal, facit og mønstrede distraktorer (doc 06 §6.7).
 */
import type {
  ExerciseTemplateContent,
  WidgetSpec,
} from "../content/schema";
import { evalConstraint, evalExpr, substituteSymbols } from "./math";
import { pickOne, randInt, rngFor, shuffle, type Rng } from "./prng";
import type {
  RenderedAnswer,
  RenderedDistractor,
  RenderedInstance,
} from "./types";

const MAX_SAMPLING_TRIES = 500;

/** Erstat {{navn}}-pladsholdere med variabelværdier. */
export function substituteTemplate(
  tmpl: string,
  vars: Record<string, number | string>
): string {
  return tmpl.replace(/\{\{(\w+)\}\}/g, (m, name: string) =>
    name in vars ? formatValue(vars[name]) : m
  );
}

function formatValue(v: number | string): string {
  if (typeof v === "string") return v;
  if (Number.isInteger(v)) return String(v);
  // afrund flydende tal pænt (og undgå 0.30000000000000004)
  return String(Math.round(v * 1e6) / 1e6);
}

/** Træk variabler, respektér constraints, beregn afledte udtryk. */
export function sampleVariables(
  template: ExerciseTemplateContent,
  rng: Rng
): Record<string, number | string> {
  // JSONB bevarer ikke nøglerækkefølgen, så afledte udtryk løses med
  // flerpas-afhængighedsopløsning i stedet for deklarationsrækkefølge.
  outer: for (let attempt = 0; attempt < MAX_SAMPLING_TRIES; attempt++) {
    const vars: Record<string, number | string> = {};
    const numericScope: Record<string, number> = {};

    // 1. pas: uafhængige variabler (int/float/pick) — vilkårlig rækkefølge
    // (sorteret, så trækningen er deterministisk uanset JSONB-omordning)
    const entries = Object.entries(template.variables).sort(([a], [b]) =>
      a.localeCompare(b)
    );
    const derived: [string, string][] = [];
    for (const [name, def] of entries) {
      if ("expr" in def) {
        derived.push([name, def.expr]);
        continue;
      }
      if ("pick" in def) {
        vars[name] = pickOne(rng, def.pick);
      } else {
        let v: number;
        let guard = 0;
        do {
          v =
            def.type === "int"
              ? randInt(rng, def.min, def.max)
              : def.min + rng() * (def.max - def.min);
          if (def.step) v = Math.round(v / def.step) * def.step;
          if (++guard > 100) continue outer;
        } while (def.exclude?.includes(v));
        vars[name] = v;
      }
      if (typeof vars[name] === "number")
        numericScope[name] = vars[name] as number;
    }

    // 2. pas: afledte udtryk, gentaget til alle afhængigheder er løst
    let pending = derived;
    while (pending.length > 0) {
      const next: [string, string][] = [];
      for (const [name, expr] of pending) {
        try {
          const value = evalExpr(expr, numericScope);
          vars[name] = value;
          numericScope[name] = value;
        } catch {
          next.push([name, expr]);
        }
      }
      if (next.length === pending.length)
        throw new Error(
          `Cyklisk/uopløselig variabel i ${template.id}: ${next.map(([n]) => n).join(", ")}`
        );
      pending = next;
    }

    const ok = template.constraints.every((c) =>
      evalConstraint(c, numericScope)
    );
    if (ok) return vars;
  }
  throw new Error(
    `Kunne ikke generere variabler for ${template.id} — tjek constraints`
  );
}

function numericScopeOf(
  vars: Record<string, number | string>
): Record<string, number> {
  const scope: Record<string, number> = {};
  for (const [k, v] of Object.entries(vars))
    if (typeof v === "number") scope[k] = v;
  return scope;
}

function substituteWidget(
  widget: WidgetSpec,
  vars: Record<string, number | string>
): WidgetSpec {
  const render = widget.render
    ? Object.fromEntries(
        Object.entries(widget.render).map(([k, v]) => [
          k,
          typeof v === "string" ? substituteTemplate(v, vars) : v,
        ])
      )
    : undefined;
  // params kan bindes til genererede variabler via bind: "var.a"
  const params = Object.fromEntries(
    Object.entries(widget.params).map(([k, p]) => {
      if (p.bind?.startsWith("var.")) {
        const name = p.bind.slice(4);
        const v = vars[name];
        if (typeof v === "number") return [k, { ...p, default: v }];
      }
      return [k, p];
    })
  );
  return { ...widget, render, params };
}

function renderAnswer(
  template: ExerciseTemplateContent,
  vars: Record<string, number | string>,
  rng: Rng
): RenderedAnswer {
  const spec = template.answer;
  const scope = numericScopeOf(vars);
  switch (spec.validator) {
    case "numeric":
      return {
        validator: "numeric",
        value: evalExpr(substituteTemplate(spec.value, vars), scope),
        unit: spec.unit,
        tolerance: spec.tolerance,
        requireUnit: spec.requireUnit,
      };
    case "expression":
      return {
        validator: "expression",
        value: substituteTemplate(spec.value, vars),
        variables: spec.variables,
      };
    case "mcq":
    case "multi": {
      const options = spec.options.map((o) => ({
        id: o.id,
        text: substituteTemplate(o.text, vars),
        correct: o.correct,
        misconception: o.misconception,
      }));
      return {
        validator: spec.validator,
        options: spec.shuffle ? shuffle(rng, options) : options,
      };
    }
    case "point":
    case "graph":
      return {
        validator: spec.validator,
        x: evalExpr(substituteTemplate(spec.x, vars), scope),
        y: evalExpr(substituteTemplate(spec.y, vars), scope),
        tolerance: spec.tolerance,
      };
  }
}

function renderDistractors(
  template: ExerciseTemplateContent,
  vars: Record<string, number | string>,
  answer: RenderedAnswer
): RenderedDistractor[] {
  const scope = numericScopeOf(vars);
  const result: RenderedDistractor[] = [];
  for (const d of template.distractors) {
    if (template.answer.validator === "expression") {
      // udtryk med frie variable: substituér kendte variabler, behold resten
      try {
        result.push({
          expr: substituteSymbols(d.rule, scope),
          misconception: d.misconception,
        });
      } catch {
        // ugyldig regel for denne instans — spring over
      }
    } else {
      try {
        const value = evalExpr(d.rule, scope);
        if (!Number.isFinite(value)) continue;
        // en distraktor der falder sammen med facit ville give falsk diagnose
        if (answer.validator === "numeric") {
          const tol = Math.max(answer.tolerance, 1e-9);
          if (Math.abs(value - answer.value) <= tol) continue;
        }
        result.push({ value, misconception: d.misconception });
      } catch {
        // spring over
      }
    }
  }
  return result;
}

/**
 * (skabelon, seed) → deterministisk instans. Samme input giver altid
 * samme opgave — grundlaget for reproducérbar retning.
 */
export function generateInstance(
  template: ExerciseTemplateContent,
  seed: number
): RenderedInstance {
  const rng = rngFor(template.id, seed);
  const vars = sampleVariables(template, rng);
  const answer = renderAnswer(template, vars, rng);

  // MCQ-instanser med sammenfaldende svarmuligheder forkastes og re-samples
  if (answer.validator === "mcq" || answer.validator === "multi") {
    const texts = new Set(answer.options.map((o) => o.text));
    if (texts.size !== answer.options.length)
      return generateInstance(template, seed + 7919);
  }

  return {
    templateId: template.id,
    seed,
    variables: vars,
    prompt: {
      text: substituteTemplate(template.prompt.text, vars),
      inputWidget: template.prompt.inputWidget
        ? substituteWidget(template.prompt.inputWidget, vars)
        : undefined,
    },
    answer,
    hints: template.hints
      .slice()
      .sort((a, b) => a.level - b.level)
      .map((h) => ({ level: h.level, text: substituteTemplate(h.text, vars) })),
    solutionSteps:
      template.solution?.steps.map((s) => substituteTemplate(s, vars)) ?? [],
    distractors: renderDistractors(template, vars, answer),
    feedbackRules: template.feedbackRules.map((r) => ({
      condition: r.condition,
      message: substituteTemplate(r.message, vars),
    })),
    difficulty: template.difficulty,
    knowledgeComponents: template.knowledgeComponents,
  };
}
