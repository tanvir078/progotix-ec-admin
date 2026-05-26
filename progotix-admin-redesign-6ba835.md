# Progotix Admin Panel Redesign Plan

This plan redesigns the existing Progotix admin panel into a professional, feature-rich ecommerce admin with improved UI/UX, modular architecture, and reusable components.

## Phase 0: Setup & Dependencies

- Install `lucide-react` for icons
- Install `recharts` for charts/analytics
- Update `tailwind.config.js` with custom colors and design tokens
- Configure custom color palette: Background #F4F7FB, Primary #0F172A, Success green, Warning amber, Danger red

## Phase 1: Reusable Component Library

Create `/src/components/ui/` directory with:

- **Button.jsx** - Primary, secondary, danger, ghost variants with sizes
- **Card.jsx** - Rounded-2xl, soft shadow, header/footer slots
- **Badge.jsx** - Status badges with color variants (pending, processing, shipped, delivered, cancelled, etc.)
- **Table.jsx** - Clean border, hover row, sortable headers, pagination
- **Modal.jsx** - Overlay, content, header, footer, close handler
- **FormInput.jsx** - Text, number, email, password with label, error states
- **Select.jsx** - Dropdown with label, error states, disabled state
- **EmptyState.jsx** - No data state with icon, message, action button
- **PageHeader.jsx** - Title, breadcrumb, actions slot
- **FilterBar.jsx** - Search input, filter selects, apply/reset buttons
- **StatCard.jsx** - KPI card with label, value, trend, link

## Phase 2: AdminLayout Redesign

Update `/src/components/AdminLayout.jsx`:

- **Sidebar**: 
  - Logo with Progotix branding
  - Expandable menu structure (18 menu items)
  - Submenu dropdowns for nested items
  - Active menu highlight with indicator
  - Collapsible on mobile
  - User profile section at bottom

- **Topbar**:
  - Page title with breadcrumb
  - Global search input
  - Notification bell with badge
  - Admin profile dropdown (avatar, name, logout)

- **Main Content**:
  - Background #F4F7FB
  - Consistent padding
  - Flash message area

- **Responsive**: Mobile hamburger menu, desktop fixed sidebar

## Phase 3: Dashboard Redesign

Update `/src/pages/AdminDashboard.jsx`:

- **KPI Cards** (top row):
  - Total Revenue (with trend)
  - Today Sales
  - Total Orders
  - Pending Orders
  - Products count
  - Low Stock alert
  - Customers count
  - Active Coupons

- **Charts Section** (using Recharts):
  - Sales Chart (line chart - daily/weekly/monthly)
  - Order Status Chart (pie/donut chart)
  - Payment Summary chart

- **Recent Orders Table**:
  - Order ID, Customer, Phone, Payment Method, Payment Status, Order Status, Total, Date
  - View Order action

- **Top Selling Products Table**:
  - Image, Product Name, Category, Stock, Units Sold, Sales
  - View Product action

- **Stock Alert Section**:
  - List of low stock products with quick action

- **Actions**: View Order, View Product, Export Report button

## Phase 4: Products Module Redesign

### Products List (`/src/pages/products/ProductsPage.jsx`)

- **KPI Cards**: Total Products, Categories, Low Stock, Catalog Value
- **FilterBar**: Search by name, category filter, stock status filter, status filter
- **Table Columns**: Image, Product Name, SKU, Category, Brand, Stock, Price, Discount Price, Status, Featured, Created Date
- **Row Actions**: View, Edit, Duplicate, Delete, Publish/Unpublish toggle, Stock Update quick action
- **Bulk Actions**: Select multiple, bulk delete, bulk publish/unpublish

### Add Product Form (`/src/pages/products/AddProductPage.jsx`)

- **Section-based form** (not long messy form):
  - Basic Information: Name, SKU, Category, Brand, Description
  - Pricing: Regular Price, Sale Price, Tax, Discount
  - Inventory: Stock Quantity, Low Stock Alert, Stock Status
  - Media: Main Image upload, Gallery Images
  - Shipping: Weight, Size, Delivery Charge
  - SEO: Meta Title, Meta Description, Slug
  - Status: Active/Draft toggle, Featured Product toggle

### Edit Product Form (`/src/pages/products/EditProductPage.jsx`)

- Same structure as Add Product with pre-filled data
- Keep existing API logic

## Phase 5: Orders Module Redesign

### Orders List (`/src/pages/orders/AdminOrdersPage.jsx`)

- **KPI Cards**: Total Orders, Pending, Processing, Shipped, Delivered, Cancelled, Total Revenue
- **FilterBar**: Search order/customer/phone, status filter, payment status filter, payment method filter, date range
- **Table Columns**: Order ID, Customer, Phone, Payment Method, Payment Status, Order Status, Total, Date
- **Row Actions**: View, Print Invoice, Change Status (dropdown), Cancel, Refund
- **Quick Status Update**: Inline status dropdown with immediate save

### Order Details (`/src/pages/orders/AdminOrderDetailsPage.jsx`)

- **Order Info Card**: Order ID, Date, Status, Payment Method, Payment Status
- **Customer Info Card**: Name, Email, Phone, Address
- **Items Table**: Product image, name, SKU, quantity, price, subtotal
- **Totals Section**: Subtotal, Tax, Shipping, Discount, Total
- **Timeline/Tracking**: Order status history with timestamps
- **Actions**: Change Status, Cancel Order, Refund, Print Invoice, Send Email

## Phase 6: Customers Module Redesign

### Customers List (`/src/pages/users/AdminUsersPage.jsx`)

- **KPI Cards**: Total Customers, Active, Inactive, Total Orders, Total Spend
- **FilterBar**: Search name/email/phone, status filter, date filter
- **Table Columns**: Name, Email, Phone, Total Orders, Total Spend, Status, Joined Date
- **Row Actions**: View Profile, Order History, Wallet/Balance, Address Book, Block/Unblock

### Customer Profile (new page `/src/pages/users/CustomerProfile.jsx`)

- **Profile Card**: Avatar, name, email, phone, status
- **Stats Card**: Total Orders, Total Spend, Average Order Value
- **Order History Table**: Order ID, Date, Status, Total
- **Wallet/Balance Section**: Current balance, transaction history
- **Address Book**: List of addresses with edit/delete

## Phase 7: Settings Module Redesign

### Settings Page (`/src/pages/settings/AdminSettingsPage.jsx`)

- **Tabbed Interface**:
  - **General Settings**: Store name, logo, currency, timezone, language
  - **Store Information**: Address, phone, email, social links
  - **Payment Gateway**: Enable/disable methods, API keys, configuration
  - **Shipping Settings**: Free shipping threshold, delivery zones, rates
  - **Tax Settings**: Tax rate, tax inclusive/exclusive, tax classes
  - **Email/SMS Settings**: SMTP configuration, SMS gateway, templates
  - **SEO Settings**: Meta title, description, keywords, robots.txt
  - **Admin Profile**: Name, email, password change, avatar
  - **Role Permissions**: Role list, permission matrix

- **Form Sections**: Grouped settings with save buttons per section

## Phase 8: Additional Modules (Future)

After core modules are stable, add:

- **Brands Module**: List, Add, Edit with logo, description
- **Inventory/Stock Module**: Stock Overview, Low Stock, Stock Adjustment, Stock History
- **Coupons/Offers Module**: Coupon List, Add Coupon, Flash Sale, Campaign
- **Banners/Sliders Module**: Banner List, Add Banner with position management
- **Reviews & Ratings Module**: Review list, moderation, respond to reviews
- **Shipping/Delivery Module**: Delivery zones, rates, tracking integration
- **Reports/Analytics Module**: Sales, Order, Product, Customer, Payment, Stock reports with filters
- **Notifications Module**: Notification list, send notification, templates
- **Content/Pages Module**: CMS pages, FAQs, blog posts
- **Staff/Roles Module**: Staff management, role-based access control

## Design System

### Colors
- Background: #F4F7FB
- Sidebar: White or Dark Navy (#0F172A)
- Primary Button: #0F172A
- Success: Green (#10B981)
- Warning: Amber (#F59E0B)
- Danger: Red (#EF4444)
- Card: White, rounded-2xl, soft shadow
- Table: Clean border, hover row

### Typography
- Headings: font-black, tight tracking
- Labels: font-black, uppercase, small
- Body: font-semibold/medium

### Components
- All cards: rounded-2xl, soft shadow, white background
- Buttons: rounded-xl, smooth transitions
- Inputs: rounded-xl, focus states
- Tables: clean borders, hover rows, sticky headers

## Implementation Notes

- Keep all existing API logic and routes intact
- Preserve existing data flow from `apiRequest`
- Use existing `inertiaCompat` library for navigation
- Maintain backward compatibility with backend
- All forms keep existing field names and structure
- Only UI/UX changes, no business logic changes
- Test each module before moving to next
- Keep component exports for reuse across modules
