import { AppShell } from "@/components/shell/AppShell";
import { getSession } from "@/lib/auth/session";
import { listDemoUsers } from "@/lib/auth/demo";
import { loginAsDemoUser } from "@/lib/auth/actions";

export const dynamic = "force-dynamic";

/**
 * Login (doc 06 §6.5): Unilogin (elever) og MitID (lærere) er
 * produktions-vejene — her vises de som (endnu) inaktive indgange,
 * mens demo-rolleskifteren logger ind som seedede brugere.
 */
export default async function LoginPage() {
  const session = await getSession();
  const users = await listDemoUsers();
  const teachers = users.filter((u) => u.roleId === "teacher");
  const students = users.filter((u) => u.roleId === "student");

  return (
    <AppShell session={session}>
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Log ind</h1>
          <p className="mt-1 text-slate-600">
            Vælg din rolle. I skoledrift logger elever ind med Unilogin og
            lærere med MitID eller kommunens login.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            disabled
            title="Unilogin kobles på STIL-brokeren i pilotfasen"
            className="cursor-not-allowed rounded-2xl border border-slate-200 bg-white p-4 text-left opacity-60"
          >
            <span className="block font-bold">Unilogin</span>
            <span className="text-sm text-slate-500">For elever · kommer i pilotfasen</span>
          </button>
          <button
            disabled
            title="MitID/lokal IdP kobles på i pilotfasen"
            className="cursor-not-allowed rounded-2xl border border-slate-200 bg-white p-4 text-left opacity-60"
          >
            <span className="block font-bold">MitID / kommunalt login</span>
            <span className="text-sm text-slate-500">For lærere · kommer i pilotfasen</span>
          </button>
        </div>

        <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-5">
          <h2 className="text-lg font-bold">Demo-login</h2>
          <p className="text-sm text-slate-600">
            Prøv platformen som lærer eller elev i det seedede hold{" "}
            <strong>8.B Matematik</strong>.
          </p>

          <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Lærer
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {teachers.map((u) => (
              <form key={u.id} action={loginAsDemoUser}>
                <input type="hidden" name="userId" value={u.id} />
                <button className="rounded-xl bg-violet-600 px-4 py-2.5 font-semibold text-white hover:bg-violet-700">
                  👩‍🏫 {u.displayName}
                </button>
              </form>
            ))}
          </div>

          <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Elever
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {students.slice(0, 6).map((u) => (
              <form key={u.id} action={loginAsDemoUser}>
                <input type="hidden" name="userId" value={u.id} />
                <button className="rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700">
                  🎒 {u.displayName.split(" ")[0]}
                </button>
              </form>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
