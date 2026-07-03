// Letvægts-progression for fysikfaget, gemt i localStorage (adskilt fra matematik-progressen).

export type FysikEmneProgress = {
  forsoeg: number;
  korrekte: number;
  /** 0..1 — stiger ved korrekte svar, falder let ved fejl. */
  mastery: number;
  sidst: number; // timestamp
};

export type FysikProgress = {
  emner: Record<string, FysikEmneProgress>;
};

const KEY = "fysik_progress_v1";

export function hentFysikProgress(): FysikProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as FysikProgress;
      if (parsed && typeof parsed === "object" && parsed.emner) return parsed;
    }
  } catch {
    // korrupt data -> start forfra
  }
  return { emner: {} };
}

function gem(p: FysikProgress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // ignore (fx private mode)
  }
}

export function progressForEmne(emneId: string): FysikEmneProgress {
  return (
    hentFysikProgress().emner[emneId] ?? { forsoeg: 0, korrekte: 0, mastery: 0, sidst: 0 }
  );
}

/** Registrér ét svar og returnér den opdaterede emne-progress. */
export function registrerSvar(emneId: string, korrekt: boolean): FysikEmneProgress {
  const p = hentFysikProgress();
  const cur = p.emner[emneId] ?? { forsoeg: 0, korrekte: 0, mastery: 0, sidst: 0 };
  const next: FysikEmneProgress = {
    forsoeg: cur.forsoeg + 1,
    korrekte: cur.korrekte + (korrekt ? 1 : 0),
    mastery: Math.max(0, Math.min(1, cur.mastery + (korrekt ? 0.12 : -0.08))),
    sidst: Date.now(),
  };
  p.emner[emneId] = next;
  gem(p);
  return next;
}

export type EmneStatus = "ny" | "i-gang" | "mestret";

export function statusForEmne(emneId: string): EmneStatus {
  const p = progressForEmne(emneId);
  if (p.mastery >= 0.95) return "mestret";
  if (p.forsoeg > 0) return "i-gang";
  return "ny";
}
