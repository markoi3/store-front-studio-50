
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StoreSettings {
  menuItems?: Array<{id: string; label: string; url: string}>;
  logo?: {
    url?: string;
    alt?: string;
  };
  aboutUs?: string;
  privacyPolicy?: string;
  contactInfo?: string;
  pageElements?: any[];
  customPages?: Array<{id: string; title: string; slug: string; content: string; elements?: any[]}>;
  legalPages?: {
    privacy?: {title: string; content: string};
    terms?: {title: string; content: string};
    shipping?: {title: string; content: string};
    [key: string]: any;
  };
  [key: string]: any;
}

interface StoreData {
  id: string;
  name: string;
  slug: string;
  settings: StoreSettings;
}

export function useStore() {
  const { storeId } = useParams<{storeId?: string}>();
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .eq('slug', storeId)
          .maybeSingle();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          console.log("Store data loaded:", data.slug);
          
          const settings = data.settings && typeof data.settings === 'object' 
            ? data.settings as StoreSettings 
            : {};
            
          // Log page elements for debugging
          if (settings.pageElements && Array.isArray(settings.pageElements)) {
            console.log(`Found ${settings.pageElements.length} page elements for store ${data.slug}`);
          } else {
            console.log(`No page elements found for store ${data.slug}`);
          }
          
          const storeData: StoreData = {
            id: data.id,
            name: data.name,
            slug: data.slug,
            settings: settings
          };
          
          setStore(storeData);
        }
      } catch (err) {
        console.error("Error fetching store:", err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchStoreData();
  }, [storeId]);
  
  // Helper function to get store URL
  const getStoreUrl = (path: string) => {
    if (!storeId) return path;
    
    // If it's already a full URL or an absolute path (not starting with /)
    if (path.startsWith('http') || !path.startsWith('/')) {
      return path;
    }
    
    // Remove leading slash if it exists
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // Construct the store URL
    return `/store/${storeId}/${cleanPath}`;
  };
  
  return {
    store,
    storeId,
    loading,
    error,
    getStoreUrl
  };
}
