# THREAD & CO. — Modern Luxury Clothing Store

A full-stack, responsive luxury fashion e-commerce platform and administrative management system. Engineered for independent apparel labels and designed as a high-end freelance portfolio showcase.

---

## 1. Brand Identity & Visual Direction

- **Brand Name**: **THREAD & CO.**
- **Aesthetic**: Minimalist, architectural tailoring, refined editorial typography, generous whitespace, neutral palettes with rich obsidian (`#0F0E11`), warm creams (`#FAF9F5`), and muted golds (`#C5A880`).
- **Target Audience**: Discerning fashion collectors seeking timeless silhouettes, traceable natural fibers (Mongolian Cashmere, Virgin Melton Wool, Californian Supima Cotton), and modern luxury ready-to-wear.

---

## 2. Technology Stack

### Frontend (`frontend/` or `threads-ui/frontend`)
- **Framework**: React 18 with Vite (Pure JavaScript, no TypeScript on frontend as specified).
- **Styling**: Tailwind CSS with custom editorial typography (Inter & Playfair Display).
- **Navigation**: React Router DOM v6.
- **API Client**: Axios with centralized configuration and JWT request interceptors.
- **Icons**: Lucide React.
- **State Management**: React Context API (`CartContext` with localStorage synchronization and `AuthContext` for admin sessions).

### Backend (`backend/` or `threads-api`)
- **Framework**: NestJS 10 with TypeScript.
- **ORM**: Prisma ORM v5 with PostgreSQL.
- **Database**: PostgreSQL (relational models with foreign keys, indexes, unique constraints, and Decimal price precision).
- **Validation**: `class-validator` and `class-transformer` with strict whitelist filtering.
- **Authentication & Security**: Passport JWT, bcrypt password hashing, and role-based guards (`@Roles(Role.ADMIN)`).
- **Documentation**: Swagger OpenAPI interactive explorer at `/api/docs`.
- **Testing**: Jest unit and integration tests.

---

## 3. Project Structure

```text
threads/
├── frontend/                     # React + Vite application (threads-ui/frontend)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Footer, AnnouncementBar, CartDrawer, ProductCard
│   │   │   └── admin/            # AdminLayout, AdminHeader, AdminSidebar
│   │   ├── context/              # CartContext, AuthContext
│   │   ├── pages/                # HomePage, ShopPage, ProductDetailPage, CartPage,
│   │   │   │                     # CheckoutPage, OrderConfirmationPage, TrackOrderPage,
│   │   │   │                     # AboutPage, ContactPage, PolicyPage, NotFoundPage
│   │   │   └── admin/            # AdminLoginPage, AdminDashboardPage, AdminProductsPage,
│   │   │                         # AdminCategoriesPage, AdminOrdersPage, AdminMessagesPage
│   │   ├── services/             # api.js (Axios instance)
│   │   ├── App.jsx               # Client & Admin Route definitions
│   │   ├── index.css             # Tailwind base & custom animations
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                      # NestJS TypeScript API (threads-api)
│   ├── prisma/
│   │   ├── schema.prisma         # Relational schema (Users, Products, Variants, Orders, etc.)
│   │   ├── migrations/           # Applied Prisma database migrations
│   │   └── seed.ts               # Database seed script (18 fashion pieces, 5 categories, sample orders)
│   ├── src/
│   │   ├── auth/                 # Admin & user JWT auth, bcrypt hashing
│   │   ├── categories/           # Category catalog CRUD with deletion safety
│   │   ├── common/               # Guards, interceptors, filters, decorators
│   │   ├── contact/              # Contact inquiry handling
│   │   ├── dashboard/            # Admin KPI metrics and revenue calculations
│   │   ├── health/               # Database liveness check (/api/health)
│   │   ├── newsletter/           # Gazette subscriptions
│   │   ├── orders/               # Transactional orders with atomic inventory updates
│   │   ├── prisma/               # Global Prisma database service
│   │   ├── products/             # Product catalog filtering, search, pagination & CRUD
│   │   ├── app.module.ts
│   │   └── main.ts               # Swagger configuration, CORS, and ValidationPipe
│   ├── test/
│   ├── .env.example
│   ├── package.json
│   ├── nest-cli.json
│   └── tsconfig.json
├── .gitignore
└── README.md
```

---

## 4. Getting Started & Local Development

### Prerequisites
- Node.js `v18.0.0` or later (tested on Node v24)
- PostgreSQL `v14+` running on `localhost:5432`

---

### Step 1: Database Setup
1. Ensure PostgreSQL is active on your machine.
2. Create the database:
   ```bash
   psql -U postgres -c "CREATE DATABASE threads_db;"
   ```

---

### Step 2: Backend Setup (`backend/`)
1. Navigate to the backend directory:
   ```bash
   cd backend
   # or cd d:\projects\threads\threads-api
   ```
2. Configure `.env`:
   ```bash
   cp .env.example .env
   ```
   *Verify your connection string:*
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="postgresql://postgres:admin@localhost:5432/threads_db?schema=public"
   JWT_SECRET="thread-and-co-super-secret-jwt-key-change-in-production-2026"
   JWT_EXPIRES_IN="7d"
   CORS_ORIGIN="http://localhost:5173,http://localhost:3000"
   ADMIN_EMAIL="admin@threadandco.com"
   ADMIN_PASSWORD="AdminPassword123!"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run Prisma database migrations:
   ```bash
   npm run prisma:migrate
   ```
5. Seed realistic sample categories, 18 luxury products, and orders:
   ```bash
   npm run prisma:seed
   ```
6. Start the development API server:
   ```bash
   npm run start:dev
   ```
   - API endpoints live at: `http://localhost:5000/api`
   - Interactive Swagger API docs: `http://localhost:5000/api/docs`
   - Health status: `http://localhost:5000/api/health`

---

### Step 3: Frontend Setup (`frontend/`)
1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   # or cd d:\projects\threads\threads-ui\frontend
   ```
2. Configure `.env`:
   ```bash
   cp .env.example .env
   ```
   *Content:*
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:5173`.

---

## 5. Administrative Access & Credentials

The database seed automatically provisions an administrator account:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Store Administrator** | `admin@threadandco.com` | `AdminPassword123!` |

- **Admin Login Route**: `http://localhost:5173/admin/login`
- *Note:* A convenient **"Fill Credentials"** button is embedded directly into the login screen for rapid review during demonstrations.

---

## 6. Key Features & Business Logic

### Public Storefront
- **Home Page**: Hero fashion banner, featured collections, best-selling signatures, seasonal lookbook banner, brand manifesto, client testimonials, and newsletter subscription.
- **Product Catalog (`/shop`)**:
  - Filter by Category, Price Range ($), Size (`XS`, `S`, `M`, `L`, `XL`), and Color swatches.
  - Sorting options: Featured, Newest, Price: Low to High, Price: High to Low.
  - Server-side search by garment name or fabric composition.
  - Server-side pagination with URL query parameter synchronization.
- **Product Details (`/product/:slug`)**:
  - Multi-image gallery with thumbnail switcher.
  - Stock availability badges (*"In Stock"*, *"Low Stock: Only X pieces remaining"*, *"Sold Out"*).
  - Size and color selectors with quantity stepper enforcing stock limits.
  - Harmonious styling suggestions (related pieces from the same category).
- **Shopping Bag (`/cart` & Drawer)**:
  - Slide-in side drawer and dedicated full cart page.
  - Real-time free shipping progress bar ($300 threshold).
  - Promo voucher validation (`ATELIER10` gives 10% VIP discount).
- **Transactional Checkout (`/checkout`)**:
  - Form validation for customer name, email, phone, and shipping address.
  - Clear **"Portfolio Demo Checkout"** notice highlighting that no financial card charges will occur.
  - Idempotency key mechanism preventing duplicate submissions.
  - Automatic atomic inventory deduction in PostgreSQL.
- **Order Tracking (`/track-order`)**:
  - Secure lookup requiring both Order Number (`TC-2026-XXXXXX`) and billing email.
  - Visual 5-stage progress tracker: *Pending* → *Confirmed* → *Processing* → *Shipped* → *Delivered*.
- **Contact Concierge (`/contact`)**:
  - Inquiries are directly stored in the PostgreSQL database and manageable in the Admin portal.

### Admin Dashboard (`/admin`)
- **Performance Overview**:
  - Live KPIs: Total Sales Revenue, Total Orders, Active Catalog Count, Low-Stock Warnings.
  - Documented calculation rules: Revenue is computed strictly from eligible order statuses (`CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`). `PENDING` and `CANCELLED` orders are excluded.
  - 7-day revenue trend bar chart and latest orders table.
- **Product CRUD (`/admin/products`)**:
  - Add, edit, or delete garments.
  - Supports image URLs, categories, prices, optional discounts, stock counts, and featured/active flags.
- **Category CRUD (`/admin/categories`)**:
  - Add, edit, and delete categories.
  - Includes a safety guard preventing the deletion of any category with assigned products.
- **Order Management (`/admin/orders`)**:
  - Inspect detailed line items, snapshot purchase prices, and customer shipping details.
  - Update status through validated transitions.
  - **Stock Restoration**: Transitioning an order to `CANCELLED` automatically increments inventory counts back into the database.
- **Communications (`/admin/messages`)**:
  - Review customer inquiries, mark them as read, and view the subscriber list for the Private Gazette.

---

## 7. Testing & Quality Assurance

### Backend Automated Unit Tests
Run Jest unit tests covering authentication, catalog pagination, and transactional order validation:
```bash
cd backend
npm test
```
*Test suite includes 3 test suites, 9 tests with 100% pass rate.*

### Production Builds
Verify that both frontend and backend compile cleanly:
```bash
# Build backend:
cd backend
npm run build

# Build frontend:
cd frontend
npm run build
```

---

## 8. Deployment Architecture

### Frontend (Vercel / Netlify)
- **Root Directory**: `frontend/`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://your-backend-domain.com/api`

### Backend (Render / Railway)
- **Root Directory**: `backend/`
- **Build Command**: `npm run build && npx prisma migrate deploy`
- **Start Command**: `npm run start:prod`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `PORT`: `5000`
  - `DATABASE_URL`: `postgresql://<user>:<password>@<host>:<port>/<db>?sslmode=require`
  - `JWT_SECRET`: `<secure-random-64-char-string>`
  - `CORS_ORIGIN`: `https://your-frontend-domain.vercel.app`

---

## 9. License

This project is created for portfolio presentation and commercial demonstration purposes. All rights reserved.
