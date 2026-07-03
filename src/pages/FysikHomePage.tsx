import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { NiveauId } from "../fysik/model";
import { NIVEAUER, OMRAADER, FYSIK_EMNER, emnerForNiveau, findOmraade } from "../fysik/pensum";
import { OPGAVE_GENERATORER } from "../fysik/opgaver";
import { hentFysikProgress, statusForEmne } from "../fysik/progress";
import "./Fysik.css";

const NIVEAU_KEY = "fysik_niveau_v1";

function gemtNiveau(): NiveauId {
  const raw = localStorage.getItem(NIVEAU_KEY);
  return NIVEAUER.some((n) => n.id === raw) ? (raw as NiveauId) : "7kl";
}

export default function FysikHomePage() {
  const [niveau, setNiveau] = useState<NiveauId>(gemtNiveau);
  const progress = hentFysikProgress();

  const emner = useMemo(() => emnerForNiveau(niveau), [niveau]);
  const nivInfo = NIVEAUER.find((n) => n.id === niveau)!;

  const antalOpgavetyper = Object.keys(OPGAVE_GENERATORER).length;
  const mestrede = FYSIK_EMNER.filter((e) => statusForEmne(e.id) === "mestret").length;

  const vaelgNiveau = (id: NiveauId) => {
    setNiveau(id);
    try {
      localStorage.setItem(NIVEAU_KEY, id);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fy">
      <div className="fyHero">
        <div className="fyHeroKicker">Fysik · 7. klasse → 3.g</div>
        <div className="fyHeroTitle">Forstå fysikken — fra tordenvejr til tidsforlængelse</div>
        <div className="fyHeroSub">
          Hele pensum fra grundskolens fysik/kemi til Fysik A: teori der forklarer{" "}
          <em>hvorfor</em>, formler du faktisk kommer til at bruge, og uendelig, auto-rettet
          træning med hints og fulde løsninger.
        </div>
        <div className="fyHeroStats">
          <div className="fyHeroStat">
            <div className="fyHeroStatVal">{FYSIK_EMNER.length}</div>
            <div className="fyHeroStatLbl">emner</div>
          </div>
          <div className="fyHeroStat">
            <div className="fyHeroStatVal">{NIVEAUER.length}</div>
            <div className="fyHeroStatLbl">niveauer</div>
          </div>
          <div className="fyHeroStat">
            <div className="fyHeroStatVal">{antalOpgavetyper}</div>
            <div className="fyHeroStatLbl">opgavetyper</div>
          </div>
          <div className="fyHeroStat">
            <div className="fyHeroStatVal">{mestrede}</div>
            <div className="fyHeroStatLbl">mestrede emner</div>
          </div>
        </div>
        <div className="fyHeroActions">
          <Link className="fyBtn ghost" to="/fysik/formler">
            📖 Formelsamling
          </Link>
          <Link className="fyBtn ghost" to="/">
            ← Til matematik
          </Link>
        </div>
      </div>

      <div className="fyNivBar" role="tablist" aria-label="Vælg klassetrin">
        {NIVEAUER.map((n) => (
          <button
            key={n.id}
            role="tab"
            aria-selected={n.id === niveau}
            className={`fyNivChip ${n.id === niveau ? "aktiv" : ""}`}
            onClick={() => vaelgNiveau(n.id)}
          >
            {n.navn}
          </button>
        ))}
      </div>

      <div className="fyNivBeskrivelse">{nivInfo.beskrivelse}</div>

      <div className="fyGrid">
        {emner.map((emne) => {
          const omr = findOmraade(emne.omraade);
          const p = progress.emner[emne.id];
          const mastery = Math.round((p?.mastery ?? 0) * 100);
          const status = statusForEmne(emne.id);
          const tag = status === "mestret" ? "MESTRET" : status === "i-gang" ? "I GANG" : "NY";
          return (
            <Link key={emne.id} className="fyKort" to={`/fysik/emne/${emne.id}`}>
              <div className="fyKortTop">
                <div className="fyKortIkon" aria-hidden="true">
                  {emne.ikon}
                </div>
                <div className={`fyTag ${status}`}>{tag}</div>
              </div>
              <div className="fyKortTitel">{emne.titel}</div>
              <div className="fyKortKort">{emne.kort}</div>
              <div className="fyOmraadeChip">
                <span className="fyOmraadePrik" style={{ background: omr.farve }} />
                {omr.navn}
              </div>
              <div className="fyProg">
                <div className="fyProgFill" style={{ width: `${mastery}%` }} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="fySektionTitel">Fagområderne</div>
      <div className="fyNivBeskrivelse">
        Fysikken er delt i {OMRAADER.length} områder, som du møder igen og igen — hvert
        klassetrin bygger ovenpå det forrige, fra de første målinger i 7. klasse til
        relativitetsteori i 3.g.
      </div>
      <div className="fyNivBar">
        {OMRAADER.map((o) => (
          <span key={o.id} className="fyNivChip" style={{ cursor: "default" }}>
            <span
              className="fyOmraadePrik"
              style={{ background: o.farve, display: "inline-block", marginRight: 7 }}
            />
            {o.navn}
          </span>
        ))}
      </div>
    </div>
  );
}
