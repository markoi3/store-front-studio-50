
import { HeroElement } from "./HeroElement";
import { ProductsElement } from "./ProductsElement";
import { TextElement } from "./TextElement";
import { CTAElement } from "./CTAElement";
import { ImageElement } from "./ImageElement";
import { CustomHtmlElement } from "./CustomHtmlElement";
import { CustomCssElement } from "./CustomCssElement";
import { Product } from "@/components/shop/ProductCard";

interface PageElementRendererProps {
  elements: any[];
  products: Product[];
  storeId: string;
  onNavigate: (path: string) => void;
}

export const PageElementRenderer = ({ elements, products, storeId, onNavigate }: PageElementRendererProps) => {
  if (!elements || !Array.isArray(elements) || elements.length === 0) {
    console.log("No page elements to render");
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No content available. Please add some elements to your page.</p>
      </div>
    );
  }

  console.log("PageElementRenderer - elements:", elements);
  console.log("PageElementRenderer - products:", products);
  console.log("PageElementRenderer - storeId:", storeId);
  
  return (
    <div className="space-y-12 store-content">
      {elements.map((element) => {
        console.log("Rendering element type:", element.type);
        
        return (
          <div key={element.id}>
            {element.type === 'hero' && (
              <HeroElement element={element} onNavigate={onNavigate} />
            )}
            
            {element.type === 'products' && (
              <ProductsElement 
                element={element} 
                products={products} 
                storeId={storeId} 
              />
            )}
            
            {element.type === 'text' && (
              <TextElement element={element} />
            )}

            {element.type === 'cta' && (
              <CTAElement element={element} onNavigate={onNavigate} />
            )}
            
            {element.type === 'image' && (
              <ImageElement element={element} />
            )}
            
            {element.type === 'columns' && (
              <div className="container mx-auto px-4">
                <div 
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: `repeat(${element.settings.columnCount || 2}, 1fr)`
                  }}
                >
                  {Array(element.settings.columnCount || 2).fill(0).map((_, columnIndex) => {
                    const columnChildren = (element.settings.children || []).filter(
                      (child: any) => child.columnIndex === columnIndex
                    );
                    
                    return (
                      <div key={columnIndex} className="space-y-6">
                        {columnChildren.map((child: any, childIndex: number) => (
                          <div key={childIndex}>
                            {child.type === 'text' && <TextElement element={child} />}
                            {child.type === 'image' && <ImageElement element={child} />}
                            {child.type === 'cta' && <CTAElement element={child} onNavigate={onNavigate} />}
                            {child.type === 'customHTML' && <CustomHtmlElement element={child} />}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {element.type === 'customHTML' && (
              <CustomHtmlElement element={element} />
            )}
            
            {element.type === 'customCSS' && (
              <CustomCssElement element={element} />
            )}
          </div>
        );
      })}
    </div>
  );
};
