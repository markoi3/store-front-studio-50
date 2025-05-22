
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
  pageElements?: {
    [key: string]: Array<{
      id: string;
      type: string;
      settings: Record<string, any>;
    }>;
  };
  customPages?: Array<{
    id: string;
    title: string;
    slug: string;
    content: string;
  }>;
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
          // Ensure we have valid settings with proper structure
          const defaultSettings: StoreSettings = {
            menuItems: [
              { id: "1", label: "Home", url: "/" },
              { id: "2", label: "Products", url: "/shop" },
              { id: "3", label: "About", url: "/about" },
              { id: "4", label: "Contact", url: "/contact" }
            ],
            pageElements: {
              homepage: []
            },
            customPages: []
          };
          
          // Make sure settings is an object and merge with defaults
          const settings = (data.settings && typeof data.settings === 'object') 
            ? { ...defaultSettings, ...data.settings }
            : defaultSettings;
            
          // Ensure pageElements is properly structured
          if (!settings.pageElements || typeof settings.pageElements !== 'object') {
            settings.pageElements = { homepage: [] };
          }
          
          // Ensure customPages exists
          if (!settings.customPages || !Array.isArray(settings.customPages)) {
            settings.customPages = [];
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
  
  // Get page elements specific to a page
  const getPageElements = (pageName: string = 'homepage') => {
    if (!store?.settings?.pageElements) return [];
    
    return store.settings.pageElements[pageName] || [];
  };

  // Get custom page by slug
  const getCustomPage = (slug: string) => {
    if (!store?.settings?.customPages) return null;
    
    return store.settings.customPages.find(page => page.slug === slug) || null;
  };
  
  return {
    store,
    storeId,
    loading,
    error,
    getStoreUrl,
    getPageElements,
    getCustomPage
  };
}
