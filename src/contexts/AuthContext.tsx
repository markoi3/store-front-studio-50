
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
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Mock registration - this would be replaced with a real API call
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
    
    const updatedUser = {
      ...user,
      store: {
        ...user.store,
        settings: {
          ...user.store.settings,
          ...settings
        }
      }
    };
    
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("storeMenuItems", JSON.stringify(settings.menuItems || []));
    setUser(updatedUser);
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
