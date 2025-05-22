
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useStore } from "@/hooks/useStore";

export const StoreHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { store, getStoreUrl } = useStore();
  
  // Get menu items from store settings - without default fallback
  const menuItems = store?.settings?.menuItems && Array.isArray(store.settings.menuItems) 
    ? store.settings.menuItems 
    : [];
  
  // Get custom pages from store settings
  const customPages = store?.settings?.customPages && Array.isArray(store.settings.customPages)
    ? store.settings.customPages
    : [];
    
  // Add custom pages to menu items if they aren't already included
  const combinedMenuItems = [...menuItems];
  
  // Add any custom pages that aren't already in the menu
  customPages.forEach(page => {
    const pageUrl = `/page/${page.slug}`;
    // Check if this page is already in the menu
    const existingMenuItem = menuItems.find(item => item.url === pageUrl);
    
    if (!existingMenuItem) {
      // Add the custom page to the menu
      combinedMenuItems.push({
        id: `custom-page-${page.id}`,
        label: page.title,
        url: pageUrl
      });
    }
  });

  // Get logo from store settings
  const logo = store?.settings?.logo || null;
  
  const storeName = store?.name || "Store";

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
          {combinedMenuItems.map((item) => (
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
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
            {combinedMenuItems.map((item) => (
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
