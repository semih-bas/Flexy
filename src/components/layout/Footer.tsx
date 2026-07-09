import Image from 'next/image';
import Link from 'next/link';
import StoreButton from '@/components/landing/StoreButton';

// Landing sayfa içi anchor'lar dışında hiçbir yere gitmez: footer'dan uygulama içine
// (dashboard/templates/exercises route'ları) link verilmiyor — tek teorik giriş Navbar'daki
// Login/Create Account.
const productLinks = [
  { label: 'Why Flexy', href: '#why-flexy' },
  { label: 'Preview', href: '#preview' },
  { label: 'Exercises', href: '#exercises' },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground-muted">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-foreground-muted transition hover:text-foreground">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-foreground-muted/10 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <Image
              src="/brand/logo-transparent.png"
              alt="Flexy"
              width={1221}
              height={320}
              className="h-7 w-auto"
            />
            <p className="mt-3 max-w-[16rem] text-sm leading-6 text-foreground-muted">
              Plan your workout week, track progress, and stay consistent.
            </p>
          </div>

          <FooterColumn title="Product" links={productLinks} />

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground-muted">Get the App</p>
            <div className="mt-3 flex flex-col gap-2">
              <StoreButton storeName="App Store" label="Coming soon" />
              <StoreButton storeName="Google Play" label="Coming soon" />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-foreground-muted/10 pt-6">
          <p className="text-xs text-foreground-muted">&copy; {new Date().getFullYear()} Flexy</p>
        </div>
      </div>
    </footer>
  );
}
