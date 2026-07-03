"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { LessonBlock } from "@/lib/content/schema";
import { MathText } from "@/components/MathText";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import { ExercisePlayer } from "@/components/exercise/ExercisePlayer";
import { CheckpointRunner } from "./CheckpointRunner";
import { WorkedExample } from "./WorkedExample";

type Props = {
  lessonSlug: string;
  title: string;
  blocks: LessonBlock[];
  assignmentId?: string;
  backHref: string;
};

/**
 * Lektionsafspilleren (doc 05): blokkene afsløres én ad gangen —
 * hver skærm har én interaktiv handling, aldrig en væg af tekst.
 * Læringssløjfen Forklar → Udforsk → Prøv → Træn → Tjek ligger i
 * blokkenes rækkefølge (indhold er data, doc 06 §6.6).
 */
export function LessonPlayer({ lessonSlug, title, blocks, assignmentId, backHref }: Props) {
  const [revealed, setRevealed] = useState(0);
  const [done, setDone] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (revealed > 0)
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    // rapportér grovkornet fremdrift
    void fetch("/api/lesson/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonSlug,
        percent: Math.round((revealed / blocks.length) * 90),
      }),
    });
  }, [revealed, lessonSlug, blocks.length]);

  const advance = () => setRevealed((r) => Math.min(r + 1, blocks.length - 1));
  const visibleBlocks = blocks.slice(0, revealed + 1);
  const atLastBlock = revealed >= blocks.length - 1;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 pb-24">
      {/* fremdriftslinje */}
      <div
        className="sticky top-0 z-10 -mx-1 bg-[var(--background)]/95 px-1 py-3 backdrop-blur"
        role="progressbar"
        aria-valuenow={revealed + 1}
        aria-valuemin={1}
        aria-valuemax={blocks.length}
        aria-label={`Skridt ${revealed + 1} af ${blocks.length}`}
      >
        <div className="flex items-center gap-3">
          <Link href={backHref} className="text-sm text-slate-500 hover:text-slate-800">
            ← Tilbage
          </Link>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${((revealed + 1) / blocks.length) * 100}%` }}
            />
          </div>
          <span className="text-sm tabular-nums text-slate-500">
            {revealed + 1}/{blocks.length}
          </span>
        </div>
      </div>

      <h1 className="text-2xl font-bold">{title}</h1>

      {visibleBlocks.map((block, i) => (
        <section
          key={i}
          className={i < revealed ? "opacity-70" : ""}
          aria-current={i === revealed ? "step" : undefined}
        >
          <BlockView
            block={block}
            active={i === revealed}
            lessonSlug={lessonSlug}
            assignmentId={assignmentId}
            isLast={i === blocks.length - 1}
            onComplete={() => {
              if (i === blocks.length - 1) setDone(true);
              else if (i === revealed) advance();
            }}
          />
        </section>
      ))}

      {done && atLastBlock && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-center">
          <p className="text-xl font-bold text-emerald-900">Lektionen er gennemført 🎉</p>
          <p className="mt-1 text-emerald-800">
            Godt arbejde — det du har lært, dukker op i din repetition, så det sidder fast.
          </p>
          <Link
            href={backHref}
            className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700"
          >
            Tilbage til fagkortet
          </Link>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}

function BlockView({
  block,
  active,
  lessonSlug,
  assignmentId,
  onComplete,
}: {
  block: LessonBlock;
  active: boolean;
  lessonSlug: string;
  assignmentId?: string;
  isLast: boolean;
  onComplete: () => void;
}) {
  switch (block.type) {
    case "text":
      return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-lg leading-relaxed">
            <MathText text={block.body} />
          </p>
          {active && (
            <button
              onClick={onComplete}
              className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Forstået — videre
            </button>
          )}
        </div>
      );

    case "figure":
      return (
        <figure className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {block.svg ? (
            <div dangerouslySetInnerHTML={{ __html: block.svg }} aria-hidden />
          ) : block.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={block.src} alt={block.alt} className="max-w-full" />
          ) : null}
          {block.caption && (
            <figcaption className="mt-2 text-sm text-slate-600">{block.caption}</figcaption>
          )}
          {active && (
            <button
              onClick={onComplete}
              className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Videre
            </button>
          )}
        </figure>
      );

    case "widget":
    case "simulation": {
      const spec =
        block.type === "widget"
          ? block
          : {
              widgetType: block.simType,
              params: {},
              render: block.initialState,
              interactions: block.controls,
              readout: [],
              emits: [],
              prompt: block.prompt,
            };
      return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <WidgetRenderer spec={spec} />
          {active && (
            <button
              onClick={onComplete}
              className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Jeg har udforsket — videre
            </button>
          )}
        </div>
      );
    }

    case "workedExample":
      return (
        <WorkedExample
          title={block.title}
          steps={block.steps}
          active={active}
          onComplete={onComplete}
        />
      );

    case "exerciseRef":
      return (
        <PracticeSet
          templateId={block.templateId}
          count={block.count}
          active={active}
          assignmentId={assignmentId}
          onComplete={onComplete}
        />
      );

    case "checkpoint":
      return (
        <CheckpointRunner
          lessonSlug={lessonSlug}
          templateIds={block.templateIds}
          passRule={block.passRule}
          active={active}
          assignmentId={assignmentId}
          onComplete={onComplete}
        />
      );
  }
}

/** Træn-blok: genererede opgaver; videre når målet er nået (doc 05 §5.5). */
function PracticeSet({
  templateId,
  count,
  active,
  assignmentId,
  onComplete,
}: {
  templateId: string;
  count: number;
  active: boolean;
  assignmentId?: string;
  onComplete: () => void;
}) {
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const goalReached = correct >= count || attempts >= count * 2 + 2;

  if (!active && attempts === 0)
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-500">
        Træningsopgaver ({count} stk.)
      </p>
    );

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-sm font-medium text-slate-600">
        Træn:
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            aria-hidden
            className={`inline-block h-3 w-3 rounded-full ${
              i < correct ? "bg-emerald-500" : "bg-slate-300"
            }`}
          />
        ))}
        <span className="sr-only">
          {correct} af {count} opgaver løst
        </span>
      </p>
      <ExercisePlayer
        templateSlug={templateId}
        context="lesson"
        assignmentId={assignmentId}
        onAttempt={(ok) => {
          setAttempts((a) => a + 1);
          if (ok) setCorrect((c) => c + 1);
        }}
      />
      {active && goalReached && (
        <button
          onClick={onComplete}
          className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
        >
          Videre →
        </button>
      )}
    </div>
  );
}
