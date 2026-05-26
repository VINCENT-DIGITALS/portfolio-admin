import type { Metadata } from 'next';
import { PublicLayout } from '@/components/PublicLayout';
import { ssrFetch } from '@/lib/api';
import type { Profile, Experience, Education, Certificate, Skill } from '@/lib/types';
import { dateRange } from '@/lib/utils';

export const revalidate = 15;
export const metadata: Metadata = { title: 'About' };

export default async function AboutPage() {
  const [p, e, ed, c, sk] = await Promise.all([
    ssrFetch<{ data: Profile | null }>('/api/profile'),
    ssrFetch<{ data: Experience[] }>('/api/experiences'),
    ssrFetch<{ data: Education[] }>('/api/education'),
    ssrFetch<{ data: Certificate[] }>('/api/certificates'),
    ssrFetch<{ data: Skill[] }>('/api/skills'),
  ]);
  const profile = p?.data ?? null;
  const experiences = e?.data ?? [];
  const education = ed?.data ?? [];
  const certificates = c?.data ?? [];
  const skills = sk?.data ?? [];

  return (
    <PublicLayout>
      <section className="container-page py-12">
        <h1 className="text-3xl font-bold">About</h1>
        {profile?.profile_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.profile_image_url} alt={profile.full_name} className="mt-6 h-32 w-32 rounded-full object-cover" />
        )}
        {profile?.bio && (
          <p className="mt-6 max-w-3xl whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
            {profile.bio}
          </p>
        )}
        <dl className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 max-w-2xl text-sm">
          {profile?.location && (<><dt className="font-medium">Location</dt><dd className="text-slate-600 dark:text-slate-400">{profile.location}</dd></>)}
          {profile?.email && (<><dt className="font-medium">Email</dt><dd className="text-slate-600 dark:text-slate-400">{profile.email}</dd></>)}
          {profile?.phone && (<><dt className="font-medium">Phone</dt><dd className="text-slate-600 dark:text-slate-400">{profile.phone}</dd></>)}
        </dl>
      </section>

      {skills.length > 0 && (
        <section className="container-page py-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((s) => <span key={s.id} className="badge">{s.name}</span>)}
          </div>
        </section>
      )}

      {experiences.length > 0 && (
        <section className="container-page py-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold">Experience</h2>
          <div className="mt-6 space-y-4">
            {experiences.map((e) => (
              <div key={e.id} className="card">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{e.position} · <span className="text-slate-500 font-normal">{e.company}</span></h3>
                  <span className="text-xs text-slate-500">{dateRange(e.start_date, e.end_date, e.is_current)}</span>
                </div>
                {e.description && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{e.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="container-page py-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold">Education</h2>
          <div className="mt-6 space-y-4">
            {education.map((e) => (
              <div key={e.id} className="card">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{e.degree ?? ''} · <span className="text-slate-500 font-normal">{e.school}</span></h3>
                  <span className="text-xs text-slate-500">{dateRange(e.start_date, e.end_date)}</span>
                </div>
                {e.description && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{e.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {certificates.length > 0 && (
        <section className="container-page py-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold">Certificates</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((c) => (
              <div key={c.id} className="card">
                <h3 className="font-semibold">{c.title}</h3>
                {c.issuer && <p className="text-sm text-slate-500">{c.issuer}</p>}
                {c.certificate_url && <a href={c.certificate_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-brand-600 hover:underline">View certificate →</a>}
              </div>
            ))}
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
