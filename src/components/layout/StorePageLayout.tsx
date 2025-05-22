
import { ReactNode, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ShopLayout } from "./ShopLayout";
import { supabase } from "@/integrations/supabase/client";

type StorePageLayoutProps = {
  children: ReactNode;
};

export const StorePageLayout = ({ children }: StorePageLayoutProps) => {
  const { storeId } = useParams<{ storeId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  // If we're on a non-store route (e.g. /about instead of /store/slug/about),
  // try to redirect to the first store we find
  useEffect(() => {
    const redirectToStoreRoute = async () => {
      if (!storeId) {
        try {
          setLoading(true);
          
          // Get the current path without leading slash
          const currentPath = location.pathname.substring(1);
          
          // Fetch the first available store
          const { data: storeData, error } = await supabase
            .from('stores')
            .select('slug')
            .limit(1)
            .single();
            
          if (error) {
            console.error("Error fetching store:", error);
            setLoading(false);
            return;
          }
          
          if (storeData && storeData.slug) {
            // Redirect to the store-specific route
            navigate(`/store/${storeData.slug}/${currentPath}`);
          }
        } catch (error) {
          console.error("Error redirecting to store route:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    redirectToStoreRoute();
  }, [storeId, location.pathname, navigate]);
  
  if (loading) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-40 bg-muted rounded mb-4"></div>
            <div className="h-4 w-60 bg-muted rounded"></div>
          </div>
        </div>
      </ShopLayout>
    );
  }
  
  return <ShopLayout>{children}</ShopLayout>;
};

// Higher Order Component wrapper for store pages
export const withStoreLayout = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <StorePageLayout>
      <Component {...props} />
    </StorePageLayout>
  );
};
