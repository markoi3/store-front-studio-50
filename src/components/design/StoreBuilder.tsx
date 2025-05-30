import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Import the new components
import { PageBuilderCanvas } from "./PageBuilderCanvas";
import { ElementPalette } from "./ElementPalette";
import { PropertiesPanel } from "./PropertiesPanel";
import { CanvasToolbar } from "./CanvasToolbar";
import { ElementPopup } from "./ElementPopup";

type ElementType = 'hero' | 'products' | 'text' | 'image' | 'categories' | 'testimonials' | 'cta' | 'customHTML' | 'customCSS' | 'columns';

interface BuilderElement {
  id: string;
  type: ElementType;
  settings: Record<string, any>;
}

type PageType = 'homepage' | 'about' | 'contact' | 'legal' | 'custom';

interface LegalPageType {
  title: string;
  content: string;
}

interface LegalPagesType {
  privacy: LegalPageType;
  terms: LegalPageType;
  shipping: LegalPageType;
  [key: string]: LegalPageType;
}

export const StoreBuilder = () => {
  const { user, updateStoreSettings } = useAuth();
  const navigate = useNavigate();
  const [selectedPageType, setSelectedPageType] = useState<PageType>('homepage');
  const [selectedCustomPage, setSelectedCustomPage] = useState<string>('');
  const [selectedLegalPage, setSelectedLegalPage] = useState<string>('privacy');
  const [elements, setElements] = useState<BuilderElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<BuilderElement | null>(null);
  const [customPages, setCustomPages] = useState<Array<{id: string; title: string; slug: string; content: string; elements?: BuilderElement[]}>>([]);
  const [legalPages, setLegalPages] = useState<LegalPagesType>({
    privacy: { title: "Privacy Policy", content: "Your privacy policy content here..." },
    terms: { title: "Terms of Service", content: "Your terms of service content here..." },
    shipping: { title: "Shipping Policy", content: "Your shipping policy content here..." }
  });
  
  // UI State
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [elementPopup, setElementPopup] = useState<{
    isOpen: boolean;
    columnId: string;
    columnIndex: number;
    position: { x: number; y: number };
  } | null>(null);

  // Define handleShowElementPopup function before it's used
  const handleShowElementPopup = (columnId: string, columnIndex: number, position: { x: number; y: number }) => {
    setElementPopup({
      isOpen: true,
      columnId: columnId,
      columnIndex: columnIndex,
      position: position
    });
  };
  
  // Get page type and ID from URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const pageType = searchParams.get('pageType');
    const pageId = searchParams.get('pageId');
    
    if (pageType === 'custom' && pageId) {
      setSelectedPageType('custom');
      setSelectedCustomPage(pageId);
    }
  }, []);
  
  // Load existing store settings when component mounts
  useEffect(() => {
    if (user?.store?.settings) {
      loadPageElements();
    }
  }, [user?.store?.settings, selectedPageType, selectedCustomPage, selectedLegalPage]);

  const loadPageElements = () => {
    if (!user?.store?.settings) return;
    
    let elementsToLoad: BuilderElement[] = [];
    
    if (selectedPageType === 'homepage') {
      if (user.store.settings.pageElements && Array.isArray(user.store.settings.pageElements)) {
        elementsToLoad = [...user.store.settings.pageElements];
        console.log(`Loaded ${elementsToLoad.length} homepage elements`);
      }
    } 
    else if (selectedPageType === 'custom' && selectedCustomPage) {
      const customPage = user.store.settings.customPages?.find(page => page.id === selectedCustomPage);
      if (customPage?.elements && Array.isArray(customPage.elements)) {
        elementsToLoad = [...customPage.elements];
        console.log(`Loaded ${elementsToLoad.length} custom page elements for ${customPage.title}`);
      }
      
      if (user.store.settings.customPages && Array.isArray(user.store.settings.customPages)) {
        setCustomPages(user.store.settings.customPages);
      }
    }
    else if (selectedPageType === 'legal') {
      if (user.store.settings.legalPages) {
        setLegalPages(prevPages => ({
          ...prevPages,
          ...user.store.settings.legalPages
        }));
      }
    }
    
    setElements(elementsToLoad);
    setSelectedElement(null); // Clear selection when switching pages
    
    if (user.store.settings.customPages && Array.isArray(user.store.settings.customPages)) {
      setCustomPages(user.store.settings.customPages);
    }
    
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
        title: 'Welcome to Our Store',
        subtitle: 'Discover amazing products and services',
        buttonText: 'Shop Now',
        buttonLink: '/shop',
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
        title: 'Featured Products',
        count: 4,
        layout: 'grid',
        backgroundColor: '#ffffff',
        textColor: '#000000'
      }
    },
    text: {
      type: 'text',
      settings: {
        content: 'Add your text content here. You can use this space to describe your products, services, or share your story.',
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
        alt: 'Beautiful image',
        width: '100%',
        height: 'auto',
        borderRadius: '8px'
      }
    },
    columns: {
      type: 'columns',
      settings: {
        columnCount: 2,
        gap: 'medium',
        children: []
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
    },
    customHTML: {
      type: 'customHTML',
      settings: {
        content: '<div class="text-center p-4"><h3>Custom HTML Content</h3><p>Add your custom HTML here...</p></div>'
      }
    },
    customCSS: {
      type: 'customCSS',
      settings: {
        content: '<style>\n.custom-element {\n  color: #3b82f6;\n  font-weight: bold;\n}\n</style>'
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
      setSelectedElement(newElement); // Auto-select new element
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

  const addElementToColumn = (columnElementId: string, columnIndex: number, elementType: ElementType) => {
    try {
      const newElement = {
        id: `element-${Date.now()}`,
        ...elementTemplates[elementType],
        parentId: columnElementId,
        columnIndex: columnIndex
      };

      // Update the column element to include this child element
      setElements(prevElements => {
        return prevElements.map(element => {
          if (element.id === columnElementId && element.type === 'columns') {
            const updatedChildren = [...(element.settings.children || []), newElement];
            return {
              ...element,
              settings: {
                ...element.settings,
                children: updatedChildren
              }
            };
          }
          return element;
        });
      });

      // Close popup
      setElementPopup(null);

      toast.success("Element added to column", {
        description: `Added ${elementType} element to column ${columnIndex + 1}.`
      });
    } catch (error) {
      console.error("Error adding element to column:", error);
      toast.error("Failed to add element to column");
    }
  };

  const removeElement = (id: string) => {
    try {
      setElements(elements.filter(el => el.id !== id));
      if (selectedElement?.id === id) {
        setSelectedElement(null);
      }
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
      
      // Update selected element if it's the one being updated
      if (selectedElement?.id === id) {
        setSelectedElement({ ...selectedElement, settings: { ...selectedElement.settings, ...settings } });
      }
    } catch (error) {
      console.error("Error updating element settings:", error);
      toast.error("Failed to update element settings");
    }
  };

  // Handle element selection with proper typing
  const handleSelectElement = (element: BuilderElement | null) => {
    setSelectedElement(element);
  };

  const saveChanges = async () => {
    try {
      if (!user?.store) {
        toast.error("No store found");
        return;
      }
      
      let updatedSettings = { ...user.store.settings || {} };
      
      if (selectedPageType === 'homepage') {
        updatedSettings.pageElements = elements;
        console.log(`Saving ${elements.length} homepage elements`);
      }
      else if (selectedPageType === 'custom' && selectedCustomPage) {
        const currentCustomPages = [...(updatedSettings.customPages || [])];
        const pageIndex = currentCustomPages.findIndex(page => page.id === selectedCustomPage);
        
        if (pageIndex >= 0) {
          currentCustomPages[pageIndex] = {
            ...currentCustomPages[pageIndex],
            elements: elements
          };
          updatedSettings.customPages = currentCustomPages;
          console.log(`Saving ${elements.length} elements for custom page: ${currentCustomPages[pageIndex].title}`);
        }
      }
      else if (selectedPageType === 'legal') {
        updatedSettings.legalPages = legalPages;
      }
      
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

  // Get canvas width based on device
  const getCanvasWidth = () => {
    switch (device) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
      default: return '100%';
    }
  };
  
  const renderPageSelector = () => {
    return (
      <div className="border-b bg-background px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
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
                onValueChange={(value) => setSelectedLegalPage(value)}
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
      </div>
    );
  };

  // Legal page editor
  if (selectedPageType === 'legal') {
    return (
      <div className="h-full flex flex-col">
        {renderPageSelector()}
        <div className="flex-1 p-6">
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
                <Button onClick={saveChanges}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Custom page not selected or doesn't exist
  if (selectedPageType === 'custom' && (!selectedCustomPage || !customPages.length)) {
    return (
      <div className="h-full flex flex-col">
        {renderPageSelector()}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-12 border border-dashed rounded-lg max-w-md">
            <p className="text-muted-foreground mb-4">
              {customPages.length
                ? "Select a custom page to edit"
                : "No custom pages created yet. Please create a custom page first."}
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/design?tab=custom")}
            >
              Go to Custom Pages
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main page builder interface
  return (
    <div className="h-full flex flex-col">
      {renderPageSelector()}
      
      <CanvasToolbar
        previewMode={previewMode}
        onTogglePreview={() => setPreviewMode(!previewMode)}
        zoom={zoom}
        onZoomChange={setZoom}
        device={device}
        onDeviceChange={setDevice}
        onSave={saveChanges}
      />
      
      <div className="flex-1 flex h-0">
        {/* Left Sidebar - Element Palette - Reduced padding */}
        <div className="w-72 border-r bg-background overflow-auto flex-shrink-0">
          <ElementPalette onAddElement={addElement} />
        </div>
        
        {/* Center - Canvas - Reduced left padding */}
        <div 
          className="flex-1 flex flex-col bg-accent/20 overflow-hidden pl-4"
          style={{ 
            width: getCanvasWidth(),
            maxWidth: getCanvasWidth(),
            margin: device !== 'desktop' ? '0 auto' : undefined
          }}
        >
          <PageBuilderCanvas
            elements={elements}
            onDragEnd={handleDragEnd}
            onRemoveElement={removeElement}
            onSelectElement={handleSelectElement}
            selectedElement={selectedElement}
            previewMode={previewMode}
            zoom={zoom}
            onShowElementPopup={handleShowElementPopup}
          />
        </div>
        
        {/* Right Sidebar - Properties Panel */}
        <div className="w-72 border-l bg-background overflow-auto flex-shrink-0">
          <PropertiesPanel
            selectedElement={selectedElement}
            onUpdateElement={updateElementSettings}
          />
        </div>
      </div>

      {/* Element Popup */}
      {elementPopup && (
        <ElementPopup
          isOpen={elementPopup.isOpen}
          position={elementPopup.position}
          onClose={() => setElementPopup(null)}
          onSelectElement={(elementType) => 
            addElementToColumn(elementPopup.columnId, elementPopup.columnIndex, elementType)
          }
        />
      )}
    </div>
  );
};
