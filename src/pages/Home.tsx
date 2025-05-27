
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ProductCard, Product } from "@/components/shop/ProductCard";

// Sample featured products data
const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Minimalist Coffee Table",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "minimalist-coffee-table",
    category: "furniture"
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "ergonomic-office-chair",
    category: "furniture"
  },
  {
    id: "3",
    name: "Ceramic Mug Set",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "ceramic-mug-set",
    category: "kitchen"
  },
  {
    id: "4",
    name: "Modern Floor Lamp",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1543198126-1c7d9e6d4f3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    slug: "modern-floor-lamp",
    category: "lighting"
  }
];

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Modern Essentials for Your Home</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Discover our curated collection of minimalist home goods and accessories.
            </p>
            <Link to="/shop">
              <Button size="lg" className="font-medium px-8">Shop Now</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Shop by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/shop?category=furniture" className="group relative block aspect-square overflow-hidden rounded-lg bg-card">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                alt="Furniture"
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="text-white text-2xl font-bold">Furniture</span>
              </div>
            </Link>
            
            <Link to="/shop?category=kitchen" className="group relative block aspect-square overflow-hidden rounded-lg bg-card">
              <img
                src="https://images.unsplash.com/photo-1631981767639-032d5d499659?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                alt="Kitchen"
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="text-white text-2xl font-bold">Kitchen</span>
              </div>
            </Link>
            
            <Link to="/shop?category=lighting" className="group relative block aspect-square overflow-hidden rounded-lg bg-card">
              <img
                src="https://images.unsplash.com/photo-1592280771190-3e2e4d977758?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                alt="Lighting"
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="text-white text-2xl font-bold">Lighting</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="text-muted-foreground mb-6">
              Sign up to receive updates on new products and special promotions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="input-field flex-1"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
