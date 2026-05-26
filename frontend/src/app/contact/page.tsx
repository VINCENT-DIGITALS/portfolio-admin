import type { Metadata } from 'next';
import { PublicLayout } from '@/components/PublicLayout';
import { ContactForm } from './ContactForm';
import { ssrFetch } from '@/lib/api';
import type { Profile } from '@/lib/types';

export const revalidate = 15;
export const metadata: Metadata = { title: 'Contact' };

export default async function ContactPage() {
  const res = await ssrFetch<{ data: Profile | null }>('/api/profile');
  const profile = res?.data ?? null;

  return (
    <PublicLayout>
      <section className="container-page section grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tighter sm:text-4xl">Get in touch</h1>
          <p className="mt-3 max-w-md text-base muted">
            Have a project or want to chat? Send a message and I&apos;ll reply within a few days.
          </p>

          <dl className="mt-8 space-y-3 text-sm">
            {profile?.email && (
              <div className="flex items-start gap-3">
                <dt className="w-20 shrink-0 font-medium text-slate-900 dark:text-slate-100">Email</dt>
                <dd><a className="text-brand-700 hover:underline dark:text-brand-300 break-all" href={`mailto:${profile.email}`}>{profile.email}</a></dd>
              </div>
            )}
            {profile?.phone && (
              <div className="flex items-start gap-3">
                <dt className="w-20 shrink-0 font-medium text-slate-900 dark:text-slate-100">Phone</dt>
                <dd className="muted">{profile.phone}</dd>
              </div>
            )}
            {profile?.location && (
              <div className="flex items-start gap-3">
                <dt className="w-20 shrink-0 font-medium text-slate-900 dark:text-slate-100">Location</dt>
                <dd className="muted">{profile.location}</dd>
              </div>
            )}
          </dl>

          <div className="mt-6 flex flex-wrap gap-2">
            {profile?.github_url && <a className="btn-ghost" href={profile.github_url} target="_blank" rel="noreferrer">GitHub</a>}
            {profile?.linkedin_url && <a className="btn-ghost" href={profile.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a>}
            {profile?.portfolio_url && <a className="btn-ghost" href={profile.portfolio_url} target="_blank" rel="noreferrer">Website</a>}
          </div>
        </div>

        <ContactForm />
      </section>
    </PublicLayout>
  );
}
