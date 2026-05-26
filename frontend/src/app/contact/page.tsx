import type { Metadata } from 'next';
import { PublicLayout } from '@/components/PublicLayout';
import { ContactForm } from './ContactForm';
import { ssrFetch } from '@/lib/api';
import type { Profile } from '@/lib/types';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Contact' };

export default async function ContactPage() {
  const res = await ssrFetch<{ data: Profile | null }>('/api/profile');
  const profile = res?.data ?? null;

  return (
    <PublicLayout>
      <section className="container-page py-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold">Get in touch</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Have a project or want to chat? Send a message and I'll reply within a few days.</p>
          <ul className="mt-6 space-y-2 text-sm">
            {profile?.email && <li><span className="font-medium">Email:</span> <a className="text-brand-600 hover:underline" href={`mailto:${profile.email}`}>{profile.email}</a></li>}
            {profile?.phone && <li><span className="font-medium">Phone:</span> {profile.phone}</li>}
            {profile?.location && <li><span className="font-medium">Location:</span> {profile.location}</li>}
          </ul>
          <div className="mt-4 flex gap-3 text-sm">
            {profile?.github_url && <a className="text-brand-600 hover:underline" href={profile.github_url} target="_blank" rel="noreferrer">GitHub</a>}
            {profile?.linkedin_url && <a className="text-brand-600 hover:underline" href={profile.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a>}
            {profile?.portfolio_url && <a className="text-brand-600 hover:underline" href={profile.portfolio_url} target="_blank" rel="noreferrer">Website</a>}
          </div>
        </div>

        <ContactForm />
      </section>
    </PublicLayout>
  );
}
