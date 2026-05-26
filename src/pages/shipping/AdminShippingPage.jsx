import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import PageTabs from '@/components/ui/PageTabs';
import StatCard from '@/components/ui/StatCard';
import { PackageCheck, Truck, MapPin, Settings, Route, DollarSign, Clock, CheckCircle } from 'lucide-react';

function money(value) {
  return `$${Number(value ?? 0).toFixed(2)}`;
}

export default function AdminShippingPage({
  metrics = [],
  shipments = [],
  rates = [],
  settings = {},
  trackingEvents = [],
}) {
  const [activeTab, setActiveTab] = useState('shipments');
  const pending = shipments.filter((shipment) => shipment.status === 'pending').length;
  const shipped = shipments.filter((shipment) => shipment.status === 'shipped').length;
  const delivered = shipments.filter((shipment) => shipment.status === 'delivered').length;

  const tabs = [
    { value: 'shipments', label: 'Shipments', icon: Truck, count: shipments.length },
    { value: 'rates', label: 'Rates', icon: DollarSign, count: rates.length },
    { value: 'tracking', label: 'Tracking', icon: Route },
    { value: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <AdminLayout title="Shipping">
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending" value={pending} icon={Clock} />
        <StatCard label="Shipped" value={shipped} icon={Truck} />
        <StatCard label="Delivered" value={delivered} icon={CheckCircle} />
        <StatCard label="Default Fee" value={money(settings.default_shipping_fee)} icon={DollarSign} />
      </div>

      <PageTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'shipments' && (
        <AdminCard title={`Shipment Queue (${shipments.length})`}>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Method</th>
                    <th className="px-5 py-4">Fee</th>
                    <th className="px-5 py-4">Phone</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {shipments.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                        No shipments yet.
                      </td>
                    </tr>
                  )}
                  {shipments.map((shipment) => (
                    <tr key={shipment.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4 font-black text-primary">{shipment.order}</td>
                      <td className="px-5 py-4">
                        <p className="font-black text-slate-900">{shipment.customer}</p>
                        <p className="mt-1 max-w-xs truncate text-xs font-semibold text-slate-500">{shipment.address || '-'}</p>
                      </td>
                      <td className="px-5 py-4 font-semibold capitalize text-slate-700">{shipment.method}</td>
                      <td className="px-5 py-4 font-black text-slate-900">{shipment.fee}</td>
                      <td className="px-5 py-4 font-semibold text-slate-600">{shipment.phone || '-'}</td>
                      <td className="px-5 py-4"><StatusBadge value={shipment.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AdminCard>
      )}

      {activeTab === 'rates' && (
        <div className="grid gap-4 lg:grid-cols-2">
          {rates.map((rate) => (
            <AdminCard key={rate.name} title={rate.name}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-2xl font-black text-slate-950">{rate.price}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-500">{rate.condition}</p>
                </div>
                <StatusBadge value={rate.status} />
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {activeTab === 'tracking' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <AdminCard title="Tracking Timeline">
            <div className="space-y-4">
              {trackingEvents.map((event, index) => (
                <div key={event.step} className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-sm font-black text-slate-700 ring-1 ring-slate-200">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-slate-900">{event.step}</p>
                    <p className="text-xs font-semibold text-slate-500">Customer order tracking step</p>
                  </div>
                  <StatusBadge value={event.status} />
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard title="Carrier Setup">
            <div className="space-y-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-900">Carrier tracking</p>
                <StatusBadge className="mt-2" value={settings.carrier_tracking_enabled ? 'active' : 'partial'} />
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-900">Label printing</p>
                <StatusBadge className="mt-2" value={settings.label_printing_enabled ? 'active' : 'partial'} />
              </div>
            </div>
          </AdminCard>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <AdminCard title="Shipping Settings">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-400">Free shipping threshold</p>
                <p className="mt-2 text-2xl font-black text-slate-950">{money(settings.free_shipping_threshold)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-400">Default shipping fee</p>
                <p className="mt-2 text-2xl font-black text-slate-950">{money(settings.default_shipping_fee)}</p>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Operational Notes">
            <div className="space-y-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm font-bold text-slate-600">{metric.label}</span>
                  <span className="font-black text-slate-950">{metric.value}</span>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      )}
    </AdminLayout>
  );
}
