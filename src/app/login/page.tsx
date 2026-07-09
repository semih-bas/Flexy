import LandingPage from "@/components/landing/LandingPage";

// Ayrı bir sayfa değil: landing'in üzerinde login modal'ı açık başlıyor (bkz. AuthModalProvider).
// Böylece /login doğrudan paylaşılabilir bir URL olarak da çalışır.
export default function LoginPage() {
  return <LandingPage initialAuthMode="login" />;
}
