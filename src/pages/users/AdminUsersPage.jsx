import { Link, router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FilterBar from '@/components/ui/FilterBar';
import { Users, ShoppingCart, DollarSign, Eye } from 'lucide-react';

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

export default function AdminUsersPage({ data = [], meta = {}, filters = {}, status }) {
    const users = Array.isArray(data) ? data : [];
    const [search, setSearch] = useState(filters.search ?? '');

    const filter = (event) => {
        event.preventDefault();
        router.get('/admin/users', { search }, { preserveState: true });
    };

    const resetFilters = () => {
        setSearch('');
        router.get('/admin/users', {}, { preserveState: true });
    };

    const totalUsers = users.length;
    const totalOrders = users.reduce((sum, u) => sum + (u.total_orders || 0), 0);
    const totalSpend = users.reduce((sum, u) => sum + Number(u.total_spent || 0), 0);

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
            </div>

            <AdminCard title={`Customers (${users.length})`}>
                <FilterBar
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search name, email, phone..."
                    onApply={filter}
                    onReset={resetFilters}
                    className="md:grid-cols-[1fr_auto]"
                />

                <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">Customer</th>
                                    <th className="px-5 py-4">Email</th>
                                    <th className="px-5 py-4">Phone</th>
                                    <th className="px-5 py-4">Orders</th>
                                    <th className="px-5 py-4">Total Spend</th>
                                    <th className="px-5 py-4">Joined</th>
                                    <th className="px-5 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-5 py-10 text-center text-sm font-bold text-slate-400">
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
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-xs font-semibold text-slate-600">{user.email}</td>
                                        <td className="px-5 py-4 text-xs font-semibold text-slate-600">{user.phone || '-'}</td>
                                        <td className="px-5 py-4 font-semibold">{user.total_orders || 0}</td>
                                        <td className="px-5 py-4 font-black">{money(user.total_spent)}</td>
                                        <td className="px-5 py-4 text-xs font-semibold text-slate-500">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/admin/users/${user.id}`}
                                                    className="rounded-xl bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {meta && meta.last_page > 1 && (
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-600">
                            Showing {users.length} of {meta.total} customers
                        </p>
                        <div className="flex gap-2">
                            {meta.current_page > 1 && (
                                <button
                                    onClick={() => router.get('/admin/users', { ...filters, page: meta.current_page - 1 })}
                                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700 transition hover:bg-slate-200"
                                >
                                    Previous
                                </button>
                            )}
                            {meta.current_page < meta.last_page && (
                                <button
                                    onClick={() => router.get('/admin/users', { ...filters, page: meta.current_page + 1 })}
                                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-black text-white transition hover:bg-primary-dark"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </AdminCard>
        </AdminLayout>
    );
}
