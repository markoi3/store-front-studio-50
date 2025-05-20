
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
      image: product.image
    });
  };
  
  return (
    <div className="product-card flex flex-col">
      <Link to={`/product/${product.slug}`} className="group">
        <div className="aspect-square mb-3 bg-accent overflow-hidden rounded-md">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
        </div>
        <h3 className="font-medium line-clamp-1">{product.name}</h3>
        <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
      </Link>
      <div className="mt-auto pt-4">
        <Button onClick={handleAddToCart} className="w-full">
          Add to Cart
        </Button>
      </div>
    </div>
  );
};
