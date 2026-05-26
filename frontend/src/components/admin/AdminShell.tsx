'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { ThemeToggle } from '@/components/ThemeProvider';
import { classNames } from '@/lib/utils';

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/projects', label: 'Projects', icon: '💼' },
  { href: '/admin/blogs', label: 'Blogs', icon: '📝' },
  { href: '/admin/comments', label: 'Comments', icon: '💬' },
  { href: '/admin/contact-messages', label: 'Messages', icon: '✉️' },
  { href: '/admin/profile', label: 'Profile', icon: '👤' },
  { href: '/admin/media', label: 'Media', icon: '🖼️' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-14 items-center border-b border-slate-200 px-4 font-semibold dark:border-slate-800">
          <Link href="/admin/dashboard"><span className="text-brand-600">/</span>admin</Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={classNames(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm',
                  active
                    ? 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-200'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )}
              >
                <span aria-hidden>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-3 dark:border-slate-800">
          <Link href="/" target="_blank" className="block text-xs text-slate-500 hover:underline">View site →</Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="md:hidden font-semibold"><span className="text-brand-600">/</span>admin</div>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <ThemeToggle />
            <span className="text-slate-500 hidden sm:inline">{user?.email}</span>
            <button onClick={logout} className="btn-secondary !py-1.5">Logout</button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
