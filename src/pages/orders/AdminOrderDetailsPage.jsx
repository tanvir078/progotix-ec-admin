import { Link, router } from '@/lib/inertiaCompat';
import { useMemo, useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import { ArrowLeft, CreditCard, MapPin, Package, RotateCcw, Truck, User } from 'lucide-react';

const orderStatuses = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];
const paymentStatuses = ['unpaid', 'pending', 'paid', 'partially_refunded', 'refunded', 'failed'];
const fulfillmentStatuses = ['unfulfilled', 'packed', 'shipped', 'delivered', 'returned'];

function money(value) {
  return `$${Number(value ?? 0).toFixed(2)}`;
}

function line(...parts) {
  return parts.filter(Boolean).join(', ');
}

function AddressBlock({ title, data, fallback }) {
  const address = data || {};
  const fullAddress = line(address.address, address.area, address.city, address.postcode, address.country) || fallback;

  return (
    <AdminCard title={title}>
      <div className="space-y-2 text-sm font-semibold text-slate-600">
        <p className="font-black text-slate-950">{address.name || 'Not provided'}</p>
        <p>{address.email || '-'}</p>
        <p>{address.phone || '-'}</p>
        <p className="rounded-xl bg-slate-50 p-3 leading-6 text-slate-700">{fullAddress || 'No address recorded.'}</p>
      </div>
    </AdminCard>
  );
}

export default function AdminOrderDetailsPage({ order, status }) {
  const [refundAmount, setRefundAmount] = useState(order?.total_amount ?? '0.00');
  const [reason, setReason] = useState('');
  const [restockItems, setRestockItems] = useState(false);
  const [statusForm, setStatusForm] = useState({
    order_status: order?.order_status || order?.status || 'pending',
    payment_status: order?.payment_status || 'unpaid',
    fulfillment_status: order?.fulfillment_status || 'unfulfilled',
  });
  const [shipmentForm, setShipmentForm] = useState(() => {
    const shipment = order?.shipments?.[0] || {};
    return {
      carrier: shipment.carrier || '',
      tracking_number: shipment.tracking_number || '',
      tracking_url: shipment.tracking_url || '',
      shipping_method: shipment.shipping_method || '',
      status: shipment.status || order?.fulfillment_status || 'pending',
    };
  });
  const [adminNote, setAdminNote] = useState(order?.admin_note || '');

  const customer = order?.customer_snapshot || {
    name: order?.customer_name || order?.user?.name,
    email: order?.customer_email || order?.user?.email,
    phone: order?.customer_phone || order?.phone,
  };

  const netTotal = useMemo(() => Number(order?.total_amount || 0) - Number(order?.refunded_amount || 0), [order]);

  if (!order) {
    return (
      <AdminLayout title="Order Details" actions={<BackButton />}>
        <AdminCard title="Order not found">
          <p className="text-sm font-semibold text-slate-500">This order could not be loaded from the API.</p>
        </AdminCard>
      </AdminLayout>
    );
  }

  const updateStatuses = (event) => {
    event.preventDefault();
    router.patch(`/admin/orders/${order.id}/status`, statusForm, { preserveScroll: true });
  };

  const saveShipment = (event) => {
    event.preventDefault();
    router.post(`/admin/orders/${order.id}/shipments`, shipmentForm, { preserveScroll: true });
  };

  const saveNote = (event) => {
    event.preventDefault();
    router.post(`/admin/orders/${order.id}/notes`, { note: adminNote }, { preserveScroll: true });
  };

  const refund = (event) => {
    event.preventDefault();
    if (window.confirm(`Refund ${money(refundAmount)} for ${order.display_number || `#${order.id}`}?`)) {
      router.post(`/admin/orders/${order.id}/refund`, { amount: refundAmount, reason, restock_items: restockItems }, { preserveScroll: true });
    }
  };

  return (
    <AdminLayout title={`Order ${order.display_number || `#${order.id}`}`} actions={<BackButton />}>
      {status && (
        <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
          {status}
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <AdminCard title="Order">
          <p className="text-2xl font-black text-slate-950">{order.display_number || `#${order.id}`}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">{new Date(order.created_at).toLocaleString()}</p>
        </AdminCard>
        <AdminCard title="Order Status"><StatusBadge value={order.order_status || order.status} /></AdminCard>
        <AdminCard title="Payment"><StatusBadge value={order.payment_status} /></AdminCard>
        <AdminCard title="Fulfillment"><StatusBadge value={order.fulfillment_status || 'unfulfilled'} /></AdminCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <AdminCard title="Order Items">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">SKU</th>
                    <th className="px-5 py-4">Qty</th>
                    <th className="px-5 py-4">Unit</th>
                    <th className="px-5 py-4">Discount</th>
                    <th className="px-5 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {order.items?.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {item.image_url && <img src={item.image_url} alt="" className="h-10 w-10 rounded-lg object-cover" />}
                          <span className="font-black text-slate-900">{item.product_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-slate-600">{item.sku || '-'}</td>
                      <td className="px-5 py-4">{item.quantity}</td>
                      <td className="px-5 py-4">{money(item.unit_price)}</td>
                      <td className="px-5 py-4">{money(item.discount_amount)}</td>
                      <td className="px-5 py-4 text-right font-black">{money(item.line_total)}</td>
                    </tr>
                  ))}
                  {(!order.items || order.items.length === 0) && (
                    <tr>
                      <td colSpan="6" className="px-5 py-10 text-center text-sm font-bold text-slate-400">No items recorded for this order.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </AdminCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <AdminCard title="Customer">
              <div className="space-y-2 text-sm font-semibold text-slate-600">
                <p className="font-black text-slate-950">{customer.name || 'Customer'}</p>
                <p>{customer.email || '-'}</p>
                <p>{customer.phone || '-'}</p>
                {order.user && <p className="text-xs text-slate-400">Account ID: {order.user.id}</p>}
              </div>
            </AdminCard>
            <AdminCard title="Totals">
              <div className="space-y-3 text-sm">
                <TotalRow label="Subtotal" value={money(order.subtotal_amount)} />
                <TotalRow label="Discount" value={`-${money(order.discount_amount)}`} tone="danger" />
                <TotalRow label="Shipping" value={money(order.shipping_amount)} />
                <TotalRow label="Tax" value={money(order.tax_amount)} />
                <TotalRow label="Total" value={money(order.total_amount)} strong />
                <TotalRow label="Refunded" value={money(order.refunded_amount)} tone="danger" />
                <TotalRow label="Net" value={money(netTotal)} strong />
              </div>
            </AdminCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <AddressBlock title="Shipping Address" data={order.shipping_snapshot} fallback={order.shipping_address} />
            <AddressBlock title="Billing Address" data={order.billing_snapshot} fallback={order.shipping_address} />
          </div>

          <AdminCard title="Timeline">
            <div className="space-y-3">
              {order.events?.map((event) => (
                <div key={event.id} className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-slate-900">{event.title}</p>
                    <p className="text-xs font-semibold text-slate-500">{new Date(event.created_at).toLocaleString()}</p>
                  </div>
                  {event.message && <p className="mt-1 text-sm font-semibold text-slate-600">{event.message}</p>}
                </div>
              ))}
              {(!order.events || order.events.length === 0) && <p className="text-sm font-semibold text-slate-500">No timeline events yet.</p>}
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Update Status">
            <form onSubmit={updateStatuses} className="space-y-3">
              <Select label="Order" value={statusForm.order_status} values={orderStatuses} onChange={(value) => setStatusForm((current) => ({ ...current, order_status: value }))} />
              <Select label="Payment" value={statusForm.payment_status} values={paymentStatuses} onChange={(value) => setStatusForm((current) => ({ ...current, payment_status: value }))} />
              <Select label="Fulfillment" value={statusForm.fulfillment_status} values={fulfillmentStatuses} onChange={(value) => setStatusForm((current) => ({ ...current, fulfillment_status: value }))} />
              <Button type="submit" className="w-full">Save Status</Button>
            </form>
          </AdminCard>

          <AdminCard title="Payment" icon={<CreditCard className="h-5 w-5" />}>
            <div className="space-y-3 text-sm font-semibold text-slate-600">
              <p><span className="font-black">Method:</span> {order.payment_method || 'cod'}</p>
              <p><span className="font-black">Provider:</span> {order.payment_provider || '-'}</p>
              <p><span className="font-black">Transaction:</span> {order.transaction_id || order.stripe_payment_intent_id || '-'}</p>
              {order.payments?.map((payment) => (
                <div key={payment.id} className="rounded-xl bg-slate-50 p-3">
                  <p className="font-black text-slate-900">{payment.provider} · {payment.status}</p>
                  <p>{money(payment.amount)} {payment.currency}</p>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard title="Shipment" icon={<Truck className="h-5 w-5" />}>
            <form onSubmit={saveShipment} className="space-y-3">
              <FormInput label="Carrier" value={shipmentForm.carrier} onChange={(event) => setShipmentForm((current) => ({ ...current, carrier: event.target.value }))} />
              <FormInput label="Tracking Number" value={shipmentForm.tracking_number} onChange={(event) => setShipmentForm((current) => ({ ...current, tracking_number: event.target.value }))} />
              <FormInput label="Tracking URL" value={shipmentForm.tracking_url} onChange={(event) => setShipmentForm((current) => ({ ...current, tracking_url: event.target.value }))} />
              <FormInput label="Shipping Method" value={shipmentForm.shipping_method} onChange={(event) => setShipmentForm((current) => ({ ...current, shipping_method: event.target.value }))} />
              <Select label="Shipment Status" value={shipmentForm.status} values={['pending', 'packed', 'shipped', 'delivered', 'returned']} onChange={(value) => setShipmentForm((current) => ({ ...current, status: value }))} />
              <Button type="submit" className="w-full">Save Shipment</Button>
            </form>
          </AdminCard>

          <AdminCard title="Admin Note">
            <form onSubmit={saveNote} className="space-y-3">
              <textarea value={adminNote} onChange={(event) => setAdminNote(event.target.value)} className="min-h-24 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              <Button type="submit" className="w-full">Save Note</Button>
            </form>
          </AdminCard>

          <AdminCard title="Issue Refund">
            <form onSubmit={refund} className="space-y-4">
              <FormInput label="Refund Amount" type="number" step="0.01" value={refundAmount} onChange={(event) => setRefundAmount(event.target.value)} />
              <textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Refund reason" className="min-h-20 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
                <input type="checkbox" checked={restockItems} onChange={(event) => setRestockItems(event.target.checked)} />
                Restock items
              </label>
              <Button type="submit" variant="danger" disabled={!['paid', 'partially_refunded'].includes(order.payment_status)} className="w-full">
                Process Refund
              </Button>
            </form>
          </AdminCard>
        </div>
      </div>
    </AdminLayout>
  );
}

function BackButton() {
  return (
    <Link to="/orders">
      <Button variant="secondary" className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
    </Link>
  );
}

function Select({ label, value, values, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black text-slate-600">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-primary focus:ring-1 focus:ring-primary">
        {values.map((item) => <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>)}
      </select>
    </label>
  );
}

function TotalRow({ label, value, strong = false, tone }) {
  const color = tone === 'danger' ? 'text-danger' : strong ? 'text-slate-950' : 'text-slate-700';
  return (
    <div className={`flex items-center justify-between ${strong ? 'border-t border-slate-200 pt-3 text-base font-black' : 'font-semibold'}`}>
      <span className="text-slate-600">{label}</span>
      <span className={color}>{value}</span>
    </div>
  );
}
