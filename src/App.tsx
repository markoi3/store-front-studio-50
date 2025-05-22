
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import ThankYou from "@/pages/ThankYou";
import NotFound from "@/pages/NotFound";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Storefront from "@/pages/store/Storefront";
import Dashboard from "@/pages/admin/Dashboard";
import Products from "@/pages/admin/Products";
import Orders from "@/pages/admin/Orders";
import Settings from "@/pages/admin/Settings";
import Profile from "@/pages/admin/Profile";
import EditProduct from "@/pages/admin/EditProduct";
import NewProduct from "@/pages/admin/NewProduct";
import Customers from "@/pages/admin/Customers";
import Analytics from "@/pages/admin/Analytics";
import SaasHome from "@/pages/SaasHome";
import Design from "@/pages/admin/Design";
import Racunovodstvo from "@/pages/admin/Racunovodstvo";
import Fakture from "@/pages/admin/Fakture";
import NovaFaktura from "@/pages/admin/NovaFaktura";
import NoviPredracun from "@/pages/admin/NoviPredracun";
import NoviObracun from "@/pages/admin/NoviObracun";
import BrziLink from "@/pages/admin/BrziLink";
import Transakcije from "@/pages/admin/Transakcije";
import PublicDocument from "@/pages/public/PublicDocument";
import PaymentLink from "@/pages/payment/PaymentLink";

// Components
import { Toaster } from "@/components/ui/toaster";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import CustomPage from "@/pages/store/CustomPage";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if we are on an admin route
  useEffect(() => {
    const checkIfAdmin = () => {
      const path = window.location.pathname;
      const isAdminRoute = path.startsWith("/admin") || path === "/design";
      setIsAdmin(isAdminRoute);
    };

    checkIfAdmin();
    
    // Listen for route changes
    window.addEventListener('popstate', checkIfAdmin);
    
    return () => {
      window.removeEventListener('popstate', checkIfAdmin);
    };
  }, []);

  return (
    <ThemeProvider>
      <CartProvider>
        <AuthContextProvider>
          <BrowserRouter>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/products/new" element={<NewProduct />} />
              <Route path="/admin/products/:productId" element={<EditProduct />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/customers" element={<Customers />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/design" element={<Design />} />
              <Route path="/admin/profile" element={<Profile />} />
              <Route path="/admin/racunovodstvo" element={<Racunovodstvo />} />
              <Route path="/admin/fakture" element={<Fakture />} />
              <Route path="/admin/fakture/nova" element={<NovaFaktura />} />
              <Route path="/admin/fakture/predracun" element={<NoviPredracun />} />
              <Route path="/admin/fakture/obracun" element={<NoviObracun />} />
              <Route path="/admin/fakture/brzi-link" element={<BrziLink />} />
              <Route path="/admin/transakcije" element={<Transakcije />} />
              <Route path="/admin/*" element={<NotFound />} />
              
              {/* Public Routes */}
              <Route path="/" element={<SaasHome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Main Store Routes */}
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              
              {/* Store-specific Routes */}
              <Route path="/store/:storeId" element={<Storefront />} />
              <Route path="/store/:storeId/shop" element={<Shop />} />
              <Route path="/store/:storeId/product/:productId" element={<ProductDetail />} />
              <Route path="/store/:storeId/cart" element={<Cart />} />
              <Route path="/store/:storeId/checkout" element={<Checkout />} />
              <Route path="/store/:storeId/thank-you" element={<ThankYou />} />
              <Route path="/store/:storeId/contact" element={<Contact />} />
              <Route path="/store/:storeId/about" element={<About />} />
              <Route path="/store/:storeId/privacy" element={<Privacy />} />
              <Route path="/store/:storeId/terms" element={<Terms />} />
              
              {/* Custom Page Route */}
              <Route path="/store/:storeId/:slug" element={<CustomPage />} />
              
              {/* Public Document Routes */}
              <Route path="/doc/:token" element={<PublicDocument />} />
              <Route path="/pay/:token" element={<PaymentLink />} />
              
              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </AuthContextProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
