
import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";

const NewProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
    
    // Auto-generate slug from name
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Here you would normally send the data to your API
    // This is just a mockup to simulate submission
    setTimeout(() => {
      console.log("Product Data:", {
        ...productData,
        variants,
        images,
      });
      setIsSubmitting(false);
      navigate("/products");
    }, 1000);
  };
  
  const categories = [
    { id: "furniture", name: "Furniture" },
    { id: "kitchen", name: "Kitchen" },
    { id: "lighting", name: "Lighting" },
  ];
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Add New Product</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card rounded-lg shadow-custom p-6">
            <h2 className="text-lg font-bold mb-6">Product Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={productData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
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
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={productData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
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
                  <Label htmlFor="stock">Stock</Label>
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
                  <Label htmlFor="description">Description</Label>
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
                  <Label htmlFor="published">Publish product</Label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-custom p-6">
            <h2 className="text-lg font-bold mb-6">Product Variants</h2>
            
            {variants.length === 0 ? (
              <p className="text-muted-foreground mb-4">
                No variants added yet. Add variants if your product comes in different options like color or size.
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
                        Variant Name
                      </Label>
                      <Input
                        id={`variant-name-${variant.id}`}
                        value={variant.name}
                        onChange={(e) =>
                          updateVariant(variant.id, "name", e.target.value)
                        }
                        placeholder="e.g., Color, Size"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`variant-price-${variant.id}`} className="mb-1 block">
                        Price ($)
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
                        placeholder="Leave empty to use base price"
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
              <Plus className="h-4 w-4 mr-2" /> Add Variant
            </Button>
          </div>
          
          <div className="bg-card rounded-lg shadow-custom p-6">
            <h2 className="text-lg font-bold mb-6">Product Images</h2>
            
            <div className="space-y-6">
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                  {images.map((image) => (
                    <div key={image} className="relative group">
                      <div className="aspect-square bg-accent rounded-md overflow-hidden">
                        <img
                          src={image}
                          alt="Product"
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
                  placeholder="Enter image URL"
                />
                <Button type="button" onClick={addImage} variant="outline">
                  Add
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                In a production environment, you would have a file upload feature here.
                For this demo, please enter image URLs directly.
              </p>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-custom p-6">
            <h2 className="text-lg font-bold mb-6">SEO Settings</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Product URL Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={productData.slug}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This will be used in the product URL: yourdomain.com/product/{productData.slug}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  name="seoTitle"
                  value={productData.seoTitle}
                  onChange={handleInputChange}
                  placeholder="Leave empty to use the product name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  name="seoDescription"
                  rows={3}
                  value={productData.seoDescription}
                  onChange={handleInputChange}
                  placeholder="Brief description for search engines"
                />
                <p className="text-xs text-muted-foreground">
                  This description will be used in search engine results and when sharing on social media.
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
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NewProduct;
