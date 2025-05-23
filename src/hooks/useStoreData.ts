
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/shop/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { StoreData, StoreSettings, isValidStoreSettings } from "@/types/store";

export const useStoreData = (storeId: string | undefined) => {
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadStoreData = async () => {
      try {
        if (!storeId) {
          setError("Store ID is required");
          setLoading(false);
          return;
        }
        
        console.log("Loading store data for slug:", storeId);
        
        // Fetch store by slug - now works with public stores due to RLS policy
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('slug', storeId)
          .maybeSingle();
          
        if (storeError) {
          console.error("Error fetching store:", storeError);
          setError("Error loading store data");
          setLoading(false);
          return;
        }
        
        if (!storeData) {
          console.error("No store found with slug:", storeId);
          setError(`Prodavnica nije pronađena: ${storeId}`);
          setLoading(false);
          return;
        }
        
        console.log("Found store:", storeData);
        console.log("Raw store settings:", storeData.settings);
        
        // Safely type-check and access is_public property
        let isPublic = false;
        if (storeData.settings && 
            typeof storeData.settings === 'object' && 
            !Array.isArray(storeData.settings) &&
            storeData.settings !== null) {
          
          const settingsObj = storeData.settings as Record<string, any>;
          if (typeof settingsObj.is_public === 'boolean') {
            isPublic = settingsObj.is_public;
          }
        }
        
        console.log("Store is_public value:", isPublic);
        
        // Fetch published products for this store
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', storeData.id)
          .eq('published', true);
          
        if (productsError) {
          console.error("Error fetching products:", productsError);
        } else {
          console.log("Found products:", productsData || []);
        }
        
        // Parse settings safely
        const defaultSettings: StoreSettings = {
          menuItems: [
            { id: "1", label: "Početna", url: "/" },
            { id: "2", label: "Proizvodi", url: "/shop" },
            { id: "3", label: "O nama", url: "/about" },
            { id: "4", label: "Kontakt", url: "/contact" }
          ],
          aboutUs: "",
          privacyPolicy: "",
          contactInfo: "",
          is_public: false
        };
        
        // Process store settings
        let storeSettings: StoreSettings;
        
        if (typeof storeData.settings === 'object' && 
            storeData.settings !== null && 
            !Array.isArray(storeData.settings)) {
          
          const settingsObj = storeData.settings as Record<string, any>;
          storeSettings = {
            ...defaultSettings,
            ...settingsObj,
            // Ensure is_public is always a boolean
            is_public: isPublic
          };
        } else {
          storeSettings = defaultSettings;
        }
        
        console.log("Final processed settings:", storeSettings);
        
        // Transform products to match our Product type
        const formattedProducts = productsData ? productsData.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price || 0),
          image: product.image || "https://via.placeholder.com/300",
          slug: product.slug,
          storeId: storeId,
          category: product.category,
          sold_count: product.sold_count || 0
        })) : [];
        
        setStoreProducts(formattedProducts);
        
        // Format store data
        const formattedStore: StoreData = {
          id: storeData.id,
          name: storeData.name,
          slug: storeData.slug,
          settings: storeSettings,
          elements: storeSettings.pageElements || [
            {
              id: '1',
              type: 'hero',
              settings: {
                title: `Dobrodošli u ${storeData.name}`,
                subtitle: 'Otkrijte naše neverovatne proizvode',
                buttonText: 'Kupuj odmah',
                buttonLink: '/shop',
                backgroundImage: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop'
              }
            },
            {
              id: '2',
              type: 'products',
              settings: {
                title: 'Istaknuti proizvodi',
                count: 4,
                layout: 'grid'
              }
            },
            {
              id: '3',
              type: 'text',
              settings: {
                content: storeSettings.aboutUs || 'Nudimo visokokvalitetne proizvode sa odličnom korisničkom podrškom.',
                alignment: 'center'
              }
            }
          ]
        };
        
        console.log("Page elements:", formattedStore.elements);
        setStore(formattedStore);
        setError(null);
      } catch (error) {
        console.error("Error loading store data:", error);
        setError("Error loading store data");
      } finally {
        setLoading(false);
      }
    };
    
    loadStoreData();
  }, [storeId]);

  return { store, loading, storeProducts, error };
};
