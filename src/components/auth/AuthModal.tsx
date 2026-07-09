'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { ctaButtonGlow, surfaceGlow } from '@/lib/surfaceStyles';
import type { AuthMode } from './AuthModalProvider';

type AuthModalProps = {
  mode: AuthMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
};

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.3" />
      <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.7" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path
        d="M10.6 5.7A9.9 9.9 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a15.6 15.6 0 0 1-3.3 4M6.6 6.6C4 8.3 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.4 0 2.6-.3 3.7-.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.9 10a2.7 2.7 0 0 0 3.9 3.8" strokeLinecap="round" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.8Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-3c-1.08.73-2.46 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39l4-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4 3.11C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

type AuthFieldProps = {
  label: string;
  type: string;
  placeholder: string;
  autoComplete: string;
  icon: ReactNode;
};

// Name/Email alanları aynı ikonlu-input desenini paylaşıyor: tek yerden üretiliyor. Password
// alanı ayrı (göster/gizle butonu gerektiği için) ama aynı görsel dili kullanıyor.
function AuthField({ label, type, placeholder, autoComplete, icon }: AuthFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground-muted">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted">
          {icon}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3.5 text-sm text-foreground outline-none transition placeholder:text-foreground-muted/50 focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
        />
      </div>
    </label>
  );
}

function PasswordField({
  showPassword,
  onToggle,
  autoComplete,
}: {
  showPassword: boolean;
  onToggle: () => void;
  autoComplete: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground-muted">Password</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted">
          <LockIcon />
        </span>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-10 text-sm text-foreground outline-none transition placeholder:text-foreground-muted/50 focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted transition hover:text-foreground"
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </label>
  );
}

// Login ve Register aynı bileşen: tek kaynak, mode prop'una göre alan/metin farkı gösteriyor.
export default function AuthModal({ mode, onClose, onSwitchMode }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isLogin = mode === 'login';
  // Backend bağlanınca burada gerçek bir hata mesajı set edilecek; şimdilik hep null, satır
  // hiç render edilmiyor — stil hazır, davranış TODO.
  const errorMessage: string | null = null;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // TODO: Faz 3'te auth eklenince gerçek login/register isteğine bağlanacak. Şimdilik form
  // sadece sayfanın yenilenmesini engelliyor, hiçbir şey göndermiyor.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border border-foreground/10 bg-surface p-6 shadow-2xl shadow-black/40 sm:p-8 ${surfaceGlow}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-foreground-muted/15 bg-foreground/5 text-foreground transition hover:bg-foreground/10"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>

        <Link href="/" onClick={onClose} className="mx-auto mb-5 flex w-fit items-center justify-center">
          <Image src="/brand/logo-transparent.png" alt="Flexy" width={1221} height={320} className="h-8 w-auto" />
        </Link>

        <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-brand">
          {isLogin ? 'Welcome back' : 'Get started'}
        </p>
        <h2 className="mt-1 text-center text-2xl font-bold text-foreground">
          {isLogin ? 'Log in to Flexy' : 'Create your Flexy account'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {!isLogin && (
            <AuthField label="Name" type="text" placeholder="Your name" autoComplete="name" icon={<UserIcon />} />
          )}
          <AuthField
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            icon={<MailIcon />}
          />
          <PasswordField
            showPassword={showPassword}
            onToggle={() => setShowPassword((prev) => !prev)}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
          {!isLogin && (
            <p className="text-xs leading-5 text-foreground-muted">
              Use at least 8 characters with a mix of letters and numbers.
            </p>
          )}

          {errorMessage && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-danger">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5m0 3h.01" strokeLinecap="round" />
              </svg>
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className={`w-full rounded-xl px-4 py-2.5 text-sm font-bold text-white ${ctaButtonGlow}`}
          >
            {isLogin ? 'Log in' : 'Create account'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground-muted">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* TODO: Yayın sonrası gerçek Google OAuth akışına bağlanacak. */}
        <button
          type="button"
          disabled
          title="Coming soon"
          className="flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground-muted opacity-70"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-foreground-muted">
          {isLogin ? 'New to Flexy? ' : 'Already have an account? '}
          <button
            type="button"
            onClick={() => onSwitchMode(isLogin ? 'register' : 'login')}
            className="font-semibold text-brand transition hover:underline"
          >
            {isLogin ? 'Create account' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
