'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'My Plans',
    href: '/my-plans',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21s-6-3.7-6-9a4 4 0 0 1 7-2.4A4 4 0 0 1 18 12c0 5.3-6 9-6 9Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Workout Templates',
    href: '/templates',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 4h10M7 20h10M8 8h8M8 16h8" strokeLinecap="round" />
        <path d="M10 4v16M14 4v16" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Exercise Library',
    href: '/exercises',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 5h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm8 0h-3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3.2" />
        <path d="M19 12a7.2 7.2 0 0 0-.1-1.1l2.1-1.6-2-3.5-2.5 1a7.8 7.8 0 0 0-1.9-1.1l-.3-2.8h-4l-.3 2.8a7.8 7.8 0 0 0-1.9 1.1l-2.5-1-2 3.5 2.1 1.6A7.2 7.2 0 0 0 5 12c0 .4 0 .7.1 1.1L3 14.7l2 3.5 2.5-1c.6.5 1.2.8 1.9 1.1l.3 2.8h4l.3-2.8c.7-.3 1.3-.6 1.9-1.1l2.5 1 2-3.5-2.1-1.6c.1-.3.1-.7.1-1.1Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`fixed left-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#0d1426]/95 text-slate-100 shadow-lg shadow-black/30 backdrop-blur transition-opacity duration-300 ${
          isOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        aria-label="Open sidebar"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Close sidebar backdrop"
        onClick={closeSidebar}
        className={`fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[84vw] flex-col justify-between border-r border-white/10 bg-[#060816]/95 p-5 text-slate-100 shadow-[0_0_80px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 shadow-lg shadow-cyan-500/20">
                <span className="text-lg font-semibold tracking-[0.2em] text-white">F</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Flexy</p>
                <h2 className="text-base font-semibold text-white">Training Hub</h2>
              </div>
            </div>

            <button
              type="button"
              onClick={closeSidebar}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
              aria-label="Close sidebar"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-sky-500/10 text-white shadow-inner shadow-cyan-500/10'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActive ? 'bg-cyan-500/15 text-cyan-300' : 'bg-white/5 text-slate-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-6 rounded-[24px] border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="mb-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Flexy v2.0
          </div>
          <p className="text-sm leading-6 text-slate-300">
            Weekly workout planning and tracking application
          </p>
          <button
            type="button"
            className="mt-4 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
