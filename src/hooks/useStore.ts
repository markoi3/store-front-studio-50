
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StoreData {
  id: string;
  name: string;
  slug: string;
  settings: StoreSettings;
}

interface StoreSettings {
  menuItems?: Array<{id: string; label: string; url: string}>;
  logo?: {
    url?: string;
    alt?: string;
  };
  aboutUs?: string;
  privacyPolicy?: string;
  contactInfo?: string;
  pageElements?: any[];
  [key: string]: any;
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
          const storeData: StoreData = {
            id: data.id,
            name: data.name,
            slug: data.slug,
            settings: data.settings || {}
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
