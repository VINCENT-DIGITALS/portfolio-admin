const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

let csrfFetched = false;

/** Fetch the CSRF cookie from Sanctum once per browser session. */
export async function ensureCsrf(): Promise<void> {
  if (csrfFetched || typeof window === 'undefined') return;
  await fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: 'include' });
  csrfFetched = true;
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[-.+*]/g, '\\$&') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Skip CSRF fetch for SSR/public reads. */
  skipCsrf?: boolean;
  /** Cache control for Next.js fetch */
  next?: { revalidate?: number; tags?: string[] };
}

export async function api<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  const method = (opts.method ?? 'GET').toUpperCase();
  const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(method);

  if (isMutation && !opts.skipCsrf) {
    await ensureCsrf();
  }

  const headers = new Headers(opts.headers as HeadersInit | undefined);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');

  let body: BodyInit | undefined;
  if (opts.body instanceof FormData) {
    body = opts.body;
  } else if (opts.body !== undefined) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(opts.body);
  }

  const xsrf = getCookie('XSRF-TOKEN');
  if (xsrf && isMutation) headers.set('X-XSRF-TOKEN', xsrf);

  const res = await fetch(url, {
    ...opts,
    method,
    headers,
    body,
    credentials: 'include',
  });

  const text = await res.text();
  const data: unknown = text ? safeParse(text) : null;

  if (!res.ok) {
    const message = (data && typeof data === 'object' && 'message' in data && typeof (data as Record<string, unknown>).message === 'string')
      ? (data as { message: string }).message
      : `Request failed: ${res.status}`;
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

function safeParse(text: string): unknown {
  try { return JSON.parse(text); } catch { return text; }
}

export const apiClient = {
  get: <T>(path: string, opts?: RequestOptions) => api<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) => api<T>(path, { ...opts, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) => api<T>(path, { ...opts, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) => api<T>(path, { ...opts, method: 'PATCH', body }),
  delete: <T>(path: string, opts?: RequestOptions) => api<T>(path, { ...opts, method: 'DELETE' }),
};

/** SSR-friendly fetcher: ISR cache by default. */
export async function ssrFetch<T>(path: string, revalidate = 60): Promise<T | null> {
  const url = `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  try {
    const res = await fetch(url, { next: { revalidate }, headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
