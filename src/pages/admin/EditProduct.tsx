
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    seoTitle: "",
    seoDescription: "",
    slug: "",
    published: true,
  });
  
  const [variants, setVariants] = useState<
    { id: number; name: string; price: string }[]
  >([]);
  
  const [images, setImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState("");
  
  useEffect(() => {
    const loadProduct = async () => {
      if (!id || !user?.store?.id) {
        toast({
          title: "Greška",
          description: "Nedostaju podaci za učitavanje proizvoda",
          variant: "destructive",
        });
        navigate("/products");
        return;
      }

      try {
        setLoading(true);
        
        // Fetch product from Supabase
        const { data: product, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .eq("store_id", user.store.id)
          .single();
          
        if (error) {
          console.error("Error loading product from Supabase:", error);
          throw error;
        }
        
        if (!product) {
          throw new Error("Proizvod nije pronađen");
        }
        
        setProductData({
          name: product.name || "",
          price: product.price ? String(product.price) : "",
          description: product.description || "",
          category: product.category || "",
          stock: product.stock ? String(product.stock) : "",
          seoTitle: product.seo_title || "",
          seoDescription: product.seo_description || "",
          slug: product.slug || "",
          published: product.published || false,
        });
        
        // Set variants if they exist
        if (product.variants && Array.isArray(product.variants)) {
          setVariants(product.variants.map((variant: any, index: number) => ({
            id: index + 1,
            name: variant.name || "",
            price: variant.price ? String(variant.price) : ""
          })));
        }
        
        // Set images if they exist
        if (product.images && Array.isArray(product.images)) {
          setImages(product.images);
        } else if (product.image) {
          setImages([product.image]);
        }
        
      } catch (error) {
        console.error("Error loading product:", error);
        toast({
          title: "Greška",
          description: "Proizvod nije pronađen",
          variant: "destructive",
        });
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate, toast, user?.store?.id]);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
    
    // Auto-generisanje slug-a iz imena
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setProductData((prev) => ({ ...prev, slug }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setProductData({ ...productData, [name]: value });
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setProductData({ ...productData, [name]: checked });
  };
  
  const addVariant = () => {
    const newId = variants.length > 0 ? Math.max(...variants.map((v) => v.id)) + 1 : 1;
    setVariants([...variants, { id: newId, name: "", price: "" }]);
  };
  
  const removeVariant = (id: number) => {
    setVariants(variants.filter((v) => v.id !== id));
  };
  
  const updateVariant = (id: number, field: string, value: string) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };
  
  const addImage = () => {
    if (newImage && !images.includes(newImage)) {
      setImages([...images, newImage]);
      setNewImage("");
    }
  };
  
  const removeImage = (image: string) => {
    setImages(images.filter((img) => img !== image));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !user?.store?.id) {
      toast({
        title: "Greška",
        description: "Nedostaju podaci za ažuriranje proizvoda",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the data for update
      const productUpdateData = {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        category: productData.category,
        stock: parseInt(productData.stock || "0"),
        seo_title: productData.seoTitle,
        seo_description: productData.seoDescription,
        slug: productData.slug,
        published: productData.published,
        images: images,
        image: images.length > 0 ? images[0] : null,
        variants: variants,
        store_id: user.store.id,
      };
      
      // Update product in Supabase
      const { error } = await supabase
        .from("products")
        .update(productUpdateData)
        .eq("id", id)
        .eq("store_id", user.store.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Uspešno",
        description: "Proizvod je ažuriran",
      });
      
      navigate("/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom ažuriranja proizvoda",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const categories = [
    { id: "furniture", name: "Nameštaj" },
    { id: "kitchen", name: "Kuhinja" },
    { id: "lighting", name: "Osvetljenje" },
    { id: "web-design", name: "Web Dizajn" },
    { id: "e-commerce", name: "E-Commerce" },
  ];
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <p>Učitavanje proizvoda...</p>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Izmena proizvoda</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card rounded-lg shadow-custom p-6">
            <h2 className="text-lg font-bold mb-6">Informacije o proizvodu</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Naziv proizvoda</Label>
                  <Input
                    id="name"
                    name="name"
                    value={productData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Cena (RSD)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={productData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Kategorija</Label>
                  <Select
                    value={productData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Izaberite kategoriju" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock">Stanje</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={productData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Opis</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={6}
                    value={productData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={productData.published}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("published", checked)
                    }
                  />
                  <Label htmlFor="published">Objavi proizvod</Label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-custom p-6">
            <h2 className="text-lg font-bold mb-6">Varijante proizvoda</h2>
            
            {variants.length === 0 ? (
              <p className="text-muted-foreground mb-4">
                Još uvek niste dodali varijante. Dodajte varijante ako vaš proizvod ima različite opcije kao što su boja ili veličina.
              </p>
            ) : (
              <div className="space-y-4 mb-6">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center space-x-4 border border-border p-4 rounded-md"
                  >
                    <div className="flex-1">
                      <Label htmlFor={`variant-name-${variant.id}`} className="mb-1 block">
                        Naziv varijante
                      </Label>
                      <Input
                        id={`variant-name-${variant.id}`}
                        value={variant.name}
                        onChange={(e) =>
                          updateVariant(variant.id, "name", e.target.value)
                        }
                        placeholder="npr. Boja, Veličina"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`variant-price-${variant.id}`} className="mb-1 block">
                        Cena (RSD)
                      </Label>
                      <Input
                        id={`variant-price-${variant.id}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={variant.price}
                        onChange={(e) =>
                          updateVariant(variant.id, "price", e.target.value)
                        }
                        placeholder="Ostavite prazno za osnovnu cenu"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-6"
                      onClick={() => removeVariant(variant.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <Button type="button" onClick={addVariant} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Dodaj varijantu
            </Button>
          </div>
          
          <div className="bg-card rounded-lg shadow-custom p-6">
            <h2 className="text-lg font-bold mb-6">Slike proizvoda</h2>
            
            <div className="space-y-6">
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                  {images.map((image) => (
                    <div key={image} className="relative group">
                      <div className="aspect-square bg-accent rounded-md overflow-hidden">
                        <img
                          src={image}
                          alt="Proizvod"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-background text-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(image)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex space-x-2">
                <Input
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Unesite URL slike"
                />
                <Button type="button" onClick={addImage} variant="outline">
                  Dodaj
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                U produkcijskom okruženju, ovde biste imali funkciju za direktno učitavanje slika.
                Za ovu demo verziju, unesite URL-ove slika direktno.
              </p>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-custom p-6">
            <h2 className="text-lg font-bold mb-6">SEO podešavanja</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">URL slug proizvoda</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={productData.slug}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Ovo će biti korišćeno u URL-u proizvoda: yourdomain.com/proizvod/{productData.slug}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO naslov</Label>
                <Input
                  id="seoTitle"
                  name="seoTitle"
                  value={productData.seoTitle}
                  onChange={handleInputChange}
                  placeholder="Ostavite prazno da koristite ime proizvoda"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO opis</Label>
                <Textarea
                  id="seoDescription"
                  name="seoDescription"
                  rows={3}
                  value={productData.seoDescription}
                  onChange={handleInputChange}
                  placeholder="Kratak opis za pretraživače"
                />
                <p className="text-xs text-muted-foreground">
                  Ovaj opis će biti korišćen u rezultatima pretraživača i kada se deli na društvenim mrežama.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/products")}
            >
              Otkaži
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Čuvanje..." : "Sačuvaj izmene"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditProduct;
