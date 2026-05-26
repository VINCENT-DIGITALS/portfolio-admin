import type { Metadata } from 'next';
import { PublicLayout } from '@/components/PublicLayout';
import { BlogCard } from '@/components/BlogCard';
import { EmptyState } from '@/components/Loading';
import { ssrFetch } from '@/lib/api';
import type { Blog } from '@/lib/types';

export const revalidate = 15;
export const metadata: Metadata = { title: 'Blogs' };

export default async function BlogsPage() {
  const res = await ssrFetch<{ data: Blog[] }>('/api/blogs');
  const blogs = res?.data ?? [];

  return (
    <PublicLayout>
      <section className="container-page py-12">
        <h1 className="text-3xl font-bold">Writing</h1>
        <p className="mt-2 text-slate-500">Articles, tutorials and notes.</p>
        {blogs.length === 0 ? (
          <div className="mt-8"><EmptyState title="No posts yet" description="New articles will show up here." /></div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((b) => <BlogCard key={b.id} blog={b} />)}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
