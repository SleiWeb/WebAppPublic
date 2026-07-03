import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { getSession } from "@/lib/auth/session";
import { getSubjectProgress } from "@/lib/data/content";
import { SUBJECTS } from "@/lib/subjects";
import { ProgressBar } from "@/components/ui";
import { GraphPlotter } from "@/components/widgets/GraphPlotter";

export const dynamic = "force-dynamic";

/**
 * Forsiden (doc 04 §4.1): kerneløftet, en interaktiv demo-widget så
 * besøgende OPLEVER produktet med det samme, og de fem fagvalgs-kort
 * i spektrets farver. Logget ind viser kortene fremdrift.
 */
export default async function Home() {
  const session = await getSession();
  const progress = session ? await getSubjectProgress(session.userId) : null;

  return (
    <AppShell session={session}>
      <div className="space-y-12">
        {/* Hero */}
        <section className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
              Forstå det —{" "}
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-emerald-600 bg-clip-text text-transparent">
                så husk det.
              </span>
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Interaktiv naturvidenskab for 5.–9. klasse og gymnasiet. Eleverne
              opdager matematik og naturfag med modeller, de kan røre ved —
              træner til de mestrer det — og opgaverne retter sig selv, så
              læreren får overblik og tid tilbage.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {session ? (
                <Link
                  href={session.role === "teacher" ? "/laerer" : "/elev"}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Gå til dit overblik →
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    Prøv en lektion gratis
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-white"
                  >
                    For lærere & skoler
                  </Link>
                </>
              )}
            </div>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-900">
              🔒 Dansk data-tryghed: EU-hosting · Unilogin · databehandleraftale · ingen reklamer
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Prøv selv — træk i skyderne
            </p>
            <GraphPlotter
              spec={{
                widgetType: "graph-plotter",
                params: {
                  a: { min: -3, max: 3, default: 1, step: 0.5, label: "hældning a" },
                  b: { min: -5, max: 5, default: 1, step: 1, label: "skæring b" },
                },
                render: { expr: "a*x + b", domain: [-6, 6], range: [-8, 8] },
                interactions: ["dragSlider:a", "dragSlider:b"],
                readout: ["slope", "intercept"],
                emits: [],
                prompt: "Sådan føles Prisme: $y = ax + b$ bliver levende.",
              }}
            />
          </div>
        </section>

        {/* De fem fagvalgs-kort */}
        <section aria-labelledby="fag-overskrift">
          <h2 id="fag-overskrift" className="text-2xl font-bold">
            Ét prisme — hele spektret
          </h2>
          <p className="mt-1 text-slate-600">
            Fem fag, én måde at lære på: se det, gør det, mestr det.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {SUBJECTS.map((s) => {
              const pct = progress?.[s.id] ?? null;
              const card = (
                <div
                  className={`flex h-full flex-col rounded-2xl border-2 bg-white p-4 shadow-sm transition-transform ${
                    s.available ? "hover:-translate-y-0.5 hover:shadow-md" : "opacity-70"
                  }`}
                  style={{ borderColor: s.hex }}
                >
                  <span className="text-3xl" aria-hidden>
                    {s.emoji}
                  </span>
                  <span className="mt-2 text-lg font-bold" style={{ color: s.hex }}>
                    {s.name}
                  </span>
                  {s.available ? (
                    session && pct != null ? (
                      <span className="mt-auto pt-3">
                        <ProgressBar percent={pct} color={s.hex} label={`${s.name}: ${pct} % gennemført`} />
                        <span className="mt-1 block text-sm tabular-nums text-slate-600">{pct} %</span>
                      </span>
                    ) : (
                      <span className="mt-auto pt-3 text-sm font-medium text-slate-600">
                        7.–9. klasse · åben
                      </span>
                    )
                  ) : (
                    <span className="mt-auto pt-3 text-sm font-medium text-slate-400">
                      Kommer snart
                    </span>
                  )}
                </div>
              );
              return s.available ? (
                <Link key={s.id} href={`/fag/${s.id}`} className="rounded-2xl">
                  {card}
                </Link>
              ) : (
                <div key={s.id}>{card}</div>
              );
            })}
          </div>
        </section>

        {/* Tre løfter (doc 03 §3.2) */}
        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              who: "Elev",
              text: "”Jeg forstår det — ikke bare udenad. Og jeg kan se, at jeg bliver bedre.”",
            },
            {
              who: "Lærer",
              text: "”Jeg tildeler på 30 sekunder, retter aldrig, og ser med det samme, hvem der har brug for mig.”",
            },
            {
              who: "Skole",
              text: "”Fælles Mål-dækning, dokumenteret fremgang og dansk data-tryghed — ét sted for alle naturfag.”",
            },
          ].map((p) => (
            <blockquote key={p.who} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-slate-700">{p.text}</p>
              <footer className="mt-2 text-sm font-semibold text-slate-500">— {p.who}</footer>
            </blockquote>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
