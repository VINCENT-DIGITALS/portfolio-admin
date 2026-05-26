'use client';

import { ProjectForm } from '@/components/admin/ProjectForm';

export default function CreateProjectPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">New project</h1>
      <ProjectForm mode="create" />
    </div>
  );
}
