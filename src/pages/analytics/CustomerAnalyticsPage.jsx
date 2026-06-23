import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FilterBar from '@/components/ui/FilterBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Eye, Heart, GitCompare, Search, ShoppingCart, TrendingUp } from 'lucide-react';

const COLORS = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#f472b6'];

export default function CustomerAnalyticsPage({ analytics = {}, filters = {} }) {
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const applyFilters = (event) => {
        event.preventDefault();
        window.location.href = `/admin/customer-analytics?start_date=${startDate}&end_date=${endDate}`;
    };

    const resetFilters = () => {
        setStartDate('');
        setEndDate('');
        window.location.href = '/admin/customer-analytics';
    };

    const summary = analytics.summary || {};
    const eventTypeBreakdown = analytics.event_type_breakdown || {};
    const topProducts = analytics.top_products || [];
    const wishlistAnalytics = analytics.wishlist_analytics || {};
    const comparisonAnalytics = analytics.comparison_analytics || {};
    const searchAnalytics = analytics.search_analytics || {};
    const cartAnalytics = analytics.cart_analytics || {};

    // Prepare chart data
    const eventTypeData = Object.entries(eventTypeBreakdown).map(([key, value]) => ({
        name: key.replace('_', ' '),
        count: value.count || 0,
    }));

    const wishlistData = wishlistAnalytics.top_products?.map(p => ({
        name: p.product_name || 'Unknown',
        count: p.count,
    })) || [];

    const searchData = searchAnalytics.top_search_terms?.map(s => ({
        name: s.search_term || 'Unknown',
        count: s.count,
    })) || [];

    return (
        <AdminLayout title="Customer Analytics">
            <div className="mb-6">
                <FilterBar onReset={resetFilters}>
                    <div className="flex gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <button
                            onClick={applyFilters}
                            className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                        >
                            Apply
                        </button>
                    </div>
                </FilterBar>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatCard
                    title="Total Events"
                    value={summary.total_events || 0}
                    icon={<TrendingUp className="h-5 w-5" />}
                    color="blue"
                />
                <StatCard
                    title="Unique Users"
                    value={summary.unique_users || 0}
                    icon={<Users className="h-5 w-5" />}
                    color="green"
                />
                <StatCard
                    title="Unique Sessions"
                    value={summary.unique_sessions || 0}
                    icon={<Eye className="h-5 w-5" />}
                    color="purple"
                />
                <StatCard
                    title="Date Range"
                    value={`${summary.date_range?.start || 'N/A'} - ${summary.date_range?.end || 'N/A'}`}
                    icon={<Search className="h-5 w-5" />}
                    color="orange"
                />
            </div>

            {/* Event Type Breakdown */}
            <AdminCard title="Event Type Breakdown" className="mb-6">
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={eventTypeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </AdminCard>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
                {/* Wishlist Analytics */}
                <AdminCard title="Wishlist Analytics" className="mb-6">
                    <div className="mb-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-600">Total Wishlist Adds</span>
                            <span className="text-lg font-bold text-rose-600">{wishlistAnalytics.total_adds || 0}</span>
                        </div>
                    </div>
                    {wishlistData.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={wishlistData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#f43f5e" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">No wishlist data available</p>
                    )}
                </AdminCard>

                {/* Search Analytics */}
                <AdminCard title="Search Analytics" className="mb-6">
                    {searchData.length > 0 ? (
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={searchData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8b5cf6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">No search data available</p>
                    )}
                </AdminCard>
            </div>

            {/* Top Products */}
            <AdminCard title="Top Products" className="mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Product</th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600">Total Events</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.length > 0 ? (
                                topProducts.map((product, index) => (
                                    <tr key={product.product_id} className="border-b border-gray-100">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-semibold text-gray-900">{index + 1}.</span>
                                                <span className="text-sm text-gray-700">{product.product_name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-sm font-bold text-blue-600">{product.count}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="px-4 py-8 text-center text-gray-500">
                                        No product data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </AdminCard>

            {/* Comparison Analytics */}
            <AdminCard title="Comparison Analytics" className="mb-6">
                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-600">Total Comparison Adds</span>
                        <span className="text-lg font-bold text-blue-600">{comparisonAnalytics.total_adds || 0}</span>
                    </div>
                </div>
                {comparisonAnalytics.top_products?.length > 0 ? (
                    <div className="space-y-2">
                        {comparisonAnalytics.top_products.map((product, index) => (
                            <div key={product.product_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gray-600">{index + 1}.</span>
                                    <span className="text-sm text-gray-700">{product.product_name || 'Unknown'}</span>
                                </div>
                                <span className="text-sm font-bold text-blue-600">{product.count}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">No comparison data available</p>
                )}
            </AdminCard>

            {/* Cart Analytics */}
            <AdminCard title="Cart Analytics" className="mb-6">
                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-600">Total Add to Cart</span>
                        <span className="text-lg font-bold text-green-600">{cartAnalytics.total_adds || 0}</span>
                    </div>
                </div>
                {cartAnalytics.top_products?.length > 0 ? (
                    <div className="space-y-2">
                        {cartAnalytics.top_products.map((product, index) => (
                            <div key={product.product_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gray-600">{index + 1}.</span>
                                    <span className="text-sm text-gray-700">{product.product_name || 'Unknown'}</span>
                                </div>
                                <span className="text-sm font-bold text-green-600">{product.count}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">No cart data available</p>
                )}
            </AdminCard>
        </AdminLayout>
    );
}
