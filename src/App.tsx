
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ThankYou from './pages/ThankYou';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import NewProduct from './pages/admin/NewProduct';
import EditProduct from './pages/admin/EditProduct';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import Analytics from './pages/admin/Analytics';
import Design from './pages/admin/Design';
import Settings from './pages/admin/Settings';
import Profile from './pages/admin/Profile';
import Racunovodstvo from './pages/admin/Racunovodstvo';
import Fakture from './pages/admin/Fakture';
import NovaFaktura from './pages/admin/NovaFaktura';
import NoviPredracun from './pages/admin/NoviPredracun';
import NoviObracun from './pages/admin/NoviObracun';
import Transakcije from './pages/admin/Transakcije';
import BrziLink from './pages/admin/BrziLink';
import Storefront from './pages/store/Storefront';
import CustomPage from './pages/CustomPage';
import PublicDocument from './pages/public/PublicDocument';
import PaymentLink from './pages/payment/PaymentLink';
import NewCustomer from './pages/admin/NewCustomer';
import CustomerDetail from './pages/admin/CustomerDetail';
import EditCustomer from './pages/admin/EditCustomer';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/custom/:pageSlug" element={<CustomPage />} />
            
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<NewProduct />} />
            <Route path="/products/edit/:productId" element={<EditProduct />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/new" element={<NewCustomer />} />
            <Route path="/customers/:customerId" element={<CustomerDetail />} />
            <Route path="/customers/edit/:customerId" element={<EditCustomer />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/design" element={<Design />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/racunovodstvo" element={<Racunovodstvo />} />
            <Route path="/fakture" element={<Fakture />} />
            <Route path="/racunovodstvo/fakture/nova" element={<NovaFaktura />} />
            <Route path="/racunovodstvo/predracuni/novi" element={<NoviPredracun />} />
            <Route path="/racunovodstvo/obracuni/novi" element={<NoviObracun />} />
            <Route path="/transakcije" element={<Transakcije />} />
            <Route path="/brzilink" element={<BrziLink />} />
            
            {/* Store */}
            <Route path="/store/:storeId" element={<Storefront />} />
            <Route path="/store/:storeId/shop" element={<Storefront />} />
            <Route path="/store/:storeId/about" element={<Storefront />} />
            <Route path="/store/:storeId/contact" element={<Storefront />} />
            <Route path="/store/:storeId/:productSlug" element={<Storefront />} />
            
            {/* Document routes */}
            <Route path="/document/:documentId" element={<PublicDocument />} />
            
            {/* Payment Link */}
            <Route path="/payment/:linkId" element={<PaymentLink />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
