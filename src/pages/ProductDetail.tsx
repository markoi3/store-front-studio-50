
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  options: Record<string, string>;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  images: string[];
  category: string;
  variants: ProductVariant[];
}

const ProductDetail = () => {
  const { storeId, slug } = useParams<{ storeId?: string; slug?: string }>();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
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

          // If product has variants, select the first one by default
          if (productData.variants && productData.variants.length > 0) {
            setSelectedVariant(productData.variants[0]);
            setSelectedOptions(productData.variants[0].options || {});
          }
        }
      } catch (error) {
        console.error("Error in fetchProductDetails:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [storeId, slug]);

  // Get all unique option types from variants
  const getOptionTypes = () => {
    if (!product?.variants || product.variants.length === 0) return [];
    
    const optionTypes = new Set<string>();
    product.variants.forEach(variant => {
      if (variant.options) {
        Object.keys(variant.options).forEach(key => optionTypes.add(key));
      }
    });
    
    return Array.from(optionTypes);
  };

  // Get available values for a specific option type
  const getOptionValues = (optionType: string) => {
    if (!product?.variants) return [];
    
    const values = new Set<string>();
    product.variants.forEach(variant => {
      if (variant.options && variant.options[optionType]) {
        values.add(variant.options[optionType]);
      }
    });
    
    return Array.from(values);
  };

  // Handle option selection
  const handleOptionChange = (optionType: string, value: string) => {
    const newSelectedOptions = { ...selectedOptions, [optionType]: value };
    setSelectedOptions(newSelectedOptions);

    // Find matching variant based on selected options
    const matchingVariant = product?.variants.find(variant => {
      if (!variant.options) return false;
      
      return Object.keys(newSelectedOptions).every(key => 
        variant.options[key] === newSelectedOptions[key]
      );
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  // Get current price and stock based on selected variant or base product
  const getCurrentPrice = () => {
    return selectedVariant ? selectedVariant.price : product?.price || 0;
  };

  const getCurrentStock = () => {
    return selectedVariant ? selectedVariant.stock : product?.stock || 0;
  };
  
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
        price: getCurrentPrice(),
        quantity: quantity,
        image: product.image || "",
        storeId: storeId,
        variant: selectedVariant ? {
          id: selectedVariant.id,
          name: selectedVariant.name,
          options: selectedVariant.options
        } : undefined
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
  
  const optionTypes = getOptionTypes();
  
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
              {getCurrentPrice().toLocaleString()} RSD
            </div>
            
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
            
            {/* Product Variants */}
            {optionTypes.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Options:</h3>
                {optionTypes.map(optionType => (
                  <div key={optionType} className="space-y-2">
                    <label className="block text-sm font-medium capitalize">
                      {optionType}:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getOptionValues(optionType).map(value => (
                        <button
                          key={value}
                          onClick={() => handleOptionChange(optionType, value)}
                          className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                            selectedOptions[optionType] === value
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                
                {selectedVariant && (
                  <div className="p-3 bg-accent/20 rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Selected:</span> {selectedVariant.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Price:</span> {selectedVariant.price.toLocaleString()} RSD
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Stock:</span> {selectedVariant.stock} available
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="font-medium">Quantity:</label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={getCurrentStock()}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 px-3 py-2 border rounded-md"
              />
            </div>
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={getCurrentStock() === 0}
              className="w-full py-3 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {getCurrentStock() === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            
            {/* Additional Info */}
            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Category:</span>
                <span>{product.category || "Uncategorized"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Availability:</span>
                <span>{getCurrentStock() > 0 ? `${getCurrentStock()} in stock` : "Out of Stock"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
