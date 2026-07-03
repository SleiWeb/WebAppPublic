import type { OpgaveGenerator } from "../model";
import { ri, rv, afrund, dk, talOpgave } from "./hjaelp";

const g = 9.82;

// Opgavegeneratorer for Fysik B og Fysik A.
export const GENERATORER_FYSIK_BA: OpgaveGenerator[] = [
  // ---------- Fysik B ----------
  {
    id: "gb-jaevn-acc",
    titel: "v = v0 + a·t",
    lav: () => {
      const v0 = rv([0, 2, 5, 10]);
      const a = rv([0.5, 1, 1.5, 2, 3]);
      const t = ri(4, 20);
      const v = afrund(v0 + a * t, 1);
      if (ri(0, 1) === 0)
        return talOpgave({
          tekst: `En bil har startfarten ${dk(v0)} m/s og accelererer med ${dk(a)} m/s² i ${t} s. Beregn slutfarten.`,
          enhed: "m/s",
          facit: v,
          hint: "v = v₀ + a · t.",
          loesning: `v = ${dk(v0)} + ${dk(a)} · ${t} = ${dk(v, 1)} m/s.`,
        });
      return talOpgave({
        tekst: `En cykel accelererer fra ${dk(v0)} m/s til ${dk(v, 1)} m/s med accelerationen ${dk(a)} m/s². Hvor lang tid tager det?`,
        enhed: "s",
        facit: t,
        hint: "t = (v − v₀) / a.",
        loesning: `t = (${dk(v, 1)} − ${dk(v0)}) / ${dk(a)} = ${t} s.`,
      });
    },
  },
  {
    id: "gb-straekning-acc",
    titel: "s = v0·t + ½·a·t²",
    lav: () => {
      const v0 = rv([0, 0, 5, 10]);
      const a = rv([1, 2, 3, 4]);
      const t = ri(3, 12);
      const s = afrund(v0 * t + 0.5 * a * t * t, 1);
      return talOpgave({
        tekst: `En motorcykel starter med farten ${dk(v0)} m/s og accelererer med ${dk(a)} m/s² i ${t} s. Hvor langt når den?`,
        enhed: "m",
        facit: s,
        hint: "s = v₀·t + ½·a·t².",
        loesning: `s = ${dk(v0)}·${t} + ½·${dk(a)}·${t}² = ${dk(v0 * t)} + ${dk(0.5 * a * t * t)} = ${dk(s, 1)} m.`,
      });
    },
  },
  {
    id: "gb-fritfald",
    titel: "Frit fald",
    lav: () => {
      const h = rv([5, 10, 20, 45, 80]);
      if (ri(0, 1) === 0) {
        const facit = afrund(Math.sqrt((2 * h) / g), 2);
        return talOpgave({
          tekst: `En sten slippes fra ${h} m højde. Hvor lang tid tager faldet? (Se bort fra luftmodstand, g = 9,82 m/s²)`,
          enhed: "s",
          facit,
          tolerancePct: 2,
          hint: "h = ½·g·t² → t = √(2h/g).",
          loesning: `t = √(2·${h}/9,82) = ${dk(facit, 2)} s.`,
        });
      }
      const facit = afrund(Math.sqrt(2 * g * h), 1);
      return talOpgave({
        tekst: `En sten slippes fra ${h} m højde. Hvilken fart rammer den jorden med? (Se bort fra luftmodstand, g = 9,82 m/s²)`,
        enhed: "m/s",
        facit,
        tolerancePct: 2,
        hint: "v = √(2·g·h).",
        loesning: `v = √(2·9,82·${h}) = ${dk(facit, 1)} m/s ≈ ${dk(afrund(facit * 3.6, 0))} km/t.`,
      });
    },
  },
  {
    id: "gb-resulterende",
    titel: "Resulterende kraft",
    lav: () => {
      const m = rv([5, 10, 20, 50, 100]);
      const Fmod = ri(2, 12) * 5;
      const a = rv([0.5, 1, 1.5, 2]);
      const Ffrem = afrund(m * a + Fmod, 1);
      return talOpgave({
        tekst: `En kasse på ${m} kg trækkes med ${dk(Ffrem)} N, mens gnidningskraften er ${Fmod} N. Beregn accelerationen.`,
        enhed: "m/s²",
        facit: a,
        tolerancePct: 2,
        hint: "Find først F_res = F_træk − F_gnidning, og brug så a = F_res/m.",
        loesning: `F_res = ${dk(Ffrem)} − ${Fmod} = ${dk(m * a)} N. a = ${dk(m * a)}/${m} = ${dk(a)} m/s².`,
      });
    },
  },
  {
    id: "gb-gnidning",
    titel: "Gnidningskraft",
    lav: () => {
      const m = rv([2, 5, 10, 20, 40]);
      const mu = rv([0.1, 0.2, 0.3, 0.4, 0.5]);
      const facit = afrund(mu * m * g, 1);
      return talOpgave({
        tekst: `En kasse på ${m} kg glider på et vandret gulv med gnidningskoefficienten µ = ${dk(mu)}. Beregn gnidningskraften. (g = 9,82 m/s²)`,
        enhed: "N",
        facit,
        tolerancePct: 2,
        hint: "F_gnid = µ · F_N, hvor normalkraften F_N = m·g på vandret underlag.",
        loesning: `F_N = ${m}·9,82 = ${dk(afrund(m * g, 1))} N. F_gnid = ${dk(mu)}·${dk(afrund(m * g, 1))} = ${dk(facit, 1)} N.`,
      });
    },
  },
  {
    id: "gb-arbejde",
    titel: "Arbejde",
    lav: () => {
      const F = ri(2, 40) * 10;
      const s = ri(2, 25);
      return talOpgave({
        tekst: `En kraft på ${F} N flytter en genstand ${s} m i kraftens retning. Beregn kraftens arbejde.`,
        enhed: "J",
        facit: F * s,
        hint: "W = F · s.",
        loesning: `W = ${F} N · ${s} m = ${F * s} J.`,
      });
    },
  },
  {
    id: "gb-ekin",
    titel: "Kinetisk energi",
    lav: () => {
      const m = rv([0.5, 2, 10, 60, 80, 1000]);
      const v = rv([2, 5, 10, 15, 20, 25]);
      const facit = afrund(0.5 * m * v * v, 0);
      return talOpgave({
        tekst: `Beregn den kinetiske energi af en genstand med massen ${dk(m)} kg og farten ${v} m/s.`,
        enhed: "J",
        facit,
        tolerancePct: 2,
        hint: "E_kin = ½ · m · v².",
        loesning: `E_kin = ½ · ${dk(m)} · ${v}² = ${dk(facit)} J.`,
      });
    },
  },
  {
    id: "gb-epot",
    titel: "Potentiel energi",
    lav: () => {
      const m = rv([0.5, 1, 2, 5, 60]);
      const h = ri(2, 50);
      const facit = afrund(m * g * h, 0);
      return talOpgave({
        tekst: `Beregn den potentielle energi af en genstand på ${dk(m)} kg, der løftes ${h} m op. (g = 9,82 m/s²)`,
        enhed: "J",
        facit,
        tolerancePct: 2,
        hint: "E_pot = m · g · h.",
        loesning: `E_pot = ${dk(m)} · 9,82 · ${h} = ${dk(facit)} J.`,
      });
    },
  },
  {
    id: "gb-energibevarelse",
    titel: "Energibevarelse",
    lav: () => {
      const h = rv([5, 11, 20, 31, 45]);
      const facit = afrund(Math.sqrt(2 * g * h), 1);
      return talOpgave({
        tekst: `Et rutsjebanetog slippes fra ${h} m og ruller gnidningsfrit ned. Beregn farten i bunden med energibevarelse. (g = 9,82 m/s²)`,
        enhed: "m/s",
        facit,
        tolerancePct: 2,
        hint: "m·g·h = ½·m·v² → v = √(2·g·h). Massen forkortes ud!",
        loesning: `v = √(2·9,82·${h}) = ${dk(facit, 1)} m/s — uafhængigt af togets masse.`,
      });
    },
  },
  {
    id: "gb-vandtryk",
    titel: "Tryk i væske",
    lav: () => {
      const h = rv([1, 2, 5, 10, 25, 40]);
      const facit = afrund(1000 * g * h, 0);
      return talOpgave({
        tekst: `Beregn det ekstra tryk (ud over atmosfæretrykket) i ${h} m vanddybde. (ρ_vand = 1000 kg/m³, g = 9,82 m/s²)`,
        enhed: "Pa",
        facit,
        tolerancePct: 2,
        hint: "p = ρ · g · h.",
        loesning: `p = 1000 · 9,82 · ${h} = ${dk(facit)} Pa ≈ ${dk(afrund(facit / 1000, 0))} kPa.`,
      });
    },
  },
  {
    id: "gb-idealgas",
    titel: "Idealgasloven",
    lav: () => {
      const n = rv([0.5, 1, 2, 3]);
      const T = rv([273, 293, 300, 350, 400]);
      const V = rv([0.01, 0.02, 0.024, 0.05, 0.1]);
      if (ri(0, 1) === 0) {
        const facit = afrund((n * 8.31 * T) / V, 0);
        return talOpgave({
          tekst: `${dk(n)} mol gas har temperaturen ${T} K og rumfanget ${dk(V)} m³. Beregn trykket. (R = 8,31 J/(mol·K))`,
          enhed: "Pa",
          facit,
          tolerancePct: 2,
          hint: "p = n·R·T / V.",
          loesning: `p = ${dk(n)} · 8,31 · ${T} / ${dk(V)} = ${dk(facit)} Pa.`,
        });
      }
      const p = rv([100000, 101325, 200000]);
      const facit = afrund((p * V) / (8.31 * T), 2);
      return talOpgave({
        tekst: `En gas har trykket ${dk(p)} Pa, rumfanget ${dk(V)} m³ og temperaturen ${T} K. Beregn stofmængden. (R = 8,31 J/(mol·K))`,
        enhed: "mol",
        facit,
        tolerancePct: 2,
        hint: "n = p·V / (R·T).",
        loesning: `n = ${dk(p)} · ${dk(V)} / (8,31 · ${T}) = ${dk(facit, 2)} mol.`,
      });
    },
  },
  {
    id: "gb-resistivitet",
    titel: "Resistivitet",
    lav: () => {
      const L = rv([5, 10, 20, 50, 100]);
      const Amm2 = rv([0.5, 1, 1.5, 2.5]);
      const facit = afrund((1.7e-8 * L) / (Amm2 * 1e-6), 3);
      return talOpgave({
        tekst: `En kobbertråd er ${L} m lang med tværsnitsarealet ${dk(Amm2)} mm². Beregn dens resistans. (ρ_kobber = 1,7 · 10⁻⁸ Ω·m)`,
        enhed: "Ω",
        facit,
        tolerancePct: 2,
        hint: "R = ρ·L/A. Husk 1 mm² = 10⁻⁶ m².",
        loesning: `R = 1,7·10⁻⁸ · ${L} / ${dk(Amm2)}·10⁻⁶ = ${dk(facit, 3)} Ω.`,
      });
    },
  },
  {
    id: "gb-indre-resistans",
    titel: "Indre resistans",
    lav: () => {
      const emk = rv([1.5, 4.5, 9, 12]);
      const Ri = rv([0.1, 0.2, 0.5, 1]);
      const I = rv([0.5, 1, 2]);
      const facit = afrund(emk - Ri * I, 2);
      return talOpgave({
        tekst: `Et batteri har emk ε = ${dk(emk)} V og indre resistans ${dk(Ri)} Ω. Der trækkes ${dk(I)} A. Beregn polspændingen.`,
        enhed: "V",
        facit,
        tolerancePct: 2,
        hint: "U = ε − Ri · I.",
        loesning: `U = ${dk(emk)} − ${dk(Ri)}·${dk(I)} = ${dk(facit, 2)} V.`,
      });
    },
  },
  {
    id: "gb-gitter",
    titel: "Gitterligningen",
    lav: () => {
      const linjer = rv([300, 500, 600]);
      const d = 1 / (linjer * 1000); // m
      const lam = rv([450, 532, 633, 650]) * 1e-9;
      const sinT = lam / d;
      if (sinT >= 1) {
        // fallback: brug 1. orden med 300 linjer
        const d2 = 1 / 300000;
        const th = afrund((Math.asin(lam / d2) * 180) / Math.PI, 1);
        return talOpgave({
          tekst: `Laserlys med bølgelængden ${afrund(lam * 1e9, 0)} nm sendes gennem et gitter med 300 linjer/mm. Beregn afbøjningsvinklen for 1. orden.`,
          enhed: "°",
          facit: th,
          tolerancePct: 3,
          hint: "n·λ = d·sin(θ), hvor d = 1/(linjer pr. m).",
          loesning: `d = 1/300.000 m ≈ 3,33 µm. sin(θ) = λ/d, θ = ${dk(th, 1)}°.`,
        });
      }
      const th = afrund((Math.asin(sinT) * 180) / Math.PI, 1);
      if (ri(0, 1) === 0)
        return talOpgave({
          tekst: `Laserlys sendes gennem et gitter med ${linjer} linjer/mm, og 1. orden afbøjes ${dk(th, 1)}°. Beregn lysets bølgelængde i nm.`,
          enhed: "nm",
          facit: afrund(lam * 1e9, 0),
          tolerancePct: 3,
          hint: "λ = d·sin(θ), hvor d = 1/(linjer pr. m). Omregn til nm.",
          loesning: `d = 1/${linjer}.000 m. λ = d·sin(${dk(th, 1)}°) ≈ ${afrund(lam * 1e9, 0)} nm.`,
        });
      return talOpgave({
        tekst: `Lys med bølgelængden ${afrund(lam * 1e9, 0)} nm sendes gennem et gitter med ${linjer} linjer/mm. Beregn afbøjningsvinklen for 1. orden.`,
        enhed: "°",
        facit: th,
        tolerancePct: 3,
        hint: "sin(θ) = n·λ/d med n = 1.",
        loesning: `d = 1/${linjer}.000 m. sin(θ) = λ/d = ${dk(afrund(sinT, 3), 3)} → θ ≈ ${dk(th, 1)}°.`,
      });
    },
  },
  {
    id: "gb-standende",
    titel: "Standende bølger",
    lav: () => {
      const L = rv([0.5, 0.65, 0.8, 1]);
      const n = ri(1, 3);
      const v = rv([200, 250, 320, 400]);
      const lam = (2 * L) / n;
      const facit = afrund(v / lam, 1);
      return talOpgave({
        tekst: `En streng på ${dk(L)} m svinger i sin ${n}. harmoniske (n = ${n}). Bølgefarten på strengen er ${v} m/s. Beregn frekvensen.`,
        enhed: "Hz",
        facit,
        tolerancePct: 2,
        hint: "λ = 2L/n og f = v/λ.",
        loesning: `λ = 2·${dk(L)}/${n} = ${dk(afrund(lam, 3))} m. f = ${v}/${dk(afrund(lam, 3))} ≈ ${dk(facit, 1)} Hz.`,
      });
    },
  },
  {
    id: "gb-fotonovergang",
    titel: "Fotonovergange",
    lav: () => {
      const dE = rv([1.89, 2.55, 2.86, 3.02, 1.51]);
      const facit = afrund(1240 / dE, 0);
      return talOpgave({
        tekst: `En elektron springer mellem to niveauer med energiforskellen ${dk(dE, 2)} eV. Beregn den udsendte fotons bølgelængde.`,
        enhed: "nm",
        facit,
        tolerancePct: 2,
        hint: "λ [nm] = 1240 / ΔE [eV].",
        loesning: `λ = 1240 / ${dk(dE, 2)} ≈ ${facit} nm.`,
      });
    },
  },
  {
    id: "gb-aktivitet",
    titel: "Aktivitet A = k·N",
    lav: () => {
      const Tdage = rv([8, 5.3 * 365, 14.3]);
      const Ts = Tdage * 86400;
      const k = Math.LN2 / Ts;
      const N = rv([1e15, 5e15, 2e16]);
      const facit = afrund((k * N) / 1e6, 1);
      const Tvis = Tdage >= 365 ? `${dk(afrund(Tdage / 365, 1))} år` : `${dk(afrund(Tdage, 1))} døgn`;
      const Nvis = N === 1e15 ? "1,0 · 10¹⁵" : N === 5e15 ? "5,0 · 10¹⁵" : "2,0 · 10¹⁶";
      return talOpgave({
        tekst: `En kilde indeholder ${Nvis} radioaktive kerner med halveringstiden ${Tvis}. Beregn aktiviteten i MBq (1 MBq = 10⁶ Bq).`,
        enhed: "MBq",
        facit,
        tolerancePct: 3,
        hint: "k = ln(2)/T½ (T½ i sekunder), og A = k·N. Omregn til MBq.",
        loesning: `k = 0,693/${dk(afrund(Ts, 0))} s ≈ ${dk(afrund(k * 1e9, 2))}·10⁻⁹ s⁻¹. A = k·N ≈ ${dk(facit, 1)} MBq.`,
      });
    },
  },

  // ---------- Fysik A ----------
  {
    id: "ga-centripetal",
    titel: "Centripetalkraft",
    lav: () => {
      const m = rv([0.2, 0.5, 1, 30, 70]);
      const v = rv([3, 5, 8, 10, 15]);
      const r = rv([0.5, 1, 2, 4, 10]);
      if (ri(0, 1) === 0) {
        const facit = afrund((v * v) / r, 1);
        return talOpgave({
          tekst: `En genstand bevæger sig i en cirkel med radius ${dk(r)} m og farten ${v} m/s. Beregn centripetalaccelerationen.`,
          enhed: "m/s²",
          facit,
          tolerancePct: 2,
          hint: "a = v² / r.",
          loesning: `a = ${v}²/${dk(r)} = ${dk(facit, 1)} m/s².`,
        });
      }
      const facit = afrund((m * v * v) / r, 1);
      return talOpgave({
        tekst: `En genstand på ${dk(m)} kg bevæger sig i en cirkel med radius ${dk(r)} m og farten ${v} m/s. Beregn centripetalkraften.`,
        enhed: "N",
        facit,
        tolerancePct: 2,
        hint: "F = m·v²/r.",
        loesning: `F = ${dk(m)}·${v}²/${dk(r)} = ${dk(facit, 1)} N.`,
      });
    },
  },
  {
    id: "ga-satellit",
    titel: "Satellitfart",
    lav: () => {
      const rkm = rv([6771, 7000, 8000, 10000, 42164]);
      const r = rkm * 1000;
      const GM = 6.67e-11 * 5.97e24;
      const facit = afrund(Math.sqrt(GM / r) / 1000, 2);
      return talOpgave({
        tekst: `En satellit kredser om Jorden i en cirkelbane med radius ${dk(rkm)} km (fra Jordens centrum). Beregn banefarten i km/s. (G·M_jord = 3,98 · 10¹⁴ m³/s²)`,
        enhed: "km/s",
        facit,
        tolerancePct: 2,
        hint: "v = √(G·M/r). Husk radius i meter — og svar i km/s.",
        loesning: `v = √(3,98·10¹⁴ / ${dk(rkm)}·10³ m) ≈ ${dk(facit, 2)} km/s.`,
      });
    },
  },
  {
    id: "ga-fjeder",
    titel: "Fjederpendul",
    lav: () => {
      const m = rv([0.1, 0.25, 0.5, 1, 2]);
      const k = rv([10, 20, 40, 50, 100]);
      const facit = afrund(2 * Math.PI * Math.sqrt(m / k), 2);
      return talOpgave({
        tekst: `Et lod på ${dk(m)} kg hænger i en fjeder med fjederkonstanten ${k} N/m. Beregn svingningstiden.`,
        enhed: "s",
        facit,
        tolerancePct: 2,
        hint: "T = 2π·√(m/k).",
        loesning: `T = 2π·√(${dk(m)}/${k}) = ${dk(facit, 2)} s.`,
      });
    },
  },
  {
    id: "ga-pendul",
    titel: "Snorpendul",
    lav: () => {
      const L = rv([0.25, 0.5, 1, 2, 10, 25]);
      if (ri(0, 1) === 0) {
        const facit = afrund(2 * Math.PI * Math.sqrt(L / g), 2);
        return talOpgave({
          tekst: `Et snorpendul har længden ${dk(L)} m. Beregn svingningstiden. (g = 9,82 m/s²)`,
          enhed: "s",
          facit,
          tolerancePct: 2,
          hint: "T = 2π·√(L/g).",
          loesning: `T = 2π·√(${dk(L)}/9,82) = ${dk(facit, 2)} s.`,
        });
      }
      const T = afrund(2 * Math.PI * Math.sqrt(L / g), 2);
      return talOpgave({
        tekst: `Et snorpendul svinger med svingningstiden ${dk(T, 2)} s. Beregn pendulets længde. (g = 9,82 m/s²)`,
        enhed: "m",
        facit: L,
        tolerancePct: 3,
        hint: "L = g·(T/2π)².",
        loesning: `L = 9,82·(${dk(T, 2)}/2π)² ≈ ${dk(L)} m.`,
      });
    },
  },
  {
    id: "ga-uelastisk",
    titel: "Uelastisk stød",
    lav: () => {
      const m1 = rv([1, 2, 1000, 2000]);
      const m2 = m1 <= 2 ? rv([1, 2, 3]) : rv([1000, 3000]);
      const v1 = rv([2, 3, 4, 6]);
      const facit = afrund((m1 * v1) / (m1 + m2), 2);
      return talOpgave({
        tekst: `En vogn på ${dk(m1)} kg med farten ${v1} m/s rammer en holdende vogn på ${dk(m2)} kg, og de hænger sammen efter stødet. Beregn fælleshastigheden.`,
        enhed: "m/s",
        facit,
        tolerancePct: 2,
        hint: "Impulsbevarelse: m₁·v₁ = (m₁+m₂)·v.",
        loesning: `v = ${dk(m1)}·${v1}/(${dk(m1)}+${dk(m2)}) = ${dk(facit, 2)} m/s.`,
      });
    },
  },
  {
    id: "ga-kraftstoed",
    titel: "Kraftstød",
    lav: () => {
      const m = rv([0.15, 0.45, 5, 70]);
      const dv = rv([5, 10, 15, 20]);
      const dt = rv([0.01, 0.02, 0.05, 0.1]);
      const facit = afrund((m * dv) / dt, 0);
      return talOpgave({
        tekst: `En genstand på ${dk(m)} kg ændrer sin fart med ${dv} m/s under et stød, der varer ${dk(dt)} s. Beregn middelkraften.`,
        enhed: "N",
        facit,
        tolerancePct: 2,
        hint: "F = Δp/Δt = m·Δv/Δt.",
        loesning: `Δp = ${dk(m)}·${dv} = ${dk(m * dv)} kg·m/s. F = ${dk(m * dv)}/${dk(dt)} = ${dk(facit)} N.`,
      });
    },
  },
  {
    id: "ga-coulomb",
    titel: "Coulombs lov",
    lav: () => {
      const q1 = rv([1, 2, 3, 5]);
      const q2 = rv([1, 2, 4]);
      const r = rv([0.05, 0.1, 0.2, 0.5]);
      const facit = afrund((8.99e9 * q1 * 1e-6 * q2 * 1e-6) / (r * r), 2);
      return talOpgave({
        tekst: `To punktladninger på ${q1} µC og ${q2} µC er placeret ${dk(r)} m fra hinanden. Beregn kraften mellem dem. (k = 8,99 · 10⁹ N·m²/C²)`,
        enhed: "N",
        facit,
        tolerancePct: 2,
        hint: "F = k·q₁·q₂/r². Husk 1 µC = 10⁻⁶ C.",
        loesning: `F = 8,99·10⁹ · ${q1}·10⁻⁶ · ${q2}·10⁻⁶ / ${dk(r)}² = ${dk(facit, 2)} N.`,
      });
    },
  },
  {
    id: "ga-lorentz",
    titel: "Lorentzkraften",
    lav: () => {
      const q = 1.6e-19;
      const vE6 = rv([1, 2, 3, 5]);
      const B = rv([0.1, 0.2, 0.5, 1]);
      const facit = afrund(q * vE6 * 1e6 * B * 1e14, 2);
      return talOpgave({
        tekst: `En proton (q = 1,6 · 10⁻¹⁹ C) bevæger sig med ${vE6} · 10⁶ m/s vinkelret på et magnetfelt på ${dk(B)} T. Beregn Lorentzkraften i enheden 10⁻¹⁴ N.`,
        enhed: "· 10⁻¹⁴ N",
        facit,
        tolerancePct: 2,
        hint: "F = q·v·B. Svar med tallet foran 10⁻¹⁴.",
        loesning: `F = 1,6·10⁻¹⁹ · ${vE6}·10⁶ · ${dk(B)} = ${dk(facit, 2)}·10⁻¹⁴ N.`,
      });
    },
  },
  {
    id: "ga-cirkel-bfelt",
    titel: "Cirkelbane i magnetfelt",
    lav: () => {
      const vE6 = rv([1, 2, 4]);
      const B = rv([0.2, 0.5, 1]);
      const m = 1.67e-27;
      const q = 1.6e-19;
      const facit = afrund(((m * vE6 * 1e6) / (q * B)) * 100, 1);
      return talOpgave({
        tekst: `En proton (m = 1,67 · 10⁻²⁷ kg, q = 1,6 · 10⁻¹⁹ C) med farten ${vE6} · 10⁶ m/s bevæger sig vinkelret på et magnetfelt på ${dk(B)} T. Beregn banens radius i cm.`,
        enhed: "cm",
        facit,
        tolerancePct: 2,
        hint: "r = m·v/(q·B). Omregn til cm.",
        loesning: `r = 1,67·10⁻²⁷ · ${vE6}·10⁶ / (1,6·10⁻¹⁹ · ${dk(B)}) ≈ ${dk(facit, 1)} cm.`,
      });
    },
  },
  {
    id: "ga-flux",
    titel: "Magnetisk flux",
    lav: () => {
      const B = rv([0.1, 0.2, 0.5, 0.8]);
      const A = rv([0.01, 0.02, 0.05, 0.1]);
      const facit = afrund(B * A, 4);
      return talOpgave({
        tekst: `Et magnetfelt på ${dk(B)} T står vinkelret på en flade med arealet ${dk(A)} m². Beregn den magnetiske flux gennem fladen.`,
        enhed: "Wb",
        facit,
        tolerancePct: 2,
        hint: "Φ = B · A.",
        loesning: `Φ = ${dk(B)} T · ${dk(A)} m² = ${dk(facit)} Wb.`,
      });
    },
  },
  {
    id: "ga-induceret",
    titel: "Faradays lov",
    lav: () => {
      const N = rv([100, 200, 500, 1000]);
      const dPhi = rv([0.01, 0.02, 0.05]);
      const dt = rv([0.1, 0.2, 0.5]);
      const facit = afrund((N * dPhi) / dt, 1);
      return talOpgave({
        tekst: `Fluxen gennem en spole med ${N} vindinger ændres ${dk(dPhi)} Wb på ${dk(dt)} s. Beregn den inducerede spænding.`,
        enhed: "V",
        facit,
        tolerancePct: 2,
        hint: "ε = N · ΔΦ / Δt.",
        loesning: `ε = ${N} · ${dk(dPhi)}/${dk(dt)} = ${dk(facit, 1)} V.`,
      });
    },
  },
  {
    id: "ga-fotoelektrisk",
    titel: "Fotoelektrisk effekt",
    lav: () => {
      const metal = rv([
        { navn: "cæsium", W: 2.1 },
        { navn: "natrium", W: 2.7 },
        { navn: "zink", W: 4.3 },
      ]);
      const lam = rv([200, 250, 300, 400]);
      const Ef = 1240 / lam;
      if (Ef <= metal.W) {
        // vælg en bølgelængde der sikkert løsriver
        const lam2 = 200;
        const facit = afrund(1240 / lam2 - metal.W, 2);
        return talOpgave({
          tekst: `Lys med bølgelængden ${lam2} nm rammer ${metal.navn} (løsrivelsesarbejde W = ${dk(metal.W, 1)} eV). Beregn de udsendte elektroners maksimale kinetiske energi.`,
          enhed: "eV",
          facit,
          tolerancePct: 3,
          hint: "E_kin = E_foton − W, hvor E_foton = 1240/λ [eV].",
          loesning: `E_foton = 1240/${lam2} = ${dk(afrund(1240 / lam2, 2), 2)} eV. E_kin = ${dk(afrund(1240 / lam2, 2), 2)} − ${dk(metal.W, 1)} = ${dk(facit, 2)} eV.`,
        });
      }
      const facit = afrund(Ef - metal.W, 2);
      return talOpgave({
        tekst: `Lys med bølgelængden ${lam} nm rammer ${metal.navn} (løsrivelsesarbejde W = ${dk(metal.W, 1)} eV). Beregn de udsendte elektroners maksimale kinetiske energi.`,
        enhed: "eV",
        facit,
        tolerancePct: 3,
        hint: "E_kin = E_foton − W, hvor E_foton = 1240/λ [eV].",
        loesning: `E_foton = 1240/${lam} = ${dk(afrund(Ef, 2), 2)} eV. E_kin = ${dk(afrund(Ef, 2), 2)} − ${dk(metal.W, 1)} = ${dk(facit, 2)} eV.`,
      });
    },
  },
  {
    id: "ga-debroglie",
    titel: "de Broglie-bølgelængde",
    lav: () => {
      const vE6 = rv([1, 2, 4, 5]);
      const facit = afrund(6.63e-34 / (9.11e-31 * vE6 * 1e6) * 1e9, 2);
      return talOpgave({
        tekst: `Beregn de Broglie-bølgelængden af en elektron (m = 9,11 · 10⁻³¹ kg) med farten ${vE6} · 10⁶ m/s. Angiv svaret i nm. (h = 6,63 · 10⁻³⁴ J·s)`,
        enhed: "nm",
        facit,
        tolerancePct: 2,
        hint: "λ = h/(m·v). Omregn til nm.",
        loesning: `λ = 6,63·10⁻³⁴ / (9,11·10⁻³¹ · ${vE6}·10⁶) ≈ ${dk(facit, 2)} nm.`,
      });
    },
  },
  {
    id: "ga-massedefekt",
    titel: "Massedefekt",
    lav: () => {
      const dm = rv([0.0189, 0.0304, 0.2, 0.1]);
      const facit = afrund(dm * 931.5, 1);
      return talOpgave({
        tekst: `Ved en kernereaktion er massedefekten ${dk(dm)} u. Beregn den frigivne energi. (1 u svarer til 931,5 MeV)`,
        enhed: "MeV",
        facit,
        tolerancePct: 2,
        hint: "E = Δm · 931,5 MeV/u.",
        loesning: `E = ${dk(dm)} · 931,5 ≈ ${dk(facit, 1)} MeV.`,
      });
    },
  },
  {
    id: "ga-mc2",
    titel: "E = m·c²",
    lav: () => {
      const mg = rv([1, 2, 5, 10]);
      const facit = afrund(mg * 1e-3 * 9e16 / 1e12, 0);
      return talOpgave({
        tekst: `Hvor meget energi svarer ${mg} g masse til ifølge E = m·c²? Angiv svaret i TJ (terajoule, 10¹² J). (c = 3,00 · 10⁸ m/s)`,
        enhed: "TJ",
        facit,
        tolerancePct: 2,
        hint: "E = m·c² med m i kg. 1 TJ = 10¹² J.",
        loesning: `E = ${dk(mg / 1000, 3)} kg · (3,00·10⁸)² = ${dk(facit)}·10¹² J = ${dk(facit)} TJ.`,
      });
    },
  },
  {
    id: "ga-gamma",
    titel: "Gammafaktoren",
    lav: () => {
      const beta = rv([0.5, 0.6, 0.8, 0.9, 0.95]);
      const facit = afrund(1 / Math.sqrt(1 - beta * beta), 2);
      return talOpgave({
        tekst: `Et rumskib bevæger sig med farten ${dk(beta)}·c. Beregn gammafaktoren γ.`,
        enhed: "",
        facit,
        tolerancePct: 2,
        hint: `γ = 1/√(1 − v²/c²) — indsæt v = ${dk(beta)}·c, så v²/c² = ${dk(beta)}².`,
        loesning: `γ = 1/√(1 − ${dk(beta)}²) = 1/√(${dk(afrund(1 - beta * beta, 4))}) = ${dk(facit, 2)}.`,
      });
    },
  },
  {
    id: "ga-tidsforlaengelse",
    titel: "Tidsforlængelse",
    lav: () => {
      const beta = rv([0.6, 0.8, 0.9]);
      const gamma = 1 / Math.sqrt(1 - beta * beta);
      const t0 = rv([1, 2, 5, 10]);
      const facit = afrund(gamma * t0, 2);
      return talOpgave({
        tekst: `En astronaut rejser med ${dk(beta)}·c og oplever, at rejsen tager ${t0} år (egentid). Hvor lang tid tager rejsen målt fra Jorden?`,
        enhed: "år",
        facit,
        tolerancePct: 2,
        hint: "Δt = γ·Δt₀ med γ = 1/√(1 − v²/c²).",
        loesning: `γ = 1/√(1−${dk(beta)}²) = ${dk(afrund(gamma, 2), 2)}. Δt = ${dk(afrund(gamma, 2), 2)} · ${t0} år = ${dk(facit, 2)} år.`,
      });
    },
  },
  {
    id: "ga-wien",
    titel: "Wiens forskydningslov",
    lav: () => {
      const stjerne = rv([
        { navn: "Solen", T: 5778 },
        { navn: "Betelgeuse (rød superkæmpe)", T: 3600 },
        { navn: "Sirius A", T: 9940 },
        { navn: "Rigel (blå superkæmpe)", T: 11000 },
      ]);
      if (ri(0, 1) === 0) {
        const facit = afrund((2.9e-3 / stjerne.T) * 1e9, 0);
        return talOpgave({
          tekst: `${stjerne.navn} har overfladetemperaturen ${stjerne.T} K. Beregn bølgelængden, hvor stjernen udstråler mest, i nm. (b = 2,90 · 10⁻³ m·K)`,
          enhed: "nm",
          facit,
          tolerancePct: 2,
          hint: "λ_max = b / T. Omregn til nm.",
          loesning: `λ_max = 2,90·10⁻³ / ${stjerne.T} ≈ ${facit}·10⁻⁹ m = ${facit} nm.`,
        });
      }
      const lamMax = afrund((2.9e-3 / stjerne.T) * 1e9, 0);
      return talOpgave({
        tekst: `En stjerne udstråler mest ved bølgelængden ${lamMax} nm. Beregn dens overfladetemperatur. (b = 2,90 · 10⁻³ m·K)`,
        enhed: "K",
        facit: afrund(2.9e-3 / (lamMax * 1e-9), 0),
        tolerancePct: 2,
        hint: "T = b / λ_max, med λ_max i meter.",
        loesning: `T = 2,90·10⁻³ / ${lamMax}·10⁻⁹ ≈ ${afrund(2.9e-3 / (lamMax * 1e-9), 0)} K.`,
      });
    },
  },
  {
    id: "ga-hubble",
    titel: "Hubbles lov",
    lav: () => {
      const d = rv([10, 50, 100, 200, 400]);
      if (ri(0, 1) === 0)
        return talOpgave({
          tekst: `En galakse befinder sig ${d} Mpc fra os. Beregn dens flugthastighed ifølge Hubbles lov. (H₀ = 70 km/s pr. Mpc)`,
          enhed: "km/s",
          facit: 70 * d,
          tolerancePct: 2,
          hint: "v = H₀ · d.",
          loesning: `v = 70 km/s/Mpc · ${d} Mpc = ${dk(70 * d)} km/s.`,
        });
      return talOpgave({
        tekst: `En galakse fjerner sig fra os med ${dk(70 * d)} km/s. Beregn afstanden til den med Hubbles lov. (H₀ = 70 km/s pr. Mpc)`,
        enhed: "Mpc",
        facit: d,
        tolerancePct: 2,
        hint: "d = v / H₀.",
        loesning: `d = ${dk(70 * d)} / 70 = ${d} Mpc.`,
      });
    },
  },
];
