import Link from "next/link";

const footerLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Templates", href: "/templates" },
  { label: "Exercise Library", href: "/exercises" },
];

export default function Footer() {
  return (
    <footer className="border-t border-foreground-muted/10 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand shadow-md shadow-brand/25">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M13 2 4 14h6l-2 8 10-13h-6l1-7Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Flexy</p>
            <p className="text-sm text-foreground-muted">Plan your workout week.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
          {footerLinks.map((link) => (
            <Link key={link.label} href={link.href} className="transition hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>

        <p className="text-xs text-foreground-muted">
          &copy; {new Date().getFullYear()} Flexy
        </p>
      </div>
    </footer>
  );
}
