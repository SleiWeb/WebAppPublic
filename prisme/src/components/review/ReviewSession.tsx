"use client";

import { useState } from "react";
import Link from "next/link";
import { ExercisePlayer } from "@/components/exercise/ExercisePlayer";

type Item = { kcName: string; templateSlug: string };

/**
 * Repetitionssession: én opgave pr. forfaldent emne. Rigtigt svar →
 * længere interval; forkert → emnet kommer hurtigt igen (SM-2, doc 05 §5.10).
 */
export function ReviewSession({
  items,
  assignmentId,
  perItem = 1,
}: {
  items: Item[];
  assignmentId?: string;
  perItem?: number;
}) {
  const [index, setIndex] = useState(0);
  const [solvedInItem, setSolvedInItem] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);

  const total = items.length * perItem;
  const doneCount = results.length;
  const finished = index >= items.length;
  const correctCount = results.filter(Boolean).length;

  function handleAttempt(ok: boolean) {
    setResults((r) => [...r, ok]);
    const next = solvedInItem + 1;
    if (next >= perItem) {
      setTimeout(() => {
        setSolvedInItem(0);
        setIndex((i) => i + 1);
      }, ok ? 1200 : 3500);
    } else {
      setSolvedInItem(next);
    }
  }

  if (finished)
    return (
      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-center">
        <p className="text-xl font-bold text-emerald-900">
          Session færdig — {correctCount} af {doneCount} rigtige 🎉
        </p>
        <p className="mt-1 text-emerald-800">
          {correctCount === doneCount
            ? "Alt sad lige i skabet. Intervallerne er blevet længere."
            : "Det, der drillede, kommer igen i morgen — helt som planlagt."}
        </p>
        <Link
          href="/elev"
          className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700"
        >
          Tilbage til overblikket
        </Link>
      </div>
    );

  const item = items[index];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <p className="font-medium text-slate-700">
          {index + 1}/{items.length}: <strong>{item.kcName}</strong>
        </p>
        <div className="ml-auto flex gap-1.5" aria-hidden>
          {Array.from({ length: Math.min(total, 12) }, (_, i) => (
            <span
              key={i}
              className={`h-2.5 w-2.5 rounded-full ${
                i < results.length
                  ? results[i]
                    ? "bg-emerald-500"
                    : "bg-orange-400"
                  : "bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
      <ExercisePlayer
        key={`${index}-${solvedInItem}`}
        templateSlug={item.templateSlug}
        context={assignmentId ? "assignment" : "review"}
        assignmentId={assignmentId}
        singleShot
        onAttempt={handleAttempt}
      />
    </div>
  );
}
