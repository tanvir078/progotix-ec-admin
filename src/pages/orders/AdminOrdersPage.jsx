import { Link, router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FilterBar from '@/components/ui/FilterBar';
import Button from '@/components/ui/Button';
import { ShoppingCart, Package, AlertTriangle, DollarSign, Clock, CheckCircle, XCircle, Eye, Printer, MoreHorizontal } from 'lucide-react';

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

export default function AdminOrdersPage({ orders = [], filters = {}, status }) {
    const [q, setQ] = useState(filters.q ?? '');
    const [orderStatus, setOrderStatus] = useState(filters.status ?? '');
    const [paymentStatus, setPaymentStatus] = useState(filters.payment_status ?? '');
    const [paymentMethod, setPaymentMethod] = useState(filters.payment_method ?? '');
    const [fulfillmentStatus, setFulfillmentStatus] = useState(filters.fulfillment_status ?? '');

    const filter = (event) => {
        event.preventDefault();
        router.get('/admin/orders', { q, status: orderStatus, payment_status: paymentStatus, payment_method: paymentMethod, fulfillment_status: fulfillmentStatus }, { preserveState: true });
    };

    const resetFilters = () => {
        setQ('');
        setOrderStatus('');
        setPaymentStatus('');
        setPaymentMethod('');
        setFulfillmentStatus('');
        router.get('/admin/orders', {}, { preserveState: true });
    };

    const updateStatus = (order, value) => {
        router.patch(`/admin/orders/${order.id}/status`, { order_status: value }, { preserveScroll: true });
    };

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => (o.order_status || o.status) === 'pending').length;
    const processingOrders = orders.filter(o => ['confirmed', 'processing'].includes(o.order_status || o.status)).length;
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
                <StatCard label="Pending" value={pendingOrders} icon={Clock} />
                <StatCard label="Processing" value={processingOrders} icon={Package} />
                <StatCard label="Total Revenue" value={money(totalRevenue)} icon={DollarSign} />
            </div>

            <AdminCard title={`Orders (${orders.length})`}>
                <FilterBar
                    searchValue={q}
                    onSearchChange={setQ}
                    searchPlaceholder="Search order, customer, phone, tracking..."
                    filters={[
                        {
                            key: 'status',
                            value: orderStatus,
                            onChange: setOrderStatus,
                            placeholder: 'All statuses',
                            options: [
                                { value: 'pending', label: 'Pending' },
                                { value: 'confirmed', label: 'Confirmed' },
                                { value: 'processing', label: 'Processing' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'cancelled', label: 'Cancelled' },
                            ],
                        },
                        {
                            key: 'payment_status',
                            value: paymentStatus,
                            onChange: setPaymentStatus,
                            placeholder: 'All payments',
                            options: [
                                { value: 'pending', label: 'Pending' },
                                { value: 'paid', label: 'Paid' },
                                { value: 'unpaid', label: 'Unpaid' },
                                { value: 'partially_refunded', label: 'Partially Refunded' },
                                { value: 'refunded', label: 'Refunded' },
                            ],
                        },
                        {
                            key: 'payment_method',
                            value: paymentMethod,
                            onChange: setPaymentMethod,
                            placeholder: 'All methods',
                            options: [
                                { value: 'cod', label: 'COD' },
                                { value: 'stripe', label: 'Stripe' },
                            ],
                        },
                        {
                            key: 'fulfillment_status',
                            value: fulfillmentStatus,
                            onChange: setFulfillmentStatus,
                            placeholder: 'All fulfillment',
                            options: [
                                { value: 'unfulfilled', label: 'Unfulfilled' },
                                { value: 'packed', label: 'Packed' },
                                { value: 'shipped', label: 'Shipped' },
                                { value: 'delivered', label: 'Delivered' },
                                { value: 'returned', label: 'Returned' },
                            ],
                        },
                    ]}
                    onApply={filter}
                    onReset={resetFilters}
                    className="lg:grid-cols-[1fr_160px_160px_160px_auto]"
                />

                <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">Order ID</th>
                                    <th className="px-5 py-4">Customer</th>
                                    <th className="px-5 py-4">Order</th>
                                    <th className="px-5 py-4">Payment</th>
                                    <th className="px-5 py-4">Fulfillment</th>
                                    <th className="px-5 py-4">Items</th>
                                    <th className="px-5 py-4 text-right">Total</th>
                                    <th className="px-5 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                                            No orders found.
                                        </td>
                                    </tr>
                                )}
                                {orders.map((order) => (
                                    <tr key={order.id} className="transition hover:bg-slate-50">
                                        <td className="px-5 py-4">
                                            <Link to={`/orders/${order.id}`} className="font-black text-primary hover:underline">
                                                {order.display_number || `#${order.id}`}
                                            </Link>
                                            <p className="mt-1 text-xs font-semibold text-slate-500">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-slate-900">{order.customer_snapshot?.name ?? order.customer_name ?? order.user?.name ?? 'Customer'}</p>
                                            <p className="text-xs text-slate-500">{order.customer_snapshot?.email ?? order.customer_email ?? order.user?.email ?? order.customer_phone ?? order.phone}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <select
                                                value={order.order_status || order.status}
                                                onChange={(event) => updateStatus(order, event.target.value)}
                                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="processing">Processing</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge value={order.payment_status} />
                                            <p className="mt-1 text-xs font-semibold uppercase text-slate-500">{order.payment_method}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge value={order.fulfillment_status || 'unfulfilled'} />
                                            {order.shipments?.[0]?.tracking_number && (
                                                <p className="mt-1 text-xs font-semibold text-slate-500">{order.shipments[0].tracking_number}</p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 font-semibold">{order.items_count}</td>
                                        <td className="px-5 py-4 text-right font-black">{money(order.total_amount)}</td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/orders/${order.id}`}
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
            </AdminCard>
        </AdminLayout>
    );
}
