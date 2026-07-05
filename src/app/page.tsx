import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <Navbar />

      <section className="px-4 py-20">
        <h1 className="text-4xl font-bold">Flexy v2</h1>
        <p className="mt-4 text-zinc-400">
          Haftalık antrenman planını oluştur, takip et ve gelişimini daha düzenli yönet.
        </p>
      </section>
    </main>
  );
}