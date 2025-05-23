
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { useStoreData } from "@/hooks/useStoreData";
import { PageElementRenderer } from "@/components/store/PageElementRenderer";

const Storefront = () => {
  const { storeId } = useParams();
  const location = useLocation();
  const { store, loading, storeProducts, error } = useStoreData(storeId);
  const [currentPageElements, setCurrentPageElements] = useState<any[]>([]);
  
  // Determine the current page based on the path
  useEffect(() => {
    if (!store) return;
    
    const path = location.pathname.split("/").filter(Boolean);
    const isHomepage = path.length === 1 || (path.length === 2 && path[1] === "");
    const pageType = path.length > 1 ? path[1] : "home";
    
    console.log("Current page:", pageType, "Path:", path);
    
    // Set the page elements based on the current page
    if (isHomepage || pageType === "home") {
      setCurrentPageElements(store.elements);
    } else if (pageType === "shop") {
      setCurrentPageElements([
        {
          id: 'shop-1',
          type: 'products',
          settings: {
            title: 'Svi proizvodi',
            count: 100,
            layout: 'grid'
          }
        }
      ]);
    } else if (pageType === "about") {
      setCurrentPageElements([
        {
          id: 'about-1',
          type: 'text',
          settings: {
            content: store.settings.aboutUs || 'O nama stranica',
            alignment: 'left'
          }
        }
      ]);
    } else if (pageType === "contact") {
      setCurrentPageElements([
        {
          id: 'contact-1',
          type: 'text',
          settings: {
            content: store.settings.contactInfo || 'Kontakt informacije',
            alignment: 'left'
          }
        }
      ]);
    } else {
      // This must be a product page
      const productSlug = path[path.length - 1];
      const product = storeProducts.find(p => p.slug === productSlug);
      
      if (product) {
        setCurrentPageElements([
          {
            id: 'product-detail',
            type: 'productDetail',
            settings: {
              product
            }
          }
        ]);
      } else {
        setCurrentPageElements([
          {
            id: 'not-found',
            type: 'text',
            settings: {
              content: 'Proizvod nije pronađen',
              alignment: 'center'
            }
          }
        ]);
      }
    }
  }, [location.pathname, store, storeProducts]);
  
  if (loading) {
    return (
      <StoreLayout>
        <div className="container mx-auto py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-36 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </StoreLayout>
    );
  }
  
  if (error) {
    return (
      <StoreLayout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Greška pri učitavanju prodavnice</h2>
            <p className="text-gray-600 mb-8">{error}</p>
          </div>
        </div>
      </StoreLayout>
    );
  }
  
  if (!store) {
    return (
      <StoreLayout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Prodavnica nije pronađena</h2>
            <p className="text-gray-600 mb-8">Tražena prodavnica nije pronađena ili više nije dostupna.</p>
          </div>
        </div>
      </StoreLayout>
    );
  }
  
  return (
    <StoreLayout>
      <div>
        {currentPageElements.map((element) => (
          <PageElementRenderer 
            key={element.id} 
            element={element} 
            products={storeProducts} 
          />
        ))}
      </div>
    </StoreLayout>
  );
};

export default Storefront;
