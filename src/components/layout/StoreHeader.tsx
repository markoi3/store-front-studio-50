
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useStore } from "@/hooks/useStore";
import { HeaderSettings, defaultHeaderSettings } from "@/types/header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const StoreHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [promoBarVisible, setPromoBarVisible] = useState(true);
  const { totalItems } = useCart();
  const { store, getStoreUrl } = useStore();
  
  // Get header settings with fallback to defaults
  const headerSettings: HeaderSettings = store?.settings?.header 
    ? { ...defaultHeaderSettings, ...store.settings.header }
    : defaultHeaderSettings;
    
  // Legacy support - use old menuItems if new header settings don't exist
  const menuItems = headerSettings.menuItems && headerSettings.menuItems.length > 0
    ? headerSettings.menuItems
    : (store?.settings?.menuItems || defaultHeaderSettings.menuItems);
  
  // Get custom pages from store settings and auto-add if enabled
  const customPages = store?.settings?.customPages || [];
  const combinedMenuItems = [...menuItems];
  
  if (headerSettings.autoAddCustomPages) {
    customPages.forEach(page => {
      const pageUrl = `/page/${page.slug}`;
      const existingMenuItem = menuItems.find(item => item.url === pageUrl);
      
      if (!existingMenuItem) {
        combinedMenuItems.push({
          id: `custom-page-${page.id}`,
          label: page.title,
          url: pageUrl,
          type: 'link'
        });
      }
    });
  }

  // Get logo from header settings first, then fallback to legacy settings
  const logo = headerSettings.logo?.url 
    ? headerSettings.logo 
    : store?.settings?.logo || null;
  
  const storeName = store?.name || "Store";

  // Dynamic styles based on header settings
  const headerStyle = {
    backgroundColor: headerSettings.backgroundColor,
    color: headerSettings.textColor,
    height: `${headerSettings.height}px`,
  };

  const promoBarStyle = {
    backgroundColor: headerSettings.promotionalBar.backgroundColor,
    color: headerSettings.promotionalBar.textColor,
  };

  const getLayoutClasses = () => {
    switch (headerSettings.layout) {
      case 'centered':
        return 'flex flex-col items-center space-y-4 md:space-y-0 md:flex-row md:justify-between';
      case 'split':
        return 'flex items-center justify-between';
      case 'minimal':
        return 'flex items-center justify-center';
      default:
        return 'flex items-center justify-between';
    }
  };

  const getNavigationClasses = () => {
    const baseClasses = "hidden md:flex";
    switch (headerSettings.navigation.position) {
      case 'left':
        return `${baseClasses} mr-auto`;
      case 'right':
        return `${baseClasses} ml-auto`;
      default:
        return `${baseClasses} mx-auto`;
    }
  };

  const getLogoClasses = () => {
    if (headerSettings.layout === 'centered') return "mx-auto";
    return headerSettings.logo.position === 'center' ? "mx-auto" : "";
  };

  const renderMenuItem = (item: any) => {
    if (item.type === 'dropdown' && item.children && item.children.length > 0) {
      return (
        <DropdownMenu key={item.id}>
          <DropdownMenuTrigger className="flex items-center hover:text-primary px-2 py-1">
            {headerSettings.navigation.showIcons && item.icon && (
              <span className="mr-2">{item.icon}</span>
            )}
            {item.label}
            <ChevronDown className="ml-1 h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {item.children.map((child: any) => (
              <DropdownMenuItem key={child.id} asChild>
                <Link 
                  to={getStoreUrl(child.url)}
                  target={child.openInNewTab ? '_blank' : undefined}
                  rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  {headerSettings.navigation.showIcons && child.icon && (
                    <span className="mr-2">{child.icon}</span>
                  )}
                  {child.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Link 
        key={item.id} 
        to={getStoreUrl(item.url)} 
        className="hover:text-primary px-2 py-1 flex items-center"
        target={item.openInNewTab ? '_blank' : undefined}
        rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {headerSettings.navigation.showIcons && item.icon && (
          <span className="mr-2">{item.icon}</span>
        )}
        {item.label}
      </Link>
    );
  };

  const renderCTAButtons = () => {
    return headerSettings.ctaButtons.map(button => {
      const variant = button.style === 'primary' ? 'default' : 
                    button.style === 'secondary' ? 'secondary' : 'outline';
      
      return (
        <Button
          key={button.id}
          variant={variant}
          size="sm"
          asChild
        >
          <Link 
            to={getStoreUrl(button.url)}
            target={button.openInNewTab ? '_blank' : undefined}
            rel={button.openInNewTab ? 'noopener noreferrer' : undefined}
            className="flex items-center"
          >
            {button.icon && <span className="mr-2">{button.icon}</span>}
            {button.text}
          </Link>
        </Button>
      );
    });
  };

  return (
    <>
      {/* Promotional Bar */}
      {headerSettings.promotionalBar.enabled && promoBarVisible && (
        <div className="w-full py-2 px-4 text-center text-sm" style={promoBarStyle}>
          <div className="container mx-auto flex items-center justify-center relative">
            <div className="flex items-center space-x-2">
              <span>{headerSettings.promotionalBar.text}</span>
              {headerSettings.promotionalBar.linkText && headerSettings.promotionalBar.linkUrl && (
                <Link 
                  to={getStoreUrl(headerSettings.promotionalBar.linkUrl)}
                  className="underline font-medium hover:opacity-80"
                >
                  {headerSettings.promotionalBar.linkText}
                </Link>
              )}
            </div>
            {headerSettings.promotionalBar.closeable && (
              <button
                onClick={() => setPromoBarVisible(false)}
                className="absolute right-0 hover:opacity-80"
                aria-label="Close promotional bar"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Header */}
      <header 
        className={`w-full border-b border-border ${headerSettings.sticky ? 'sticky top-0 z-50 bg-background/80 backdrop-blur-sm' : ''}`}
        style={headerStyle}
      >
        <div className="container mx-auto px-4">
          <div className={getLayoutClasses()} style={{ minHeight: `${headerSettings.height}px` }}>
            {/* Logo */}
            <div className={getLogoClasses()}>
              <Link to={getStoreUrl("/")} className="font-bold text-xl flex items-center">
                {logo && logo.url ? (
                  <img 
                    src={logo.url} 
                    alt={logo.alt || storeName} 
                    style={{
                      width: headerSettings.logo.width || 120,
                      height: headerSettings.logo.height || 40,
                      objectFit: 'contain'
                    }}
                    className="mr-2" 
                  />
                ) : (
                  storeName
                )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className={getNavigationClasses()}>
              <div className="flex items-center space-x-4">
                {combinedMenuItems.map(renderMenuItem)}
              </div>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* CTA Buttons */}
              <div className="hidden md:flex items-center space-x-2">
                {renderCTAButtons()}
              </div>

              {/* Cart */}
              <Link to={getStoreUrl("/cart")} className="relative">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
              {combinedMenuItems.map((item) => (
                <Link
                  key={item.id}
                  to={getStoreUrl(item.url)}
                  className="py-2 block hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  <div className="flex items-center">
                    {headerSettings.navigation.showIcons && item.icon && (
                      <span className="mr-2">{item.icon}</span>
                    )}
                    {item.label}
                  </div>
                </Link>
              ))}
              
              {/* Mobile CTA Buttons */}
              {headerSettings.ctaButtons.length > 0 && (
                <div className="pt-4 border-t border-border space-y-2">
                  {renderCTAButtons()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Custom CSS */}
        {headerSettings.customCss && (
          <style dangerouslySetInnerHTML={{ __html: headerSettings.customCss }} />
        )}
      </header>
    </>
  );
};
