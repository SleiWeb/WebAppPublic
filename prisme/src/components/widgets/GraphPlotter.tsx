"use client";

import { useMemo, useState, useCallback, type KeyboardEvent, type MouseEvent } from "react";
import { create, all } from "mathjs";
import type { WidgetSpec } from "@/lib/content/schema";
import { MathText } from "@/components/MathText";

const math = create(all, {});

type Props = {
  spec: WidgetSpec;
  /** pick-point-tilstand: kaldes når eleven vælger et punkt */
  onPickPoint?: (p: { x: number; y: number }) => void;
  pickedPoint?: { x: number; y: number } | null;
};

/**
 * Graf-plotter (doc 08 §8.3): widget-spec (JSON) → interaktiv modell.
 * Skydere ændrer parametre, linjen opdateres live. Kan også bruges som
 * svarfelt ("klik på punktet") i punkt-opgaver — med tastaturstyring
 * (piletaster + Enter) for WCAG-tilgængelighed.
 */
export function GraphPlotter({ spec, onPickPoint, pickedPoint }: Props) {
  const render = (spec.render ?? {}) as {
    expr?: string;
    hline?: string;
    domain?: [number, number];
    range?: [number, number];
    mode?: string;
    showIntersection?: boolean;
  };
  const pickMode = render.mode === "pick-point" || !!onPickPoint;

  const [params, setParams] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      Object.entries(spec.params).map(([k, p]) => [k, p.default])
    )
  );
  const [cursor, setCursor] = useState<{ x: number; y: number }>({ x: 1, y: 1 });

  const [xMin, xMax] = render.domain ?? [-6, 6];
  const [yMin, yMax] = render.range ?? [-8, 8];
  const W = 460;
  const H = 360;
  const sx = useCallback((x: number) => ((x - xMin) / (xMax - xMin)) * W, [xMin, xMax]);
  const sy = useCallback((y: number) => H - ((y - yMin) / (yMax - yMin)) * H, [yMin, yMax]);
  const invX = (px: number) => xMin + (px / W) * (xMax - xMin);
  const invY = (py: number) => yMin + ((H - py) / H) * (yMax - yMin);

  const compiled = useMemo(() => {
    try {
      return render.expr ? math.parse(render.expr).compile() : null;
    } catch {
      return null;
    }
  }, [render.expr]);

  const f = useCallback(
    (x: number): number | null => {
      if (!compiled) return null;
      try {
        const v = Number(compiled.evaluate({ ...params, x }));
        return Number.isFinite(v) ? v : null;
      } catch {
        return null;
      }
    },
    [compiled, params]
  );

  const hlineValue = useMemo(() => {
    if (render.hline == null) return null;
    const v = params[render.hline] ?? Number(render.hline);
    return Number.isFinite(v) ? v : null;
  }, [render.hline, params]);

  // lineær antagelse til skæringspunkt: x* hvor f(x) = c
  const intersection = useMemo(() => {
    if (hlineValue == null || !compiled) return null;
    const f0 = f(0);
    const f1 = f(1);
    if (f0 == null || f1 == null || f1 - f0 === 0) return null;
    const x = (hlineValue - f0) / (f1 - f0);
    return { x, y: hlineValue };
  }, [hlineValue, compiled, f]);

  const linePoints = useMemo(() => {
    if (!compiled) return "";
    const pts: string[] = [];
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + ((xMax - xMin) * i) / steps;
      const y = f(x);
      if (y == null) continue;
      pts.push(`${sx(x)},${sy(Math.max(yMin - 2, Math.min(yMax + 2, y)))}`);
    }
    return pts.join(" ");
  }, [compiled, f, sx, sy, xMin, xMax, yMin, yMax]);

  const gridLines = [];
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) gridLines.push({ v: true, at: x });
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) gridLines.push({ v: false, at: y });

  const snap = (v: number) => Math.round(v * 2) / 2;

  function handleClick(e: MouseEvent<SVGSVGElement>) {
    if (!pickMode || !onPickPoint) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const py = ((e.clientY - rect.top) / rect.height) * H;
    const p = { x: snap(invX(px)), y: snap(invY(py)) };
    setCursor(p);
    onPickPoint(p);
  }

  function handleKey(e: KeyboardEvent<SVGSVGElement>) {
    if (!pickMode || !onPickPoint) return;
    const step = 0.5;
    let { x, y } = cursor;
    if (e.key === "ArrowLeft") x -= step;
    else if (e.key === "ArrowRight") x += step;
    else if (e.key === "ArrowUp") y += step;
    else if (e.key === "ArrowDown") y -= step;
    else if (e.key === "Enter" || e.key === " ") {
      onPickPoint({ x, y });
      e.preventDefault();
      return;
    } else return;
    e.preventDefault();
    x = Math.max(xMin, Math.min(xMax, x));
    y = Math.max(yMin, Math.min(yMax, y));
    setCursor({ x, y });
    onPickPoint({ x, y });
  }

  const shown = pickedPoint ?? (pickMode ? cursor : null);
  const readouts = spec.readout ?? [];

  return (
    <div className="space-y-3">
      {spec.prompt && (
        <p className="text-slate-700">
          <MathText text={spec.prompt} />
        </p>
      )}
      <div className="flex flex-wrap gap-6 items-start">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`w-full max-w-md rounded-xl border border-slate-300 bg-white ${pickMode ? "cursor-crosshair" : ""}`}
          role={pickMode ? "application" : "img"}
          aria-label={
            pickMode
              ? `Koordinatsystem. Brug piletasterne til at flytte punktet og Enter for at vælge. Valgt punkt: (${shown?.x ?? "-"}, ${shown?.y ?? "-"})`
              : `Graf for ${render.expr ?? "funktionen"}`
          }
          tabIndex={pickMode ? 0 : -1}
          onClick={handleClick}
          onKeyDown={handleKey}
        >
          {gridLines.map((g, i) =>
            g.v ? (
              <line key={i} x1={sx(g.at)} y1={0} x2={sx(g.at)} y2={H} stroke={g.at === 0 ? "#334155" : "#e2e8f0"} strokeWidth={g.at === 0 ? 2 : 1} />
            ) : (
              <line key={i} x1={0} y1={sy(g.at)} x2={W} y2={sy(g.at)} stroke={g.at === 0 ? "#334155" : "#e2e8f0"} strokeWidth={g.at === 0 ? 2 : 1} />
            )
          )}
          {/* akse-tal */}
          {[xMin + 1, -2, 2, xMax - 1].filter((v, i, a) => v !== 0 && a.indexOf(v) === i && v > xMin && v < xMax).map((v) => (
            <text key={`x${v}`} x={sx(v) + 2} y={sy(0) + 14} fontSize="11" fill="#64748b">{v}</text>
          ))}
          {[yMin + 1, -2, 2, yMax - 1].filter((v, i, a) => v !== 0 && a.indexOf(v) === i && v > yMin && v < yMax).map((v) => (
            <text key={`y${v}`} x={sx(0) + 4} y={sy(v) - 2} fontSize="11" fill="#64748b">{v}</text>
          ))}

          {linePoints && (
            <polyline points={linePoints} fill="none" stroke="#2563eb" strokeWidth="3" />
          )}
          {hlineValue != null && (
            <line x1={0} y1={sy(hlineValue)} x2={W} y2={sy(hlineValue)} stroke="#ea580c" strokeWidth="2.5" strokeDasharray="6 4" />
          )}
          {render.showIntersection && intersection && (
            <g>
              <circle cx={sx(intersection.x)} cy={sy(intersection.y)} r="7" fill="#10b981" stroke="#fff" strokeWidth="2" />
            </g>
          )}
          {pickMode && shown && (
            <g>
              <circle cx={sx(shown.x)} cy={sy(shown.y)} r="8" fill="#2563eb" stroke="#fff" strokeWidth="2.5" />
            </g>
          )}
        </svg>

        <div className="min-w-56 flex-1 space-y-4">
          {Object.entries(spec.params).map(([name, p]) => (
            <label key={name} className="block">
              <span className="text-sm font-medium text-slate-700">
                {p.label ?? name}:{" "}
                <strong className="tabular-nums">{params[name]}</strong>
              </span>
              <input
                type="range"
                min={p.min}
                max={p.max}
                step={p.step ?? 1}
                value={params[name]}
                onChange={(e) =>
                  setParams((prev) => ({ ...prev, [name]: Number(e.target.value) }))
                }
                className="mt-1 w-full accent-blue-600"
                aria-valuetext={`${p.label ?? name} er ${params[name]}`}
              />
            </label>
          ))}

          {readouts.length > 0 && (
            <dl className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm space-y-1" aria-live="polite">
              {readouts.includes("slope") && (
                <div className="flex justify-between"><dt>Hældning (a)</dt><dd className="font-semibold tabular-nums">{params.a}</dd></div>
              )}
              {readouts.includes("intercept") && (
                <div className="flex justify-between"><dt>Skæring med y-aksen (b)</dt><dd className="font-semibold tabular-nums">{params.b}</dd></div>
              )}
              {readouts.includes("intersection") && intersection && (
                <div className="flex justify-between">
                  <dt>Løsning (krydset)</dt>
                  <dd className="font-semibold tabular-nums">
                    x = {Math.round(intersection.x * 100) / 100}
                  </dd>
                </div>
              )}
            </dl>
          )}

          {pickMode && shown && (
            <p className="text-sm text-slate-600" aria-live="polite">
              Valgt punkt: <strong className="tabular-nums">({fmt(shown.x)}, {fmt(shown.y)})</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function fmt(v: number): string {
  return String(Math.round(v * 100) / 100).replace(".", ",");
}
