'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { Project } from '@/lib/types';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { PageLoading, ErrorState } from '@/components/Loading';
import { PageHeader } from '@/components/admin/Breadcrumbs';

interface Props {
  params: { id: string | string[] };
}

export default function EditProjectPage({ params }: Props) {
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId || !/^\d+$/.test(projectId)) {
      setProject(null);
      setError('Invalid project id');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    apiClient.get<{ data: Project }>(`/api/admin/projects/${projectId}`)
      .then((r) => setProject(r.data))
      .catch((e) => setError(e?.message ?? 'Failed to load project'))
      .finally(() => setLoading(false));
  }, [projectId]);

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
