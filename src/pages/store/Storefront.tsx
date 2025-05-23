import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Button } from "@/components/ui/button";
import { Product } from "@/components/shop/ProductCard";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface StoreMenuItem {
  id: string;
  label: string;
  url: string;
}

interface StoreSettings {
  menuItems?: StoreMenuItem[];
  aboutUs?: string;
  privacyPolicy?: string;
  contactInfo?: string;
  pageElements?: any[];
  [key: string]: any;
}

interface StoreData {
  id: string;
  name: string;
  slug: string;
  settings: StoreSettings;
  elements: any[];
}

const Storefront = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [menuItems, setMenuItems] = useState<StoreMenuItem[]>([
    { id: "1", label: "Početna", url: "/" },
    { id: "2", label: "Proizvodi", url: "/shop" },
    { id: "3", label: "O nama", url: "/about" },
    { id: "4", label: "Kontakt", url: "/contact" }
  ]);
  
  useEffect(() => {
    const loadStoreData = async () => {
      try {
        if (!storeId) return;
        
        console.log("Loading store data for slug:", storeId);
        
        // Fetch store by slug
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('slug', storeId)
          .maybeSingle();
          
        if (storeError) {
          console.error("Error fetching store:", storeError);
          setLoading(false);
          return;
        }
        
        if (!storeData) {
          console.error("No store found with slug:", storeId);
          setLoading(false);
          return;
        }
        
        console.log("Found store:", storeData);
        
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
          contactInfo: ""
        };
        
        // Process store settings
        const storeSettings: StoreSettings = 
          (typeof storeData.settings === 'object' && storeData.settings !== null) 
            ? { ...defaultSettings, ...storeData.settings }
            : defaultSettings;
            
        // Set menu items from settings
        if (storeSettings.menuItems && Array.isArray(storeSettings.menuItems)) {
          setMenuItems(storeSettings.menuItems);
        }
        
        // Transform products to match our Product type
        const formattedProducts = productsData ? productsData.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price || 0),
          image: product.image || "https://via.placeholder.com/300",
          slug: product.slug,
          storeId: storeId,
          category: product.category
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
      } catch (error) {
        console.error("Error loading store data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStoreData();
  }, [storeId]);
  
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
              <h1 className="text-2xl font-bold mb-2">Prodavnica nije pronađena</h1>
              <p className="text-muted-foreground mb-6">Prodavnica koju tražite ne postoji ili više nije dostupna.</p>
              <Button asChild>
                <a href="/">Povratak na početnu</a>
              </Button>
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }
  
  // Default products if no custom products available
  const defaultProducts = [
    {
      id: "default1",
      name: "Proizvod 1",
      price: 9900,
      image: "https://via.placeholder.com/300",
      slug: "proizvod-1",
      storeId: storeId,
      category: "furniture"
    },
    {
      id: "default2",
      name: "Proizvod 2",
      price: 12900,
      image: "https://via.placeholder.com/300",
      slug: "proizvod-2",
      storeId: storeId,
      category: "furniture"
    },
    {
      id: "default3",
      name: "Proizvod 3",
      price: 7900,
      image: "https://via.placeholder.com/300",
      slug: "proizvod-3",
      storeId: storeId,
      category: "kitchen"
    },
    {
      id: "default4",
      name: "Proizvod 4",
      price: 15900,
      image: "https://via.placeholder.com/300",
      slug: "proizvod-4",
      storeId: storeId,
      category: "lighting"
    }
  ];
  
  // Use stored products if available, otherwise use defaults
  const displayProducts = storeProducts.length > 0 ? storeProducts : defaultProducts;

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

  // Render page elements
  const renderPageElements = () => {
    if (!store.elements || !Array.isArray(store.elements) || store.elements.length === 0) {
      console.log("No page elements to render");
      return null;
    }

    console.log("Rendering page elements:", store.elements);
    
    return (
      <div className="space-y-12">
        {store.elements.map((element) => (
          <div key={element.id}>
            {/* Hero Element */}
            {element.type === 'hero' && (
              <div className="relative h-[70vh] bg-accent">
                <img 
                  src={element.settings?.backgroundImage || ''} 
                  alt="Hero" 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center text-white px-4"
                  style={{
                    backgroundColor: element.settings?.backgroundColor ? `${element.settings.backgroundColor}40` : "rgba(0,0,0,0.4)"
                  }}
                >
                  <h1 
                    className="text-4xl md:text-5xl font-bold mb-4 text-center"
                    style={{color: element.settings?.textColor || "white"}}
                  >
                    {element.settings?.title || "Welcome"}
                  </h1>
                  <p 
                    className="text-xl md:text-2xl mb-6 max-w-2xl text-center"
                    style={{color: element.settings?.subtitleColor || element.settings?.textColor || "white"}}
                  >
                    {element.settings?.subtitle || "Discover our amazing products"}
                  </p>
                  {element.settings?.buttonText && (
                    <Button 
                      size="lg" 
                      className="text-lg px-6"
                      onClick={() => handleNavigate(element.settings?.buttonLink || '/shop')}
                      style={{
                        backgroundColor: element.settings?.buttonColor || "",
                        color: element.settings?.buttonTextColor || ""
                      }}
                    >
                      {element.settings.buttonText}
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {/* Products Element */}
            {element.type === 'products' && (
              <div className="container mx-auto px-4 py-12">
                <h2 
                  className="text-3xl font-bold mb-6 text-center"
                  style={{color: element.settings?.titleColor || ""}}
                >
                  {element.settings?.title || "Featured Products"}
                </h2>
                <div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  style={{
                    backgroundColor: element.settings?.backgroundColor || ""
                  }}
                >
                  {displayProducts.slice(0, element.settings?.count || 4).map((product: Product) => (
                    <div key={product.id} className="product-card">
                      <div className="aspect-square bg-accent mb-3 rounded-md overflow-hidden">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted"></div>
                        )}
                      </div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-muted-foreground mb-3 font-numeric">
                        {typeof product.price === 'number' 
                          ? product.price.toLocaleString("sr-RS") 
                          : parseFloat(String(product.price || 0)).toLocaleString("sr-RS")} RSD
                      </p>
                      <Button 
                        className="w-full"
                        onClick={() => navigate(`/store/${storeId}/product/${product.slug || product.id}`)}
                        style={{
                          backgroundColor: element.settings?.buttonColor || "",
                          color: element.settings?.buttonTextColor || ""
                        }}
                      >
                        Detaljnije
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Text Element */}
            {element.type === 'text' && (
              <div 
                className="container mx-auto px-4 py-12"
                style={{
                  backgroundColor: element.settings?.backgroundColor || ""
                }}
              >
                <div className="max-w-3xl mx-auto text-center">
                  <p 
                    className="text-lg"
                    style={{
                      color: element.settings?.textColor || "",
                      textAlign: element.settings?.alignment || "center"
                    }}
                  >
                    {element.settings?.content || ""}
                  </p>
                </div>
              </div>
            )}
            
            {/* Add more element types as needed */}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <StoreLayout>
      <div className="space-y-12">
        {/* Page Content */}
        {renderPageElements()}
        
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
