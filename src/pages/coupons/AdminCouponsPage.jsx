import { router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FormInput from '@/components/ui/FormInput';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Ticket, Percent, DollarSign, Edit, Trash2, Plus, X, Calendar } from 'lucide-react';

const emptyForm = { code: '', discount_type: 'percentage', discount_value: '', starts_at: '', ends_at: '', usage_limit: '', active: true };

export default function AdminCouponsPage({ coupons = [], status }) {
    const [form, setForm] = useState(emptyForm);
    const [editing, setEditing] = useState(null);
    const [errors, setErrors] = useState({});
    
    const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
    const reset = () => { setEditing(null); setForm(emptyForm); setErrors({}); };
    
    const submit = (event) => {
        event.preventDefault();
        const data = { ...form, active: form.active ? 1 : 0 };
        if (editing) data._method = 'put';
        router.post(editing ? `/admin/coupons/${editing.id}` : '/admin/coupons', data, { preserveScroll: true, onError: setErrors, onSuccess: reset });
    };
    
    const edit = (coupon) => {
        setEditing(coupon);
        setForm({
            code: coupon.code,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value,
            starts_at: coupon.starts_at?.slice(0, 16) ?? '',
            ends_at: coupon.ends_at?.slice(0, 16) ?? '',
            usage_limit: coupon.usage_limit ?? '',
            active: Boolean(coupon.active),
        });
    };

    const destroy = (coupon) => {
        if (window.confirm(`Delete ${coupon.code}?`)) {
            router.delete(`/admin/coupons/${coupon.id}`, { preserveScroll: true });
        }
    };

    const totalCoupons = coupons.length;
    const activeCoupons = coupons.filter(c => c.active).length;
    const totalUsed = coupons.reduce((sum, c) => sum + (c.used_count || 0), 0);
    const percentageCoupons = coupons.filter(c => c.discount_type === 'percentage').length;

    return (
        <AdminLayout title="Coupons">
            {status && (
                <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
                    {status}
                </div>
            )}

            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Coupons" value={totalCoupons} icon={Ticket} />
                <StatCard label="Active" value={activeCoupons} icon={Ticket} />
                <StatCard label="Total Used" value={totalUsed} icon={Ticket} />
                <StatCard label="Percentage Type" value={percentageCoupons} icon={Percent} />
            </div>

            <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
                <AdminCard title={editing ? 'Edit Coupon' : 'Create Coupon'} icon={editing ? <Edit className="h-5 w-5 text-slate-400" /> : <Plus className="h-5 w-5 text-slate-400" />}>
                    <form onSubmit={submit} className="space-y-4">
                        <FormInput
                            label="Coupon Code"
                            value={form.code}
                            onChange={(e) => setField('code', e.target.value.toUpperCase())}
                            error={errors.code}
                            placeholder="Enter code"
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
                <AdminCard title={`Coupons (${coupons.length})`}>
                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-5 py-4">Code</th>
                                        <th className="px-5 py-4">Discount</th>
                                        <th className="px-5 py-4">Usage</th>
                                        <th className="px-5 py-4">Valid Until</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {coupons.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                                                No coupons found.
                                            </td>
                                        </tr>
                                    )}
                                    {coupons.map((coupon) => (
                                        <tr key={coupon.id} className="transition hover:bg-slate-50">
                                            <td className="px-5 py-4">
                                                <span className="font-black text-primary">{coupon.code}</span>
                                            </td>
                                            <td className="px-5 py-4 font-semibold">
                                                {coupon.discount_type === 'percentage' ? (
                                                    <span className="flex items-center gap-1">
                                                        <Percent className="h-4 w-4" />
                                                        {coupon.discount_value}%
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign className="h-4 w-4" />
                                                        {coupon.discount_value}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 font-semibold">{coupon.used_count || 0}/{coupon.usage_limit ?? '∞'}</td>
                                            <td className="px-5 py-4 text-xs font-semibold text-slate-500">
                                                {coupon.ends_at ? new Date(coupon.ends_at).toLocaleDateString() : 'No limit'}
                                            </td>
                                            <td className="px-5 py-4"><StatusBadge value={coupon.active ? 'active' : 'inactive'} /></td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => edit(coupon)}
                                                        className="rounded-xl bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => destroy(coupon)}
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
