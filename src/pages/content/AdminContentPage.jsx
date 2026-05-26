import { router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FormInput from '@/components/ui/FormInput';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Edit, FileText, Layers, Plus, Trash2, X } from 'lucide-react';

const emptyForm = {
  type: 'page',
  title: '',
  slug: '',
  placement: '',
  excerpt: '',
  body: '',
  status: 'draft',
  sort_order: 0,
  meta_title: '',
  meta_description: '',
};

export default function AdminContentPage({ pages = [], metrics = [], status }) {
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [errors, setErrors] = useState({});
  const [filter, setFilter] = useState('');

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const reset = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
  };

  const submit = (event) => {
    event.preventDefault();
    const data = { ...form };
    if (editing) data._method = 'put';

    router.post(editing ? `/admin/content/${editing.id}` : '/admin/content', data, {
      preserveScroll: true,
      onError: setErrors,
      onSuccess: reset,
    });
  };

  const edit = (page) => {
    setEditing(page);
    setForm({
      type: page.type ?? 'page',
      title: page.title ?? '',
      slug: page.slug ?? '',
      placement: page.placement ?? '',
      excerpt: page.excerpt ?? '',
      body: page.body ?? '',
      status: page.status ?? 'draft',
      sort_order: page.sort_order ?? 0,
      meta_title: page.meta_title ?? '',
      meta_description: page.meta_description ?? '',
    });
    setErrors({});
  };

  const destroy = (page) => {
    if (window.confirm(`Delete "${page.title}"?`)) {
      router.delete(`/admin/content/${page.id}`, { preserveScroll: true });
    }
  };

  const filteredPages = filter ? pages.filter((page) => page.type === filter) : pages;
  const publishedCount = pages.filter((page) => page.status === 'published').length;
  const draftCount = pages.filter((page) => page.status === 'draft').length;
  const sectionCount = pages.filter((page) => page.type === 'section').length;

  return (
    <AdminLayout title="Content">
      {status && (
        <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
          {status}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="CMS Items" value={metrics[0]?.value ?? pages.length} icon={FileText} />
        <StatCard label="Published" value={metrics[1]?.value ?? publishedCount} icon={FileText} />
        <StatCard label="Drafts" value={draftCount} icon={Edit} />
        <StatCard label="Sections" value={sectionCount} icon={Layers} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[430px_1fr]">
        <AdminCard title={editing ? 'Edit Content' : 'Create Content'} icon={editing ? <Edit className="h-5 w-5 text-slate-400" /> : <Plus className="h-5 w-5 text-slate-400" />}>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Type" value={form.type} onChange={(event) => setField('type', event.target.value)} error={errors.type}>
                <option value="page">Page</option>
                <option value="section">Section</option>
                <option value="policy">Policy</option>
                <option value="faq">FAQ</option>
                <option value="announcement">Announcement</option>
              </Select>
              <Select label="Status" value={form.status} onChange={(event) => setField('status', event.target.value)} error={errors.status}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </div>

            <FormInput label="Title" value={form.title} onChange={(event) => setField('title', event.target.value)} error={errors.title} />
            <FormInput label="Slug" value={form.slug} onChange={(event) => setField('slug', event.target.value)} error={errors.slug} placeholder="Auto generated when blank" />
            <FormInput label="Placement" value={form.placement} onChange={(event) => setField('placement', event.target.value)} error={errors.placement} placeholder="home.hero, footer, checkout.notice" />
            <FormInput label="Sort Order" type="number" value={form.sort_order} onChange={(event) => setField('sort_order', event.target.value)} error={errors.sort_order} />

            <div>
              <label className="mb-1 block text-xs font-black text-slate-600">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(event) => setField('excerpt', event.target.value)}
                className="min-h-20 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.excerpt && <p className="mt-1 text-xs font-bold text-danger">{errors.excerpt}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-black text-slate-600">Body</label>
              <textarea
                value={form.body}
                onChange={(event) => setField('body', event.target.value)}
                className="min-h-36 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.body && <p className="mt-1 text-xs font-bold text-danger">{errors.body}</p>}
            </div>

            <FormInput label="Meta Title" value={form.meta_title} onChange={(event) => setField('meta_title', event.target.value)} error={errors.meta_title} />
            <div>
              <label className="mb-1 block text-xs font-black text-slate-600">Meta Description</label>
              <textarea
                value={form.meta_description}
                onChange={(event) => setField('meta_description', event.target.value)}
                className="min-h-20 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.meta_description && <p className="mt-1 text-xs font-bold text-danger">{errors.meta_description}</p>}
            </div>

            <div className="flex gap-3">
              <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="secondary" onClick={reset}>
                {editing ? <X className="h-4 w-4" /> : 'Reset'}
              </Button>
            </div>
          </form>
        </AdminCard>

        <AdminCard
          title={`Content Items (${filteredPages.length})`}
          action={
            <Select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="">All types</option>
              <option value="page">Page</option>
              <option value="section">Section</option>
              <option value="policy">Policy</option>
              <option value="faq">FAQ</option>
              <option value="announcement">Announcement</option>
            </Select>
          }
        >
          <div className="space-y-3">
            {filteredPages.length === 0 && (
              <div className="py-10 text-center text-sm font-bold text-slate-400">
                No content items found.
              </div>
            )}

            {filteredPages.map((page) => (
              <div key={page.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black text-slate-950">{page.title}</p>
                      <StatusBadge value={page.status} />
                      <StatusBadge value={page.type} />
                    </div>
                    <p className="mt-1 text-xs font-semibold text-slate-500">/{page.slug} {page.placement ? `- ${page.placement}` : ''}</p>
                    {page.excerpt && <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{page.excerpt}</p>}
                    <p className="mt-2 text-xs font-semibold text-slate-400">
                      {page.published_at ? `Published ${new Date(page.published_at).toLocaleString()}` : 'Not published'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => edit(page)}
                      className="rounded-xl bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => destroy(page)}
                      className="rounded-xl bg-danger-light p-2 text-danger transition hover:bg-danger"
                      title="Delete"
                    >
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
