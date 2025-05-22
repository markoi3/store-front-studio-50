
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopLayout } from "@/components/layout/ShopLayout";
import { Button } from "@/components/ui/button";
import { Product } from "@/components/shop/ProductCard";
import { Link } from "react-router-dom";

// Function to get stored products
const getStoredProducts = () => {
  try {
    const products = localStorage.getItem("products");
    console.log("Retrieved stored products:", products);
    return products ? JSON.parse(products) : [];
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
};

// Function to get stored user data
const getStoredUsers = () => {
  try {
    const currentUser = localStorage.getItem("user");
    return currentUser ? [JSON.parse(currentUser)] : [];
  } catch (error) {
    console.error("Error loading user data:", error);
    return [];
  }
};

// Function to get menu items
const getMenuItems = () => {
  try {
    const menuItems = localStorage.getItem("storeMenuItems");
    return menuItems ? JSON.parse(menuItems) : [
      { id: "1", label: "Početna", url: "/" },
      { id: "2", label: "Proizvodi", url: "/shop" },
      { id: "3", label: "O nama", url: "/about" },
      { id: "4", label: "Kontakt", url: "/contact" }
    ];
  } catch (error) {
    console.error("Error loading menu items:", error);
    return [];
  }
};

const Storefront = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [menuItems, setMenuItems] = useState([]);
  
  useEffect(() => {
    // Load menu items
    setMenuItems(getMenuItems());
    
    // Load all stored products
    const allProducts = getStoredProducts();
    console.log("All products:", allProducts);
    
    // Filter for published products
    const publishedProducts = allProducts.filter((p: any) => p.published !== false);
    console.log("Published products:", publishedProducts);
    
    // Add storeId to each product for correct routing
    const productsWithStoreId = publishedProducts.map((product: any) => ({
      ...product,
      storeId: storeId
    }));
    
    setStoreProducts(productsWithStoreId);
    
    // Load user data to find the matching store
    const users = getStoredUsers();
    let foundStore = null;
    
    // Look for the store matching the storeId slug
    for (const user of users) {
      if (user.store && user.store.slug === storeId) {
        foundStore = {
          id: user.store.id || storeId,
          name: user.store.name || "Demo Prodavnica",
          description: "Ovo je demo prodavnica",
          settings: user.store.settings || {},
          elements: [
            {
              id: '1',
              type: 'hero',
              settings: {
                title: `Dobrodošli u ${user.store.name || "Demo Prodavnicu"}`,
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
                content: user.store.settings?.aboutUs || 'Nudimo visokokvalitetne proizvode sa odličnom korisničkom podrškom.',
                alignment: 'center'
              }
            }
          ]
        };
        break;
      }
    }
    
    // If no matching store is found, use a default store
    if (!foundStore) {
      foundStore = {
        id: storeId,
        name: "Demo Prodavnica",
        description: "Ovo je demo prodavnica",
        elements: [
          {
            id: '1',
            type: 'hero',
            settings: {
              title: 'Dobrodošli u Demo Prodavnicu',
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
              content: 'Nudimo visokokvalitetne proizvode sa odličnom korisničkom podrškom.',
              alignment: 'center'
            }
          }
        ]
      };
    }
    
    setStore(foundStore);
    setLoading(false);
  }, [storeId]);
  
  if (loading) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-40 bg-muted rounded mb-4"></div>
              <div className="h-4 w-60 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </ShopLayout>
    );
  }
  
  if (!store) {
    return (
      <ShopLayout>
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
      </ShopLayout>
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
  console.log("Display products:", displayProducts);

  // Custom navigation for this store
  const renderCustomNavigation = () => {
    return (
      <div className="flex justify-center space-x-6 mb-8">
        {menuItems.map((item: any) => (
          <Link 
            key={item.id}
            to={item.url.startsWith('/') ? item.url : `/${item.url}`}
            className="text-foreground hover:text-primary font-medium"
          >
            {item.label}
          </Link>
        ))}
      </div>
    );
  };
  
  return (
    <ShopLayout>
      <div className="space-y-12">
        {/* Navigation */}
        {renderCustomNavigation()}
        
        {/* Hero Section */}
        {store.elements.find((el: any) => el.type === 'hero') && (
          <div className="relative h-[70vh] bg-accent">
            <img 
              src={store.elements.find((el: any) => el.type === 'hero').settings.backgroundImage} 
              alt="Hero" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                {store.elements.find((el: any) => el.type === 'hero').settings.title}
              </h1>
              <p className="text-xl md:text-2xl mb-6 max-w-2xl text-center">
                {store.elements.find((el: any) => el.type === 'hero').settings.subtitle}
              </p>
              <Button size="lg" className="text-lg px-6">
                {store.elements.find((el: any) => el.type === 'hero').settings.buttonText}
              </Button>
            </div>
          </div>
        )}
        
        {/* Featured Products */}
        {store.elements.find((el: any) => el.type === 'products') && (
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold mb-6 text-center">
              {store.elements.find((el: any) => el.type === 'products').settings.title}
            </h2>
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
                      : parseFloat(product.price).toLocaleString("sr-RS")} RSD
                  </p>
                  <Link to={`/product/${product.slug || product.id}`}>
                    <Button className="w-full">Detaljnije</Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Text Section */}
        {store.elements.find((el: any) => el.type === 'text') && (
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg">
                {store.elements.find((el: any) => el.type === 'text').settings.content}
              </p>
            </div>
          </div>
        )}
        
        {/* Privacy Policy Section (if exists) */}
        {store.settings?.privacyPolicy && (
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
    </ShopLayout>
  );
};

export default Storefront;
