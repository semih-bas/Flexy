import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05060a]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 p-1">
            <Image
              src="/brand/logo.png"
              alt="Flexy logo"
              width={28}
              height={28}
              className="h-auto w-full"
            />
          </div>
          <span className="text-lg font-semibold text-white">Flexy</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
          <Link href="#features" className="transition hover:text-white">
            Features
          </Link>
          <Link href="#how-it-works" className="transition hover:text-white">
            How it works
          </Link>
          <Link href="#mobile" className="transition hover:text-white">
            Mobile
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="rounded-full border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:border-cyan-400/40 hover:text-white">
            EN
          </button>

          <Link
            href="#features"
            className="rounded-full bg-cyan-400 px-3 py-2 text-sm font-semibold text-black transition hover:bg-cyan-300 sm:px-4"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}