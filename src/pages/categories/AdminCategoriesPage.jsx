import { router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FormInput from '@/components/ui/FormInput';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { FolderTree, ImageIcon, Package, Edit, Trash2, Plus, X } from 'lucide-react';

const emptyForm = { name: '', slug: '', description: '', image: null, icon: null, active: true, parent_id: '' };

function categoryDepth(category, categories) {
    let depth = 0;
    let parentId = category.parent_id;

    while (parentId) {
        const parent = categories.find((item) => Number(item.id) === Number(parentId));
        if (!parent) break;
        depth += 1;
        parentId = parent.parent_id;
    }

    return depth;
}

function categoryTypeLabel(category, categories) {
    const depth = categoryDepth(category, categories);
    if (depth === 0) return 'Main menu';
    if (depth === 1) return 'Submenu';
    return 'Child category';
}

function flattenCategoryRows(categories, parentId = null, level = 0) {
    return categories
        .filter((category) => Number(category.parent_id || 0) === Number(parentId || 0))
        .flatMap((category) => [
            { ...category, tree_level: level },
            ...flattenCategoryRows(categories, category.id, level + 1),
        ]);
}

function descendantIds(categoryId, categories) {
    const direct = categories.filter((category) => Number(category.parent_id) === Number(categoryId));
    return direct.flatMap((category) => [category.id, ...descendantIds(category.id, categories)]);
}

export default function AdminCategoriesPage({ categories = [], status }) {
    const [form, setForm] = useState(emptyForm);
    const [editing, setEditing] = useState(null);
    const [errors, setErrors] = useState({});

    const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
    const reset = () => { setEditing(null); setForm(emptyForm); setErrors({}); };

    const submit = (event) => {
        event.preventDefault();
        const data = { ...form, active: form.active ? 1 : 0 };
        if (!data.image) delete data.image;
        if (!data.parent_id) delete data.parent_id;
        if (editing) data._method = 'put';
        router.post(editing ? `/admin/categories/${editing.id}` : '/admin/categories', data, {
            forceFormData: true,
            preserveScroll: true,
            onError: setErrors,
            onSuccess: reset,
        });
    };

    const edit = (category) => {
        setEditing(category);
        setForm({
            name: category.name ?? '',
            slug: category.slug ?? '',
            description: category.description ?? '',
            image: null,
            icon: null,
            active: Boolean(category.active),
            parent_id: category.parent_id ?? '',
        });
        setErrors({});
    };

    const destroy = (category) => {
        if (window.confirm(`Delete ${category.name}?`)) {
            router.delete(`/admin/categories/${category.id}`, { preserveScroll: true });
        }
    };

    const totalCategories = categories.length;
    const activeCategories = categories.filter(c => c.active).length;
    const totalProducts = categories.reduce((sum, c) => sum + (c.products_count || 0), 0);
    const rootCategories = categories.filter(c => !c.parent_id).length;
    const subCategories = categories.filter(c => c.parent_id).length;
    const blockedParentIds = editing ? [editing.id, ...descendantIds(editing.id, categories)] : [];
    const orderedCategories = flattenCategoryRows(categories);
    const parentOptions = orderedCategories.filter((category) => !blockedParentIds.includes(category.id) && category.tree_level < 2);

    return (
        <AdminLayout title="Categories">
            {status && (
                <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
                    {status}
                </div>
            )}

            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Categories" value={totalCategories} icon={FolderTree} />
                <StatCard label="Active" value={activeCategories} icon={Package} />
                <StatCard label="Total Products" value={totalProducts} icon={Package} />
                <StatCard label="Root / Sub" value={`${rootCategories} / ${subCategories}`} icon={FolderTree} />
            </div>

            <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
                <AdminCard title={editing ? 'Edit Category' : 'Create Category'} icon={editing ? <Edit className="h-5 w-5 text-slate-400" /> : <Plus className="h-5 w-5 text-slate-400" />}>
                    <form onSubmit={submit} className="space-y-4">
                        <FormInput
                            label="Name"
                            value={form.name}
                            onChange={(e) => setField('name', e.target.value)}
                            error={errors.name}
                            placeholder="Category name"
                        />
                        <FormInput
                            label="Slug"
                            value={form.slug}
                            onChange={(e) => setField('slug', e.target.value)}
                            error={errors.slug}
                            placeholder="Auto generated when blank"
                        />
                        <Select
                            label="Parent Category"
                            value={form.parent_id}
                            onChange={(e) => setField('parent_id', e.target.value)}
                            error={errors.parent_id}
                        >
                            <option value="">None (Main vertical menu)</option>
                            {parentOptions.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {'--'.repeat(category.tree_level)} {category.name} ({categoryTypeLabel(category, categories)})
                                </option>
                            ))}
                        </Select>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Hierarchy</p>
                            <p className="mt-1 text-sm font-semibold text-slate-700">
                                Blank parent creates a vertical menu item. Select a main menu to create a submenu. Select a submenu to create a child category.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                            <div>
                                <label className="mb-1 block text-xs font-black text-slate-600">Menu / Child Icon</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setField('icon', e.target.files?.[0] ?? null)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold file:mr-3 file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-black file:text-white"
                                />
                                {errors.icon && <p className="mt-1 text-xs font-bold text-danger">{errors.icon}</p>}
                                {editing?.icon_url && !form.icon && (
                                    <img src={editing.icon_url} alt="Category icon" className="mt-2 h-12 w-12 rounded-xl object-cover ring-1 ring-slate-200" />
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-black text-slate-600">Category Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setField('image', e.target.files?.[0] ?? null)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold file:mr-3 file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-black file:text-white"
                                />
                                {errors.image && <p className="mt-1 text-xs font-bold text-danger">{errors.image}</p>}
                                {editing?.image_url && !form.image && (
                                    <img src={editing.image_url} alt="Category image" className="mt-2 h-16 w-16 rounded-xl object-cover ring-1 ring-slate-200" />
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-black text-slate-600">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setField('description', e.target.value)}
                                className="min-h-24 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
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
                <AdminCard title={`Categories (${categories.length})`}>
                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-5 py-4">Category</th>
                                        <th className="px-5 py-4">Parent</th>
                                        <th className="px-5 py-4">Type</th>
                                        <th className="px-5 py-4">Products</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {categories.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                                                No categories found.
                                            </td>
                                        </tr>
                                    )}
                                    {orderedCategories.map((category) => (
                                        <tr key={category.id} className="transition hover:bg-slate-50">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-100 text-slate-400 ring-1 ring-slate-200">
                                                        {category.icon_url || category.image_url ? (
                                                            <img
                                                                src={category.icon_url || category.image_url}
                                                                alt={category.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <ImageIcon className="h-4 w-4" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900">
                                                            {category.tree_level > 0 && <span className="mr-2 text-slate-400">{'--'.repeat(category.tree_level)}</span>}
                                                            {category.name}
                                                        </p>
                                                        <p className="text-xs font-semibold text-slate-500">{category.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 font-semibold text-slate-600">{category.parent?.name || '-'}</td>
                                            <td className="px-5 py-4 font-semibold text-slate-600">{categoryTypeLabel(category, categories)}</td>
                                            <td className="px-5 py-4 font-semibold">{category.products_count || 0}</td>
                                            <td className="px-5 py-4"><StatusBadge value={category.active ? 'active' : 'inactive'} /></td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => edit(category)}
                                                        className="rounded-xl bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => destroy(category)}
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
