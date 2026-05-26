export function classNames(...c: Array<string | false | null | undefined>): string {
  return c.filter(Boolean).join(' ');
}

export function formatDate(value: string | null | undefined, opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' }): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', opts).format(d);
}

export function dateRange(start?: string | null, end?: string | null, current?: boolean): string {
  const s = formatDate(start);
  const e = current ? 'Present' : formatDate(end);
  if (s && e) return `${s} – ${e}`;
  return s || e || '';
}

export function truncate(s: string, max = 160): string {
  if (!s) return '';
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}
