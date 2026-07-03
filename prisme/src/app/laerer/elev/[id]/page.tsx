import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { getSession } from "@/lib/auth/session";
import { getStudentDrilldown, logStudentDataAccess } from "@/lib/data/teacher";
import { MASTERY_META } from "@/lib/subjects";
import { MasteryBadge } from "@/components/ui";
import type { SubmittedAnswer } from "@/lib/engine/types";

export const dynamic = "force-dynamic";

/**
 * Drill-down (doc 04 §4.4): elevens konkrete forsøg — svar, hints brugt og
 * diagnosticeret misforståelse. Det er her lærerens tid spares og indsatsen
 * målrettes. Adgangen audit-logges (GDPR, doc 07 §7.8).
 */
export default async function StudentDrilldownPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "teacher") redirect("/elev");

  const { id } = await params;
  const data = await getStudentDrilldown(id);
  if (!data) notFound();

  await logStudentDataAccess(session.userId, id);

  const wrongWithDiagnosis = data.attempts.filter((a) => a.misconceptionName);

  return (
    <AppShell session={session}>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/laerer" className="text-sm text-slate-500 hover:text-slate-800">
            ← 8.B Matematik
          </Link>
          <h1 className="w-full text-3xl font-bold">{data.student.displayName}</h1>
        </div>

        {/* Mestring pr. emne */}
        <section aria-labelledby="mestring-h">
          <h2 id="mestring-h" className="text-lg font-bold">Mestring pr. emne</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {data.mastery
              .filter((m) => m.attempts > 0)
              .map((m) => (
                <li key={m.kcCode} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
                  <span className="flex-1 font-medium">{m.kcName}</span>
                  <MasteryBadge level={m.level} />
                  <span className="text-sm tabular-nums text-slate-400">
                    {m.attempts} forsøg
                  </span>
                </li>
              ))}
          </ul>
        </section>

        {/* Typiske fejl */}
        {wrongWithDiagnosis.length > 0 && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
            <h2 className="font-bold text-amber-950">Typiske fejlmønstre</h2>
            <ul className="mt-2 space-y-1 text-amber-950">
              {[...new Set(wrongWithDiagnosis.map((a) => a.misconceptionName))]
                .slice(0, 4)
                .map((name) => (
                  <li key={name}>
                    • {name} (
                    {wrongWithDiagnosis.filter((a) => a.misconceptionName === name).length}{" "}
                    gange)
                  </li>
                ))}
            </ul>
          </section>
        )}

        {/* Konkrete forsøg */}
        <section aria-labelledby="forsog-h">
          <h2 id="forsog-h" className="text-lg font-bold">
            Seneste forsøg ({data.attempts.length})
          </h2>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th scope="col" className="px-4 py-2.5 font-medium">Tidspunkt</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Opgave</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Elevens svar</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Resultat</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Hints</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Diagnose</th>
                </tr>
              </thead>
              <tbody>
                {data.attempts.map((a) => (
                  <tr key={a.id} className="border-b border-slate-100 last:border-0">
                    <td className="whitespace-nowrap px-4 py-2.5 tabular-nums text-slate-500">
                      {a.createdAt.toLocaleString("da-DK", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-2.5">{a.templateTitle}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">
                      {formatAnswer(a.submittedAnswer as SubmittedAnswer | null)}
                    </td>
                    <td className="px-4 py-2.5">
                      {a.isCorrect ? (
                        <span className="font-medium text-emerald-700">✓ Rigtigt</span>
                      ) : (
                        <span className="font-medium text-orange-700">✗ Forkert</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums">{a.hintsUsed || "—"}</td>
                    <td className="px-4 py-2.5">
                      {a.misconceptionName ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                          {a.misconceptionName}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="flex flex-wrap gap-3 text-xs text-slate-500">
          {MASTERY_META.map((m) => (
            <span key={m.level} className="inline-flex items-center gap-1">
              <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: m.color }} />
              {m.name}
            </span>
          ))}
          <span className="ml-auto">Adgang til elevdata logges (GDPR).</span>
        </p>
      </div>
    </AppShell>
  );
}

function formatAnswer(answer: SubmittedAnswer | null): string {
  if (!answer) return "—";
  switch (answer.kind) {
    case "numeric":
    case "expression":
      return answer.raw;
    case "mcq":
      return `valg: ${answer.optionId}`;
    case "multi":
      return `valg: ${answer.optionIds.join(", ")}`;
    case "point":
      return `(${answer.x}, ${answer.y})`;
  }
}
