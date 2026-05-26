'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import type { Project } from '@/lib/types';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { PageLoading, ErrorState } from '@/components/Loading';
import { PageHeader } from '@/components/admin/Breadcrumbs';

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiClient.get<{ data: Project }>(`/api/admin/projects/${params.id}`)
      .then((r) => setProject(r.data))
      .catch((e) => setError(e?.message ?? 'Failed to load project'))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <PageLoading />;
  if (error) return <ErrorState message={error} />;
  if (!project) return null;

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Projects', href: '/admin/projects' },
          { label: project.title },
        ]}
        title="Edit project"
      />
      <ProjectForm initial={project} mode="edit" />
    </div>
  );
}
