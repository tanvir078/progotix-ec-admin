import { Link, router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import PageTabs from '@/components/ui/PageTabs';
import { Activity, CreditCard, DollarSign, Landmark, RotateCcw, ShieldCheck, Wallet } from 'lucide-react';

function money(value) {
  return `$${Number(value ?? 0).toFixed(2)}`;
}

export default function AdminPaymentsPage({
  payments = [],
  refunds = [],
  events = [],
  settlements = [],
  summary = {},
  gateways = [],
  status,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [refundForm, setRefundForm] = useState({ paymentId: '', amount: '', reason: '' });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const markPayment = (payment, nextStatus) => {
    router.patch(`/admin/payments/${payment.id}/status`, { status: nextStatus }, { preserveScroll: true });
  };

  const toggleGateway = (gateway) => {
    router.patch(`/admin/payment-gateways/${gateway.id}`, {
      enabled: !gateway.enabled,
      mode: gateway.mode || (gateway.key === 'cod' ? 'manual' : 'test'),
    }, { preserveScroll: true });
  };

  const submitRefund = (event) => {
    event.preventDefault();
    setProcessing(true);
    router.post(`/admin/payments/${refundForm.paymentId}/refunds`, {
      amount: refundForm.amount,
      reason: refundForm.reason,
    }, {
      preserveScroll: true,
      onError: setErrors,
      onSuccess: () => {
        setRefundForm({ paymentId: '', amount: '', reason: '' });
        setErrors({});
      },
      onFinish: () => setProcessing(false),
    });
  };

  const tabs = [
    { value: 'overview', label: 'Overview', icon: Wallet },
    { value: 'transactions', label: 'Transactions', icon: CreditCard, count: payments.length },
    { value: 'refunds', label: 'Refunds', icon: RotateCcw, count: refunds.length },
    { value: 'gateways', label: 'Gateways', icon: ShieldCheck, count: gateways.length },
    { value: 'events', label: 'Events', icon: Activity, count: events.length },
    { value: 'payouts', label: 'Payouts', icon: Landmark, count: settlements.length },
  ];

  return (
    <AdminLayout title="Payments">
      {status && <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">{status}</div>}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Transactions" value={summary.totalPayments ?? payments.length} icon={CreditCard} />
        <StatCard label="Paid" value={summary.paid ?? 0} icon={Wallet} />
        <StatCard label="Gross" value={money(summary.totalAmount)} icon={DollarSign} />
        <StatCard label="Fees" value={money(summary.fees)} icon={DollarSign} />
        <StatCard label="Refunded" value={money(summary.refundedAmount)} icon={RotateCcw} />
      </div>

      <PageTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <AdminCard title="Gateway Health">
            <div className="grid gap-4 md:grid-cols-3">
              {gateways.map((gateway) => <GatewayCard key={gateway.key} gateway={gateway} onToggle={() => toggleGateway(gateway)} />)}
            </div>
          </AdminCard>
          <AdminCard title="Payment Mix">
            <div className="space-y-3">
              {['cod', 'stripe', 'paypal'].map((gateway) => (
                <div key={gateway} className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <span className="font-black uppercase text-slate-700">{gateway}</span>
                  <span className="text-2xl font-black text-primary">{payments.filter((payment) => (payment.gateway || payment.provider) === gateway).length}</span>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      )}

      {activeTab === 'transactions' && (
        <AdminCard title={`Transactions (${payments.length})`}>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Gateway</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Reference</th>
                    <th className="px-5 py-4 text-right">Gross</th>
                    <th className="px-5 py-4 text-right">Net</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {payments.length === 0 && <tr><td colSpan="8" className="px-5 py-10 text-center text-sm font-bold text-slate-400">No payments found.</td></tr>}
                  {payments.map((payment) => (
                    <tr key={payment.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <Link href={`/admin/orders/${payment.order_id}`} className="font-black text-primary hover:underline">
                          {payment.order?.display_number || `#${payment.order_id}`}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">{payment.order?.customer_snapshot?.name || payment.order?.user?.name || 'Customer'}</p>
                        <p className="text-xs text-slate-500">{payment.order?.customer_snapshot?.email || payment.order?.user?.email || '-'}</p>
                      </td>
                      <td className="px-5 py-4 font-black uppercase text-slate-700">{payment.gateway || payment.provider}</td>
                      <td className="px-5 py-4"><StatusBadge value={payment.status} /></td>
                      <td className="max-w-xs truncate px-5 py-4 text-xs font-semibold text-slate-500">{payment.transaction_id || payment.provider_payment_id || payment.provider_session_id || '-'}</td>
                      <td className="px-5 py-4 text-right font-black">{money(payment.amount)}</td>
                      <td className="px-5 py-4 text-right font-black">{money(payment.net_amount || payment.amount)}</td>
                      <td className="px-5 py-4 text-right">
                        {(payment.gateway || payment.provider) === 'cod' && (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="success" onClick={() => markPayment(payment, 'paid')}>Paid</Button>
                            <Button size="sm" variant="secondary" onClick={() => markPayment(payment, 'pending')}>Unpaid</Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AdminCard>
      )}

      {activeTab === 'refunds' && (
        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <AdminCard title="Process Refund">
            <form onSubmit={submitRefund} className="space-y-4">
              <FormInput label="Payment ID" type="number" value={refundForm.paymentId} onChange={(event) => setRefundForm((current) => ({ ...current, paymentId: event.target.value }))} error={errors.payment_id} />
              <FormInput label="Refund Amount" type="number" step="0.01" value={refundForm.amount} onChange={(event) => setRefundForm((current) => ({ ...current, amount: event.target.value }))} error={errors.amount} />
              <textarea value={refundForm.reason} onChange={(event) => setRefundForm((current) => ({ ...current, reason: event.target.value }))} placeholder="Refund reason" className="min-h-24 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              <Button type="submit" variant="danger" disabled={processing} className="w-full">{processing ? 'Processing...' : 'Process Refund'}</Button>
            </form>
          </AdminCard>
          <RefundTable refunds={refunds} />
        </div>
      )}

      {activeTab === 'gateways' && (
        <div className="grid gap-4 lg:grid-cols-3">
          {gateways.map((gateway) => <GatewayCard key={gateway.key} gateway={gateway} onToggle={() => toggleGateway(gateway)} expanded />)}
        </div>
      )}

      {activeTab === 'events' && (
        <AdminCard title={`Payment Events (${events.length})`}>
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-slate-900">{event.type}</p>
                  <StatusBadge value={event.status || 'received'} />
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-600">{event.message || '-'}</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">{event.gateway || '-'} · {new Date(event.created_at).toLocaleString()}</p>
              </div>
            ))}
            {events.length === 0 && <p className="text-sm font-semibold text-slate-500">No payment events yet.</p>}
          </div>
        </AdminCard>
      )}

      {activeTab === 'payouts' && (
        <AdminCard title="Payouts / Settlements">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
                <tr><th className="px-5 py-4">Gateway</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Gross</th><th className="px-5 py-4 text-right">Fees</th><th className="px-5 py-4 text-right">Net</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {settlements.length === 0 && <tr><td colSpan="5" className="px-5 py-10 text-center text-sm font-bold text-slate-400">No payouts synced yet.</td></tr>}
                {settlements.map((settlement) => (
                  <tr key={settlement.id}><td className="px-5 py-4 font-black uppercase">{settlement.gateway}</td><td className="px-5 py-4"><StatusBadge value={settlement.status} /></td><td className="px-5 py-4 text-right">{money(settlement.gross_amount)}</td><td className="px-5 py-4 text-right">{money(settlement.fee_amount)}</td><td className="px-5 py-4 text-right font-black">{money(settlement.net_amount)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}
    </AdminLayout>
  );
}

function GatewayCard({ gateway, onToggle, expanded = false }) {
  return (
    <AdminCard title={gateway.name}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <StatusBadge value={gateway.status} />
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase text-slate-500">{gateway.mode}</span>
        </div>
        <p className="text-sm font-semibold leading-6 text-slate-600">{gateway.description}</p>
        {expanded && (
          <div className="rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-500">
            Configured: {gateway.configured ? 'Yes' : 'No'}<br />
            Last webhook: {gateway.last_webhook_at ? new Date(gateway.last_webhook_at).toLocaleString() : 'Never'}
          </div>
        )}
        <Button variant={gateway.enabled ? 'secondary' : 'primary'} onClick={onToggle} className="w-full">
          {gateway.enabled ? 'Disable' : 'Enable'}
        </Button>
      </div>
    </AdminCard>
  );
}

function RefundTable({ refunds }) {
  return (
    <AdminCard title={`Refund History (${refunds.length})`}>
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
            <tr><th className="px-5 py-4">Order</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Reason</th><th className="px-5 py-4 text-right">Amount</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {refunds.length === 0 && <tr><td colSpan="4" className="px-5 py-10 text-center text-sm font-bold text-slate-400">No refunds yet.</td></tr>}
            {refunds.map((refund) => (
              <tr key={refund.id}><td className="px-5 py-4 font-black text-primary">#{refund.order_id}</td><td className="px-5 py-4"><StatusBadge value={refund.status} /></td><td className="px-5 py-4 text-slate-600">{refund.reason || '-'}</td><td className="px-5 py-4 text-right font-black">{money(refund.amount)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}
