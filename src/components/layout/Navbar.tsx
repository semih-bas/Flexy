'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSettings, type Language } from '@/components/settings/SettingsProvider';
import { ctaButtonGlow } from '@/lib/surfaceStyles';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Why Flexy', href: '#why-flexy' },
  { label: 'Preview', href: '#preview' },
  { label: 'Exercises', href: '#exercises' },
];

const languages: Language[] = ['EN', 'TR'];

export default function Navbar() {
  const { language, setLanguage } = useSettings();

  return (
    <header className="sticky top-0 z-50 border-b border-foreground-muted/10 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="#home" className="flex shrink-0 items-center">
          <Image
            src="/brand/logo-transparent.png"
            alt="Flexy"
            width={1221}
            height={320}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-foreground-muted md:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="transition hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>

        {/* TODO: Faz 3'te auth eklenince Login/Create Account gerçek giriş ve kayıt akışına bağlanacak.
            Dil hapı şimdilik sadece state değiştiriyor: gerçek i18n ileride ayrı bir iş. */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div
            role="group"
            aria-label="Language"
            className="hidden items-center gap-1 rounded-full border border-foreground-muted/20 p-1 sm:flex"
          >
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                aria-pressed={language === lang}
                onClick={() => setLanguage(lang)}
                className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${
                  language === lang
                    ? 'bg-foreground text-background'
                    : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <a
            href="#"
            title="Coming soon"
            className="rounded-full border border-foreground-muted/20 px-3 py-2 text-sm font-semibold text-foreground-muted transition hover:border-brand/40 hover:text-foreground sm:px-4"
          >
            Login
          </a>
          <a
            href="#"
            title="Coming soon"
            className={`rounded-full px-3 py-2 text-sm font-semibold text-white sm:px-4 ${ctaButtonGlow}`}
          >
            Create Account
          </a>
        </div>
      </nav>
    </header>
  );
}
