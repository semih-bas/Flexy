import LandingPage from "@/components/landing/LandingPage";

// Ayrı bir sayfa değil: landing'in üzerinde register modal'ı açık başlıyor (bkz. AuthModalProvider).
// Böylece /register doğrudan paylaşılabilir bir URL olarak da çalışır.
export default function RegisterPage() {
  return <LandingPage initialAuthMode="register" />;
}
