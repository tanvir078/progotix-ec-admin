import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { Package, Plus, Edit, Trash2, DollarSign, Calendar } from 'lucide-react';

export default function ProductBundlesPage({ bundles = [], products = [], status }) {
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: '',
        description: '',
        bundle_price: '',
        discount_percentage: '',
        image_url: '',
        is_active: true,
        sort_order: 0,
        start_date: '',
        end_date: '',
        products: [],
    });
    const [errors, setErrors] = useState({});

    const resetForm = () => {
        setForm({
            name: '',
            description: '',
            bundle_price: '',
            discount_percentage: '',
            image_url: '',
            is_active: true,
            sort_order: 0,
            start_date: '',
            end_date: '',
            products: [],
        });
        setErrors({});
        setEditing(null);
        setShowForm(false);
    };

    const edit = (bundle) => {
        setEditing(bundle);
        setForm({
            name: bundle.name || '',
            description: bundle.description || '',
            bundle_price: bundle.bundle_price || '',
            discount_percentage: bundle.discount_percentage || '',
            image_url: bundle.image_url || '',
            is_active: bundle.is_active ?? true,
            sort_order: bundle.sort_order || 0,
            start_date: bundle.start_date || '',
            end_date: bundle.end_date || '',
            products: bundle.products?.map(p => ({
                product_id: p.id,
                quantity: p.pivot?.quantity || 1,
            })) || [],
        });
        setErrors({});
        setShowForm(true);
    };

    const addProductToBundle = () => {
        setForm((current) => ({
            ...current,
            products: [...current.products, { product_id: '', quantity: 1 }],
        }));
    };

    const removeProductFromBundle = (index) => {
        setForm((current) => ({
            ...current,
            products: current.products.filter((_, i) => i !== index),
        }));
    };

    const updateBundleProduct = (index, field, value) => {
        setForm((current) => ({
            ...current,
            products: current.products.map((p, i) =>
                i === index ? { ...p, [field]: value } : p
            ),
        }));
    };

    const submit = async (event) => {
        event.preventDefault();
        const data = { ...form };
        if (editing) data._method = 'put';

        try {
            const response = await fetch(
                editing ? `/api/admin/product-bundles/${editing.id}` : '/api/admin/product-bundles',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                }
            );

            if (response.ok) {
                resetForm();
                window.location.reload();
            } else {
                const errorData = await response.json();
                setErrors(errorData.errors || {});
            }
        } catch (error) {
            console.error('Failed to save bundle:', error);
        }
    };

    const destroy = async (bundle) => {
        if (window.confirm(`Delete bundle "${bundle.name}"?`)) {
            try {
                await fetch(`/api/admin/product-bundles/${bundle.id}`, {
                    method: 'DELETE',
                });
                window.location.reload();
            } catch (error) {
                console.error('Failed to delete bundle:', error);
            }
        }
    };

    return (
        <AdminLayout title="Product Bundles">
            {status && (
                <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
                    {status}
                </div>
            )}

            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Product Bundles</h2>
                <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bundle
                </Button>
            </div>

            {showForm && (
                <AdminCard title={editing ? 'Edit Bundle' : 'Add Bundle'} className="mb-6">
                    <form onSubmit={submit}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormInput
                                label="Bundle Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                error={errors.name}
                                required
                            />
                            <FormInput
                                label="Bundle Price"
                                type="number"
                                step="0.01"
                                value={form.bundle_price}
                                onChange={(e) => setForm({ ...form, bundle_price: e.target.value })}
                                error={errors.bundle_price}
                                required
                            />
                            <FormInput
                                label="Discount Percentage"
                                type="number"
                                step="0.01"
                                value={form.discount_percentage}
                                onChange={(e) => setForm({ ...form, discount_percentage: e.target.value })}
                                error={errors.discount_percentage}
                            />
                            <FormInput
                                label="Image URL"
                                value={form.image_url}
                                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                error={errors.image_url}
                            />
                            <FormInput
                                label="Sort Order"
                                type="number"
                                value={form.sort_order}
                                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                                error={errors.sort_order}
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={form.is_active}
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                    className="h-4 w-4"
                                />
                                <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">
                                    Active
                                </label>
                            </div>
                            <FormInput
                                label="Start Date"
                                type="date"
                                value={form.start_date}
                                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                                error={errors.start_date}
                            />
                            <FormInput
                                label="End Date"
                                type="date"
                                value={form.end_date}
                                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                                error={errors.end_date}
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                rows={3}
                            />
                            {errors.description && (
                                <p className="text-xs text-red-600 mt-1">{errors.description}</p>
                            )}
                        </div>

                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Products</label>
                                <button
                                    type="button"
                                    onClick={addProductToBundle}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                                >
                                    + Add Product
                                </button>
                            </div>
                            {form.products.map((product, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <select
                                        value={product.product_id}
                                        onChange={(e) => updateBundleProduct(index, 'product_id', e.target.value)}
                                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        required
                                    >
                                        <option value="">Select Product</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        min="1"
                                        value={product.quantity}
                                        onChange={(e) => updateBundleProduct(index, 'quantity', e.target.value)}
                                        className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeProductFromBundle(index)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            {errors.products && (
                                <p className="text-xs text-red-600 mt-1">{errors.products}</p>
                            )}
                        </div>

                        <div className="mt-6 flex gap-2">
                            <Button type="submit">{editing ? 'Update' : 'Create'} Bundle</Button>
                            <Button
                                type="button"
                                onClick={resetForm}
                                variant="secondary"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </AdminCard>
            )}

            <AdminCard>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Bundle</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Products</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Bundle Price</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Discount</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Date Range</th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bundles.length > 0 ? (
                                bundles.map((bundle) => (
                                    <tr key={bundle.id} className="border-b border-gray-100">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {bundle.image_url && (
                                                    <img
                                                        src={bundle.image_url}
                                                        alt={bundle.name}
                                                        className="h-10 w-10 rounded object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{bundle.name}</p>
                                                    {bundle.description && (
                                                        <p className="text-xs text-gray-500 line-clamp-1">{bundle.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-700">{bundle.products?.length || 0} items</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-bold text-green-600">${Number(bundle.bundle_price).toFixed(2)}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-700">{bundle.discount_percentage}%</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge active={bundle.is_active} label={bundle.is_active ? 'Active' : 'Inactive'} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-xs text-gray-600">
                                                {bundle.start_date && bundle.end_date ? (
                                                    `${bundle.start_date} - ${bundle.end_date}`
                                                ) : bundle.start_date ? (
                                                    `From ${bundle.start_date}`
                                                ) : bundle.end_date ? (
                                                    `Until ${bundle.end_date}`
                                                ) : (
                                                    'Always'
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => edit(bundle)}
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => destroy(bundle)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                        No product bundles found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </AdminCard>
        </AdminLayout>
    );
}
