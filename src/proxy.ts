import { NextResponse, type NextRequest } from "next/server";
import { sessionCookie, verifySessionToken } from "@/lib/auth";

// Uygulama içi sayfalar (dashboard, exercises, my-plans, templates, settings) girişsiz
// erişilemez. Next.js 16'da "middleware" dosya konvansiyonu "proxy" olarak yeniden adlandırıldı
// (src/proxy.ts, export edilen fonksiyon adı da proxy) — eski middleware.ts hâlâ çalışıyor gibi
// görünse de sessizce hiç çalışmıyordu. Edge runtime'da çalışır: bcryptjs/Prisma burada
// kullanılamaz, sadece jose ile JWT imza/süre doğrulaması yapılır (DB'ye gitmeden hızlı kontrol).
const PROTECTED_PREFIXES = ["/dashboard", "/exercises", "/my-plans", "/templates", "/settings"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get(sessionCookie.name)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    // /login, landing'i login modal'ı açık şekilde render eder (bkz. LandingPage +
    // AuthModalProvider) — "landing'e yönlendir" ve "login modal'ını göster" burada aynı anda olur.
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/exercises/:path*",
    "/my-plans/:path*",
    "/templates/:path*",
    "/settings/:path*",
  ],
};
