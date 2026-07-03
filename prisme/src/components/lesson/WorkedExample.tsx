"use client";

import { useState } from "react";
import { MathText } from "@/components/MathText";

/**
 * Gennemregnet eksempel (doc 05 §5.6): trin foldes ud ét ad gangen —
 * eleven styrer tempoet, ingen væg af udregninger.
 */
export function WorkedExample({
  title,
  steps,
  active,
  onComplete,
}: {
  title?: string;
  steps: string[];
  active: boolean;
  onComplete: () => void;
}) {
  const [shown, setShown] = useState(1);
  const allShown = shown >= steps.length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Gennemregnet eksempel
      </p>
      {title && (
        <p className="mb-3 text-lg font-semibold">
          <MathText text={title} />
        </p>
      )}
      <ol className="list-decimal space-y-3 pl-5">
        {steps.slice(0, shown).map((s, i) => (
          <li key={i} className="leading-relaxed">
            <MathText text={s} />
          </li>
        ))}
      </ol>
      {active && (
        <div className="mt-4 flex gap-3">
          {!allShown ? (
            <button
              onClick={() => setShown((s) => s + 1)}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Vis næste trin ({shown}/{steps.length})
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Nu prøver jeg selv →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
