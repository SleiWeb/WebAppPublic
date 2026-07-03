import { eq } from "drizzle-orm";
import { db, tables } from "@/db";
import type { AuthProvider, Identity } from "./providers";

/**
 * Demo-provider: logger ind som en seedet demo-bruger (Elev/Lærer).
 * Bruges til udvikling og pilot-demoer; erstattes af Unilogin/MitID
 * i produktion uden ændringer i UI-komponenterne.
 */
export const demoProvider: AuthProvider = {
  id: "demo",
  name: "Demo-login",
  async authenticate(params): Promise<Identity> {
    const userId = params.userId;
    if (!userId) throw new Error("Vælg en demo-bruger");
    const [user] = await db
      .select()
      .from(tables.users)
      .where(eq(tables.users.id, userId));
    if (!user) throw new Error("Ukendt demo-bruger");
    const roleRows = await db
      .select()
      .from(tables.userRoles)
      .where(eq(tables.userRoles.userId, user.id));
    const role = roleRows.some((r) => r.roleId === "teacher")
      ? "teacher"
      : roleRows.some((r) => r.roleId === "school_admin")
        ? "school_admin"
        : "student";
    return {
      userId: user.id,
      displayName: user.displayName,
      role,
      provider: "demo",
    };
  },
};

/** Demo-brugere til rolleskifteren på login-siden. */
export async function listDemoUsers() {
  const rows = await db
    .select({
      id: tables.users.id,
      displayName: tables.users.displayName,
      roleId: tables.userRoles.roleId,
    })
    .from(tables.users)
    .innerJoin(tables.userRoles, eq(tables.userRoles.userId, tables.users.id));
  return rows;
}
