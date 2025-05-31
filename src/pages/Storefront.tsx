import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageElementRenderer } from "@/components/store/PageElementRenderer";
import { useStoreData } from "@/hooks/useStoreData";
import { getDefaultProducts } from "@/components/store/DefaultProducts";
import { useAuth } from "@/contexts/AuthContext";

const Storefront = () => {
  const { storeSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { store, loading, storeProducts, error } = useStoreData({ 
    storeId: storeSlug, 
    currentUserId: user?.id 
  });
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-40 bg-muted rounded mb-4"></div>
            <div className="h-4 w-60 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!store) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Store Not Available</h1>
            <p className="text-muted-foreground mb-6">
              {error || "The store you're looking for doesn't exist or is no longer available."}
            </p>
            <Button onClick={() => navigate("/")}>
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Use stored products if available, otherwise use defaults
  const displayProducts = storeProducts.length > 0 ? storeProducts : getDefaultProducts(storeSlug || '');

  // Function to handle navigation while keeping store context
  const handleNavigate = (path: string) => {
    if (path.startsWith('/')) {
      const fullPath = `/store/${storeSlug}${path}`;
      navigate(fullPath);
    } else {
      navigate(path);
    }
  };
  
  return (
    <div className="space-y-12 store-content">
      {/* Page Content */}
      <PageElementRenderer 
        elements={store.elements || []}
        products={displayProducts}
        storeId={storeSlug || ''}
        onNavigate={handleNavigate}
      />
      
      {/* Privacy Policy Section (if exists) */}
      {store?.settings?.privacyPolicy && (
        <div className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
            <div className="prose">
              {store.settings.privacyPolicy}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Storefront;
