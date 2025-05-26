import { Link } from "react-router-dom";
import { useStore } from "@/hooks/useStore";

export const Footer = () => {
  const { store, getStoreUrl } = useStore();
  
  // Get store name or fallback to default
  const storeName = store?.name || "E-Shop";
  
  return (
    <footer className="bg-accent mt-auto py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{storeName}</h3>
            <p className="text-muted-foreground">
              Your one-stop shop for everything you need.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to={getStoreUrl("/shop")} className="text-muted-foreground hover:text-foreground">
                  All Products
                </Link>
              </li>
              <li>
                <Link to={getStoreUrl("/shop?category=new")} className="text-muted-foreground hover:text-foreground">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to={getStoreUrl("/shop?category=bestsellers")} className="text-muted-foreground hover:text-foreground">
                  Bestsellers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link to={getStoreUrl("/about")} className="text-muted-foreground hover:text-foreground">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to={getStoreUrl("/contact")} className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to={getStoreUrl("/terms")} className="text-muted-foreground hover:text-foreground">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to={getStoreUrl("/privacy")} className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
