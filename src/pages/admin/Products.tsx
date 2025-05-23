import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";
import { Product } from "@/components/shop/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Products = () => {
  const [products, setProducts] = useState<(Product & {
    stock: number;
    category: string;
    published: boolean;
  })[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Load products on mount and when coming back to this page
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        if (!user?.store?.id) {
          console.log("No store ID found in user context");
          setLoading(false);
          return;
        }
        
        console.log("Loading products for store ID:", user.store.id);
        
        // Fetch products from Supabase
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', user.store.id);
        
        if (error) {
          console.error("Error fetching products:", error);
          toast({
            title: "Error",
            description: "Failed to load products. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        console.log("Products loaded:", data);
        
        if (data) {
          // Transform products to match our expected format
          const formattedProducts = data.map(product => ({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price || 0),
            image: product.image || "https://via.placeholder.com/300",
            slug: product.slug,
            storeId: String(user.store?.id || ""),  // Ensure storeId is a string
            category: product.category || "general",
            stock: product.stock || 0,
            published: product.published || false
          }));
          
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Error in loadProducts:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading products.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
    
    // Show toast if there's a success message in location state
    if (location.state?.success) {
      toast({
        title: "Proizvod sačuvan",
        description: location.state.message || "Proizvod je uspešno sačuvan",
      });
      
      // Remove the success message after using it to prevent showing it again on page refresh
      history.replaceState({}, document.title);
    }
  }, [location, toast, user?.store?.id]);
  
  // Filter and search products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "published" && product.published) ||
      (filter === "draft" && !product.published) ||
      filter === product.category;
    
    return matchesSearch && matchesFilter;
  });
  
  const handleDelete = async (id: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Error deleting product:", error);
        toast({
          title: "Error",
          description: "Failed to delete product: " + error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Remove from state
      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts);
      
      toast({
        title: "Proizvod obrisan",
        description: "Proizvod je uspešno obrisan",
      });
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the product.",
        variant: "destructive",
      });
    }
  };
  
  const handleTogglePublish = async (id: string) => {
    try {
      // Find the product to update
      const product = products.find(p => p.id === id);
      if (!product) return;
      
      // Update in Supabase
      const { error } = await supabase
        .from('products')
        .update({ published: !product.published })
        .eq('id', id);
        
      if (error) {
        console.error("Error updating product:", error);
        toast({
          title: "Error",
          description: "Failed to update product status: " + error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Update in state
      const updatedProducts = products.map((p) =>
        p.id === id ? { ...p, published: !p.published } : p
      );
      setProducts(updatedProducts);
      
      const newStatus = product.published ? "skrivena" : "objavljena";
      
      toast({
        title: `Proizvod ${newStatus}`,
        description: `Proizvod je uspešno ${newStatus}`,
      });
    } catch (error) {
      console.error("Error in handleTogglePublish:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating the product.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Products</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {filter === "all"
                      ? "All Products"
                      : filter === "published"
                      ? "Published"
                      : filter === "draft"
                      ? "Drafts"
                      : `Category: ${filter}`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilter("all")}>
                    All Products
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("published")}>
                    Published
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("draft")}>
                    Drafts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("furniture")}>
                    Furniture
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("kitchen")}>
                    Kitchen
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("lighting")}>
                    Lighting
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to="/products/new">
                <Button>Add Product</Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-custom overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading products...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                      Product
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                      Stock
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                      Category
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                      Price
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                      Status
                    </th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground">
                        {products.length === 0 
                          ? "No products found. Add some products to get started." 
                          : "No products match your search criteria."}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-border">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-accent">
                              <img
                                src={product.image || "https://via.placeholder.com/100"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">
                                ID: {product.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              product.stock > 10
                                ? "bg-green-100 text-green-800"
                                : product.stock > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="capitalize">{product.category}</span>
                        </td>
                        <td className="p-4">{product.price.toLocaleString("sr-RS")} RSD</td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              product.published
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {product.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Link to={`/products/${product.id}`} className="w-full">
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link 
                                  to={product.storeId 
                                    ? `/store/${product.storeId}/product/${product.slug}` 
                                    : `/product/${product.slug}`}
                                  className="w-full"
                                  target="_blank"
                                >
                                  View Product
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleTogglePublish(product.id)}
                              >
                                {product.published ? "Unpublish" : "Publish"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(product.id)}
                                className="text-destructive"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Products;
