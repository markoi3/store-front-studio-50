import { AdminLayout } from "@/components/layout/AdminLayout";
import { StoreBuilder } from "@/components/design/StoreBuilder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

const Design = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("builder");
  
  useEffect(() => {
    // Extract tab name from URL if present
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab && (tab === "builder" || tab === "menu" || tab === "logo" || tab === "custom")) {
      setActiveTab(tab);
    }
  }, [location]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/design?tab=${value}`);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dizajner prodavnice</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="builder">Elementi stranice</TabsTrigger>
            <TabsTrigger value="menu">Meni</TabsTrigger>
            <TabsTrigger value="logo">Logo</TabsTrigger>
            <TabsTrigger value="custom">Custom Pages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="builder" className="space-y-4">
            <StoreBuilder />
          </TabsContent>
          
          <TabsContent value="menu" className="space-y-4">
            <MenuEditor />
          </TabsContent>
          
          <TabsContent value="logo" className="space-y-4">
            <LogoEditor />
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <CustomPagesEditor />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

// Menu editor component
const MenuEditor = () => {
  const { user, updateStoreSettings } = useAuth();
  const [menuItems, setMenuItems] = useState<Array<{id: string; label: string; url: string}>>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  
  useEffect(() => {
    // Initialize with menu items from user store settings
    if (user?.store?.settings?.menuItems && Array.isArray(user.store.settings.menuItems)) {
      setMenuItems(user.store.settings.menuItems);
    } else {
      // Default menu items
      setMenuItems([
        { id: "1", label: "Početna", url: "/" },
        { id: "2", label: "Proizvodi", url: "/shop" },
        { id: "3", label: "O nama", url: "/about" },
        { id: "4", label: "Kontakt", url: "/contact" }
      ]);
    }
  }, [user]);
  
  const saveMenuItems = async (items: Array<{id: string; label: string; url: string}>) => {
    try {
      await updateStoreSettings({ 
        ...user?.store?.settings,
        menuItems: items 
      });
      
      toast.success("Menu saved successfully");
    } catch (error) {
      console.error("Error saving menu items:", error);
      toast.error("Failed to save menu items. Please try again.");
    }
  };
  
  const handleAddItem = () => {
    if (!newLabel || !newUrl) return;
    
    const newItem = {
      id: Date.now().toString(),
      label: newLabel,
      url: newUrl.startsWith("/") ? newUrl : "/" + newUrl
    };
    
    const updatedItems = [...menuItems, newItem];
    setMenuItems(updatedItems);
    saveMenuItems(updatedItems);
    
    setNewLabel("");
    setNewUrl("");
  };
  
  const handleRemoveItem = (id: string) => {
    const updatedItems = menuItems.filter(item => item.id !== id);
    setMenuItems(updatedItems);
    saveMenuItems(updatedItems);
  };
  
  const handleMoveItem = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === menuItems.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedItems = [...menuItems];
    [updatedItems[index], updatedItems[newIndex]] = [updatedItems[newIndex], updatedItems[index]];
    
    setMenuItems(updatedItems);
    saveMenuItems(updatedItems);
  };
  
  return (
    <div className="space-y-6 bg-card p-6 rounded-lg shadow-sm">
      <div>
        <h3 className="text-lg font-medium mb-4">Uredi meni</h3>
        <p className="text-muted-foreground mb-4">
          Ovde možete dodati, ukloniti ili promeniti redosled linkova koji se prikazuju u navigacionom meniju vaše prodavnice.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="font-medium text-sm">Naziv</div>
          <div className="font-medium text-sm">URL</div>
          <div className="font-medium text-sm text-right">Akcije</div>
        </div>
        
        {menuItems.map((item, index) => (
          <div key={item.id} className="grid grid-cols-3 gap-4 items-center p-3 border rounded-md bg-background">
            <div>{item.label}</div>
            <div className="text-muted-foreground">{item.url}</div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleMoveItem(index, "up")}
                disabled={index === 0}
                className="p-1 rounded hover:bg-accent disabled:opacity-50"
              >
                ↑
              </button>
              <button
                onClick={() => handleMoveItem(index, "down")}
                disabled={index === menuItems.length - 1}
                className="p-1 rounded hover:bg-accent disabled:opacity-50"
              >
                ↓
              </button>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="p-1 rounded hover:bg-red-100 text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Dodaj novi link</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="newLabel" className="block text-sm mb-1">Naziv</label>
            <input
              id="newLabel"
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="npr. O nama"
            />
          </div>
          <div>
            <label htmlFor="newUrl" className="block text-sm mb-1">URL</label>
            <input
              id="newUrl"
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="npr. /about"
            />
          </div>
        </div>
        <button
          onClick={handleAddItem}
          disabled={!newLabel || !newUrl}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
        >
          Dodaj link
        </button>
      </div>
    </div>
  );
};

// Logo editor component
const LogoEditor = () => {
  const { user, updateStoreSettings } = useAuth();
  const [logoUrl, setLogoUrl] = useState("");
  const [logoAlt, setLogoAlt] = useState("");
  
  useEffect(() => {
    // Load existing logo settings
    if (user?.store?.settings?.logo) {
      setLogoUrl(user.store.settings.logo.url || "");
      setLogoAlt(user.store.settings.logo.alt || "");
    }
  }, [user]);
  
  const handleSaveLogo = async () => {
    try {
      const updatedSettings = {
        ...user?.store?.settings,
        logo: {
          url: logoUrl,
          alt: logoAlt
        }
      };
      
      await updateStoreSettings(updatedSettings);
      toast.success("Logo settings saved successfully");
    } catch (error) {
      console.error("Error saving logo settings:", error);
      toast.error("Failed to save logo settings");
    }
  };
  
  return (
    <div className="space-y-6 bg-card p-6 rounded-lg shadow-sm">
      <div>
        <h3 className="text-lg font-medium mb-4">Store Logo</h3>
        <p className="text-muted-foreground mb-4">
          Set your store logo that will appear in the header of your store.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="logoUrl" className="block text-sm mb-1">Logo URL</label>
          <input
            id="logoUrl"
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://example.com/logo.png"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter the URL of your logo image. For best results, use a PNG or SVG with transparent background.
          </p>
        </div>
        
        {logoUrl && (
          <div className="border rounded-md p-4 flex justify-center">
            <img 
              src={logoUrl} 
              alt="Logo preview" 
              className="max-h-24 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x80?text=Invalid+Image+URL';
              }}
            />
          </div>
        )}
        
        <div>
          <label htmlFor="logoAlt" className="block text-sm mb-1">Alt Text</label>
          <input
            id="logoAlt"
            type="text"
            value={logoAlt}
            onChange={(e) => setLogoAlt(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Company Logo"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Alternative text for accessibility purposes
          </p>
        </div>
        
        <button
          onClick={handleSaveLogo}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Save Logo Settings
        </button>
      </div>
    </div>
  );
};

// Custom Pages editor component
const CustomPagesEditor = () => {
  const { user, updateStoreSettings } = useAuth();
  const [customPages, setCustomPages] = useState<Array<{
    id: string;
    title: string;
    slug: string;
    content: string;
  }>>([]);
  const [currentPage, setCurrentPage] = useState<{
    id: string;
    title: string;
    slug: string;
    content: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    // Initialize with custom pages from user store settings
    if (user?.store?.settings?.customPages && Array.isArray(user.store.settings.customPages)) {
      console.log("Loading custom pages:", user.store.settings.customPages.length);
      setCustomPages(user.store.settings.customPages);
    }
  }, [user]);
  
  const handleSavePages = async () => {
    try {
      if (!user?.store?.settings) {
        toast.error("Store settings not found");
        return;
      }
      
      await updateStoreSettings({
        ...user.store.settings,
        customPages: customPages
      });
      
      toast.success("Custom pages saved successfully");
    } catch (error) {
      console.error("Error saving custom pages:", error);
      toast.error("Failed to save custom pages");
    }
  };
  
  const handleAddPage = () => {
    const newId = `page-${Date.now()}`;
    setIsEditing(true);
    setCurrentPage({
      id: newId,
      title: "New Page",
      slug: `page-${customPages.length + 1}`,
      content: "Content goes here..."
    });
  };
  
  const handleEditPage = (page: typeof currentPage) => {
    if (!page) return;
    console.log("Editing page:", page);
    setIsEditing(true);
    setCurrentPage(page);
  };
  
  const handleDeletePage = async (id: string) => {
    const updatedPages = customPages.filter(page => page.id !== id);
    setCustomPages(updatedPages);
    
    // Also save to database immediately
    if (user?.store?.settings) {
      try {
        await updateStoreSettings({
          ...user.store.settings,
          customPages: updatedPages
        });
        toast.success("Page deleted successfully");
      } catch (error) {
        console.error("Error deleting page:", error);
        toast.error("Failed to delete page");
      }
    }
    
    if (currentPage?.id === id) {
      setCurrentPage(null);
      setIsEditing(false);
    }
  };
  
  const handleSavePage = async () => {
    if (!currentPage) return;
    
    // Ensure slug is URL-friendly
    const sanitizedSlug = generateSlug(currentPage.slug || currentPage.title);
    const pageToSave = {
      ...currentPage,
      slug: sanitizedSlug
    };
    
    let updatedPages: typeof customPages = [];
    const pageIndex = customPages.findIndex(page => page.id === pageToSave.id);
    
    if (pageIndex >= 0) {
      // Update existing page
      updatedPages = [...customPages];
      updatedPages[pageIndex] = pageToSave;
    } else {
      // Add new page
      updatedPages = [...customPages, pageToSave];
    }
    
    setCustomPages(updatedPages);
    
    // Save to database immediately
    if (user?.store?.settings) {
      try {
        await updateStoreSettings({
          ...user.store.settings,
          customPages: updatedPages
        });
        toast.success("Page saved successfully");
      } catch (error) {
        console.error("Error saving page:", error);
        toast.error("Failed to save page");
      }
    }
    
    setIsEditing(false);
    setCurrentPage(null);
  };
  
  const handleUpdatePageField = (field: string, value: string) => {
    if (!currentPage) return;
    
    console.log(`Updating field ${field} with value: ${value}`);
    
    setCurrentPage({
      ...currentPage,
      [field]: value
    });
  };
  
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Custom Pages</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleAddPage} className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Page
              </Button>
              <Button onClick={handleSavePages}>Save All Pages</Button>
            </div>
          </div>
          
          {customPages.length === 0 && !isEditing ? (
            <div className="text-center py-8 border border-dashed rounded-md text-muted-foreground">
              No custom pages yet. Click "Add Page" to create your first page.
            </div>
          ) : (
            <div className="space-y-4">
              {!isEditing && (
                <div className="grid gap-4">
                  {customPages.map(page => (
                    <div key={page.id} className="flex justify-between items-center p-4 border rounded-md">
                      <div>
                        <h4 className="font-medium">{page.title}</h4>
                        <p className="text-sm text-muted-foreground">URL: /store/[store-id]/page/{page.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditPage(page)}>
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeletePage(page.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {isEditing && currentPage && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="page-title">Page Title</Label>
                    <Input
                      id="page-title"
                      value={currentPage.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        handleUpdatePageField('title', newTitle);
                        // Only auto-generate slug if slug is empty or matches previous auto-generated slug
                        if (!currentPage.slug || currentPage.slug === generateSlug(currentPage.title)) {
                          handleUpdatePageField('slug', generateSlug(newTitle));
                        }
                      }}
                      className="mb-1"
                    />
                    <p className="text-xs text-muted-foreground">
                      This is displayed at the top of the page
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="page-slug">URL Slug</Label>
                    <Input
                      id="page-slug"
                      value={currentPage.slug}
                      onChange={(e) => handleUpdatePageField('slug', e.target.value)}
                      className="mb-1"
                    />
                    <p className="text-xs text-muted-foreground">
                      The URL of your page will be: /store/[store-id]/page/{currentPage.slug}
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="page-content">Content</Label>
                    <Textarea
                      id="page-content"
                      value={currentPage.content}
                      onChange={(e) => handleUpdatePageField('content', e.target.value)}
                      rows={10}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      setCurrentPage(null);
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSavePage}>Save Page</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Design;
