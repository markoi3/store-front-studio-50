import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { withStoreLayout } from "@/components/layout/StorePageLayout";
import { supabase } from "@/integrations/supabase/client";
import { StoreSettings } from "@/hooks/useStore";
import { PageElementRenderer } from "@/components/store/PageElementRenderer";
import { Product } from "@/components/shop/ProductCard";

interface BuilderElement {
  id: string;
  type: string;
  settings: Record<string, any>;
}

const CustomPage = () => {
  const { storeId, pageSlug } = useParams<{ storeId?: string; pageSlug?: string }>();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<{
    title: string;
    content: string;
    elements?: BuilderElement[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Function to handle navigation while keeping store context
  const handleNavigate = (path: string) => {
    if (path.startsWith('/')) {
      // If path starts with '/', add storeId prefix
      const fullPath = `/store/${storeId}${path}`;
      navigate(fullPath);
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    const fetchStoreProducts = async () => {
      if (!storeId) return [];
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', storeId)
          .eq('published', true);
          
        if (error) {
          console.error("Error fetching products:", error);
          return [];
        }
        
        if (data && data.length > 0) {
          // Transform products to match our Product type
          return data.map((product: any) => ({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price || 0),
            image: product.image || "https://via.placeholder.com/300",
            slug: product.slug,
            storeId: storeId,
            category: product.category
          }));
        } else {
          return [];
        }
      } catch (err) {
        console.error("Error in fetchStoreProducts:", err);
        return [];
      }
    };
    
    const fetchPageData = async () => {
      if (!storeId || !pageSlug) return;
      
      try {
        setLoading(true);
        console.log(`Fetching data for custom page: ${pageSlug} in store: ${storeId}`);
        
        // Fetch store data and products in parallel
        const [storeResult, productsResult] = await Promise.all([
          supabase
            .from('stores')
            .select('settings')
            .eq('slug', storeId)
            .maybeSingle(),
          fetchStoreProducts()
        ]);
        
        const { data, error } = storeResult;
        
        if (error) {
          console.error("Error fetching store settings:", error);
          setLoading(false);
          return;
        } 
        
        setProducts(productsResult);
        
        if (data) {
          // Ensure we're setting an object, even if data.settings is null
          const settings: StoreSettings = (typeof data.settings === 'object' && data.settings !== null) 
            ? data.settings as StoreSettings 
            : {};
            
          // Find the custom page with matching slug
          const customPage = settings.customPages?.find(page => page.slug === pageSlug);
          
          if (customPage) {
            console.log(`Custom page found: ${customPage.title}`);
            console.log(`Elements: ${customPage.elements ? customPage.elements.length : 0}`);
            
            setPageData({
              title: customPage.title,
              content: customPage.content,
              elements: customPage.elements || []
            });
          } else {
            console.log(`No custom page found with slug: ${pageSlug}`);
          }
        }
      } catch (error) {
        console.error("Error in fetchPageData:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPageData();
  }, [storeId, pageSlug]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-4">
          <div className="h-4 bg-accent/50 rounded w-full"></div>
          <div className="h-4 bg-accent/50 rounded w-5/6"></div>
          <div className="h-4 bg-accent/50 rounded w-4/6"></div>
        </div>
      </div>
    );
  }
  
  if (!pageData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Title and content are now optional - not displayed by default */}
      
      {/* Use the unified PageElementRenderer for all page elements */}
      {pageData.elements && pageData.elements.length > 0 && (
        <PageElementRenderer 
          elements={pageData.elements} 
          products={products}
          storeId={storeId || ''}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
};

// Export the component with the StorePageLayout wrapper
export default withStoreLayout(CustomPage);
