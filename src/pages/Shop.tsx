import { useState, useEffect } from "react";
import { ProductCard, Product } from "@/components/shop/ProductCard";
import { ShopLayout } from "@/components/layout/ShopLayout";
import { useSearchParams, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/contexts/AuthContext";
import { useStoreData } from "@/hooks/useStoreData";
import { getDefaultProducts } from "@/components/store/DefaultProducts";

const Shop = () => {
  const { storeId } = useParams();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const { store, loading, storeProducts, error } = useStoreData({ 
    storeId, 
    currentUserId: user?.id 
  });
  
  const categoryParam = searchParams.get("category");
  
  // Use stored products if available, otherwise use defaults
  const allProducts = storeProducts.length > 0 ? storeProducts : getDefaultProducts(storeId);
  
  useEffect(() => {
    let products = [...allProducts];
    
    // Filter by category if provided
    if (categoryParam) {
      products = products.filter(
        (product) => product.category === categoryParam
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      products = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by price range
    products = products.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    setFilteredProducts(products);
  }, [categoryParam, searchTerm, priceRange, allProducts]);
  
  // Extract unique categories from products
  const categories = [
    { id: "all", name: "All Categories" },
    ...Array.from(
      new Set(allProducts.map((product) => product.category))
    ).map((category) => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1)
    }))
  ];
  
  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", categoryId);
    }
    setSearchParams(searchParams);
  };
  
  // Loading state
  if (loading) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-8">
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
  
  // Error state
  if (!store) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Prodavnica nije dostupna</h1>
              <p className="text-muted-foreground mb-6">
                {error || "Prodavnica koju tražite ne postoji ili više nije dostupna."}
              </p>
              <Button asChild>
                <a href="/">Povratak na početnu</a>
              </Button>
            </div>
          </div>
        </div>
      </ShopLayout>
    );
  }
  
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
            {filteredProducts.length === 0 ? (
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
                {filteredProducts.map((product) => (
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
