import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;  // Price as a number
  stock: number;
  image: string;
  images: string[];
  category: string;
  variants: any[];
}

const ProductDetail = () => {
  const { storeId, slug } = useParams<{ storeId?: string; slug?: string }>();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!storeId || !slug) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (error) {
          console.error("Error fetching product:", error);
        } else if (data) {
          // Make sure price is a number and convert image arrays
          const productData: ProductData = {
            ...data,
            price: Number(data.price),
            // Convert JSON images to string[]
            images: Array.isArray(data.images) 
              ? data.images.map(img => typeof img === 'string' ? img : String(img))
              : [],
            variants: Array.isArray(data.variants) ? data.variants : []
          };
          
          setProduct(productData);
        }
      } catch (error) {
        console.error("Error in fetchProductDetails:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [storeId, slug]);

  // Convert the price to a string when displaying to fix the type error
  const formattedPrice = product ? product.price.toString() : "0";
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image || "",
        storeId: storeId
      });
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-accent/50 rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-8 bg-accent/50 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-accent/50 rounded w-1/4 animate-pulse"></div>
              <div className="h-4 bg-accent/50 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-accent/50 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-accent/50 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <div className="aspect-square bg-accent/20 rounded-lg overflow-hidden">
              <img 
                src={product.image || "https://via.placeholder.com/600"} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Additional Images */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {product.images.map((img, index) => (
                  <div key={index} className="aspect-square bg-accent/20 rounded-md overflow-hidden">
                    <img 
                      src={img} 
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            
            <div className="text-2xl font-bold">
              {parseInt(formattedPrice).toLocaleString()} RSD
            </div>
            
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
            
            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="font-medium">Quantity:</label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 px-3 py-2 border rounded-md"
              />
            </div>
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-3 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Add to Cart
            </button>
            
            {/* Additional Info */}
            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Category:</span>
                <span>{product.category || "Uncategorized"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Availability:</span>
                <span>{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default (ProductDetail);
