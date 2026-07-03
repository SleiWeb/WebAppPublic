import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Formel, NiveauId } from "../fysik/model";
import { FYSIK_EMNER, NIVEAUER, findNiveau } from "../fysik/pensum";
import "./Fysik.css";

type Filter = NiveauId | "alle";

type EmneFormler = {
  emneId: string;
  ikon: string;
  titel: string;
  niveau: NiveauId;
  formler: Formel[];
};

function samlFormler(): EmneFormler[] {
  return FYSIK_EMNER.map((e) => ({
    emneId: e.id,
    ikon: e.ikon,
    titel: e.titel,
    niveau: e.niveau,
    formler: e.teori.flatMap((t) => t.formler ?? []),
  })).filter((e) => e.formler.length > 0);
}

export default function FysikFormlerPage() {
  const [filter, setFilter] = useState<Filter>("alle");
  const alle = useMemo(samlFormler, []);

  const viste = filter === "alle" ? alle : alle.filter((e) => e.niveau === filter);
  const antal = viste.reduce((sum, e) => sum + e.formler.length, 0);

  return (
    <div className="fy">
      <div className="fySti">
        <Link to="/fysik">Fysik</Link>
        <span>›</span>
        <span>Formelsamling</span>
      </div>

      <div className="fyEmneHead">
        <div className="fyEmneIkon" aria-hidden="true">
          📖
        </div>
        <div>
          <div className="fyEmneTitel">Formelsamling</div>
          <div className="fyEmneMeta">
            <span className="fyMetaChip">{antal} formler</span>
            <span className="fyMetaChip">Alle niveauer fra 7. klasse til Fysik A</span>
          </div>
        </div>
      </div>

      <div className="fyNivBar" role="tablist" aria-label="Filtrér efter niveau">
        <button
          role="tab"
          aria-selected={filter === "alle"}
          className={`fyNivChip ${filter === "alle" ? "aktiv" : ""}`}
          onClick={() => setFilter("alle")}
        >
          Alle
        </button>
        {NIVEAUER.map((n) => (
          <button
            key={n.id}
            role="tab"
            aria-selected={filter === n.id}
            className={`fyNivChip ${filter === n.id ? "aktiv" : ""}`}
            onClick={() => setFilter(n.id)}
          >
            {n.navn}
          </button>
        ))}
      </div>

      {viste.map((e) => (
        <div className="fyFormelGruppe" key={e.emneId}>
          <div className="fyFormelGruppeTitel">
            <span aria-hidden="true">{e.ikon}</span>
            <Link to={`/fysik/emne/${e.emneId}`} style={{ color: "#0f172a", textDecoration: "none" }}>
              {e.titel}
            </Link>
            <span className="fyMetaChip">{findNiveau(e.niveau).kort}</span>
          </div>
          <div className="fyFormler">
            {e.formler.map((f, i) => (
              <div className="fyFormel" key={i}>
                <span className="fyFormelUdtryk">{f.udtryk}</span>
                <span className="fyFormelNavn">{f.navn}</span>
                {f.forklaring ? <span className="fyFormelForkl">{f.forklaring}</span> : null}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
