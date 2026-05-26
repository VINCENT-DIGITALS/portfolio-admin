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
      <section className="container-narrow section">
        <p className="eyebrow">About</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tighter sm:text-4xl">
          {profile?.full_name ?? 'About me'}
        </h1>

        <div className="mt-8 grid gap-8 sm:grid-cols-[auto,1fr] sm:gap-10">
          {profile?.profile_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.profile_image_url}
              alt={profile.full_name}
              className="h-32 w-32 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-800"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-slate-50 text-3xl font-bold text-brand-600 ring-1 ring-slate-200 dark:from-brand-500/10 dark:to-slate-900 dark:text-brand-300 dark:ring-slate-800">
              {(profile?.full_name ?? 'P').split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            {profile?.bio && (
              <p className="whitespace-pre-line text-base leading-relaxed muted">{profile.bio}</p>
            )}
            <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 text-sm">
              {profile?.location && (<div><dt className="font-medium text-slate-900 dark:text-slate-100">Location</dt><dd className="muted">{profile.location}</dd></div>)}
              {profile?.email && (<div><dt className="font-medium text-slate-900 dark:text-slate-100">Email</dt><dd className="muted break-all">{profile.email}</dd></div>)}
              {profile?.phone && (<div><dt className="font-medium text-slate-900 dark:text-slate-100">Phone</dt><dd className="muted">{profile.phone}</dd></div>)}
            </dl>
          </div>
        </div>
      </section>

      {skills.length > 0 && (
        <section className="container-narrow section hr-soft border-t">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skills.map((s) => <span key={s.id} className="badge">{s.name}</span>)}
          </div>
        </section>
      )}

      {experiences.length > 0 && (
        <section className="container-narrow section hr-soft border-t">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Experience</h2>
          <ol className="mt-6 space-y-3">
            {experiences.map((e) => (
              <li key={e.id} className="card">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="text-base font-semibold tracking-tight">
                    {e.position}
                    <span className="ml-2 font-normal muted-2">· {e.company}</span>
                  </h3>
                  <span className="text-xs muted-2">{dateRange(e.start_date, e.end_date, e.is_current)}</span>
                </div>
                {e.description && <p className="mt-2 text-sm muted">{e.description}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {education.length > 0 && (
        <section className="container-narrow section hr-soft border-t">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Education</h2>
          <ol className="mt-6 space-y-3">
            {education.map((e) => (
              <li key={e.id} className="card">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="text-base font-semibold tracking-tight">
                    {e.degree ?? ''}
                    {e.school && <span className="ml-2 font-normal muted-2">· {e.school}</span>}
                  </h3>
                  <span className="text-xs muted-2">{dateRange(e.start_date, e.end_date)}</span>
                </div>
                {e.description && <p className="mt-2 text-sm muted">{e.description}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {certificates.length > 0 && (
        <section className="container-narrow section hr-soft border-t">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Certificates</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {certificates.map((c) => (
              <div key={c.id} className="card">
                <h3 className="font-semibold tracking-tight">{c.title}</h3>
                {c.issuer && <p className="text-sm muted-2">{c.issuer}</p>}
                {c.description && <p className="mt-2 text-sm muted">{c.description}</p>}
                {c.certificate_url && (
                  <a href={c.certificate_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-brand-700 hover:underline dark:text-brand-300">
                    View certificate →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
