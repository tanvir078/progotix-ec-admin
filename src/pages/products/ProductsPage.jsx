import { Link } from 'react-router-dom';
import { router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FilterBar from '@/components/ui/FilterBar';
import { Package, FolderTree, AlertTriangle, DollarSign, Edit, Trash2, Eye, Copy, Power } from 'lucide-react';

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

export default function ProductsPage({ products = [], categories = [], filters = {}, status }) {
    const [query, setQuery] = useState(filters.q ?? '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category_id ?? '');
    const [stockFilter, setStockFilter] = useState(filters.status ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.product_status ?? '');

    const applyFilters = (event) => {
        event.preventDefault();
        router.get('/admin/products', {
            q: query,
            category_id: categoryFilter,
            status: stockFilter,
            product_status: statusFilter,
        }, { preserveState: true });
    };

    const resetFilters = () => {
        setQuery('');
        setCategoryFilter('');
        setStockFilter('');
        setStatusFilter('');
        router.get('/admin/products', {}, { preserveState: true });
    };

    const destroy = (product) => {
        if (window.confirm(`Delete ${product.name}?`)) {
            router.delete(`/admin/products/${product.id}`, { preserveScroll: true });
        }
    };

    const toggleStatus = (product) => {
        router.patch(`/admin/products/${product.id}/status`, 
            { is_active: !product.is_active }, 
            { preserveScroll: true }
        );
    };

    const lowStockCount = products.filter((p) => Number(p.stock) <= 10).length;
    const catalogValue = products.reduce((sum, p) => sum + Number(p.price ?? 0), 0);

    return (
        <AdminLayout title="Products">
            {status && (
                <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
                    {status}
                </div>
            )}

            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Products" value={products.length} icon={Package} />
                <StatCard label="Categories" value={categories.length} icon={FolderTree} />
                <StatCard label="Low Stock" value={lowStockCount} icon={AlertTriangle} />
                <StatCard label="Catalog Value" value={money(catalogValue)} icon={DollarSign} />
            </div>

            <AdminCard title="Product Catalog">
                <FilterBar
                    searchValue={query}
                    onSearchChange={setQuery}
                    searchPlaceholder="Search product name, SKU..."
                    filters={[
                        {
                            key: 'category',
                            value: categoryFilter,
                            onChange: setCategoryFilter,
                            placeholder: 'All categories',
                            options: categories.map(cat => ({ value: cat.id, label: cat.name })),
                        },
                        {
                            key: 'stock',
                            value: stockFilter,
                            onChange: setStockFilter,
                            placeholder: 'All stock',
                            options: [
                                { value: 'low_stock', label: 'Low Stock' },
                                { value: 'out_of_stock', label: 'Out of Stock' },
                                { value: 'in_stock', label: 'In Stock' },
                            ],
                        },
                        {
                            key: 'status',
                            value: statusFilter,
                            onChange: setStatusFilter,
                            placeholder: 'All status',
                            options: [
                                { value: 'active', label: 'Active' },
                                { value: 'draft', label: 'Draft' },
                            ],
                        },
                    ]}
                    onApply={applyFilters}
                    onReset={resetFilters}
                    className="md:grid-cols-[1fr_180px_160px_160px_auto]"
                />

                <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">Product</th>
                                    <th className="px-5 py-4">SKU</th>
                                    <th className="px-5 py-4">Category</th>
                                    <th className="px-5 py-4">Stock</th>
                                    <th className="px-5 py-4">Price</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 bg-white">
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                                            No products found.
                                        </td>
                                    </tr>
                                )}

                                {products.map((product) => (
                                    <tr key={product.id} className="transition hover:bg-slate-50">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={product.display_image_url || product.image_url || 'https://placehold.co/80x80?text=PX'}
                                                    alt={product.name}
                                                    className="h-14 w-14 rounded-2xl border border-slate-100 object-cover shadow-sm"
                                                />
                                                <div>
                                                    <p className="font-black text-slate-900">{product.name}</p>
                                                    {product.is_featured && (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-xs font-semibold text-slate-600">
                                            {product.sku || '-'}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                                                {product.category_model?.name ?? product.category ?? 'Uncategorized'}
                                            </span>
                                            {product.brand?.name && (
                                                <p className="mt-1 text-xs font-semibold text-slate-500">{product.brand.name}</p>
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            <StatusBadge value={Number(product.stock) <= 10 ? 'low_stock' : 'in_stock'} />
                                            <p className="mt-1 text-xs font-semibold text-slate-500">{product.stock} units</p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="font-black text-slate-900">{money(product.price)}</p>
                                            {product.discount_price && (
                                                <p className="text-xs font-semibold text-slate-400 line-through">{money(product.discount_price)}</p>
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            <StatusBadge value={product.is_active ? 'active' : 'draft'} />
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleStatus(product)}
                                                    className="rounded-xl bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
                                                    title={product.is_active ? 'Unpublish' : 'Publish'}
                                                >
                                                    <Power className="h-4 w-4" />
                                                </button>
                                                <Link
                                                    to={`/products/${product.id}/edit`}
                                                    className="rounded-xl bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => destroy(product)}
                                                    className="rounded-xl bg-danger-light p-2 text-danger transition hover:bg-danger"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
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
