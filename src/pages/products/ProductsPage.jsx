import { Link } from 'react-router-dom';
import { router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard, StatusBadge } from '@/components/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import FilterBar from '@/components/ui/FilterBar';
import { Package, FolderTree, AlertTriangle, DollarSign, Edit, Trash2, Power, Plus } from 'lucide-react';

function money(value) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

export default function ProductsPage({ data = [], products: productData = [], meta = {}, categories = [], filters = {}, status }) {
    const products = Array.isArray(data) && data.length > 0 ? data : Array.isArray(productData) ? productData : [];
    const safeFilters = filters && !Array.isArray(filters) ? filters : {};
    const [query, setQuery] = useState(safeFilters.search ?? '');
    const [categoryFilter, setCategoryFilter] = useState(safeFilters.category_id ?? '');
    const [statusFilter, setStatusFilter] = useState(safeFilters.status ?? '');
    const [sort, setSort] = useState(safeFilters.sort ?? 'created_at');
    const [order, setOrder] = useState(safeFilters.order ?? 'desc');
    const [selectedProducts, setSelectedProducts] = useState([]);

    const applyFilters = (event) => {
        event.preventDefault();
        router.get('/admin/products', {
            search: query,
            category_id: categoryFilter,
            status: statusFilter,
            sort,
            order,
        }, { preserveState: true });
    };

    const resetFilters = () => {
        setQuery('');
        setCategoryFilter('');
        setStatusFilter('');
        setSort('created_at');
        setOrder('desc');
        router.get('/admin/products', {}, { preserveState: true });
    };

    const destroy = (product) => {
        if (window.confirm(`Delete ${product.name}?`)) {
            router.delete(`/admin/products/${product.id}`, { preserveScroll: true });
        }
    };

    const toggleStatus = (product) => {
        const newStatus = product.status === 'active' ? 'inactive' : 'active';
        router.put(`/admin/products/${product.id}`, 
            { status: newStatus }, 
            { preserveScroll: true }
        );
    };

    const bulkUpdateStatus = (newStatus) => {
        if (selectedProducts.length === 0) return;
        if (window.confirm(`Update ${selectedProducts.length} products to ${newStatus}?`)) {
            router.post('/admin/products/bulk-status', 
                { product_ids: selectedProducts, status: newStatus }, 
                { preserveScroll: true }
            );
            setSelectedProducts([]);
        }
    };

    const toggleSelectProduct = (productId) => {
        setSelectedProducts(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.map(p => p.id));
        }
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

            <AdminCard 
                title="Product Catalog" 
                action={
                    <Link to="/admin/products/new" className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-black text-white transition hover:bg-primary-dark">
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Link>
                }
            >
                {selectedProducts.length > 0 && (
                    <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                        <span className="text-sm font-bold text-slate-700">{selectedProducts.length} selected</span>
                        <button
                            type="button"
                            onClick={() => bulkUpdateStatus('active')}
                            className="rounded-lg bg-success px-3 py-1.5 text-xs font-black text-white transition hover:bg-success-dark"
                        >
                            Activate All
                        </button>
                        <button
                            type="button"
                            onClick={() => bulkUpdateStatus('inactive')}
                            className="rounded-lg bg-danger px-3 py-1.5 text-xs font-black text-white transition hover:bg-danger-dark"
                        >
                            Deactivate All
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedProducts([])}
                            className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-black text-slate-700 transition hover:bg-slate-300"
                        >
                            Clear Selection
                        </button>
                    </div>
                )}

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
                            key: 'status',
                            value: statusFilter,
                            onChange: setStatusFilter,
                            placeholder: 'All status',
                            options: [
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' },
                            ],
                        },
                    ]}
                    onApply={applyFilters}
                    onReset={resetFilters}
                    className="md:grid-cols-[1fr_180px_160px_auto]"
                />

                <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4 w-12">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.length === products.length && products.length > 0}
                                            onChange={toggleSelectAll}
                                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                        />
                                    </th>
                                    <th className="px-5 py-4">Product</th>
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
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(product.id)}
                                                onChange={() => toggleSelectProduct(product.id)}
                                                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                            />
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={product.image_url || 'https://placehold.co/80x80?text=PX'}
                                                    alt={product.name}
                                                    className="h-14 w-14 rounded-2xl border border-slate-100 object-cover shadow-sm"
                                                />
                                                <div>
                                                    <p className="font-black text-slate-900">{product.name}</p>
                                                    {(product.sizes || product.colors) && (
                                                        <p className="mt-1 text-xs font-semibold text-slate-500">
                                                            {[product.sizes && `Sizes: ${Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes}`, product.colors && `Colors: ${Array.isArray(product.colors) ? product.colors.join(', ') : product.colors}`].filter(Boolean).join(' | ')}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                                                {product.category?.name ?? product.category ?? 'Uncategorized'}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <StatusBadge value={Number(product.stock) <= 10 ? 'low_stock' : 'in_stock'} />
                                            <p className="mt-1 text-xs font-semibold text-slate-500">{product.stock} units</p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="font-black text-slate-900">{money(product.price)}</p>
                                            {product.compare_price && Number(product.compare_price) > Number(product.price) && (
                                                <p className="text-xs font-semibold text-slate-400 line-through">{money(product.compare_price)}</p>
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            <StatusBadge value={product.status === 'active' ? 'active' : 'draft'} />
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleStatus(product)}
                                                    className="rounded-xl bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
                                                    title={product.status === 'active' ? 'Deactivate' : 'Activate'}
                                                >
                                                    <Power className="h-4 w-4" />
                                                </button>
                                                <Link
                                                    to={`/admin/products/${product.id}/edit`}
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

                {meta && meta.last_page > 1 && (
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-600">
                            Showing {products.length} of {meta.total} products
                        </p>
                        <div className="flex gap-2">
                            {meta.current_page > 1 && (
                                <button
                                    onClick={() => router.get('/admin/products', { ...safeFilters, page: meta.current_page - 1 })}
                                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700 transition hover:bg-slate-200"
                                >
                                    Previous
                                </button>
                            )}
                            {meta.current_page < meta.last_page && (
                                <button
                                    onClick={() => router.get('/admin/products', { ...safeFilters, page: meta.current_page + 1 })}
                                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-black text-white transition hover:bg-primary-dark"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </AdminCard>
        </AdminLayout>
    );
}
