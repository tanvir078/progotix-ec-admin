import { router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { Badge, Edit, Package, Plus, Trash2, X } from 'lucide-react';

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  logo: null,
  active: true,
};

export default function AdminBrandsPage({ brands = [], status }) {
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [errors, setErrors] = useState({});

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const reset = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
  };

  const submit = (event) => {
    event.preventDefault();
    const data = { ...form, active: form.active ? 1 : 0 };
    if (!data.logo) delete data.logo;
    if (editing) data._method = 'put';

    router.post(editing ? `/admin/brands/${editing.id}` : '/admin/brands', data, {
      forceFormData: true,
      preserveScroll: true,
      onError: setErrors,
      onSuccess: reset,
    });
  };

  const edit = (brand) => {
    setEditing(brand);
    setForm({
      name: brand.name ?? '',
      slug: brand.slug ?? '',
      description: brand.description ?? '',
      logo: null,
      active: Boolean(brand.active),
    });
    setErrors({});
  };

  const destroy = (brand) => {
    if (window.confirm(`Delete ${brand.name}?`)) {
      router.delete(`/admin/brands/${brand.id}`, { preserveScroll: true });
    }
  };

  const activeBrands = brands.filter((brand) => brand.active).length;
  const linkedProducts = brands.reduce((sum, brand) => sum + Number(brand.products_count || 0), 0);

  return (
    <AdminLayout title="Brands">
      {status && (
        <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
          {status}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Brands" value={brands.length} icon={Badge} />
        <StatCard label="Active" value={activeBrands} icon={Badge} />
        <StatCard label="Inactive" value={brands.length - activeBrands} icon={X} />
        <StatCard label="Linked Products" value={linkedProducts} icon={Package} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <AdminCard title={editing ? 'Edit Brand' : 'Create Brand'}>
          <form onSubmit={submit} className="space-y-4">
            <FormInput
              label="Brand Name"
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
              error={errors.name}
              placeholder="Brand name"
            />
            <FormInput
              label="Slug"
              value={form.slug}
              onChange={(event) => setField('slug', event.target.value)}
              error={errors.slug}
              placeholder="Auto generated when blank"
            />
            <div>
              <label className="mb-1 block text-xs font-black text-slate-600">Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setField('logo', event.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold file:mr-3 file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-black file:text-white"
              />
              {errors.logo && <p className="mt-1 text-xs font-bold text-danger">{errors.logo}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-black text-slate-600">Description</label>
              <textarea
                value={form.description}
                onChange={(event) => setField('description', event.target.value)}
                className="min-h-24 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.description && <p className="mt-1 text-xs font-bold text-danger">{errors.description}</p>}
            </div>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => setField('active', event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-semibold text-slate-700">Active</span>
            </label>
            <div className="flex gap-3">
              <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="secondary" onClick={reset}>
                {editing ? <X className="h-4 w-4" /> : 'Reset'}
              </Button>
            </div>
          </form>
        </AdminCard>

        <AdminCard title={`Brands (${brands.length})`}>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Brand</th>
                    <th className="px-5 py-4">Products</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {brands.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                        No brands found.
                      </td>
                    </tr>
                  )}
                  {brands.map((brand) => (
                    <tr key={brand.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={brand.logo_url || 'https://placehold.co/80x80?text=BR'}
                            alt={brand.name}
                            className="h-10 w-10 rounded-xl object-cover"
                          />
                          <div>
                            <p className="font-black text-slate-900">{brand.name}</p>
                            <p className="text-xs font-semibold text-slate-500">{brand.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold">{brand.products_count || 0}</td>
                      <td className="px-5 py-4"><StatusBadge value={brand.active ? 'active' : 'inactive'} /></td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => edit(brand)}
                            className="rounded-xl bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => destroy(brand)}
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
