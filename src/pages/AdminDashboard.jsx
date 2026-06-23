import { Link } from '@/lib/inertiaCompat';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import { DollarSign, ShoppingCart, Package, Users, AlertTriangle, TrendingUp, Layers } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

const COLORS = ['#4f0b62', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

export default function AdminDashboard({ stats = {}, recent_orders = [], recent_products = [], recent_users = [], low_stock_products = [] }) {
    const kpiCards = [
        { label: 'Total Products', value: stats.total_products ?? 0, trend: 3, href: '/admin/products', icon: Package },
        { label: 'Total Orders', value: stats.total_orders ?? 0, trend: 5, href: '/admin/orders', icon: ShoppingCart },
        { label: 'Total Customers', value: stats.total_users ?? 0, trend: 10, href: '/admin/users', icon: Users },
        { label: 'Total Categories', value: stats.total_categories ?? 0, href: '/admin/categories', icon: Layers },
        { label: 'Pending Orders', value: stats.pending_orders ?? 0, href: '/admin/orders?status=pending', icon: AlertTriangle, color: 'warning' },
        { label: 'Processing Orders', value: stats.processing_orders ?? 0, href: '/admin/orders?status=processing', icon: ShoppingCart, color: 'info' },
        { label: 'Completed Orders', value: stats.completed_orders ?? 0, href: '/admin/orders?status=completed', icon: ShoppingCart, color: 'success' },
        { label: 'Revenue Today', value: money(stats.revenue_today || 0), trend: 8, href: '/admin/analytics', icon: DollarSign, color: 'success' },
        { label: 'Revenue Month', value: money(stats.revenue_month || 0), trend: 12, href: '/admin/analytics', icon: TrendingUp, color: 'success' },
        { label: 'Total Revenue', value: money(stats.revenue_total || 0), href: '/admin/analytics', icon: DollarSign, color: 'success' },
    ];

    const orderStatusData = [
        { name: 'Pending', value: stats.pending_orders || 0 },
        { name: 'Processing', value: stats.processing_orders || 0 },
        { name: 'Shipped', value: stats.shipped_orders || 0 },
        { name: 'Delivered', value: stats.completed_orders || 0 },
        { name: 'Cancelled', value: stats.cancelled_orders || 0 },
    ];

    return (
        <AdminLayout title="Dashboard">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {kpiCards.map((card) => (
                    <StatCard key={card.label} {...card} />
                ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
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

                <AdminCard title="Low Stock Alert" action={<Link to="/admin/products?status=low_stock" className="text-xs font-black text-primary hover:underline">View All</Link>}>
                    <div className="space-y-3">
                        {low_stock_products.length === 0 ? (
                            <div className="text-center py-8 text-sm font-bold text-slate-400">
                                No low stock products
                            </div>
                        ) : (
                            low_stock_products.slice(0, 5).map((product) => (
                                <div key={product.id} className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={product.image_url || 'https://placehold.co/40x40?text=PX'}
                                            alt={product.name}
                                            className="h-10 w-10 rounded-xl object-cover"
                                        />
                                        <div>
                                            <p className="text-sm font-black text-slate-950">{product.name}</p>
                                            <p className="text-xs font-semibold text-slate-500">{product.category || 'Uncategorized'}</p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                                        {product.stock} left
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </AdminCard>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <AdminCard title="Recent Orders" action={<Link to="/admin/orders" className="text-xs font-black text-primary hover:underline">View All</Link>}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">Order ID</th>
                                    <th className="px-5 py-4">Customer</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {recent_orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                                            No recent orders
                                        </td>
                                    </tr>
                                ) : (
                                    recent_orders.slice(0, 5).map((order) => (
                                        <tr key={order.id} className="transition hover:bg-slate-50">
                                            <td className="px-5 py-4 font-black">
                                                <Link to={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                                                    #{order.id}
                                                </Link>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="font-semibold">{order.user?.name ?? 'Customer'}</p>
                                                <p className="text-xs text-slate-500">{order.phone || order.user?.email}</p>
                                            </td>
                                            <td className="px-5 py-4"><StatusBadge value={order.status} /></td>
                                            <td className="px-5 py-4 text-right font-black">{money(order.total_amount)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </AdminCard>

                <AdminCard title="Recent Products" action={<Link to="/admin/products" className="text-xs font-black text-primary hover:underline">View All</Link>}>
                    <div className="space-y-3">
                        {recent_products.length === 0 ? (
                            <div className="text-center py-8 text-sm font-bold text-slate-400">
                                No recent products
                            </div>
                        ) : (
                            recent_products.slice(0, 5).map((product) => (
                                <div key={product.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={product.image_url || 'https://placehold.co/40x40?text=PX'}
                                            alt={product.name}
                                            className="h-10 w-10 rounded-xl object-cover"
                                        />
                                        <div>
                                            <p className="text-sm font-black text-slate-950">{product.name}</p>
                                            <p className="text-xs font-semibold text-slate-500">{product.category || 'Uncategorized'}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-slate-700">{money(product.price)}</span>
                                </div>
                            ))
                        )}
                    </div>
                </AdminCard>
            </div>

            <div className="mt-6">
                <AdminCard title="Recent Customers" action={<Link to="/admin/users" className="text-xs font-black text-primary hover:underline">View All</Link>}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">Customer</th>
                                    <th className="px-5 py-4">Email</th>
                                    <th className="px-5 py-4">Phone</th>
                                    <th className="px-5 py-4">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {recent_users.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                                            No recent customers
                                        </td>
                                    </tr>
                                ) : (
                                    recent_users.slice(0, 5).map((user) => (
                                        <tr key={user.id} className="transition hover:bg-slate-50">
                                            <td className="px-5 py-4 font-black">{user.name}</td>
                                            <td className="px-5 py-4">{user.email}</td>
                                            <td className="px-5 py-4">{user.phone || 'N/A'}</td>
                                            <td className="px-5 py-4 text-xs text-slate-500">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
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
