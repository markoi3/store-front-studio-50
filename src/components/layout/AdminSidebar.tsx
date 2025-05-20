
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  Palette, 
  BarChart, 
  User, 
  LogOut 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export const AdminSidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: "/products", label: "Products", icon: <Package className="h-5 w-5" /> },
    { path: "/orders", label: "Orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
    { path: "/design", label: "Design", icon: <Palette className="h-5 w-5" /> },
    { path: "/analytics", label: "Analytics", icon: <BarChart className="h-5 w-5" /> },
    { path: "/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-card border-r border-border p-4 hidden md:block">
      <div className="flex items-center mb-8">
        <Link to="/dashboard" className="font-bold text-xl">
          E-Shop Admin
        </Link>
      </div>
      
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === item.path
                ? "bg-accent text-foreground font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
        
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors w-full text-left"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};
