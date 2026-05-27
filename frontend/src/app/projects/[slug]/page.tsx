import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PublicLayout } from '@/components/PublicLayout';
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
      <article className="container-narrow section">
        <Link href="/projects" className="text-xs font-medium text-brand-700 hover:underline dark:text-brand-300">
          ← All projects
        </Link>

        <header className="mt-4">
          <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">{project.title}</h1>
          {project.short_description && (
            <p className="mt-3 text-base muted">{project.short_description}</p>
          )}
          <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs muted-2">
            {project.role && <div><dt className="inline font-medium text-slate-600 dark:text-slate-300">Role:</dt> <dd className="inline">{project.role}</dd></div>}
            {(project.start_date || project.end_date) && <div><dt className="inline font-medium text-slate-600 dark:text-slate-300">Dates:</dt> <dd className="inline">{dateRange(project.start_date, project.end_date)}</dd></div>}
            {project.category && <div><dt className="inline font-medium text-slate-600 dark:text-slate-300">Category:</dt> <dd className="inline">{project.category}</dd></div>}
            {project.status && <div><dt className="inline font-medium text-slate-600 dark:text-slate-300">Status:</dt> <dd className="inline">{project.status}</dd></div>}
          </dl>

          {project.tech_stack?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech_stack.map((t) => <span key={t} className="badge">{t}</span>)}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2.5">
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

        {project.featured_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.featured_image_url}
            alt={project.title}
            className="mt-10 w-full rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-800"
          />
        )}

        {project.full_description && (
          <div className="mt-10 whitespace-pre-line text-base leading-relaxed muted">
            {project.full_description}
          </div>
        )}

        {project.images && project.images.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Gallery</h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {project.images.map((img) => (
                <figure key={img.id} className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.image_url} alt={img.caption ?? ''} className="aspect-video w-full object-cover" loading="lazy" />
                  {img.caption && <figcaption className="px-3 py-2 text-xs muted-2">{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}

        <ProjectComments projectId={project.id} />
      </article>
    </PublicLayout>
  );
}
