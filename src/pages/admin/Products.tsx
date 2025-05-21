
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

// Sample products data with additional fields
const defaultProducts: (Product & {
  stock: number;
  category: string;
  published: boolean;
})[] = [
  {
    id: "1",
    name: "Minimalist Coffee Table",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "minimalist-coffee-table",
    stock: 15,
    category: "furniture",
    published: true,
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "ergonomic-office-chair",
    stock: 8,
    category: "furniture",
    published: true,
  },
  {
    id: "3",
    name: "Ceramic Mug Set",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "ceramic-mug-set",
    stock: 24,
    category: "kitchen",
    published: true,
  },
  {
    id: "4",
    name: "Modern Floor Lamp",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1543198126-1c7d9e6d4f3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "modern-floor-lamp",
    stock: 10,
    category: "lighting",
    published: true,
  },
  {
    id: "5",
    name: "Wooden Dining Chair",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "wooden-dining-chair",
    stock: 12,
    category: "furniture",
    published: true,
  },
  {
    id: "6",
    name: "Pendant Light",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "pendant-light",
    stock: 7,
    category: "lighting",
    published: false,
  },
  {
    id: "7",
    name: "Kitchen Knife Set",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1593618998160-854542cfa185?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "kitchen-knife-set",
    stock: 18,
    category: "kitchen",
    published: true,
  },
  {
    id: "8",
    name: "Bookshelf",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1588063577637-3c8ca15f9ac0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "bookshelf",
    stock: 5,
    category: "furniture",
    published: false,
  }
];

// Function to load stored products from localStorage
const getStoredProducts = () => {
  try {
    const storedProducts = localStorage.getItem("products");
    return storedProducts ? JSON.parse(storedProducts) : [];
  } catch (error) {
    console.error("Error loading stored products:", error);
    return [];
  }
};

const Products = () => {
  const [products, setProducts] = useState(defaultProducts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Load products on mount and when coming back to this page
  useEffect(() => {
    const loadProducts = () => {
      const storedProducts = getStoredProducts();
      console.log("Stored products:", storedProducts);
      
      // Filter products to only show those belonging to the current user
      const userProducts = storedProducts.filter((p: any) => !p.userId || p.userId === user?.id);
      
      // Merge default products with stored products
      // If a product with the same ID exists in both, use the stored version
      const storedIds = userProducts.map((p: any) => p.id);
      const filteredDefaultProducts = defaultProducts.filter(p => !storedIds.includes(p.id));
      
      console.log("Combined products:", [...filteredDefaultProducts, ...userProducts]);
      setProducts([...filteredDefaultProducts, ...userProducts]);
    };
    
    loadProducts();
    
    // Show toast if there's a success message in location state
    if (location.state?.success) {
      toast({
        title: "Proizvod sačuvan",
        description: location.state.message || "Proizvod je uspešno sačuvan",
      });
      
      // Remove the success message after using it to prevent showing it again on page refresh
      window.history.replaceState({}, document.title);
    }
  }, [location, toast, user?.id]);
  
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
  
  const handleDelete = (id: string) => {
    // Remove from state
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    
    // Update localStorage
    const storedProducts = getStoredProducts();
    const updatedStoredProducts = storedProducts.filter(p => p.id !== id);
    localStorage.setItem("products", JSON.stringify(updatedStoredProducts));
    
    toast({
      title: "Proizvod obrisan",
      description: "Proizvod je uspešno obrisan",
    });
  };
  
  const handleTogglePublish = (id: string) => {
    // Update in state
    const updatedProducts = products.map((p) =>
      p.id === id ? { ...p, published: !p.published } : p
    );
    setProducts(updatedProducts);
    
    // Update in localStorage
    const storedProducts = getStoredProducts();
    const updatedStoredProducts = storedProducts.map(p => 
      p.id === id ? { ...p, published: !p.published } : p
    );
    localStorage.setItem("products", JSON.stringify(updatedStoredProducts));
    
    const product = products.find(p => p.id === id);
    const newStatus = product?.published ? "skrivena" : "objavljena";
    
    toast({
      title: `Proizvod ${newStatus}`,
      description: `Proizvod je uspešno ${newStatus}`,
    });
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
                      No products found
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
                      <td className="p-4">{product.price.toLocaleString('sr-RS')} RSD</td>
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
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Products;
