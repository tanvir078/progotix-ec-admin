import { Link, router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FilterBar from '@/components/ui/FilterBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FileText, Download, TrendingUp, DollarSign, ShoppingCart, Package, Calendar } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

export default function AdminReportsPage({ reportData = {}, filters = {}, status }) {
    const [reportType, setReportType] = useState(filters.type ?? 'sales');
    const [startDate, setStartDate] = useState(filters.start_date ?? '');
    const [endDate, setEndDate] = useState(filters.end_date ?? '');

    const generateReport = (event) => {
        event.preventDefault();
        router.get('/admin/reports', { 
            type: reportType, 
            start_date: startDate, 
            end_date: endDate 
        }, { preserveState: true });
    };

    const resetFilters = () => {
        setReportType('sales');
        setStartDate('');
        setEndDate('');
        router.get('/admin/reports', {}, { preserveState: true });
    };

    const salesData = reportData.sales?.daily || [];
    const productData = reportData.products?.top_selling || [];
    const categoryData = reportData.categories || [];
    const summary = reportData.summary || {};

    return (
        <AdminLayout title="Reports">
            {status && (
                <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
                    {status}
                </div>
            )}

            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Revenue" value={money(summary.total_revenue)} icon={DollarSign} />
                <StatCard label="Total Orders" value={summary.total_orders ?? 0} icon={ShoppingCart} />
                <StatCard label="Products Sold" value={summary.products_sold ?? 0} icon={Package} />
                <StatCard label="Avg Order Value" value={money(summary.avg_order_value)} icon={TrendingUp} />
            </div>

            <AdminCard title="Report Generator">
                <FilterBar
                    filters={[
                        {
                            key: 'type',
                            value: reportType,
                            onChange: setReportType,
                            placeholder: 'Report Type',
                            options: [
                                { value: 'sales', label: 'Sales Report' },
                                { value: 'products', label: 'Products Report' },
                                { value: 'orders', label: 'Orders Report' },
                                { value: 'customers', label: 'Customers Report' },
                            ],
                        },
                    ]}
                    onApply={generateReport}
                    onReset={resetFilters}
                    className="md:grid-cols-[180px_auto]"
                />
            </AdminCard>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {salesData.length > 0 && (
                    <AdminCard title="Sales Trend" icon={<TrendingUp className="h-5 w-5 text-slate-400" />}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => money(value)} />
                                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </AdminCard>
                )}

                {categoryData.length > 0 && (
                    <AdminCard title="Sales by Category" icon={<Package className="h-5 w-5 text-slate-400" />}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="revenue"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => money(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </AdminCard>
                )}

                {productData.length > 0 && (
                    <AdminCard title="Top Selling Products" icon={<Package className="h-5 w-5 text-slate-400" />} className="lg:col-span-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={productData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="quantity" fill="#6366f1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </AdminCard>
                )}
            </div>

            <AdminCard title="Export Reports" className="mt-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <button
                        onClick={() => router.get('/admin/reports/export', { type: 'sales' })}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        <Download className="h-4 w-4" />
                        Export Sales CSV
                    </button>
                    <button
                        onClick={() => router.get('/admin/reports/export', { type: 'products' })}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        <Download className="h-4 w-4" />
                        Export Products CSV
                    </button>
                    <button
                        onClick={() => router.get('/admin/reports/export', { type: 'orders' })}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        <Download className="h-4 w-4" />
                        Export Orders CSV
                    </button>
                    <button
                        onClick={() => router.get('/admin/reports/export', { type: 'customers' })}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        <Download className="h-4 w-4" />
                        Export Customers CSV
                    </button>
                </div>
            </AdminCard>
        </AdminLayout>
    );
}
