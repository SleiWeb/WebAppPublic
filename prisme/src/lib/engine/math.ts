/**
 * Afgrænset math.js-instans til opgavemotoren.
 * Elevers svar parses her, så farlige funktioner er slået fra
 * (jf. math.js' egne sikkerhedsanbefalinger).
 */
import { create, all, type MathJsInstance } from "mathjs";

export const math: MathJsInstance = create(all, {});

const blocked = () => {
  throw new Error("Funktionen er ikke tilladt");
};

math.import(
  {
    import: blocked,
    createUnit: blocked,
    reviver: blocked,
    evaluate: math.evaluate,
    parse: math.parse,
  },
  { override: true }
);

/** Evaluér et udtryk med et variabel-scope. Kaster ved fejl. */
export function evalExpr(
  expr: string,
  scope: Record<string, number> = {}
): number {
  const result = math.evaluate(expr, { ...scope });
  if (typeof result === "boolean") return result ? 1 : 0;
  const num = typeof result === "number" ? result : Number(result?.valueOf?.());
  return num;
}

/** Evaluér en constraint (boolsk udtryk). */
export function evalConstraint(
  expr: string,
  scope: Record<string, number>
): boolean {
  const result = math.evaluate(expr, { ...scope });
  return result === true || result === 1;
}

/**
 * Erstat kendte variabler i et udtryk med deres talværdier og returnér
 * udtrykket som streng (bruges til distraktor-udtryk med frie variable,
 * fx "(p + q - r) * x" → "(4 + 3 - 5) * x").
 */
export function substituteSymbols(
  expr: string,
  scope: Record<string, number>
): string {
  const node = math.parse(expr);
  const transformed = node.transform((n) => {
    if (n.type === "SymbolNode") {
      const name = (n as unknown as { name: string }).name;
      if (name in scope) return new math.ConstantNode(scope[name]);
    }
    return n;
  });
  return transformed.toString();
}

/**
 * Numerisk ækvivalens mellem to udtryk med frie variable:
 * sammenlign på deterministiske samplingspunkter (doc 06 §6.8 —
 * deterministisk fallback; en egentlig CAS-worker kan kobles på senere).
 */
const SAMPLE_POINTS = [-3.7, -1.3, 0.6, 1.9, 3.2];

export function expressionsEquivalent(
  exprA: string,
  exprB: string,
  freeVars: string[]
): boolean {
  try {
    const a = math.parse(exprA).compile();
    const b = math.parse(exprB).compile();
    if (freeVars.length === 0) {
      const va = a.evaluate({});
      const vb = b.evaluate({});
      return numbersClose(va, vb);
    }
    // Sample alle kombinationer (frie variable er få: typisk 1)
    const combos = cartesian(freeVars.map(() => SAMPLE_POINTS));
    for (const combo of combos) {
      const scope: Record<string, number> = {};
      freeVars.forEach((v, i) => (scope[v] = combo[i]));
      const va = a.evaluate({ ...scope });
      const vb = b.evaluate({ ...scope });
      if (!numbersClose(va, vb)) return false;
    }
    return true;
  } catch {
    return false;
  }
}

function numbersClose(a: unknown, b: unknown): boolean {
  const na = Number(a);
  const nb = Number(b);
  if (!Number.isFinite(na) || !Number.isFinite(nb)) return false;
  return Math.abs(na - nb) <= 1e-6 * Math.max(1, Math.abs(na), Math.abs(nb));
}

function cartesian(arrays: number[][]): number[][] {
  return arrays.reduce<number[][]>(
    (acc, arr) => acc.flatMap((combo) => arr.map((v) => [...combo, v])),
    [[]]
  );
}
