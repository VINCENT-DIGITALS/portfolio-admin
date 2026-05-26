import Link from 'next/link';
import { PublicLayout } from '@/components/PublicLayout';
import { ProjectCard } from '@/components/ProjectCard';
import { ssrFetch } from '@/lib/api';
import type { Profile, Project, Skill, Experience } from '@/lib/types';
import { dateRange } from '@/lib/utils';

export const revalidate = 60;

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
      {/* Hero */}
      <section className="container-page py-16 sm:py-24">
        <p className="text-sm font-medium text-brand-600">Hello, I'm</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">
          {profile?.full_name ?? 'Your Name'}
        </h1>
        {profile?.title && (
          <p className="mt-2 text-xl text-slate-600 dark:text-slate-300">{profile.title}</p>
        )}
        {profile?.bio && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
            {profile.bio}
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/projects" className="btn-primary">View Projects</Link>
          <Link href="/contact" className="btn-secondary">Contact Me</Link>
          {profile?.resume_url && (
            <a href={profile.resume_url} target="_blank" rel="noreferrer" className="btn-secondary">Download Resume</a>
          )}
        </div>
      </section>

      {/* About preview */}
      <section className="container-page py-12 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold">About</h2>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-400">
          {profile?.bio ?? 'Add an about description in the admin panel.'}
        </p>
        <Link href="/about" className="mt-4 inline-block text-sm font-medium text-brand-600 hover:underline">
          Read more →
        </Link>
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="container-page py-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((s) => <span key={s.id} className="badge">{s.name}</span>)}
          </div>
        </section>
      )}

      {/* Featured projects */}
      <section className="container-page py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">Featured Projects</h2>
          <Link href="/projects" className="text-sm font-medium text-brand-600 hover:underline">View all →</Link>
        </div>
        {projects.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No featured projects yet.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </section>

      {/* Experience preview */}
      {experiences.length > 0 && (
        <section className="container-page py-12 border-t border-slate-200 dark:border-slate-800">
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

      {/* CTA */}
      <section className="container-page py-16">
        <div className="card flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold">Have a project in mind?</h2>
          <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">
            Let's build something great together. Drop a message and I'll get back to you.
          </p>
          <Link href="/contact" className="btn-primary mt-5">Get in touch</Link>
        </div>
      </section>
    </PublicLayout>
  );
}
