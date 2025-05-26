
import { ReactNode, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { StoreLayout } from "./StoreLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useStoreVisibility } from "@/hooks/useStoreVisibility";
import ComingSoon from "@/pages/ComingSoon";

type StorePageLayoutProps = {
  children: ReactNode;
};

export const StorePageLayout = ({ children }: StorePageLayoutProps) => {
  const { storeId } = useParams<{ storeId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { shouldShowComingSoon, loading: visibilityLoading, isOwner } = useStoreVisibility({ storeId });
  
  // If we're on a non-store route (e.g. /about instead of /store/slug/about),
  // try to redirect to the first store we find
  useEffect(() => {
    const redirectToStoreRoute = async () => {
      if (!storeId && !location.pathname.startsWith('/store/')) {
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
            toast.error("Navigation error", {
              description: "Could not load store information. Please try again.",
            });
            setLoading(false);
            return;
          }
          
          if (storeData && storeData.slug) {
            // Construct the proper store-specific URL
            const storeUrl = `/store/${storeData.slug}${currentPath ? `/${currentPath}` : ''}`;
            console.log(`Redirecting to store route: ${storeUrl}`);
            
            // Redirect to the store-specific route
            navigate(storeUrl);
          }
        } catch (error) {
          console.error("Error redirecting to store route:", error);
          toast.error("Navigation error", {
            description: "Could not redirect to store route. Please try again.",
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    redirectToStoreRoute();
  }, [storeId, location.pathname, navigate]);
  
  if (loading || visibilityLoading) {
    return (
      <StoreLayout>
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-40 bg-muted rounded mb-4"></div>
            <div className="h-4 w-60 bg-muted rounded"></div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  // Show Coming Soon page if store is private and user is not owner
  // This applies to ALL store routes, not just the homepage
  if (shouldShowComingSoon) {
    console.log("Showing Coming Soon page for private store");
    return <ComingSoon />;
  }
  
  return <StoreLayout>{children}</StoreLayout>;
};

// Higher Order Component wrapper for store pages
export const withStoreLayout = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <StorePageLayout>
      <Component {...props} />
    </StorePageLayout>
  );
};
