import { useState, useEffect } from "react";
import { ProductCard, Product } from "@/components/shop/ProductCard";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

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
  },
  {
    id: "5",
    name: "Wooden Dining Chair",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "wooden-dining-chair",
    category: "furniture"
  },
  {
    id: "6",
    name: "Pendant Light",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "pendant-light",
    category: "lighting"
  },
  {
    id: "7",
    name: "Kitchen Knife Set",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1593618998160-854542cfa185?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "kitchen-knife-set",
    category: "kitchen"
  },
  {
    id: "8",
    name: "Bookshelf",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1588063577637-3c8ca15f9ac0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "bookshelf",
    category: "furniture"
  }
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const categoryParam = searchParams.get("category");
  
  useEffect(() => {
    let filteredProducts = [...allProducts];
    
    // Filter by category if provided
    if (categoryParam) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === categoryParam
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by price range
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    setProducts(filteredProducts);
  }, [categoryParam, searchTerm, priceRange]);
  
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "furniture", name: "Furniture" },
    { id: "kitchen", name: "Kitchen" },
    { id: "lighting", name: "Lighting" }
  ];
  
  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", categoryId);
    }
    setSearchParams(searchParams);
  };
  
  return (
    <ShopLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {categoryParam
              ? categories.find((c) => c.id === categoryParam)?.name
              : "All Products"}
          </h1>
          
          <Button
            variant="outline"
            className="md:hidden"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            Filters
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <aside className="w-full md:w-64 hidden md:block">
            <div className="bg-card p-4 rounded-lg shadow-custom">
              <h2 className="font-medium mb-4">Categories</h2>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      className={`text-sm ${
                        (category.id === "all" && !categoryParam) ||
                        category.id === categoryParam
                          ? "font-medium"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
              
              <h2 className="font-medium mt-6 mb-4">Price Range</h2>
              <div className="px-2">
                <Slider
                  defaultValue={[0, 300]}
                  max={300}
                  step={10}
                  onValueChange={(value) => setPriceRange(value)}
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              
              <h2 className="font-medium mt-6 mb-4">Search</h2>
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </aside>
          
          {/* Filters - Mobile */}
          {mobileFiltersOpen && (
            <div className="bg-card p-4 rounded-lg shadow-custom md:hidden">
              <h2 className="font-medium mb-4">Categories</h2>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      className={`text-sm ${
                        (category.id === "all" && !categoryParam) ||
                        category.id === categoryParam
                          ? "font-medium"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
              
              <h2 className="font-medium mt-6 mb-4">Price Range</h2>
              <div className="px-2">
                <Slider
                  defaultValue={[0, 300]}
                  max={300}
                  step={10}
                  onValueChange={(value) => setPriceRange(value)}
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              
              <h2 className="font-medium mt-6 mb-4">Search</h2>
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          
          {/* Products Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-16">
                <h2 className="text-xl font-medium mb-2">No products found</h2>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search term.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchParams({});
                    setSearchTerm("");
                    setPriceRange([0, 300]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};

export default Shop;
