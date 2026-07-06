import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-foreground-muted/10 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 p-1">
            <Image
              src="/brand/logo.png"
              alt="Flexy logo"
              width={24}
              height={24}
              className="h-auto w-full"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Flexy</p>
            <p className="text-sm text-foreground-muted">Plan less. Train better.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
          <Link href="#" className="transition hover:text-foreground">
            Privacy
          </Link>
          <Link href="#" className="transition hover:text-foreground">
            Terms
          </Link>
          <Link href="#" className="transition hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}