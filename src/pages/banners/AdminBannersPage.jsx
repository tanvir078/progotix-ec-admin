import { router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FormInput from '@/components/ui/FormInput';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Image as ImageIcon, Edit, Trash2, Plus, X, Layers, Zap } from 'lucide-react';

const emptyForm = {
    title: '',
    description: '',
    discount: '',
    gradient: 'from-orange-500 via-rose-500 to-fuchsia-600',
    bg_color: 'bg-blue-400',
    link: '',
    active: true,
    sort_order: 0,
};

export default function AdminBannersPage({ banners = [], status }) {
    const [form, setForm] = useState(emptyForm);
    const [editing, setEditing] = useState(null);
    const [errors, setErrors] = useState({});

    const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
    const reset = () => { setEditing(null); setForm(emptyForm); setErrors({}); };

    const submit = (event) => {
        event.preventDefault();
        const data = { ...form, active: form.active ? 1 : 0 };
        if (editing) data._method = 'put';
        router.post(editing ? `/admin/banners/${editing.id}` : '/admin/banners', data, {
            preserveScroll: true,
            onError: setErrors,
            onSuccess: reset,
        });
    };

    const edit = (banner) => {
        setEditing(banner);
        setForm({
            title: banner.title ?? '',
            description: banner.description ?? '',
            discount: banner.discount ?? '',
            gradient: banner.gradient ?? 'from-orange-500 via-rose-500 to-fuchsia-600',
            bg_color: banner.bg_color ?? 'bg-blue-400',
            link: banner.link ?? '',
            active: Boolean(banner.active),
            sort_order: banner.sort_order ?? 0,
        });
        setErrors({});
    };

    const destroy = (banner) => {
        if (window.confirm(`Delete ${banner.title}?`)) {
            router.delete(`/admin/banners/${banner.id}`, { preserveScroll: true });
        }
    };

    const totalBanners = banners.length;
    const activeBanners = banners.filter(b => b.active).length;

    return (
        <AdminLayout title="Banners">
            {status && (
                <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
                    {status}
                </div>
            )}

            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Banners" value={totalBanners} icon={ImageIcon} />
                <StatCard label="Active" value={activeBanners} icon={Zap} />
                <StatCard label="Inactive" value={totalBanners - activeBanners} icon={Layers} />
            </div>

            <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
                <AdminCard title={editing ? 'Edit Banner' : 'Create Banner'} icon={editing ? <Edit className="h-5 w-5 text-slate-400" /> : <Plus className="h-5 w-5 text-slate-400" />}>
                    <form onSubmit={submit} className="space-y-4">
                        <FormInput
                            label="Title"
                            value={form.title}
                            onChange={(e) => setField('title', e.target.value)}
                            error={errors.title}
                            placeholder="Banner title"
                        />
                        <div>
                            <label className="mb-1 block text-xs font-black text-slate-600">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setField('description', e.target.value)}
                                className="min-h-20 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            {errors.description && <p className="mt-1 text-xs font-bold text-danger">{errors.description}</p>}
                        </div>
                        <FormInput
                            label="Discount Text"
                            value={form.discount}
                            onChange={(e) => setField('discount', e.target.value)}
                            error={errors.discount}
                            placeholder="e.g., 45% OFF"
                        />
                        <Select
                            label="Gradient"
                            value={form.gradient}
                            onChange={(e) => setField('gradient', e.target.value)}
                            error={errors.gradient}
                        >
                            <option value="from-orange-500 via-rose-500 to-fuchsia-600">Orange to Purple</option>
                            <option value="from-cyan-500 via-blue-500 to-purple-600">Cyan to Purple</option>
                            <option value="from-pink-500 via-red-500 to-yellow-500">Pink to Yellow</option>
                            <option value="from-green-500 via-teal-500 to-blue-600">Green to Blue</option>
                            <option value="from-slate-900 via-slate-700 to-slate-500">Dark Gray</option>
                        </Select>
                        <Select
                            label="Background Color"
                            value={form.bg_color}
                            onChange={(e) => setField('bg_color', e.target.value)}
                            error={errors.bg_color}
                        >
                            <option value="bg-blue-400">Blue</option>
                            <option value="bg-green-400">Green</option>
                            <option value="bg-orange-400">Orange</option>
                            <option value="bg-purple-400">Purple</option>
                            <option value="bg-pink-400">Pink</option>
                        </Select>
                        <FormInput
                            label="Link"
                            value={form.link}
                            onChange={(e) => setField('link', e.target.value)}
                            error={errors.link}
                            placeholder="/search"
                        />
                        <FormInput
                            label="Sort Order"
                            type="number"
                            value={form.sort_order}
                            onChange={(e) => setField('sort_order', e.target.value)}
                            error={errors.sort_order}
                            placeholder="0"
                        />
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.active}
                                onChange={(e) => setField('active', e.target.checked)}
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
                <AdminCard title={`Banners (${banners.length})`}>
                    <div className="space-y-3">
                        {banners.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <ImageIcon className="h-12 w-12 text-slate-300" />
                                <p className="mt-4 text-sm font-semibold text-slate-500">No banners yet.</p>
                            </div>
                        )}
                        {banners.map((banner) => (
                            <div key={banner.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-black text-slate-900">{banner.title}</p>
                                            <StatusBadge value={banner.active ? 'active' : 'inactive'} />
                                        </div>
                                        <p className="mt-1 text-sm font-semibold text-slate-500">{banner.description}</p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {banner.discount && (
                                                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">{banner.discount}</span>
                                            )}
                                            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">Order: {banner.sort_order}</span>
                                        </div>
                                        {banner.link && (
                                            <p className="mt-2 text-xs font-semibold text-primary">{banner.link}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => edit(banner)}
                                            className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
                                            title="Edit"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => destroy(banner)}
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
