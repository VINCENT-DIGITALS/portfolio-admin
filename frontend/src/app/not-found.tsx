import Link from 'next/link';
import { PublicLayout } from '@/components/PublicLayout';

export default function NotFound() {
  return (
    <PublicLayout>
      <section className="container-page py-24 sm:py-32 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tighter sm:text-4xl">Page not found</h1>
        <p className="mt-2 muted">The page you&apos;re looking for doesn&apos;t exist or was moved.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <Link href="/" className="btn-primary">Back home</Link>
          <Link href="/projects" className="btn-secondary">Browse projects</Link>
        </div>
      </section>
    </PublicLayout>
  );
}
