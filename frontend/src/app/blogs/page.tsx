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
      <section className="container-page section">
        <p className="eyebrow">Writing</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tighter sm:text-4xl">Articles & notes</h1>
        <p className="mt-2 max-w-2xl text-base muted">Tutorials, deep-dives, and short notes from things I&apos;m learning.</p>

        {blogs.length === 0 ? (
          <div className="mt-8"><EmptyState title="No posts yet" description="New articles will show up here." /></div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((b) => <BlogCard key={b.id} blog={b} />)}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
