import { Link, Navigate, useParams } from "react-router-dom";
import { findEmne, findNiveau, findOmraade, naboEmner } from "../fysik/pensum";
import { OPGAVE_GENERATORER } from "../fysik/opgaver";
import { progressForEmne } from "../fysik/progress";
import "./Fysik.css";

export default function FysikEmnePage() {
  const { emneId } = useParams<{ emneId: string }>();
  const emne = emneId ? findEmne(emneId) : undefined;

  if (!emne) return <Navigate to="/fysik" replace />;

  const niveau = findNiveau(emne.niveau);
  const omraade = findOmraade(emne.omraade);
  const { forrige, naeste } = naboEmner(emne.id);
  const p = progressForEmne(emne.id);
  const opgavetyper = emne.opgaver.filter((id) => OPGAVE_GENERATORER[id]).length;

  return (
    <div className="fy">
      <div className="fySti">
        <Link to="/fysik">Fysik</Link>
        <span>›</span>
        <span>{niveau.navn}</span>
        <span>›</span>
        <span>{emne.titel}</span>
      </div>

      <div className="fyEmneHead">
        <div className="fyEmneIkon" aria-hidden="true">
          {emne.ikon}
        </div>
        <div>
          <div className="fyEmneTitel">{emne.titel}</div>
          <div className="fyEmneMeta">
            <span className="fyMetaChip">{niveau.navn}</span>
            <span className="fyMetaChip">
              <span
                className="fyOmraadePrik"
                style={{ background: omraade.farve, display: "inline-block", marginRight: 6 }}
              />
              {omraade.navn}
            </span>
            <span className="fyMetaChip">{opgavetyper} opgavetyper</span>
            {p.forsoeg > 0 ? (
              <span className="fyMetaChip">Mestring: {Math.round(p.mastery * 100)} %</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="fyPanel">
        <div className="fyPanelTitel">🎯 Det lærer du</div>
        <ul className="fyMaalListe">
          {emne.maal.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>

      {emne.teori.map((afsnit, i) => (
        <div className="fyPanel" key={i}>
          <div className="fyPanelTitel">{afsnit.overskrift}</div>
          <div className="fyBrod">{afsnit.brod}</div>

          {afsnit.punkter ? (
            <ul className="fyPunkter">
              {afsnit.punkter.map((pk, j) => (
                <li key={j}>{pk}</li>
              ))}
            </ul>
          ) : null}

          {afsnit.formler && afsnit.formler.length > 0 ? (
            <div className="fyFormler">
              {afsnit.formler.map((f, j) => (
                <div className="fyFormel" key={j}>
                  <span className="fyFormelUdtryk">{f.udtryk}</span>
                  <span className="fyFormelNavn">{f.navn}</span>
                  {f.forklaring ? <span className="fyFormelForkl">{f.forklaring}</span> : null}
                </div>
              ))}
            </div>
          ) : null}

          {afsnit.eksempel ? (
            <div className="fyEksempel">
              <div className="fyEksempelTitel">Eksempel · {afsnit.eksempel.titel}</div>
              <div className="fyEksempelTekst">{afsnit.eksempel.tekst}</div>
            </div>
          ) : null}
        </div>
      ))}

      <div className="fyEmneCta">
        <Link className="fyBtn primary" to={`/fysik/traen/${emne.id}`}>
          🚀 Træn dette emne
        </Link>
        <Link className="fyBtn" to="/fysik/formler">
          📖 Formelsamling
        </Link>
      </div>

      <div className="fyNaboNav">
        {forrige ? (
          <Link className="fyBtn" to={`/fysik/emne/${forrige.id}`}>
            ← {forrige.titel}
          </Link>
        ) : (
          <span />
        )}
        {naeste ? (
          <Link className="fyBtn" to={`/fysik/emne/${naeste.id}`}>
            {naeste.titel} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
