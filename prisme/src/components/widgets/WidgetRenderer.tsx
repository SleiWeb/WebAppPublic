"use client";

import type { WidgetSpec } from "@/lib/content/schema";
import { FractionBar } from "./FractionBar";
import { GraphPlotter } from "./GraphPlotter";

/**
 * Widget-registret (doc 08 §8.3): widget-spec (JSON) → React-komponent.
 * Nye widget-typer registreres ét sted her og genbruges af alle fem fag.
 */
const REGISTRY: Record<
  string,
  React.ComponentType<{ spec: WidgetSpec }>
> = {
  "fraction-bar": FractionBar,
  "graph-plotter": GraphPlotter,
};

export function WidgetRenderer({ spec }: { spec: WidgetSpec }) {
  const Component = REGISTRY[spec.widgetType];
  if (!Component) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-4 text-slate-500">
        Widget-typen “{spec.widgetType}” er ikke registreret endnu.
      </p>
    );
  }
  return <Component spec={spec} />;
}
