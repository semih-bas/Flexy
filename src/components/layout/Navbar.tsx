import Link from 'next/link';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Why Flexy', href: '#why-flexy' },
  { label: 'Preview', href: '#preview' },
  { label: 'Exercises', href: '#exercises' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-foreground-muted/10 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="#home" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand shadow-md shadow-brand/25">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M13 2 4 14h6l-2 8 10-13h-6l1-7Z" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">Flexy</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-foreground-muted md:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="transition hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>

        {/* TODO: Faz 3'te auth eklenince Login/Create Account gerçek giriş ve kayıt akışına bağlanacak. */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            disabled
            title="Coming soon"
            className="cursor-not-allowed rounded-full border border-foreground-muted/20 px-3 py-2 text-sm font-semibold text-foreground-muted sm:px-4"
          >
            Login
          </button>
          <button
            type="button"
            disabled
            title="Coming soon"
            className="cursor-not-allowed rounded-full bg-brand px-3 py-2 text-sm font-semibold text-white opacity-80 shadow-sm shadow-brand/30 sm:px-4"
          >
            Create Account
          </button>
        </div>
      </nav>
    </header>
  );
}
