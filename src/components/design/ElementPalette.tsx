
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Type, 
  Image, 
  Layers, 
  Grid3X3, 
  Star, 
  MessageSquare, 
  MousePointer, 
  Code, 
  Palette,
  Columns,
  Package
} from "lucide-react";

type ElementType = 'hero' | 'products' | 'text' | 'image' | 'categories' | 'testimonials' | 'cta' | 'customHTML' | 'customCSS' | 'columns';

interface ElementPaletteProps {
  onAddElement: (type: ElementType) => void;
}

export const ElementPalette: React.FC<ElementPaletteProps> = ({ onAddElement }) => {
  const elementCategories = [
    {
      title: "Layout",
      elements: [
        { type: 'hero' as const, label: 'Hero Section', icon: Layers, description: 'Large banner with title and CTA' },
        { type: 'columns' as const, label: 'Columns', icon: Columns, description: 'Multi-column layout' },
      ]
    },
    {
      title: "Content",
      elements: [
        { type: 'text' as const, label: 'Text Block', icon: Type, description: 'Rich text content' },
        { type: 'image' as const, label: 'Image', icon: Image, description: 'Single image element' },
        { type: 'products' as const, label: 'Products', icon: Package, description: 'Product showcase grid' },
        { type: 'categories' as const, label: 'Categories', icon: Grid3X3, description: 'Category grid display' },
      ]
    },
    {
      title: "Interactive",
      elements: [
        { type: 'cta' as const, label: 'Call to Action', icon: MousePointer, description: 'Button with call to action' },
        { type: 'testimonials' as const, label: 'Testimonials', icon: MessageSquare, description: 'Customer reviews' },
      ]
    },
    {
      title: "Advanced",
      elements: [
        { type: 'customHTML' as const, label: 'Custom HTML', icon: Code, description: 'Custom HTML content' },
        { type: 'customCSS' as const, label: 'Custom CSS', icon: Palette, description: 'Custom styling' },
      ]
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Elements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
        {elementCategories.map((category, categoryIndex) => (
          <div key={category.title}>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {category.title}
            </h3>
            <div className="space-y-2">
              {category.elements.map((element) => {
                const IconComponent = element.icon;
                return (
                  <Button
                    key={element.type}
                    variant="outline"
                    className="w-full justify-start h-auto p-3 text-left"
                    onClick={() => onAddElement(element.type)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <IconComponent className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{element.label}</div>
                        <div className="text-xs text-muted-foreground">{element.description}</div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
            {categoryIndex < elementCategories.length - 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
