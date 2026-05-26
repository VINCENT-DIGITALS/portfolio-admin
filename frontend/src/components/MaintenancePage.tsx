import Link from 'next/link';
import { Header } from './Header';
import { Footer } from './Footer';
import type { PublicSiteSettings } from '@/lib/types';

export function MaintenancePage({ settings }: { settings: PublicSiteSettings }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <section className="container-page py-20 sm:py-28">
          <div className="mx-auto max-w-xl text-center">
            <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <p className="eyebrow">Maintenance</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tighter sm:text-4xl">
              We&apos;ll be right back
            </h1>
            <p className="mt-3 text-base muted">
              {settings.maintenance_message}
            </p>
            <p className="mt-8 text-xs muted-2">
              Admin? <Link href="/admin/login" className="font-medium text-brand-700 hover:underline dark:text-brand-300">Sign in</Link> to disable maintenance mode.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
