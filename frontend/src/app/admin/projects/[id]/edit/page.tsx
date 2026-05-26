'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import type { Project } from '@/lib/types';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { PageLoading, ErrorState } from '@/components/Loading';

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
      <h1 className="mb-4 text-2xl font-bold">Edit project</h1>
      <ProjectForm initial={project} mode="edit" />
    </div>
  );
}
