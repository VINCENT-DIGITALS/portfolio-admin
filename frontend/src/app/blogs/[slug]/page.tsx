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
      <article className="container-read section">
        <Link href="/blogs" className="text-xs font-medium text-brand-700 hover:underline dark:text-brand-300">
          ← All posts
        </Link>

        <header className="mt-4">
          <p className="text-xs muted-2">{formatDate(blog.published_at, { dateStyle: 'long' })}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tighter sm:text-4xl">{blog.title}</h1>
          {blog.excerpt && <p className="mt-3 text-base muted">{blog.excerpt}</p>}
        </header>

        {blog.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blog.cover_image_url}
            alt={blog.title}
            className="mt-8 w-full rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-800"
          />
        )}

        {blog.content && (
          <div className="mt-8 whitespace-pre-line text-base leading-[1.75] text-slate-800 dark:text-slate-200">
            {blog.content}
          </div>
        )}

        {blog.tags?.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-1.5 hr-soft border-t pt-6">
            {blog.tags.map((t) => <span key={t} className="badge">#{t}</span>)}
          </div>
        )}
      </article>
    </PublicLayout>
  );
}
