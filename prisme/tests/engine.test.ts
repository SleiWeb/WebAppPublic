import { describe, expect, it } from "vitest";
import {
  templateCatalog,
  getTemplate,
  verifyCatalogIntegrity,
} from "@/lib/content/catalog";
import { generateInstance } from "@/lib/engine/generate";
import { validateAnswer, parseNumericInput } from "@/lib/engine/validate";
import { seedFor } from "@/lib/engine/prng";

describe("indholdskatalog", () => {
  it("alle referencer (KC, mål, misforståelser, skabeloner) er konsistente", () => {
    expect(verifyCatalogIntegrity()).toEqual([]);
  });
});

describe("generator", () => {
  it("(skabelon, seed) er deterministisk", () => {
    for (const t of templateCatalog) {
      const a = generateInstance(t, 42);
      const b = generateInstance(t, 42);
      expect(a).toEqual(b);
    }
  });

  it("forskellige seeds giver (som regel) forskellige instanser", () => {
    const t = getTemplate("tmpl-lign-loes-x");
    const variants = new Set(
      Array.from({ length: 25 }, (_, i) =>
        JSON.stringify(generateInstance(t, i).variables)
      )
    );
    expect(variants.size).toBeGreaterThan(5);
  });

  it("seed bindes til (elev, skabelon, forsøg)", () => {
    const s1 = seedFor("user-a", "tmpl-x", 1);
    const s2 = seedFor("user-b", "tmpl-x", 1);
    const s3 = seedFor("user-a", "tmpl-x", 2);
    expect(s1).not.toBe(s2);
    expect(s1).not.toBe(s3);
    expect(seedFor("user-a", "tmpl-x", 1)).toBe(s1);
  });

  it("variabelrækkefølgen er ligegyldig (JSONB bevarer ikke nøgleorden)", () => {
    const t = getTemplate("tmpl-lign-loes-x");
    // samme skabelon, men med afledte udtryk FØR deres afhængigheder
    const reordered = {
      ...t,
      variables: Object.fromEntries(Object.entries(t.variables).reverse()),
    };
    const a = generateInstance(t, 123);
    const b = generateInstance(reordered, 123);
    expect(b.variables).toEqual(a.variables);
  });

  it("self-test: 100 instanser pr. skabelon — facit består altid sin egen validator", () => {
    for (const t of templateCatalog) {
      for (let seed = 0; seed < 100; seed++) {
        const inst = generateInstance(t, seed);
        const answer = inst.answer;
        const result =
          answer.validator === "numeric"
            ? validateAnswer(inst, { kind: "numeric", raw: String(answer.value) })
            : answer.validator === "expression"
              ? validateAnswer(inst, { kind: "expression", raw: answer.value })
              : answer.validator === "mcq"
                ? validateAnswer(inst, {
                    kind: "mcq",
                    optionId: answer.options.find((o) => o.correct)!.id,
                  })
                : answer.validator === "multi"
                  ? validateAnswer(inst, {
                      kind: "multi",
                      optionIds: answer.options
                        .filter((o) => o.correct)
                        .map((o) => o.id),
                    })
                  : validateAnswer(inst, {
                      kind: "point",
                      x: answer.x,
                      y: answer.y,
                    });
        expect(result.correct, `${t.id} seed ${seed}`).toBe(true);
      }
    }
  });

  it("self-test: distraktorer diagnosticeres og falder aldrig sammen med facit", () => {
    for (const t of templateCatalog) {
      for (let seed = 0; seed < 50; seed++) {
        const inst = generateInstance(t, seed);
        for (const d of inst.distractors) {
          const submitted =
            d.expr != null
              ? ({ kind: "expression", raw: d.expr } as const)
              : ({ kind: "numeric", raw: String(d.value) } as const);
          const result = validateAnswer(inst, submitted);
          expect(result.correct, `${t.id} seed ${seed} distraktor`).toBe(false);
          // to distraktorer kan give samme værdi for enkelte seeds —
          // diagnosen skal så matche én af de sammenfaldende koder
          const candidates = inst.distractors
            .filter((o) =>
              o.expr != null ? o.expr === d.expr : o.value === d.value
            )
            .map((o) => o.misconception);
          expect(candidates, `${t.id} seed ${seed}`).toContain(
            result.misconceptionCode
          );
        }
      }
    }
  });
});

describe("numeric-validator", () => {
  const t = getTemplate("tmpl-lign-loes-x");
  const inst = generateInstance(t, 7);
  const answer = inst.answer as Extract<
    typeof inst.answer,
    { validator: "numeric" }
  >;

  it("accepterer dansk decimalkomma", () => {
    const res = validateAnswer(inst, {
      kind: "numeric",
      raw: String(answer.value).replace(".", ","),
    });
    expect(res.correct).toBe(true);
  });

  it("afviser forkerte svar med closeness < 1", () => {
    const res = validateAnswer(inst, {
      kind: "numeric",
      raw: String(answer.value + 100),
    });
    expect(res.correct).toBe(false);
    expect(res.closeness).toBeLessThan(1);
  });

  it("fortegnsfejl diagnosticeres som M-LIGN-FORTEGNSFEJL med målrettet feedback", () => {
    const v = inst.variables as Record<string, number>;
    const wrong = (v.c + v.b) / v.a;
    const res = validateAnswer(inst, { kind: "numeric", raw: String(wrong) });
    expect(res.correct).toBe(false);
    expect(res.misconceptionCode).toBe("M-LIGN-FORTEGNSFEJL");
    expect(res.feedbackMessage).toContain("fortegnsfejl");
  });

  it("parseNumericInput håndterer brøker og enheder", () => {
    expect(parseNumericInput("5/6")?.value).toBeCloseTo(5 / 6);
    expect(parseNumericInput("3,5 m/s^2")).toEqual({ value: 3.5, unit: "m/s^2" });
    expect(parseNumericInput("hest")).toBeNull();
  });
});

describe("expression-validator", () => {
  it("accepterer ækvivalente former af brøksvar", () => {
    const t = getTemplate("tmpl-broek-add-ulige-naevner");
    const inst = generateInstance(t, 3);
    const v = inst.variables as Record<string, number>;
    // uforkortet form
    const ok1 = validateAnswer(inst, { kind: "expression", raw: `${v.t}/${v.n}` });
    expect(ok1.correct).toBe(true);
    // decimaltal med samme værdi
    const ok2 = validateAnswer(inst, {
      kind: "expression",
      raw: String(v.t / v.n),
    });
    expect(ok2.correct).toBe(true);
  });

  it("'adderer nævnere'-fejlen giver den målrettede brøk-forklaring", () => {
    const t = getTemplate("tmpl-broek-add-ulige-naevner");
    const inst = generateInstance(t, 3);
    const v = inst.variables as Record<string, number>;
    const res = validateAnswer(inst, {
      kind: "expression",
      raw: `${v.a + v.c}/${v.b + v.d}`,
    });
    expect(res.correct).toBe(false);
    expect(res.misconceptionCode).toBe("M-BROEK-ADDERER-NAEVNERE");
    expect(res.feedbackMessage).toContain("nævner");
  });

  it("accepterer alle ækvivalente former med frie variable", () => {
    const t = getTemplate("tmpl-lign-reducer");
    const inst = generateInstance(t, 11);
    const v = inst.variables as Record<string, number>;
    for (const form of [
      `${v.s}x - ${v.r}`,
      `${v.s}*x - ${v.r}`,
      `-${v.r} + ${v.s}x`,
      `${v.p}x + ${v.q}x - ${v.r}`, // ureduceret men ækvivalent
    ]) {
      expect(
        validateAnswer(inst, { kind: "expression", raw: form }).correct,
        form
      ).toBe(true);
    }
    expect(
      validateAnswer(inst, { kind: "expression", raw: `${v.s}x + ${v.r}` })
        .correct
    ).toBe(false);
  });
});

describe("mcq- og point-validator", () => {
  it("mcq: forkert valg med distraktor-tag giver misforståelses-kode", () => {
    const t = getTemplate("tmpl-lign-naeste-skridt");
    const inst = generateInstance(t, 5);
    const answer = inst.answer as Extract<
      typeof inst.answer,
      { validator: "mcq" }
    >;
    const wrong = answer.options.find((o) => o.misconception);
    const res = validateAnswer(inst, { kind: "mcq", optionId: wrong!.id });
    expect(res.correct).toBe(false);
    expect(res.misconceptionCode).toBe(wrong!.misconception);
  });

  it("point: geometrisk tolerance", () => {
    const t = getTemplate("tmpl-lin-aflaes-b");
    const inst = generateInstance(t, 9);
    const answer = inst.answer as Extract<
      typeof inst.answer,
      { validator: "point" }
    >;
    const near = validateAnswer(inst, {
      kind: "point",
      x: answer.x + 0.2,
      y: answer.y - 0.2,
    });
    expect(near.correct).toBe(true);
    const far = validateAnswer(inst, {
      kind: "point",
      x: answer.x + 3,
      y: answer.y,
    });
    expect(far.correct).toBe(false);
    expect(far.closeness).toBeLessThan(1);
  });
});
