import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AdminAnalyticsPage from './pages/analytics/AdminAnalyticsPage';
import CustomerAnalyticsPage from './pages/analytics/CustomerAnalyticsPage';
import AdminBannersPage from './pages/banners/AdminBannersPage';
import AdminBrandsPage from './pages/brands/AdminBrandsPage';
import AdminCampaignsPage from './pages/campaigns/AdminCampaignsPage';
import EmailCampaignsPage from './pages/marketing/EmailCampaignsPage';
import AdminCategoriesPage from './pages/categories/AdminCategoriesPage';
import AdminContentPage from './pages/content/AdminContentPage';
import AdminCouponsPage from './pages/coupons/AdminCouponsPage';
import AdminOrderDetailsPage from './pages/orders/AdminOrderDetailsPage';
import AdminOrdersPage from './pages/orders/AdminOrdersPage';
import AdminPaymentsPage from './pages/payments/AdminPaymentsPage';
import AdminProfilePage from './pages/profile/AdminProfilePage';
import AddProductPage from './pages/products/AddProductPage';
import EditProductPage from './pages/products/EditProductPage';
import ProductsPage from './pages/products/ProductsPage';
import ProductBundlesPage from './pages/products/ProductBundlesPage';
import AdminRefundsPage from './pages/refunds/AdminRefundsPage';
import AdminReviewsPage from './pages/reviews/AdminReviewsPage';
import AdminSettingsPage from './pages/settings/AdminSettingsPage';
import AdminShippingPage from './pages/shipping/AdminShippingPage';
import AdminStaffPage from './pages/staff/AdminStaffPage';
import AdminUsersPage from './pages/users/AdminUsersPage';
import AdminDiscountsPage from './pages/discounts/AdminDiscountsPage';
import AdminFlashSalesPage from './pages/flash-sales/AdminFlashSalesPage';
import AdminInventoryPage from './pages/inventory/AdminInventoryPage';
import StockAlertsPage from './pages/inventory/StockAlertsPage';
import AdminNotificationsPage from './pages/notifications/AdminNotificationsPage';
import AdminFeatureStatusPage from './pages/operations/AdminFeatureStatusPage';
import AdminCatalogAttributesPage from './pages/attributes/AdminCatalogAttributesPage';
import { apiRequest } from './lib/api';
import { PageProvider, RouterBridge } from './lib/inertiaCompat';
import Loading from './components/ui/Loading';
import Error from './components/ui/Error';

const routes = [
  { path: '/', api: '/admin', component: AdminDashboard },
  { path: '/products', api: '/admin/products', component: ProductsPage },
  { path: '/products/add', api: '/admin/products/add', component: AddProductPage },
  { path: '/products/:id/edit', api: ({ id }) => `/admin/products/${id}/edit`, component: EditProductPage },
  { path: '/product-bundles', api: '/admin/product-bundles', component: ProductBundlesPage },
  { path: '/categories', api: '/admin/categories', component: AdminCategoriesPage },
  { path: '/sub-categories', api: '/admin/sub-categories', component: AdminCategoriesPage },
  { path: '/brands', api: '/admin/brands', component: AdminBrandsPage },
  { path: '/attributes', api: '/admin/attributes', component: AdminCatalogAttributesPage },
  { path: '/sizes', api: '/admin/sizes', component: AdminCatalogAttributesPage },
  { path: '/colors', api: '/admin/colors', component: AdminCatalogAttributesPage },
  { path: '/weights', api: '/admin/weights', component: AdminCatalogAttributesPage },
  { path: '/materials', api: '/admin/materials', component: AdminCatalogAttributesPage },
  { path: '/product-questions', api: '/admin/product-questions', component: AdminFeatureStatusPage },
  { path: '/inventory', api: '/admin/inventory', component: AdminInventoryPage },
  { path: '/stock-alerts', api: '/admin/stock-alerts', component: StockAlertsPage },
  { path: '/banners', api: '/admin/banners', component: AdminBannersPage },
  { path: '/orders', api: '/admin/orders', component: AdminOrdersPage },
  { path: '/pending-orders', api: '/admin/pending-orders', component: AdminOrdersPage },
  { path: '/processing-orders', api: '/admin/processing-orders', component: AdminOrdersPage },
  { path: '/shipped-orders', api: '/admin/shipped-orders', component: AdminOrdersPage },
  { path: '/delivered-orders', api: '/admin/delivered-orders', component: AdminOrdersPage },
  { path: '/cancelled-orders', api: '/admin/cancelled-orders', component: AdminOrdersPage },
  { path: '/return-requests', api: '/admin/return-requests', component: AdminRefundsPage },
  { path: '/refund-requests', api: '/admin/refund-requests', component: AdminRefundsPage },
  { path: '/invoices', api: '/admin/invoices', component: AdminFeatureStatusPage },
  { path: '/orders/:id', api: ({ id }) => `/admin/orders/${id}`, component: AdminOrderDetailsPage },
  { path: '/refunds', api: '/admin/refunds', component: AdminRefundsPage },
  { path: '/coupons', api: '/admin/coupons', component: AdminCouponsPage },
  { path: '/discounts', api: '/admin/discounts', component: AdminDiscountsPage },
  { path: '/flash-sales', api: '/admin/flash-sales', component: AdminFlashSalesPage },
  { path: '/campaigns', api: '/admin/campaigns', component: AdminCampaignsPage },
  { path: '/email-campaigns', api: '/admin/email-campaigns', component: EmailCampaignsPage },
  { path: '/popups', api: '/admin/popups', component: AdminFeatureStatusPage },
  { path: '/newsletter', api: '/admin/newsletter', component: AdminFeatureStatusPage },
  { path: '/reviews', api: '/admin/reviews', component: AdminReviewsPage },
  { path: '/shipping', api: '/admin/shipping', component: AdminShippingPage },
  { path: '/shipping-zones', api: '/admin/shipping-zones', component: AdminFeatureStatusPage },
  { path: '/delivery-charges', api: '/admin/delivery-charges', component: AdminFeatureStatusPage },
  { path: '/couriers', api: '/admin/couriers', component: AdminFeatureStatusPage },
  { path: '/delivery-men', api: '/admin/delivery-men', component: AdminFeatureStatusPage },
  { path: '/tracking-setup', api: '/admin/tracking-setup', component: AdminFeatureStatusPage },
  { path: '/payments', api: '/admin/payments', component: AdminPaymentsPage },
  { path: '/payment-methods', api: '/admin/payments', component: AdminPaymentsPage },
  { path: '/cod-settings', api: '/admin/payments', component: AdminPaymentsPage },
  { path: '/online-gateways', api: '/admin/payments', component: AdminPaymentsPage },
  { path: '/transactions', api: '/admin/payments', component: AdminPaymentsPage },
  { path: '/refund-payments', api: '/admin/refunds', component: AdminRefundsPage },
  { path: '/notifications', api: '/admin/notifications', component: AdminNotificationsPage },
  { path: '/push-notifications', api: '/admin/push-notifications', component: AdminNotificationsPage },
  { path: '/content', api: '/admin/content', component: AdminContentPage },
  { path: '/home-sections', api: '/admin/home-sections', component: AdminFeatureStatusPage },
  { path: '/slider-banners', api: '/admin/banners', component: AdminBannersPage },
  { path: '/about-page', api: '/admin/about-page', component: AdminContentPage },
  { path: '/contact-page', api: '/admin/contact-page', component: AdminContentPage },
  { path: '/privacy-policy', api: '/admin/privacy-policy', component: AdminContentPage },
  { path: '/terms-conditions', api: '/admin/terms-conditions', component: AdminContentPage },
  { path: '/faq', api: '/admin/faq', component: AdminFeatureStatusPage },
  { path: '/users', api: '/admin/users', component: AdminUsersPage },
  { path: '/customer-details', api: '/admin/customer-details', component: AdminFeatureStatusPage },
  { path: '/customer-order-history', api: '/admin/customer-order-history', component: AdminFeatureStatusPage },
  { path: '/customer-wallet', api: '/admin/customer-wallet', component: AdminFeatureStatusPage },
  { path: '/reward-points', api: '/admin/reward-points', component: AdminFeatureStatusPage },
  { path: '/blocked-customers', api: '/admin/blocked-customers', component: AdminFeatureStatusPage },
  { path: '/sellers', api: '/admin/sellers', component: AdminFeatureStatusPage },
  { path: '/seller-requests', api: '/admin/seller-requests', component: AdminFeatureStatusPage },
  { path: '/seller-products', api: '/admin/seller-products', component: AdminFeatureStatusPage },
  { path: '/seller-orders', api: '/admin/seller-orders', component: AdminFeatureStatusPage },
  { path: '/seller-commission', api: '/admin/seller-commission', component: AdminFeatureStatusPage },
  { path: '/seller-withdraws', api: '/admin/seller-withdraws', component: AdminFeatureStatusPage },
  { path: '/seller-payout-report', api: '/admin/seller-payout-report', component: AdminFeatureStatusPage },
  { path: '/staff', api: '/admin/staff', component: AdminStaffPage },
  { path: '/admin-users', api: '/admin/admin-users', component: AdminStaffPage },
  { path: '/roles-permissions', api: '/admin/roles-permissions', component: AdminFeatureStatusPage },
  { path: '/activity-logs', api: '/admin/activity-logs', component: AdminFeatureStatusPage },
  { path: '/analytics', api: '/admin/analytics', component: AdminAnalyticsPage },
  { path: '/customer-analytics', api: '/admin/customer-analytics', component: CustomerAnalyticsPage },
  { path: '/reports/:report', api: ({ report }) => `/admin/reports/${report}`, component: AdminFeatureStatusPage },
  { path: '/settings', api: '/admin/settings', component: AdminSettingsPage },
  { path: '/profile', api: '/admin', component: AdminProfilePage },
  { path: '/general-settings', api: '/admin/settings', component: AdminSettingsPage },
  { path: '/logo-favicon', api: '/admin/logo-favicon', component: AdminFeatureStatusPage },
  { path: '/seo-settings', api: '/admin/settings', component: AdminSettingsPage },
  { path: '/email-settings', api: '/admin/email-settings', component: AdminFeatureStatusPage },
  { path: '/sms-settings', api: '/admin/sms-settings', component: AdminFeatureStatusPage },
  { path: '/currency-settings', api: '/admin/settings', component: AdminSettingsPage },
  { path: '/language-settings', api: '/admin/settings', component: AdminSettingsPage },
  { path: '/maintenance-mode', api: '/admin/settings', component: AdminSettingsPage },
];

function RouteLoader({ route }) {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, props: {}, error: null });
  const [reloadToken, setReloadToken] = useState(0);
  const Component = route.component;
  

  const params = useMemo(() => {
    const routeParts = route.path.split('/').filter(Boolean);
    const pathParts = location.pathname.split('/').filter(Boolean);
    return routeParts.reduce((acc, part, index) => {
      if (part.startsWith(':')) acc[part.slice(1)] = pathParts[index];
      return acc;
    }, {});
  }, [location.pathname, route.path]);

  useEffect(() => {
    const reload = () => setReloadToken((value) => value + 1);
    window.addEventListener('admin:refresh', reload);
    return () => window.removeEventListener('admin:refresh', reload);
  }, []);

  useEffect(() => {
    let alive = true;
    const query = Object.fromEntries(new URLSearchParams(location.search));
    const apiPath = typeof route.api === 'function' ? route.api(params) : route.api;

    setState((current) => ({ ...current, loading: true, error: null }));
    apiRequest(apiPath, { params: query })
      .then((props) => alive && setState({ loading: false, props, error: null }))
      .catch((error) => {
        // Error logged in centralized error handler
        alive && setState({ 
          loading: false, 
          props: {}, 
          error: error.message || 'Failed to load data. Please ensure the backend API is running' 
        });
      });

    return () => {
      alive = false;
    };
  }, [location.search, params, route, reloadToken]);

  if (state.loading) {
    return <Loading message="Loading admin data..." />;
  }

  if (state.error) {
    return <Error message={state.error} onRetry={() => window.location.reload()} />;
  }

  return (
    <PageProvider value={{ props: { ...state.props, auth: { user: { name: 'Kids Mela Admin', email: 'admin@kidsmela.local' } } }, url: `/admin${location.pathname === '/' ? '' : location.pathname}` }}>
      <RouterBridge />
      <Component {...state.props} />
    </PageProvider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={<RouteLoader route={route} />} />
      ))}
      <Route path="/admin" element={<Navigate to="/" replace />} />
      <Route path="/admin/*" element={<AdminPathRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AdminPathRedirect() {
  const location = useLocation();
  const path = location.pathname.replace(/^\/admin/, '') || '/';

  return <Navigate to={`${path}${location.search}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
