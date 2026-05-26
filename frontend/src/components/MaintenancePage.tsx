import Link from 'next/link';
import { Header } from './Header';
import { Footer } from './Footer';
import type { PublicSiteSettings } from '@/lib/types';

export function MaintenancePage({ settings }: { settings: PublicSiteSettings }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header settings={settings} />
      <main className="flex-1">
        <section className="container-page py-24 text-center">
          <div className="mx-auto max-w-xl">
            <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl dark:bg-amber-500/10">
              🛠️
            </div>
            <h1 className="text-3xl font-bold">We&apos;ll be right back</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              {settings.maintenance_message}
            </p>
         
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
