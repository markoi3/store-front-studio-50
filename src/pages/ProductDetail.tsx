
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopLayout } from "@/components/layout/ShopLayout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ProductCard, Product } from "@/components/shop/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample products data
const allProducts: Product[] = [
  {
    id: "1",
    name: "Minimalist Coffee Table",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "minimalist-coffee-table",
    category: "furniture"
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "ergonomic-office-chair",
    category: "furniture"
  },
  {
    id: "3",
    name: "Ceramic Mug Set",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "ceramic-mug-set",
    category: "kitchen"
  },
  {
    id: "4",
    name: "Modern Floor Lamp",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1543198126-1c7d9e6d4f3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "modern-floor-lamp",
    category: "lighting"
  }
];

type ProductVariant = {
  id: string;
  name: string;
  price: number | null; // null means same as base price
};

// Sample product details
const productDetails: Record<string, {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  features: string[];
  category: string;
  variants: ProductVariant[];
  specifications: Record<string, string>;
}> = {
  "minimalist-coffee-table": {
    id: "1",
    name: "Minimalist Coffee Table",
    price: 199.99,
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      "https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      "https://images.unsplash.com/photo-1616464916356-3a777b414b3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
    ],
    description: "Elevate your living space with our Minimalist Coffee Table. Crafted from solid oak with a smooth, matte finish, this table combines modern design with everyday functionality. Its clean lines and timeless silhouette make it a versatile piece that complements any interior style.",
    features: [
      "Solid oak construction",
      "Matte finish",
      "Spacious tabletop",
      "Sleek, minimalist design",
      "Sturdy and durable build"
    ],
    category: "furniture",
    variants: [
      { id: "oak", name: "Oak", price: null },
      { id: "walnut", name: "Walnut", price: 229.99 },
      { id: "maple", name: "Maple", price: 219.99 }
    ],
    specifications: {
      "Dimensions": "120 x 60 x 45 cm",
      "Weight": "25 kg",
      "Material": "Solid Oak",
      "Assembly": "Required, tools included",
      "Warranty": "2 years"
    }
  },
  "ergonomic-office-chair": {
    id: "2",
    name: "Ergonomic Office Chair",
    price: 249.99,
    images: [
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      "https://images.unsplash.com/photo-1589364222905-9036200eb8dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
    ],
    description: "Experience ultimate comfort with our Ergonomic Office Chair. Designed with your wellbeing in mind, this chair offers exceptional lumbar support, adjustable features, and breathable mesh material to keep you comfortable throughout your workday.",
    features: [
      "Adjustable height and armrests",
      "Breathable mesh back",
      "Lumbar support",
      "360° swivel",
      "Durable nylon base with smooth-rolling casters"
    ],
    category: "furniture",
    variants: [
      { id: "black", name: "Black", price: null },
      { id: "gray", name: "Gray", price: null },
      { id: "blue", name: "Blue", price: 259.99 }
    ],
    specifications: {
      "Dimensions": "65 x 65 x 115-125 cm",
      "Weight": "15 kg",
      "Material": "Mesh, Nylon, Aluminum",
      "Weight Capacity": "150 kg",
      "Warranty": "3 years"
    }
  },
  "ceramic-mug-set": {
    id: "3",
    name: "Ceramic Mug Set",
    price: 39.99,
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      "https://images.unsplash.com/photo-1577937927133-66b464c1c9e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
    ],
    description: "Add a touch of elegance to your morning routine with our Ceramic Mug Set. Each mug is handcrafted from high-quality ceramic and finished with a sleek, matte glaze. Perfect for coffee, tea, or hot chocolate, these mugs are designed to keep your beverages hot longer.",
    features: [
      "Set of 4 mugs",
      "Handcrafted ceramic",
      "Matte finish",
      "Microwave and dishwasher safe",
      "Capacity: 350ml each"
    ],
    category: "kitchen",
    variants: [
      { id: "white", name: "White", price: null },
      { id: "black", name: "Black", price: null },
      { id: "mixed", name: "Mixed Colors", price: 44.99 }
    ],
    specifications: {
      "Dimensions": "8 x 8 x 10 cm each",
      "Weight": "300g each",
      "Material": "Ceramic",
      "Capacity": "350ml",
      "Care": "Dishwasher and microwave safe"
    }
  },
  "modern-floor-lamp": {
    id: "4",
    name: "Modern Floor Lamp",
    price: 129.99,
    images: [
      "https://images.unsplash.com/photo-1543198126-1c7d9e6d4f3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
    ],
    description: "Illuminate your space with our Modern Floor Lamp. Featuring a sleek metal frame and an adjustable shade, this lamp adds both style and functionality to any room. The dimmable LED bulb allows you to create the perfect ambiance for any occasion.",
    features: [
      "Sleek metal frame",
      "Adjustable shade",
      "Dimmable LED bulb included",
      "Foot-operated switch",
      "Energy efficient"
    ],
    category: "lighting",
    variants: [
      { id: "brass", name: "Brass", price: null },
      { id: "black", name: "Matte Black", price: null },
      { id: "chrome", name: "Chrome", price: 139.99 }
    ],
    specifications: {
      "Dimensions": "30 x 30 x 150 cm",
      "Weight": "5 kg",
      "Material": "Metal, Fabric",
      "Bulb Type": "LED (included)",
      "Warranty": "1 year"
    }
  }
};

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Find product details
  const product = productDetails[slug || ""];
  
  if (!product) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </ShopLayout>
    );
  }
  
  const handleAddToCart = () => {
    const itemPrice = selectedVariant && selectedVariant.price !== null
      ? selectedVariant.price
      : product.price;
      
    addItem({
      productId: product.id,
      name: product.name + (selectedVariant ? ` - ${selectedVariant.name}` : ""),
      price: itemPrice,
      quantity: quantity,
      image: product.images[0],
      variant: selectedVariant || undefined
    });
  };
  
  // Get similar products (products in the same category)
  const similarProducts = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);
  
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
            <p className="text-2xl mb-4">${selectedVariant && selectedVariant.price !== null ? selectedVariant.price.toFixed(2) : product.price.toFixed(2)}</p>
            
            <p className="text-muted-foreground mb-6">{product.description}</p>
            
            {/* Variants */}
            {product.variants.length > 0 && (
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
                        ? ` (+$${(variant.price - product.price).toFixed(2)})`
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
