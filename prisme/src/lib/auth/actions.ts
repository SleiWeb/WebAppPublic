"use server";

import { redirect } from "next/navigation";
import { demoProvider } from "./demo";
import { clearSessionCookie, setSessionCookie } from "./session";

/** Demo-login: vælg en seedet bruger (Elev/Lærer) på login-siden. */
export async function loginAsDemoUser(formData: FormData) {
  const userId = String(formData.get("userId") ?? "");
  const identity = await demoProvider.authenticate({ userId });
  await setSessionCookie(identity);
  redirect(identity.role === "teacher" ? "/laerer" : "/elev");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/");
}
