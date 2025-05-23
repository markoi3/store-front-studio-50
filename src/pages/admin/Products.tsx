
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Package, Plus, Search, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Initial products data for fallback
const initialProducts = [
  {
    id: "1",
    name: "Početni veb sajt - paket",
    description: "Osnovni sajt sa do 5 stranica, SEO optimizacija, osnovni dizajn",
    price: "35000",
    image: "https://via.placeholder.com/150",
    slug: "pocetni-sajt-paket",
    category: "web-design",
    stock: 999,
    published: true
  },
  {
    id: "2",
    name: "Napredni veb sajt - paket",
    description: "Sajt sa do 15 stranica, napredni SEO, prilagođeni dizajn, blog sekcija",
    price: "75000",
    image: "https://via.placeholder.com/150",
    slug: "napredni-sajt-paket",
    category: "web-design",
    stock: 999,
    published: true
  },
  {
    id: "3",
    name: "Online prodavnica - osnovni paket",
    description: "E-commerce rešenje sa do 50 proizvoda, osnovni dizajn, integracija plaćanja",
    price: "120000",
    image: "https://via.placeholder.com/150",
    slug: "online-prodavnica-osnovni",
    category: "e-commerce",
    stock: 999,
    published: true
  }
];

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // First try loading from Supabase if we have a store ID
        if (user?.store?.id) {
          const { data: supabaseProducts, error } = await supabase
            .from("products")
            .select("*")
            .eq("store_id", user.store.id);
            
          if (error) {
            console.error("Error loading products from Supabase:", error);
            throw error;
          }
          
          if (supabaseProducts && supabaseProducts.length > 0) {
            console.log("Products loaded from Supabase:", supabaseProducts);
            setProducts(supabaseProducts);
            // Also update localStorage for offline access
            localStorage.setItem("products", JSON.stringify(supabaseProducts));
            setLoading(false);
            return;
          }
        }
        
        // Fallback to localStorage if Supabase fetch failed or returned no products
        const storedProducts = localStorage.getItem("products");
        if (storedProducts) {
          const parsedProducts = JSON.parse(storedProducts);
          setProducts(parsedProducts);
        } else {
          // If no products in localStorage, use initialProducts
          const transformedProducts = user?.store?.id
            ? initialProducts.map(product => ({
                ...product,
                store_id: String(user.store?.id || "") // Use store_id to match Supabase column
              }))
            : initialProducts;
          setProducts(transformedProducts);
          
          // Save to localStorage
          localStorage.setItem("products", JSON.stringify(transformedProducts));
          
          // If store_id is available, also save to Supabase
          if (user?.store?.id) {
            // We add the products one by one to Supabase
            for (const product of transformedProducts) {
              const { error } = await supabase
                .from("products")
                .insert({
                  ...product,
                  store_id: user.store.id
                });
                
              if (error) {
                console.error("Error saving product to Supabase:", error);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [user?.store?.id]);

  // Function to delete a product
  const handleDeleteProduct = async (productId: string) => {
    // Confirm before deleting
    if (window.confirm("Da li ste sigurni da želite da obrišete ovaj proizvod?")) {
      try {
        // Delete from Supabase first if store_id is available
        if (user?.store?.id) {
          const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", productId);
            
          if (error) {
            console.error("Error deleting product from Supabase:", error);
            throw error;
          }
        }
        
        // Filter out the product to delete from local state
        const updatedProducts = products.filter(product => product.id !== productId);
        
        // Update state
        setProducts(updatedProducts);
        
        // Update localStorage
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        
        // Show success toast
        toast({
          title: "Proizvod obrisan",
          description: "Proizvod je uspešno obrisan iz Supabase i lokalne memorije.",
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        toast({
          title: "Greška",
          description: "Došlo je do greške prilikom brisanja proizvoda.",
          variant: "destructive",
        });
      }
    }
  };

  // Function to filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (product.id && product.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate total products value
  const totalValue = filteredProducts.reduce((sum, product) => {
    const price = typeof product.price === 'string' 
      ? parseFloat(product.price) 
      : (product.price || 0);
    return sum + price * (product.stock || 1);
  }, 0);
  
  // Calculate total product quantity
  const totalQuantity = filteredProducts.reduce((sum, product) => {
    return sum + (parseInt(product.stock) || 0);
  }, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Proizvodi</h1>
          </div>
          <Link to="/proizvod/novi">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novi proizvod
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between sm:space-y-0 pb-4">
            <div>
              <CardTitle>Svi proizvodi</CardTitle>
              <CardDescription>
                Ukupno {filteredProducts.length} proizvoda
              </CardDescription>
            </div>
            <div className="w-full sm:w-72 mt-2 sm:mt-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Pretraga..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">Učitavanje proizvoda...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-8 text-center">Nema pronađenih proizvoda</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Proizvod</TableHead>
                      <TableHead>Cena</TableHead>
                      <TableHead>Stanje</TableHead>
                      <TableHead className="text-right">Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-10 w-10 object-cover rounded"
                                />
                              ) : (
                                <Package className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              {product.category && (
                                <div className="text-sm text-gray-500">
                                  {product.category}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {Number(product.price).toLocaleString()} RSD
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.stock > 0 ? (
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                              <span>Dostupno ({product.stock})</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                              <span>Nedostupno</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Otvori meni</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link 
                                  to={`/store/${user?.store?.slug || user?.store?.id}/product/${product.slug || product.id}`}
                                  className="flex items-center"
                                  target="_blank"
                                >
                                  <Package className="h-4 w-4 mr-2" />
                                  Prikaži proizvod
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/products/${product.id}`} className="flex items-center">
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Modifikuj proizvod
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center text-destructive focus:text-destructive"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Obriši
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistika proizvoda</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Ukupno proizvoda</div>
              <div className="text-2xl font-bold">{products.length}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Ukupna vrednost</div>
              <div className="text-2xl font-bold">
                {totalValue.toLocaleString()} RSD
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Prosečna cena</div>
              <div className="text-2xl font-bold">
                {products.length > 0
                  ? (
                      products.reduce(
                        (sum, product) =>
                          sum +
                          (typeof product.price === "string"
                            ? parseFloat(product.price)
                            : product.price || 0),
                        0
                      ) / products.length
                    ).toLocaleString()
                  : 0}{" "}
                RSD
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Objavljeno</div>
              <div className="text-2xl font-bold">
                {products.filter((p) => p.published).length}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Ukupna količina</div>
              <div className="text-2xl font-bold">
                {totalQuantity.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Products;
