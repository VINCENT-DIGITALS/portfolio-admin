# Backend — Laravel 11 API

See the root `README.md` for the full setup walkthrough.

## Quickstart

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

- Default admin: `admin@portfolio.local` / `password` (change immediately).
- Auth: Sanctum SPA cookie auth — frontend must call `/sanctum/csrf-cookie` first (handled by `frontend/src/lib/api.ts`).
- Storage: files uploaded via `POST /api/admin/media/upload` go to Supabase Storage via `App\Services\SupabaseStorageService`.

## Deploy to Render

`render.yaml` is committed. Set secret env vars in the Render dashboard:
- `APP_KEY` (generate with `php artisan key:generate --show`)
- `DB_HOST`, `DB_PASSWORD`
- `FRONTEND_URL`, `SANCTUM_STATEFUL_DOMAINS`, `SESSION_DOMAIN`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`
