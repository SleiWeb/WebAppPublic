"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ClientExercise, SubmitResult } from "@/lib/exercise/service";
import type { SubmittedAnswer } from "@/lib/engine/types";
import { MathText } from "@/components/MathText";
import { GraphPlotter } from "@/components/widgets/GraphPlotter";
import { MASTERY_META } from "@/lib/subjects";

type Props = {
  templateSlug: string;
  context?: "lesson" | "checkpoint" | "review" | "assignment";
  assignmentId?: string;
  /** kaldes når et forsøg er rettet (bruges af checkpoint/træn-tælleren) */
  onAttempt?: (correct: boolean) => void;
  /** skjul "Prøv med nye tal" (checkpoint styrer selv flowet) */
  singleShot?: boolean;
};

type Hint = { level: number; text: string };

/**
 * Opgaveafspilleren: henter en seedet instans fra serveren, viser prompt +
 * svarfelt, hint-stigen (retningsgivende → begreb → skridt → worked step),
 * og målrettet feedback ved kendte misforståelser (doc 05 §5.7–5.8).
 */
export function ExercisePlayer({
  templateSlug,
  context = "lesson",
  assignmentId,
  onAttempt,
  singleShot,
}: Props) {
  const [exercise, setExercise] = useState<ClientExercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [textAnswer, setTextAnswer] = useState("");
  const [chosenOption, setChosenOption] = useState<string | null>(null);
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);

  const [hints, setHints] = useState<Hint[]>([]);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);
  const startedAt = useRef<number>(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setHints([]);
    setTextAnswer("");
    setChosenOption(null);
    setPoint(null);
    setShowSolution(false);
    setWrongTries(0);
    try {
      const res = await fetch("/api/exercise/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateSlug }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Fejl");
      setExercise(await res.json());
      startedAt.current = Date.now();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kunne ikke hente opgaven");
    } finally {
      setLoading(false);
    }
  }, [templateSlug]);

  useEffect(() => {
    // datahentning ved mount (bevidst: ingen data-bibliotek i MVP'en)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function requestHint() {
    if (!exercise || hints.length >= exercise.hintCount) return;
    const res = await fetch("/api/exercise/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instanceId: exercise.instanceId,
        level: hints.length + 1,
      }),
    });
    if (res.ok) {
      const hint: Hint = await res.json();
      setHints((h) => [...h, hint]);
    }
  }

  function buildAnswer(): SubmittedAnswer | null {
    if (!exercise) return null;
    switch (exercise.input.kind) {
      case "numeric":
        return textAnswer.trim() ? { kind: "numeric", raw: textAnswer } : null;
      case "expression":
        return textAnswer.trim() ? { kind: "expression", raw: textAnswer } : null;
      case "mcq":
        return chosenOption ? { kind: "mcq", optionId: chosenOption } : null;
      case "multi":
        return chosenOption ? { kind: "multi", optionIds: [chosenOption] } : null;
      case "point":
        return point ? { kind: "point", x: point.x, y: point.y } : null;
    }
  }

  async function submit() {
    const answer = buildAnswer();
    if (!exercise || !answer) return;
    const res = await fetch("/api/exercise/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instanceId: exercise.instanceId,
        answer,
        hintsUsed: hints.length,
        durationMs: Date.now() - startedAt.current,
        assignmentId,
        context,
      }),
    });
    if (!res.ok) {
      setError("Kunne ikke rette svaret — prøv igen");
      return;
    }
    const r: SubmitResult = await res.json();
    setResult(r);
    if (!r.correct) setWrongTries((w) => w + 1);
    onAttempt?.(r.correct);
  }

  if (loading)
    return <div className="animate-pulse rounded-xl bg-slate-100 h-40" aria-busy="true" />;
  if (error)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
        {error}{" "}
        <button onClick={() => void load()} className="underline font-medium">
          Prøv igen
        </button>
      </div>
    );
  if (!exercise) return null;

  const answered = result != null;
  const canRetry = answered && !result.correct && !singleShot;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="text-lg leading-relaxed">
        <MathText text={exercise.prompt.text} />
      </div>

      {/* svarfelt */}
      {exercise.input.kind === "point" && exercise.prompt.inputWidget ? (
        <GraphPlotter
          spec={exercise.prompt.inputWidget}
          onPickPoint={answered ? undefined : setPoint}
          pickedPoint={point}
        />
      ) : exercise.input.kind === "mcq" || exercise.input.kind === "multi" ? (
        <fieldset className="space-y-2" disabled={answered && result.correct}>
          <legend className="sr-only">Svarmuligheder</legend>
          {exercise.input.options.map((o) => (
            <label
              key={o.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                chosenOption === o.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name={`mcq-${exercise.instanceId}`}
                value={o.id}
                checked={chosenOption === o.id}
                onChange={() => setChosenOption(o.id)}
                className="h-4 w-4 accent-blue-600"
              />
              <span>
                <MathText text={o.text} />
              </span>
            </label>
          ))}
        </fieldset>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor={`answer-${exercise.instanceId}`}>
            Dit svar
          </label>
          <input
            id={`answer-${exercise.instanceId}`}
            type="text"
            inputMode={exercise.input.kind === "numeric" ? "decimal" : "text"}
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !answered) void submit();
            }}
            disabled={answered && result.correct}
            placeholder={
              exercise.input.kind === "numeric" ? "Skriv dit svar…" : "Skriv dit udtryk…"
            }
            className="w-56 rounded-xl border border-slate-300 px-4 py-2.5 text-lg focus:border-blue-500"
            autoComplete="off"
          />
          {exercise.input.kind === "numeric" && exercise.input.unitHint && (
            <span className="text-slate-500">{exercise.input.unitHint}</span>
          )}
        </div>
      )}

      {/* handlingsrække */}
      <div className="flex flex-wrap items-center gap-3">
        {(!answered || canRetry) && (
          <button
            onClick={() => {
              setResult(null);
              void submit();
            }}
            disabled={buildAnswer() == null}
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
          >
            Tjek svar
          </button>
        )}
        {!answered && exercise.hintCount > 0 && (
          <button
            onClick={() => void requestHint()}
            disabled={hints.length >= exercise.hintCount}
            className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 font-medium text-amber-900 hover:bg-amber-100 disabled:opacity-40"
          >
            💡 Hint ({hints.length}/{exercise.hintCount})
          </button>
        )}
        {answered && result.correct && !singleShot && (
          <button
            onClick={() => void load()}
            className="rounded-xl border border-slate-300 px-4 py-2.5 font-medium hover:bg-slate-50"
          >
            Ny opgave med nye tal →
          </button>
        )}
        {canRetry && wrongTries >= 2 && result.solutionSteps.length > 0 && (
          <button
            onClick={() => setShowSolution((s) => !s)}
            className="rounded-xl border border-slate-300 px-4 py-2.5 font-medium hover:bg-slate-50"
          >
            {showSolution ? "Skjul løsning" : "Se løsningen trin for trin"}
          </button>
        )}
      </div>

      {/* hint-stige */}
      {hints.length > 0 && (
        <ol className="space-y-2" aria-label="Hints">
          {hints.map((h) => (
            <li
              key={h.level}
              className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-950"
            >
              <span className="mr-2 font-semibold">Hint {h.level}:</span>
              <MathText text={h.text} />
            </li>
          ))}
        </ol>
      )}

      {/* feedback */}
      {answered && (
        <div
          role="status"
          className={`rounded-xl border p-4 ${
            result.correct
              ? "border-emerald-300 bg-emerald-50 text-emerald-950"
              : "border-orange-300 bg-orange-50 text-orange-950"
          }`}
        >
          <p className="font-semibold">
            {result.correct ? "✓ Rigtigt!" : "Ikke helt endnu…"}
          </p>
          {result.feedbackMessage && (
            <p className="mt-1">
              <MathText text={result.feedbackMessage} />
            </p>
          )}
          {!result.correct && result.misconception?.explanation && (
            <div className="mt-3 rounded-lg bg-white/70 p-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-800">
                Godt at vide
              </p>
              <p className="mt-1">
                <MathText text={result.misconception.explanation} />
              </p>
            </div>
          )}
          {result.correct && result.masteryUpdates.length > 0 && (
            <p className="mt-2 flex flex-wrap gap-2 text-sm">
              {result.masteryUpdates.map((m) => {
                const meta = MASTERY_META[m.level];
                return (
                  <span
                    key={m.kcCode}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1"
                  >
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: meta.color }}
                    />
                    {meta.name}
                  </span>
                );
              })}
            </p>
          )}
        </div>
      )}

      {/* worked solution (fade-endestation, doc 05 §5.6) */}
      {answered && (result.correct || showSolution) && result.solutionSteps.length > 0 && (
        <details className="rounded-xl border border-slate-200 p-4" open={showSolution}>
          <summary className="cursor-pointer font-medium text-slate-700">
            Løsning trin for trin
          </summary>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            {result.solutionSteps.map((s, i) => (
              <li key={i}>
                <MathText text={s} />
              </li>
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}
