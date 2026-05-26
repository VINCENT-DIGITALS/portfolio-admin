import type { Metadata } from 'next';
import { PublicLayout } from '@/components/PublicLayout';
import { ProjectCard } from '@/components/ProjectCard';
import { EmptyState } from '@/components/Loading';
import { ssrFetch } from '@/lib/api';
import type { Project } from '@/lib/types';

export const revalidate = 15;
export const metadata: Metadata = { title: 'Projects' };

export default async function ProjectsPage() {
  const res = await ssrFetch<{ data: Project[] }>('/api/projects');
  const projects = res?.data ?? [];

  return (
    <PublicLayout>
      <section className="container-page section">
        <p className="eyebrow">Work</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tighter sm:text-4xl">Projects</h1>
        <p className="mt-2 max-w-2xl text-base muted">
          A collection of recent work — open source, client projects, and experiments.
        </p>

        {projects.length === 0 ? (
          <div className="mt-8">
            <EmptyState title="No projects yet" description="Projects will appear here once published." />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
