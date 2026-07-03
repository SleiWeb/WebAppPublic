"use client";

import { useState } from "react";
import type { WidgetSpec } from "@/lib/content/schema";
import { MathText } from "@/components/MathText";

type Fraction = { num: number; den: number };

/**
 * Brøkstang (doc 05 §5.4): brøker som længder. Skyderen deler stangen i n
 * dele — når n er delelig med begge nævnere, "klikker" brøkerne på plads,
 * og summen kan aflæses. Tastatur: skyderen er et native range-input.
 */
export function FractionBar({ spec }: { spec: WidgetSpec }) {
  const render = (spec.render ?? {}) as {
    fractions?: Fraction[];
    showSum?: boolean;
  };
  const fractions = render.fractions ?? [
    { num: 1, den: 2 },
    { num: 1, den: 3 },
  ];
  const param = spec.params.n ?? { min: 2, max: 24, default: 2, step: 1 };
  const [n, setN] = useState(param.default);

  const allDivisible = fractions.every((f) => n % f.den === 0);
  const sumNum = allDivisible
    ? fractions.reduce((acc, f) => acc + (f.num * n) / f.den, 0)
    : 0;

  const W = 560;
  const H = 64;
  const colors = ["#2563eb", "#7c3aed", "#0ea5e9"];

  return (
    <div className="space-y-4">
      {spec.prompt && (
        <p className="text-slate-700">
          <MathText text={spec.prompt} />
        </p>
      )}

      <div className="space-y-3">
        {fractions.map((f, fi) => {
          const divisible = n % f.den === 0;
          const eqNum = (f.num * n) / f.den;
          return (
            <figure key={fi}>
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full max-w-xl"
                role="img"
                aria-label={`Brøkstang der viser ${f.num}/${f.den}, opdelt i ${n} dele${divisible ? `, svarer til ${eqNum}/${n}` : ", stregerne passer ikke med brøken"}`}
              >
                <rect x="0" y="8" width={W} height="40" rx="6" fill="#e2e8f0" />
                <rect
                  x="0"
                  y="8"
                  width={(W * f.num) / f.den}
                  height="40"
                  rx="6"
                  fill={colors[fi % colors.length]}
                  opacity="0.85"
                />
                {Array.from({ length: n - 1 }, (_, i) => (
                  <line
                    key={i}
                    x1={(W * (i + 1)) / n}
                    y1="8"
                    x2={(W * (i + 1)) / n}
                    y2="48"
                    stroke="#fff"
                    strokeWidth={divisible ? 2.5 : 1}
                    opacity={divisible ? 1 : 0.55}
                  />
                ))}
                <rect x="0" y="8" width={W} height="40" rx="6" fill="none" stroke="#475569" />
              </svg>
              <figcaption className="mt-1 text-sm text-slate-600" aria-live="polite">
                <MathText text={`$\\frac{${f.num}}{${f.den}}$`} />{" "}
                {divisible ? (
                  <span className="font-medium text-emerald-700">
                    = <MathText text={`$\\frac{${eqNum}}{${n}}$`} /> — passer med stregerne ✓
                  </span>
                ) : (
                  <span className="text-slate-500">passer ikke med {n} dele</span>
                )}
              </figcaption>
            </figure>
          );
        })}
      </div>

      <label className="block max-w-xl">
        <span className="text-sm font-medium text-slate-700">
          {param.label ?? "Antal dele"}: <strong className="tabular-nums">{n}</strong>
        </span>
        <input
          type="range"
          min={param.min}
          max={param.max}
          step={param.step ?? 1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="mt-1 w-full accent-blue-600"
          aria-valuetext={`${n} dele`}
        />
      </label>

      {render.showSum && (
        <p
          className="rounded-lg border p-3 text-slate-800 max-w-xl"
          style={{
            borderColor: allDivisible ? "#10b981" : "#e2e8f0",
            background: allDivisible ? "#ecfdf5" : "#f8fafc",
          }}
          aria-live="polite"
        >
          {allDivisible ? (
            <>
              🎉 Med <strong>{n} dele</strong> passer begge brøker! Summen:{" "}
              <MathText
                text={`$${fractions
                  .map((f) => `\\frac{${(f.num * n) / f.den}}{${n}}`)
                  .join(" + ")} = \\frac{${sumNum}}{${n}}$`}
              />
            </>
          ) : (
            <>Træk i skyderen, til stregerne passer med begge brøker …</>
          )}
        </p>
      )}
    </div>
  );
}
