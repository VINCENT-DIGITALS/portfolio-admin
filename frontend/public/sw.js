const CACHE_VERSION = new URL(self.location.href).searchParams.get('v') || 'v1';
const API_ORIGIN = new URLSearchParams(self.location.search).get('apiOrigin') || self.location.origin;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const PAGE_CACHE = `portfolio-pages-${CACHE_VERSION}`;
const DATA_CACHE = `portfolio-data-${CACHE_VERSION}`;
const ASSET_CACHE = `portfolio-assets-${CACHE_VERSION}`;
const META_CACHE = `portfolio-meta-${CACHE_VERSION}`;
const ACTIVE_CACHES = [PAGE_CACHE, DATA_CACHE, ASSET_CACHE, META_CACHE];

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((cacheName) => !ACTIVE_CACHES.includes(cacheName))
        .map((cacheName) => caches.delete(cacheName)),
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (isAdminRequest(url)) return;

  if (isPublicApiRequest(url)) {
    event.respondWith(serveFromTimedCache(request, DATA_CACHE));
    return;
  }

  if (isPageRequest(request, url)) {
    event.respondWith(serveFromTimedCache(request, PAGE_CACHE));
    return;
  }

  if (isAssetRequest(request, url)) {
    event.respondWith(serveFromTimedCache(request, ASSET_CACHE));
  }
});

function isAdminRequest(url) {
  return url.pathname.startsWith('/admin')
    || url.pathname.startsWith('/api/admin')
    || url.pathname.startsWith('/sanctum');
}

function isPublicApiRequest(url) {
  return url.origin === API_ORIGIN
    && url.pathname.startsWith('/api/')
    && !url.pathname.startsWith('/api/admin/');
}

function isPageRequest(request, url) {
  if (url.origin !== self.location.origin) return false;
  if (url.pathname.startsWith('/_next/')) return false;
  if (url.pathname.startsWith('/api/')) return false;
  if (request.mode === 'navigate') return true;
  if (request.destination === 'document') return true;
  return !/\.[a-z0-9]+$/i.test(url.pathname);
}

function isAssetRequest(request, url) {
  if (request.destination === 'image'
    || request.destination === 'style'
    || request.destination === 'script'
    || request.destination === 'font') {
    return true;
  }

  if (url.origin !== self.location.origin) return false;
  return url.pathname.startsWith('/_next/');
}

function shouldBypassCache(request) {
  if (request.cache === 'reload') return true;

  const cacheControl = request.headers.get('cache-control') || '';
  const pragma = request.headers.get('pragma') || '';
  return cacheControl.includes('no-cache') || pragma.includes('no-cache');
}

async function serveFromTimedCache(request, cacheName) {
  if (shouldBypassCache(request)) {
    return fetchAndStore(request, cacheName);
  }

  const cached = await matchCached(request, cacheName);
  if (cached) {
    if (!isFresh(cached.timestamp)) {
      void fetchAndStore(request, cacheName);
    }
    return cached.response;
  }

  try {
    return await fetchAndStore(request, cacheName);
  } catch (error) {
    const fallback = await matchStale(request, cacheName);
    if (fallback) return fallback;
    throw error;
  }
}

async function fetchAndStore(request, cacheName) {
  const response = await fetch(request);
  if (!isCacheable(response)) return response;

  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
  await writeTimestamp(request);
  return response;
}

function isCacheable(response) {
  return response.ok || response.type === 'opaque';
}

function isFresh(timestamp) {
  return Date.now() - timestamp <= CACHE_TTL_MS;
}

async function matchCached(request, cacheName) {
  const cache = await caches.open(cacheName);
  const response = await cache.match(request);
  if (!response) return null;

  return {
    response,
    timestamp: await readTimestamp(request),
  };
}

async function matchStale(request, cacheName) {
  const cache = await caches.open(cacheName);
  return cache.match(request);
}

function buildMetaRequest(request) {
  return new Request(`https://portfolio-cache-meta.local/${encodeURIComponent(request.url)}`);
}

async function writeTimestamp(request) {
  const cache = await caches.open(META_CACHE);
  await cache.put(buildMetaRequest(request), new Response(String(Date.now())));
}

async function readTimestamp(request) {
  const cache = await caches.open(META_CACHE);
  const response = await cache.match(buildMetaRequest(request));
  if (!response) return 0;

  const timestamp = Number(await response.text());
  return Number.isFinite(timestamp) ? timestamp : 0;
}
