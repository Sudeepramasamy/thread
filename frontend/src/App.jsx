import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import AnnouncementBar from './components/common/AnnouncementBar';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/common/CartDrawer';

// Customer Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PolicyPage from './pages/PolicyPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Area
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';

function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#121214]">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <CartDrawer />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Customer Storefront Routes */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="product/:slug" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="track-order" element={<TrackOrderPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="policy/:type" element={<PolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Dashboard Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
      </Route>
    </Routes>
  );
}
