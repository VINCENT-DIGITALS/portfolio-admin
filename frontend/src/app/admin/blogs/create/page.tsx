'use client';
import { BlogForm } from '@/components/admin/BlogForm';
import { PageHeader } from '@/components/admin/Breadcrumbs';

export default function CreateBlogPage() {
  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Blogs', href: '/admin/blogs' },
          { label: 'New' },
        ]}
        title="New post"
      />
      <BlogForm mode="create" />
    </div>
  );
}
