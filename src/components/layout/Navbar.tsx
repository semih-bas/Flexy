import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05060a]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400 font-bold text-black">
            F
          </div>
          <span className="text-lg font-semibold text-white">Flexy</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
          <Link href="#features" className="hover:text-white">
            Features
          </Link>
          <Link href="#how-it-works" className="hover:text-white">
            How it works
          </Link>
          <Link href="#mobile" className="hover:text-white">
            Mobile
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-full border border-white/10 px-3 py-2 text-sm text-zinc-300">
            EN
          </button>

          <Link
            href="/login"
            className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-300"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}