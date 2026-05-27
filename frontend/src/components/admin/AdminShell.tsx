'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { ThemeToggle } from '@/components/ThemeProvider';
import { classNames } from '@/lib/utils';

type IconName =
  | 'dashboard' | 'projects' | 'blogs' | 'comments'
  | 'messages' | 'profile' | 'media' | 'settings';

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: '/admin/dashboard',         label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/projects',          label: 'Projects',  icon: 'projects' },
  { href: '/admin/blogs',             label: 'Blogs',     icon: 'blogs' },
  { href: '/admin/comments',          label: 'Comments',  icon: 'comments' },
  { href: '/admin/contact-messages',  label: 'Messages',  icon: 'messages' },
  { href: '/admin/profile',           label: 'Profile',   icon: 'profile' },
  { href: '/admin/media',             label: 'Media',     icon: 'media' },
  { href: '/admin/settings',          label: 'Settings',  icon: 'settings' },
];

function Icon({ name, className = 'h-4 w-4' }: { name: IconName; className?: string }) {
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className, 'aria-hidden': true };
  switch (name) {
    case 'dashboard':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      );
    case 'projects':
      return (
        <svg {...common}>
          <path d="M3 7l9-4 9 4-9 4-9-4z" />
          <path d="M3 12l9 4 9-4" />
          <path d="M3 17l9 4 9-4" />
        </svg>
      );
    case 'blogs':
      return (
        <svg {...common}>
          <path d="M4 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V4z" />
          <line x1="8" y1="8" x2="14" y2="8" />
          <line x1="8" y1="12" x2="14" y2="12" />
          <line x1="8" y1="16" x2="12" y2="16" />
        </svg>
      );
    case 'comments':
      return (
        <svg {...common}>
          <path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4A8.5 8.5 0 0 1 12 20a8.38 8.38 0 0 1-3.8-.9L3 20l1-4.2A8.5 8.5 0 1 1 21 11.5z" />
        </svg>
      );
    case 'messages':
      return (
        <svg {...common}>
          <path d="M4 4h16v16H4z" />
          <polyline points="4,4 12,13 20,4" />
        </svg>
      );
    case 'profile':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
        </svg>
      );
    case 'media':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9 1.65 1.65 0 0 0 4.27 7.18l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
  }
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/65 dark:border-slate-800/80 dark:bg-slate-900/85 dark:supports-[backdrop-filter]:bg-slate-900/65">
        <div className="container-admin flex h-14 min-w-0 items-center gap-3">
          <button
            type="button"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="admin-mobile-nav"
            aria-label="Toggle menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

          <Link href="/admin/dashboard" aria-label="Admin" className="group inline-flex min-w-0 items-center gap-2.5">
            <span aria-hidden className="relative inline-flex h-2 w-2 shrink-0 rounded-full bg-brand-500 transition group-hover:bg-brand-600 dark:bg-brand-400 dark:group-hover:bg-brand-300">
              <span aria-hidden className="absolute inset-0 -m-1 rounded-full bg-brand-500/20 opacity-0 transition group-hover:opacity-100 dark:bg-brand-400/20" />
            </span>
            <span className="truncate text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Admin <span className="hidden sm:inline muted-2 font-normal">· Portfolio</span>
            </span>
          </Link>

          <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2">
            <Link href="/" target="_blank" rel="noreferrer" className="hidden sm:inline-flex btn-ghost !h-9 !py-0 text-xs">
              View site
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7"/><polyline points="7 7 17 7 17 17"/></svg>
            </Link>
            <ThemeToggle />
            <span className="hidden md:inline muted-2 text-xs truncate max-w-[160px]">{user?.email}</span>
            <button onClick={logout} className="btn-secondary !h-9 !py-0 text-sm">Logout</button>
          </div>
        </div>

        {/* Desktop horizontal nav */}
        <nav className="hidden md:block border-t border-slate-200/60 dark:border-slate-800/60" aria-label="Admin">
          <div className="container-admin flex items-center gap-1 overflow-x-auto py-2">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={classNames(
                    'group inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition',
                    active
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon name={item.icon} className={classNames('h-4 w-4', active ? 'text-brand-600 dark:text-brand-300' : 'text-slate-400 group-hover:text-slate-500 dark:text-slate-500')} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile drawer panel */}
        <div
          id="admin-mobile-nav"
          className={classNames(
            'md:hidden overflow-hidden border-t border-slate-200/60 transition-[max-height] duration-300 dark:border-slate-800/60',
            menuOpen ? 'max-h-[640px]' : 'max-h-0',
          )}
        >
          <nav className="container-admin flex flex-col gap-0.5 py-3" aria-label="Admin mobile">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={classNames(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium',
                    active
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-200'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
                  )}
                >
                  <Icon name={item.icon} className={classNames('h-4 w-4', active ? 'text-brand-600 dark:text-brand-300' : 'text-slate-400 dark:text-slate-500')} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="container-admin min-w-0 flex-1 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
