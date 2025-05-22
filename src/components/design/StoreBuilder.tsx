import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus, GripVertical, X, Save, Eye, File, Trash } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ElementType = 'hero' | 'products' | 'text' | 'image' | 'categories' | 'testimonials' | 'cta';

interface BuilderElement {
  id: string;
  type: ElementType;
  settings: Record<string, any>;
}

interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
}

export const StoreBuilder = () => {
  const { user, updateStoreSettings } = useAuth();
  const [activeSection, setActiveSection] = useState<string>("homepage");
  const [activePage, setActivePage] = useState<string>("homepage");
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [legalPages, setLegalPages] = useState({
    privacy: {
      title: "Privacy Policy",
      content: "Your privacy policy content here..."
    },
    terms: {
      title: "Terms of Service",
      content: "Your terms of service content here..."
    },
    shipping: {
      title: "Shipping Policy",
      content: "Your shipping policy content here..."
    }
  });
  
  // Store page-specific elements in a single elements state object keyed by page name
  const [pageElements, setPageElements] = useState<Record<string, BuilderElement[]>>({
    homepage: [],
    about: [],
    contact: [],
    shop: []
  });
  
  // Custom pages state
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [newCustomPage, setNewCustomPage] = useState<{
    title: string;
    slug: string;
    content: string;
  }>({
    title: "",
    slug: "",
    content: ""
  });
  
  // Load existing store settings when component mounts
  useEffect(() => {
    if (user?.store?.settings) {
      // Load page elements if they exist
      if (user.store.settings.pageElements && typeof user.store.settings.pageElements === 'object') {
        setPageElements(prevElements => ({
          ...prevElements,
          ...user.store.settings.pageElements
        }));
      } else {
        // Set default elements if no saved elements exist
        setPageElements({
          homepage: [
            {
              id: '1',
              type: 'hero',
              settings: {
                title: 'Welcome to My Store',
                subtitle: 'Discover our amazing products',
                buttonText: 'Shop Now',
                buttonLink: '/shop',
                backgroundImage: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop'
              }
            },
            {
              id: '2',
              type: 'products',
              settings: {
                title: 'Featured Products',
                count: 4,
                layout: 'grid'
              }
            },
            {
              id: '3',
              type: 'text',
              settings: {
                content: 'We offer high quality products with great customer service.',
                alignment: 'center'
              }
            }
          ],
          about: [],
          contact: [],
          shop: []
        });
      }
      
      // Load custom pages if they exist
      if (user.store.settings.customPages && Array.isArray(user.store.settings.customPages)) {
        setCustomPages(user.store.settings.customPages);
      }
      
      // Load legal pages if they exist
      if (user.store.settings.legalPages) {
        setLegalPages(prevPages => ({
          ...prevPages,
          ...user.store.settings.legalPages
        }));
      }
    }
  }, [user?.store?.settings]);

  const elementTemplates: Record<ElementType, Omit<BuilderElement, 'id'>> = {
    hero: {
      type: 'hero',
      settings: {
        title: 'Section Title',
        subtitle: 'Section subtitle goes here',
        buttonText: 'Click Me',
        buttonLink: '#',
        backgroundImage: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop'
      }
    },
    products: {
      type: 'products',
      settings: {
        title: 'Products',
        count: 4,
        layout: 'grid'
      }
    },
    text: {
      type: 'text',
      settings: {
        content: 'Add your text here',
        alignment: 'left'
      }
    },
    image: {
      type: 'image',
      settings: {
        src: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop',
        alt: 'Image description',
        width: '100%'
      }
    },
    categories: {
      type: 'categories',
      settings: {
        title: 'Shop by Category',
        layout: 'grid'
      }
    },
    testimonials: {
      type: 'testimonials',
      settings: {
        title: 'What Our Customers Say'
      }
    },
    cta: {
      type: 'cta',
      settings: {
        title: 'Ready to get started?',
        buttonText: 'Contact Us',
        buttonLink: '/contact',
        backgroundColor: 'bg-primary',
        textColor: 'text-primary-foreground'
      }
    }
  };

  const addElement = (type: ElementType) => {
    try {
      const newElement = {
        id: `element-${Date.now()}`,
        ...elementTemplates[type]
      };
      
      setPageElements(prev => ({
        ...prev,
        [activePage]: [...(prev[activePage] || []), newElement]
      }));
      
      toast.success("Element added", {
        description: `Added new ${type} element to your page.`
      });
    } catch (error) {
      console.error("Error adding element:", error);
      toast.error("Failed to add element", {
        description: "There was a problem adding the element. Please try again."
      });
    }
  };

  const removeElement = (id: string) => {
    try {
      setPageElements(prev => ({
        ...prev,
        [activePage]: (prev[activePage] || []).filter(el => el.id !== id)
      }));
      
      toast.success("Element removed");
    } catch (error) {
      console.error("Error removing element:", error);
      toast.error("Failed to remove element");
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    try {
      const pageItems = Array.from(pageElements[activePage] || []);
      const [reorderedItem] = pageItems.splice(result.source.index, 1);
      pageItems.splice(result.destination.index, 0, reorderedItem);
      
      setPageElements(prev => ({
        ...prev,
        [activePage]: pageItems
      }));
    } catch (error) {
      console.error("Error reordering elements:", error);
      toast.error("Failed to reorder elements");
    }
  };

  const updateElementSettings = (id: string, settings: Record<string, any>) => {
    try {
      setPageElements(prev => ({
        ...prev,
        [activePage]: (prev[activePage] || []).map(el => 
          el.id === id ? { ...el, settings: { ...el.settings, ...settings } } : el
        )
      }));
    } catch (error) {
      console.error("Error updating element settings:", error);
      toast.error("Failed to update element settings");
    }
  };

  const addCustomPage = () => {
    try {
      if (!newCustomPage.title || !newCustomPage.slug) {
        toast.error("Please provide both a title and a slug for the custom page");
        return;
      }
      
      // Check if slug already exists
      if (customPages.some(page => page.slug === newCustomPage.slug)) {
        toast.error("A page with this slug already exists");
        return;
      }
      
      const newPage = {
        id: `page-${Date.now()}`,
        title: newCustomPage.title,
        slug: newCustomPage.slug.startsWith('/') ? newCustomPage.slug.substring(1) : newCustomPage.slug,
        content: newCustomPage.content || "Add your page content here"
      };
      
      setCustomPages([...customPages, newPage]);
      
      // Also create an empty page elements array for this custom page
      setPageElements(prev => ({
        ...prev,
        [newPage.slug]: []
      }));
      
      // Reset form
      setNewCustomPage({
        title: "",
        slug: "",
        content: ""
      });
      
      toast.success("Custom page created");
    } catch (error) {
      console.error("Error creating custom page:", error);
      toast.error("Failed to create custom page");
    }
  };

  const removeCustomPage = (id: string) => {
    try {
      const pageToRemove = customPages.find(page => page.id === id);
      
      setCustomPages(customPages.filter(page => page.id !== id));
      
      // Also remove page elements for this page
      if (pageToRemove) {
        setPageElements(prev => {
          const newElements = { ...prev };
          delete newElements[pageToRemove.slug];
          return newElements;
        });
      }
      
      toast.success("Custom page removed");
    } catch (error) {
      console.error("Error removing custom page:", error);
      toast.error("Failed to remove custom page");
    }
  };

  const updateCustomPage = (id: string, data: Partial<CustomPage>) => {
    try {
      setCustomPages(customPages.map(page => 
        page.id === id ? { ...page, ...data } : page
      ));
    } catch (error) {
      console.error("Error updating custom page:", error);
      toast.error("Failed to update custom page");
    }
  };

  const saveChanges = async () => {
    try {
      if (!user?.store) {
        toast.error("No store found");
        return;
      }
      
      // Create updated settings object with all our data
      const updatedSettings = {
        ...(user.store.settings || {}),
        pageElements: pageElements,
        customPages: customPages,
        legalPages: legalPages,
      };
      
      console.log("Saving settings:", updatedSettings);
      
      // Save to Supabase via AuthContext
      await updateStoreSettings(updatedSettings);
      
      toast.success("Changes saved", {
        description: "Your store design has been updated successfully."
      });
    } catch (error) {
      console.error("Error saving store design:", error);
      toast.error("Error saving changes", {
        description: "There was a problem saving your store design. Please try again."
      });
    }
  };

  const updateLegalPage = (page: keyof typeof legalPages, field: string, value: string) => {
    try {
      setLegalPages({
        ...legalPages,
        [page]: {
          ...legalPages[page],
          [field]: value
        }
      });
    } catch (error) {
      console.error("Error updating legal page:", error);
      toast.error("Failed to update legal page");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Store Design</h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPreviewMode(!previewMode)} 
            className="flex items-center"
          >
            <Eye className="h-4 w-4 mr-1" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </Button>
          <Button onClick={saveChanges} className="flex items-center">
            <Save className="h-4 w-4 mr-1" />
            Save Changes
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="homepage" value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="mb-4">
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="custom">Custom Pages</TabsTrigger>
          <TabsTrigger value="legal">Legal Pages</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>
        
        <TabsContent value="homepage" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Builder Panel */}
            <div className="col-span-1">
              <Card>
                <CardContent className="p-4">
                  <h2 className="text-lg font-medium mb-4">Add Elements</h2>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-start" onClick={() => addElement('hero')}>
                      <Plus className="h-4 w-4 mr-1" />
                      Hero Section
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => addElement('products')}>
                      <Plus className="h-4 w-4 mr-1" />
                      Products
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => addElement('text')}>
                      <Plus className="h-4 w-4 mr-1" />
                      Text Block
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => addElement('image')}>
                      <Plus className="h-4 w-4 mr-1" />
                      Image
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => addElement('categories')}>
                      <Plus className="h-4 w-4 mr-1" />
                      Categories
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => addElement('testimonials')}>
                      <Plus className="h-4 w-4 mr-1" />
                      Testimonials
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => addElement('cta')}>
                      <Plus className="h-4 w-4 mr-1" />
                      Call to Action
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Preview Panel */}
            <div className="col-span-1 lg:col-span-2">
              <Card className="border-primary/20">
                <CardContent className="p-0 relative">
                  <div className="bg-accent/50 text-center py-1.5 text-xs font-medium border-b border-border/30 flex items-center justify-between px-4">
                    <span>Preview: Homepage</span>
                  </div>
                  <div className={`bg-white rounded-b-lg ${previewMode ? 'p-0' : 'p-4'}`}>
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="elements">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4 min-h-[200px]"
                          >
                            {(pageElements[activePage] || []).map((element, index) => (
                              <Draggable key={element.id} draggableId={element.id} index={index} isDragDisabled={previewMode}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`border ${previewMode ? 'border-transparent' : 'border-dashed border-muted-foreground/50'} rounded-lg p-4 bg-card relative`}
                                  >
                                    {!previewMode && (
                                      <div className="absolute right-2 top-2 flex space-x-1">
                                        <button 
                                          className="p-1 rounded-sm bg-accent/50 hover:bg-accent"
                                          onClick={() => removeElement(element.id)}
                                        >
                                          <X className="h-3.5 w-3.5" />
                                        </button>
                                        <div 
                                          {...provided.dragHandleProps} 
                                          className="p-1 rounded-sm bg-accent/50 hover:bg-accent cursor-move"
                                        >
                                          <GripVertical className="h-3.5 w-3.5" />
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Element preview */}
                                    {element.type === 'hero' && (
                                      <div className="relative h-40 overflow-hidden rounded-md mb-2">
                                        <img 
                                          src={element.settings.backgroundImage} 
                                          alt="Hero background" 
                                          className="absolute inset-0 w-full h-full object-cover" 
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-white">
                                          <h2 className="font-bold text-xl">{element.settings.title}</h2>
                                          <p className="text-sm mb-2">{element.settings.subtitle}</p>
                                          <Button size="sm" variant="secondary">{element.settings.buttonText}</Button>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {element.type === 'products' && (
                                      <div>
                                        <h3 className="font-medium mb-2">{element.settings.title}</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                          {Array(Math.min(element.settings.count, 4)).fill(0).map((_, i) => (
                                            <div key={i} className="aspect-square bg-accent rounded-md"></div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {element.type === 'text' && (
                                      <div className={`text-${element.settings.alignment || 'left'}`}>
                                        <p>{element.settings.content}</p>
                                      </div>
                                    )}
                                    
                                    {element.type === 'image' && (
                                      <div>
                                        <img src={element.settings.src} alt={element.settings.alt} className="max-w-full rounded-md" />
                                      </div>
                                    )}
                                    
                                    {element.type === 'categories' && (
                                      <div>
                                        <h3 className="font-medium mb-2">{element.settings.title}</h3>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="aspect-square bg-accent rounded-md"></div>
                                          <div className="aspect-square bg-accent rounded-md"></div>
                                          <div className="aspect-square bg-accent rounded-md"></div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {element.type === 'testimonials' && (
                                      <div>
                                        <h3 className="font-medium mb-2">{element.settings.title}</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                          <div className="p-3 bg-accent/50 rounded-md">
                                            <p className="text-sm italic">"Great products and service!"</p>
                                            <p className="text-xs font-medium mt-1">- Happy Customer</p>
                                          </div>
                                          <div className="p-3 bg-accent/50 rounded-md">
                                            <p className="text-sm italic">"Highly recommended!"</p>
                                            <p className="text-xs font-medium mt-1">- Satisfied Client</p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {element.type === 'cta' && (
                                      <div className={`text-center py-2 px-4 rounded-lg ${element.settings.backgroundColor || 'bg-primary'} ${element.settings.textColor || 'text-primary-foreground'}`}>
                                        <h3 className="font-medium mb-2">{element.settings.title}</h3>
                                        <Button variant="secondary" size="sm">{element.settings.buttonText}</Button>
                                      </div>
                                    )}
                                    
                                    {!previewMode && (
                                      <div className="mt-2 pt-2 border-t border-border/30">
                                        <h4 className="text-xs font-medium mb-1.5">Edit Settings</h4>
                                        
                                        {/* Element specific settings */}
                                        {element.type === 'hero' && (
                                          <div className="space-y-2">
                                            <div>
                                              <Label htmlFor={`${element.id}-title`} className="text-xs">Title</Label>
                                              <Input
                                                id={`${element.id}-title`}
                                                value={element.settings.title}
                                                onChange={(e) => updateElementSettings(element.id, { title: e.target.value })}
                                                className="h-7 text-sm"
                                              />
                                            </div>
                                            <div>
                                              <Label htmlFor={`${element.id}-subtitle`} className="text-xs">Subtitle</Label>
                                              <Input
                                                id={`${element.id}-subtitle`}
                                                value={element.settings.subtitle}
                                                onChange={(e) => updateElementSettings(element.id, { subtitle: e.target.value })}
                                                className="h-7 text-sm"
                                              />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                              <div>
                                                <Label htmlFor={`${element.id}-buttonText`} className="text-xs">Button Text</Label>
                                                <Input
                                                  id={`${element.id}-buttonText`}
                                                  value={element.settings.buttonText}
                                                  onChange={(e) => updateElementSettings(element.id, { buttonText: e.target.value })}
                                                  className="h-7 text-sm"
                                                />
                                              </div>
                                              <div>
                                                <Label htmlFor={`${element.id}-buttonLink`} className="text-xs">Button Link</Label>
                                                <Input
                                                  id={`${element.id}-buttonLink`}
                                                  value={element.settings.buttonLink}
                                                  onChange={(e) => updateElementSettings(element.id, { buttonLink: e.target.value })}
                                                  className="h-7 text-sm"
                                                />
                                              </div>
                                            </div>
                                            <div>
                                              <Label htmlFor={`${element.id}-backgroundImage`} className="text-xs">Background Image URL</Label>
                                              <Input
                                                id={`${element.id}-backgroundImage`}
                                                value={element.settings.backgroundImage}
                                                onChange={(e) => updateElementSettings(element.id, { backgroundImage: e.target.value })}
                                                className="h-7 text-sm"
                                              />
                                            </div>
                                          </div>
                                        )}
                                        
                                        {element.type === 'products' && (
                                          <div className="space-y-2">
                                            <div>
                                              <Label htmlFor={`${element.id}-title`} className="text-xs">Title</Label>
                                              <Input
                                                id={`${element.id}-title`}
                                                value={element.settings.title}
                                                onChange={(e) => updateElementSettings(element.id, { title: e.target.value })}
                                                className="h-7 text-sm"
                                              />
                                            </div>
                                            <div>
                                              <Label htmlFor={`${element.id}-count`} className="text-xs">Number of Products</Label>
                                              <Input
                                                id={`${element.id}-count`}
                                                type="number"
                                                min="1"
                                                max="12"
                                                value={element.settings.count}
                                                onChange={(e) => updateElementSettings(element.id, { count: parseInt(e.target.value) || 1 })}
                                                className="h-7 text-sm"
                                              />
                                            </div>
                                          </div>
                                        )}
                                        
                                        {element.type === 'text' && (
                                          <div className="space-y-2">
                                            <div>
                                              <Label htmlFor={`${element.id}-content`} className="text-xs">Content</Label>
                                              <Textarea
                                                id={`${element.id}-content`}
                                                value={element.settings.content}
                                                onChange={(e) => updateElementSettings(element.id, { content: e.target.value })}
                                                className="text-sm"
                                                rows={3}
                                              />
                                            </div>
                                            <div>
                                              <Label htmlFor={`${element.id}-alignment`} className="text-xs">Alignment</Label>
                                              <Select
                                                value={element.settings.alignment || "left"}
                                                onValueChange={(value) => updateElementSettings(element.id, { alignment: value })}
                                              >
                                                <SelectTrigger className="h-7 text-sm">
                                                  <SelectValue placeholder="Select alignment" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="left">Left</SelectItem>
                                                  <SelectItem value="center">Center</SelectItem>
                                                  <SelectItem value="right">Right</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          </div>
                                        )}
                                        
                                        {element.type === 'image' && (
                                          <div className="space-y-2">
                                            <div>
                                              <Label htmlFor={`${element.id}-src`} className="text-xs">Image URL</Label>
                                              <Input
                                                id={`${element.id}-src`}
                                                value={element.settings.src}
                                                onChange={(e) => updateElementSettings(element.id, { src: e.target.value })}
                                                className="h-7 text-sm"
                                              />
                                            </div>
                                            <div>
                                              <Label htmlFor={`${element.id}-alt`} className="text-xs">Alt Text</Label>
                                              <Input
                                                id={`${element.id}-alt`}
                                                value={element.settings.alt}
                                                onChange={(e) => updateElementSettings(element.id, { alt: e.target.value })}
                                                className="h-7 text-sm"
                                              />
                                            </div>
                                          </div>
                                        )}
                                        
                                        {element.type === 'categories' && (
                                          <div className="space-y-2">
                                            <div>
                                              <Label htmlFor={`${element.id}-title`} className="text-xs">Title</Label>
                                              <Input
                                                id={`${element.id}-title`}
                                                value={element.settings.title}
                                                onChange={(e) => updateElementSettings(element.id, { title: e.target.value })}
                                                className="h-7 text-sm"
                                              />
                                            </div>
                                          </div>
                                        )}
                                        
                                        {element.type === 'testimonials' && (
                                          <div className="space-y-2">
                                            <div>
                                              <Label htmlFor={`${element.id}-title`} className="text-xs">Title</Label>
                                              <Input
                                                id={`${element.id}-title`}
                                                value={element.settings.title}
                                                onChange={(e) => updateElementSettings(element.id, { title: e.target.value })}
                                                className="h-7 text-sm"
                                              />
                                            </div>
                                          </div>
                                        )}
                                        
                                        {element.type === 'cta' && (
                                          <div className="space-y-2">
                                            <div>
                                              <Label htmlFor={`${element.id}-title`} className="text-xs">Title</Label>
                                              <Input
                                                id={`${element.id}-title`}
                                                value={element.settings.title}
                                                onChange={(e) => updateElementSettings(element.id, { title: e.target.value })}
                                                className="h-7 text-sm"
                                              />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                              <div>
                                                <Label htmlFor={`${element.id}-buttonText`} className="text-xs">Button Text</Label>
                                                <Input
                                                  id={`${element.id}-buttonText`}
                                                  value={element.settings.buttonText}
                                                  onChange={(e) => updateElementSettings(element.id, { buttonText: e.target.value })}
                                                  className="h-7 text-sm"
                                                />
                                              </div>
                                              <div>
                                                <Label htmlFor={`${element.id}-buttonLink`} className="text-xs">Button Link</Label>
                                                <Input
                                                  id={`${element.id}-buttonLink`}
                                                  value={element.settings.buttonLink}
                                                  onChange={(e) => updateElementSettings(element.id, { buttonLink: e.target.value })}
                                                  className="h-7 text-sm"
                                                />
                                              </div>
                                            </div>
                                            <div>
                                              <Label htmlFor={`${element.id}-bgColor`} className="text-xs">Background Color</Label>
                                              <Select
                                                value={element.settings.backgroundColor || "bg-primary"}
                                                onValueChange={(value) => updateElementSettings(element.id, { backgroundColor: value })}
                                              >
                                                <SelectTrigger className="h-7 text-sm">
                                                  <SelectValue placeholder="Select color" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="bg-primary">Primary</SelectItem>
                                                  <SelectItem value="bg-secondary">Secondary</SelectItem>
                                                  <SelectItem value="bg-accent">Accent</SelectItem>
                                                  <SelectItem value="bg-muted">Muted</SelectItem>
                                                  <SelectItem value="bg-destructive">Destructive</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div>
                                              <Label htmlFor={`${element.id}-textColor`} className="text-xs">Text Color</Label>
                                              <Select
                                                value={element.settings.textColor || "text-primary-foreground"}
                                                onValueChange={(value) => updateElementSettings(element.id, { textColor: value })}
                                              >
                                                <SelectTrigger className="h-7 text-sm">
                                                  <SelectValue placeholder="Select text color" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="text-primary-foreground">Primary</SelectItem>
                                                  <SelectItem value="text-secondary-foreground">Secondary</SelectItem>
                                                  <SelectItem value="text-accent-foreground">Accent</SelectItem>
                                                  <SelectItem value="text-white">White</SelectItem>
                                                  <SelectItem value="text-black">Black</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            
                            {(!pageElements[activePage] || pageElements[activePage].length === 0) && !previewMode && (
                              <div className="text-center py-8 border border-dashed rounded-lg">
                                <p className="text-muted-foreground">Drag and drop elements here</p>
                              </div>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Edit Pages</h3>
              <p className="text-muted-foreground mb-6">
                Choose which page you want to edit using the page builder.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Button 
                  variant={activePage === "homepage" ? "default" : "outline"} 
                  className="h-auto py-6 flex flex-col items-center justify-center"
                  onClick={() => setActivePage("homepage")}
                >
                  <span className="text-lg font-medium">Homepage</span>
                  <span className="text-xs text-muted-foreground mt-1">Main landing page</span>
                </Button>
                
                <Button 
                  variant={activePage === "about" ? "default" : "outline"} 
                  className="h-auto py-6 flex flex-col items-center justify-center"
                  onClick={() => setActivePage("about")}
                >
                  <span className="text-lg font-medium">About</span>
                  <span className="text-xs text-muted-foreground mt-1">About page</span>
                </Button>
                
                <Button 
                  variant={activePage === "contact" ? "default" : "outline"} 
                  className="h-auto py-6 flex flex-col items-center justify-center"
                  onClick={() => setActivePage("contact")}
                >
                  <span className="text-lg font-medium">Contact</span>
                  <span className="text-xs text-muted-foreground mt-1">Contact page</span>
                </Button>
                
                <Button 
                  variant={activePage === "shop" ? "default" : "outline"} 
                  className="h-auto py-6 flex flex-col items-center justify-center"
                  onClick={() => setActivePage("shop")}
                >
                  <span className="text-lg font-medium">Shop</span>
                  <span className="text-xs text-muted-foreground mt-1">Products page</span>
                </Button>
                
                {/* Custom pages */}
                {customPages.map(page => (
                  <Button 
                    key={page.id}
                    variant={activePage === page.slug ? "default" : "outline"} 
                    className="h-auto py-6 flex flex-col items-center justify-center"
                    onClick={() => setActivePage(page.slug)}
                  >
                    <span className="text-lg font-medium">{page.title}</span>
                    <span className="text-xs text-muted-foreground mt-1">Custom page</span>
                  </Button>
                ))}
              </div>
              
              <div className="mt-8 border-t pt-6">
                <h4 className="text-lg font-medium mb-4">Page Builder for: {activePage === "homepage" ? "Homepage" : activePage}</h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Builder Panel */}
                  <div className="col-span-1">
                    <Card>
                      <CardContent className="p-4">
                        <h2 className="text-lg font-medium mb-4">Add Elements</h2>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" className="justify-start" onClick={() => addElement('hero')}>
                            <Plus className="h-4 w-4 mr-1" />
                            Hero Section
                          </Button>
                          <Button variant="outline" className="justify-start" onClick={() => addElement('products')}>
                            <Plus className="h-4 w-4 mr-1" />
                            Products
                          </Button>
                          <Button variant="outline" className="justify-start" onClick={() => addElement('text')}>
                            <Plus className="h-4 w-4 mr-1" />
                            Text Block
                          </Button>
                          <Button variant="outline" className="justify-start" onClick={() => addElement('image')}>
                            <Plus className="h-4 w-4 mr-1" />
                            Image
                          </Button>
                          <Button variant="outline" className="justify-start" onClick={() => addElement('categories')}>
                            <Plus className="h-4 w-4 mr-1" />
                            Categories
                          </Button>
                          <Button variant="outline" className="justify-start" onClick={() => addElement('testimonials')}>
                            <Plus className="h-4 w-4 mr-1" />
                            Testimonials
                          </Button>
                          <Button variant="outline" className="justify-start" onClick={() => addElement('cta')}>
                            <Plus className="h-4 w-4 mr-1" />
                            Call to Action
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Preview Panel */}
                  <div className="col-span-1 lg:col-span-2">
                    <Card className="border-primary/20">
                      <CardContent className="p-0 relative">
                        <div className="bg-accent/50 text-center py-1.5 text-xs font-medium border-b border-border/30">
                          Preview: {activePage === "homepage" ? "Homepage" : activePage}
                        </div>
                        <div className={`bg-white rounded-b-lg ${previewMode ? 'p-0' : 'p-4'}`}>
                          <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="elements">
                              {(provided) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  className="space-y-4 min-h-[200px]"
                                >
                                  {(pageElements[activePage] || []).map((element, index) => (
                                    <Draggable key={element.id} draggableId={element.id} index={index} isDragDisabled={previewMode}>
                                      {(provided) => (
                                        // Same component as in the homepage tab
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          className={`border ${previewMode ? 'border-transparent' : 'border-dashed border-muted-foreground/50'} rounded-lg p-4 bg-card relative`}
                                        >
                                          {/* The rest of the element rendering is the same as in the homepage tab */}
                                          {/* ... keep existing code for element rendering and editing */}
                                          
                                          {!previewMode && (
                                            <div className="absolute right-2 top-2 flex space-x-1">
                                              <button 
                                                className="p-1 rounded-sm bg-accent/50 hover:bg-accent"
                                                onClick={() => removeElement(element.id)}
                                              >
                                                <X className="h-3.5 w-3.5" />
                                              </button>
                                              <div 
                                                {...provided.dragHandleProps} 
                                                className="p-1 rounded-sm bg-accent/50 hover:bg-accent cursor-move"
                                              >
                                                <GripVertical className="h-3.5 w-3.5" />
                                              </div>
                                            </div>
                                          )}
                                          
                                          {/* Element preview */}
                                          {element.type === 'text' && (
                                            <div className={`text-${element.settings.alignment || 'left'}`}>
                                              <p>{element.settings.content}</p>
                                            </div>
                                          )}
                                          
                                          {/* Add other element type renders as needed */}
                                          
                                          {!previewMode && (
                                            <div className="mt-2 pt-2 border-t border-border/30">
                                              <h4 className="text-xs font-medium mb-1.5">Edit Settings</h4>
                                              
                                              {/* Element specific settings - same as homepage tab */}
                                              {/* ... keep existing code for element settings */}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                  
                                  {(!pageElements[activePage] || pageElements[activePage].length === 0) && !previewMode && (
                                    <div className="text-center py-8 border border-dashed rounded-lg">
                                      <p className="text-muted-foreground">Drag and drop elements here</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Droppable>
                          </DragDropContext>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Custom Pages</h3>
              <p className="text-muted-foreground mb-6">
                Create new pages for your store or edit existing ones.
              </p>
              
              <div className="border-b pb-6 mb-6">
                <h4 className="font-medium mb-3">Add New Page</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pageTitle">Page Title</Label>
                    <Input
                      id="pageTitle"
                      value={newCustomPage.title}
                      onChange={(e) => setNewCustomPage({ ...newCustomPage, title: e.target.value })}
                      placeholder="e.g. FAQ"
                      className="mb-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pageSlug">Page URL (slug)</Label>
                    <Input
                      id="pageSlug"
                      value={newCustomPage.slug}
                      onChange={(e) => setNewCustomPage({ ...newCustomPage, slug: e.target.value })}
                      placeholder="e.g. faq"
                      className="mb-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This will be used in the URL: yourstore.com/store/slug/
                      <span className="font-medium">{newCustomPage.slug}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="pageContent">Page Content</Label>
                  <Textarea
                    id="pageContent"
                    value={newCustomPage.content}
                    onChange={(e) => setNewCustomPage({ ...newCustomPage, content: e.target.value })}
                    placeholder="Enter page content here..."
                    rows={6}
                    className="mb-4"
                  />
                </div>
                <Button
                  onClick={addCustomPage}
                  disabled={!newCustomPage.title || !newCustomPage.slug}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Page
                </Button>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium mb-3">My Custom Pages</h4>
                {customPages.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-2">No custom pages yet</p>
                    <p className="text-xs text-muted-foreground">Add a page using the form above</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customPages.map((page) => (
                      <Card key={page.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h5 className="font-medium">{page.title}</h5>
                              <p className="text-sm text-muted-foreground">/{page.slug}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setActivePage(page.slug)}
                              >
                                Edit Design
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => removeCustomPage(page.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="bg-accent/30 p-2 rounded text-sm mb-4">
                            <p className="line-clamp-2">{page.content || "No content"}</p>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-muted-foreground">
                              URL: /store/{storeId}/{page.slug}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="legal" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Privacy Policy</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="privacy-title">Page Title</Label>
                  <Input
                    id="privacy-title"
                    value={legalPages.privacy.title}
                    onChange={(e) => updateLegalPage('privacy', 'title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="privacy-content">Content</Label>
                  <Textarea
                    id="privacy-content"
                    value={legalPages.privacy.content}
                    onChange={(e) => updateLegalPage('privacy', 'content', e.target.value)}
                    rows={10}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Terms of Service</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="terms-title">Page Title</Label>
                  <Input
                    id="terms-title"
                    value={legalPages.terms.title}
                    onChange={(e) => updateLegalPage('terms', 'title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="terms-content">Content</Label>
                  <Textarea
                    id="terms-content"
                    value={legalPages.terms.content}
                    onChange={(e) => updateLegalPage('terms', 'content', e.target.value)}
                    rows={10}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Shipping Policy</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="shipping-title">Page Title</Label>
                  <Input
                    id="shipping-title"
                    value={legalPages.shipping.title}
                    onChange={(e) => updateLegalPage('shipping', 'title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="shipping-content">Content</Label>
                  <Textarea
                    id="shipping-content"
                    value={legalPages.shipping.content}
                    onChange={(e) => updateLegalPage('shipping', 'content', e.target.value)}
                    rows={10}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="theme" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Theme Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Colors</h4>
                  <div className="space-y-2">
                    <Label htmlFor="primary-color" className="text-sm">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary border border-border"></div>
                      <Input id="primary-color" type="color" className="w-12 h-8" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Typography</h4>
                  <div className="space-y-2">
                    <Label htmlFor="font-family" className="text-sm">Font Family</Label>
                    <select id="font-family" className="w-full border border-input rounded-md px-3 py-2">
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Lato">Lato</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
