'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import type { Blog } from '@/lib/types';
import { BlogForm } from '@/components/admin/BlogForm';
import { PageLoading, ErrorState } from '@/components/Loading';
import { PageHeader } from '@/components/admin/Breadcrumbs';

export default function EditBlogPage() {
  const params = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiClient.get<{ data: Blog }>(`/api/admin/blogs/${params.id}`)
      .then((r) => setBlog(r.data))
      .catch((e) => setError(e?.message ?? 'Failed to load post'))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <PageLoading />;
  if (error) return <ErrorState message={error} />;
  if (!blog) return null;

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Blogs', href: '/admin/blogs' },
          { label: blog.title },
        ]}
        title="Edit post"
      />
      <BlogForm initial={blog} mode="edit" />
    </div>
  );
}
