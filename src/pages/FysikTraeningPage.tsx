import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import type { Opgave } from "../fysik/model";
import { findEmne } from "../fysik/pensum";
import { lavOpgave, OPGAVE_GENERATORER } from "../fysik/opgaver";
import { progressForEmne, registrerSvar } from "../fysik/progress";
import "./Fysik.css";

const ANTAL_OPGAVER = 8;

function bland<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Parse dansk talinput: komma som decimaltegn, mellemrum ignoreres. */
function parseSvar(s: string): number | null {
  const renset = s.trim().replace(/\s/g, "").replace(",", ".");
  if (renset === "") return null;
  const x = Number(renset);
  return Number.isFinite(x) ? x : null;
}

function erKorrektTal(svar: number, facit: number, tolerancePct: number): boolean {
  const tolerance = Math.max((Math.abs(facit) * tolerancePct) / 100, 0.005);
  return Math.abs(svar - facit) <= tolerance;
}

export default function FysikTraeningPage() {
  const { emneId } = useParams<{ emneId: string }>();
  const emne = emneId ? findEmne(emneId) : undefined;

  const generatorIds = useMemo(
    () => (emne ? emne.opgaver.filter((id) => OPGAVE_GENERATORER[id]) : []),
    [emne]
  );

  const [raekkefoelge, setRaekkefoelge] = useState<string[]>([]);
  const [runde, setRunde] = useState(0);
  const [resultater, setResultater] = useState<boolean[]>([]);
  const [opgave, setOpgave] = useState<Opgave | null>(null);
  const [svarTekst, setSvarTekst] = useState("");
  const [valgt, setValgt] = useState<number | null>(null);
  const [bedoemt, setBedoemt] = useState<boolean | null>(null);
  const [hintVist, setHintVist] = useState(false);
  const [mastery, setMastery] = useState(0);

  const nulstil = useCallback(() => {
    const orden = bland(generatorIds);
    setRaekkefoelge(orden);
    setRunde(0);
    setResultater([]);
    setSvarTekst("");
    setValgt(null);
    setBedoemt(null);
    setHintVist(false);
    setOpgave(orden.length > 0 ? lavOpgave(orden[0]) : null);
    if (emne) setMastery(progressForEmne(emne.id).mastery);
  }, [generatorIds, emne]);

  useEffect(() => {
    nulstil();
  }, [nulstil]);

  if (!emne) return <Navigate to="/fysik" replace />;

  // Færdig først når man har klikket videre fra sidste opgave, så løsningen altid kan læses.
  const faerdig = runde >= ANTAL_OPGAVER;
  const korrekte = resultater.filter(Boolean).length;

  const bedoem = (ok: boolean) => {
    setBedoemt(ok);
    setResultater((r) => [...r, ok]);
    const next = registrerSvar(emne.id, ok);
    setMastery(next.mastery);
  };

  const tjekTal = () => {
    if (!opgave || opgave.svarType !== "tal" || bedoemt !== null) return;
    const x = parseSvar(svarTekst);
    if (x === null) return;
    bedoem(erKorrektTal(x, opgave.facit, opgave.tolerancePct ?? 2));
  };

  const vaelg = (i: number) => {
    if (!opgave || opgave.svarType !== "valg" || bedoemt !== null) return;
    setValgt(i);
    bedoem(i === opgave.korrektValg);
  };

  const videre = () => {
    const naesteRunde = runde + 1;
    setRunde(naesteRunde);
    setSvarTekst("");
    setValgt(null);
    setBedoemt(null);
    setHintVist(false);
    if (naesteRunde < ANTAL_OPGAVER && raekkefoelge.length > 0) {
      setOpgave(lavOpgave(raekkefoelge[naesteRunde % raekkefoelge.length]));
    }
  };

  if (generatorIds.length === 0) {
    return (
      <div className="fy fyTraen">
        <div className="fySti">
          <Link to="/fysik">Fysik</Link>
          <span>›</span>
          <Link to={`/fysik/emne/${emne.id}`}>{emne.titel}</Link>
        </div>
        <div className="fyPanel">Der er endnu ingen opgaver til dette emne.</div>
      </div>
    );
  }

  return (
    <div className="fy fyTraen">
      <div className="fySti">
        <Link to="/fysik">Fysik</Link>
        <span>›</span>
        <Link to={`/fysik/emne/${emne.id}`}>{emne.titel}</Link>
        <span>›</span>
        <span>Træning</span>
      </div>

      <div className="fyEmneHead">
        <div className="fyEmneIkon" aria-hidden="true">
          {emne.ikon}
        </div>
        <div>
          <div className="fyEmneTitel">Træning: {emne.titel}</div>
          <div className="fyEmneMeta">
            <span className="fyMetaChip">
              Opgave {Math.min(runde + 1, ANTAL_OPGAVER)} af {ANTAL_OPGAVER}
            </span>
            <span className="fyMetaChip">Mestring: {Math.round(mastery * 100)} %</span>
          </div>
        </div>
      </div>

      <div className="fyDots" aria-hidden="true">
        {Array.from({ length: ANTAL_OPGAVER }).map((_, i) => {
          let cls = "fyDot";
          if (i < resultater.length) cls += resultater[i] ? " rigtig" : " forkert";
          else if (i === resultater.length && !faerdig) cls += " aktuel";
          return <div key={i} className={cls} />;
        })}
      </div>

      {faerdig ? (
        <div className="fyPanel fyResultat">
          <div className="fyResultatEmoji">
            {korrekte === ANTAL_OPGAVER ? "🏆" : korrekte >= ANTAL_OPGAVER * 0.6 ? "💪" : "📚"}
          </div>
          <div className="fyResultatTitel">
            {korrekte} af {ANTAL_OPGAVER} rigtige
          </div>
          <div className="fyResultatSub">
            {korrekte === ANTAL_OPGAVER
              ? "Perfekt runde — du mestrer det her!"
              : korrekte >= ANTAL_OPGAVER * 0.6
              ? "Godt arbejde! Endnu en runde, og det sidder fast."
              : "Godt forsøg — genlæs teorien og prøv igen. Fysik læres ved at øve."}
          </div>
          <div className="fyResultatMastery">
            <div className="fyProg">
              <div className="fyProgFill" style={{ width: `${Math.round(mastery * 100)}%` }} />
            </div>
            <div className="fySmaa">Din mestring af emnet: {Math.round(mastery * 100)} %</div>
          </div>
          <div className="fyResultatKnapper">
            <button className="fyBtn primary" onClick={nulstil}>
              🔁 Træn igen
            </button>
            <Link className="fyBtn" to={`/fysik/emne/${emne.id}`}>
              Tilbage til teorien
            </Link>
            <Link className="fyBtn" to="/fysik">
              Alle emner
            </Link>
          </div>
        </div>
      ) : opgave ? (
        <div className="fyPanel">
          <div className="fyOpgaveTekst">{opgave.tekst}</div>

          {opgave.svarType === "tal" ? (
            <div className="fySvarRaekke">
              <input
                className="fySvarInput"
                inputMode="decimal"
                placeholder="Dit svar"
                value={svarTekst}
                disabled={bedoemt !== null}
                onChange={(e) => setSvarTekst(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") tjekTal();
                }}
                autoFocus
              />
              {opgave.enhed ? <span className="fyEnhed">{opgave.enhed}</span> : null}
              {bedoemt === null ? (
                <button
                  className="fyBtn primary"
                  onClick={tjekTal}
                  disabled={parseSvar(svarTekst) === null}
                >
                  Tjek svar
                </button>
              ) : null}
            </div>
          ) : (
            <div className="fyValg">
              {opgave.valg.map((v, i) => {
                let cls = "fyValgKnap";
                if (bedoemt !== null) {
                  if (i === opgave.korrektValg) cls += " korrekt";
                  else if (i === valgt) cls += " forkert";
                }
                return (
                  <button key={i} className={cls} disabled={bedoemt !== null} onClick={() => vaelg(i)}>
                    {v}
                  </button>
                );
              })}
            </div>
          )}

          {bedoemt === null && !hintVist ? (
            <div className="fySvarRaekke">
              <button className="fyBtn" onClick={() => setHintVist(true)}>
                💡 Hint
              </button>
            </div>
          ) : null}

          {hintVist && bedoemt === null ? <div className="fyHintBoks">💡 {opgave.hint}</div> : null}

          {bedoemt !== null ? (
            <>
              <div className={`fyFeedback ${bedoemt ? "rigtig" : "forkert"}`}>
                <div className="fyFeedbackTitel">
                  {bedoemt ? "✅ Rigtigt!" : "❌ Ikke helt."}
                </div>
                <div>{opgave.loesning}</div>
              </div>
              <div className="fySvarRaekke">
                <button className="fyBtn primary" onClick={videre} autoFocus>
                  {resultater.length >= ANTAL_OPGAVER ? "Se resultat" : "Næste opgave →"}
                </button>
              </div>
            </>
          ) : null}

          <div className="fySmaa">
            Skriv decimaltal med komma (fx 3,5). Svar accepteres med en lille afrundingstolerance.
          </div>
        </div>
      ) : null}
    </div>
  );
}
