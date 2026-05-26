import { Link } from '@/lib/inertiaCompat';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import { DollarSign, ShoppingCart, Package, Users, AlertTriangle, Ticket, RotateCcw, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

const COLORS = ['#0F172A', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

export default function AdminDashboard({ stats = {}, paymentSummary = {}, recentOrders = [], topProducts = [] }) {
    const kpiCards = [
        { label: 'Total Revenue', value: money(stats.revenue), trend: 12, href: '/admin/analytics', icon: DollarSign },
        { label: 'Today Sales', value: money(stats.todaySales || 0), trend: 8, href: '/admin/analytics', icon: TrendingUp },
        { label: 'Total Orders', value: stats.orders ?? 0, trend: 5, href: '/admin/orders', icon: ShoppingCart },
        { label: 'Pending Orders', value: stats.pendingOrders ?? 0, href: '/admin/orders?status=pending', icon: AlertTriangle },
        { label: 'Products', value: stats.products ?? 0, trend: 3, href: '/admin/products', icon: Package },
        { label: 'Low Stock', value: stats.lowStock ?? 0, href: '/admin/products?status=low_stock', icon: AlertTriangle },
        { label: 'Customers', value: stats.users ?? 0, trend: 10, href: '/admin/users', icon: Users },
        { label: 'Active Coupons', value: stats.activeCoupons ?? 0, href: '/admin/coupons', icon: Ticket },
    ];

    const salesData = [
        { name: 'Mon', sales: 4000 },
        { name: 'Tue', sales: 3000 },
        { name: 'Wed', sales: 5000 },
        { name: 'Thu', sales: 4500 },
        { name: 'Fri', sales: 6000 },
        { name: 'Sat', sales: 7000 },
        { name: 'Sun', sales: 5500 },
    ];

    const orderStatusData = [
        { name: 'Pending', value: stats.pendingOrders || 10 },
        { name: 'Processing', value: stats.processingOrders || 15 },
        { name: 'Shipped', value: stats.shippedOrders || 20 },
        { name: 'Delivered', value: stats.deliveredOrders || 45 },
        { name: 'Cancelled', value: stats.cancelledOrders || 5 },
    ];

    return (
        <AdminLayout title="Dashboard">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {kpiCards.map((card) => (
                    <StatCard key={card.label} {...card} />
                ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <AdminCard title="Sales Overview" action={<button className="text-xs font-black text-primary hover:underline">View Report</button>}>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                                <YAxis stroke="#64748B" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line type="monotone" dataKey="sales" stroke="#0F172A" strokeWidth={2} dot={{ fill: '#0F172A' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </AdminCard>

                <AdminCard title="Order Status Distribution">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={orderStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </AdminCard>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
                <AdminCard title="Recent Orders" action={<Link to="/orders" className="text-xs font-black text-primary hover:underline">View All</Link>}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">Order ID</th>
                                    <th className="px-5 py-4">Customer</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Payment</th>
                                    <th className="px-5 py-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                                            No recent orders
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.slice(0, 5).map((order) => (
                                        <tr key={order.id} className="transition hover:bg-slate-50">
                                            <td className="px-5 py-4 font-black">
                                                <Link to={`/orders/${order.id}`} className="text-primary hover:underline">
                                                    #{order.id}
                                                </Link>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="font-semibold">{order.user?.name ?? 'Customer'}</p>
                                                <p className="text-xs text-slate-500">{order.phone || order.user?.email}</p>
                                            </td>
                                            <td className="px-5 py-4"><StatusBadge value={order.status} /></td>
                                            <td className="px-5 py-4"><StatusBadge value={order.payment_status} /></td>
                                            <td className="px-5 py-4 text-right font-black">{money(order.total_amount)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </AdminCard>

                <AdminCard title="Payment Summary">
                    <div className="space-y-3">
                        {Object.entries(paymentSummary).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                                <span className="text-sm font-bold capitalize text-slate-600">{key.replace(/_/g, ' ')}</span>
                                <span className="text-lg font-black text-slate-950">{typeof value === 'number' ? money(value) : value}</span>
                            </div>
                        ))}
                    </div>
                </AdminCard>
            </div>

            <div className="mt-6">
                <AdminCard title="Top Selling Products" action={<Link to="/products" className="text-xs font-black text-primary hover:underline">View All</Link>}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">Product</th>
                                    <th className="px-5 py-4">Category</th>
                                    <th className="px-5 py-4">Stock</th>
                                    <th className="px-5 py-4">Units Sold</th>
                                    <th className="px-5 py-4 text-right">Sales</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {topProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                                            No products data
                                        </td>
                                    </tr>
                                ) : (
                                    topProducts.slice(0, 5).map((product) => (
                                        <tr key={product.id} className="transition hover:bg-slate-50">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.display_image_url || product.image_url || 'https://placehold.co/40x40?text=PX'}
                                                        alt={product.name}
                                                        className="h-10 w-10 rounded-xl object-cover"
                                                    />
                                                    <span className="font-black text-slate-950">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                                                    {product.category ?? 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`rounded-full px-3 py-1 text-xs font-black ${
                                                    Number(product.stock) <= 10 ? 'bg-danger-light text-danger-dark' : 'bg-success-light text-success-dark'
                                                }`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 font-semibold">{product.units_sold ?? 0}</td>
                                            <td className="px-5 py-4 text-right font-black">{money(product.sales_total)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </AdminCard>
            </div>
        </AdminLayout>
    );
}
