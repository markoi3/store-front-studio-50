
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { StoreSettings } from "@/hooks/useStore";

const AboutPage = () => {
  const { storeId } = useParams<{ storeId?: string }>();
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageElements, setPageElements] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchStoreSettings = async () => {
      if (!storeId) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('stores')
          .select('settings')
          .eq('slug', storeId)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching store settings:", error);
        } else if (data) {
          // Ensure we're setting an object, even if data.settings is null
          const settingsObj: StoreSettings = (typeof data.settings === 'object' && data.settings !== null) 
            ? data.settings as StoreSettings 
            : {};
            
          console.log("About page - Store settings loaded");
          
          setStoreSettings(settingsObj);
          
          // Load page elements if available
          if (settingsObj.aboutPageElements && Array.isArray(settingsObj.aboutPageElements)) {
            console.log(`About page - Found ${settingsObj.aboutPageElements.length} page elements`);
            setPageElements(settingsObj.aboutPageElements);
          }
        }
      } catch (error) {
        console.error("Error in fetchStoreSettings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStoreSettings();
  }, [storeId]);
  
  const aboutContent = storeSettings?.aboutUs || "About Us content will be displayed here.";
  
  const renderPageElement = (element: any) => {
    switch (element.type) {
      case 'text':
        return (
          <div 
            key={element.id} 
            className={`my-4 text-${element.settings.alignment || 'left'}`}
            style={{
              color: element.settings.textColor || 'inherit',
              backgroundColor: element.settings.backgroundColor || 'transparent',
              fontSize: element.settings.fontSize === 'large' ? '1.25rem' : 
                       element.settings.fontSize === 'xlarge' ? '1.5rem' :
                       element.settings.fontSize === 'small' ? '0.875rem' : '1rem'
            }}
          >
            <p>{element.settings.content}</p>
          </div>
        );
      case 'image':
        return (
          <div key={element.id} className="my-4">
            <img 
              src={element.settings.src} 
              alt={element.settings.alt || ''} 
              className="max-w-full mx-auto" 
              style={{
                borderRadius: element.settings.borderRadius || '4px',
                width: element.settings.width || '100%',
                height: element.settings.height || 'auto'
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        
        {loading ? (
          <div className="space-y-4">
            <div className="h-4 bg-accent/50 rounded w-full"></div>
            <div className="h-4 bg-accent/50 rounded w-5/6"></div>
            <div className="h-4 bg-accent/50 rounded w-4/6"></div>
          </div>
        ) : (
          <div className="prose max-w-none">
            {aboutContent}
            
            {/* Render page elements if available */}
            {pageElements.length > 0 && (
              <div className="mt-8 space-y-6">
                {pageElements.map(element => renderPageElement(element))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Export the component with the StorePageLayout wrapper
export default (AboutPage);
