const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
const AUTH_TOKEN_KEY = 'portfolio_admin_token';

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: 'auto' | 'none';
  /** Cache control for Next.js fetch */
  next?: { revalidate?: number; tags?: string[] };
}

export async function api<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  const method = (opts.method ?? 'GET').toUpperCase();

  const headers = new Headers(opts.headers as HeadersInit | undefined);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  const token = opts.auth === 'none' ? null : getAuthToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let body: BodyInit | undefined;
  if (opts.body instanceof FormData) {
    body = opts.body;
  } else if (opts.body !== undefined) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(opts.body);
  }

  const res = await fetch(url, {
    ...opts,
    method,
    headers,
    body,
    credentials: opts.credentials ?? 'omit',
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
