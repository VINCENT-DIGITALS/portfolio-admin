import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PublicLayout } from '@/components/PublicLayout';
import { CommentForm } from '@/components/CommentForm';
import { ssrFetch } from '@/lib/api';
import type { Project, Comment } from '@/lib/types';
import { dateRange, formatDate } from '@/lib/utils';

export const revalidate = 15;

interface Props { params: { slug: string } }

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

  const commentsRes = await ssrFetch<{ data: Comment[] }>(`/api/comments?project_id=${project.id}`, 15);
  const projectComments = commentsRes?.data ?? [];

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

        <section className="mt-14">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Comments
              {projectComments.length > 0 && (
                <span className="ml-2 align-middle text-sm muted-2 font-normal">({projectComments.length})</span>
              )}
            </h2>
          </div>

          {projectComments.length === 0 ? (
            <p className="mt-3 text-sm muted-2">No comments yet — be the first to share your thoughts below.</p>
          ) : (
            <ul className="mt-5 space-y-3">
              {projectComments.map((c) => (
                <li key={c.id} className="card">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{c.name}</p>
                      {c.rating && (
                        <span className="text-amber-500" aria-label={`${c.rating} out of 5`}>
                          {'★'.repeat(c.rating)}<span className="text-slate-200 dark:text-slate-700">{'★'.repeat(5 - c.rating)}</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs muted-2">{formatDate(c.created_at, { dateStyle: 'medium' })}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-200">{c.message}</p>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8">
            <CommentForm
              projectId={project.id}
              title="Leave a comment on this project"
              hint="Your comment will appear once approved by the admin."
            />
          </div>
        </section>
      </article>
    </PublicLayout>
  );
}
