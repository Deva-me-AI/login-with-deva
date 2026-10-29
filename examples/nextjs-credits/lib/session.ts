import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";

type Session = {
  accessToken?: string;
  state?: string;
  verifier?: string;
  expiresAt: number;
};
// Single-process demonstration. Use a shared, expiring server-side store in production.
const globalSessions = globalThis as typeof globalThis & {
  devaSessions?: Map<string, Session>;
};
const sessions = (globalSessions.devaSessions ??= new Map<string, Session>());
export const appOrigin = () =>
  new URL(process.env.APP_ORIGIN ?? "http://localhost:3000").origin;
export function config() {
  const clientId = process.env.DEVA_CLIENT_ID;
  const clientSecret = process.env.DEVA_CLIENT_SECRET;
  if (!clientId || !clientSecret)
    throw new Error("Configure DEVA_CLIENT_ID and DEVA_CLIENT_SECRET");
  return {
    clientId,
    clientSecret,
    redirectUri: `${appOrigin()}/api/deva/callback`,
  };
}
export async function readSession() {
  const id = (await cookies()).get("deva_session")?.value;
  const session = id ? sessions.get(id) : undefined;
  if (session && session.expiresAt > Date.now()) return session;
  if (id) sessions.delete(id);
  return undefined;
}
export async function saveSession(session: Session) {
  const jar = await cookies();
  const previous = jar.get("deva_session")?.value;
  if (previous) sessions.delete(previous);
  for (const [key, value] of sessions)
    if (value.expiresAt <= Date.now()) sessions.delete(key);
  const id = randomBytes(32).toString("base64url");
  sessions.set(id, session);
  jar.set("deva_session", id, {
    httpOnly: true,
    secure: appOrigin().startsWith("https:"),
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000)),
  });
}
