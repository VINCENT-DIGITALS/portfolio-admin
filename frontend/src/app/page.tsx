import Link from 'next/link';
import { PublicLayout } from '@/components/PublicLayout';
import { ProjectCard } from '@/components/ProjectCard';
import { ssrFetch } from '@/lib/api';
import type { Profile, Project, Skill, Experience } from '@/lib/types';
import { dateRange } from '@/lib/utils';

export const revalidate = 15;

export default async function HomePage() {
  const [profileRes, skillsRes, projectsRes, experiencesRes] = await Promise.all([
    ssrFetch<{ data: Profile | null }>('/api/profile'),
    ssrFetch<{ data: Skill[] }>('/api/skills'),
    ssrFetch<{ data: Project[] }>('/api/projects?featured=1'),
    ssrFetch<{ data: Experience[] }>('/api/experiences'),
  ]);

  const profile = profileRes?.data ?? null;
  const skills = skillsRes?.data ?? [];
  const projects = projectsRes?.data ?? [];
  const experiences = (experiencesRes?.data ?? []).slice(0, 3);

  return (
    <PublicLayout>
      {/* Hero — two-column with avatar/visual on the right */}
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-white dark:border-slate-800/70 dark:bg-slate-900">
        {/* Decorative grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background:linear-gradient(to_right,theme(colors.slate.900)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.slate.900)_1px,transparent_1px)] [background-size:32px_32px] dark:opacity-[0.08]" aria-hidden />
        <div className="container-page relative grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:items-center">
          <div>
            <p className="eyebrow inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-brand-500" />
              Available for new projects
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tighter sm:text-5xl lg:text-6xl">
              {profile?.full_name ?? 'Your Name'}
            </h1>
            {profile?.title && (
              <p className="mt-3 text-lg sm:text-xl muted">{profile.title}</p>
            )}
            {profile?.bio && (
              <p className="mt-6 max-w-xl text-base leading-relaxed muted">
                {profile.bio}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-2.5">
              <Link href="/projects" className="btn-primary">
                View projects
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
              <Link href="/contact" className="btn-secondary">Contact me</Link>
              {profile?.resume_url && (
                <a href={profile.resume_url} target="_blank" rel="noreferrer" className="btn-ghost">
                  Download CV
                </a>
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-brand-50 via-white to-slate-50 shadow-soft dark:border-slate-800 dark:from-brand-500/10 dark:via-slate-900 dark:to-slate-900">
              {profile?.profile_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.profile_image_url}
                  alt={profile.full_name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-7xl font-bold tracking-tighter text-brand-600/40 dark:text-brand-300/40">
                  {(profile?.full_name ?? 'P').split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            {/* Floating badges */}
            <div className="absolute -bottom-3 -left-3 hidden rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-soft backdrop-blur sm:block dark:border-slate-800 dark:bg-slate-900/95">
              <div className="font-medium text-slate-900 dark:text-slate-100">{projects.length} featured</div>
              <div className="muted-2">recent projects</div>
            </div>
            {profile?.location && (
              <div className="absolute -top-3 -right-3 hidden rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-soft backdrop-blur sm:block dark:border-slate-800 dark:bg-slate-900/95">
                <div className="font-medium text-slate-900 dark:text-slate-100">{profile.location}</div>
                <div className="muted-2">based in</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="container-page section-tight">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Toolbox</h2>
            <Link href="/about" className="text-xs font-medium text-brand-700 hover:underline dark:text-brand-300">More about me →</Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skills.map((s) => <span key={s.id} className="badge">{s.name}</span>)}
          </div>
        </section>
      )}

      {/* Featured projects */}
      <section className="container-page section hr-soft border-t">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Featured projects</h2>
          </div>
          <Link href="/projects" className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-300">View all →</Link>
        </div>
        {projects.length === 0 ? (
          <p className="mt-6 text-sm muted-2">No featured projects yet.</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </section>

      {/* Experience preview */}
      {experiences.length > 0 && (
        <section className="container-page section hr-soft border-t">
          <p className="eyebrow">Experience</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Where I&apos;ve worked</h2>
          <ol className="mt-8 space-y-3">
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

      {/* CTA */}
      <section className="container-page section">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-50 via-white to-slate-50 p-8 sm:p-12 text-center shadow-soft dark:border-slate-800 dark:from-brand-500/10 dark:via-slate-900 dark:to-slate-900">
          <p className="eyebrow">Let&apos;s talk</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Have a project in mind?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base muted">
            Drop a message and I&apos;ll get back to you within a few days.
          </p>
          <Link href="/contact" className="btn-primary mt-5">Get in touch</Link>
        </div>
      </section>
    </PublicLayout>
  );
}
