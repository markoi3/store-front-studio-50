
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  category: string;
  storeId?: string; // Dodajemo storeId za asocijaciju sa prodavnicom
};

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      // Ovde ćemo dodeliti storeId samo ako postoji, a ne kao obavezno polje
      ...(product.storeId && { storeId: product.storeId })
    });
  };
  
  // Konstruišemo link na osnovu storeId-a ako postoji
  const productLink = product.storeId 
    ? `/store/${product.storeId}/product/${product.slug}` 
    : `/product/${product.slug}`;
  
  return (
    <div className="product-card flex flex-col">
      <Link to={productLink} className="group">
        <div className="aspect-square mb-3 bg-accent overflow-hidden rounded-md">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
        </div>
        <h3 className="font-medium line-clamp-1">{product.name}</h3>
        <p className="text-muted-foreground font-numeric">{product.price.toLocaleString('sr-RS')} RSD</p>
      </Link>
      <div className="mt-auto pt-4">
        <Button onClick={handleAddToCart} className="w-full">
          Dodaj u korpu
        </Button>
      </div>
    </div>
  );
};
