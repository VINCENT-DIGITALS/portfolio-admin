'use client';
import { BlogForm } from '@/components/admin/BlogForm';

export default function CreateBlogPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">New post</h1>
      <BlogForm mode="create" />
    </div>
  );
}
