# Frontend — Next.js 14 + TypeScript + Tailwind

See the root `README.md` for the full setup walkthrough.

## Quickstart

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

- Public site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin/login>

## Folder layout

```
src/
├── app/                       # Next.js App Router pages
│   ├── page.tsx               # Landing
│   ├── about/                 # /about
│   ├── projects/[slug]/       # /projects/[slug]
│   ├── blogs/[slug]/          # /blogs/[slug]
│   ├── comments/              # /comments
│   ├── contact/               # /contact
│   ├── not-found.tsx
│   └── admin/                 # Admin CMS
│       ├── layout.tsx         # Auth gate + AdminShell
│       ├── login/             # /admin/login
│       ├── dashboard/         # /admin/dashboard
│       ├── projects/          # list + create + [id]/edit
│       ├── blogs/             # list + create + [id]/edit
│       ├── comments/
│       ├── contact-messages/
│       ├── profile/
│       ├── media/
│       └── settings/
├── components/                # Reusable components
└── lib/                       # API client, types, utils
```

## API client

`src/lib/api.ts` exposes:
- `apiClient.{get,post,put,patch,delete}` — for client-side calls (auto-handles CSRF + credentials).
- `ssrFetch(path, revalidate)` — for ISR-cached server reads in public pages.

## Deploy to Vercel

- Import `frontend/` as the project root.
- Env vars: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`.
- The provided `vercel.json` keeps build/install defaults.
