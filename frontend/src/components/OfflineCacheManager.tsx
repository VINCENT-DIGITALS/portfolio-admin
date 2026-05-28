'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL, toApiUrl } from '@/lib/api';
import type { Blog, ListResponse, Project } from '@/lib/types';

const CACHE_VERSION = 'v1';
const CACHE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const PREFETCH_RECORD_KEY = 'portfolio-prefetch-record';
const CORE_ROUTES = ['/', '/about', '/projects', '/blogs', '/comments', '/contact'];
const CORE_API_PATHS = [
  '/api/public-settings',
  '/api/profile',
  '/api/skills',
  '/api/projects?featured=1',
  '/api/experiences',
  '/api/projects',
  '/api/blogs',
  '/api/comments?general_only=1',
  '/api/education',
  '/api/certificates',
];

interface PrefetchRecord {
  version: string;
  warmedAt: number;
}

interface ConnectionInfoLike {
  effectiveType?: string;
  saveData?: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: ConnectionInfoLike;
}

function uniqueValues(values: Array<string | null | undefined>): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function isConstrainedConnection(): boolean {
  const connection = (navigator as NavigatorWithConnection).connection;
  if (!connection) return false;
  return connection.saveData === true || ['slow-2g', '2g'].includes(connection.effectiveType ?? '');
}

function readPrefetchRecord(): PrefetchRecord | null {
  try {
    const raw = window.localStorage.getItem(PREFETCH_RECORD_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PrefetchRecord>;
    if (typeof parsed.version !== 'string' || typeof parsed.warmedAt !== 'number') return null;
    return { version: parsed.version, warmedAt: parsed.warmedAt };
  } catch {
    return null;
  }
}

function writePrefetchRecord(): void {
  try {
    const record: PrefetchRecord = { version: CACHE_VERSION, warmedAt: Date.now() };
    window.localStorage.setItem(PREFETCH_RECORD_KEY, JSON.stringify(record));
  } catch {
    // Ignore storage failures in private browsing or locked-down environments.
  }
}

function shouldWarmCache(): boolean {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (navigation?.type === 'reload') return true;

  const record = readPrefetchRecord();
  if (!record) return true;

  return record.version !== CACHE_VERSION || (Date.now() - record.warmedAt) > CACHE_WINDOW_MS;
}

function scheduleIdleWork(task: () => void): void {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => task(), { timeout: 1500 });
    return;
  }

  globalThis.setTimeout(task, 300);
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { method: 'GET', credentials: 'omit' });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function warmUrls(urls: string[], init?: RequestInit, batchSize = 4): Promise<void> {
  for (let index = 0; index < urls.length; index += batchSize) {
    const slice = urls.slice(index, index + batchSize);

    await Promise.all(slice.map(async (url) => {
      try {
        await fetch(url, { method: 'GET', ...init });
      } catch {
        // Keep warming the rest of the graph even if a single request fails.
      }
    }));
  }
}

function prefetchRoutes(router: ReturnType<typeof useRouter>, routes: string[]): void {
  for (const route of routes) {
    router.prefetch(route);
  }
}

export function OfflineCacheManager() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    if (window.location.pathname.startsWith('/admin')) return;

    let cancelled = false;

    async function registerAndWarm(): Promise<void> {
      const apiOrigin = new URL(API_URL, window.location.origin).origin;
      await navigator.serviceWorker.register(
        `/sw.js?v=${CACHE_VERSION}&apiOrigin=${encodeURIComponent(apiOrigin)}`,
        { scope: '/' },
      );
      await navigator.serviceWorker.ready;

      if (cancelled || !shouldWarmCache()) return;

      scheduleIdleWork(() => {
        void warmPublicGraph();
      });
    }

    async function warmPublicGraph(): Promise<void> {
      const constrained = isConstrainedConnection();
      const coreRouteUrls = CORE_ROUTES.map((route) => new URL(route, window.location.origin).toString());
      const coreApiUrls = CORE_API_PATHS.map((path) => toApiUrl(path));

      prefetchRoutes(router, CORE_ROUTES);
      await warmUrls(coreRouteUrls, {
        credentials: 'same-origin',
        headers: { Accept: 'text/html' },
      });
      await warmUrls(coreApiUrls, { credentials: 'omit' });

      if (constrained || cancelled) {
        writePrefetchRecord();
        return;
      }

      const [projectsResponse, blogsResponse] = await Promise.all([
        fetchJson<ListResponse<Project>>(toApiUrl('/api/projects')),
        fetchJson<ListResponse<Blog>>(toApiUrl('/api/blogs')),
      ]);

      if (cancelled) return;

      const projects = projectsResponse?.data ?? [];
      const blogs = blogsResponse?.data ?? [];
      const projectRoutes = projects.map((project) => `/projects/${project.slug}`);
      const blogRoutes = blogs.map((blog) => `/blogs/${blog.slug}`);
      const detailRouteUrls = [...projectRoutes, ...blogRoutes]
        .map((route) => new URL(route, window.location.origin).toString());
      const detailApiUrls = [
        ...projects.map((project) => toApiUrl(`/api/projects/${project.slug}`)),
        ...projects.map((project) => toApiUrl(`/api/comments?project_id=${project.id}`)),
        ...blogs.map((blog) => toApiUrl(`/api/blogs/${blog.slug}`)),
      ];
      const mediaUrls = uniqueValues([
        ...projects.flatMap((project) => [project.featured_image_url, project.app_icon_url]),
        ...blogs.map((blog) => blog.cover_image_url),
      ]);

      prefetchRoutes(router, [...projectRoutes, ...blogRoutes]);
      await warmUrls(detailRouteUrls, {
        credentials: 'same-origin',
        headers: { Accept: 'text/html' },
      });
      await warmUrls(detailApiUrls, { credentials: 'omit' });
      await warmUrls(mediaUrls, { credentials: 'omit', mode: 'no-cors' }, 3);

      if (!cancelled) {
        writePrefetchRecord();
      }
    }

    void registerAndWarm();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return null;
}
