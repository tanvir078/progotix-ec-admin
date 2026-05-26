import { router } from '@/lib/inertiaCompat';
import { useMemo, useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FormInput from '@/components/ui/FormInput';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { AlertTriangle, ClipboardList, Package, TrendingDown, Warehouse } from 'lucide-react';

const emptyForm = {
  product_id: '',
  type: 'set',
  quantity: '',
  reason: '',
  reference: '',
};

function productLabel(product) {
  const sku = product.sku ? ` (${product.sku})` : '';
  return `${product.name}${sku}`;
}

export default function AdminInventoryPage({
  products = [],
  movements = [],
  metrics = [],
  items = [],
  status,
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const selectedProduct = useMemo(
    () => products.find((product) => String(product.id) === String(form.product_id)),
    [form.product_id, products],
  );

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const reset = () => {
    setForm(emptyForm);
    setErrors({});
  };

  const submit = (event) => {
    event.preventDefault();
    setProcessing(true);

    router.post('/admin/inventory/adjustments', form, {
      preserveScroll: true,
      onError: setErrors,
      onSuccess: reset,
      onFinish: () => setProcessing(false),
    });
  };

  const totalProducts = products.length;
  const lowStock = products.filter((product) => Number(product.stock) > 0 && Number(product.stock) <= 10).length;
  const outOfStock = products.filter((product) => Number(product.stock) <= 0).length;
  const unitsAvailable = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
  const rows = items.length ? items : products;

  return (
    <AdminLayout title="Inventory">
      {status && (
        <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
          {status}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value={metrics[0]?.value ?? totalProducts} icon={Package} />
        <StatCard label="Low Stock" value={metrics[1]?.value ?? lowStock} icon={AlertTriangle} />
        <StatCard label="Out of Stock" value={metrics[2]?.value ?? outOfStock} icon={TrendingDown} />
        <StatCard label="Units Available" value={metrics[3]?.value ?? unitsAvailable} icon={Warehouse} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <AdminCard title="Adjust Stock">
          <form onSubmit={submit} className="space-y-4">
            <Select
              label="Product"
              value={form.product_id}
              onChange={(event) => setField('product_id', event.target.value)}
              error={errors.product_id}
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {productLabel(product)} - Stock: {product.stock}
                </option>
              ))}
            </Select>

            {selectedProduct && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">Current Stock</p>
                <p className="mt-1 text-2xl font-black text-slate-950">{selectedProduct.stock}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {selectedProduct.category_model?.name || selectedProduct.category || 'Uncategorized'}
                  {selectedProduct.brand?.name ? ` / ${selectedProduct.brand.name}` : ''}
                </p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Adjustment Type"
                value={form.type}
                onChange={(event) => setField('type', event.target.value)}
                error={errors.type}
              >
                <option value="set">Set exact stock</option>
                <option value="increase">Increase stock</option>
                <option value="decrease">Decrease stock</option>
              </Select>
              <FormInput
                label={form.type === 'set' ? 'New Stock' : 'Quantity'}
                type="number"
                min="0"
                value={form.quantity}
                onChange={(event) => setField('quantity', event.target.value)}
                error={errors.quantity}
                placeholder="0"
              />
            </div>

            <FormInput
              label="Reference"
              value={form.reference}
              onChange={(event) => setField('reference', event.target.value)}
              error={errors.reference}
              placeholder="PO number, return ID, manual audit"
            />

            <div>
              <label className="mb-1 block text-xs font-black text-slate-600">Reason</label>
              <textarea
                value={form.reason}
                onChange={(event) => setField('reason', event.target.value)}
                className="min-h-24 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Why is stock changing?"
              />
              {errors.reason && <p className="mt-1 text-xs font-bold text-danger">{errors.reason}</p>}
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={processing}>
                {processing ? 'Saving...' : 'Save Adjustment'}
              </Button>
              <Button type="button" variant="secondary" onClick={reset}>
                Reset
              </Button>
            </div>
          </form>
        </AdminCard>

        <AdminCard title="Stock Levels">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">SKU</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Stock</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {rows.map((product) => (
                    <tr key={product.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4 font-black text-slate-900">{product.name}</td>
                      <td className="px-5 py-4 text-xs font-semibold text-slate-500">{product.sku || '-'}</td>
                      <td className="px-5 py-4 font-semibold text-slate-600">{product.category_model?.name || product.category || '-'}</td>
                      <td className="px-5 py-4 font-black">{product.stock}</td>
                      <td className="px-5 py-4"><StatusBadge value={product.status || product.stock_status || (Number(product.stock) <= 0 ? 'out_of_stock' : Number(product.stock) <= 10 ? 'low_stock' : 'in_stock')} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AdminCard>
      </div>

      <AdminCard title="Recent Stock Movements" className="mt-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Quantity</th>
                  <th className="px-5 py-4">Before</th>
                  <th className="px-5 py-4">After</th>
                  <th className="px-5 py-4">Reference</th>
                  <th className="px-5 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {movements.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                      No stock movements yet.
                    </td>
                  </tr>
                )}
                {movements.map((movement) => (
                  <tr key={movement.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-black text-slate-900">{movement.product?.name || `Product #${movement.product_id}`}</p>
                      <p className="text-xs font-semibold text-slate-500">{movement.reason || '-'}</p>
                    </td>
                    <td className="px-5 py-4"><StatusBadge value={movement.type} /></td>
                    <td className="px-5 py-4 font-semibold">{movement.quantity}</td>
                    <td className="px-5 py-4 font-semibold">{movement.previous_stock}</td>
                    <td className="px-5 py-4 font-black">{movement.new_stock}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-500">{movement.reference || '-'}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-500">
                      {movement.created_at ? new Date(movement.created_at).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminCard>
    </AdminLayout>
  );
}
