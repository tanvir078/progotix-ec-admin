import { router } from '@/lib/inertiaCompat';
import { useState } from 'react';
import AdminLayout, { AdminCard } from '@/components/AdminLayout';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { 
  Settings, 
  Store, 
  CreditCard, 
  Truck, 
  Percent, 
  Mail, 
  Search, 
  User, 
  Shield,
  Save
} from 'lucide-react';

const tabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'store', label: 'Store Info', icon: Store },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'tax', label: 'Tax', icon: Percent },
  { id: 'notifications', label: 'Notifications', icon: Mail },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'profile', label: 'Admin Profile', icon: User },
];

export default function AdminSettingsPage({ settings = {}, status }) {
    const [activeTab, setActiveTab] = useState('general');
    const [form, setForm] = useState({
        // General
        site_name: settings.site_name ?? 'Progotix',
        site_description: settings.site_description ?? '',
        timezone: settings.timezone ?? 'UTC',
        language: settings.language ?? 'en',
        currency: settings.currency ?? 'USD',
        
        // Store
        store_name: settings.store_name ?? '',
        store_email: settings.store_email ?? '',
        store_phone: settings.store_phone ?? '',
        store_address: settings.store_address ?? '',
        
        // Payments
        stripe_enabled: Boolean(settings.stripe_enabled),
        stripe_public_key: settings.stripe_public_key ?? '',
        stripe_secret_key: settings.stripe_secret_key ?? '',
        paypal_enabled: Boolean(settings.paypal_enabled),
        paypal_client_id: settings.paypal_client_id ?? '',
        paypal_secret_key: settings.paypal_secret_key ?? '',
        cod_enabled: Boolean(settings.cod_enabled),
        
        // Shipping
        free_shipping_threshold: settings.free_shipping_threshold ?? 50,
        default_shipping_fee: settings.default_shipping_fee ?? 5.99,
        
        // Tax
        tax_rate: settings.tax_rate ?? 0,
        tax_inclusive: Boolean(settings.tax_inclusive),
        
        // Notifications
        new_order_notifications: Boolean(settings.new_order_notifications),
        low_stock_alerts: Boolean(settings.low_stock_alerts),
        customer_reviews_notifications: Boolean(settings.customer_reviews_notifications),
        
        // SEO
        meta_title: settings.meta_title ?? '',
        meta_description: settings.meta_description ?? '',
        meta_keywords: settings.meta_keywords ?? '',
        
        // Profile
        admin_name: settings.admin_name ?? '',
        admin_email: settings.admin_email ?? '',
    });
    const [errors, setErrors] = useState({});

    const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

    const submit = (event) => {
        event.preventDefault();
        router.post('/admin/settings', form, { preserveScroll: true, onError: setErrors });
    };

    return (
        <AdminLayout title="Settings">
            {status && (
                <div className="mb-5 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
                    {status}
                </div>
            )}

            <div className="flex gap-6">
                <div className="hidden w-64 flex-shrink-0 lg:block">
                    <nav className="space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                        activeTab === tab.id
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex-1">
                    <form onSubmit={submit} className="space-y-6">
                        {activeTab === 'general' && (
                            <AdminCard title="General Settings" icon={<Settings className="h-5 w-5 text-slate-400" />}>
                                <div className="space-y-4">
                                    <FormInput
                                        label="Site Name"
                                        value={form.site_name}
                                        onChange={(e) => setField('site_name', e.target.value)}
                                        error={errors.site_name}
                                    />
                                    <div>
                                        <label className="mb-1 block text-xs font-black text-slate-600">Site Description</label>
                                        <textarea
                                            value={form.site_description}
                                            onChange={(e) => setField('site_description', e.target.value)}
                                            className="min-h-20 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                    <FormInput
                                        label="Timezone"
                                        value={form.timezone}
                                        onChange={(e) => setField('timezone', e.target.value)}
                                        error={errors.timezone}
                                    />
                                    <FormInput
                                        label="Language"
                                        value={form.language}
                                        onChange={(e) => setField('language', e.target.value)}
                                        error={errors.language}
                                    />
                                    <FormInput
                                        label="Currency"
                                        value={form.currency}
                                        onChange={(e) => setField('currency', e.target.value)}
                                        error={errors.currency}
                                    />
                                </div>
                            </AdminCard>
                        )}

                        {activeTab === 'store' && (
                            <AdminCard title="Store Information" icon={<Store className="h-5 w-5 text-slate-400" />}>
                                <div className="space-y-4">
                                    <FormInput
                                        label="Store Name"
                                        value={form.store_name}
                                        onChange={(e) => setField('store_name', e.target.value)}
                                        error={errors.store_name}
                                    />
                                    <FormInput
                                        label="Store Email"
                                        type="email"
                                        value={form.store_email}
                                        onChange={(e) => setField('store_email', e.target.value)}
                                        error={errors.store_email}
                                    />
                                    <FormInput
                                        label="Store Phone"
                                        type="tel"
                                        value={form.store_phone}
                                        onChange={(e) => setField('store_phone', e.target.value)}
                                        error={errors.store_phone}
                                    />
                                    <div>
                                        <label className="mb-1 block text-xs font-black text-slate-600">Store Address</label>
                                        <textarea
                                            value={form.store_address}
                                            onChange={(e) => setField('store_address', e.target.value)}
                                            className="min-h-24 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            </AdminCard>
                        )}

                        {activeTab === 'payments' && (
                            <AdminCard title="Payment Gateway" icon={<CreditCard className="h-5 w-5 text-slate-400" />}>
                                <div className="space-y-6">
                                    <div className="rounded-xl border border-slate-200 p-4">
                                        <label className="flex items-center justify-between mb-4 cursor-pointer">
                                            <span className="font-black text-slate-900">Stripe Checkout</span>
                                            <input
                                                type="checkbox"
                                                checked={form.stripe_enabled}
                                                onChange={(e) => setField('stripe_enabled', e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                            />
                                        </label>
                                        <div className="space-y-4">
                                            <FormInput
                                                label="Stripe Public Key"
                                                value={form.stripe_public_key}
                                                onChange={(e) => setField('stripe_public_key', e.target.value)}
                                                error={errors.stripe_public_key}
                                                placeholder="pk_live_..."
                                            />
                                            <FormInput
                                                label="Stripe Secret Key"
                                                type="password"
                                                value={form.stripe_secret_key}
                                                onChange={(e) => setField('stripe_secret_key', e.target.value)}
                                                error={errors.stripe_secret_key}
                                                placeholder="sk_live_..."
                                            />
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 p-4">
                                        <label className="mb-4 flex cursor-pointer items-center justify-between">
                                            <span className="font-black text-slate-900">PayPal</span>
                                            <input
                                                type="checkbox"
                                                checked={form.paypal_enabled}
                                                onChange={(e) => setField('paypal_enabled', e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                            />
                                        </label>
                                        <div className="space-y-4">
                                            <FormInput
                                                label="PayPal Client ID"
                                                value={form.paypal_client_id}
                                                onChange={(e) => setField('paypal_client_id', e.target.value)}
                                                error={errors.paypal_client_id}
                                                placeholder="PayPal client ID"
                                            />
                                            <FormInput
                                                label="PayPal Secret Key"
                                                type="password"
                                                value={form.paypal_secret_key}
                                                onChange={(e) => setField('paypal_secret_key', e.target.value)}
                                                error={errors.paypal_secret_key}
                                                placeholder="PayPal secret"
                                            />
                                        </div>
                                    </div>
                                    <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer">
                                        <span className="font-black text-slate-900">Cash on Delivery</span>
                                        <input
                                            type="checkbox"
                                            checked={form.cod_enabled}
                                            onChange={(e) => setField('cod_enabled', e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                        />
                                    </label>
                                </div>
                            </AdminCard>
                        )}

                        {activeTab === 'shipping' && (
                            <AdminCard title="Shipping Settings" icon={<Truck className="h-5 w-5 text-slate-400" />}>
                                <div className="space-y-4">
                                    <FormInput
                                        label="Free Shipping Threshold"
                                        type="number"
                                        step="0.01"
                                        value={form.free_shipping_threshold}
                                        onChange={(e) => setField('free_shipping_threshold', e.target.value)}
                                        error={errors.free_shipping_threshold}
                                        placeholder="50.00"
                                    />
                                    <FormInput
                                        label="Default Shipping Fee"
                                        type="number"
                                        step="0.01"
                                        value={form.default_shipping_fee}
                                        onChange={(e) => setField('default_shipping_fee', e.target.value)}
                                        error={errors.default_shipping_fee}
                                        placeholder="5.99"
                                    />
                                </div>
                            </AdminCard>
                        )}

                        {activeTab === 'tax' && (
                            <AdminCard title="Tax Settings" icon={<Percent className="h-5 w-5 text-slate-400" />}>
                                <div className="space-y-4">
                                    <FormInput
                                        label="Tax Rate (%)"
                                        type="number"
                                        step="0.01"
                                        value={form.tax_rate}
                                        onChange={(e) => setField('tax_rate', e.target.value)}
                                        error={errors.tax_rate}
                                        placeholder="0"
                                    />
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.tax_inclusive}
                                            onChange={(e) => setField('tax_inclusive', e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm font-semibold text-slate-700">Tax Inclusive Pricing</span>
                                    </label>
                                </div>
                            </AdminCard>
                        )}

                        {activeTab === 'notifications' && (
                            <AdminCard title="Notification Settings" icon={<Mail className="h-5 w-5 text-slate-400" />}>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer">
                                        <span className="font-black text-slate-900">New Order Notifications</span>
                                        <input
                                            type="checkbox"
                                            checked={form.new_order_notifications}
                                            onChange={(e) => setField('new_order_notifications', e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer">
                                        <span className="font-black text-slate-900">Low Stock Alerts</span>
                                        <input
                                            type="checkbox"
                                            checked={form.low_stock_alerts}
                                            onChange={(e) => setField('low_stock_alerts', e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer">
                                        <span className="font-black text-slate-900">Customer Review Notifications</span>
                                        <input
                                            type="checkbox"
                                            checked={form.customer_reviews_notifications}
                                            onChange={(e) => setField('customer_reviews_notifications', e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                        />
                                    </label>
                                </div>
                            </AdminCard>
                        )}

                        {activeTab === 'seo' && (
                            <AdminCard title="SEO Settings" icon={<Search className="h-5 w-5 text-slate-400" />}>
                                <div className="space-y-4">
                                    <FormInput
                                        label="Meta Title"
                                        value={form.meta_title}
                                        onChange={(e) => setField('meta_title', e.target.value)}
                                        error={errors.meta_title}
                                        placeholder="Default meta title"
                                    />
                                    <div>
                                        <label className="mb-1 block text-xs font-black text-slate-600">Meta Description</label>
                                        <textarea
                                            value={form.meta_description}
                                            onChange={(e) => setField('meta_description', e.target.value)}
                                            className="min-h-20 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                            placeholder="Default meta description"
                                        />
                                    </div>
                                    <FormInput
                                        label="Meta Keywords"
                                        value={form.meta_keywords}
                                        onChange={(e) => setField('meta_keywords', e.target.value)}
                                        error={errors.meta_keywords}
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                </div>
                            </AdminCard>
                        )}

                        {activeTab === 'profile' && (
                            <AdminCard title="Admin Profile" icon={<User className="h-5 w-5 text-slate-400" />}>
                                <div className="space-y-4">
                                    <FormInput
                                        label="Admin Name"
                                        value={form.admin_name}
                                        onChange={(e) => setField('admin_name', e.target.value)}
                                        error={errors.admin_name}
                                    />
                                    <FormInput
                                        label="Admin Email"
                                        type="email"
                                        value={form.admin_email}
                                        onChange={(e) => setField('admin_email', e.target.value)}
                                        error={errors.admin_email}
                                    />
                                </div>
                            </AdminCard>
                        )}

                        <div className="flex justify-end">
                            <Button type="submit" className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                Save Settings
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
