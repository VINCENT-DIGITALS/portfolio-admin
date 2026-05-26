import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PublicLayout } from '@/components/PublicLayout';
import { CommentForm } from '@/components/CommentForm';
import { ssrFetch } from '@/lib/api';
import type { Project } from '@/lib/types';
import { dateRange } from '@/lib/utils';

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

  return (
    <PublicLayout>
      <article className="container-page py-12">
        <Link href="/projects" className="text-sm text-brand-600 hover:underline">← All projects</Link>
        <h1 className="mt-3 text-3xl font-bold">{project.title}</h1>
        {project.short_description && (
          <p className="mt-2 text-slate-600 dark:text-slate-400">{project.short_description}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          {project.role && <span>Role: {project.role}</span>}
          {(project.start_date || project.end_date) && <span>{dateRange(project.start_date, project.end_date)}</span>}
          {project.category && <span>Category: {project.category}</span>}
        </div>

        {project.tech_stack?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech_stack.map((t) => <span key={t} className="badge">{t}</span>)}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {project.live_demo_url && <a href={project.live_demo_url} target="_blank" rel="noreferrer" className="btn-primary">Live Demo</a>}
          {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-secondary">View Source</a>}
        </div>

        {project.featured_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.featured_image_url} alt={project.title} className="mt-8 w-full rounded-xl object-cover" />
        )}

        {project.full_description && (
          <div className="prose dark:prose-invert mt-8 max-w-none whitespace-pre-line text-slate-700 dark:text-slate-300">
            {project.full_description}
          </div>
        )}

        {project.images && project.images.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold">Gallery</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {project.images.map((img) => (
                <figure key={img.id} className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.image_url} alt={img.caption ?? ''} className="aspect-video w-full object-cover" />
                  {img.caption && <figcaption className="p-2 text-xs text-slate-500">{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 max-w-2xl">
          <CommentForm
            projectId={project.id}
            title="Leave a comment on this project"
            hint="Your comment will appear once approved by the admin."
          />
        </section>
      </article>
    </PublicLayout>
  );
}
