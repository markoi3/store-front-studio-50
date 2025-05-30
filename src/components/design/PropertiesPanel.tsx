
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Palette } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BuilderElement {
  id: string;
  type: string;
  settings: Record<string, any>;
}

interface PropertiesPanelProps {
  selectedElement: BuilderElement | null;
  onUpdateElement: (id: string, settings: Record<string, any>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onUpdateElement
}) => {
  if (!selectedElement) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-center">
            Select an element to edit its properties
          </p>
        </CardContent>
      </Card>
    );
  }

  const updateSettings = (newSettings: Record<string, any>) => {
    onUpdateElement(selectedElement.id, newSettings);
  };

  const renderElementProperties = () => {
    switch (selectedElement.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={selectedElement.settings.title || ''}
                onChange={(e) => updateSettings({ title: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input
                id="hero-subtitle"
                value={selectedElement.settings.subtitle || ''}
                onChange={(e) => updateSettings({ subtitle: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="hero-buttonText">Button Text</Label>
              <Input
                id="hero-buttonText"
                value={selectedElement.settings.buttonText || ''}
                onChange={(e) => updateSettings({ buttonText: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="hero-buttonLink">Button Link</Label>
              <Input
                id="hero-buttonLink"
                value={selectedElement.settings.buttonLink || ''}
                onChange={(e) => updateSettings({ buttonLink: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="hero-backgroundImage">Background Image URL</Label>
              <Input
                id="hero-backgroundImage"
                value={selectedElement.settings.backgroundImage || ''}
                onChange={(e) => updateSettings({ backgroundImage: e.target.value })}
              />
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Colors
              </h4>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="hero-backgroundColor">Background Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input 
                      type="color" 
                      id="hero-backgroundColor"
                      value={selectedElement.settings.backgroundColor || '#000000'} 
                      onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                      className="w-12 h-9 rounded border"
                    />
                    <Input
                      value={selectedElement.settings.backgroundColor || '#000000'}
                      onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="hero-textColor">Text Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input 
                      type="color" 
                      id="hero-textColor"
                      value={selectedElement.settings.textColor || '#ffffff'} 
                      onChange={(e) => updateSettings({ textColor: e.target.value })}
                      className="w-12 h-9 rounded border"
                    />
                    <Input
                      value={selectedElement.settings.textColor || '#ffffff'}
                      onChange={(e) => updateSettings({ textColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="hero-buttonColor">Button Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input 
                      type="color" 
                      id="hero-buttonColor"
                      value={selectedElement.settings.buttonColor || '#3b82f6'} 
                      onChange={(e) => updateSettings({ buttonColor: e.target.value })}
                      className="w-12 h-9 rounded border"
                    />
                    <Input
                      value={selectedElement.settings.buttonColor || '#3b82f6'}
                      onChange={(e) => updateSettings({ buttonColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="hero-buttonTextColor">Button Text Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input 
                      type="color" 
                      id="hero-buttonTextColor"
                      value={selectedElement.settings.buttonTextColor || '#ffffff'} 
                      onChange={(e) => updateSettings({ buttonTextColor: e.target.value })}
                      className="w-12 h-9 rounded border"
                    />
                    <Input
                      value={selectedElement.settings.buttonTextColor || '#ffffff'}
                      onChange={(e) => updateSettings({ buttonTextColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-content">Content</Label>
              <Textarea
                id="text-content"
                value={selectedElement.settings.content || ''}
                onChange={(e) => updateSettings({ content: e.target.value })}
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="text-alignment">Alignment</Label>
              <Select
                value={selectedElement.settings.alignment || 'left'}
                onValueChange={(value) => updateSettings({ alignment: value })}
              >
                <SelectTrigger id="text-alignment">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="text-fontSize">Font Size</Label>
              <Select
                value={selectedElement.settings.fontSize || 'medium'}
                onValueChange={(value) => updateSettings({ fontSize: value })}
              >
                <SelectTrigger id="text-fontSize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="xlarge">X-Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Colors
              </h4>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="text-textColor">Text Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input 
                      type="color" 
                      id="text-textColor"
                      value={selectedElement.settings.textColor || '#000000'} 
                      onChange={(e) => updateSettings({ textColor: e.target.value })}
                      className="w-12 h-9 rounded border"
                    />
                    <Input
                      value={selectedElement.settings.textColor || '#000000'}
                      onChange={(e) => updateSettings({ textColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="text-backgroundColor">Background Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input 
                      type="color" 
                      id="text-backgroundColor"
                      value={selectedElement.settings.backgroundColor || '#ffffff'} 
                      onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                      className="w-12 h-9 rounded border"
                    />
                    <Input
                      value={selectedElement.settings.backgroundColor || '#ffffff'}
                      onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-src">Image URL</Label>
              <Input
                id="image-src"
                value={selectedElement.settings.src || ''}
                onChange={(e) => updateSettings({ src: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                value={selectedElement.settings.alt || ''}
                onChange={(e) => updateSettings({ alt: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="image-width">Width</Label>
                <Input
                  id="image-width"
                  value={selectedElement.settings.width || '100%'}
                  onChange={(e) => updateSettings({ width: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="image-height">Height</Label>
                <Input
                  id="image-height"
                  value={selectedElement.settings.height || 'auto'}
                  onChange={(e) => updateSettings({ height: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="image-borderRadius">Border Radius</Label>
              <Input
                id="image-borderRadius"
                value={selectedElement.settings.borderRadius || '4px'}
                onChange={(e) => updateSettings({ borderRadius: e.target.value })}
              />
            </div>
          </div>
        );
        
      case 'columns':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="columns-count">Number of Columns</Label>
              <Select
                value={String(selectedElement.settings.columnCount || 2)}
                onValueChange={(value) => updateSettings({ columnCount: parseInt(value) })}
              >
                <SelectTrigger id="columns-count">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Column</SelectItem>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="columns-gap">Gap Size</Label>
              <Select
                value={selectedElement.settings.gap || 'medium'}
                onValueChange={(value) => updateSettings({ gap: value })}
              >
                <SelectTrigger id="columns-gap">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'products':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="products-title">Title</Label>
              <Input
                id="products-title"
                value={selectedElement.settings.title || ''}
                onChange={(e) => updateSettings({ title: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="products-count">Number of Products</Label>
              <Select
                value={String(selectedElement.settings.count || 4)}
                onValueChange={(value) => updateSettings({ count: parseInt(value) })}
              >
                <SelectTrigger id="products-count">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Products</SelectItem>
                  <SelectItem value="4">4 Products</SelectItem>
                  <SelectItem value="6">6 Products</SelectItem>
                  <SelectItem value="8">8 Products</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="products-layout">Layout</Label>
              <Select
                value={selectedElement.settings.layout || 'grid'}
                onValueChange={(value) => updateSettings({ layout: value })}
              >
                <SelectTrigger id="products-layout">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'cta':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cta-title">Title</Label>
              <Input
                id="cta-title"
                value={selectedElement.settings.title || ''}
                onChange={(e) => updateSettings({ title: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="cta-buttonText">Button Text</Label>
              <Input
                id="cta-buttonText"
                value={selectedElement.settings.buttonText || ''}
                onChange={(e) => updateSettings({ buttonText: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="cta-buttonLink">Button Link</Label>
              <Input
                id="cta-buttonLink"
                value={selectedElement.settings.buttonLink || ''}
                onChange={(e) => updateSettings({ buttonLink: e.target.value })}
              />
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Colors
              </h4>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cta-buttonColor">Button Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input 
                      type="color" 
                      id="cta-buttonColor"
                      value={selectedElement.settings.buttonColor || '#3b82f6'} 
                      onChange={(e) => updateSettings({ buttonColor: e.target.value })}
                      className="w-12 h-9 rounded border"
                    />
                    <Input
                      value={selectedElement.settings.buttonColor || '#3b82f6'}
                      onChange={(e) => updateSettings({ buttonColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="cta-buttonTextColor">Button Text Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input 
                      type="color" 
                      id="cta-buttonTextColor"
                      value={selectedElement.settings.buttonTextColor || '#ffffff'} 
                      onChange={(e) => updateSettings({ buttonTextColor: e.target.value })}
                      className="w-12 h-9 rounded border"
                    />
                    <Input
                      value={selectedElement.settings.buttonTextColor || '#ffffff'}
                      onChange={(e) => updateSettings({ buttonTextColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'customHTML':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="customHTML-content">HTML Content</Label>
              <Textarea
                id="customHTML-content"
                value={selectedElement.settings.content || ''}
                onChange={(e) => updateSettings({ content: e.target.value })}
                rows={6}
                className="font-mono text-sm"
              />
            </div>
          </div>
        );
        
      case 'customCSS':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="customCSS-content">CSS Content</Label>
              <Textarea
                id="customCSS-content"
                value={selectedElement.settings.content || ''}
                onChange={(e) => updateSettings({ content: e.target.value })}
                rows={6}
                className="font-mono text-sm"
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No properties available for this element type
            </p>
          </div>
        );
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Properties
        </CardTitle>
        <p className="text-sm text-muted-foreground capitalize">
          {selectedElement.type} Element
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderElementProperties()}
      </CardContent>
    </Card>
  );
};
