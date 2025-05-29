import { Toaster } from "@/components/ui/sonner";
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

import PLReport from "@/pages/admin/PLReport";
import BalanceSheet from "@/pages/admin/BalanceSheet";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/thankyou" element={<ThankYou />} />
                <Route path="/store/:storeSlug" element={<Storefront />} />

                {/* Admin Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                <Route path="/products/new" element={<ProtectedRoute><NewProduct /></ProtectedRoute>} />
                <Route path="/products/:id/edit" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/design" element={<ProtectedRoute><Design /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/racunovodstvo" element={<ProtectedRoute><Racunovodstvo /></ProtectedRoute>} />
                <Route path="/racunovodstvo/pl-report" element={<ProtectedRoute><PLReport /></ProtectedRoute>} />
                <Route path="/racunovodstvo/balance-sheet" element={<ProtectedRoute><BalanceSheet /></ProtectedRoute>} />
                <Route path="/racunovodstvo/fakture" element={<ProtectedRoute><Fakture /></ProtectedRoute>} />
                <Route path="/racunovodstvo/nova-faktura" element={<ProtectedRoute><NovaFaktura /></ProtectedRoute>} />
                <Route path="/racunovodstvo/novi-predracun" element={<ProtectedRoute><NoviPredracun /></ProtectedRoute>} />
                <Route path="/racunovodstvo/novi-obracun" element={<ProtectedRoute><NoviObracun /></ProtectedRoute>} />
                <Route path="/racunovodstvo/transakcije" element={<ProtectedRoute><Transakcije /></ProtectedRoute>} />
                <Route path="/brzi-link" element={<ProtectedRoute><BrziLink /></ProtectedRoute>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
