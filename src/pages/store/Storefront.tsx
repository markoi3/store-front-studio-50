
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopLayout } from "@/components/layout/ShopLayout";
import { Button } from "@/components/ui/button";

const Storefront = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, you would fetch store data from your API
    // For now, we'll use mock data
    setTimeout(() => {
      setStore({
        id: storeId,
        name: "Demo Store",
        description: "This is a demo store",
        elements: [
          {
            id: '1',
            type: 'hero',
            settings: {
              title: 'Welcome to Demo Store',
              subtitle: 'Discover our amazing products',
              buttonText: 'Shop Now',
              buttonLink: '/shop',
              backgroundImage: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop'
            }
          },
          {
            id: '2',
            type: 'products',
            settings: {
              title: 'Featured Products',
              count: 4,
              layout: 'grid'
            }
          },
          {
            id: '3',
            type: 'text',
            settings: {
              content: 'We offer high quality products with great customer service.',
              alignment: 'center'
            }
          }
        ]
      });
      setLoading(false);
    }, 500);
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
              <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
              <p className="text-muted-foreground mb-6">The store you're looking for doesn't exist or is no longer available.</p>
              <Button asChild>
                <a href="/">Return Home</a>
              </Button>
            </div>
          </div>
        </div>
      </ShopLayout>
    );
  }
  
  return (
    <ShopLayout>
      <div className="space-y-12">
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
              {[1, 2, 3, 4].map((product) => (
                <div key={product} className="product-card">
                  <div className="aspect-square bg-accent mb-3 rounded-md"></div>
                  <h3 className="font-medium">Product {product}</h3>
                  <p className="text-muted-foreground mb-3">$99.00</p>
                  <Button className="w-full">Add to Cart</Button>
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
      </div>
    </ShopLayout>
  );
};

export default Storefront;
