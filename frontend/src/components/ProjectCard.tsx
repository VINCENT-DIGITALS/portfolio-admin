import Link from 'next/link';
import type { Project } from '@/lib/types';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group card flex flex-col gap-3 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {project.featured_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.featured_image_url}
          alt={project.title}
          className="aspect-video w-full rounded-lg object-cover"
          loading="lazy"
        />
      ) : (
        <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-500/20 dark:to-brand-700/10" />
      )}
      <div className="flex-1">
        <h3 className="text-base font-semibold group-hover:text-brand-600">{project.title}</h3>
        {project.short_description && (
          <p className="mt-1 line-clamp-3 text-sm text-slate-500">{project.short_description}</p>
        )}
      </div>
      {project.tech_stack?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.tech_stack.slice(0, 5).map((t) => (
            <span key={t} className="badge">{t}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
