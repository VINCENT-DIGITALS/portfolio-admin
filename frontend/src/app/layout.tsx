import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { OfflineCacheManager } from '@/components/OfflineCacheManager';

export const metadata: Metadata = {
  title: { default: 'My Portfolio', template: '%s — My Portfolio' },
  description: 'Personal portfolio, projects, and writing.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <OfflineCacheManager />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
