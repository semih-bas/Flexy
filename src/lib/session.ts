import { cookies } from "next/headers";
import { sessionCookie, verifySessionToken } from "./auth";

// Route handler'lar ve server component'ler için: cookie'deki session token'ı doğrular ve
// userId'yi döner. bcryptjs gerektirmediği için (sadece JWT doğrulaması) middleware'deki
// mantıkla aynıdır, ama burada Node.js runtime'da (route handler/server component) çalışır.
export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie.name)?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  return session?.userId ?? null;
}
