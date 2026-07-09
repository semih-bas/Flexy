import { SignJWT, jwtVerify } from "jose";

// Bu dosya bilerek edge-safe: middleware (edge runtime) bunu import ediyor. Şifre hash'leme
// (bcryptjs, Node-only) kasıtlı olarak burada değil, ayrı src/lib/password.ts'te — aksi halde
// middleware'in edge bundle'ı bcryptjs'i de içermeye çalışır ve build hata verir.
const SESSION_COOKIE_NAME = "flexy_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 gün

function getAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: string;
};

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getAuthSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    if (typeof payload.userId !== "string") return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

export const sessionCookie = {
  name: SESSION_COOKIE_NAME,
  maxAge: SESSION_DURATION_SECONDS,
};
