'use client';

import { useEffect, useState } from 'react';
import { apiClient, ApiError } from '@/lib/api';
import { PageLoading, ErrorState, Spinner } from '@/components/Loading';
import { Field, Input, Textarea } from '@/components/Field';
import { PageHeader } from '@/components/admin/Breadcrumbs';

type SettingsMap = Record<string, string | null>;

const SITE_KEYS = ['site_title', 'site_tagline', 'theme', 'comments_open'] as const;

const NAV_TOGGLES: { key: string; label: string; route: string }[] = [
  { key: 'nav_home_enabled',     label: 'Home',     route: '/' },
  { key: 'nav_about_enabled',    label: 'About',    route: '/about' },
  { key: 'nav_projects_enabled', label: 'Projects', route: '/projects' },
  { key: 'nav_blogs_enabled',    label: 'Blogs',    route: '/blogs' },
  { key: 'nav_comments_enabled', label: 'Comments', route: '/comments' },
  { key: 'nav_contact_enabled',  label: 'Contact',  route: '/contact' },
];

const MANAGED_KEYS = new Set<string>([
  ...SITE_KEYS,
  'maintenance_mode',
  'maintenance_message',
  ...NAV_TOGGLES.map((n) => n.key),
]);

function isOn(v: string | null | undefined): boolean {
  if (v === null || v === undefined) return false;
  const s = String(v).toLowerCase().trim();
  return s === '1' || s === 'true' || s === 'on' || s === 'yes';
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [newKey, setNewKey] = useState('');

  const load = () => {
    setLoading(true); setError(null);
    apiClient.get<{ data: SettingsMap }>('/api/admin/settings')
      .then((r) => setSettings(r.data ?? {}))
      .catch((e) => setError(e?.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  function set(k: string, v: string | null) {
    setSettings((s) => ({ ...s, [k]: v }));
  }
  function setBool(k: string, on: boolean) {
    set(k, on ? '1' : '0');
  }

  async function onSave() {
    setBusy(true); setSavedAt(null); setError(null);
    try {
      await apiClient.post('/api/admin/settings', { settings });
      setSavedAt(new Date().toLocaleTimeString());
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Failed to save settings.');
    } finally { setBusy(false); }
  }

  async function deleteKey(key: string) {
    await apiClient.delete(`/api/admin/settings/${encodeURIComponent(key)}`);
    setSettings(({ [key]: _drop, ...rest }) => rest);
  }

  function addKey() {
    const k = newKey.trim();
    if (!k) return;
    setSettings((s) => ({ ...s, [k]: '' }));
    setNewKey('');
  }

  if (loading) return <PageLoading />;
  if (error && Object.keys(settings).length === 0) return <ErrorState message={error} onRetry={load} />;

  const maintenanceOn = isOn(settings.maintenance_mode);
  const customKeys = Object.keys(settings).filter((k) => !MANAGED_KEYS.has(k));

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Settings' }]}
        title="Settings"
        subtitle="Public site visibility, maintenance, and key/value config."
        actions={(
          <button className="btn-primary" onClick={onSave} disabled={busy}>
            {busy && <Spinner />}
            {busy ? 'Saving…' : 'Save all'}
          </button>
        )}
      />

      {savedAt && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200">
          Saved at {savedAt}. Public site refreshes within ~15 seconds.
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">{error}</div>
      )}

      {/* Two-column responsive layout for sections */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <section className="card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Maintenance mode</h2>
              <p className="mt-1 text-sm muted-2">
                Public visitors see a maintenance page; admin stays accessible.
              </p>
            </div>
            <Toggle checked={maintenanceOn} onChange={(v) => setBool('maintenance_mode', v)} label={maintenanceOn ? 'Maintenance ON' : 'Maintenance OFF'} />
          </div>
          <div className="mt-4">
            <Field label="Message shown to visitors">
              <Textarea
                value={settings.maintenance_message ?? ''}
                onChange={(e) => set('maintenance_message', e.target.value)}
                placeholder="We'll be back soon!"
              />
            </Field>
          </div>
          {maintenanceOn && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
              ⚠ Maintenance mode is <strong>ON</strong>. Save to apply.
            </div>
          )}
        </section>

        <section className="card">
          <h2 className="text-base font-semibold tracking-tight">Public navigation</h2>
          <p className="mt-1 text-sm muted-2">Toggle which pages appear in the public header.</p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {NAV_TOGGLES.map((n) => {
              const on = isOn(settings[n.key] ?? '1');
              return (
                <label key={n.key} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 transition hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700">
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">{n.label}</span>
                    <span className="block text-xs muted-2">{n.route}</span>
                  </span>
                  <Toggle checked={on} onChange={(v) => setBool(n.key, v)} />
                </label>
              );
            })}
          </div>
        </section>

        <section className="card">
          <h2 className="text-base font-semibold tracking-tight">Site info</h2>
          <div className="mt-4 grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Field label="Site title">
              <Input value={settings.site_title ?? ''} onChange={(e) => set('site_title', e.target.value)} />
            </Field>
            <Field label="Tagline">
              <Input value={settings.site_tagline ?? ''} onChange={(e) => set('site_tagline', e.target.value)} />
            </Field>
            <Field label="Theme" hint="system | light | dark">
              <Input value={settings.theme ?? ''} onChange={(e) => set('theme', e.target.value)} placeholder="system" />
            </Field>
            <Field label="Comments open" hint="1 or 0">
              <Input value={settings.comments_open ?? ''} onChange={(e) => set('comments_open', e.target.value)} />
            </Field>
          </div>
        </section>

        <section className="card">
          <h2 className="text-base font-semibold tracking-tight">Custom settings</h2>
          <p className="mt-1 text-sm muted-2">Free-form key/value pairs read via the admin API.</p>

          {customKeys.length === 0 ? (
            <p className="mt-3 text-sm muted-2">No custom settings yet.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {customKeys.map((key) => (
                <div key={key} className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_2fr_auto]">
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300 break-all">{key}</div>
                  <Input value={settings[key] ?? ''} onChange={(e) => set(key, e.target.value)} />
                  <button className="btn-danger" type="button" onClick={() => deleteKey(key)}>Remove</button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-end gap-3">
            <Field label="Add custom setting key" className="mb-0 flex-1 min-w-[200px]">
              <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="e.g. footer_message" />
            </Field>
            <button className="btn-secondary" onClick={addKey} type="button">Add</button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ' +
        (checked ? 'bg-brand-600 dark:bg-brand-500' : 'bg-slate-300 dark:bg-slate-700')
      }
      title={label}
    >
      <span
        aria-hidden
        className={
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ' +
          (checked ? 'translate-x-5' : 'translate-x-0')
        }
      />
    </button>
  );
}
