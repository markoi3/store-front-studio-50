
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { withStoreLayout } from "@/components/layout/StorePageLayout";
import { supabase } from "@/integrations/supabase/client";

interface StoreSettings {
  aboutUs?: string;
  [key: string]: any;
}

const AboutPage = () => {
  const { storeId } = useParams<{ storeId?: string }>();
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  
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
          setStoreSettings(data.settings || {});
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
          </div>
        )}
      </div>
    </div>
  );
};

// Export the component with the StorePageLayout wrapper
export default withStoreLayout(AboutPage);
