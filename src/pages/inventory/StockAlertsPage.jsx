import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FilterBar from '@/components/ui/FilterBar';
import Button from '@/components/ui/Button';
import { AlertTriangle, Bell, Users, Package, CheckCircle, Clock, RefreshCw } from 'lucide-react';

export default function StockAlertsPage({ alerts = [], stats = {}, filters = {} }) {
    const [filter, setFilter] = useState(filters.status || 'all');

    const filteredAlerts = alerts.filter((alert) => {
        if (filter === 'all') return true;
        if (filter === 'active') return alert.is_active;
        if (filter === 'notified') return alert.is_notified;
        if (filter === 'pending') return alert.is_active && !alert.is_notified;
        return true;
    });

    const checkLowStock = async () => {
        try {
            await fetch('/api/admin/stock-alerts/check-low-stock', { method: 'POST' });
            window.location.reload();
        } catch (error) {
            console.error('Failed to check low stock:', error);
        }
    };

    return (
        <AdminLayout title="Stock Alerts">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatCard
                    title="Total Alerts"
                    value={stats.total_alerts || 0}
                    icon={<Bell className="h-5 w-5" />}
                    color="blue"
                />
                <StatCard
                    title="Active Alerts"
                    value={stats.active_alerts || 0}
                    icon={<Users className="h-5 w-5" />}
                    color="green"
                />
                <StatCard
                    title="Pending Notifications"
                    value={stats.pending_alerts || 0}
                    icon={<Clock className="h-5 w-5" />}
                    color="orange"
                />
                <StatCard
                    title="Low Stock Products"
                    value={stats.low_stock_products || 0}
                    icon={<AlertTriangle className="h-5 w-5" />}
                    color="red"
                />
            </div>

            {/* Actions */}
            <div className="mb-6">
                <FilterBar onReset={() => setFilter('all')}>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                                filter === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                                filter === 'active'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                                filter === 'pending'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('notified')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                                filter === 'notified'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Notified
                        </button>
                    </div>
                </FilterBar>
            </div>

            {/* Check Low Stock Button */}
            <div className="mb-6">
                <Button
                    onClick={checkLowStock}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    Check Low Stock & Send Notifications
                </Button>
            </div>

            {/* Alerts Table */}
            <AdminCard title="Stock Alerts">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Product</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">User</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Contact</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Threshold</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Notified At</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAlerts.length > 0 ? (
                                filteredAlerts.map((alert) => (
                                    <tr key={alert.id} className="border-b border-gray-100">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <Package className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-700">{alert.product?.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-700">
                                                {alert.user?.name || alert.user?.email || 'Guest'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-1">
                                                {alert.email && (
                                                    <div className="text-xs text-gray-600">{alert.email}</div>
                                                )}
                                                {alert.phone && (
                                                    <div className="text-xs text-gray-600">{alert.phone}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-bold text-gray-700">{alert.threshold}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <StatusBadge
                                                    active={alert.is_active}
                                                    label={alert.is_active ? 'Active' : 'Inactive'}
                                                />
                                                {alert.is_notified && (
                                                    <StatusBadge
                                                        active={true}
                                                        label="Notified"
                                                        color="green"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-600">
                                                {alert.notified_at
                                                    ? new Date(alert.notified_at).toLocaleDateString()
                                                    : '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-600">
                                                {new Date(alert.created_at).toLocaleDateString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                        No stock alerts found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </AdminCard>
        </AdminLayout>
    );
}
