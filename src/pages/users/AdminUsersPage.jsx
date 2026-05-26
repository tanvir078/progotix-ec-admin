import { router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FilterBar from '@/components/ui/FilterBar';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import { Users, ShoppingCart, DollarSign, Shield, Edit, Trash2, X, Mail, Phone, MapPin } from 'lucide-react';

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

export default function AdminUsersPage({ users = [], filters = {}, status }) {
    const [q, setQ] = useState(filters.q ?? '');
    const [role, setRole] = useState(filters.role ?? '');
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', is_admin: false });
    const [errors, setErrors] = useState({});

    const filter = (event) => {
        event.preventDefault();
        router.get('/admin/users', { q, role }, { preserveState: true });
    };

    const resetFilters = () => {
        setQ('');
        setRole('');
        router.get('/admin/users', {}, { preserveState: true });
    };

    const edit = (user) => {
        setEditing(user);
        setForm({ name: user.name ?? '', email: user.email ?? '', phone: user.phone ?? '', address: user.address ?? '', is_admin: Boolean(user.is_admin) });
        setErrors({});
    };

    const submit = (event) => {
        event.preventDefault();
        router.put(`/admin/users/${editing.id}`, form, { preserveScroll: true, onError: setErrors, onSuccess: () => setEditing(null) });
    };

    const destroy = (user) => {
        if (window.confirm(`Delete ${user.name}?`)) {
            router.delete(`/admin/users/${user.id}`, { preserveScroll: true });
        }
    };

    const totalUsers = users.length;
    const totalOrders = users.reduce((sum, u) => sum + (u.orders_count || 0), 0);
    const totalSpend = users.reduce((sum, u) => sum + Number(u.total_spent || 0), 0);
    const adminCount = users.filter(u => u.is_admin).length;

    return (
        <AdminLayout title="Customers">
            {status && (
                <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
                    {status}
                </div>
            )}

            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Customers" value={totalUsers} icon={Users} />
                <StatCard label="Total Orders" value={totalOrders} icon={ShoppingCart} />
                <StatCard label="Total Spend" value={money(totalSpend)} icon={DollarSign} />
                <StatCard label="Admin Users" value={adminCount} icon={Shield} />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                <AdminCard title={`Customers (${users.length})`}>
                    <FilterBar
                        searchValue={q}
                        onSearchChange={setQ}
                        searchPlaceholder="Search name, email, phone..."
                        filters={[
                            {
                                key: 'role',
                                value: role,
                                onChange: setRole,
                                placeholder: 'All roles',
                                options: [
                                    { value: 'admin', label: 'Admins' },
                                    { value: 'customer', label: 'Customers' },
                                ],
                            },
                        ]}
                        onApply={filter}
                        onReset={resetFilters}
                        className="md:grid-cols-[1fr_180px_auto]"
                    />

                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-5 py-4">Customer</th>
                                        <th className="px-5 py-4">Role</th>
                                        <th className="px-5 py-4">Orders</th>
                                        <th className="px-5 py-4">Total Spend</th>
                                        <th className="px-5 py-4">Joined</th>
                                        <th className="px-5 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                                                No customers found.
                                            </td>
                                        </tr>
                                    )}
                                    {users.map((user) => (
                                        <tr key={user.id} className="transition hover:bg-slate-50">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-black text-white">
                                                        {user.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900">{user.name}</p>
                                                        <p className="text-xs font-semibold text-slate-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <StatusBadge value={user.is_admin ? 'admin' : 'customer'} />
                                            </td>
                                            <td className="px-5 py-4 font-semibold">{user.orders_count || 0}</td>
                                            <td className="px-5 py-4 font-black">{money(user.total_spent)}</td>
                                            <td className="px-5 py-4 text-xs font-semibold text-slate-500">
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => edit(user)}
                                                        className="rounded-xl bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => destroy(user)}
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

                <AdminCard title={editing ? `Edit ${editing.name}` : 'Customer Editor'}>
                    {editing ? (
                        <form onSubmit={submit} className="space-y-4">
                            <FormInput
                                label="Name"
                                value={form.name}
                                onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                                error={errors.name}
                                placeholder="Enter name"
                            />
                            <FormInput
                                label="Email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                                error={errors.email}
                                placeholder="Enter email"
                            />
                            <FormInput
                                label="Phone"
                                type="tel"
                                value={form.phone}
                                onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))}
                                error={errors.phone}
                                placeholder="Enter phone"
                            />
                            <div>
                                <label className="mb-1 block text-xs font-black text-slate-600">Address</label>
                                <textarea
                                    value={form.address}
                                    onChange={(e) => setForm((current) => ({ ...current, address: e.target.value }))}
                                    placeholder="Enter address"
                                    className="min-h-24 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                                {errors.address && <p className="mt-1 text-xs font-bold text-danger">{errors.address}</p>}
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_admin}
                                    onChange={(e) => setForm((current) => ({ ...current, is_admin: e.target.checked }))}
                                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm font-semibold text-slate-700">Admin user</span>
                            </label>
                            {errors.is_admin && <p className="text-xs font-bold text-danger">{errors.is_admin}</p>}
                            <div className="flex gap-3">
                                <Button type="submit">Save Changes</Button>
                                <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <Users className="h-12 w-12 text-slate-300" />
                            <p className="mt-4 text-sm font-semibold text-slate-500">Select a customer to edit profile details or admin access.</p>
                        </div>
                    )}
                </AdminCard>
            </div>
        </AdminLayout>
    );
}
