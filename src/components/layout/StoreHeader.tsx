
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
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

  // Get logo from store settings
  const logo = store?.settings?.logo || null;
  
  // Get custom pages for navigation
  const customPages = store?.settings?.customPages && Array.isArray(store.settings.customPages)
    ? store.settings.customPages
    : [];
    
  // Add custom pages to menu items if they don't already exist
  useEffect(() => {
    if (store?.settings && customPages.length > 0) {
      console.log("Custom pages found:", customPages.length);
    }
  }, [store, customPages]);
  
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
          {menuItems.map((item) => (
            <Link 
              key={item.id} 
              to={getStoreUrl(item.url)} 
              className="text-foreground hover:text-primary px-2 py-1"
            >
              {item.label}
            </Link>
          ))}
          
          {/* Add custom pages to navigation */}
          {customPages.map((page) => {
            // Check if this page is already in menuItems
            const alreadyInMenu = menuItems.some(item => 
              item.url === `/page/${page.slug}` || 
              item.url === `page/${page.slug}`
            );
            
            // Only show if not already in menu
            if (!alreadyInMenu) {
              return (
                <Link 
                  key={page.id} 
                  to={getStoreUrl(`/page/${page.slug}`)} 
                  className="text-foreground hover:text-primary px-2 py-1"
                >
                  {page.title}
                </Link>
              );
            }
            return null;
          })}
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
            
            {/* Add custom pages to mobile navigation */}
            {customPages.map((page) => {
              // Check if already in menu
              const alreadyInMenu = menuItems.some(item => 
                item.url === `/page/${page.slug}` || 
                item.url === `page/${page.slug}`
              );
              
              if (!alreadyInMenu) {
                return (
                  <Link
                    key={page.id}
                    to={getStoreUrl(`/page/${page.slug}`)}
                    className="py-2 block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {page.title}
                  </Link>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </header>
  );
};
