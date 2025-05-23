
import { HeroElement } from "./HeroElement";
import { ProductsElement } from "./ProductsElement";
import { TextElement } from "./TextElement";
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
    return null;
  }

  console.log("Rendering page elements:", elements);
  
  return (
    <div className="space-y-12">
      {elements.map((element) => (
        <div key={element.id}>
          {element.type === 'hero' && (
            <HeroElement element={element} onNavigate={onNavigate} />
          )}
          
          {element.type === 'products' && (
            <ProductsElement element={element} products={products} storeId={storeId} />
          )}
          
          {element.type === 'text' && (
            <TextElement element={element} />
          )}
        </div>
      ))}
    </div>
  );
};
