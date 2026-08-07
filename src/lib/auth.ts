import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";
const SESSION_COOKIE = "admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8h

export interface AdminSessionPayload {
  adminId: string;
  usuario: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signSession(payload: AdminSessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: SESSION_DURATION_SECONDS });
}

export function verifySession(token: string): AdminSessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminSessionPayload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const SESSION_MAX_AGE = SESSION_DURATION_SECONDS;

/** Lee y valida la sesión de admin a partir de las cookies de un NextRequest. */
export function getAdminSession(request: {
  cookies: { get(name: string): { value: string } | undefined };
}): AdminSessionPayload | null {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Para usar en Server Components: ¿hay una sesión de admin activa? */
export async function isAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return Boolean(getAdminSession({ cookies: cookieStore }));
}
