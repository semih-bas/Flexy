import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/landing/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <Navbar />
      <HeroSection />
    </main>
  );
}