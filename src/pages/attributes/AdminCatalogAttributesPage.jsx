import { router, usePage } from '@/lib/inertiaCompat';
import { useMemo, useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import StatCard from '@/components/ui/StatCard';
import { Edit, ListChecks, Plus, SlidersHorizontal, Trash2, X } from 'lucide-react';

const emptyForm = {
  name: '',
  value: '',
  sort_order: 0,
  active: true,
};

const routeTypeMap = {
  '/admin/attributes': 'attribute',
  '/admin/sizes': 'size',
  '/admin/colors': 'color',
  '/admin/weights': 'weight',
  '/admin/materials': 'material',
};

function firstError(errors, key) {
  const value = errors?.[key];
  return Array.isArray(value) ? value[0] : value;
}

function typeFromUrl(url) {
  const path = url.split('?')[0];
  return routeTypeMap[path] || 'attribute';
}

export default function AdminCatalogAttributesPage({
  resource = {},
  metrics = [],
  items = [],
  status,
}) {
  const { url } = usePage();
  const type = useMemo(() => typeFromUrl(url), [url]);
  const title = resource.title || 'Attributes';
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [errors, setErrors] = useState({});

  const activeItems = items.filter((item) => Boolean(item.active)).length;
  const inactiveItems = items.length - activeItems;

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const reset = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
  };

  const submit = (event) => {
    event.preventDefault();
    const data = {
      name: form.name,
      value: form.value,
      sort_order: Number(form.sort_order || 0),
      active: form.active ? 1 : 0,
    };

    const path = editing ? `/admin/catalog-attributes/${editing.id}` : `/admin/catalog-attributes/${type}`;
    const request = editing ? router.patch : router.post;

    request(path, data, {
      preserveScroll: true,
      onError: setErrors,
      onSuccess: reset,
    });
  };

  const edit = (item) => {
    setEditing(item);
    setForm({
      name: item.name ?? '',
      value: item.value ?? '',
      sort_order: Number(item.sort_order ?? 0),
      active: Boolean(item.active),
    });
    setErrors({});
  };

  const destroy = (item) => {
    if (window.confirm(`Delete ${item.name}?`)) {
      router.delete(`/admin/catalog-attributes/${item.id}`, { preserveScroll: true });
    }
  };

  return (
    <AdminLayout title={title}>
      {status && (
        <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
          {status}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total" value={items.length} icon={SlidersHorizontal} />
        <StatCard label="Active" value={activeItems} icon={ListChecks} />
        <StatCard label="Inactive" value={inactiveItems} icon={X} />
        <StatCard label="Type" value={type} icon={SlidersHorizontal} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <AdminCard title={editing ? `Edit ${title}` : `Create ${title}`} icon={editing ? <Edit className="h-5 w-5 text-slate-400" /> : <Plus className="h-5 w-5 text-slate-400" />}>
          <form onSubmit={submit} className="space-y-4">
            <FormInput
              label="Name"
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
              error={firstError(errors, 'name')}
              placeholder="Example: Fabric, Size, Color"
            />
            <FormInput
              label="Value"
              value={form.value}
              onChange={(event) => setField('value', event.target.value)}
              error={firstError(errors, 'value')}
              placeholder="Example: Cotton, XL, Red"
            />
            <FormInput
              label="Sort Order"
              type="number"
              min="0"
              value={form.sort_order}
              onChange={(event) => setField('sort_order', event.target.value)}
              error={firstError(errors, 'sort_order')}
            />
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => setField('active', event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-semibold text-slate-700">Active</span>
            </label>
            {firstError(errors, 'request') && (
              <p className="rounded-xl bg-danger-light px-4 py-3 text-xs font-bold text-danger">
                {firstError(errors, 'request')}
              </p>
            )}
            <div className="flex gap-3">
              <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="secondary" onClick={reset}>
                {editing ? <X className="h-4 w-4" /> : 'Reset'}
              </Button>
            </div>
          </form>
        </AdminCard>

        <AdminCard title={`${title} (${items.length})`}>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Value</th>
                    <th className="px-5 py-4">Sort</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {items.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                        No {title.toLowerCase()} found. Create one from the form.
                      </td>
                    </tr>
                  )}
                  {items.map((item) => (
                    <tr key={item.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-black text-slate-900">{item.name}</p>
                        <p className="text-xs font-semibold text-slate-500">{item.slug || '-'}</p>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-700">{item.value || '-'}</td>
                      <td className="px-5 py-4 font-semibold text-slate-700">{item.sort_order ?? 0}</td>
                      <td className="px-5 py-4">
                        <StatusBadge value={item.active ? 'active' : 'inactive'} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => edit(item)}
                            className="rounded-xl bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => destroy(item)}
                            className="rounded-xl bg-danger-light p-2 text-danger transition hover:bg-danger"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AdminCard>
      </div>
    </AdminLayout>
  );
}
