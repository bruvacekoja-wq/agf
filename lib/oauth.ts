import crypto from "node:crypto";
import { cookies } from "next/headers";

export function configured(...keys: string[]) {
  return keys.every((key) => Boolean(process.env[key]));
}
export function appUrl() {
  return (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
}
export async function setOAuthState(provider: string) {
  const state = crypto.randomBytes(24).toString("hex");
  const jar = await cookies();
  jar.set(`oauth_${provider}_state`, state, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 600
  });
  return state;
}
export async function verifyOAuthState(provider: string, state: string | null) {
  const jar = await cookies();
  const expected = jar.get(`oauth_${provider}_state`)?.value;
  jar.delete(`oauth_${provider}_state`);
  return Boolean(expected && state && expected === state);
}
