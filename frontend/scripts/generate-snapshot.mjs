#!/usr/bin/env node
/**
 * Snapshot generator — "serverless fallback" data.
 *
 * Fetches every PUBLIC endpoint from the live backend and bakes the result into
 * src/lib/snapshot.generated.json. When the backend is unreachable at runtime,
 * the frontend serves this baked snapshot so the portfolio still shows the REAL
 * content (silent fallback) instead of empty placeholders.
 *
 * Usage:
 *   npm run snapshot                      # uses NEXT_PUBLIC_API_URL or localhost:8000
 *   API_URL=https://api.example.com npm run snapshot
 *
 * Safe-by-design: if the backend is down while this runs, it keeps the EXISTING
 * snapshot file untouched (never overwrites good data with empty data), so it is
 * safe to run in a deploy/build step.
 */
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = resolve(__dirname, '../src/lib/snapshot.generated.json');

const API_URL = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000'
).replace(/\/$/, '');

/**
 * The set of public GET endpoints whose responses we bake in.
 * `key` is the snapshot key; `path` is the API path relative to API_URL.
 * `expand` (optional) derives per-item detail requests from a list response.
 */
const ENDPOINTS = [
  { key: 'publicSettings', path: '/api/public-settings' },
  { key: 'profile', path: '/api/profile' },
  { key: 'skills', path: '/api/skills' },
  { key: 'projects', path: '/api/projects' },
  { key: 'featuredProjects', path: '/api/projects?featured=1' },
  { key: 'experiences', path: '/api/experiences' },
  { key: 'education', path: '/api/education' },
  { key: 'certificates', path: '/api/certificates' },
  { key: 'blogs', path: '/api/blogs' },
  { key: 'generalComments', path: '/api/comments?general_only=1' },
];

async function fetchJson(path) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`GET ${path} -> HTTP ${res.status}`);
  return res.json();
}

async function loadExisting() {
  if (!existsSync(OUT_FILE)) return null;
  try {
    return JSON.parse(await readFile(OUT_FILE, 'utf8'));
  } catch {
    return null;
  }
}

async function main() {
  console.log(`[snapshot] Source backend: ${API_URL}`);

  // Keyed by API path so the runtime accessor can look up by exact path.
  /** @type {Record<string, unknown>} */
  const byPath = {};
  let anyFailed = false;

  for (const { path } of ENDPOINTS) {
    try {
      byPath[path] = await fetchJson(path);
      console.log(`[snapshot]  ok   ${path}`);
    } catch (err) {
      anyFailed = true;
      console.warn(`[snapshot]  FAIL ${path} — ${err.message}`);
    }
  }

  // Per-project and per-blog detail pages (dynamic routes need their own entries).
  const projectList = byPath['/api/projects']?.data ?? [];
  const blogList = byPath['/api/blogs']?.data ?? [];

  for (const p of projectList) {
    if (!p?.slug) continue;
    try {
      byPath[`/api/projects/${p.slug}`] = await fetchJson(`/api/projects/${p.slug}`);
      byPath[`/api/comments?project_id=${p.id}`] = await fetchJson(`/api/comments?project_id=${p.id}`);
    } catch (err) {
      anyFailed = true;
      console.warn(`[snapshot]  FAIL project ${p.slug} — ${err.message}`);
    }
  }
  for (const b of blogList) {
    if (!b?.slug) continue;
    try {
      byPath[`/api/blogs/${b.slug}`] = await fetchJson(`/api/blogs/${b.slug}`);
    } catch (err) {
      anyFailed = true;
      console.warn(`[snapshot]  FAIL blog ${b.slug} — ${err.message}`);
    }
  }

  const gotAnything = Object.keys(byPath).length > 0;

  // Safety: never clobber a good snapshot with a broken/empty fetch.
  if (!gotAnything) {
    const existing = await loadExisting();
    if (existing) {
      console.warn('[snapshot] Backend unreachable — keeping existing snapshot untouched.');
      process.exit(0);
    }
    console.error('[snapshot] Backend unreachable and no existing snapshot. Writing empty snapshot.');
  }

  const snapshot = {
    // generatedAt is informational only; runtime never depends on it.
    source: API_URL,
    partial: anyFailed,
    data: byPath,
  };

  await mkdir(dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
  console.log(`[snapshot] Wrote ${Object.keys(byPath).length} entries -> ${OUT_FILE}`);
  if (anyFailed) console.warn('[snapshot] NOTE: snapshot is PARTIAL (some endpoints failed).');
}

main().catch((err) => {
  console.error('[snapshot] Fatal:', err);
  process.exit(1);
});
