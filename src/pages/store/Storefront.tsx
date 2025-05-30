
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageElementRenderer } from "@/components/store/PageElementRenderer";
import { useStoreData } from "@/hooks/useStoreData";
import { getDefaultProducts } from "@/components/store/DefaultProducts";
import { useAuth } from "@/contexts/AuthContext";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Shop from "@/pages/Shop";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";

const Storefront = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { store, loading, storeProducts, error } = useStoreData({ 
    storeId, 
    currentUserId: user?.id 
  });
  
  // Extract the sub-route from the current path
  const storePath = location.pathname.replace(`/store/${storeId}`, '') || '/';
  
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
            <h1 className="text-2xl font-bold mb-2">Prodavnica nije dostupna</h1>
            <p className="text-muted-foreground mb-6">
              {error || "Prodavnica koju tražite ne postoji ili više nije dostupna."}
            </p>
            <Button asChild>
              <a href="/">Povratak na početnu</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Debug information for store visibility
  console.log("Store settings:", store.settings);
  console.log("Store is_public:", store.settings.is_public);
  console.log("Current user:", user);
  console.log("Store path:", storePath);
  
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
  
  // Handle different sub-routes
  const renderContent = () => {
    switch (storePath) {
      case '/about':
        return <About />;
      case '/contact':
        return <Contact />;
      case '/shop':
        return <Shop />;
      case '/privacy':
        return <Privacy />;
      case '/terms':
        return <Terms />;
      default:
        // Homepage - render page elements
        return (
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
        );
    }
  };
  
  return renderContent();
};

export default Storefront;
