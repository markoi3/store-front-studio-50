
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type StoreInfo = {
  id: string;
  name: string;
  slug: string;
  settings?: {
    privacyPolicy?: string;
    aboutUs?: string;
    contactInfo?: string;
    menuItems?: any[];
    storeSlug?: string; // Add store slug to settings
    [key: string]: any;
  };
};

type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer";
  store?: StoreInfo;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateStoreSettings: (settings: any) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock authentication - this would be replaced with a real API call
      const mockUser: User = {
        id: "1",
        email,
        name: "Shop Owner",
        role: "admin",
        store: {
          id: "store-1",
          name: "Demo Prodavnica",
          slug: "demo-prodavnica",
          settings: {
            privacyPolicy: "Ovo je privacy policy text",
            aboutUs: "Ovo je about us text",
            contactInfo: "Ovo je contact info text",
            storeSlug: "demo-prodavnica", // Add store slug to settings
            menuItems: [
              { id: "1", label: "Početna", url: "/" },
              { id: "2", label: "Proizvodi", url: "/shop" },
              { id: "3", label: "O nama", url: "/about" },
              { id: "4", label: "Kontakt", url: "/contact" }
            ]
          }
        }
      };
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Also store products with proper association to this user
      const existingProducts = localStorage.getItem("products");
      if (!existingProducts) {
        // Create some default products for this store
        const defaultProducts = [
          {
            id: `product-${Date.now()}-1`,
            name: "Demo Product 1",
            price: 19.99,
            description: "This is a demo product",
            category: "furniture",
            stock: 10,
            slug: "demo-product-1",
            published: true,
            image: "https://via.placeholder.com/300",
            images: ["https://via.placeholder.com/300"],
            userId: "1",
            storeId: "store-1",
            storeSlug: "demo-prodavnica",
            createdAt: new Date().toISOString()
          },
          {
            id: `product-${Date.now()}-2`,
            name: "Demo Product 2",
            price: 29.99,
            description: "This is another demo product",
            category: "lighting",
            stock: 5,
            slug: "demo-product-2",
            published: true,
            image: "https://via.placeholder.com/300",
            images: ["https://via.placeholder.com/300"],
            userId: "1",
            storeId: "store-1",
            storeSlug: "demo-prodavnica",
            createdAt: new Date().toISOString()
          }
        ];
        
        localStorage.setItem("products", JSON.stringify(defaultProducts));
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Generate store slug from email
      const storeSlug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      const mockUser: User = {
        id: "1",
        email,
        name,
        role: "admin",
        store: {
          id: "store-" + Date.now(),
          name: name + "'s Store",
          slug: storeSlug,
          settings: {
            storeSlug: storeSlug, // Add store slug to settings
            privacyPolicy: "Default privacy policy text",
            aboutUs: "Default about us text",
            contactInfo: "Default contact info",
            menuItems: [
              { id: "1", label: "Početna", url: "/" },
              { id: "2", label: "Proizvodi", url: "/shop" },
              { id: "3", label: "O nama", url: "/about" },
              { id: "4", label: "Kontakt", url: "/contact" }
            ]
          }
        }
      };
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStoreSettings = (settings: any) => {
    if (!user || !user.store) return;
    
    // Make sure the storeSlug is preserved in settings
    const updatedSettings = {
      ...user.store.settings,
      ...settings,
      storeSlug: settings.storeSlug || user.store.slug
    };
    
    const updatedUser = {
      ...user,
      store: {
        ...user.store,
        settings: updatedSettings,
        // Also update the slug at the store level if it's changed in settings
        slug: settings.storeSlug || user.store.slug
      }
    };
    
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("storeMenuItems", JSON.stringify(settings.menuItems || []));
    setUser(updatedUser);
    
    // Also update store slug in all associated products
    if (settings.storeSlug) {
      try {
        const existingProducts = JSON.parse(localStorage.getItem("products") || "[]");
        const updatedProducts = existingProducts.map((product: any) => {
          if (product.storeId === user.store?.id) {
            return {
              ...product,
              storeSlug: settings.storeSlug
            };
          }
          return product;
        });
        
        localStorage.setItem("products", JSON.stringify(updatedProducts));
      } catch (error) {
        console.error("Error updating products with new store slug:", error);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateStoreSettings }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
