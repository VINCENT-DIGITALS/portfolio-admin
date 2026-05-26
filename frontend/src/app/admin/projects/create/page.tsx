'use client';

import { ProjectForm } from '@/components/admin/ProjectForm';
import { PageHeader } from '@/components/admin/Breadcrumbs';

export default function CreateProjectPage() {
  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Projects', href: '/admin/projects' },
          { label: 'New' },
        ]}
        title="New project"
      />
      <ProjectForm mode="create" />
    </div>
  );
}
