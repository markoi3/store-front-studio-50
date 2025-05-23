
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { withStoreLayout } from "@/components/layout/StorePageLayout";
import { supabase } from "@/integrations/supabase/client";
import { StoreSettings } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";

interface BuilderElement {
  id: string;
  type: string;
  settings: Record<string, any>;
}

const CustomPage = () => {
  const { storeId, pageSlug } = useParams<{ storeId?: string; pageSlug?: string }>();
  const [pageData, setPageData] = useState<{
    title: string;
    content: string;
    elements?: BuilderElement[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPageData = async () => {
      if (!storeId || !pageSlug) return;
      
      try {
        setLoading(true);
        console.log(`Fetching data for custom page: ${pageSlug} in store: ${storeId}`);
        
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{pageData.title}</h1>
        
        {pageData.content && (
          <div className="prose max-w-none mb-8">
            {pageData.content}
          </div>
        )}
        
        {/* Render page builder elements if they exist */}
        {pageData.elements && pageData.elements.length > 0 ? (
          <div className="space-y-8">
            {pageData.elements.map((element) => (
              <div key={element.id}>
                {element.type === 'hero' && (
                  <div className="relative rounded-lg overflow-hidden">
                    {element.settings.backgroundImage && (
                      <img 
                        src={element.settings.backgroundImage} 
                        alt="Hero background" 
                        className="w-full h-64 object-cover"
                      />
                    )}
                    <div 
                      className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
                      style={{
                        backgroundColor: element.settings.backgroundColor ? 
                          `${element.settings.backgroundColor}${element.settings.backgroundOpacity || '80'}` : 
                          'rgba(0,0,0,0.5)',
                        color: element.settings.textColor || '#ffffff'
                      }}
                    >
                      <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{color: element.settings.titleColor || element.settings.textColor || '#ffffff'}}>
                        {element.settings.title}
                      </h2>
                      <p className="mb-4" style={{color: element.settings.subtitleColor || element.settings.textColor || '#ffffff'}}>
                        {element.settings.subtitle}
                      </p>
                      {element.settings.buttonText && (
                        <Button
                          style={{
                            backgroundColor: element.settings.buttonColor || '#3b82f6',
                            color: element.settings.buttonTextColor || '#ffffff'
                          }}
                        >
                          {element.settings.buttonText}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                
                {element.type === 'text' && (
                  <div 
                    className={`text-${element.settings.alignment || 'left'} p-4 rounded-md`}
                    style={{
                      color: element.settings.textColor || 'inherit',
                      backgroundColor: element.settings.backgroundColor || 'transparent'
                    }}
                  >
                    <p style={{
                      fontSize: getFontSize(element.settings.fontSize || 'medium')
                    }}>
                      {element.settings.content}
                    </p>
                  </div>
                )}
                
                {element.type === 'image' && (
                  <div className="text-center">
                    <img 
                      src={element.settings.src} 
                      alt={element.settings.alt || ''} 
                      className="mx-auto"
                      style={{
                        maxWidth: '100%',
                        borderRadius: element.settings.borderRadius || '4px',
                        width: element.settings.width || '100%'
                      }}
                    />
                    {element.settings.caption && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {element.settings.caption}
                      </p>
                    )}
                  </div>
                )}
                
                {element.type === 'cta' && (
                  <div 
                    className="text-center py-12 px-6 rounded-lg"
                    style={{
                      backgroundColor: element.settings.backgroundColor || '#f3f4f6',
                      color: element.settings.textColor || '#000000'
                    }}
                  >
                    <h3 
                      className="text-xl md:text-2xl font-semibold mb-4"
                      style={{color: element.settings.titleColor || element.settings.textColor || '#000000'}}
                    >
                      {element.settings.title}
                    </h3>
                    <Button
                      style={{
                        backgroundColor: element.settings.buttonColor || '#3b82f6',
                        color: element.settings.buttonTextColor || '#ffffff'
                      }}
                    >
                      {element.settings.buttonText}
                    </Button>
                  </div>
                )}
                
                {/* Add more element types rendering as needed */}
              </div>
            ))}
          </div>
        ) : null}
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
