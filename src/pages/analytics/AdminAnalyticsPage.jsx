import AdminLayout, { AdminCard } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';
import { BarChart3, TrendingUp, Users, DollarSign, FileText, ShoppingCart, Package, ArrowRight } from 'lucide-react';

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

export default function AdminAnalyticsPage({ analytics = {} }) {
    const metrics = [
        { label: 'Total Revenue', value: money(analytics.totalRevenue), icon: DollarSign },
        { label: 'Total Orders', value: analytics.totalOrders ?? 0, icon: ShoppingCart },
        { label: 'Average Order Value', value: money(analytics.avgOrderValue), icon: TrendingUp },
        { label: 'Conversion Rate', value: `${analytics.conversionRate ?? 0}%`, icon: BarChart3 },
    ];

    const reports = [
        { label: 'Sales Report', href: '/admin/analytics/sales', icon: TrendingUp, description: 'View detailed sales performance' },
        { label: 'Customer Report', href: '/admin/analytics/customers', icon: Users, description: 'Customer insights and behavior' },
        { label: 'Inventory Report', href: '/admin/analytics/inventory', icon: Package, description: 'Stock levels and movements' },
        { label: 'Revenue Report', href: '/admin/analytics/revenue', icon: DollarSign, description: 'Revenue breakdown and trends' },
    ];

    return (
        <AdminLayout title="Analytics">
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric) => {
                    const Icon = metric.icon;
                    return (
                        <StatCard key={metric.label} label={metric.label} value={metric.value} icon={Icon} />
                    );
                })}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <AdminCard title="Reports" icon={<FileText className="h-5 w-5 text-slate-400" />}>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {reports.map((report) => {
                            const Icon = report.icon;
                            return (
                                <a
                                    key={report.href}
                                    href={report.href}
                                    className="group flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-primary hover:bg-white hover:shadow-md"
                                >
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white transition group-hover:bg-primary-dark">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-black text-slate-900">{report.label}</h3>
                                    <p className="mt-1 text-xs font-semibold text-slate-500">{report.description}</p>
                                    <div className="mt-3 flex items-center gap-1 text-xs font-black text-primary opacity-0 transition group-hover:opacity-100">
                                        View Report <ArrowRight className="h-3 w-3" />
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </AdminCard>

                <AdminCard title="Operational Notes" icon={<BarChart3 className="h-5 w-5 text-slate-400" />}>
                    <div className="space-y-4">
                        <p className="text-sm leading-6 text-slate-600">
                            Analytics are calculated from orders and payment states. Use report endpoints for raw JSON exports while the dashboard keeps the operator view compact.
                        </p>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <h4 className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Quick Tips</h4>
                            <ul className="space-y-2 text-sm font-semibold text-slate-700">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                                    Monitor conversion rates for marketing effectiveness
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                                    Track average order value to optimize pricing
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                                    Review inventory reports to prevent stockouts
                                </li>
                            </ul>
                        </div>
                        <Button variant="secondary" className="w-full">
                            Export All Data
                        </Button>
                    </div>
                </AdminCard>
            </div>
        </AdminLayout>
    );
}
