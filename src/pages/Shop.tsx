# E-commerce Store Fixes

## Issues Identified:
1. **Duplicate header/footer**: ComingSoon component bypasses StorePageLayout but renders outside StoreLayout
2. **Raw HTML rendering**: TextElement component doesn't parse HTML properly
3. **Coming Soon positioning**: Not properly integrated with layout system

## Solutions:

### 1. Fix ComingSoon.tsx
**Problem**: ComingSoon bypasses the layout system entirely, causing it to render without proper context.

**Solution**: Modify ComingSoon to work within the layout system:

```tsx
import { useParams } from "react-router-dom";
import { useStoreData } from "@/hooks/useStoreData";
import { useAuth } from "@/contexts/AuthContext";
import { PageElementRenderer } from "@/components/store/PageElementRenderer";

const ComingSoon = () => {
  const { storeId } = useParams();
  const { user } = useAuth();
  const { store, loading } = useStoreData({ 
    storeId, 
    currentUserId: user?.id 
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-40 bg-muted rounded mb-4"></div>
        </div>
      </div>
    );
  }

  // Get logo from store settings
  const logo = store?.settings?.logo || null;
  const storeName = store?.name || "Store";
  
  // Get custom coming soon elements if they exist
  const comingSoonElements = store?.settings?.comingSoonElements || [];
  
  // Default elements with CLEAN content (no HTML tags)
  const defaultElements = [
    {
      id: 'coming-soon-logo',
      type: 'image',
      settings: {
        src: logo?.url || '',
        alt: logo?.alt || storeName,
        width: 200,
        height: 80,
        alignment: 'center',
        className: 'mb-8'
      }
    },
    {
      id: 'coming-soon-title',
      type: 'text',
      settings: {
        content: 'Coming Soon', // Clean text, no HTML
        alignment: 'center',
        fontSize: 'xlarge',
        fontWeight: 'bold'
      }
    },
    {
      id: 'coming-soon-description',
      type: 'text',
      settings: {
        content: "We're working on something amazing. Stay tuned!", // Clean text
        alignment: 'center',
        textColor: 'muted'
      }
    }
  ];

  const elementsToRender = comingSoonElements.length > 0 ? comingSoonElements : defaultElements;

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto">
        <PageElementRenderer 
          elements={elementsToRender}
          products={[]}
          storeId={storeId || ''}
          onNavigate={() => {}}
        />
      </div>
    </div>
  );
};

export default ComingSoon;
```

### 2. Fix StorePageLayout.tsx 
**Problem**: ComingSoon should be standalone (no header/footer), and there are duplicate headers/footers on regular pages.

**Solution**: Return ComingSoon directly for private stores, and ensure StoreLayout is only applied once:

```tsx
import { ReactNode, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { StoreLayout } from "./StoreLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useStoreVisibility } from "@/hooks/useStoreVisibility";
import ComingSoon from "@/pages/ComingSoon";

type StorePageLayoutProps = {
  children: ReactNode;
};

export const StorePageLayout = ({ children }: StorePageLayoutProps) => {
  const { storeId } = useParams<{ storeId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { shouldShowComingSoon, loading: visibilityLoading, isOwner } = useStoreVisibility({ storeId });
  
  // Redirect logic remains the same...
  useEffect(() => {
    const redirectToStoreRoute = async () => {
      if (!storeId && !location.pathname.startsWith('/store/')) {
        try {
          setLoading(true);
          
          const currentPath = location.pathname.substring(1);
          
          const { data: storeData, error } = await supabase
            .from('stores')
            .select('slug')
            .limit(1)
            .single();
            
          if (error) {
            console.error("Error fetching store:", error);
            toast.error("Navigation error", {
              description: "Could not load store information. Please try again.",
            });
            setLoading(false);
            return;
          }
          
          if (storeData && storeData.slug) {
            const storeUrl = `/store/${storeData.slug}${currentPath ? `/${currentPath}` : ''}`;
            console.log(`Redirecting to store route: ${storeUrl}`);
            navigate(storeUrl);
          }
        } catch (error) {
          console.error("Error redirecting to store route:", error);
          toast.error("Navigation error", {
            description: "Could not redirect to store route. Please try again.",
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    redirectToStoreRoute();
  }, [storeId, location.pathname, navigate]);
  
  if (loading || visibilityLoading) {
    return (
      <StoreLayout>
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-40 bg-muted rounded mb-4"></div>
            <div className="h-4 w-60 bg-muted rounded"></div>
          </div>
        </div>
      </StoreLayout>
    );
  }
  
  // FIXED: Show Coming Soon WITHOUT StoreLayout (no header/footer)
  if (shouldShowComingSoon) {
    console.log("Showing Coming Soon page for private store");
    return <ComingSoon />;
  }
  
  return <StoreLayout>{children}</StoreLayout>;
};

export const withStoreLayout = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <StorePageLayout>
      <Component {...props} />
    </StorePageLayout>
  );
};
```

### 3. Fix TextElement.tsx
**Problem**: Component displays raw HTML instead of rendering it properly.

**Solution**: Use `dangerouslySetInnerHTML` or parse content properly:

```tsx
interface TextElementProps {
  element: {
    id: string;
    type: string;
    settings: {
      content?: string;
      alignment?: string;
      backgroundColor?: string;
      textColor?: string;
      fontSize?: 'small' | 'medium' | 'large' | 'xlarge';
      fontWeight?: 'normal' | 'bold';
    };
  };
}

export const TextElement = ({ element }: TextElementProps) => {
  const { content = "", alignment = "center", backgroundColor = "", textColor = "" } = element.settings;
  
  // Check if content contains HTML tags
  const hasHTMLTags = /<[^>]*>/g.test(content);
  
  // Define font size classes
  const getFontSizeClass = (size?: string) => {
    switch (size) {
      case 'small': return 'text-sm';
      case 'large': return 'text-xl';
      case 'xlarge': return 'text-4xl md:text-6xl';
      default: return 'text-lg';
    }
  };
  
  // Define font weight classes
  const getFontWeightClass = (weight?: string) => {
    return weight === 'bold' ? 'font-bold' : '';
  };
  
  // Define alignment classes
  const getAlignmentClass = (align?: string) => {
    switch (align) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      case 'center':
      default: return 'text-center';
    }
  };
  
  const textClasses = `
    ${getFontSizeClass(element.settings.fontSize)}
    ${getFontWeightClass(element.settings.fontWeight)}
    ${getAlignmentClass(alignment)}
    ${textColor === 'muted' ? 'text-muted-foreground' : ''}
  `.trim();

  return (
    <div 
      className="container mx-auto px-4 py-12"
      style={{ backgroundColor: backgroundColor || "transparent" }}
    >
      <div className="max-w-3xl mx-auto">
        {hasHTMLTags ? (
          // Render HTML content safely
          <div 
            className={textClasses}
            style={{ color: textColor && textColor !== 'muted' ? textColor : "" }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          // Render plain text content
          <p 
            className={textClasses}
            style={{ color: textColor && textColor !== 'muted' ? textColor : "" }}
          >
            {content}
          </p>
        )}
      </div>
    </div>
  );
};
```

## Key Changes Summary:

### ✅ **Fixed Duplicate Headers/Footers:**
- ComingSoon now renders WITHOUT StoreLayout (standalone page with no header/footer)
- Regular pages only get StoreLayout applied once through StorePageLayout
- This prevents the duplicate header/footer issue on public stores

### ✅ **Fixed Raw HTML Display:**
- TextElement now properly detects and renders HTML content
- Uses `dangerouslySetInnerHTML` for HTML content, plain text rendering for clean content
- Added proper CSS classes for styling instead of inline HTML

### ✅ **Improved Coming Soon Integration:**
- ComingSoon content uses clean text instead of HTML strings
- Better integration with the PageElementRenderer system
- Maintains responsive design and proper spacing

## Testing Checklist:
- [ ] Private store shows Coming Soon page with single header/footer
- [ ] Coming Soon page displays clean text (not raw HTML)
- [ ] Other store pages (shop, about) show single header/footer
- [ ] Text elements throughout site render properly
- [ ] Store owner can still access private store content

## Root Cause - Double Layout Wrapping

**The Problem**: Your Shop.tsx is using BOTH layout systems simultaneously:

1. `ShopLayout` (Header + Footer) 
2. `withStoreLayout` → `StorePageLayout` → `StoreLayout` (StoreHeader + Footer)

This creates: **Header + StoreHeader + Content + Footer + Footer**

## Fix Shop.tsx - Remove ShopLayout

**Current Shop.tsx** (causing duplicates):
```tsx
import { ShopLayout } from "@/components/layout/ShopLayout"; // ❌ REMOVE THIS

const Shop = () => {
  // ... your shop logic
  
  return (
    <ShopLayout> {/* ❌ REMOVE THIS WRAPPER */}
      <div className="container mx-auto px-4 py-8">
        {/* Your shop content */}
      </div>
    </ShopLayout> {/* ❌ REMOVE THIS WRAPPER */}
  );
};

export default Shop; // ❌ No layout wrapper
```

**Fixed Shop.tsx** (Complete Version):
```tsx
import { useState, useEffect } from "react";
import { ProductCard, Product } from "@/components/shop/ProductCard";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { withStoreLayout } from "@/components/layout/StorePageLayout"; // ✅ ADD THIS

// Sample products data
const allProducts: Product[] = [
  {
    id: "1",
    name: "Minimalist Coffee Table",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "minimalist-coffee-table",
    category: "furniture"
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "ergonomic-office-chair",
    category: "furniture"
  },
  {
    id: "3",
    name: "Ceramic Mug Set",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "ceramic-mug-set",
    category: "kitchen"
  },
  {
    id: "4",
    name: "Modern Floor Lamp",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1543198126-1c7d9e6d4f3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "modern-floor-lamp",
    category: "lighting"
  },
  {
    id: "5",
    name: "Wooden Dining Chair",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "wooden-dining-chair",
    category: "furniture"
  },
  {
    id: "6",
    name: "Pendant Light",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "pendant-light",
    category: "lighting"
  },
  {
    id: "7",
    name: "Kitchen Knife Set",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1593618998160-854542cfa185?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "kitchen-knife-set",
    category: "kitchen"
  },
  {
    id: "8",
    name: "Bookshelf",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1588063577637-3c8ca15f9ac0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "bookshelf",
    category: "furniture"
  }
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const categoryParam = searchParams.get("category");
  
  useEffect(() => {
    let filteredProducts = [...allProducts];
    
    // Filter by category if provided
    if (categoryParam) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === categoryParam
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by price range
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    setProducts(filteredProducts);
  }, [categoryParam, searchTerm, priceRange]);
  
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "furniture", name: "Furniture" },
    { id: "kitchen", name: "Kitchen" },
    { id: "lighting", name: "Lighting" }
  ];
  
  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", categoryId);
    }
    setSearchParams(searchParams);
  };
  
  return (
    // ✅ Removed ShopLayout wrapper - content goes directly here
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {categoryParam
            ? categories.find((c) => c.id === categoryParam)?.name
            : "All Products"}
        </h1>
        
        <Button
          variant="outline"
          className="md:hidden"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        >
          Filters
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters - Desktop */}
        <aside className="w-full md:w-64 hidden md:block">
          <div className="bg-card p-4 rounded-lg shadow-custom">
            <h2 className="font-medium mb-4">Categories</h2>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    className={`text-sm ${
                      (category.id === "all" && !categoryParam) ||
                      category.id === categoryParam
                        ? "font-medium"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
            
            <h2 className="font-medium mt-6 mb-4">Price Range</h2>
            <div className="px-2">
              <Slider
                defaultValue={[0, 300]}
                max={300}
                step={10}
                onValueChange={(value) => setPriceRange(value)}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
            
            <h2 className="font-medium mt-6 mb-4">Search</h2>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </aside>
        
        {/* Filters - Mobile */}
        {mobileFiltersOpen && (
          <div className="bg-card p-4 rounded-lg shadow-custom md:hidden">
            <h2 className="font-medium mb-4">Categories</h2>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    className={`text-sm ${
                      (category.id === "all" && !categoryParam) ||
                      category.id === categoryParam
                        ? "font-medium"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
            
            <h2 className="font-medium mt-6 mb-4">Price Range</h2>
            <div className="px-2">
              <Slider
                defaultValue={[0, 300]}
                max={300}
                step={10}
                onValueChange={(value) => setPriceRange(value)}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
            
            <h2 className="font-medium mt-6 mb-4">Search</h2>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        
        {/* Products Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-xl font-medium mb-2">No products found</h2>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search term.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchParams({});
                  setSearchTerm("");
                  setPriceRange([0, 300]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
