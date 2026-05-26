import { router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FormInput from '@/components/ui/FormInput';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Percent, DollarSign, Tag, Calendar, Edit, Trash2, Plus, X, TrendingUp, Clock } from 'lucide-react';

const emptyForm = {
    name: '',
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_purchase: '',
    max_discount: '',
    starts_at: '',
    ends_at: '',
    usage_limit: '',
    per_user_limit: '',
    applicable_products: '',
    applicable_categories: '',
    active: true,
    priority: 0,
};

export default function AdminDiscountsPage({ discounts = [], products = [], categories = [], status }) {
    const [form, setForm] = useState(emptyForm);
    const [editing, setEditing] = useState(null);
    const [errors, setErrors] = useState({});
    
    const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
    const reset = () => { setEditing(null); setForm(emptyForm); setErrors({}); };
    
    const submit = (event) => {
        event.preventDefault();
        const data = { ...form, active: form.active ? 1 : 0 };
        if (editing) data._method = 'put';
        router.post(editing ? `/admin/discounts/${editing.id}` : '/admin/discounts', data, { 
            preserveScroll: true, 
            onError: setErrors, 
            onSuccess: reset 
        });
    };
    
    const edit = (discount) => {
        setEditing(discount);
        setForm({
            name: discount.name ?? '',
            code: discount.code ?? '',
            discount_type: discount.discount_type ?? 'percentage',
            discount_value: discount.discount_value ?? '',
            min_purchase: discount.min_purchase ?? '',
            max_discount: discount.max_discount ?? '',
            starts_at: discount.starts_at?.slice(0, 16) ?? '',
            ends_at: discount.ends_at?.slice(0, 16) ?? '',
            usage_limit: discount.usage_limit ?? '',
            per_user_limit: discount.per_user_limit ?? '',
            applicable_products: discount.applicable_products ?? '',
            applicable_categories: discount.applicable_categories ?? '',
            active: Boolean(discount.active),
            priority: discount.priority ?? 0,
        });
    };

    const destroy = (discount) => {
        if (window.confirm(`Delete ${discount.name}?`)) {
            router.delete(`/admin/discounts/${discount.id}`, { preserveScroll: true });
        }
    };

    const totalDiscounts = discounts.length;
    const activeDiscounts = discounts.filter(d => d.active).length;
    const totalUsed = discounts.reduce((sum, d) => sum + (d.used_count || 0), 0);
    const percentageDiscounts = discounts.filter(d => d.discount_type === 'percentage').length;

    return (
        <AdminLayout title="Discounts">
            {status && (
                <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
                    {status}
                </div>
            )}

            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Discounts" value={totalDiscounts} icon={Tag} />
                <StatCard label="Active" value={activeDiscounts} icon={TrendingUp} />
                <StatCard label="Total Used" value={totalUsed} icon={Clock} />
                <StatCard label="Percentage Type" value={percentageDiscounts} icon={Percent} />
            </div>

            <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
                <AdminCard title={editing ? 'Edit Discount' : 'Create Discount'} icon={editing ? <Edit className="h-5 w-5 text-slate-400" /> : <Plus className="h-5 w-5 text-slate-400" />}>
                    <form onSubmit={submit} className="space-y-4">
                        <FormInput
                            label="Discount Name"
                            value={form.name}
                            onChange={(e) => setField('name', e.target.value)}
                            error={errors.name}
                            placeholder="Summer Sale"
                        />
                        <FormInput
                            label="Discount Code"
                            value={form.code}
                            onChange={(e) => setField('code', e.target.value.toUpperCase())}
                            error={errors.code}
                            placeholder="SUMMER2024"
                            className="uppercase"
                        />
                        <Select
                            label="Discount Type"
                            value={form.discount_type}
                            onChange={(e) => setField('discount_type', e.target.value)}
                            error={errors.discount_type}
                        >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </Select>
                        <FormInput
                            label="Discount Value"
                            type="number"
                            step="0.01"
                            value={form.discount_value}
                            onChange={(e) => setField('discount_value', e.target.value)}
                            error={errors.discount_value}
                            placeholder="Discount value"
                        />
                        <FormInput
                            label="Minimum Purchase"
                            type="number"
                            step="0.01"
                            value={form.min_purchase}
                            onChange={(e) => setField('min_purchase', e.target.value)}
                            error={errors.min_purchase}
                            placeholder="0.00"
                        />
                        <FormInput
                            label="Maximum Discount"
                            type="number"
                            step="0.01"
                            value={form.max_discount}
                            onChange={(e) => setField('max_discount', e.target.value)}
                            error={errors.max_discount}
                            placeholder="Leave empty for no limit"
                        />
                        <FormInput
                            label="Start Date"
                            type="datetime-local"
                            value={form.starts_at}
                            onChange={(e) => setField('starts_at', e.target.value)}
                            error={errors.starts_at}
                        />
                        <FormInput
                            label="End Date"
                            type="datetime-local"
                            value={form.ends_at}
                            onChange={(e) => setField('ends_at', e.target.value)}
                            error={errors.ends_at}
                        />
                        <FormInput
                            label="Usage Limit"
                            type="number"
                            value={form.usage_limit}
                            onChange={(e) => setField('usage_limit', e.target.value)}
                            error={errors.usage_limit}
                            placeholder="Leave empty for unlimited"
                        />
                        <FormInput
                            label="Per User Limit"
                            type="number"
                            value={form.per_user_limit}
                            onChange={(e) => setField('per_user_limit', e.target.value)}
                            error={errors.per_user_limit}
                            placeholder="Leave empty for unlimited"
                        />
                        <Select
                            label="Applicable Products"
                            value={form.applicable_products}
                            onChange={(e) => setField('applicable_products', e.target.value)}
                            error={errors.applicable_products}
                        >
                            <option value="">All Products</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                        </Select>
                        <Select
                            label="Applicable Categories"
                            value={form.applicable_categories}
                            onChange={(e) => setField('applicable_categories', e.target.value)}
                            error={errors.applicable_categories}
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </Select>
                        <FormInput
                            label="Priority"
                            type="number"
                            value={form.priority}
                            onChange={(e) => setField('priority', e.target.value)}
                            error={errors.priority}
                            placeholder="0 (higher = applied first)"
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
                <AdminCard title={`Discounts (${discounts.length})`}>
                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-5 py-4">Name</th>
                                        <th className="px-5 py-4">Code</th>
                                        <th className="px-5 py-4">Discount</th>
                                        <th className="px-5 py-4">Usage</th>
                                        <th className="px-5 py-4">Valid Until</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {discounts.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                                                No discounts found.
                                            </td>
                                        </tr>
                                    )}
                                    {discounts.map((discount) => (
                                        <tr key={discount.id} className="transition hover:bg-slate-50">
                                            <td className="px-5 py-4 font-black text-slate-900">{discount.name}</td>
                                            <td className="px-5 py-4">
                                                <span className="font-black text-primary">{discount.code}</span>
                                            </td>
                                            <td className="px-5 py-4 font-semibold">
                                                {discount.discount_type === 'percentage' ? (
                                                    <span className="flex items-center gap-1">
                                                        <Percent className="h-4 w-4" />
                                                        {discount.discount_value}%
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign className="h-4 w-4" />
                                                        {discount.discount_value}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 font-semibold">{discount.used_count || 0}/{discount.usage_limit ?? '∞'}</td>
                                            <td className="px-5 py-4 text-xs font-semibold text-slate-500">
                                                {discount.ends_at ? new Date(discount.ends_at).toLocaleDateString() : 'No limit'}
                                            </td>
                                            <td className="px-5 py-4"><StatusBadge value={discount.active ? 'active' : 'inactive'} /></td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => edit(discount)}
                                                        className="rounded-xl bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => destroy(discount)}
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
