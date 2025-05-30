
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AdminProducts from "@/pages/admin/Products";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/admin/Dashboard";
import NewProduct from "@/pages/admin/NewProduct";
import EditProduct from "@/pages/admin/EditProduct";
import Orders from "@/pages/admin/Orders";
import Customers from "@/pages/admin/Customers";
import Analytics from "@/pages/admin/Analytics";
import Design from "@/pages/admin/Design";
import Settings from "@/pages/admin/Settings";
import Profile from "@/pages/admin/Profile";
import Racunovodstvo from "@/pages/admin/Racunovodstvo";
import Fakture from "@/pages/admin/Fakture";
import NovaFaktura from "@/pages/admin/NovaFaktura";
import NoviPredracun from "@/pages/admin/NoviPredracun";
import NoviObracun from "@/pages/admin/NoviObracun";
import Transakcije from "@/pages/admin/Transakcije";
import BrziLink from "@/pages/admin/BrziLink";
import PLReport from "@/pages/admin/PLReport";
import BalanceSheet from "@/pages/admin/BalanceSheet";
import Storefront from "@/pages/store/Storefront";
import { withStoreLayout } from "@/components/layout/StorePageLayout";

const queryClient = new QueryClient();

// Wrap Storefront with store layout
const StorefrontWithLayout = withStoreLayout(Storefront);

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
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />

                {/* Admin Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Navigate to="/admin/products" replace />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/products/new" element={<NewProduct />} />
                <Route path="/products/:id/edit" element={<EditProduct />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/design" element={<Design />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/racunovodstvo" element={<Racunovodstvo />} />
                <Route path="/racunovodstvo/pl-report" element={<PLReport />} />
                <Route path="/racunovodstvo/balance-sheet" element={<BalanceSheet />} />
                <Route path="/fakture" element={<Navigate to="/racunovodstvo/fakture" replace />} />
                <Route path="/racunovodstvo/fakture" element={<Fakture />} />
                <Route path="/racunovodstvo/nova-faktura" element={<NovaFaktura />} />
                <Route path="/racunovodstvo/novi-predracun" element={<NoviPredracun />} />
                <Route path="/racunovodstvo/novi-obracun" element={<NoviObracun />} />
                <Route path="/racunovodstvo/transakcije" element={<Transakcije />} />
                <Route path="/brzi-link" element={<BrziLink />} />

                {/* Store Routes */}
                <Route path="/store/:storeId" element={<StorefrontWithLayout />} />
                <Route path="/store/:storeId/*" element={<StorefrontWithLayout />} />

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
