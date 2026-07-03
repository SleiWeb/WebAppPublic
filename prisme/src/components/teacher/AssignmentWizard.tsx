"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Student = { id: string; name: string };
type LessonOpt = { slug: string; title: string; moduleTitle: string };
type TemplateOpt = { slug: string; title: string | null; difficulty: number };

/**
 * Tildelingsflowet i ≤3 skridt (doc 04 §4.7):
 * 1) Vælg indhold  2) Vælg modtagere (+ differentiering)  3) Sæt rammer → Tildel.
 */
export function AssignmentWizard({
  students,
  lessons,
  templates,
}: {
  students: Student[];
  lessons: LessonOpt[];
  templates: TemplateOpt[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // skridt 1: indhold
  const [content, setContent] = useState<{
    itemType: "lesson" | "template";
    refSlug: string;
    title: string;
  } | null>(null);

  // skridt 2: modtagere + differentiering
  const [allStudents, setAllStudents] = useState(true);
  const [selected, setSelected] = useState<Record<string, number>>({}); // userId -> levelOffset

  // skridt 3: rammer
  const [dueAt, setDueAt] = useState(() => {
    const d = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 10);
  });
  const [mode, setMode] = useState<"homework" | "in_class" | "review">("homework");
  const [masteryGoal, setMasteryGoal] = useState(2);

  async function submit() {
    if (!content) return;
    setSaving(true);
    setError(null);
    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: content.title,
        itemType: content.itemType,
        refSlug: content.refSlug,
        mode,
        dueAt: dueAt ? new Date(`${dueAt}T15:00:00`).toISOString() : null,
        masteryGoal,
        targetCount: content.itemType === "template" ? 6 : undefined,
        recipients: allStudents
          ? "all"
          : Object.entries(selected).map(([userId, levelOffset]) => ({
              userId,
              levelOffset,
            })),
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setError((await res.json()).error ?? "Noget gik galt");
      return;
    }
    router.push("/laerer");
    router.refresh();
  }

  const steps = ["Vælg indhold", "Vælg modtagere", "Sæt rammer"];

  return (
    <div className="space-y-6">
      {/* skridt-indikator */}
      <ol className="flex gap-2" aria-label="Skridt i tildelingen">
        {steps.map((label, i) => (
          <li
            key={label}
            aria-current={step === i + 1 ? "step" : undefined}
            className={`flex-1 rounded-xl border px-3 py-2 text-center text-sm font-medium ${
              step === i + 1
                ? "border-blue-500 bg-blue-50 text-blue-900"
                : step > i + 1
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-400"
            }`}
          >
            {step > i + 1 ? "✓ " : `${i + 1}. `}
            {label}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section className="space-y-4">
          <h2 className="font-bold">Lektioner (hele læringssløjfen)</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {lessons.map((l) => (
              <button
                key={l.slug}
                onClick={() => {
                  setContent({ itemType: "lesson", refSlug: l.slug, title: l.title });
                  setStep(2);
                }}
                className={`rounded-xl border p-3 text-left hover:border-blue-400 ${
                  content?.refSlug === l.slug ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"
                }`}
              >
                <span className="block font-semibold">{l.title}</span>
                <span className="text-sm text-slate-500">{l.moduleTitle}</span>
              </button>
            ))}
          </div>
          <h2 className="font-bold">Opgavesæt (genereret træning)</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {templates.map((x) => (
              <button
                key={x.slug}
                onClick={() => {
                  setContent({
                    itemType: "template",
                    refSlug: x.slug,
                    title: `Træning: ${x.title ?? x.slug}`,
                  });
                  setStep(2);
                }}
                className={`rounded-xl border p-3 text-left hover:border-blue-400 ${
                  content?.refSlug === x.slug ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"
                }`}
              >
                <span className="block font-semibold">{x.title}</span>
                <span className="text-sm text-slate-500">
                  Sværhedsgrad {x.difficulty}/5 · 6 opgaver med nye tal pr. elev
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <p className="rounded-xl bg-slate-100 px-4 py-2 text-sm">
            Indhold: <strong>{content?.title}</strong>
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setAllStudents(true)}
              className={`rounded-xl border px-4 py-2.5 font-medium ${
                allStudents ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"
              }`}
            >
              Hele holdet ({students.length})
            </button>
            <button
              onClick={() => setAllStudents(false)}
              className={`rounded-xl border px-4 py-2.5 font-medium ${
                !allStudents ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"
              }`}
            >
              Vælg elever + differentiering
            </button>
          </div>

          {!allStudents && (
            <ul className="grid gap-2 sm:grid-cols-2">
              {students.map((s) => {
                const isSelected = s.id in selected;
                return (
                  <li key={s.id} className={`flex items-center gap-3 rounded-xl border p-3 ${isSelected ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white"}`}>
                    <label className="flex flex-1 cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) =>
                          setSelected((prev) => {
                            const next = { ...prev };
                            if (e.target.checked) next[s.id] = 0;
                            else delete next[s.id];
                            return next;
                          })
                        }
                        className="h-4 w-4 accent-blue-600"
                      />
                      {s.name}
                    </label>
                    {isSelected && (
                      <label className="text-sm text-slate-600">
                        Niveau{" "}
                        <select
                          value={selected[s.id]}
                          onChange={(e) =>
                            setSelected((prev) => ({ ...prev, [s.id]: Number(e.target.value) }))
                          }
                          className="rounded-lg border border-slate-300 px-2 py-1"
                        >
                          <option value={-1}>Lettere (−1)</option>
                          <option value={0}>Standard</option>
                          <option value={1}>Sværere (+1)</option>
                        </select>
                      </label>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium hover:bg-white">
              ← Tilbage
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!allStudents && Object.keys(selected).length === 0}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
            >
              Videre →
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-4">
          <p className="rounded-xl bg-slate-100 px-4 py-2 text-sm">
            <strong>{content?.title}</strong> →{" "}
            {allStudents ? `hele holdet (${students.length})` : `${Object.keys(selected).length} elever`}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Frist</span>
              <input
                type="date"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Type</span>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as typeof mode)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
              >
                <option value="homework">Lektie</option>
                <option value="in_class">I timen</option>
                <option value="review">Repetition</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Mål for mestring</span>
              <select
                value={masteryGoal}
                onChange={(e) => setMasteryGoal(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
              >
                <option value={1}>Øvet</option>
                <option value={2}>Sikker</option>
                <option value={3}>Mester</option>
              </select>
            </label>
          </div>
          {error && <p className="text-red-700">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium hover:bg-white">
              ← Tilbage
            </button>
            <button
              onClick={() => void submit()}
              disabled={saving}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? "Tildeler…" : "Tildel ✓"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
