import Link from "next/link";
import type { Identity } from "@/lib/auth/providers";
import { logout } from "@/lib/auth/actions";
import { SUBJECTS } from "@/lib/subjects";

/**
 * Global navigation (doc 04 §4.2): topbar med logo + fag-switcher +
 * rolleafhængig venstremenu. Elev: Hjem · Fagkort · Opgaver · Repetition ·
 * Fremskridt. Lærer: Hjem · Tildelinger · Overblik.
 */
export function AppShell({
  session,
  children,
}: {
  session: Identity | null;
  children: React.ReactNode;
}) {
  const navItems =
    session?.role === "teacher"
      ? [
          { href: "/laerer", label: "Hjem" },
          { href: "/laerer/tildel", label: "Ny tildeling" },
          { href: "/fag/math", label: "Bibliotek" },
        ]
      : session
        ? [
            { href: "/elev", label: "Hjem" },
            { href: "/fag/math", label: "Fagkort" },
            { href: "/elev/afleveringer", label: "Opgaver" },
            { href: "/elev/repetition", label: "Repetition" },
            { href: "/elev/fremskridt", label: "Fremskridt" },
          ]
        : [];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link href={session ? (session.role === "teacher" ? "/laerer" : "/elev") : "/"} className="flex items-center gap-2">
            <PrismeLogo />
            <span className="text-xl font-bold tracking-tight">Prisme</span>
          </Link>

          <nav aria-label="Fag" className="hidden items-center gap-1 md:flex">
            {SUBJECTS.map((s) => (
              <Link
                key={s.id}
                href={s.available ? `/fag/${s.id}` : "#"}
                aria-disabled={!s.available}
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  s.available
                    ? "text-slate-700 hover:bg-slate-100"
                    : "cursor-default text-slate-400"
                }`}
                style={{ borderBottom: `3px solid ${s.hex}` }}
              >
                {s.name}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {session ? (
              <>
                <span className="text-sm text-slate-600">
                  {session.displayName}
                  <span className="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                    {session.role === "teacher" ? "Lærer" : "Elev"}
                  </span>
                </span>
                <Link href="/login" className="text-sm text-slate-500 underline hover:text-slate-800">
                  Skift rolle
                </Link>
                <form action={logout}>
                  <button className="text-sm text-slate-500 underline hover:text-slate-800">
                    Log ud
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Log ind
              </Link>
            )}
          </div>
        </div>

        {navItems.length > 0 && (
          <nav aria-label="Hovedmenu" className="border-t border-slate-100 bg-slate-50">
            <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-white hover:shadow-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>

      <footer className="border-t border-slate-200 bg-white py-4">
        <p className="mx-auto max-w-6xl px-4 text-sm text-slate-500">
          🔒 Dine data bliver i EU. Ingen reklamer, ingen tracking — Prisme er
          bygget til danske skoler med Unilogin og databehandleraftale.
        </p>
      </footer>
    </div>
  );
}

function PrismeLogo() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden focusable="false">
      <polygon points="16,3 29,27 3,27" fill="#0f172a" />
      <g strokeWidth="2.6" fill="none">
        <line x1="16" y1="13" x2="27" y2="9" stroke="#2563eb" />
        <line x1="16" y1="15" x2="28" y2="14" stroke="#7c3aed" />
        <line x1="16" y1="17" x2="28" y2="19" stroke="#16a34a" />
        <line x1="16" y1="19" x2="27" y2="24" stroke="#ea580c" />
        <line x1="16" y1="21" x2="25" y2="28" stroke="#ca8a04" />
      </g>
    </svg>
  );
}
