
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  BarChart, 
  User, 
  LogOut,
  ExternalLink, 
  Globe,
  Calculator,
  Link as LinkIcon,
  FileText
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface ExtendedUser {
  store?: {
    slug?: string;
    name?: string;
  };
  username?: string;
  [key: string]: any;
}

export const AdminSidebar = () => {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  
  // Cast user-a u ExtendedUser tip
  const extendedUser = user as unknown as ExtendedUser;
  
  // Generisanje slug-a iz imena prodavnice ili korisničkog imena
  const storeSlug = extendedUser?.store?.slug || extendedUser?.username || "moja-prodavnica";
  
  const navItems = [
    { path: "/dashboard", label: "Početna", icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: "/products", label: "Proizvodi", icon: <Package className="h-5 w-5" /> },
    { path: "/orders", label: "Porudžbine", icon: <ShoppingCart className="h-5 w-5" /> },
    { path: "/racunovodstvo", label: "Računodstvo", icon: <Calculator className="h-5 w-5" /> },
    { path: "/brzi-link", label: "Brzi link", icon: <LinkIcon className="h-5 w-5" /> },
    { path: "/fakture", label: "Fakture", icon: <FileText className="h-5 w-5" /> },
    { path: "/analytics", label: "Analitika", icon: <BarChart className="h-5 w-5" /> },
    { path: "/settings", label: "Podešavanja", icon: <Settings className="h-5 w-5" /> },
    { path: "/profile", label: "Profil", icon: <User className="h-5 w-5" /> },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-[#fff8ea] shadow-md border-r border-border/30 p-5 hidden md:flex md:flex-col">
      <div className="flex flex-col h-full">
        <div className="flex items-center space-x-2 pb-6 mb-6 border-b border-border/30">
          <Link to="/dashboard" className="font-bold text-xl">
            Axia Admin
          </Link>
        </div>
        
        <Link 
          to={`/store/${storeSlug}`} 
          target="_blank"
          className="flex items-center justify-between bg-primary/5 hover:bg-primary/10 text-primary mb-6 px-4 py-2.5 rounded-lg transition-colors"
        >
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Pregledaj prodavnicu</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        
        <nav className="space-y-1.5 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm transition-colors",
                pathname === item.path || 
                (item.path === "/settings" && pathname === "/design") ||
                (item.path === "/settings" && pathname.startsWith("/design"))
                  ? "bg-primary text-primary-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-2.5 mt-6 border-t border-border/30 pt-6 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
        >
          <LogOut className="h-5 w-5" />
          <span>Odjava</span>
        </button>
      </div>
    </aside>
  );
};
