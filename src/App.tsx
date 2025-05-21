
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

// Public Pages
import SaasHome from "./pages/SaasHome";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import NewProduct from "./pages/admin/NewProduct";
import EditProduct from "./pages/admin/EditProduct";
import Orders from "./pages/admin/Orders";
import Settings from "./pages/admin/Settings";
import Design from "./pages/admin/Design";
import Analytics from "./pages/admin/Analytics";
import Profile from "./pages/admin/Profile";
import Racunovodstvo from "./pages/admin/Racunovodstvo";
import BrziLink from "./pages/admin/BrziLink";
import Fakture from "./pages/admin/Fakture";
import NovaFaktura from "./pages/admin/NovaFaktura";
import NoviPredracun from "./pages/admin/NoviPredracun";
import NoviObracun from "./pages/admin/NoviObracun";

// Store Pages
import Storefront from "./pages/store/Storefront";

// Payment Pages
import PaymentLink from "./pages/payment/PaymentLink";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* SaaS Platform Home */}
              <Route path="/" element={<SaasHome />} />
              
              {/* Store Routes */}
              <Route path="/store/:storeId" element={<Storefront />} />
              <Route path="/store/:storeId/product/:slug" element={<ProductDetail />} />
              <Route path="/store/:storeId/cart" element={<Cart />} />
              <Route path="/store/:storeId/checkout" element={<Checkout />} />
              <Route path="/store/:storeId/thank-you" element={<ThankYou />} />
              <Route path="/store/:storeId/about" element={<About />} />
              <Route path="/store/:storeId/contact" element={<Contact />} />
              <Route path="/store/:storeId/terms" element={<Terms />} />
              <Route path="/store/:storeId/privacy" element={<Privacy />} />
              
              {/* Demo Store Routes (for testing) */}
              <Route path="/home" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Admin Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/new" element={<NewProduct />} />
              <Route path="/products/:id" element={<EditProduct />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<Orders />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/design" element={<Design />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/racunovodstvo" element={<Racunovodstvo />} />
              <Route path="/brzi-link" element={<BrziLink />} />
              <Route path="/fakture" element={<Fakture />} />
              <Route path="/fakture/nova" element={<NovaFaktura />} />
              <Route path="/predracun/novi" element={<NoviPredracun />} />
              <Route path="/obracun/novi" element={<NoviObracun />} />
              
              {/* Payment Links */}
              <Route path="/pay/:linkId" element={<PaymentLink />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
