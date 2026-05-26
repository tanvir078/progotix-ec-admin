import { router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FormInput from '@/components/ui/FormInput';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Zap, Clock, Package, TrendingUp, Edit, Trash2, Plus, X, Calendar, DollarSign, Users, Flame } from 'lucide-react';

const emptyForm = {
    name: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    original_price: '',
    sale_price: '',
    starts_at: '',
    ends_at: '',
    stock_limit: '',
    per_user_limit: '',
    product_id: '',
    category_id: '',
    active: true,
    priority: 0,
};

export default function AdminFlashSalesPage({ flashSales = [], products = [], categories = [], status }) {
    const [form, setForm] = useState(emptyForm);
    const [editing, setEditing] = useState(null);
    const [errors, setErrors] = useState({});
    
    const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
    const reset = () => { setEditing(null); setForm(emptyForm); setErrors({}); };
    
    const submit = (event) => {
        event.preventDefault();
        const data = { ...form, active: form.active ? 1 : 0 };
        if (editing) data._method = 'put';
        router.post(editing ? `/admin/flash-sales/${editing.id}` : '/admin/flash-sales', data, { 
            preserveScroll: true, 
            onError: setErrors, 
            onSuccess: reset 
        });
    };
    
    const edit = (flashSale) => {
        setEditing(flashSale);
        setForm({
            name: flashSale.name ?? '',
            description: flashSale.description ?? '',
            discount_type: flashSale.discount_type ?? 'percentage',
            discount_value: flashSale.discount_value ?? '',
            original_price: flashSale.original_price ?? '',
            sale_price: flashSale.sale_price ?? '',
            starts_at: flashSale.starts_at?.slice(0, 16) ?? '',
            ends_at: flashSale.ends_at?.slice(0, 16) ?? '',
            stock_limit: flashSale.stock_limit ?? '',
            per_user_limit: flashSale.per_user_limit ?? '',
            product_id: flashSale.product_id ?? '',
            category_id: flashSale.category_id ?? '',
            active: Boolean(flashSale.active),
            priority: flashSale.priority ?? 0,
        });
    };

    const destroy = (flashSale) => {
        if (window.confirm(`Delete ${flashSale.name}?`)) {
            router.delete(`/admin/flash-sales/${flashSale.id}`, { preserveScroll: true });
        }
    };

    const toggleStatus = (flashSale) => {
        router.post(`/admin/flash-sales/${flashSale.id}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    const totalFlashSales = flashSales.length;
    const activeFlashSales = flashSales.filter(f => f.active).length;
    const totalSold = flashSales.reduce((sum, f) => sum + (f.sold_count || 0), 0);
    const upcomingFlashSales = flashSales.filter(f => new Date(f.starts_at) > new Date()).length;

    const getTimeRemaining = (endsAt) => {
        if (!endsAt) return 'No limit';
        const end = new Date(endsAt);
        const now = new Date();
        const diff = end - now;
        
        if (diff <= 0) return 'Ended';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    return (
        <AdminLayout title="Flash Sales">
            {status && (
                <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
                    {status}
                </div>
            )}

            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Flash Sales" value={totalFlashSales} icon={Zap} />
                <StatCard label="Active" value={activeFlashSales} icon={Flame} />
                <StatCard label="Total Sold" value={totalSold} icon={TrendingUp} />
                <StatCard label="Upcoming" value={upcomingFlashSales} icon={Clock} />
            </div>

            <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
                <AdminCard title={editing ? 'Edit Flash Sale' : 'Create Flash Sale'} icon={editing ? <Edit className="h-5 w-5 text-slate-400" /> : <Plus className="h-5 w-5 text-slate-400" />}>
                    <form onSubmit={submit} className="space-y-4">
                        <FormInput
                            label="Flash Sale Name"
                            value={form.name}
                            onChange={(e) => setField('name', e.target.value)}
                            error={errors.name}
                            placeholder="Mega Sale 2024"
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
                        <Select
                            label="Product"
                            value={form.product_id}
                            onChange={(e) => setField('product_id', e.target.value)}
                            error={errors.product_id}
                        >
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                        </Select>
                        <Select
                            label="Category (Optional)"
                            value={form.category_id}
                            onChange={(e) => setField('category_id', e.target.value)}
                            error={errors.category_id}
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </Select>
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
                            label="Original Price"
                            type="number"
                            step="0.01"
                            value={form.original_price}
                            onChange={(e) => setField('original_price', e.target.value)}
                            error={errors.original_price}
                            placeholder="Original price"
                        />
                        <FormInput
                            label="Sale Price"
                            type="number"
                            step="0.01"
                            value={form.sale_price}
                            onChange={(e) => setField('sale_price', e.target.value)}
                            error={errors.sale_price}
                            placeholder="Sale price"
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
                            label="Stock Limit"
                            type="number"
                            value={form.stock_limit}
                            onChange={(e) => setField('stock_limit', e.target.value)}
                            error={errors.stock_limit}
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
                        <FormInput
                            label="Priority"
                            type="number"
                            value={form.priority}
                            onChange={(e) => setField('priority', e.target.value)}
                            error={errors.priority}
                            placeholder="0 (higher = shown first)"
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
                <AdminCard title={`Flash Sales (${flashSales.length})`}>
                    <div className="space-y-4">
                        {flashSales.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <Zap className="h-12 w-12 text-slate-300" />
                                <p className="mt-4 text-sm font-semibold text-slate-500">No flash sales yet.</p>
                            </div>
                        )}
                        {flashSales.map((flashSale) => (
                            <div key={flashSale.id} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-black text-slate-900">{flashSale.name}</p>
                                            <StatusBadge value={flashSale.active ? 'active' : 'inactive'} />
                                        </div>
                                        <p className="mt-1 text-sm font-semibold text-slate-500">{flashSale.description}</p>
                                        <div className="mt-3 flex flex-wrap gap-3">
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="h-4 w-4 text-slate-400" />
                                                <span className="text-sm font-bold text-slate-700">
                                                    ${flashSale.sale_price} <span className="text-slate-400 line-through">${flashSale.original_price}</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4 text-slate-400" />
                                                <span className="text-sm font-bold text-warning">{getTimeRemaining(flashSale.ends_at)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Package className="h-4 w-4 text-slate-400" />
                                                <span className="text-sm font-bold text-slate-700">{flashSale.sold_count || 0}/{flashSale.stock_limit ?? '∞'} sold</span>
                                            </div>
                                        </div>
                                        {flashSale.product_name && (
                                            <p className="mt-2 text-xs font-semibold text-primary">{flashSale.product_name}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleStatus(flashSale)}
                                            className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
                                            title={flashSale.active ? 'Deactivate' : 'Activate'}
                                        >
                                            {flashSale.active ? <Clock className="h-4 w-4" /> : <Flame className="h-4 w-4" />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => edit(flashSale)}
                                            className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
                                            title="Edit"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => destroy(flashSale)}
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
