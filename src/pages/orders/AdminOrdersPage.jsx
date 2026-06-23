import { Link, router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FilterBar from '@/components/ui/FilterBar';
import { ShoppingCart, Package, AlertTriangle, DollarSign, Clock, CheckCircle, Eye } from 'lucide-react';

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

export default function AdminOrdersPage({ data = [], meta = {}, filters = {}, status }) {
    const orders = Array.isArray(data) ? data : [];
    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [startDate, setStartDate] = useState(filters.start_date ?? '');
    const [endDate, setEndDate] = useState(filters.end_date ?? '');

    const filter = (event) => {
        event.preventDefault();
        router.get('/admin/orders', { 
            search, 
            status: statusFilter, 
            start_date: startDate, 
            end_date: endDate 
        }, { preserveState: true });
    };

    const resetFilters = () => {
        setSearch('');
        setStatusFilter('');
        setStartDate('');
        setEndDate('');
        router.get('/admin/orders', {}, { preserveState: true });
    };

    const updateStatus = (order, newStatus) => {
        router.put(`/admin/orders/${order.id}/status`, { 
            status: newStatus 
        }, { preserveScroll: true });
    };

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

    return (
        <AdminLayout title="Orders">
            {status && (
                <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
                    {status}
                </div>
            )}

            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Orders" value={totalOrders} icon={ShoppingCart} />
                <StatCard label="Pending" value={pendingOrders} icon={Clock} color="warning" />
                <StatCard label="Processing" value={processingOrders} icon={Package} color="info" />
                <StatCard label="Completed" value={completedOrders} icon={CheckCircle} color="success" />
                <StatCard label="Total Revenue" value={money(totalRevenue)} icon={DollarSign} />
            </div>

            <AdminCard title={`Orders (${orders.length})`}>
                <FilterBar
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search order ID, customer, phone..."
                    filters={[
                        {
                            key: 'status',
                            value: statusFilter,
                            onChange: setStatusFilter,
                            placeholder: 'All statuses',
                            options: [
                                { value: 'pending', label: 'Pending' },
                                { value: 'processing', label: 'Processing' },
                                { value: 'shipped', label: 'Shipped' },
                                { value: 'delivered', label: 'Delivered' },
                                { value: 'cancelled', label: 'Cancelled' },
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
                                    <th className="px-5 py-4">Order ID</th>
                                    <th className="px-5 py-4">Customer</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Items</th>
                                    <th className="px-5 py-4 text-right">Total</th>
                                    <th className="px-5 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                                            No orders found.
                                        </td>
                                    </tr>
                                )}
                                {orders.map((order) => (
                                    <tr key={order.id} className="transition hover:bg-slate-50">
                                        <td className="px-5 py-4">
                                            <Link to={`/admin/orders/${order.id}`} className="font-black text-primary hover:underline">
                                                #{order.id}
                                            </Link>
                                            <p className="mt-1 text-xs font-semibold text-slate-500">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-slate-900">{order.user?.name ?? 'Customer'}</p>
                                            <p className="text-xs text-slate-500">{order.phone || order.user?.email}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(event) => updateStatus(order, event.target.value)}
                                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-semibold">{order.items?.length || 0} items</p>
                                        </td>
                                        <td className="px-5 py-4 text-right font-black">{money(order.total_amount)}</td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/admin/orders/${order.id}`}
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
                            Showing {orders.length} of {meta.total} orders
                        </p>
                        <div className="flex gap-2">
                            {meta.current_page > 1 && (
                                <button
                                    onClick={() => router.get('/admin/orders', { ...filters, page: meta.current_page - 1 })}
                                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700 transition hover:bg-slate-200"
                                >
                                    Previous
                                </button>
                            )}
                            {meta.current_page < meta.last_page && (
                                <button
                                    onClick={() => router.get('/admin/orders', { ...filters, page: meta.current_page + 1 })}
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
