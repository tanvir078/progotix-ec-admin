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

function flattenCategoryOptions(categories, parentId = null, level = 0) {
    return categories
        .filter((category) => Number(category.parent_id || 0) === Number(parentId || 0))
        .flatMap((category) => [
            { ...category, tree_level: level },
            ...flattenCategoryOptions(categories, category.id, level + 1),
        ]);
}

export default function EditProductPage({ product = {}, categories = [], brands = [], status }) {
    const [form, setForm] = useState({
        name: product.name ?? '',
        description: product.description ?? '',
        price: product.price ?? '',
        image_url: product.image_url ?? '',
        image: null,
        stock: product.stock ?? '',
        size: product.size ?? '',
        colors: product.colors ?? '',
        fabric: product.fabric ?? '',
        fit: product.fit ?? '',
        occasion: product.occasion ?? '',
        care_instruction: product.care_instruction ?? '',
        gender: product.gender ?? '',
        age_group: product.age_group ?? '',
        season: product.season ?? '',
        category_id: product.category_id ?? '',
        brand_id: product.brand_id ?? '',
        category: product.category ?? '',
        rating: product.rating ?? '',
        reviews_count: product.reviews_count ?? '',
        parent_category_id: '',
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

    const handleCategoryChange = (value) => {
        const selected = categories.find((category) => String(category.id) === value);
        setField('category_id', value);
        setField('category', selected?.name ?? '');
    };

    const submit = (event) => {
        event.preventDefault();
        setProcessing(true);

        const data = { ...form, _method: 'put' };
        if (!data.image) delete data.image;
        delete data.parent_category_id;

        router.post(`/admin/products/${product.id}`, data, {
            forceFormData: true,
            preserveScroll: true,
            onError: setErrors,
            onSuccess: () => router.get('/admin/products'),
            onFinish: () => setProcessing(false),
        });
    };

    const categoryOptions = flattenCategoryOptions(categories);

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
                            <div className="grid gap-4 lg:grid-cols-2">
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
                                    <option value="">No Brand</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                                    ))}
                                </Select>
                            </div>
                        </AdminCard>

                        <AdminCard title="Fashion Attributes" className="border-slate-200">
                            <div className="space-y-4">
                                <div className="grid gap-4 lg:grid-cols-2">
                                    <FormInput label="Available Sizes" value={form.size} onChange={(e) => setField('size', e.target.value)} error={errors.size} placeholder="S, M, L, XL" />
                                    <FormInput label="Available Colors" value={form.colors} onChange={(e) => setField('colors', e.target.value)} error={errors.colors} placeholder="Black, White, Navy" />
                                    <FormInput label="Fabric / Material" value={form.fabric} onChange={(e) => setField('fabric', e.target.value)} error={errors.fabric} placeholder="Premium cotton" />
                                    <Select label="Fit" value={form.fit} onChange={(e) => setField('fit', e.target.value)} error={errors.fit}>
                                        <option value="">Select fit</option>
                                        <option value="Regular fit">Regular fit</option>
                                        <option value="Slim fit">Slim fit</option>
                                        <option value="Relaxed fit">Relaxed fit</option>
                                        <option value="Oversized fit">Oversized fit</option>
                                    </Select>
                                    <Select label="Gender" value={form.gender} onChange={(e) => setField('gender', e.target.value)} error={errors.gender}>
                                        <option value="">Select gender</option>
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Kids">Kids</option>
                                        <option value="Unisex">Unisex</option>
                                    </Select>
                                    <Select label="Season" value={form.season} onChange={(e) => setField('season', e.target.value)} error={errors.season}>
                                        <option value="">Select season</option>
                                        <option value="All Season">All Season</option>
                                        <option value="Summer">Summer</option>
                                        <option value="Winter">Winter</option>
                                        <option value="Eid Collection">Eid Collection</option>
                                        <option value="New Arrival">New Arrival</option>
                                    </Select>
                                    <Select label="Age Group" value={form.age_group} onChange={(e) => setField('age_group', e.target.value)} error={errors.age_group}>
                                        <option value="">Select age group</option>
                                        <option value="Adult">Adult</option>
                                        <option value="Teen">Teen</option>
                                        <option value="Kids">Kids</option>
                                        <option value="Baby">Baby</option>
                                    </Select>
                                    <FormInput label="Occasion" value={form.occasion} onChange={(e) => setField('occasion', e.target.value)} error={errors.occasion} placeholder="Casual, office, party" />
                                </div>
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
