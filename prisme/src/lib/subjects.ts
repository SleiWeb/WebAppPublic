/** De fem fag som ét spektrum (README: fagfarver). */
export const SUBJECTS = [
  { id: "math", name: "Matematik", color: "var(--subject-math)", hex: "#2563eb", emoji: "📈", available: true },
  { id: "physics", name: "Fysik", color: "var(--subject-physics)", hex: "#7c3aed", emoji: "🪀", available: false },
  { id: "chemistry", name: "Kemi", color: "var(--subject-chemistry)", hex: "#16a34a", emoji: "🧪", available: false },
  { id: "biology", name: "Biologi", color: "var(--subject-biology)", hex: "#ea580c", emoji: "🌿", available: false },
  { id: "geography", name: "Geografi", color: "var(--subject-geography)", hex: "#ca8a04", emoji: "🌍", available: false },
] as const;

export type SubjectMeta = (typeof SUBJECTS)[number];

export function subjectById(id: string): SubjectMeta | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export const MASTERY_META = [
  { level: 0, name: "Ny", color: "var(--mastery-0)", hex: "#94a3b8" },
  { level: 1, name: "Øvet", color: "var(--mastery-1)", hex: "#f59e0b" },
  { level: 2, name: "Sikker", color: "var(--mastery-2)", hex: "#0ea5e9" },
  { level: 3, name: "Mester", color: "var(--mastery-3)", hex: "#10b981" },
] as const;
