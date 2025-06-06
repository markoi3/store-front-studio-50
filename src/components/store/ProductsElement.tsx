
import { Button } from "@/components/ui/button";
import { Product } from "@/components/shop/ProductCard";
import { useNavigate } from "react-router-dom";

interface ProductsElementProps {
  element: {
    id: string;
    type: string;
    settings: {
      title?: string;
      count?: number;
      titleColor?: string;
      backgroundColor?: string;
      buttonColor?: string;
      buttonTextColor?: string;
    };
  };
  products: Product[];
  storeId: string;
}

export const ProductsElement = ({ element, products, storeId }: ProductsElementProps) => {
  const navigate = useNavigate();
  
  console.log("ProductsElement received products:", products);
  console.log("ProductsElement settings:", element.settings);
  console.log("Store ID in ProductsElement:", storeId);
  
  // Get product count from settings or default to 4
  const productCount = element.settings?.count || 4;
  console.log("Product count to display:", productCount);

  // Check if products is empty or undefined
  if (!products || products.length === 0) {
    console.log("No products available to display");
    return (
      <div 
        className="container mx-auto px-4 py-12"
        style={{
          backgroundColor: element.settings?.backgroundColor || ""
        }}
      >
        <h2 
          className="text-3xl font-bold mb-6 text-center"
          style={{color: element.settings?.titleColor || ""}}
        >
          {element.settings?.title || "Featured Products"}
        </h2>
        <div className="text-center text-muted-foreground p-8">
          No products available to display.
        </div>
      </div>
    );
  }

  console.log("Will display up to", productCount, "products from", products.length, "available");

  return (
    <div 
      className="container mx-auto px-4 py-12"
      style={{
        backgroundColor: element.settings?.backgroundColor || ""
      }}
    >
      <h2 
        className="text-3xl font-bold mb-6 text-center"
        style={{color: element.settings?.titleColor || ""}}
      >
        {element.settings?.title || "Featured Products"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, productCount).map((product: Product) => (
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
              onClick={() => {
                console.log("Navigating to product page:", `/store/${storeId}/product/${product.slug || product.id}`);
                navigate(`/store/${storeId}/product/${product.slug || product.id}`);
              }}
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
  );
};
