
import React from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { GripVertical, X, Eye, EyeOff, Plus } from "lucide-react";

interface BuilderElement {
  id: string;
  type: string;
  settings: Record<string, any>;
}

interface PageBuilderCanvasProps {
  elements: BuilderElement[];
  onDragEnd: (result: any) => void;
  onRemoveElement: (id: string) => void;
  onSelectElement: (element: BuilderElement | null) => void;
  selectedElement: BuilderElement | null;
  previewMode: boolean;
  zoom: number;
  onShowElementPopup?: (columnId: string, columnIndex: number, position: { x: number; y: number }) => void;
}

export const PageBuilderCanvas: React.FC<PageBuilderCanvasProps> = ({
  elements,
  onDragEnd,
  onRemoveElement,
  onSelectElement,
  selectedElement,
  previewMode,
  zoom,
  onShowElementPopup
}) => {
  const getFontSize = (size: string) => {
    switch(size) {
      case 'small': return '0.875rem';
      case 'medium': return '1rem';
      case 'large': return '1.25rem';
      case 'xlarge': return '1.5rem';
      default: return '1rem';
    }
  };

  const showElementPopup = (columnElementId: string, columnIndex: number, event: React.MouseEvent) => {
    if (onShowElementPopup) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      onShowElementPopup(columnElementId, columnIndex, {
        x: rect.left,
        y: rect.bottom + 5
      });
    }
  };

  const renderElementPreview = (element: BuilderElement) => {
    const isSelected = selectedElement?.id === element.id;
    
    switch(element.type) {
      case 'hero':
        return (
          <div className="relative h-40 overflow-hidden rounded-md mb-2">
            <img 
              src={element.settings.backgroundImage || 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop'} 
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
              <h2 className="font-bold text-xl">{element.settings.title || 'Hero Title'}</h2>
              <p className="text-sm mb-2">{element.settings.subtitle || 'Hero subtitle'}</p>
              <Button 
                size="sm" 
                variant="secondary"
                style={{
                  backgroundColor: element.settings.buttonColor || '#3b82f6',
                  color: element.settings.buttonTextColor || '#ffffff'
                }}
              >
                {element.settings.buttonText || 'Call to Action'}
              </Button>
            </div>
          </div>
        );
        
      case 'products':
        return (
          <div>
            <h3 className="font-medium mb-2">{element.settings.title || 'Products'}</h3>
            <div className="grid grid-cols-2 gap-2">
              {Array(Math.min(element.settings.count || 4, 4)).fill(0).map((_, i) => (
                <div key={i} className="aspect-square bg-accent rounded-md"></div>
              ))}
            </div>
          </div>
        );
        
      case 'text':
        return (
          <div className={`text-${element.settings.alignment || 'left'}`}>
            <p style={{fontSize: getFontSize(element.settings.fontSize || 'medium')}}>
              {element.settings.content || 'Text content goes here...'}
            </p>
          </div>
        );
        
      case 'image':
        return (
          <div>
            <img 
              src={element.settings.src || 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop'} 
              alt={element.settings.alt || 'Image'} 
              className="max-w-full" 
              style={{
                borderRadius: element.settings.borderRadius || '4px',
                width: element.settings.width || '100%',
                height: element.settings.height || 'auto'
              }}
            />
          </div>
        );
        
      case 'columns':
        const columnCount = element.settings.columnCount || 2;
        const children = element.settings.children || [];
        
        return (
          <div>
            <h3 className="font-medium mb-2">Column Layout ({columnCount} columns)</h3>
            <div 
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${columnCount}, 1fr)`
              }}
            >
              {Array(columnCount).fill(0).map((_, i) => {
                const columnChildren = children.filter((child: any) => child.columnIndex === i);
                
                return (
                  <div 
                    key={i} 
                    className="min-h-[80px] bg-accent/20 rounded-md border-2 border-dashed border-accent/60 p-2 relative group"
                  >
                    {!previewMode && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          showElementPopup(element.id, i, e);
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                    
                    {columnChildren.length > 0 ? (
                      <div className="space-y-2">
                        {columnChildren.map((child: any, childIndex: number) => (
                          <div key={childIndex} className="text-xs text-muted-foreground bg-background/50 p-2 rounded">
                            {child.type} element
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                        Column {i + 1}
                        {!previewMode && (
                          <span className="block text-xs mt-1">Click + to add element</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
        
      case 'categories':
        return (
          <div>
            <h3 className="font-medium mb-2">{element.settings.title || 'Categories'}</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square bg-accent rounded-md"></div>
              <div className="aspect-square bg-accent rounded-md"></div>
              <div className="aspect-square bg-accent rounded-md"></div>
            </div>
          </div>
        );
        
      case 'testimonials':
        return (
          <div>
            <h3 className="font-medium mb-2">{element.settings.title || 'Testimonials'}</h3>
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
        );
        
      case 'cta':
        return (
          <div className="text-center py-2">
            <h3 className="font-medium mb-2">{element.settings.title || 'Call to Action'}</h3>
            <Button 
              size="sm"
              style={{
                backgroundColor: element.settings.buttonColor || '#3b82f6',
                color: element.settings.buttonTextColor || '#ffffff'
              }}
            >
              {element.settings.buttonText || 'Get Started'}
            </Button>
          </div>
        );
        
      case 'customHTML':
        return (
          <div className="text-center py-2 bg-accent/20 border border-dashed rounded">
            <div className="text-xs text-muted-foreground mb-1">Custom HTML</div>
            <div className="text-sm" dangerouslySetInnerHTML={{ __html: element.settings.content || '<p>Custom HTML content</p>' }} />
          </div>
        );
        
      case 'customCSS':
        return (
          <div className="text-center py-2 bg-accent/20 border border-dashed rounded">
            <div className="text-xs text-muted-foreground mb-1">Custom CSS</div>
            <div className="text-sm font-mono">{element.settings.content || '/* Custom CSS */'}</div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-4 bg-accent/20 border border-dashed rounded">
            <p className="text-sm text-muted-foreground">Unknown element type: {element.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 bg-white border rounded-lg overflow-hidden h-full">
      <div className="bg-accent/30 border-b px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-medium">Canvas Preview</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
          {previewMode ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
      
      <div 
        className="p-4 h-full overflow-auto"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="canvas-elements">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-4 min-h-[400px] ${
                  snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-blue-200 border-dashed' : ''
                }`}
              >
                {elements.map((element, index) => (
                  <Draggable 
                    key={element.id} 
                    draggableId={element.id} 
                    index={index} 
                    isDragDisabled={previewMode}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`
                          relative border rounded-lg p-4 bg-card cursor-pointer transition-all group
                          ${selectedElement?.id === element.id ? 'ring-2 ring-blue-500 border-blue-500' : 'border-border hover:border-blue-300'}
                          ${snapshot.isDragging ? 'shadow-lg rotate-2' : ''}
                          ${previewMode ? 'border-transparent' : ''}
                        `}
                        style={{
                          backgroundColor: element.settings.backgroundColor || 'transparent',
                          color: element.settings.textColor || 'inherit',
                          ...provided.draggableProps.style
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!previewMode) {
                            onSelectElement(element);
                          }
                        }}
                      >
                        {!previewMode && (
                          <div className="absolute right-2 top-2 flex space-x-1 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
                            <button 
                              className="p-1 rounded-sm bg-red-100 hover:bg-red-200 text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveElement(element.id);
                              }}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                            <div 
                              {...provided.dragHandleProps} 
                              className="p-1 rounded-sm bg-accent hover:bg-accent/80 cursor-move"
                            >
                              <GripVertical className="h-3.5 w-3.5" />
                            </div>
                          </div>
                        )}
                        
                        {renderElementPreview(element)}
                        
                        {!previewMode && selectedElement?.id === element.id && (
                          <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-lg pointer-events-none" />
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                
                {elements.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-accent rounded-lg">
                    <p className="text-muted-foreground">Drag elements here to start building your page</p>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};
