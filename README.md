# 💊 MediStore - Frontend (Complete Documentation)

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=zustand&logoColor=white)](https://zustand-demo.pmnd.rs/)

A high-performance, beautifully designed pharmaceutical e-commerce frontend built with Next.js 16, React 19, and modern web technologies. Provides seamless experiences for customers, powerful dashboards for sellers, and comprehensive oversight for administrators.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Project Structure](#project-structure)
5. [Installation & Setup](#installation--setup)
6. [Environment Configuration](#environment-configuration)
7. [Getting Started](#getting-started)
8. [Design System](#design-system)
9. [State Management](#state-management)
10. [Data Fetching](#data-fetching)
11. [Pages & Routes](#pages--routes)
12. [Components](#components)
13. [Hooks](#hooks)
14. [Services](#services)
15. [Store Architecture](#store-architecture)
16. [Authentication Flow](#authentication-flow)
17. [API Integration](#api-integration)
18. [Development Guide](#development-guide)
19. [Performance Optimization](#performance-optimization)
20. [Deployment](#deployment)
21. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**MediStore Frontend** is a modern, responsive web application that serves as the face of our pharmaceutical e-commerce platform. It provides:

- **Customer Portal**: Browse, search, and purchase medicines with smooth checkout
- **Seller Dashboard**: Manage products, track orders, and monitor earnings
- **Admin Dashboard**: System oversight, analytics, and user management
- **Real-time Features**: Live cart updates, order status tracking
- **Mobile-First Design**: Optimized for all screen sizes
- **Performance**: Fast page loads with Next.js optimization
- **Security**: Token-based authentication with refresh mechanisms

The application follows modern React patterns with:

- Server-side rendering for SEO
- Static generation for performance
- Client-side hydration
- Progressive enhancement

---

## 🛠️ Tech Stack

| Layer                | Technology                   | Version |
| -------------------- | ---------------------------- | ------- |
| **Framework**        | Next.js                      | 16.1.6  |
| **Runtime**          | React                        | 19.2.3  |
| **Language**         | TypeScript                   | 5.x     |
| **Styling**          | Tailwind CSS                 | 4       |
| **UI Components**    | Radix UI, Headless UI        | Latest  |
| **State Management** | Zustand                      | 5.0.10  |
| **Data Fetching**    | TanStack Query (React Query) | 5.90.20 |
| **Forms**            | React Hook Form              | 7.71.1  |
| **Form Validation**  | Zod                          | 4.3.6   |
| **HTTP Client**      | Axios                        | 1.13.4  |
| **Charts**           | Recharts                     | 3.7.0   |
| **Icons**            | Lucide React                 | 0.563.0 |
| **Animations**       | Framer Motion                | 12.30.0 |
| **Notifications**    | Sonner, React Hot Toast      | Latest  |
| **Payments**         | Stripe                       | 8.7.0   |
| **Date Handling**    | date-fns                     | 4.1.0   |
| **Themes**           | next-themes                  | 0.4.6   |

---

## ✨ Features

### 👥 Customer Features

#### 🏪 Shopping Experience

- **Product Catalog**: Browse all medicines with descriptions and pricing
- **Smart Search**: Real-time search with filtering and sorting
- **Category Navigation**: Browse by medicine categories
- **Product Details**: Full information including manufacturer, expiry date
- **Medicine Images**: High-quality product images from Cloudinary CDN
- **Ratings & Reviews**: See customer reviews and ratings
- **Stock Indicators**: Real-time stock availability

#### 🛒 Shopping Cart

- **Add to Cart**: One-click addition of items
- **Cart Management**: View, edit quantities, remove items
- **Persistent Cart**: Cart saved across sessions
- **Stock Validation**: Alerts if items become out of stock
- **Price Updates**: Real-time pricing calculations
- **Bulk Actions**: Add multiple items at once

#### ❤️ Wishlist

- **Save for Later**: Add medicines to wishlist
- **Wishlist Management**: View saved items anytime
- **Move to Cart**: Quick action to purchase wishlist items
- **Persistent Storage**: Wishlist saved to account

#### 💳 Checkout & Payment

- **Multi-Step Checkout**: Guided purchasing process
- **Shipping Address**: Manage multiple delivery addresses
- **Address Validation**: Verify and select delivery address
- **Payment Methods**:
  - **Stripe Integration**: Credit/debit card payments
  - **Cash on Delivery**: Pay after delivery option
- **Order Summary**: Review items before purchase
- **Order Confirmation**: Instant confirmation and email receipt

#### 📦 Orders

- **Order History**: View all past orders
- **Order Tracking**: Real-time status updates
- **Order Details**: View items, prices, and delivery info
- **Return Requests**: Initiate returns for issues
- **Order Cancellation**: Cancel orders if eligible

#### ⭐ Reviews & Ratings

- **Leave Reviews**: Post reviews after purchase
- **Star Ratings**: Rate from 1-5 stars
- **Review Visibility**: See reviews from other customers
- **Helpful Votes**: Mark reviews as helpful
- **Moderation**: Review quality control

#### 👤 My Account

- **Profile Management**: Update name, email, contact
- **Address Book**: Save and manage multiple addresses
- **Order History**: View all orders and status
- **Wishlist**: Access saved items
- **Payment Methods**: Manage stored payment methods
- **Account Settings**: Update preferences and password

### 🏢 Seller Features

#### 📊 Seller Dashboard

- **Sales Overview**: Total sales, revenue, and orders
- **Revenue Analytics**: 7-day revenue chart
- **Product Performance**: Top-selling medicines
- **KPI Cards**: Quick stats on key metrics
- **Interactive Charts**: Recharts-powered visualizations

#### 📦 Product Management

- **Add Products**: Create new medicine listings
- **Edit Products**: Update product details
- **Manage Stock**: Update inventory levels
- **Upload Images**: Add product images with CDN delivery
- **Bulk Upload**: Add multiple products at once
- **Product Categories**: Organize by category
- **Pricing Management**: Set and adjust prices

#### 📋 Order Management

- **Order List**: View all orders for your products
- **Order Filtering**: Filter by status, date, etc.
- **Order Details**: Full order information
- **Status Updates**: Update order shipment status
- **Customer Communication**: Message customers
- **Packing Slips**: Generate packing slips

#### 💰 Earnings & Payouts

- **Earnings Tracking**: View total earnings
- **Transaction History**: Detailed payment history
- **Payout Management**: Request and track payouts
- **Withdrawal Methods**: Multiple payout options

#### 📊 Analytics

- **Sales Trends**: 7-day and monthly sales charts
- **Top Products**: Best-selling medicines
- **Customer Insights**: Purchase patterns
- **Revenue Metrics**: Daily, weekly, monthly breakdowns

### 🛡️ Admin Features

#### 📊 Admin Dashboard

- **System Overview**: High-level system statistics
- **Revenue Dashboard**: Total revenue, sales volume
- **User Analytics**: New users, active users
- **Order Statistics**: Total orders, fulfillment rate
- **Top Products**: Most popular medicines
- **Interactive Analytics**: Charts and data visualization

#### 👥 User Management

- **View All Users**: List of all system users
- **User Details**: Full user information
- **Ban/Unban Users**: Manage user access
- **Search & Filter**: Find users by email, name
- **User Statistics**: User growth over time

#### 💊 Medicine Management

- **Approve Products**: Review and approve seller products
- **Remove Products**: Delete inappropriate items
- **Category Management**: Create and manage categories
- **Price Oversight**: Monitor pricing
- **Stock Monitoring**: Track inventory levels
- **Product Analytics**: Usage and sales data

#### 📦 Order Management

- **View All Orders**: System-wide order view
- **Order Status**: Update order statuses
- **Dispute Resolution**: Handle customer issues
- **Refund Management**: Process refunds
- **Shipping Integration**: Track shipments

#### ⚙️ System Settings

- **System Configuration**: Backend connection settings
- **Email Configuration**: Email service setup
- **Payment Settings**: Stripe configuration
- **Site Settings**: General site configuration
- **Security Settings**: API keys and secrets

---

## 📁 Project Structure

```
medi-store-frontend/
│
├── app/                                # Next.js App Router
│   ├── layout.tsx                      # Root layout wrapper
│   ├── page.tsx                        # Home/index page
│   ├── providers.tsx                   # Context providers setup
│   ├── sitemap.ts                      # SEO sitemap
│   ├── globals.css                     # Global styles
│   │
│   ├── (public)/                       # Public routes group
│   │   ├── page.tsx
│   │   ├── medicine/                   # Medicine catalog
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Medicine details
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   └── features/
│   │       └── page.tsx
│   │
│   ├── account/                        # Customer account routes
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Dashboard
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Order details
│   │   ├── wishlist/
│   │   │   └── page.tsx
│   │   ├── addresses/
│   │   │   └── page.tsx
│   │   └── returns/
│   │       └── page.tsx
│   │
│   ├── seller/                         # Seller dashboard routes
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Seller dashboard
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx            # Add product
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Edit product
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── earnings/
│   │   │   └── page.tsx
│   │   └── analytics/
│   │       └── page.tsx
│   │
│   ├── admin/                          # Admin dashboard routes
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Admin dashboard
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── medicines/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── categories/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── analytics/
│   │       └── page.tsx
│   │
│   ├── shipping/
│   │   └── page.tsx
│   │
│   ├── returns/
│   │   └── page.tsx
│   │
│   ├── customer/
│   │   └── page.tsx
│   │
│   └── api/                            # API routes
│       ├── auth/                       # Authentication endpoints
│       │   ├── login/route.ts
│       │   ├── register/route.ts
│       │   └── logout/route.ts
│       ├── cart/                       # Cart API
│       │   └── route.ts
│       ├── users/                      # User API
│       │   └── route.ts
│       └── wishlist/                   # Wishlist API
│           └── route.ts
│
├── components/                         # Reusable components
│   ├── theme-provider.tsx              # Dark mode provider
│   ├── home/                           # Home page components
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── CategoriesSection.tsx
│   │   └── ...
│   ├── layout/                         # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Navigation.tsx
│   │   └── MobileMenu.tsx
│   ├── medicine/                       # Medicine components
│   │   ├── MedicineCard.tsx
│   │   ├── MedicineGrid.tsx
│   │   ├── MedicineFilter.tsx
│   │   ├── MedicineSearch.tsx
│   │   ├── MedicineDetails.tsx
│   │   └── ReviewSection.tsx
│   ├── cart/                           # Cart components
│   │   ├── CartHeader.tsx
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── EmptyCart.tsx
│   ├── checkout/                       # Checkout components
│   │   ├── ShippingAddress.tsx
│   │   ├── PaymentMethod.tsx
│   │   ├── OrderReview.tsx
│   │   └── CheckoutSteps.tsx
│   ├── auth/                           # Authentication components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── AuthGuard.tsx
│   ├── admin/                          # Admin dashboard components
│   │   ├── AdminHeader.tsx
│   │   ├── UserTable.tsx
│   │   ├── OrderTable.tsx
│   │   ├── AnalyticsChart.tsx
│   │   └── StatsCard.tsx
│   ├── dashboard/                      # Dashboard components
│   │   ├── DashboardCard.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── OrdersChart.tsx
│   │   └── StatsOverview.tsx
│   ├── seller/                         # Seller dashboard components
│   │   ├── ProductForm.tsx
│   │   ├── ProductTable.tsx
│   │   ├── OrderList.tsx
│   │   └── EarningsChart.tsx
│   ├── MyAccount/                      # Account management
│   │   ├── ProfileForm.tsx
│   │   ├── AddressForm.tsx
│   │   ├── AddressList.tsx
│   │   └── OrderHistory.tsx
│   ├── order/                          # Order components
│   │   ├── OrderCard.tsx
│   │   ├── OrderTimeline.tsx
│   │   ├── OrderStatus.tsx
│   │   └── InvoicePreview.tsx
│   └── ui/                             # Base UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Alert.tsx
│       ├── Spinner.tsx
│       ├── Skeleton.tsx
│       ├── Tabs.tsx
│       ├── Dialog.tsx
│       └── ...
│
├── hooks/                              # Custom React hooks
│   ├── index.ts                        # Hook exports
│   ├── useAuth.ts                      # Authentication hook
│   ├── useCart.ts                      # Cart operations
│   ├── useMedicines.ts                 # Fetch medicines
│   ├── useCategories.ts                # Fetch categories
│   ├── useOrders.ts                    # Fetch orders
│   ├── useReviews.ts                   # Review operations
│   ├── useWishlist.ts                  # Wishlist operations
│   ├── useAdminUsers.ts                # Admin user management
│   ├── useAdminOrders.ts               # Admin order management
│   ├── useAdminMedicines.ts            # Admin medicine management
│   ├── useAdminCategories.ts           # Admin category management
│   ├── useUsers.ts                     # User operations
│   ├── useSellerOrders.ts              # Seller order management
│   └── [other custom hooks]
│
├── services/                           # API services
│   ├── auth.service.ts                 # Authentication API calls
│   ├── medicine.service.ts             # Medicine API calls
│   ├── category.service.ts             # Category API calls
│   ├── cart.service.ts                 # Cart API calls
│   ├── order.service.ts                # Order API calls
│   ├── review.service.ts               # Review API calls
│   ├── user.service.ts                 # User API calls
│   ├── address.service.ts              # Address API calls
│   ├── wishlist.service.ts             # Wishlist API calls
│   └── admin.service.ts                # Admin API calls
│
├── store/                              # Zustand state management
│   ├── index.ts                        # Store exports
│   ├── auth.store.ts                   # Authentication state
│   ├── cart.store.ts                   # Cart state
│   ├── ui.store.ts                     # UI state (theme, modals)
│   ├── wishlist.store.ts               # Wishlist state
│   └── [other stores]
│
├── lib/                                # Utility libraries
│   ├── axios.ts                        # Axios configuration
│   ├── query-client.ts                 # TanStack Query setup
│   ├── formatCurrency.ts               # Currency formatting
│   ├── utils.ts                        # General utilities
│   └── image-url.ts                    # Image URL utilities
│
├── providers/                          # Context providers
│   └── QueryProvider.tsx               # React Query provider
│
├── types/                              # TypeScript types
│   ├── index.ts
│   ├── api.types.ts                    # API response types
│   ├── medicine.types.ts               # Medicine types
│   ├── order.types.ts                  # Order types
│   ├── cart.types.ts                   # Cart types
│   ├── user.types.ts                   # User types
│   ├── address.types.ts                # Address types
│   └── wishlist.types.ts               # Wishlist types
│
├── utils/                              # Utility functions
│   ├── cn.ts                           # Class name merging
│   ├── env.ts                          # Environment variables
│   ├── image-url.ts                    # Image utilities
│   └── auth/                           # Auth utilities
│
├── public/                             # Static assets
│   ├── medical-banner.avif
│   ├── robots.txt
│   └── [images and icons]
│
├── .eslintrc.json                      # ESLint configuration
├── next.config.ts                      # Next.js configuration
├── tsconfig.json                       # TypeScript configuration
├── tailwind.config.js                  # Tailwind configuration
├── postcss.config.mjs                  # PostCSS configuration
├── middleware.ts                       # Next.js middleware
├── components.json                     # Component setup config
├── package.json                        # Dependencies
├── .env.example                        # Environment template
├── .env.local                          # Local environment
└── README.md                           # This file
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher (or yarn/pnpm)
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Step 1: Clone the Repository

```bash
git clone https://github.com/ahbab-zaman/medi-store-frontend.git
cd medi-store-frontend
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

### Step 4: Configure Environment Variables

Update `.env.local` with your values:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_CLOUDINARY_NAME=your-cloudinary-name
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Verification

- Homepage loads without errors
- Navigation works between pages
- API calls attempt to backend (may fail if backend not running)

---

## ⚙️ Environment Configuration

### `.env.local` Variables

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Frontend URL (for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (Payment Gateway)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret

# Cloudinary (Image Storage)
NEXT_PUBLIC_CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_SELLER_DASHBOARD=true
NEXT_PUBLIC_ENABLE_ADMIN_PANEL=true
NEXT_PUBLIC_ENABLE_REVIEWS=true

# Logging
NEXT_PUBLIC_LOG_LEVEL=debug

# Analytics (optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G_...
```

### Public vs Secret Environment Variables

- **NEXT*PUBLIC*\***: Exposed to browser (use for public data only)
- **Others**: Server-side only (use for secrets)

---

## 🏃 Getting Started

### First-Time Setup Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Backend running (`npm run dev` on backend)
- [ ] Development server started (`npm run dev`)
- [ ] Homepage loads without errors

### Quick Navigation

- **Home**: `http://localhost:3000/`
- **Browse Medicines**: `http://localhost:3000/medicine`
- **Login**: `http://localhost:3000/login`
- **Register**: `http://localhost:3000/register`
- **Cart**: `http://localhost:3000/cart`
- **Account**: `http://localhost:3000/account`
- **Seller Dashboard**: `http://localhost:3000/seller`
- **Admin Dashboard**: `http://localhost:3000/admin`

---

## 🎨 Design System

### Colors

```
Primary: #4f46e5 (Indigo)
Secondary: #10b981 (Emerald)
Danger: #ef4444 (Red)
Warning: #f59e0b (Amber)
Success: #10b981 (Green)
Background: #ffffff / #0f172a (dark)
Text: #1f2937 / #f3f4f6 (dark)
```

### Typography

- **Headings**: Outfit font family
- **Body**: Inter font family
- **Font Sizes**: 12px - 48px scale

### Components

All components use:

- **Tailwind CSS** for styling
- **Radix UI** for accessible primitives
- **Lucide React** for icons
- **Framer Motion** for animations

### Responsive Breakpoints

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

---

## 🎯 State Management

### Zustand Stores

**Auth Store** - User authentication state

```typescript
// Get current user
const user = useAuthStore((state) => state.user);

// Login
const login = useAuthStore((state) => state.login);

// Logout
const logout = useAuthStore((state) => state.logout);
```

**Cart Store** - Shopping cart management

```typescript
// Get cart items
const items = useCartStore((state) => state.items);

// Add to cart
const addItem = useCartStore((state) => state.addItem);

// Remove from cart
const removeItem = useCartStore((state) => state.removeItem);
```

**Wishlist Store** - Saved items

```typescript
// Get wishlist
const wishlist = useWishlistStore((state) => state.items);

// Add to wishlist
const addItem = useWishlistStore((state) => state.addItem);

// Remove from wishlist
const removeItem = useWishlistStore((state) => state.removeItem);
```

**UI Store** - Application UI state

```typescript
// Get theme
const theme = useUIStore((state) => state.theme);

// Toggle theme
const toggleTheme = useUIStore((state) => state.toggleTheme);

// Modal state
const isModalOpen = useUIStore((state) => state.isModalOpen);
```

---

## 📡 Data Fetching

### TanStack Query (React Query)

Used for server-state management:

```typescript
// Fetch medicines
const { data, isLoading, error } = useQuery({
  queryKey: ["medicines"],
  queryFn: () => fetchMedicines(),
});

// Fetch with parameters
const { data: orders } = useQuery({
  queryKey: ["orders", userId],
  queryFn: () => fetchUserOrders(userId),
  enabled: !!userId, // Only run when userId exists
});

// Mutations (POST, PUT, DELETE)
const mutation = useMutation({
  mutationFn: (data) => createOrder(data),
  onSuccess: () => {
    toast.success("Order created!");
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  },
});
```

### Query Invalidation

```typescript
// Refetch data after mutation
queryClient.invalidateQueries({ queryKey: ["medicines"] });

// Refetch specific query
queryClient.refetchQueries({ queryKey: ["orders", userId] });
```

---

## 📄 Pages & Routes

### Public Routes

```
/                    - Home page
/medicine            - Medicine catalog
/medicine/:id        - Medicine details
/about               - About page
/contact             - Contact page
/features            - Features page
/cart                - Shopping cart
/checkout            - Checkout process
/login               - User login
/register            - User registration
/shipping            - Shipping info
/returns             - Returns policy
/customer            - Customer info
```

### Customer Routes (Protected)

```
/account             - Customer dashboard
/account/profile     - Profile management
/account/orders      - Order history
/account/orders/:id  - Order details
/account/wishlist    - Saved items
/account/addresses   - Address book
/account/returns     - Return requests
```

### Seller Routes (Protected)

```
/seller              - Seller dashboard
/seller/products     - Product list
/seller/products/new - Add product
/seller/products/:id - Edit product
/seller/orders       - Order management
/seller/orders/:id   - Order details
/seller/earnings     - Revenue tracking
/seller/analytics    - Sales analytics
```

### Admin Routes (Protected)

```
/admin               - Admin dashboard
/admin/users         - User management
/admin/users/:id     - User details
/admin/medicines     - Medicine management
/admin/medicines/:id - Medicine details
/admin/orders        - Order overview
/admin/orders/:id    - Order details
/admin/categories    - Category management
/admin/analytics     - System analytics
```

---

## 🧩 Components

### Layout Components

**Header** - Main navigation

- Logo and branding
- Search bar
- Navigation menu
- User menu
- Cart icon

**Footer** - Page footer

- Links
- Contact info
- Social media
- Newsletter signup

**Sidebar** - Dashboard sidebar

- Navigation links
- User info
- Logout button

### Medicine Components

**MedicineCard** - Product display

- Image
- Name and price
- Rating
- Stock status
- Add to cart button

**MedicineGrid** - Grid layout

- Responsive columns
- Lazy loading
- Pagination

**MedicineFilter** - Filtering

- Category filter
- Price range
- Rating filter
- In-stock only

**MedicineSearch** - Search functionality

- Real-time search
- Suggestions
- Filter integration

### Cart Components

**CartItem** - Individual cart item

- Product info
- Quantity selector
- Price
- Remove button

**CartSummary** - Order summary

- Subtotal
- Tax
- Shipping
- Total price
- Checkout button

### Checkout Components

**ShippingAddress** - Address selection

- Saved addresses list
- Add new address
- Select default

**PaymentMethod** - Payment selection

- Stripe integration
- COD option
- Payment form

**OrderReview** - Order confirmation

- Items review
- Address confirmation
- Payment method review
- Order placement button

### Auth Components

**LoginForm** - User login

- Email input
- Password input
- Remember me
- Forgot password link

**RegisterForm** - User registration

- Name input
- Email input
- Password input
- Confirm password
- Terms agreement

**ProtectedRoute** - Route protection

- Check authentication
- Check user role
- Redirect if unauthorized

### Dashboard Components

**StatsCard** - Stat display

- Icon
- Stat name
- Value
- Change indicator

**RevenueChart** - Revenue visualization

- 7-day chart
- Line chart
- Tooltip

**OrdersChart** - Order statistics

- Order count
- Status breakdown
- Bar chart

---

## 🪝 Hooks

### Custom Hooks

**useAuth** - Authentication management

```typescript
const { user, isLoading, login, logout, register } = useAuth();
```

**useCart** - Cart operations

```typescript
const { items, total, addItem, removeItem } = useCart();
```

**useMedicines** - Fetch medicines

```typescript
const { medicines, isLoading, error } = useMedicines(filters);
```

**useOrders** - Order management

```typescript
const { orders, isLoading } = useOrders(userId);
```

**useWishlist** - Wishlist operations

```typescript
const { items, addItem, removeItem } = useWishlist();
```

### Built-in Hooks Usage

```typescript
// useState for component state
const [count, setCount] = useState(0);

// useEffect for side effects
useEffect(() => {
  // Effect code
}, [dependencies]);

// useContext for context access
const theme = useContext(ThemeContext);

// useReducer for complex state
const [state, dispatch] = useReducer(reducer, initialState);

// useCallback for memoized functions
const memoizedCallback = useCallback(() => {
  // Function code
}, [dependencies]);

// useMemo for memoized values
const memoizedValue = useMemo(() => {
  return calculateValue();
}, [dependencies]);

// useRef for refs
const inputRef = useRef(null);
```

---

## 🔌 Services

### API Services

Each service file handles API calls for a specific domain:

**auth.service.ts**

```typescript
export const register = (data) => axios.post("/auth/register", data);
export const login = (data) => axios.post("/auth/login", data);
export const logout = () => axios.post("/auth/logout");
```

**medicine.service.ts**

```typescript
export const getMedicines = (filters) =>
  axios.get("/medicines", { params: filters });
export const getMedicineById = (id) => axios.get(`/medicines/${id}`);
export const createMedicine = (data) => axios.post("/medicines", data);
```

**cart.service.ts**

```typescript
export const getCart = () => axios.get("/cart");
export const addToCart = (medicineId, quantity) =>
  axios.post("/cart/add", { medicineId, quantity });
export const removeFromCart = (medicineId) =>
  axios.delete(`/cart/remove/${medicineId}`);
```

---

## 🏪 Store Architecture

### Store Structure

```typescript
// Example store
import { create } from "zustand";

interface IAuthStore {
  user: IUser | null;
  isAuthenticated: boolean;
  login: (credentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (credentials) => {
    const response = await login(credentials);
    set({ user: response.data, isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
```

---

## 🔐 Authentication Flow

### Login Workflow

```
1. User enters email and password
2. Submit login form
3. API call to backend
4. Backend validates credentials
5. Return access token and refresh token
6. Store tokens (localStorage + cookies)
7. Store user data in Zustand
8. Redirect to dashboard/home
9. Set up token refresh mechanism
```

### Token Refresh Mechanism

```typescript
// axios interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try refresh
      const newToken = await refreshToken();
      // Retry original request
      return api(error.config);
    }
    return Promise.reject(error);
  },
);
```

### Protected Route Example

```typescript
function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading]);

  if (isLoading) return <Spinner />;
  if (!user) return null;

  return children;
}
```

---

## 🌐 API Integration

### Axios Configuration

```typescript
// lib/axios.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### API Error Handling

```typescript
try {
  const response = await api.get("/medicines");
  setMedicines(response.data);
} catch (error) {
  if (error.response?.status === 401) {
    // Unauthorized
    redirectToLogin();
  } else if (error.response?.status === 403) {
    // Forbidden
    showPermissionError();
  } else if (error.response?.status === 404) {
    // Not found
    showNotFoundError();
  } else {
    // Generic error
    showError(error.message);
  }
}
```

---

## 👨‍💻 Development Guide

### Code Style

```typescript
// Use TypeScript strict mode
// Follow naming conventions:
// - Files: kebab-case (medicine-card.tsx)
// - Components: PascalCase (MedicineCard)
// - Functions: camelCase (getMedicines)
// - Constants: UPPER_SNAKE_CASE (MAX_FILE_SIZE)

// Use functional components with hooks
export function MedicineCard({ medicine }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  return <div>{medicine.name}</div>;
}

// Use proper TypeScript typing
interface Props {
  medicine: IMedicine;
  onAdd: (id: string) => void;
}

// Use async/await, not .then()
async function fetchData() {
  try {
    const data = await api.get("/data");
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}
```

### Adding a New Page

1. Create page file in `app/` folder:

   ```bash
   touch app/new-page/page.tsx
   ```

2. Create page component:

   ```typescript
   export default function NewPage() {
     return <div>New Page</div>;
   }
   ```

3. Add to navigation if needed

### Adding a New Component

1. Create component file in `components/` folder
2. Export component
3. Use in pages/other components

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/add-payment

# Make changes
git add .
git commit -m "feat: add stripe payment integration"

# Push branch
git push origin feature/add-payment

# Create pull request
```

---

## ⚡ Performance Optimization

### Image Optimization

```typescript
import Image from "next/image";

<Image
  src="/medicine.jpg"
  alt="Medicine"
  width={400}
  height={300}
  priority={false}
  loading="lazy"
/>
```

### Code Splitting

```typescript
// Dynamic import for large components
const AdminPanel = dynamic(() => import("./AdminPanel"), {
  loading: () => <Spinner />,
});
```

### Caching Strategies

```typescript
// Cache API responses
const { data } = useQuery({
  queryKey: ["medicines"],
  queryFn: fetchMedicines,
  staleTime: 1000 * 60 * 5, // 5 minutes
  cacheTime: 1000 * 60 * 10, // 10 minutes
});
```

### Lazy Loading

```typescript
// Lazy load routes
const CheckoutPage = lazy(() => import("./checkout/page"));

// Lazy load components
const Chart = lazy(() => import("recharts"));
```

---

## 🚀 Deployment

### Deployment Checklist

- [ ] Environment variables configured
- [ ] API URLs updated for production
- [ ] Stripe keys configured
- [ ] Images optimized
- [ ] Analytics configured
- [ ] Error tracking setup
- [ ] Performance monitoring

### Deploy to Vercel

```bash
# Push to main branch (automatic deployment)
git push origin main

# Or deploy using Vercel CLI
vercel deploy --prod
```

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://api.medistore.com/api
NEXT_PUBLIC_APP_URL=https://medistore.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLOUDINARY_NAME=production-account
```

---

## 🐛 Troubleshooting

### Build Errors

**Error**: `Module not found`

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Error**: `TypeScript compilation failed`

```bash
# Check TypeScript errors
npx tsc --noEmit

# Fix errors in relevant files
```

### Runtime Errors

**Error**: `Cannot read property 'X' of undefined`

- Check data is loaded before rendering
- Add loading state
- Add default values

**Error**: `Hydration mismatch`

- Check server-rendered and client-rendered content match
- Use `useEffect` for client-only code
- Use `dynamic` import for client-only components

### API Connection Issues

**Error**: `Network error`

- Check backend is running
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS configuration on backend

**Error**: `401 Unauthorized`

- Check if token is stored
- Verify token expiration
- Attempt token refresh

### Performance Issues

**Slow page load**:

- Check Network tab in DevTools
- Use Next.js Performance APIs
- Optimize images
- Enable caching

**High memory usage**:

- Check for memory leaks
- Use React DevTools Profiler
- Optimize large lists with virtualization

---

## 📚 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint

# Database
npx prisma studio       # Open Prisma Studio (if used)

# Git
git status              # Check status
git add .               # Stage all
git commit -m "msg"     # Commit
git push                # Push changes
```

---

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)
- [Stripe Documentation](https://stripe.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

---

## 📝 License

MIT License - See LICENSE file

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Email: support@medistore.com
- Check existing documentation

---

**Last Updated**: June 2026
**Maintainer**: MediStore Frontend Team
