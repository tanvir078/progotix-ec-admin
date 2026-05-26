import { Link, router } from '@/lib/inertiaCompat';
import { useMemo, useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FormInput from '@/components/ui/FormInput';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { DollarSign, Receipt, RotateCcw, ShieldCheck } from 'lucide-react';

function money(value) {
  return `$${Number(value ?? 0).toFixed(2)}`;
}

export default function AdminRefundsPage({
  refunds = [],
  eligibleOrders = [],
  metrics = [],
  status,
}) {
  const [form, setForm] = useState({ order_id: '', amount: '', reason: '' });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const selectedOrder = useMemo(
    () => eligibleOrders.find((order) => String(order.id) === String(form.order_id)),
    [eligibleOrders, form.order_id],
  );
  const maxRefund = selectedOrder
    ? Number(selectedOrder.total_amount || 0) - Number(selectedOrder.refunded_amount || 0)
    : 0;

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = (event) => {
    event.preventDefault();
    setProcessing(true);
    router.post(`/admin/orders/${form.order_id}/refund`, {
      amount: form.amount,
      reason: form.reason,
    }, {
      preserveScroll: true,
      onError: setErrors,
      onSuccess: () => {
        setForm({ order_id: '', amount: '', reason: '' });
        setErrors({});
      },
      onFinish: () => setProcessing(false),
    });
  };

  const refundedAmount = refunds.reduce((sum, refund) => sum + Number(refund.amount || 0), 0);
  const succeededCount = refunds.filter((refund) => ['succeeded', 'paid', 'completed'].includes(refund.status)).length;
  const stripeCount = refunds.filter((refund) => refund.payment?.provider === 'stripe').length;

  return (
    <AdminLayout title="Refunds">
      {status && (
        <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
          {status}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Refunds" value={metrics[0]?.value ?? refunds.length} icon={RotateCcw} />
        <StatCard label="Refunded Amount" value={metrics[1]?.value ?? money(refundedAmount)} icon={DollarSign} />
        <StatCard label="Succeeded" value={succeededCount} icon={ShieldCheck} />
        <StatCard label="Eligible Orders" value={eligibleOrders.length} icon={Receipt} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <AdminCard title="Create Refund">
          <form onSubmit={submit} className="space-y-4">
            <Select
              label="Paid Order"
              value={form.order_id}
              onChange={(event) => {
                const order = eligibleOrders.find((item) => String(item.id) === event.target.value);
                setForm((current) => ({
                  ...current,
                  order_id: event.target.value,
                  amount: order ? String(Number(order.total_amount || 0) - Number(order.refunded_amount || 0)) : '',
                }));
              }}
              error={errors.order_id}
            >
              <option value="">Select order</option>
              {eligibleOrders.map((order) => (
                <option key={order.id} value={order.id}>
                  #{order.id} - {order.user?.name || 'Customer'} - {money(Number(order.total_amount || 0) - Number(order.refunded_amount || 0))}
                </option>
              ))}
            </Select>

            {selectedOrder && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-slate-500">Order Total</span>
                  <span className="font-black text-slate-900">{money(selectedOrder.total_amount)}</span>
                </div>
                <div className="mt-2 flex justify-between gap-4">
                  <span className="font-semibold text-slate-500">Already Refunded</span>
                  <span className="font-black text-danger">{money(selectedOrder.refunded_amount)}</span>
                </div>
                <div className="mt-2 flex justify-between gap-4">
                  <span className="font-semibold text-slate-500">Refundable</span>
                  <span className="font-black text-primary">{money(maxRefund)}</span>
                </div>
              </div>
            )}

            <FormInput
              label="Refund Amount"
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(event) => setField('amount', event.target.value)}
              error={errors.amount}
              placeholder="0.00"
            />
            <div>
              <label className="mb-1 block text-xs font-black text-slate-600">Reason</label>
              <textarea
                value={form.reason}
                onChange={(event) => setField('reason', event.target.value)}
                className="min-h-24 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Refund reason"
              />
              {errors.reason && <p className="mt-1 text-xs font-bold text-danger">{errors.reason}</p>}
            </div>
            {errors.request && <p className="text-sm font-bold text-danger">{errors.request}</p>}
            <Button type="submit" variant="danger" disabled={processing || !form.order_id} className="w-full">
              {processing ? 'Processing...' : 'Process Refund'}
            </Button>
          </form>
        </AdminCard>

        <AdminCard title={`Refund History (${refunds.length})`}>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Provider</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Reason</th>
                    <th className="px-5 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {refunds.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                        No refunds recorded.
                      </td>
                    </tr>
                  )}
                  {refunds.map((refund) => (
                    <tr key={refund.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <Link href={`/admin/orders/${refund.order_id}`} className="font-black text-primary hover:underline">
                          #{refund.order_id}
                        </Link>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-700">{refund.order?.user?.name || 'Customer'}</td>
                      <td className="px-5 py-4 text-xs font-black uppercase text-slate-500">{refund.payment?.provider || 'manual'}</td>
                      <td className="px-5 py-4"><StatusBadge value={refund.status} /></td>
                      <td className="max-w-xs px-5 py-4 text-slate-600">{refund.reason || '-'}</td>
                      <td className="px-5 py-4 text-right font-black">{money(refund.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">Stripe Refunds</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{stripeCount}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">Manual/COD Refunds</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{refunds.length - stripeCount}</p>
            </div>
          </div>
        </AdminCard>
      </div>
    </AdminLayout>
  );
}
