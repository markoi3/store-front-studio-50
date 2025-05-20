
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-bold text-xl">
          E-Shop
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1">
          <Link to="/shop" className="nav-link">
            Shop
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </div>
          )}

          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
            <Link
              to="/shop"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
