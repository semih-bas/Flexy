import Image from "next/image";
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
          <Image
            src="/brand/logo-transparent.png"
            alt="Flexy"
            width={1221}
            height={320}
            className="h-6 w-auto"
          />
          <p className="text-sm text-foreground-muted">Plan your workout week.</p>
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
