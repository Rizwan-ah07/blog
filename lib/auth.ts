import { cookies } from "next/headers";
import { createHash } from "crypto";

const COOKIE_NAME = "stageBlog_admin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getExpectedToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  return createHash("sha256")
    .update(password + "::stageBlog_v1")
    .digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return token === getExpectedToken();
}

export function buildAuthCookie(value: string): string {
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`;
}

export function buildLogoutCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function verifyPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  return input === password;
}

export function generateToken(): string {
  return getExpectedToken();
}

export { COOKIE_NAME };
