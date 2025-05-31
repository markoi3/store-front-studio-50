import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Crown, // zamenio Hero sa Crown
  ShoppingBag, 
  Type, 
  Image as ImageIcon, 
  Grid3X3, 
  MessageSquare, 
  Megaphone, 
  Code, 
  Columns3,
  X
} from "lucide-react";

type ElementType = 'hero' | 'products' | 'text' | 'image' | 'categories' | 'testimonials' | 'cta' | 'customHTML' | 'customCSS' | 'columns';

interface ElementPopupProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onSelectElement: (elementType: ElementType) => void;
}

export const ElementPopup: React.FC<ElementPopupProps> = ({
  isOpen,
  position,
  onClose,
  onSelectElement
}) => {
  if (!isOpen) return null;

  const elements = [
    { type: 'hero' as ElementType, label: 'Hero Section', icon: Crown, description: 'Large banner with title and CTA' }, // koristim Crown umesto Hero
    { type: 'products' as ElementType, label: 'Products', icon: ShoppingBag, description: 'Display featured products' },
    { type: 'text' as ElementType, label: 'Text Block', icon: Type, description: 'Rich text content' },
    { type: 'image' as ElementType, label: 'Image', icon: ImageIcon, description: 'Single image element' },
    { type: 'columns' as ElementType, label: 'Columns', icon: Columns3, description: 'Multi-column layout' },
    { type: 'categories' as ElementType, label: 'Categories', icon: Grid3X3, description: 'Product categories grid' },
    { type: 'testimonials' as ElementType, label: 'Testimonials', icon: MessageSquare, description: 'Customer reviews' },
    { type: 'cta' as ElementType, label: 'Call to Action', icon: Megaphone, description: 'Action button with text' },
    { type: 'customHTML' as ElementType, label: 'Custom HTML', icon: Code, description: 'Custom HTML content' },
    { type: 'customCSS' as ElementType, label: 'Custom CSS', icon: Code, description: 'Custom styling' }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div 
        className="fixed z-50 bg-white border border-border rounded-lg shadow-lg w-80 max-h-96 overflow-y-auto"
        style={{
          left: Math.min(position.x, window.innerWidth - 320),
          top: Math.min(position.y, window.innerHeight - 400)
        }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-sm font-medium">Add Element</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-2">
          {elements.map((element) => {
            const IconComponent = element.icon;
            return (
              <Button
                key={element.type}
                variant="ghost"
                className="w-full justify-start p-3 h-auto"
                onClick={() => onSelectElement(element.type)}
              >
                <div className="flex items-start gap-3">
                  <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium text-sm">{element.label}</div>
                    <div className="text-xs text-muted-foreground">{element.description}</div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};
