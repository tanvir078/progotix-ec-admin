import { router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard } from '@/components/AdminLayout';
import FormInput from '@/components/ui/FormInput';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { ArrowLeft, Save, X, Package, DollarSign, Box, Star, MessageSquare, Image, Link } from 'lucide-react';

const emptyForm = {
    name: '',
    description: '',
    price: '',
    image_url: '',
    image: null,
    stock: '',
    category_id: '',
    brand_id: '',
    category: '',
    rating: '',
    reviews_count: '',
    parent_category_id: '',
};

export default function EditProductPage({ product = {}, categories = [], brands = [], status }) {
    const [form, setForm] = useState({
        name: product.name ?? '',
        description: product.description ?? '',
        price: product.price ?? '',
        image_url: product.image_url ?? '',
        image: null,
        stock: product.stock ?? '',
        category_id: product.category_id ?? '',
        brand_id: product.brand_id ?? '',
        category: product.category ?? '',
        rating: product.rating ?? '',
        reviews_count: product.reviews_count ?? '',
        parent_category_id: product.category_model?.parent_id ?? '',
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

    const handleParentCategoryChange = (value) => {
        setField('parent_category_id', value);
        setField('category_id', '');
        setField('category', '');
    };

    const handleSubCategoryChange = (value) => {
        const selected = categories.find((category) => String(category.id) === value);
        setField('category_id', value);
        setField('category', selected?.name ?? '');
    };

    const submit = (event) => {
        event.preventDefault();
        setProcessing(true);

        const data = { ...form, _method: 'put' };
        if (!data.image) delete data.image;

        router.post(`/admin/products/${product.id}`, data, {
            forceFormData: true,
            preserveScroll: true,
            onError: setErrors,
            onSuccess: () => router.get('/admin/products'),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout 
            title="Edit Product" 
            actions={
                <Button variant="secondary" onClick={() => router.get('/admin/products')} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Products
                </Button>
            }
        >
            {status && (
                <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
                    {status}
                </div>
            )}

            <div className="max-w-4xl">
                <AdminCard title={`Edit: ${product.name}`} icon={<Package className="h-5 w-5 text-slate-400" />}>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <AdminCard title="Basic Information" className="border-slate-200">
                                <div className="space-y-4">
                                    <FormInput
                                        label="Product Name"
                                        value={form.name}
                                        onChange={(e) => setField('name', e.target.value)}
                                        error={errors.name}
                                        placeholder="Enter product name"
                                    />
                                    <FormInput
                                        label="Price"
                                        type="number"
                                        step="0.01"
                                        value={form.price}
                                        onChange={(e) => setField('price', e.target.value)}
                                        error={errors.price}
                                        placeholder="0.00"
                                        icon={<DollarSign className="h-4 w-4 text-slate-400" />}
                                    />
                                    <FormInput
                                        label="Stock"
                                        type="number"
                                        value={form.stock}
                                        onChange={(e) => setField('stock', e.target.value)}
                                        error={errors.stock}
                                        placeholder="0"
                                        icon={<Box className="h-4 w-4 text-slate-400" />}
                                    />
                                </div>
                            </AdminCard>

                            <AdminCard title="Rating & Reviews" className="border-slate-200">
                                <div className="space-y-4">
                                    <FormInput
                                        label="Rating"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={form.rating}
                                        onChange={(e) => setField('rating', e.target.value)}
                                        error={errors.rating}
                                        placeholder="0.0 - 5.0"
                                        icon={<Star className="h-4 w-4 text-slate-400" />}
                                    />
                                    <FormInput
                                        label="Reviews Count"
                                        type="number"
                                        value={form.reviews_count}
                                        onChange={(e) => setField('reviews_count', e.target.value)}
                                        error={errors.reviews_count}
                                        placeholder="0"
                                        icon={<MessageSquare className="h-4 w-4 text-slate-400" />}
                                    />
                                </div>
                            </AdminCard>
                        </div>

                        <AdminCard title="Category" className="border-slate-200">
                            <div className="grid gap-4 lg:grid-cols-3">
                                <Select
                                    label="Parent Category"
                                    value={form.parent_category_id}
                                    onChange={(e) => handleParentCategoryChange(e.target.value)}
                                    error={errors.parent_category_id}
                                >
                                    <option value="">Select Parent Category</option>
                                    {categories.filter(c => !c.parent_id).map((category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </Select>
                                <Select
                                    label="Sub-Category"
                                    value={form.category_id}
                                    onChange={(e) => handleSubCategoryChange(e.target.value)}
                                    disabled={!form.parent_category_id}
                                    error={errors.category_id}
                                >
                                    <option value="">Select Sub-Category</option>
                                    {categories.filter(c => c.parent_id === Number(form.parent_category_id)).map((category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </Select>
                                <Select
                                    label="Brand"
                                    value={form.brand_id}
                                    onChange={(e) => setField('brand_id', e.target.value)}
                                    error={errors.brand_id}
                                >
                                    <option value="">No Brand</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                                    ))}
                                </Select>
                            </div>
                        </AdminCard>

                        <AdminCard title="Images" className="border-slate-200">
                            <div className="space-y-4">
                                <FormInput
                                    label="External Image URL"
                                    type="url"
                                    value={form.image_url}
                                    onChange={(e) => setField('image_url', e.target.value)}
                                    error={errors.image_url}
                                    placeholder="https://example.com/image.jpg"
                                    icon={<Link className="h-4 w-4 text-slate-400" />}
                                />
                                <div>
                                    <label className="mb-1 block text-xs font-black text-slate-600">Local Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setField('image', e.target.files?.[0] ?? null)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold file:mr-3 file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-black file:text-white"
                                    />
                                    {errors.image && <p className="mt-1 text-xs font-bold text-danger">{errors.image}</p>}
                                </div>
                                {form.image_url && (
                                    <div className="mt-2">
                                        <p className="mb-2 text-xs font-black text-slate-600">Current Image</p>
                                        <img
                                            src={form.image_url}
                                            alt="Product preview"
                                            className="h-32 w-32 rounded-xl object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </AdminCard>

                        <AdminCard title="Description" className="border-slate-200">
                            <div>
                                <label className="mb-1 block text-xs font-black text-slate-600">Product Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setField('description', e.target.value)}
                                    className="min-h-32 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="Enter detailed product description..."
                                />
                                {errors.description && <p className="mt-1 text-xs font-bold text-danger">{errors.description}</p>}
                            </div>
                        </AdminCard>

                        <div className="flex gap-3">
                            <Button type="submit" disabled={processing} className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                {processing ? 'Saving...' : 'Update Product'}
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => router.get('/admin/products')} className="flex items-center gap-2">
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                        </div>
                    </form>
                </AdminCard>
            </div>
        </AdminLayout>
    );
}
