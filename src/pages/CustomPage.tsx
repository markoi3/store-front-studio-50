
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { withStoreLayout } from "@/components/layout/StorePageLayout";
import { supabase } from "@/integrations/supabase/client";
import { StoreSettings } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";

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
              elements: customPage.elements || []
            });
            console.log(`Custom page found: ${customPage.title}`);
            console.log(`Page elements: ${customPage.elements ? customPage.elements.length : 0}`);
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
        
        <div className="prose max-w-none mb-8">
          {pageData.content}
        </div>
        
        {/* Render custom elements if they exist */}
        {pageData.elements && pageData.elements.length > 0 && pageData.elements.map((element) => (
          <div key={element.id} className="my-8">
            {/* Hero element */}
            {element.type === 'hero' && (
              <div className="relative h-60 overflow-hidden rounded-md">
                <img 
                  src={element.settings?.backgroundImage} 
                  alt="Hero background" 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center p-4"
                  style={{
                    backgroundColor: `${element.settings?.backgroundColor || '#000000'}80`,
                    color: element.settings?.textColor || '#ffffff',
                  }}
                >
                  <h2 className="font-bold text-2xl mb-2">{element.settings?.title}</h2>
                  <p className="text-center mb-4">{element.settings?.subtitle}</p>
                  <Button 
                    style={{
                      backgroundColor: element.settings?.buttonColor || '#3b82f6',
                      color: element.settings?.buttonTextColor || '#ffffff'
                    }}
                  >
                    {element.settings?.buttonText}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Text element */}
            {element.type === 'text' && (
              <div 
                className={`text-${element.settings?.alignment || 'left'}`}
                style={{
                  color: element.settings?.textColor || 'inherit',
                  backgroundColor: element.settings?.backgroundColor || 'transparent',
                  padding: '1rem',
                  borderRadius: '0.375rem'
                }}
              >
                <p style={{
                  fontSize: getFontSize(element.settings?.fontSize || 'medium')
                }}>
                  {element.settings?.content}
                </p>
              </div>
            )}
            
            {/* Image element */}
            {element.type === 'image' && (
              <img 
                src={element.settings?.src} 
                alt={element.settings?.alt || ''} 
                className="max-w-full" 
                style={{
                  borderRadius: element.settings?.borderRadius || '4px',
                  width: element.settings?.width || '100%',
                  height: element.settings?.height || 'auto'
                }}
              />
            )}
            
            {/* CTA element */}
            {element.type === 'cta' && (
              <div 
                className="text-center py-8"
                style={{
                  backgroundColor: element.settings?.backgroundColor || '#f9fafb',
                  color: element.settings?.textColor || '#000000',
                  padding: '2rem',
                  borderRadius: '0.375rem'
                }}
              >
                <h3 className="font-medium text-xl mb-4">{element.settings?.title}</h3>
                <Button 
                  style={{
                    backgroundColor: element.settings?.buttonColor || '#3b82f6',
                    color: element.settings?.buttonTextColor || '#ffffff'
                  }}
                >
                  {element.settings?.buttonText}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get font size
function getFontSize(size: string): string {
  switch(size) {
    case 'small': return '0.875rem';
    case 'medium': return '1rem';
    case 'large': return '1.25rem';
    case 'xlarge': return '1.5rem';
    default: return '1rem';
  }
}

// Export the component with the StorePageLayout wrapper
export default withStoreLayout(CustomPage);
