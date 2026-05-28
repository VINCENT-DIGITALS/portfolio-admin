import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicLayout } from '@/components/PublicLayout';
import { ProjectShowcase } from '@/components/ProjectShowcase';
import { ProjectComments } from '@/components/ProjectComments';
import { ssrFetch } from '@/lib/api';
import type { Project } from '@/lib/types';
import { dateRange } from '@/lib/utils';

export const revalidate = 15;

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const res = await ssrFetch<{ data: Project[] }>('/api/projects', 60);
  return (res?.data ?? []).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const res = await ssrFetch<{ data: Project }>(`/api/projects/${params.slug}`);
  const p = res?.data;
  if (!p) return { title: 'Project' };
  return { title: p.title, description: p.short_description ?? undefined };
}

export default async function ProjectDetail({ params }: Props) {
  const res = await ssrFetch<{ data: Project }>(`/api/projects/${params.slug}`);
  const project = res?.data;
  if (!project) notFound();

  return (
    <PublicLayout>
      <article className="container-page section">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:items-start">
          <header className="lg:sticky lg:top-24">
            <div className="flex items-start gap-4">
              {project.app_icon_url ? (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-slate-950/5 shadow-soft dark:border-slate-800/80 dark:bg-slate-900 sm:h-24 sm:w-24">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.app_icon_url}
                    alt={`${project.title} icon`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.35rem] border border-brand-200/70 bg-brand-50 text-lg font-semibold text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-200 sm:h-24 sm:w-24">
                  {project.title.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div className="min-w-0">
                <p className="eyebrow">Project Detail</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tighter sm:text-5xl">{project.title}</h1>
              </div>
            </div>

            {project.short_description && (
              <p className="mt-5 max-w-2xl text-base leading-8 muted sm:text-lg">{project.short_description}</p>
            )}
            <dl className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm muted-2">
              {project.role && <div><dt className="inline font-medium text-slate-600 dark:text-slate-300">Role:</dt> <dd className="inline">{project.role}</dd></div>}
              {(project.start_date || project.end_date) && <div><dt className="inline font-medium text-slate-600 dark:text-slate-300">Dates:</dt> <dd className="inline">{dateRange(project.start_date, project.end_date)}</dd></div>}
              {project.category && <div><dt className="inline font-medium text-slate-600 dark:text-slate-300">Category:</dt> <dd className="inline">{project.category}</dd></div>}
              {project.status && <div><dt className="inline font-medium text-slate-600 dark:text-slate-300">Status:</dt> <dd className="inline">{project.status}</dd></div>}
            </dl>

            {project.tech_stack?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {project.tech_stack.map((t) => <span key={t} className="badge">{t}</span>)}
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-2.5">
              {project.live_demo_url && (
                <a href={project.live_demo_url} target="_blank" rel="noreferrer" className="btn-primary">
                  Live demo
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-secondary">View source</a>
              )}
            </div>
          </header>

          <ProjectShowcase
            title={project.title}
            images={project.images ?? []}
          />
        </section>

        {project.full_description && (
          <div className="container-narrow mt-12 whitespace-pre-line text-base leading-relaxed muted">
            {project.full_description}
          </div>
        )}

        <div className="container-narrow">
          <ProjectComments projectId={project.id} />
        </div>
      </article>
    </PublicLayout>
  );
}
