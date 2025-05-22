import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus, GripVertical, X, Save, Eye, Palette, PenTool } from "lucide-react";
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

type PageType = 'homepage' | 'about' | 'contact' | 'legal' | 'custom';
type LegalPageType = 'privacy' | 'terms' | 'shipping';

export const StoreBuilder = () => {
  const { user, updateStoreSettings } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>("homepage");
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [selectedPageType, setSelectedPageType] = useState<PageType>('homepage');
  const [selectedCustomPage, setSelectedCustomPage] = useState<string>('');
  const [selectedLegalPage, setSelectedLegalPage] = useState<LegalPageType>('privacy');
  const [elements, setElements] = useState<BuilderElement[]>([]);
  const [customPages, setCustomPages] = useState<Array<{id: string; title: string; slug: string; content: string; elements?: BuilderElement[]}>>([]);
  
  // Load existing store settings when component mounts
  useEffect(() => {
    if (user?.store?.settings) {
      loadPageElements();
    }
  }, [user?.store?.settings, selectedPageType, selectedCustomPage, selectedLegalPage]);

  const loadPageElements = () => {
    if (!user?.store?.settings) return;
    
    let elementsToLoad: BuilderElement[] = [];
    
    // Load elements based on selected page type
    if (selectedPageType === 'homepage') {
      // Load homepage elements
      if (user.store.settings.pageElements && Array.isArray(user.store.settings.pageElements)) {
        elementsToLoad = [...user.store.settings.pageElements];
        console.log(`Loaded ${elementsToLoad.length} homepage elements`);
      }
    } 
    else if (selectedPageType === 'custom' && selectedCustomPage) {
      // Load custom page elements
      const customPage = user.store.settings.customPages?.find(page => page.id === selectedCustomPage);
      if (customPage?.elements && Array.isArray(customPage.elements)) {
        elementsToLoad = [...customPage.elements];
        console.log(`Loaded ${elementsToLoad.length} custom page elements for ${customPage.title}`);
      }
      
      // Update custom pages state
      if (user.store.settings.customPages && Array.isArray(user.store.settings.customPages)) {
        setCustomPages(user.store.settings.customPages);
      }
    }
    else if (selectedPageType === 'legal') {
      // Load legal page settings
      if (user.store.settings.legalPages) {
        setLegalPages(prevPages => ({
          ...prevPages,
          ...user.store.settings.legalPages
        }));
      }
    }
    
    // Set elements state
    setElements(elementsToLoad);
    
    // Load custom pages if available
    if (user.store.settings.customPages && Array.isArray(user.store.settings.customPages)) {
      setCustomPages(user.store.settings.customPages);
    }
    
    // Load legal pages if available
    if (user.store.settings.legalPages) {
      setLegalPages(prevPages => ({
        ...prevPages,
        ...user.store.settings.legalPages
      }));
    }
  };

  const elementTemplates: Record<ElementType, Omit<BuilderElement, 'id'>> = {
    hero: {
      type: 'hero',
      settings: {
        title: 'Section Title',
        subtitle: 'Section subtitle goes here',
        buttonText: 'Click Me',
        buttonLink: '#',
        backgroundColor: '#000000',
        textColor: '#ffffff',
        buttonColor: '#3b82f6',
        buttonTextColor: '#ffffff',
        backgroundImage: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop'
      }
    },
    products: {
      type: 'products',
      settings: {
        title: 'Products',
        count: 4,
        layout: 'grid',
        backgroundColor: '#ffffff',
        textColor: '#000000'
      }
    },
    text: {
      type: 'text',
      settings: {
        content: 'Add your text here',
        alignment: 'left',
        backgroundColor: 'transparent',
        textColor: '#000000',
        fontSize: 'medium'
      }
    },
    image: {
      type: 'image',
      settings: {
        src: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop',
        alt: 'Image description',
        width: '100%',
        height: 'auto',
        borderRadius: '4px'
      }
    },
    categories: {
      type: 'categories',
      settings: {
        title: 'Shop by Category',
        layout: 'grid',
        backgroundColor: '#f9fafb',
        textColor: '#000000'
      }
    },
    testimonials: {
      type: 'testimonials',
      settings: {
        title: 'What Our Customers Say',
        backgroundColor: '#f9fafb',
        textColor: '#000000'
      }
    },
    cta: {
      type: 'cta',
      settings: {
        title: 'Ready to get started?',
        buttonText: 'Contact Us',
        buttonLink: '/contact',
        backgroundColor: '#f9fafb',
        textColor: '#000000',
        buttonColor: '#3b82f6',
        buttonTextColor: '#ffffff'
      }
    }
  };

  const addElement = (type: ElementType) => {
    try {
      const newElement = {
        id: `element-${Date.now()}`,
        ...elementTemplates[type]
      };
      
      setElements(prev => [...prev, newElement]);
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
      setElements(elements.filter(el => el.id !== id));
      toast.success("Element removed");
    } catch (error) {
      console.error("Error removing element:", error);
      toast.error("Failed to remove element");
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    try {
      const items = Array.from(elements);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      
      setElements(items);
    } catch (error) {
      console.error("Error reordering elements:", error);
      toast.error("Failed to reorder elements");
    }
  };

  const updateElementSettings = (id: string, settings: Record<string, any>) => {
    try {
      setElements(elements.map(el => 
        el.id === id ? { ...el, settings: { ...el.settings, ...settings } } : el
      ));
    } catch (error) {
      console.error("Error updating element settings:", error);
      toast.error("Failed to update element settings");
    }
  };

  const saveChanges = async () => {
    try {
      if (!user?.store) {
        toast.error("No store found");
        return;
      }
      
      let updatedSettings = { ...user.store.settings || {} };
      
      // Save elements based on selected page type
      if (selectedPageType === 'homepage') {
        updatedSettings.pageElements = elements;
        console.log(`Saving ${elements.length} homepage elements`);
      }
      else if (selectedPageType === 'custom' && selectedCustomPage) {
        // Get current custom pages
        const currentCustomPages = [...(updatedSettings.customPages || [])];
        
        // Find and update the selected custom page
        const pageIndex = currentCustomPages.findIndex(page => page.id === selectedCustomPage);
        
        if (pageIndex >= 0) {
          currentCustomPages[pageIndex] = {
            ...currentCustomPages[pageIndex],
            elements: elements
          };
          
          // Update custom pages in settings
          updatedSettings.customPages = currentCustomPages;
          console.log(`Saving ${elements.length} elements for custom page: ${currentCustomPages[pageIndex].title}`);
        }
      }
      else if (selectedPageType === 'legal') {
        // Save legal pages
        updatedSettings.legalPages = legalPages;
      }
      
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

  const updateLegalPage = (page: LegalPageType, field: string, value: string) => {
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
  
  const renderPageSelector = () => {
    return (
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div className="space-y-2 min-w-[200px]">
          <Label htmlFor="pageTypeSelect">Page Type</Label>
          <Select
            value={selectedPageType}
            onValueChange={(value) => setSelectedPageType(value as PageType)}
          >
            <SelectTrigger id="pageTypeSelect">
              <SelectValue placeholder="Select page type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="homepage">Homepage</SelectItem>
              <SelectItem value="custom">Custom Page</SelectItem>
              <SelectItem value="legal">Legal Page</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {selectedPageType === 'custom' && (
          <div className="space-y-2 min-w-[200px]">
            <Label htmlFor="customPageSelect">Custom Page</Label>
            <Select
              value={selectedCustomPage}
              onValueChange={setSelectedCustomPage}
              disabled={!customPages.length}
            >
              <SelectTrigger id="customPageSelect">
                <SelectValue placeholder="Select a custom page" />
              </SelectTrigger>
              <SelectContent>
                {customPages.length ? (
                  customPages.map((page) => (
                    <SelectItem key={page.id} value={page.id}>{page.title}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>No custom pages</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {selectedPageType === 'legal' && (
          <div className="space-y-2 min-w-[200px]">
            <Label htmlFor="legalPageSelect">Legal Page</Label>
            <Select
              value={selectedLegalPage}
              onValueChange={setSelectedLegalPage}
            >
              <SelectTrigger id="legalPageSelect">
                <SelectValue placeholder="Select a legal page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="privacy">Privacy Policy</SelectItem>
                <SelectItem value="terms">Terms of Service</SelectItem>
                <SelectItem value="shipping">Shipping Policy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    );
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
      
      {/* Add page selector */}
      {renderPageSelector()}
      
      {selectedPageType === 'legal' ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">{legalPages[selectedLegalPage]?.title || "Legal Page"}</h2>
              <div>
                <Label htmlFor="legal-title">Page Title</Label>
                <Input
                  id="legal-title"
                  value={legalPages[selectedLegalPage]?.title || ""}
                  onChange={(e) => updateLegalPage(selectedLegalPage, 'title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="legal-content">Content</Label>
                <Textarea
                  id="legal-content"
                  value={legalPages[selectedLegalPage]?.content || ""}
                  onChange={(e) => updateLegalPage(selectedLegalPage, 'content', e.target.value)}
                  rows={10}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : selectedPageType === 'custom' && (!selectedCustomPage || !customPages.length) ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            {customPages.length
              ? "Select a custom page to edit"
              : "No custom pages created yet. Please create a custom page first."}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setActiveSection("custom");
              navigate("/design?tab=custom");
            }}
          >
            Go to Custom Pages
          </Button>
        </div>
      ) : (
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
                  Preview: {selectedPageType === 'homepage' ? 'Homepage' : 
                           selectedPageType === 'custom' ? customPages.find(p => p.id === selectedCustomPage)?.title || 'Custom Page' :
                           'Page'}
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
                                  style={{
                                    backgroundColor: element.settings.backgroundColor || 'transparent',
                                    color: element.settings.textColor || 'inherit',
                                    ...provided.draggableProps.style
                                  }}
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
                                      <div 
                                        className="absolute inset-0 flex flex-col items-center justify-center p-4"
                                        style={{
                                          backgroundColor: `${element.settings.backgroundColor || '#000000'}80`,
                                          color: element.settings.textColor || '#ffffff',
                                        }}
                                      >
                                        <h2 className="font-bold text-xl">{element.settings.title}</h2>
                                        <p className="text-sm mb-2">{element.settings.subtitle}</p>
                                        <Button 
                                          size="sm" 
                                          variant="secondary"
                                          style={{
                                            backgroundColor: element.settings.buttonColor || '#3b82f6',
                                            color: element.settings.buttonTextColor || '#ffffff'
                                          }}
                                        >
                                          {element.settings.buttonText}
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {element.type === 'products' && (
                                    <div>
                                      <h3 className="font-medium mb-2">{element.settings.title}</h3>
                                      <div className="grid grid-cols-2 gap-2">
                                        {Array(Math.min(element.settings.count || 4, 4)).fill(0).map((_, i) => (
                                          <div key={i} className="aspect-square bg-accent rounded-md"></div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {element.type === 'text' && (
                                    <div className={`text-${element.settings.alignment || 'left'}`}>
                                      <p style={{fontSize: getFontSize(element.settings.fontSize || 'medium')}}>{element.settings.content}</p>
                                    </div>
                                  )}
                                  
                                  {element.type === 'image' && (
                                    <div>
                                      <img 
                                        src={element.settings.src} 
                                        alt={element.settings.alt || ''} 
                                        className="max-w-full" 
                                        style={{
                                          borderRadius: element.settings.borderRadius || '4px',
                                          width: element.settings.width || '100%',
                                          height: element.settings.height || 'auto'
                                        }}
                                      />
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
                                      <Button 
                                        size="sm"
                                        style={{
                                          backgroundColor: element.settings.buttonColor || '#3b82f6',
                                          color: element.settings.buttonTextColor || '#ffffff'
                                        }}
                                      >
                                        {element.settings.buttonText}
                                      </Button>
                                    </div>
                                  )}
                                  
                                  {!previewMode && (
                                    <div className="mt-2 pt-2 border-t border-border/30">
                                      <div className="flex items-center justify-between mb-1.5">
                                        <h4 className="text-xs font-medium">Edit Settings</h4>
                                        
                                        <div className="flex gap-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-1"
                                            onClick={() => {
                                              const colorSection = document.getElementById(`${element.id}-colors`);
                                              if (colorSection) {
                                                colorSection.scrollIntoView({behavior: 'smooth'});
                                              }
                                            }}
                                          >
                                            <Palette className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      </div>
                                      
                                      {/* Element specific settings */}
                                      {renderElementSettings(element)}
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          
                          {elements.length === 0 && !previewMode && (
                            <div className="text-center py-8 border border-dashed rounded-lg">
                              <p className="text-muted-foreground">Add elements to your page and arrange them by dragging</p>
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
      )}
    </div>
  );
  
  function getFontSize(size: string) {
    switch(size) {
      case 'small': return '0.875rem';
      case 'medium': return '1rem';
      case 'large': return '1.25rem';
      case 'xlarge': return '1.5rem';
      default: return '1rem';
    }
  }
  
  function renderElementSettings(element: BuilderElement) {
    switch(element.type) {
      case 'hero':
        return (
          <div className="space-y-3">
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
            
            <div id={`${element.id}-colors`}>
              <h4 className="text-xs font-medium mt-4 mb-2">Colors</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`${element.id}-backgroundColor`} className="text-xs">Background</Label>
                  <div className="flex mt-1">
                    <input 
                      type="color" 
                      id={`${element.id}-backgroundColor`}
                      value={element.settings.backgroundColor || '#000000'} 
                      onChange={(e) => updateElementSettings(element.id, { backgroundColor: e.target.value })}
                      className="w-8 h-7 p-0 rounded-l-md border-r-0"
                    />
                    <Input
                      value={element.settings.backgroundColor || '#000000'}
                      onChange={(e) => updateElementSettings(element.id, { backgroundColor: e.target.value })}
                      className="h-7 text-sm rounded-l-none flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`${element.id}-textColor`} className="text-xs">Text</Label>
                  <div className="flex mt-1">
                    <input 
                      type="color" 
                      id={`${element.id}-textColor`}
                      value={element.settings.textColor || '#ffffff'} 
                      onChange={(e) => updateElementSettings(element.id, { textColor: e.target.value })}
                      className="w-8 h-7 p-0 rounded-l-md border-r-0"
                    />
                    <Input
                      value={element.settings.textColor || '#ffffff'}
                      onChange={(e) => updateElementSettings(element.id, { textColor: e.target.value })}
                      className="h-7 text-sm rounded-l-none flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`${element.id}-buttonColor`} className="text-xs">Button</Label>
                  <div className="flex mt-1">
                    <input 
                      type="color" 
                      id={`${element.id}-buttonColor`}
                      value={element.settings.buttonColor || '#3b82f6'} 
                      onChange={(e) => updateElementSettings(element.id, { buttonColor: e.target.value })}
                      className="w-8 h-7 p-0 rounded-l-md border-r-0"
                    />
                    <Input
                      value={element.settings.buttonColor || '#3b82f6'}
                      onChange={(e) => updateElementSettings(element.id, { buttonColor: e.target.value })}
                      className="h-7 text-sm rounded-l-none flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`${element.id}-buttonTextColor`} className="text-xs">Button Text</Label>
                  <div className="flex mt-1">
                    <input 
                      type="color" 
                      id={`${element.id}-buttonTextColor`}
                      value={element.settings.buttonTextColor || '#ffffff'} 
                      onChange={(e) => updateElementSettings(element.id, { buttonTextColor: e.target.value })}
                      className="w-8 h-7 p-0 rounded-l-md border-r-0"
                    />
                    <Input
                      value={element.settings.buttonTextColor || '#ffffff'}
                      onChange={(e) => updateElementSettings(element.id, { buttonTextColor: e.target.value })}
                      className="h-7 text-sm rounded-l-none flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'text':
        return (
          <div className="space-y-3">
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
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`${element.id}-alignment`} className="text-xs">Alignment</Label>
                <Select
                  value={element.settings.alignment || 'left'}
                  onValueChange={(value) => updateElementSettings(element.id, { alignment: value })}
                >
                  <SelectTrigger id={`${element.id}-alignment`} className="h-7 text-xs">
                    <SelectValue placeholder="Alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`${element.id}-fontSize`} className="text-xs">Font Size</Label>
                <Select
                  value={element.settings.fontSize || 'medium'}
                  onValueChange={(value) => updateElementSettings(element.id, { fontSize: value })}
                >
                  <SelectTrigger id={`${element.id}-fontSize`} className="h-7 text-xs">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="xlarge">X-Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div id={`${element.id}-colors`}>
              <h4 className="text-xs font-medium mt-2 mb-1">Colors</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`${element.id}-textColor`} className="text-xs">Text</Label>
                  <div className="flex mt-1">
                    <input 
                      type="color" 
                      id={`${element.id}-textColor`}
                      value={element.settings.textColor || '#000000'} 
                      onChange={(e) => updateElementSettings(element.id, { textColor: e.target.value })}
                      className="w-8 h-7 p-0 rounded-l-md border-r-0"
                    />
                    <Input
                      value={element.settings.textColor || '#000000'}
                      onChange={(e) => updateElementSettings(element.id, { textColor: e.target.value })}
                      className="h-7 text-sm rounded-l-none flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`${element.id}-backgroundColor`} className="text-xs">Background</Label>
                  <div className="flex mt-1">
                    <input 
                      type="color" 
                      id={`${element.id}-backgroundColor`}
                      value={element.settings.backgroundColor || '#ffffff'} 
                      onChange={(e) => updateElementSettings(element.id, { backgroundColor: e.target.value })}
                      className="w-8 h-7 p-0 rounded-l-md border-r-0"
                    />
                    <Input
                      value={element.settings.backgroundColor || '#ffffff'}
                      onChange={(e) => updateElementSettings(element.id, { backgroundColor: e.target.value })}
                      className="h-7 text-sm rounded-l-none flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      // Add other element type settings
      case 'cta':
        return (
          <div className="space-y-3">
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
            <div id={`${element.id}-colors`}>
              <h4 className="text-xs font-medium mt-2 mb-1">Colors</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`${element.id}-buttonColor`} className="text-xs">Button</Label>
                  <div className="flex mt-1">
                    <input 
                      type="color" 
                      id={`${element.id}-buttonColor`}
                      value={element.settings.buttonColor || '#3b82f6'} 
                      onChange={(e) => updateElementSettings(element.id, { buttonColor: e.target.value })}
                      className="w-8 h-7 p-0 rounded-l-md border-r-0"
                    />
                    <Input
                      value={element.settings.buttonColor || '#3b82f6'}
                      onChange={(e) => updateElementSettings(element.id, { buttonColor: e.target.value })}
                      className="h-7 text-sm rounded-l-none flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`${element.id}-buttonTextColor`} className="text-xs">Button Text</Label>
                  <div className="flex mt-1">
                    <input 
                      type="color" 
                      id={`${element.id}-buttonTextColor`}
                      value={element.settings.buttonTextColor || '#ffffff'} 
                      onChange={(e) => updateElementSettings(element.id, { buttonTextColor: e.target.value })}
                      className="w-8 h-7 p-0 rounded-l-md border-r-0"
                    />
                    <Input
                      value={element.settings.buttonTextColor || '#ffffff'}
                      onChange={(e) => updateElementSettings(element.id, { buttonTextColor: e.target.value })}
                      className="h-7 text-sm rounded-l-none flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center text-muted-foreground text-xs py-2">
            Basic settings for this element type
          </div>
        );
    }
  }
};
