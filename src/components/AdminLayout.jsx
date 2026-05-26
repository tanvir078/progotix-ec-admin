import { Head, Link, router, usePage } from '@/lib/inertiaCompat';
import { useEffect, useRef, useState } from 'react';
import {
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Tag, 
  Warehouse, 
  ShoppingCart, 
  Users, 
  CreditCard, 
  RotateCcw, 
  Ticket, 
  Image, 
  Star, 
  Truck, 
  BarChart3, 
  Bell, 
  FileText, 
  Shield, 
  Settings,
  Search,
  LogOut,
  Menu,
  X,
  Percent,
  Zap,
  Store,
  Megaphone,
  Globe2,
  Wallet,
  MapPinned,
  ClipboardList,
  ShieldCheck,
  SlidersHorizontal,
  Layers,
  MessageCircleQuestion,
} from 'lucide-react';
import StatusBadge from './ui/Badge';

const mainNavItems = [
  { label: 'Dashboard', href: '/admin', match: /^\/admin\/?$/, icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', match: /^\/admin\/products(?:\/|$)|^\/admin\/reviews|^\/admin\/product-questions/, icon: Package },
  { label: 'Categories', href: '/admin/categories', match: /^\/admin\/(?:categories|sub-categories)/, icon: FolderTree },
  { label: 'Brand', href: '/admin/brands', match: /^\/admin\/brands/, icon: Tag },
  { label: 'Attributes', href: '/admin/attributes', match: /^\/admin\/(?:attributes|sizes|colors|weights|materials)/, icon: SlidersHorizontal },
  { label: 'Inventory', href: '/admin/inventory', match: /^\/admin\/inventory/, icon: Warehouse },
  { label: 'Orders', href: '/admin/orders', match: /^\/admin\/(?:orders|pending-orders|processing-orders|shipped-orders|delivered-orders|cancelled-orders|return-requests|refund-requests|invoices)/, icon: ShoppingCart },
  { label: 'Customers', href: '/admin/users', match: /^\/admin\/(?:users|customer-details|customer-order-history|customer-wallet|reward-points|blocked-customers)/, icon: Users },
  { label: 'Sellers', href: '/admin/sellers', match: /^\/admin\/(?:sellers|seller-requests|seller-products|seller-orders|seller-commission|seller-withdraws|seller-payout-report)/, icon: Store },
  { label: 'Marketing', href: '/admin/coupons', match: /^\/admin\/(?:coupons|discounts|flash-sales|campaigns|banners|popups|newsletter|push-notifications|notifications)/, icon: Megaphone },
  { label: 'Shipping', href: '/admin/shipping', match: /^\/admin\/(?:shipping|shipping-zones|delivery-charges|couriers|delivery-men|tracking-setup)/, icon: Truck },
  { label: 'Payments', href: '/admin/payments', match: /^\/admin\/(?:payments|payment-methods|cod-settings|online-gateways|transactions|refund-payments|refunds)/, icon: CreditCard },
  { label: 'CMS', href: '/admin/content', match: /^\/admin\/(?:content|home-sections|slider-banners|about-page|contact-page|privacy-policy|terms-conditions|faq)/, icon: Globe2 },
  { label: 'Reports', href: '/admin/analytics', match: /^\/admin\/(?:analytics|reports)/, icon: BarChart3 },
  { label: 'Staff', href: '/admin/staff', match: /^\/admin\/(?:staff|admin-users|roles-permissions|activity-logs)/, icon: Shield },
  { label: 'Settings', href: '/admin/settings', match: /^\/admin\/(?:settings|general-settings|logo-favicon|seo-settings|email-settings|sms-settings|currency-settings|language-settings|maintenance-mode)/, icon: Settings },
];

const moduleTabGroups = [
  {
    match: /^\/admin\/products(?:\/|$)|^\/admin\/reviews|^\/admin\/product-questions/,
    tabs: [
      { label: 'Products', href: '/admin/products', match: /^\/admin\/products(\/)?$/ },
      { label: 'Add Product', href: '/admin/products/add', match: /^\/admin\/products\/add/ },
      { label: 'Reviews', href: '/admin/reviews', match: /^\/admin\/reviews/ },
      { label: 'Questions', href: '/admin/product-questions', match: /^\/admin\/product-questions/ },
    ],
  },
  {
    match: /^\/admin\/(?:categories|sub-categories)/,
    tabs: [
      { label: 'Categories', href: '/admin/categories', match: /^\/admin\/categories/ },
      { label: 'Sub Categories', href: '/admin/sub-categories', match: /^\/admin\/sub-categories/ },
    ],
  },
  {
    match: /^\/admin\/(?:attributes|sizes|colors|weights|materials)/,
    tabs: [
      { label: 'Attributes', href: '/admin/attributes', match: /^\/admin\/attributes/ },
      { label: 'Sizes', href: '/admin/sizes', match: /^\/admin\/sizes/ },
      { label: 'Colors', href: '/admin/colors', match: /^\/admin\/colors/ },
      { label: 'Weights', href: '/admin/weights', match: /^\/admin\/weights/ },
      { label: 'Materials', href: '/admin/materials', match: /^\/admin\/materials/ },
    ],
  },
  {
    match: /^\/admin\/(?:orders|pending-orders|processing-orders|shipped-orders|delivered-orders|cancelled-orders|return-requests|refund-requests|invoices)/,
    tabs: [
      { label: 'All Orders', href: '/admin/orders', match: /^\/admin\/orders(\/)?$/ },
      { label: 'Pending', href: '/admin/pending-orders', match: /^\/admin\/pending-orders/ },
      { label: 'Processing', href: '/admin/processing-orders', match: /^\/admin\/processing-orders/ },
      { label: 'Shipped', href: '/admin/shipped-orders', match: /^\/admin\/shipped-orders/ },
      { label: 'Delivered', href: '/admin/delivered-orders', match: /^\/admin\/delivered-orders/ },
      { label: 'Cancelled', href: '/admin/cancelled-orders', match: /^\/admin\/cancelled-orders/ },
      { label: 'Returns', href: '/admin/return-requests', match: /^\/admin\/return-requests/ },
      { label: 'Refunds', href: '/admin/refund-requests', match: /^\/admin\/refund-requests/ },
      { label: 'Invoices', href: '/admin/invoices', match: /^\/admin\/invoices/ },
    ],
  },
  {
    match: /^\/admin\/(?:users|customer-details|customer-order-history|customer-wallet|reward-points|blocked-customers)/,
    tabs: [
      { label: 'Customers', href: '/admin/users', match: /^\/admin\/users/ },
      { label: 'Details', href: '/admin/customer-details', match: /^\/admin\/customer-details/ },
      { label: 'Order History', href: '/admin/customer-order-history', match: /^\/admin\/customer-order-history/ },
      { label: 'Wallet', href: '/admin/customer-wallet', match: /^\/admin\/customer-wallet/ },
      { label: 'Reward Points', href: '/admin/reward-points', match: /^\/admin\/reward-points/ },
      { label: 'Blocked', href: '/admin/blocked-customers', match: /^\/admin\/blocked-customers/ },
    ],
  },
  {
    match: /^\/admin\/(?:sellers|seller-requests|seller-products|seller-orders|seller-commission|seller-withdraws|seller-payout-report)/,
    tabs: [
      { label: 'Sellers', href: '/admin/sellers', match: /^\/admin\/sellers/ },
      { label: 'Requests', href: '/admin/seller-requests', match: /^\/admin\/seller-requests/ },
      { label: 'Products', href: '/admin/seller-products', match: /^\/admin\/seller-products/ },
      { label: 'Orders', href: '/admin/seller-orders', match: /^\/admin\/seller-orders/ },
      { label: 'Commission', href: '/admin/seller-commission', match: /^\/admin\/seller-commission/ },
      { label: 'Withdraws', href: '/admin/seller-withdraws', match: /^\/admin\/seller-withdraws/ },
      { label: 'Payout Report', href: '/admin/seller-payout-report', match: /^\/admin\/seller-payout-report/ },
    ],
  },
  {
    match: /^\/admin\/(?:coupons|discounts|flash-sales|campaigns|banners|popups|newsletter|push-notifications|notifications)/,
    tabs: [
      { label: 'Coupons', href: '/admin/coupons', match: /^\/admin\/coupons/ },
      { label: 'Discounts', href: '/admin/discounts', match: /^\/admin\/discounts/ },
      { label: 'Flash Sale', href: '/admin/flash-sales', match: /^\/admin\/flash-sales/ },
      { label: 'Campaigns', href: '/admin/campaigns', match: /^\/admin\/campaigns/ },
      { label: 'Banners', href: '/admin/banners', match: /^\/admin\/banners/ },
      { label: 'Popups', href: '/admin/popups', match: /^\/admin\/popups/ },
      { label: 'Newsletter', href: '/admin/newsletter', match: /^\/admin\/newsletter/ },
      { label: 'Push Notifications', href: '/admin/push-notifications', match: /^\/admin\/push-notifications|^\/admin\/notifications/ },
    ],
  },
  {
    match: /^\/admin\/(?:shipping|shipping-zones|delivery-charges|couriers|delivery-men|tracking-setup)/,
    tabs: [
      { label: 'Overview', href: '/admin/shipping', match: /^\/admin\/shipping$/ },
      { label: 'Zones', href: '/admin/shipping-zones', match: /^\/admin\/shipping-zones/ },
      { label: 'Charges', href: '/admin/delivery-charges', match: /^\/admin\/delivery-charges/ },
      { label: 'Couriers', href: '/admin/couriers', match: /^\/admin\/couriers/ },
      { label: 'Delivery Men', href: '/admin/delivery-men', match: /^\/admin\/delivery-men/ },
      { label: 'Tracking', href: '/admin/tracking-setup', match: /^\/admin\/tracking-setup/ },
    ],
  },
  {
    match: /^\/admin\/(?:payments|payment-methods|cod-settings|online-gateways|transactions|refund-payments|refunds)/,
    tabs: [
      { label: 'Payments', href: '/admin/payments', match: /^\/admin\/payments/ },
      { label: 'Methods', href: '/admin/payment-methods', match: /^\/admin\/payment-methods/ },
      { label: 'COD', href: '/admin/cod-settings', match: /^\/admin\/cod-settings/ },
      { label: 'Gateways', href: '/admin/online-gateways', match: /^\/admin\/online-gateways/ },
      { label: 'Transactions', href: '/admin/transactions', match: /^\/admin\/transactions/ },
      { label: 'Refunds', href: '/admin/refund-payments', match: /^\/admin\/refund-payments|^\/admin\/refunds/ },
    ],
  },
  {
    match: /^\/admin\/(?:content|home-sections|slider-banners|about-page|contact-page|privacy-policy|terms-conditions|faq)/,
    tabs: [
      { label: 'Content', href: '/admin/content', match: /^\/admin\/content/ },
      { label: 'Home Sections', href: '/admin/home-sections', match: /^\/admin\/home-sections/ },
      { label: 'Slider/Banner', href: '/admin/slider-banners', match: /^\/admin\/slider-banners/ },
      { label: 'About', href: '/admin/about-page', match: /^\/admin\/about-page/ },
      { label: 'Contact', href: '/admin/contact-page', match: /^\/admin\/contact-page/ },
      { label: 'Privacy', href: '/admin/privacy-policy', match: /^\/admin\/privacy-policy/ },
      { label: 'Terms', href: '/admin/terms-conditions', match: /^\/admin\/terms-conditions/ },
      { label: 'FAQ', href: '/admin/faq', match: /^\/admin\/faq/ },
    ],
  },
  {
    match: /^\/admin\/(?:analytics|reports)/,
    tabs: [
      { label: 'Analytics', href: '/admin/analytics', match: /^\/admin\/analytics/ },
      { label: 'Sales', href: '/admin/reports/sales', match: /^\/admin\/reports\/sales/ },
      { label: 'Orders', href: '/admin/reports/orders', match: /^\/admin\/reports\/orders/ },
      { label: 'Products', href: '/admin/reports/products', match: /^\/admin\/reports\/products/ },
      { label: 'Stock', href: '/admin/reports/stock', match: /^\/admin\/reports\/stock/ },
      { label: 'Customers', href: '/admin/reports/customers', match: /^\/admin\/reports\/customers/ },
      { label: 'Sellers', href: '/admin/reports/sellers', match: /^\/admin\/reports\/sellers/ },
      { label: 'Payments', href: '/admin/reports/payments', match: /^\/admin\/reports\/payments/ },
      { label: 'Profit/Loss', href: '/admin/reports/profit-loss', match: /^\/admin\/reports\/profit-loss/ },
    ],
  },
  {
    match: /^\/admin\/(?:staff|admin-users|roles-permissions|activity-logs)/,
    tabs: [
      { label: 'Staff', href: '/admin/staff', match: /^\/admin\/staff/ },
      { label: 'Admin Users', href: '/admin/admin-users', match: /^\/admin\/admin-users/ },
      { label: 'Roles', href: '/admin/roles-permissions', match: /^\/admin\/roles-permissions/ },
      { label: 'Activity Logs', href: '/admin/activity-logs', match: /^\/admin\/activity-logs/ },
    ],
  },
  {
    match: /^\/admin\/(?:settings|general-settings|logo-favicon|seo-settings|email-settings|sms-settings|currency-settings|language-settings|maintenance-mode)/,
    tabs: [
      { label: 'Settings', href: '/admin/settings', match: /^\/admin\/settings/ },
      { label: 'General', href: '/admin/general-settings', match: /^\/admin\/general-settings/ },
      { label: 'Logo & Favicon', href: '/admin/logo-favicon', match: /^\/admin\/logo-favicon/ },
      { label: 'SEO', href: '/admin/seo-settings', match: /^\/admin\/seo-settings/ },
      { label: 'Email', href: '/admin/email-settings', match: /^\/admin\/email-settings/ },
      { label: 'SMS', href: '/admin/sms-settings', match: /^\/admin\/sms-settings/ },
      { label: 'Currency', href: '/admin/currency-settings', match: /^\/admin\/currency-settings/ },
      { label: 'Language', href: '/admin/language-settings', match: /^\/admin\/language-settings/ },
      { label: 'Maintenance', href: '/admin/maintenance-mode', match: /^\/admin\/maintenance-mode/ },
    ],
  },
];

export default function AdminLayout({ title, eyebrow = 'Progotix Admin', actions, children }) {
    const { props, url } = usePage();
    const user = props.auth?.user;
    const flashStatus = props.flash?.status || props.status;
    const [open, setOpen] = useState(false);
    const sidebarScrollRef = useRef(null);
    const mobileScrollRef = useRef(null);

    useEffect(() => {
        const saved = Number(sessionStorage.getItem('progotix_admin_sidebar_scroll') || 0);
        if (sidebarScrollRef.current) sidebarScrollRef.current.scrollTop = saved;
        if (mobileScrollRef.current) mobileScrollRef.current.scrollTop = saved;
    }, [url, open]);

    const rememberSidebarScroll = (event) => {
        sessionStorage.setItem('progotix_admin_sidebar_scroll', String(event.currentTarget.scrollTop));
    };

    const logout = () => window.location.reload();
    const activeModuleTabs = moduleTabGroups.find((group) => group.match.test(url))?.tabs || [];

    const nav = (
        <nav className="space-y-1 overflow-y-auto">
            {mainNavItems.map((item) => {
                const active = item.match.test(url);
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                            active
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                        {active && <span className="ml-auto h-2 w-2 rounded-full bg-accent" />}
                    </Link>
                );
            })}
        </nav>
    );

    const moduleTabs = activeModuleTabs.length > 0 && (
        <div className="mb-6 overflow-x-auto rounded-lg border border-slate-200 bg-white px-2 shadow-sm">
            <div className="flex min-w-max gap-1">
                {activeModuleTabs.map((tab) => {
                    const active = tab.match.test(url);

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`border-b-2 px-4 py-3 text-sm font-black transition ${
                                active
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900'
                            }`}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-slate-950">
            <Head title={title} />

            <aside className="fixed inset-y-0 left-0 z-40 hidden w-80 border-r border-white/10 bg-[#1b0a29] px-4 py-5 text-white lg:block">
                <Link href="/admin" className="flex items-center gap-3 rounded-xl px-2 py-2">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-sm font-black text-white">
                        PX
                    </div>
                    <div>
                        <span className="block text-sm font-black text-white">Progotix</span>
                        <span className="block text-xs font-semibold text-slate-400">Enterprise Admin</span>
                    </div>
                </Link>
                <div
                    ref={sidebarScrollRef}
                    onScroll={rememberSidebarScroll}
                    className="mt-8 max-h-[calc(100vh-200px)] overflow-y-auto pr-1"
                >
                    {nav}
                </div>
                <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-black text-white">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-bold text-white">{user?.name}</p>
                            <p className="truncate text-xs text-slate-400">{user?.email}</p>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onClick={logout} 
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-black text-white ring-1 ring-white/10 transition hover:bg-white/15"
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </button>
                </div>
            </aside>

            <div className="lg:pl-80">
                <header className="sticky top-0 z-30 border-b border-white/10 bg-[#1b0a29] text-white backdrop-blur">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                className="rounded-xl border border-white/15 p-2 text-white lg:hidden hover:bg-white/10"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                            <div>
                                <h1 className="text-lg font-black tracking-tight text-white">{title}</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-72 rounded-lg border border-white/15 bg-white/10 pl-10 pr-4 py-2 text-sm font-semibold text-white placeholder:text-white/60 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                />
                            </div>
                            <button className="relative rounded-xl border border-white/15 p-2 text-white hover:bg-white/10">
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-danger text-[10px] font-black text-white flex items-center justify-center">3</span>
                            </button>
                            {actions}
                        </div>
                    </div>
                </header>

                {open && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <button type="button" className="absolute inset-0 bg-slate-950/40" onClick={() => setOpen(false)} aria-label="Close menu" />
                        <div className="relative h-full w-80 bg-secondary p-4 shadow-2xl">
                            <div className="mb-6 flex items-center justify-between">
                                <span className="font-black text-white">Progotix Admin</span>
                                <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-300 hover:bg-white/10">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div ref={mobileScrollRef} onScroll={rememberSidebarScroll} className="max-h-[calc(100vh-80px)] overflow-y-auto pr-1">
                                {nav}
                            </div>
                        </div>
                    </div>
                )}

                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    {moduleTabs}
                    {flashStatus && (
                        <div className="mb-4 rounded-xl border border-success bg-success-light px-5 py-3 text-sm font-bold text-success-dark">
                            {flashStatus}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}

export function AdminCard({ title, children, action, className = '' }) {
    return (
        <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
            {(title || action) && (
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    {title && <h2 className="text-sm font-black text-slate-950">{title}</h2>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="p-5">{children}</div>
        </section>
    );
}

export { StatusBadge };
