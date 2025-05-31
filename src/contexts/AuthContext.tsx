
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

type StoreInfo = {
  id: string;
  name: string;
  slug: string;
  settings: {
    privacyPolicy?: string;
    aboutUs?: string;
    contactInfo?: string;
    menuItems?: Array<{id: string; label: string; url: string}>;
    is_public?: boolean;
    [key: string]: any;
  };
};

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer";
  store?: StoreInfo;
};

type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateStoreSettings: (settings: any) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user store data
  const fetchUserStore = async (userId: string) => {
    try {
      console.log("Fetching store for user ID:", userId);
      
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (storeError) {
        console.error("Error fetching store:", storeError);
        return null;
      }

      console.log("Found store for user:", storeData);
      return storeData;
    } catch (error) {
      console.error("Error in fetchUserStore:", error);
      return null;
    }
  };

  // Transform Supabase user to our app user format
  const transformUser = async (supabaseUser: User): Promise<AuthUser> => {
    const storeData = await fetchUserStore(supabaseUser.id);
    
    const defaultSettings = {
      privacyPolicy: "",
      aboutUs: "",
      contactInfo: "",
      menuItems: [
        { id: "1", label: "Početna", url: "/" },
        { id: "2", label: "Proizvodi", url: "/shop" },
        { id: "3", label: "O nama", url: "/about" },
        { id: "4", label: "Kontakt", url: "/contact" }
      ]
    };
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
      role: "admin",
      store: storeData ? {
        id: storeData.id,
        name: storeData.name,
        slug: storeData.slug,
        settings: typeof storeData.settings === 'object' && storeData.settings !== null
          ? { ...defaultSettings, ...storeData.settings }
          : defaultSettings
      } : undefined
    };
  };

  useEffect(() => {
    console.log("Initializing auth...");
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          try {
            console.log("User authenticated, transforming user data");
            const authUser = await transformUser(currentSession.user);
            setUser(authUser);
          } catch (error) {
            console.error("Error transforming user:", error);
            setUser(null);
          }
        } else {
          console.log("No active session, clearing user");
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Check for existing session
    const initSession = async () => {
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      
      if (existingSession?.user) {
        try {
          console.log("Found existing session, setting user");
          setSession(existingSession);
          const authUser = await transformUser(existingSession.user);
          setUser(authUser);
        } catch (error) {
          console.error("Error transforming existing user:", error);
        }
      }
      
      setIsLoading(false);
    };
    
    initSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Attempting login for:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) {
      console.error("Login error:", error.message);
      throw error;
    }
    
    if (data.user) {
      console.log("Login successful for:", data.user.email);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    console.log("Attempting registration for:", email);
    
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          name: name
        }
      }
    });
    
    if (error) {
      console.error("Registration error:", error.message);
      throw error;
    }
    
    if (data.user) {
      console.log("Registration successful for:", data.user.email);
    }
  };

  const logout = async () => {
    console.log("Logging out user");
    
    await supabase.auth.signOut();
    
    // Clear state
    setUser(null);
    setSession(null);
    
    toast.success("Logged out successfully");
  };

  const updateStoreSettings = async (settings: any) => {
    if (!user || !user.store) return;
    
    try {
      console.log("Updating store settings");
      
      const updatedSettings = {
        ...user.store.settings,
        ...settings
      };
      
      const { data, error } = await supabase
        .from('stores')
        .update({ 
          settings: updatedSettings
        })
        .eq('id', user.store.id)
        .select()
        .single();
        
      if (error) {
        console.error("Update settings error:", error);
        toast.error("Failed to update settings: " + error.message);
        throw error;
      }
      
      // Update the local user state with the new settings
      setUser(prev => {
        if (!prev || !prev.store) return prev;
        
        return {
          ...prev,
          store: {
            ...prev.store,
            settings: updatedSettings
          }
        };
      });
      
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Update store settings error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      isLoading, 
      login, 
      register, 
      logout, 
      updateStoreSettings 
    }}>
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
