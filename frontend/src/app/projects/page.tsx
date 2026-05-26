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
      <section className="container-page py-12">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="mt-2 text-slate-500">A collection of recent work.</p>

        {projects.length === 0 ? (
          <div className="mt-8">
            <EmptyState title="No projects yet" description="Projects will appear here once published." />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
