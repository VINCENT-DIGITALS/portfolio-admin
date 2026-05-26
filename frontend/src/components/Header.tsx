'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeProvider';
import { classNames } from '@/lib/utils';
import { DEFAULT_PUBLIC_SETTINGS, type PublicSiteSettings } from '@/lib/types';

const ALL_NAV = [
  { href: '/', label: 'Home', key: 'home' as const },
  { href: '/about', label: 'About', key: 'about' as const },
  { href: '/projects', label: 'Projects', key: 'projects' as const },
  { href: '/blogs', label: 'Blogs', key: 'blogs' as const },
  { href: '/comments', label: 'Comments', key: 'comments' as const },
  { href: '/contact', label: 'Contact', key: 'contact' as const },
];

export function Header({ settings }: { settings?: PublicSiteSettings }) {
  const nav = settings?.nav ?? DEFAULT_PUBLIC_SETTINGS.nav;
  const items = ALL_NAV.filter((item) => nav[item.key]);
  const siteTitle = (settings?.site_title || 'My Portfolio').trim();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/65 dark:border-slate-800/70 dark:bg-slate-950/85 dark:supports-[backdrop-filter]:bg-slate-950/65">
      <div className="container-wide flex h-16 items-center gap-3 lg:gap-6">
        <Link
          href="/"
          aria-label={siteTitle}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span
            aria-hidden
            className="relative inline-flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-brand-500 transition group-hover:bg-brand-600 dark:bg-brand-400 dark:group-hover:bg-brand-300"
          >
            <span aria-hidden className="absolute inset-0 -m-1 rounded-full bg-brand-500/20 opacity-0 transition group-hover:opacity-100 dark:bg-brand-400/20" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {siteTitle}
          </span>
        </Link>

        {/* Desktop nav — right-aligned */}
        <nav className="ml-auto hidden lg:flex items-center gap-0.5" aria-label="Primary">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={classNames(
                  'relative rounded-md px-3 py-1.5 text-sm font-medium transition',
                  active
                    ? 'text-brand-700 dark:text-brand-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/70',
                )}
              >
                {item.label}
                {active && (
                  <span aria-hidden className="absolute inset-x-3 -bottom-[1px] h-px bg-brand-600 dark:bg-brand-400" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto lg:ml-2 flex items-center gap-1.5">
          <ThemeToggle />
          <button
            type="button"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {open ? (
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
        </div>
      </div>

      {/* Mobile drawer panel */}
      <div
        id="mobile-nav"
        className={classNames(
          'lg:hidden overflow-hidden border-t border-slate-200/70 transition-[max-height] duration-300 dark:border-slate-800/70',
          open ? 'max-h-[480px]' : 'max-h-0',
        )}
      >
        <nav className="container-wide flex flex-col gap-0.5 py-3" aria-label="Mobile">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={classNames(
                  'rounded-lg px-3 py-2.5 text-sm font-medium',
                  active
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-200'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
