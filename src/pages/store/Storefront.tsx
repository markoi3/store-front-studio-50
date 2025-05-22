import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Product } from "@/components/shop/ProductCard";
import { Link } from "react-router-dom";
import { withStoreLayout } from "@/components/layout/StorePageLayout";
import { useStore } from "@/hooks/useStore";
import { supabase } from "@/integrations/supabase/client";

const Storefront = () => {
  const { store, loading, storeId, getStoreUrl, getPageElements } = useStore();
  const navigate = useNavigate();
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  
  // Get page elements for the homepage
  const pageElements = getPageElements('homepage');
  
  useEffect(() => {
    const loadStoreProducts = async () => {
      if (!store) return;
      
      try {
        setProductsLoading(true);
        console.log("Loading products for store ID:", store.id);
        
        // Fetch the current store's products from Supabase
        const { data: products, error } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', store.id)
          .eq('published', true);
        
        if (error) {
          console.error("Error loading products from Supabase:", error);
          return;
        }
        
        if (products && products.length > 0) {
          console.log("Found products in Supabase:", products.length);
          setStoreProducts(products);
        } else {
          console.log("No products found in Supabase for store", store.id);
          
          // Try to fetch from localStorage as backup
          const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
          console.log("All stored products:", storedProducts);
          
          // Make sure we're using the correct store ID format for comparison
          const storeProducts = storedProducts.filter((p: any) => {
            const productStoreId = typeof p.store_id === 'string' ? p.store_id : p.storeId;
            const currentStoreId = typeof store.id === 'string' ? store.id : storeId;
            
            console.log(`Comparing product store ID: ${productStoreId} with current store ID: ${currentStoreId}`);
            return productStoreId === currentStoreId || p.storeId === storeId;
          });
          
          if (storeProducts.length > 0) {
            console.log("Found products in localStorage:", storeProducts.length);
            setStoreProducts(storeProducts);
          } else {
            console.log("Using default products as fallback");
            // Use default products but set their store ID to the current store ID
            const productsWithCorrectStoreId = defaultProducts.map(p => ({
              ...p,
              store_id: store.id,
              storeId: store.id
            }));
            setStoreProducts(productsWithCorrectStoreId);
          }
        }
      } catch (error) {
        console.error("Error in loadStoreProducts:", error);
      } finally {
        setProductsLoading(false);
      }
    };
    
    loadStoreProducts();
  }, [store]);
  
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
            <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
            <p className="text-muted-foreground mb-6">The store you're looking for doesn't exist or is no longer available.</p>
            <Button asChild>
              <a href="/">Back to Home</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Default products if no custom products available
  const defaultProducts = [
    {
      id: "default1",
      name: "Product 1",
      price: 9900,
      image: "https://via.placeholder.com/300",
      slug: "product-1",
      storeId: storeId,
      category: "furniture"
    },
    {
      id: "default2",
      name: "Product 2",
      price: 12900,
      image: "https://via.placeholder.com/300",
      slug: "product-2",
      storeId: storeId,
      category: "furniture"
    },
    {
      id: "default3",
      name: "Product 3",
      price: 7900,
      image: "https://via.placeholder.com/300",
      slug: "product-3",
      storeId: storeId,
      category: "kitchen"
    },
    {
      id: "default4",
      name: "Product 4",
      price: 15900,
      image: "https://via.placeholder.com/300",
      slug: "product-4",
      storeId: storeId,
      category: "lighting"
    }
  ];
  
  // Use stored products if available, otherwise use defaults
  const displayProducts = storeProducts.length > 0 ? storeProducts : defaultProducts.map(p => ({
    ...p,
    store_id: storeId,
    storeId: storeId
  }));

  // Render page elements
  const renderPageElements = () => {
    if (!pageElements || pageElements.length === 0) {
      // Use default elements if no custom elements available
      return (
        <>
          {/* Default Hero Section */}
          <div className="relative h-[70vh] bg-accent">
            <img 
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop" 
              alt="Default Hero" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                {`Welcome to ${store.name}`}
              </h1>
              <p className="text-xl md:text-2xl mb-6 max-w-2xl text-center">
                Discover our amazing products
              </p>
              <Button 
                size="lg" 
                className="text-lg px-6"
                onClick={() => navigate(getStoreUrl("/shop"))}
              >
                Shop Now
              </Button>
            </div>
          </div>

          {/* Default Featured Products */}
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProducts.slice(0, 4).map((product: Product) => (
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
                    onClick={() => navigate(getStoreUrl(`/product/${product.slug || product.id}`))}
                  >
                    Details
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }

    return pageElements.map((element) => {
      switch (element.type) {
        case 'hero':
          return (
            <div key={element.id} className="relative h-[70vh] bg-accent">
              <img 
                src={element.settings.backgroundImage} 
                alt="Hero" 
                className="absolute inset-0 w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                  {element.settings.title}
                </h1>
                <p className="text-xl md:text-2xl mb-6 max-w-2xl text-center">
                  {element.settings.subtitle}
                </p>
                <Button 
                  size="lg" 
                  className="text-lg px-6"
                  onClick={() => navigate(getStoreUrl(element.settings.buttonLink || '/shop'))}
                >
                  {element.settings.buttonText}
                </Button>
              </div>
            </div>
          );
        case 'products':
          return (
            <div key={element.id} className="container mx-auto px-4 py-12">
              <h2 className="text-3xl font-bold mb-6 text-center">
                {element.settings.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayProducts.slice(0, element.settings.count || 4).map((product: Product) => (
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
                      onClick={() => navigate(getStoreUrl(`/product/${product.slug || product.id}`))}
                    >
                      Details
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          );
        case 'text':
          return (
            <div key={element.id} className="container mx-auto px-4 py-12">
              <div className={`max-w-3xl mx-auto text-${element.settings.alignment || 'center'}`}>
                <p className="text-lg">
                  {element.settings.content}
                </p>
              </div>
            </div>
          );
        case 'image':
          return (
            <div key={element.id} className="container mx-auto px-4 py-12">
              <div className="max-w-3xl mx-auto">
                <img 
                  src={element.settings.src} 
                  alt={element.settings.alt || ''} 
                  className="w-full rounded-lg shadow-md" 
                />
              </div>
            </div>
          );
        case 'categories':
          return (
            <div key={element.id} className="container mx-auto px-4 py-12">
              <h2 className="text-3xl font-bold mb-6 text-center">{element.settings.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="aspect-square relative bg-accent rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors">
                    <span className="text-white text-xl font-bold">Furniture</span>
                  </div>
                </div>
                <div className="aspect-square relative bg-accent rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors">
                    <span className="text-white text-xl font-bold">Kitchen</span>
                  </div>
                </div>
                <div className="aspect-square relative bg-accent rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors">
                    <span className="text-white text-xl font-bold">Lighting</span>
                  </div>
                </div>
              </div>
            </div>
          );
        case 'testimonials':
          return (
            <div key={element.id} className="container mx-auto px-4 py-12 bg-accent/10">
              <h2 className="text-3xl font-bold mb-6 text-center">{element.settings.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-background p-6 rounded-lg shadow-sm">
                  <p className="italic mb-4">"Amazing quality and fast shipping! Will definitely shop here again."</p>
                  <p className="font-medium">— Sarah K.</p>
                </div>
                <div className="bg-background p-6 rounded-lg shadow-sm">
                  <p className="italic mb-4">"The products exceeded my expectations. Great customer service too!"</p>
                  <p className="font-medium">— Mark T.</p>
                </div>
                <div className="bg-background p-6 rounded-lg shadow-sm">
                  <p className="italic mb-4">"Very satisfied with my purchase. The quality is outstanding."</p>
                  <p className="font-medium">— Jennifer M.</p>
                </div>
              </div>
            </div>
          );
        case 'cta':
          return (
            <div key={element.id} className={`py-12 ${element.settings.backgroundColor || 'bg-primary'}`}>
              <div className="container mx-auto px-4 text-center">
                <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${element.settings.textColor || 'text-primary-foreground'}`}>
                  {element.settings.title}
                </h2>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={() => navigate(getStoreUrl(element.settings.buttonLink || '/contact'))}
                >
                  {element.settings.buttonText}
                </Button>
              </div>
            </div>
          );
        default:
          return null;
      }
    });
  };
  
  return (
    <div className="space-y-12">
      {/* Render the page elements */}
      {renderPageElements()}
      
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

export default withStoreLayout(Storefront);
