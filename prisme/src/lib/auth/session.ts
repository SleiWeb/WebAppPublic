import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { Identity } from "./providers";

/**
 * Session: HMAC-signeret cookie. I produktion afløses den af korte
 * JWT/access-tokens + roterende refresh (doc 06 §6.5) — kontrakten
 * mod resten af appen (getSession/requireSession) er den samme.
 */

const COOKIE_NAME = "prisme_session";

function secret(): string {
  return process.env.SESSION_SECRET ?? "dev-session-secret-change-me";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function encodeSession(identity: Identity): string {
  const payload = Buffer.from(JSON.stringify(identity)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token: string): Identity | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString());
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Identity | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return decodeSession(token);
}

export async function setSessionCookie(identity: Identity): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, encodeSession(identity), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function requireSession(
  role?: Identity["role"]
): Promise<Identity> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  if (role && session.role !== role) throw new Error("FORBIDDEN");
  return session;
}
