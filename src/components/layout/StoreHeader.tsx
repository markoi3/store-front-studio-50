
import { Link, useParams } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

interface StoreMenuItem {
  id: string;
  label: string;
  url: string;
}

interface StoreLogo {
  url?: string;
  alt?: string;
}

export const StoreHeader = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const [menuItems, setMenuItems] = useState<StoreMenuItem[]>([]);
  const [storeName, setStoreName] = useState<string>("Store");
  const [logo, setLogo] = useState<StoreLogo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('stores')
          .select('name, settings')
          .eq('slug', storeId)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching store settings:", error);
        } else if (data) {
          setStoreName(data.name || "Store");
          
          const settings = data.settings || {};
          
          // Get menu items from settings if they exist
          if (settings.menuItems && Array.isArray(settings.menuItems)) {
            setMenuItems(settings.menuItems);
          } else {
            // Default menu items
            setMenuItems([
              { id: "1", label: "Home", url: "/" },
              { id: "2", label: "Products", url: "/shop" },
              { id: "3", label: "About", url: "/about" },
              { id: "4", label: "Contact", url: "/contact" }
            ]);
          }
          
          // Get logo from settings if it exists
          if (settings.logo) {
            setLogo(settings.logo);
          }
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStoreData();
  }, [storeId]);

  // Handle navigation with store context
  const getStoreUrl = (path: string) => {
    if (!storeId) return path;
    
    // If it's already a full URL or an absolute path (not starting with /)
    if (path.startsWith('http') || !path.startsWith('/')) {
      return path;
    }
    
    // Remove leading slash if it exists
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // Construct the store URL
    return `/store/${storeId}/${cleanPath}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to={getStoreUrl("/")} className="font-bold text-xl flex items-center">
          {logo && logo.url ? (
            <img 
              src={logo.url} 
              alt={logo.alt || storeName} 
              className="h-8 mr-2 max-w-[120px] object-contain" 
            />
          ) : (
            storeName
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4">
          {menuItems.map((item) => (
            <Link 
              key={item.id} 
              to={getStoreUrl(item.url)} 
              className="text-foreground hover:text-primary px-2 py-1"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Link to={getStoreUrl("/cart")} className="relative">
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={getStoreUrl(item.url)}
                className="py-2 block"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
