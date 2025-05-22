import { ReactNode, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { StoreLayout } from "./StoreLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useStore } from "@/hooks/useStore"; // Added proper import

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
  
  if (loading) {
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

// CustomPage component to render custom pages created in the builder
export const CustomPage = withStoreLayout(() => {
  const { slug } = useParams<{ slug?: string }>();
  const { store, loading, getCustomPage } = useStore();
  
  const customPage = getCustomPage(slug || '');
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-accent/50 rounded w-1/3"></div>
          <div className="h-4 bg-accent/50 rounded w-full"></div>
          <div className="h-4 bg-accent/50 rounded w-5/6"></div>
          <div className="h-4 bg-accent/50 rounded w-4/6"></div>
        </div>
      </div>
    );
  }
  
  if (!customPage) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p>The page you are looking for could not be found.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{customPage.title}</h1>
        <div className="prose max-w-none">
          {customPage.content}
        </div>
      </div>
    </div>
  );
});
