'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
  const nav = (settings?.nav ?? DEFAULT_PUBLIC_SETTINGS.nav);
  const items = ALL_NAV.filter((item) => nav[item.key]);
  const siteTitle = settings?.site_title || 'portfolio';
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/80">
      <div className="container-page flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="text-brand-600">/</span>{siteTitle}
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {items.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={classNames(
                  'rounded-md px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800',
                  active && 'text-brand-700 dark:text-brand-300'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="md:hidden btn-secondary !px-3 !py-1.5"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="container-page py-2 flex flex-col gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
