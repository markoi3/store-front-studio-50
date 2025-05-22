
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShopLayout } from "@/components/layout/ShopLayout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ProductCard, Product } from "@/components/shop/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

type ProductVariant = {
  id: string;
  name: string;
  price: number | null; // null means same as base price
};

type ProductDetails = {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  features: string[];
  category: string;
  variants: ProductVariant[];
  specifications: Record<string, string>;
  slug: string;
  storeId?: string;
};

const ProductDetail = () => {
  const { slug, storeId } = useParams<{ slug: string; storeId?: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!slug) return;

        // Fetch the product by slug
        const { data: productData, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (error) {
          console.error('Error fetching product:', error);
          setLoading(false);
          return;
        }

        if (!productData) {
          console.error('Product not found with slug:', slug);
          setLoading(false);
          return;
        }

        console.log('Found product:', productData);

        // Format the product data
        const formattedProduct: ProductDetails = {
          id: productData.id,
          name: productData.name || 'Unnamed Product',
          price: parseFloat(productData.price) || 0,
          images: productData.image ? [productData.image] : ['https://via.placeholder.com/300'],
          description: productData.description || 'No description available',
          features: ['Quality product', 'Made with care', 'Durable materials'],
          category: productData.category || 'uncategorized',
          variants: [],
          specifications: {
            'Material': 'High quality materials',
            'Dimensions': 'Standard size',
            'Weight': 'Light weight',
          },
          slug: productData.slug,
          storeId: productData.store_id,
        };

        // Set the product data
        setProduct(formattedProduct);

        // Fetch similar products (in the same category)
        const { data: similarData, error: similarError } = await supabase
          .from('products')
          .select('*')
          .eq('category', formattedProduct.category)
          .eq('published', true)
          .neq('id', formattedProduct.id)
          .limit(3);

        if (similarError) {
          console.error('Error fetching similar products:', similarError);
        } else {
          const formattedSimilar = similarData ? similarData.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price || 0),
            image: p.image || 'https://via.placeholder.com/300',
            slug: p.slug,
            category: p.category,
            storeId: p.store_id,
          })) : [];

          setSimilarProducts(formattedSimilar);
        }
      } catch (error) {
        console.error('Error in product fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, storeId]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    const itemPrice = selectedVariant && selectedVariant.price !== null
      ? selectedVariant.price
      : product.price;
      
    addItem({
      productId: product.id,
      name: product.name + (selectedVariant ? ` - ${selectedVariant.name}` : ""),
      price: itemPrice,
      quantity: quantity,
      image: product.images[0],
      variant: selectedVariant || undefined,
      // Only add storeId if it exists
      ...(product.storeId && { storeId: product.storeId })
    });
  };
  
  if (loading) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-1/2">
                <div className="bg-accent h-96 rounded-lg"></div>
              </div>
              <div className="w-full lg:w-1/2">
                <div className="h-10 bg-accent rounded w-2/3 mb-4"></div>
                <div className="h-6 bg-accent rounded w-1/4 mb-6"></div>
                <div className="h-24 bg-accent rounded w-full mb-6"></div>
                <div className="h-10 bg-accent rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </ShopLayout>
    );
  }
  
  if (!product) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => {
            storeId ? navigate(`/store/${storeId}/shop`) : navigate('/shop');
          }}>
            Continue Shopping
          </Button>
        </div>
      </ShopLayout>
    );
  }
  
  return (
    <ShopLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Images */}
          <div className="w-full lg:w-1/2">
            <div className="bg-accent rounded-lg overflow-hidden mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`bg-accent rounded-md overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl mb-4">{product.price.toLocaleString("sr-RS")} RSD</p>
            
            <p className="text-muted-foreground mb-6">{product.description}</p>
            
            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Variants</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      className={`px-4 py-2 rounded-md border ${
                        selectedVariant?.id === variant.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background hover:bg-accent"
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      {variant.name}
                      {variant.price !== null && variant.price !== product.price
                        ? ` (+${(variant.price - product.price).toLocaleString("sr-RS")} RSD)`
                        : ""}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Quantity</h3>
              <div className="flex items-center">
                <button
                  className="w-10 h-10 rounded-l-md border border-input bg-background flex items-center justify-center hover:bg-accent"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <div className="w-14 h-10 border-t border-b border-input flex items-center justify-center">
                  {quantity}
                </div>
                <button
                  className="w-10 h-10 rounded-r-md border border-input bg-background flex items-center justify-center hover:bg-accent"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="w-full mb-6"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            
            {/* Features */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Key Features</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="details">
            <TabsList className="w-full justify-start border-b rounded-none">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="py-4">
              <p className="text-muted-foreground">{product.description}</p>
            </TabsContent>
            <TabsContent value="specifications" className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex">
                    <span className="font-medium w-32">{key}:</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="py-4">
              <p className="text-muted-foreground">No reviews yet.</p>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </ShopLayout>
  );
};

export default ProductDetail;
