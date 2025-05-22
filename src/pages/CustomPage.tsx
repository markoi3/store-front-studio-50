
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { withStoreLayout } from "@/components/layout/StorePageLayout";
import { supabase } from "@/integrations/supabase/client";
import { StoreSettings } from "@/hooks/useStore";

const CustomPage = () => {
  const { storeId, pageSlug } = useParams<{ storeId?: string; pageSlug?: string }>();
  const [pageData, setPageData] = useState<{ title: string; content: string; elements?: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPageData = async () => {
      if (!storeId || !pageSlug) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('stores')
          .select('settings')
          .eq('slug', storeId)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching store settings:", error);
          setLoading(false);
          return;
        } 
        
        if (data) {
          // Ensure we're setting an object, even if data.settings is null
          const settings: StoreSettings = (typeof data.settings === 'object' && data.settings !== null) 
            ? data.settings as StoreSettings 
            : {};
            
          // Find the custom page with matching slug
          const customPage = settings.customPages?.find(page => page.slug === pageSlug);
          
          if (customPage) {
            setPageData({
              title: customPage.title,
              content: customPage.content,
              elements: customPage.elements
            });
            console.log(`Custom page found: ${customPage.title}`);
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{pageData.title}</h1>
        
        <div className="prose max-w-none">
          {pageData.content}
        </div>
        
        {/* Render custom elements if they exist */}
        {pageData.elements && pageData.elements.map((element) => (
          <div key={element.id} className="my-8">
            {/* Render based on element type */}
            {element.type === 'text' && (
              <div className={`text-${element.settings?.alignment || 'left'}`}>
                <p>{element.settings?.content}</p>
              </div>
            )}
            {element.type === 'image' && (
              <img 
                src={element.settings?.src} 
                alt={element.settings?.alt || ''} 
                className="max-w-full rounded-md" 
              />
            )}
            {/* Add more element types as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the component with the StorePageLayout wrapper
export default withStoreLayout(CustomPage);
