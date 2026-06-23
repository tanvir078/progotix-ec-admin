import { router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FormInput from '@/components/ui/FormInput';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Calendar, Edit, ImageIcon, Megaphone, Package, Plus, Tag, Trash2, X } from 'lucide-react';

const emptyForm = {
  title: '',
  slug: '',
  description: '',
  badge: '',
  image: null,
  link_url: '',
  product_id: '',
  category_id: '',
  starts_at: '',
  ends_at: '',
  active: true,
  priority: 0,
};

function formatDate(value) {
  if (!value) return 'No limit';
  return new Date(value).toLocaleString();
}

export default function AdminCampaignsPage({ campaigns = [], products = [], categories = [], status }) {
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
    if (!data.image) delete data.image;
    if (editing) data._method = 'put';

    router.post(editing ? `/admin/campaigns/${editing.id}` : '/admin/campaigns', data, {
      forceFormData: true,
      preserveScroll: true,
      onError: setErrors,
      onSuccess: reset,
    });
  };

  const edit = (campaign) => {
    setEditing(campaign);
    setForm({
      title: campaign.title ?? '',
      slug: campaign.slug ?? '',
      description: campaign.description ?? '',
      badge: campaign.badge ?? '',
      image: null,
      link_url: campaign.link_url ?? '',
      product_id: campaign.product_id ?? '',
      category_id: campaign.category_id ?? '',
      starts_at: campaign.starts_at?.slice(0, 16) ?? '',
      ends_at: campaign.ends_at?.slice(0, 16) ?? '',
      active: Boolean(campaign.active),
      priority: campaign.priority ?? 0,
    });
    setErrors({});
  };

  const destroy = (campaign) => {
    if (window.confirm(`Delete ${campaign.title}?`)) {
      router.delete(`/admin/campaigns/${campaign.id}`, { preserveScroll: true });
    }
  };

  const toggle = (campaign) => {
    router.post(`/admin/campaigns/${campaign.id}/toggle`, {}, { preserveScroll: true });
  };

  const activeCount = campaigns.filter((campaign) => campaign.active).length;
  const upcomingCount = campaigns.filter((campaign) => campaign.starts_at && new Date(campaign.starts_at) > new Date()).length;

  return (
    <AdminLayout title="Campaigns">
      {status && (
        <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
          {status}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Campaigns" value={campaigns.length} icon={Megaphone} />
        <StatCard label="Active" value={activeCount} icon={Tag} />
        <StatCard label="Upcoming" value={upcomingCount} icon={Calendar} />
        <StatCard label="Targets" value={products.length + categories.length} icon={Package} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <AdminCard title={editing ? 'Edit Campaign' : 'Create Campaign'} icon={editing ? <Edit className="h-5 w-5 text-slate-400" /> : <Plus className="h-5 w-5 text-slate-400" />}>
          <form onSubmit={submit} className="space-y-4">
            <FormInput label="Title" value={form.title} onChange={(event) => setField('title', event.target.value)} error={errors.title} placeholder="Eid Mega Campaign" />
            <FormInput label="Slug" value={form.slug} onChange={(event) => setField('slug', event.target.value)} error={errors.slug} placeholder="Auto generated when blank" />
            <FormInput label="Badge / Offer Text" value={form.badge} onChange={(event) => setField('badge', event.target.value)} error={errors.badge} placeholder="Up to 50% off" />

            <div>
              <label className="mb-1 block text-xs font-black text-slate-600">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setField('image', event.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold file:mr-3 file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-black file:text-white"
              />
              {errors.image && <p className="mt-1 text-xs font-bold text-danger">{errors.image}</p>}
              {editing?.image_url && !form.image && (
                <img src={editing.image_url} alt="Campaign banner image" className="mt-2 h-20 w-32 rounded-xl object-cover ring-1 ring-slate-200" />
              )}
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

            <Select label="Product Target" value={form.product_id} onChange={(event) => setField('product_id', event.target.value)} error={errors.product_id}>
              <option value="">No product target</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </Select>

            <Select label="Category Target" value={form.category_id} onChange={(event) => setField('category_id', event.target.value)} error={errors.category_id}>
              <option value="">No category target</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </Select>

            <FormInput label="Custom Link" value={form.link_url} onChange={(event) => setField('link_url', event.target.value)} error={errors.link_url} placeholder="/search?q=summer" />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="Starts At" type="datetime-local" value={form.starts_at} onChange={(event) => setField('starts_at', event.target.value)} error={errors.starts_at} />
              <FormInput label="Ends At" type="datetime-local" value={form.ends_at} onChange={(event) => setField('ends_at', event.target.value)} error={errors.ends_at} />
            </div>

            <FormInput label="Priority" type="number" value={form.priority} onChange={(event) => setField('priority', event.target.value)} error={errors.priority} />

            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={form.active} onChange={(event) => setField('active', event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
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

        <AdminCard title={`Campaigns (${campaigns.length})`}>
          <div className="space-y-3">
            {campaigns.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                <ImageIcon className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-3 text-sm font-bold text-slate-400">No campaigns yet.</p>
              </div>
            )}

            {campaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex gap-4">
                  <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {campaign.image_url ? (
                      <img src={campaign.image_url} alt={campaign.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-slate-300"><ImageIcon className="h-7 w-7" /></div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black text-slate-900">{campaign.title}</p>
                      <StatusBadge value={campaign.active ? 'active' : 'inactive'} />
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-500">{campaign.description || '-'}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                      {campaign.badge && <span className="rounded-full bg-primary-light px-2 py-1 text-primary">{campaign.badge}</span>}
                      <span>{formatDate(campaign.starts_at)} - {formatDate(campaign.ends_at)}</span>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-400">
                      Target: {campaign.product?.name || campaign.category?.name || campaign.link_url || 'Search'}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    <button type="button" onClick={() => toggle(campaign)} className="rounded-xl bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100" title="Toggle status">
                      <Tag className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => edit(campaign)} className="rounded-xl bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100" title="Edit">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => destroy(campaign)} className="rounded-xl bg-danger-light p-2 text-danger transition hover:bg-danger" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </AdminLayout>
  );
}
