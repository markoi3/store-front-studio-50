import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { withStoreLayout } from "@/components/layout/StorePageLayout";

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
import CustomPage from "./pages/CustomPage";
import ComingSoon from "./pages/ComingSoon";

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
import Transakcije from "./pages/admin/Transakcije";
import Customers from "./pages/admin/Customers";

// Store Pages
import Storefront from "./pages/store/Storefront";

// Payment Pages
import PaymentLink from "./pages/payment/PaymentLink";

// Public Document Pages
import PublicDocument from "./pages/public/PublicDocument";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Create wrapped components - EXCLUDING Storefront (jer već ima svoj StoreLayout)
const WrappedShop = withStoreLayout(Shop);
const WrappedProductDetail = withStoreLayout(ProductDetail);
const WrappedCart = withStoreLayout(Cart);
const WrappedCheckout = withStoreLayout(Checkout);
const WrappedThankYou = withStoreLayout(ThankYou);
const WrappedAbout = withStoreLayout(About);
const WrappedContact = withStoreLayout(Contact);
const WrappedCustomPage = withStoreLayout(CustomPage);
const WrappedTerms = withStoreLayout(Terms);
const WrappedPrivacy = withStoreLayout(Privacy);
const WrappedComingSoon = withStoreLayout(ComingSoon);

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
              
              {/* Store Routes - Storefront handled separately */}
              <Route path="/store/:storeId" element={<Storefront />} />
              <Route path="/store/:storeId/shop" element={<WrappedShop />} />
              <Route path="/store/:storeId/product/:slug" element={<WrappedProductDetail />} />
              <Route path="/store/:storeId/cart" element={<WrappedCart />} />
              <Route path="/store/:storeId/checkout" element={<WrappedCheckout />} />
              <Route path="/store/:storeId/thank-you" element={<WrappedThankYou />} />
              <Route path="/store/:storeId/about" element={<WrappedAbout />} />
              <Route path="/store/:storeId/contact" element={<WrappedContact />} />
              <Route path="/store/:storeId/page/:pageSlug" element={<WrappedCustomPage />} />
              <Route path="/store/:storeId/terms" element={<WrappedTerms />} />
              <Route path="/store/:storeId/privacy" element={<WrappedPrivacy />} />
              <Route path="/store/:storeId/coming-soon" element={<WrappedComingSoon />} />
              
              {/* Demo Store Routes (for testing) - Redirect to proper store URLs */}
              <Route path="/home" element={<Navigate to="/store" replace />} />
              <Route path="/shop" element={<Navigate to="/store" replace />} />
              <Route path="/product/:slug" element={<Navigate to="/store" replace />} />
              <Route path="/cart" element={<Navigate to="/store" replace />} />
              <Route path="/checkout" element={<Navigate to="/store" replace />} />
              <Route path="/thank-you" element={<Navigate to="/store" replace />} />
              <Route path="/about" element={<Navigate to="/store" replace />} />
              <Route path="/contact" element={<Navigate to="/store" replace />} />
              <Route path="/terms" element={<Navigate to="/store" replace />} />
              <Route path="/privacy" element={<Navigate to="/store" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Admin Routes - All wrapped in AdminLayout */}
              <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
              <Route path="/products" element={<AdminLayout><Products /></AdminLayout>} />
              <Route path="/products/new" element={<AdminLayout><NewProduct /></AdminLayout>} />
              <Route path="/products/:id" element={<AdminLayout><EditProduct /></AdminLayout>} />
              <Route path="/orders" element={<AdminLayout><Orders /></AdminLayout>} />
              <Route path="/orders/:id" element={<AdminLayout><Transakcije /></AdminLayout>} />
              <Route path="/customers" element={<AdminLayout><Customers /></AdminLayout>} />
              <Route path="/transakcije/:id" element={<AdminLayout><Transakcije /></AdminLayout>} />
              <Route path="/settings" element={<AdminLayout><Settings /></AdminLayout>} />
              <Route path="/design" element={<AdminLayout><Design /></AdminLayout>} />
              <Route path="/analytics" element={<AdminLayout><Analytics /></AdminLayout>} />
              <Route path="/profile" element={<AdminLayout><Profile /></AdminLayout>} />
              <Route path="/racunovodstvo" element={<AdminLayout><Racunovodstvo /></AdminLayout>} />
              <Route path="/brzi-link" element={<AdminLayout><BrziLink /></AdminLayout>} />
              <Route path="/fakture" element={<AdminLayout><Fakture /></AdminLayout>} />
              <Route path="/fakture/nova" element={<AdminLayout><NovaFaktura /></AdminLayout>} />
              <Route path="/predracun/novi" element={<AdminLayout><NoviPredracun /></AdminLayout>} />
              <Route path="/obracun/novi" element={<AdminLayout><NoviObracun /></AdminLayout>} />
              
              {/* Payment Links */}
              <Route path="/pay/:linkId" element={<PaymentLink />} />
              
              {/* Public Document Pages */}
              <Route path="/public/:docType/:docId" element={<PublicDocument />} />
              
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
