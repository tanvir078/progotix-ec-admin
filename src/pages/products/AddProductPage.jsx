import { router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard } from '@/components/AdminLayout';
import FormInput from '@/components/ui/FormInput';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Package, DollarSign, Box, Image as ImageIcon, Truck, Settings, Save, RotateCcw } from 'lucide-react';

const emptyForm = {
    name: '',
    sku: '',
    description: '',
    price: '',
    sale_price: '',
    tax: '',
    discount: '',
    stock: '',
    low_stock_alert: '',
    stock_status: 'in_stock',
    image_url: '',
    image: null,
    gallery_images: null,
    weight: '',
    size: '',
    colors: '',
    fabric: '',
    fit: '',
    occasion: '',
    care_instruction: '',
    gender: '',
    age_group: '',
    season: '',
    delivery_charge: '',
    category_id: '',
    brand_id: '',
    meta_title: '',
    meta_description: '',
    slug: '',
    is_active: true,
    is_featured: false,
    parent_category_id: '',
};

function flattenCategoryOptions(categories, parentId = null, level = 0) {
    return categories
        .filter((category) => Number(category.parent_id || 0) === Number(parentId || 0))
        .flatMap((category) => [
            { ...category, tree_level: level },
            ...flattenCategoryOptions(categories, category.id, level + 1),
        ]);
}

export default function AddProductPage({ categories = [], brands = [], status }) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

    const resetForm = () => {
        setForm(emptyForm);
        setErrors({});
    };

    const handleCategoryChange = (value) => {
        const selected = categories.find((category) => String(category.id) === value);
        setField('category_id', value);
        setField('category', selected?.name ?? '');
    };

    const submit = (event) => {
        event.preventDefault();
        setProcessing(true);

        const data = { ...form };
        if (!data.image) delete data.image;
        if (!data.gallery_images) delete data.gallery_images;
        delete data.parent_category_id;

        router.post('/admin/products', data, {
            forceFormData: true,
            preserveScroll: true,
            onError: setErrors,
            onSuccess: () => router.get('/admin/products'),
            onFinish: () => setProcessing(false),
            reload: false,
        });
    };

    const categoryOptions = flattenCategoryOptions(categories);

    return (
        <AdminLayout 
            title="Add Product" 
            actions={
                <button type="button" onClick={() => router.get('/admin/products')} className="rounded-xl bg-primary px-4 py-2 text-sm font-black text-white">
                    Product List
                </button>
            }
        >
            {status && (
                <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <AdminCard 
                        title="Basic Information" 
                        icon={<Package className="h-5 w-5 text-slate-400" />}
                    >
                        <div className="space-y-4">
                            <FormInput
                                label="Product Name"
                                value={form.name}
                                onChange={(e) => setField('name', e.target.value)}
                                error={errors.name}
                                placeholder="Enter product name"
                                required
                            />
                            <FormInput
                                label="SKU"
                                value={form.sku}
                                onChange={(e) => setField('sku', e.target.value)}
                                error={errors.sku}
                                placeholder="Enter SKU code"
                            />
                            <Select
                                label="Product Category"
                                value={form.category_id}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                error={errors.category_id}
                            >
                                <option value="">Select category</option>
                                {categoryOptions.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {'--'.repeat(category.tree_level)} {category.name}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                label="Brand"
                                value={form.brand_id}
                                onChange={(e) => setField('brand_id', e.target.value)}
                                error={errors.brand_id}
                            >
                                <option value="">Select Brand</option>
                                {brands?.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </Select>
                            <div>
                                <label className="mb-1 block text-xs font-black text-slate-600">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setField('description', e.target.value)}
                                    className="min-h-28 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="Enter product description"
                                />
                                {errors.description && <p className="mt-1 text-xs font-bold text-danger">{errors.description}</p>}
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard 
                        title="Pricing" 
                        icon={<DollarSign className="h-5 w-5 text-slate-400" />}
                    >
                        <div className="space-y-4">
                            <FormInput
                                label="Regular Price"
                                type="number"
                                step="0.01"
                                value={form.price}
                                onChange={(e) => setField('price', e.target.value)}
                                error={errors.price}
                                placeholder="0.00"
                                required
                            />
                            <FormInput
                                label="Sale Price"
                                type="number"
                                step="0.01"
                                value={form.sale_price}
                                onChange={(e) => setField('sale_price', e.target.value)}
                                error={errors.sale_price}
                                placeholder="0.00"
                            />
                            <FormInput
                                label="Tax (%)"
                                type="number"
                                step="0.01"
                                value={form.tax}
                                onChange={(e) => setField('tax', e.target.value)}
                                error={errors.tax}
                                placeholder="0"
                            />
                            <FormInput
                                label="Discount (%)"
                                type="number"
                                step="0.01"
                                value={form.discount}
                                onChange={(e) => setField('discount', e.target.value)}
                                error={errors.discount}
                                placeholder="0"
                            />
                        </div>
                    </AdminCard>

                    <AdminCard 
                        title="Inventory" 
                        icon={<Box className="h-5 w-5 text-slate-400" />}
                    >
                        <div className="space-y-4">
                            <FormInput
                                label="Stock Quantity"
                                type="number"
                                value={form.stock}
                                onChange={(e) => setField('stock', e.target.value)}
                                error={errors.stock}
                                placeholder="0"
                                required
                            />
                            <FormInput
                                label="Low Stock Alert"
                                type="number"
                                value={form.low_stock_alert}
                                onChange={(e) => setField('low_stock_alert', e.target.value)}
                                error={errors.low_stock_alert}
                                placeholder="10"
                            />
                            <Select
                                label="Stock Status"
                                value={form.stock_status}
                                onChange={(e) => setField('stock_status', e.target.value)}
                                error={errors.stock_status}
                            >
                                <option value="in_stock">In Stock</option>
                                <option value="low_stock">Low Stock</option>
                                <option value="out_of_stock">Out of Stock</option>
                            </Select>
                        </div>
                    </AdminCard>

                    <AdminCard 
                        title="Media" 
                        icon={<ImageIcon className="h-5 w-5 text-slate-400" />}
                    >
                        <div className="space-y-4">
                            <FormInput
                                label="Main Image URL"
                                type="url"
                                value={form.image_url}
                                onChange={(e) => setField('image_url', e.target.value)}
                                error={errors.image_url}
                                placeholder="https://example.com/image.jpg"
                            />
                            <div>
                                <label className="mb-1 block text-xs font-black text-slate-600">Upload Main Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setField('image', e.target.files?.[0] ?? null)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold file:mr-3 file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-black file:text-white"
                                />
                                {errors.image && <p className="mt-1 text-xs font-bold text-danger">{errors.image}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-black text-slate-600">Gallery Images</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => setField('gallery_images', e.target.files ?? null)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold file:mr-3 file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-black file:text-slate-700"
                                />
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard 
                        title="Fashion Attributes" 
                        icon={<Settings className="h-5 w-5 text-slate-400" />}
                    >
                        <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormInput
                                    label="Available Sizes"
                                    value={form.size}
                                    onChange={(e) => setField('size', e.target.value)}
                                    error={errors.size}
                                    placeholder="S, M, L, XL"
                                />
                                <FormInput
                                    label="Available Colors"
                                    value={form.colors}
                                    onChange={(e) => setField('colors', e.target.value)}
                                    error={errors.colors}
                                    placeholder="Black, White, Navy"
                                />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormInput
                                    label="Fabric / Material"
                                    value={form.fabric}
                                    onChange={(e) => setField('fabric', e.target.value)}
                                    error={errors.fabric}
                                    placeholder="Premium cotton"
                                />
                                <Select
                                    label="Fit"
                                    value={form.fit}
                                    onChange={(e) => setField('fit', e.target.value)}
                                    error={errors.fit}
                                >
                                    <option value="">Select fit</option>
                                    <option value="Regular fit">Regular fit</option>
                                    <option value="Slim fit">Slim fit</option>
                                    <option value="Relaxed fit">Relaxed fit</option>
                                    <option value="Oversized fit">Oversized fit</option>
                                </Select>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <Select
                                    label="Gender"
                                    value={form.gender}
                                    onChange={(e) => setField('gender', e.target.value)}
                                    error={errors.gender}
                                >
                                    <option value="">Select gender</option>
                                    <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                    <option value="Kids">Kids</option>
                                    <option value="Unisex">Unisex</option>
                                </Select>
                                <Select
                                    label="Age Group"
                                    value={form.age_group}
                                    onChange={(e) => setField('age_group', e.target.value)}
                                    error={errors.age_group}
                                >
                                    <option value="">Select age group</option>
                                    <option value="Adult">Adult</option>
                                    <option value="Teen">Teen</option>
                                    <option value="Kids">Kids</option>
                                    <option value="Baby">Baby</option>
                                </Select>
                                <Select
                                    label="Season"
                                    value={form.season}
                                    onChange={(e) => setField('season', e.target.value)}
                                    error={errors.season}
                                >
                                    <option value="">Select season</option>
                                    <option value="All Season">All Season</option>
                                    <option value="Summer">Summer</option>
                                    <option value="Winter">Winter</option>
                                    <option value="Eid Collection">Eid Collection</option>
                                    <option value="New Arrival">New Arrival</option>
                                </Select>
                            </div>
                            <FormInput
                                label="Occasion"
                                value={form.occasion}
                                onChange={(e) => setField('occasion', e.target.value)}
                                error={errors.occasion}
                                placeholder="Casual, office, party"
                            />
                            <div>
                                <label className="mb-1 block text-xs font-black text-slate-600">Care Instruction</label>
                                <textarea
                                    value={form.care_instruction}
                                    onChange={(e) => setField('care_instruction', e.target.value)}
                                    className="min-h-20 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="Machine wash cold, do not bleach..."
                                />
                                {errors.care_instruction && <p className="mt-1 text-xs font-bold text-danger">{errors.care_instruction}</p>}
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard 
                        title="Shipping" 
                        icon={<Truck className="h-5 w-5 text-slate-400" />}
                    >
                        <div className="space-y-4">
                            <FormInput
                                label="Weight (kg)"
                                type="number"
                                step="0.01"
                                value={form.weight}
                                onChange={(e) => setField('weight', e.target.value)}
                                error={errors.weight}
                                placeholder="0.00"
                            />
                            <FormInput
                                label="Delivery Charge"
                                type="number"
                                step="0.01"
                                value={form.delivery_charge}
                                onChange={(e) => setField('delivery_charge', e.target.value)}
                                error={errors.delivery_charge}
                                placeholder="0.00"
                            />
                        </div>
                    </AdminCard>

                    <AdminCard 
                        title="SEO" 
                        icon={<Settings className="h-5 w-5 text-slate-400" />}
                    >
                        <div className="space-y-4">
                            <FormInput
                                label="Meta Title"
                                value={form.meta_title}
                                onChange={(e) => setField('meta_title', e.target.value)}
                                error={errors.meta_title}
                                placeholder="SEO title"
                            />
                            <div>
                                <label className="mb-1 block text-xs font-black text-slate-600">Meta Description</label>
                                <textarea
                                    value={form.meta_description}
                                    onChange={(e) => setField('meta_description', e.target.value)}
                                    className="min-h-20 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="SEO description"
                                />
                                {errors.meta_description && <p className="mt-1 text-xs font-bold text-danger">{errors.meta_description}</p>}
                            </div>
                            <FormInput
                                label="Slug"
                                value={form.slug}
                                onChange={(e) => setField('slug', e.target.value)}
                                error={errors.slug}
                                placeholder="product-url-slug"
                            />
                        </div>
                    </AdminCard>
                </div>

                <AdminCard title="Status">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={(e) => setField('is_active', e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm font-semibold text-slate-700">Active</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_featured}
                                    onChange={(e) => setField('is_featured', e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm font-semibold text-slate-700">Featured Product</span>
                            </label>
                        </div>
                    </div>
                </AdminCard>

                <div className="flex gap-3">
                    <Button type="submit" disabled={processing} className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        {processing ? 'Saving...' : 'Create Product'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={resetForm} className="flex items-center gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Reset
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
