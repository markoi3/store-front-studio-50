
import { useParams, useNavigate } from "react-router-dom";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Button } from "@/components/ui/button";
import { PageElementRenderer } from "@/components/store/PageElementRenderer";
import { useStoreData } from "@/hooks/useStoreData";
import { getDefaultProducts } from "@/components/store/DefaultProducts";
import { useAuth } from "@/contexts/AuthContext";

const Storefront = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { store, loading, storeProducts, error } = useStoreData({ 
    storeId, 
    currentUserId: user?.id 
  });
  
  if (loading) {
    return (
      <StoreLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-40 bg-muted rounded mb-4"></div>
              <div className="h-4 w-60 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }
  
  if (!store) {
    return (
      <StoreLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Prodavnica nije dostupna</h1>
              <p className="text-muted-foreground mb-6">
                {error === "Prodavnica je privatna i nedostupna javnosti" 
                  ? "Ova prodavnica je privatna i možete je videti samo ako ste vlasnik."
                  : error || "Prodavnica koju tražite ne postoji ili više nije dostupna."
                }
              </p>
              <Button asChild>
                <a href="/">Povratak na početnu</a>
              </Button>
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }
  
  // Debug information for store visibility
  console.log("Store settings:", store.settings);
  console.log("Store is_public:", store.settings.is_public);
  console.log("Current user:", user);
  
  // Use stored products if available, otherwise use defaults
  const displayProducts = storeProducts.length > 0 ? storeProducts : getDefaultProducts(storeId);

  // Function to handle navigation while keeping store context
  const handleNavigate = (path: string) => {
    if (path.startsWith('/')) {
      // Ako path počinje sa '/', dodajemo storeId prefix
      const fullPath = `/store/${storeId}${path}`;
      navigate(fullPath);
    } else {
      navigate(path);
    }
  };
  
  return (
    <StoreLayout>
      <div className="space-y-12">
        {/* Page Content */}
        <PageElementRenderer 
          elements={store.elements}
          products={displayProducts}
          storeId={storeId || ''}
          onNavigate={handleNavigate}
        />
        
        {/* Privacy Policy Section (if exists) */}
        {store?.settings.privacyPolicy && (
          <div className="container mx-auto px-4 py-12 border-t">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Politika privatnosti</h2>
              <div className="prose">
                {store.settings.privacyPolicy}
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default Storefront;
