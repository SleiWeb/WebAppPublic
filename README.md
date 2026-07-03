# Prisme — Matematik & Fysik (prototype)

## Kør lokalt

```bash
npm install
npm run dev
```

## Fysik (`/fysik`)

Komplet fysikfag, der dækker hele pensum fra **7. klasse til Fysik A (3.g)**:

- **44 emner på 6 niveauer** (7.–9. klasse jf. Fælles Mål; Fysik C/B/A jf. gymnasiets læreplaner) med teori, læringsmål, formler og gennemregnede eksempler — `src/fysik/emner/`.
- **95 parametriske opgavegeneratorer** med auto-retning, hints og fulde løsninger — `src/fysik/opgaver/`. Numeriske svar accepterer dansk komma-notation og rettes med tolerance.
- **Formelsamling** (`/fysik/formler`) med alle formler filtreret pr. niveau.
- Progression pr. emne gemmes i `localStorage` (`src/fysik/progress.ts`), adskilt fra matematik-progressionen.

Ruter: `/fysik` (fag-forside med niveauvælger), `/fysik/emne/:emneId` (teori), `/fysik/traen/:emneId` (træningsrunde à 8 opgaver), `/fysik/formler`.

## Noter

- Progression gemmes i `localStorage` via `src/progress/storage.ts`.
- Mastery opdateres pr. **forsøg** (ikke kun pr. afsluttet opgave) via events fra `PracticeSession`.
- Adaptive mode bruger IRT (`src/adaptive/irt.ts`): `theta` opdateres pr. forsøg og næste item-niveau vælges via `chooseLevelFromTheta(theta)`.
- Area model og kolonneaddition er fjernet fra UI (kan genintroduceres senere).
