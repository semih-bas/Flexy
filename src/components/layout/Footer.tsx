import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#05060a]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 p-1">
            <Image
              src="/brand/logo.png"
              alt="Flexy logo"
              width={24}
              height={24}
              className="h-auto w-full"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Flexy</p>
            <p className="text-sm text-zinc-400">Plan less. Train better.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
          <Link href="#" className="transition hover:text-white">
            Privacy
          </Link>
          <Link href="#" className="transition hover:text-white">
            Terms
          </Link>
          <Link href="#" className="transition hover:text-white">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}