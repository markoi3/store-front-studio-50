
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from './NotFound';
import Login from './Login';
import Register from './Register';
import ThankYou from './ThankYou';
import Storefront from './store/Storefront';
import About from './About';
import Contact from './Contact';
import Shop from './Shop';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import Checkout from './Checkout';
import Privacy from './Privacy';
import Terms from './Terms';
import CustomPage from './CustomPage';
import PublicDocument from './public/PublicDocument';
import PaymentLink from './payment/PaymentLink';
import Index from './Index';

// Admin imports
import Dashboard from './admin/Dashboard';
import Products from './admin/Products';
import NewProduct from './admin/NewProduct';
import EditProduct from './admin/EditProduct';
import Orders from './admin/Orders';
import Customers from './admin/Customers';
import NewCustomer from './admin/NewCustomer';
import CustomerDetail from './admin/CustomerDetail';
import EditCustomer from './admin/EditCustomer';
import Analytics from './admin/Analytics';
import Design from './admin/Design';
import Settings from './admin/Settings';
import Profile from './admin/Profile';
import Racunovodstvo from './admin/Racunovodstvo';
import Fakture from './admin/Fakture';
import NovaFaktura from './admin/NovaFaktura';
import NoviPredracun from './admin/NoviPredracun';
import NoviObracun from './admin/NoviObracun';
import Transakcije from './admin/Transakcije';
import BrziLink from './admin/BrziLink';

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
