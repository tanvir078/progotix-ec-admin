import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import EmptyState from '@/components/ui/EmptyState';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

function formatValue(value) {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return value.toLocaleString();
  return String(value);
}

export default function AdminFeatureStatusPage({
  resource = {},
  metrics = [],
  columns = [],
  items = [],
  notes = [],
}) {
  const title = resource.title || 'Admin Feature';
  const [search, setSearch] = useState('');
  const visibleItems = useMemo(() => {
    if (!search.trim()) return items;
    const needle = search.toLowerCase();

    return items.filter((item) => Object.values(item).some((value) => String(value ?? '').toLowerCase().includes(needle)));
  }, [items, search]);

  return (
    <AdminLayout title={title}>
      {metrics.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">{metric.label}</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{formatValue(metric.value)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <AdminCard title={resource.tableTitle || 'Records'}>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Search ${title.toLowerCase()}...`}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-semibold outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">
              {visibleItems.length} records
            </p>
          </div>

          {visibleItems.length === 0 ? (
            <EmptyState message="No records found for this module yet." />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key} className="px-5 py-4">{column.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {visibleItems.map((item, index) => (
                    <tr key={item.id || index} className="transition hover:bg-slate-50">
                      {columns.map((column) => (
                        <td key={column.key} className="px-5 py-4 font-semibold text-slate-700">
                          {column.badge ? <StatusBadge value={item[column.key]} /> : formatValue(item[column.key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-xs font-bold text-slate-500">
                <span>Page 1</span>
                <span>{visibleItems.length} total</span>
              </div>
            </div>
          )}
        </AdminCard>

        <AdminCard title="Implementation Status">
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.label} className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-slate-900">{note.label}</p>
                  <StatusBadge value={note.status} />
                </div>
                {note.description && (
                  <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{note.description}</p>
                )}
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </AdminLayout>
  );
}
