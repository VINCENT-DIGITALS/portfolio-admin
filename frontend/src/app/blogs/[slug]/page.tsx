import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicLayout } from '@/components/PublicLayout';
import { ssrFetch } from '@/lib/api';
import type { Blog } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export const revalidate = 15;
interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const res = await ssrFetch<{ data: Blog }>(`/api/blogs/${params.slug}`);
  const b = res?.data;
  if (!b) return { title: 'Article' };
  return { title: b.title, description: b.excerpt ?? undefined };
}

export default async function BlogDetail({ params }: Props) {
  const res = await ssrFetch<{ data: Blog }>(`/api/blogs/${params.slug}`);
  const blog = res?.data;
  if (!blog) notFound();

  return (
    <PublicLayout>
      <article className="container-page py-12 max-w-3xl">
        <Link href="/blogs" className="text-sm text-brand-600 hover:underline">← All posts</Link>
        <h1 className="mt-3 text-3xl font-bold">{blog.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{formatDate(blog.published_at, { dateStyle: 'long' })}</p>
        {blog.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={blog.cover_image_url} alt={blog.title} className="mt-6 w-full rounded-xl object-cover" />
        )}
        {blog.content && (
          <div className="prose dark:prose-invert mt-6 max-w-none whitespace-pre-line text-slate-700 dark:text-slate-300">
            {blog.content}
          </div>
        )}
        {blog.tags?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-1.5">
            {blog.tags.map((t) => <span key={t} className="badge">#{t}</span>)}
          </div>
        )}
      </article>
    </PublicLayout>
  );
}
