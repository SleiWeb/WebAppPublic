"use client";

import { useState } from "react";
import { ExercisePlayer } from "@/components/exercise/ExercisePlayer";

/**
 * Tjek-blokken (doc 05 §5.1/5.9): et kort mestringstjek. Består eleven
 * (fx 2 af 3), opdateres lektionsstatus og en evt. aflevering markeres
 * som afleveret. Mestringen pr. KC er allerede opdateret pr. forsøg.
 */
export function CheckpointRunner({
  lessonSlug,
  templateIds,
  passRule,
  active,
  assignmentId,
  onComplete,
}: {
  lessonSlug: string;
  templateIds: string[];
  passRule: { correctOf: number; need: number };
  active: boolean;
  assignmentId?: string;
  onComplete: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [reported, setReported] = useState(false);

  const total = passRule.correctOf;
  const correctCount = results.filter(Boolean).length;
  const passed = correctCount >= passRule.need;

  async function handleAttempt(ok: boolean) {
    const newResults = [...results, ok];
    setResults(newResults);
    if (newResults.length >= total) {
      setFinished(true);
      if (!reported) {
        setReported(true);
        await fetch("/api/lesson/checkpoint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonSlug,
            passed: newResults.filter(Boolean).length >= passRule.need,
            correctCount: newResults.filter(Boolean).length,
            totalCount: total,
            assignmentId,
          }),
        });
      }
    } else {
      // kort pause så feedback kan læses, før næste opgave vises
      setTimeout(() => setIndex((i) => i + 1), ok ? 1200 : 3500);
    }
  }

  if (!active && results.length === 0)
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-500">
        Mestringstjek ({passRule.need} rigtige ud af {total})
      </p>
    );

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-4">
        <p className="font-semibold text-blue-900">
          🎯 Mestringstjek: svar rigtigt på mindst {passRule.need} af {total}
        </p>
        <p className="mt-1 flex items-center gap-2" aria-live="polite">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              aria-hidden
              className={`inline-block h-3.5 w-3.5 rounded-full ${
                i < results.length
                  ? results[i]
                    ? "bg-emerald-500"
                    : "bg-orange-400"
                  : "bg-white border border-blue-300"
              }`}
            />
          ))}
          <span className="sr-only">
            {results.length} af {total} besvaret, {correctCount} rigtige
          </span>
        </p>
      </div>

      {!finished && (
        <ExercisePlayer
          key={index}
          templateSlug={templateIds[index % templateIds.length]}
          context="checkpoint"
          assignmentId={assignmentId}
          singleShot
          onAttempt={(ok) => void handleAttempt(ok)}
        />
      )}

      {finished && (
        <div
          className={`rounded-2xl border p-5 ${
            passed
              ? "border-emerald-300 bg-emerald-50"
              : "border-amber-300 bg-amber-50"
          }`}
          role="status"
        >
          <p className="text-lg font-bold">
            {passed
              ? `Tjek bestået — ${correctCount} af ${total} rigtige! 🎉`
              : `${correctCount} af ${total} rigtige — tæt på!`}
          </p>
          <p className="mt-1">
            {passed
              ? "Din mestring er opdateret. Emnet kommer i din repetition, så det sidder fast."
              : "Ingen stress: kig på hints og det gennemregnede eksempel, og prøv tjekket igen."}
          </p>
          <div className="mt-3 flex gap-3">
            {!passed && (
              <button
                onClick={() => {
                  setResults([]);
                  setIndex((i) => i + 1);
                  setFinished(false);
                  setReported(false);
                }}
                className="rounded-xl bg-amber-600 px-5 py-2.5 font-semibold text-white hover:bg-amber-700"
              >
                Prøv tjekket igen
              </button>
            )}
            <button
              onClick={onComplete}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Afslut lektionen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
