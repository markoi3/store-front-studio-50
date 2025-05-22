import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus, GripVertical, X, Save, Eye } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type ElementType = 'hero' | 'products' | 'text' | 'image' | 'categories' | 'testimonials' | 'cta';

interface BuilderElement {
  id: string;
  type: ElementType;
  settings: Record<string, any>;
}

export const StoreBuilder = () => {
  const { user, updateStoreSettings } = useAuth();
  const [activeSection, setActiveSection] = useState<string>("homepage");
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
  
  const [elements, setElements] = useState<BuilderElement[]>([]);
  
  // Load existing store settings when component mounts
  useEffect(() => {
    if (user?.store?.settings) {
      // Load page elements if they exist
      if (user.store.settings.pageElements && Array.isArray(user.store.settings.pageElements)) {
        setElements(user.store.settings.pageElements);
      } else {
        // Set default elements if no saved elements exist
        setElements([
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
        ]);
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
        buttonLink: '/contact'
      }
    }
  };

  const addElement = (type: ElementType) => {
    const newElement = {
      id: `element-${Date.now()}`,
      ...elementTemplates[type]
    };
    
    setElements([...elements, newElement]);
    toast("Element added", {
      description: `Added new ${type} element to your page.`
    });
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(elements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setElements(items);
  };

  const updateElementSettings = (id: string, settings: Record<string, any>) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, settings: { ...el.settings, ...settings } } : el
    ));
  };

  const saveChanges = async () => {
    try {
      // Create updated settings object with updated elements and legal pages
      const updatedSettings = {
        ...(user?.store?.settings || {}),
        pageElements: elements,
        legalPages: legalPages,
      };
      
      // Save to Supabase via AuthContext
      await updateStoreSettings(updatedSettings);
      
      toast("Changes saved", {
        description: "Your store design has been updated successfully."
      });
    } catch (error) {
      console.error("Error saving store design:", error);
      toast("Error saving changes", {
        description: "There was a problem saving your store design. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateLegalPage = (page: keyof typeof legalPages, field: string, value: string) => {
    setLegalPages({
      ...legalPages,
      [page]: {
        ...legalPages[page],
        [field]: value
      }
    });
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
          <TabsTrigger value="pages">Legal Pages</TabsTrigger>
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
                  <div className="bg-accent/50 text-center py-1.5 text-xs font-medium border-b border-border/30">
                    Preview: Homepage
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
                            {elements.map((element, index) => (
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
                                      <div className={`text-${element.settings.alignment}`}>
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
                                      <div className="text-center py-2">
                                        <h3 className="font-medium mb-2">{element.settings.title}</h3>
                                        <Button size="sm">{element.settings.buttonText}</Button>
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
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            
                            {elements.length === 0 && !previewMode && (
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
        
        <TabsContent value="pages" className="space-y-6">
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
