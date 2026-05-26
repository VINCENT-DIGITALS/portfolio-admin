import { Header } from './Header';
import { Footer } from './Footer';
import { MaintenancePage } from './MaintenancePage';
import { ssrFetch } from '@/lib/api';
import { DEFAULT_PUBLIC_SETTINGS, type PublicSiteSettings } from '@/lib/types';

async function getSettings(): Promise<PublicSiteSettings> {
  const res = await ssrFetch<{ data: PublicSiteSettings }>('/api/public-settings', 15);
  return res?.data ?? DEFAULT_PUBLIC_SETTINGS;
}

export async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  if (settings.maintenance_mode) {
    return <MaintenancePage settings={settings} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
