
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Products from "@/pages/Products";
import ProductDetails from "@/pages/ProductDetails";
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
import Storefront from "@/pages/Storefront";
import PLReport from "@/pages/admin/PLReport";
import BalanceSheet from "@/pages/admin/BalanceSheet";

const queryClient = new QueryClient();

// Simple component to check auth and redirect to login if needed
const AdminRouteWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

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
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/store/:storeSlug" element={<Storefront />} />

                {/* Admin Routes with auth wrapper */}
                <Route path="/dashboard" element={<AdminRouteWrapper><Dashboard /></AdminRouteWrapper>} />
                <Route path="/products/new" element={<AdminRouteWrapper><NewProduct /></AdminRouteWrapper>} />
                <Route path="/products/:id/edit" element={<AdminRouteWrapper><EditProduct /></AdminRouteWrapper>} />
                <Route path="/orders" element={<AdminRouteWrapper><Orders /></AdminRouteWrapper>} />
                <Route path="/customers" element={<AdminRouteWrapper><Customers /></AdminRouteWrapper>} />
                <Route path="/analytics" element={<AdminRouteWrapper><Analytics /></AdminRouteWrapper>} />
                <Route path="/design" element={<AdminRouteWrapper><Design /></AdminRouteWrapper>} />
                <Route path="/settings" element={<AdminRouteWrapper><Settings /></AdminRouteWrapper>} />
                <Route path="/profile" element={<AdminRouteWrapper><Profile /></AdminRouteWrapper>} />
                <Route path="/racunovodstvo" element={<AdminRouteWrapper><Racunovodstvo /></AdminRouteWrapper>} />
                <Route path="/racunovodstvo/pl-report" element={<AdminRouteWrapper><PLReport /></AdminRouteWrapper>} />
                <Route path="/racunovodstvo/balance-sheet" element={<AdminRouteWrapper><BalanceSheet /></AdminRouteWrapper>} />
                <Route path="/racunovodstvo/fakture" element={<AdminRouteWrapper><Fakture /></AdminRouteWrapper>} />
                <Route path="/racunovodstvo/nova-faktura" element={<AdminRouteWrapper><NovaFaktura /></AdminRouteWrapper>} />
                <Route path="/racunovodstvo/novi-predracun" element={<AdminRouteWrapper><NoviPredracun /></AdminRouteWrapper>} />
                <Route path="/racunovodstvo/novi-obracun" element={<AdminRouteWrapper><NoviObracun /></AdminRouteWrapper>} />
                <Route path="/racunovodstvo/transakcije" element={<AdminRouteWrapper><Transakcije /></AdminRouteWrapper>} />
                <Route path="/brzi-link" element={<AdminRouteWrapper><BrziLink /></AdminRouteWrapper>} />
                
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
