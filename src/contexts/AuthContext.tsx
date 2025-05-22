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
  session: Session | null; // Add session to the context
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateStoreSettings: (settings: any) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to clean up auth state
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null); // Track session state
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user store data
  const fetchUserStore = async (userId: string) => {
    try {
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (storeError) {
        console.error("Error fetching store:", storeError);
        return null;
      }

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
      role: "admin", // All registered users are admins of their own stores
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
    // Check for existing session and setup auth listener
    const initAuth = async () => {
      setIsLoading(true);
      console.log("Initializing auth...");
      
      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          console.log("Auth state changed:", event);
          
          // Update session state synchronously
          setSession(currentSession);
          
          if (currentSession?.user) {
            try {
              console.log("User authenticated, transforming user data");
              // Using setTimeout to avoid potential deadlocks
              setTimeout(async () => {
                const authUser = await transformUser(currentSession.user);
                setUser(authUser);
              }, 0);
            } catch (error) {
              console.error("Error transforming user:", error);
              setUser(null);
            }
          } else {
            console.log("No active session, clearing user");
            setUser(null);
          }
        }
      );
      
      // THEN check for existing session
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
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting login for:", email);
      
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt to sign out any existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log("Pre-login sign out failed, continuing anyway:", err);
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error("Login error:", error.message);
        toast.error("Login failed: " + error.message);
        throw error;
      }
      
      if (data.user) {
        console.log("Login successful for:", data.user.email);
        // Set session first
        setSession(data.session);
        
        // Then transform and set user data
        const authUser = await transformUser(data.user);
        setUser(authUser);
        
        toast.success("Login successful!");
        
        // Force page reload to ensure clean state - ENSURE correct admin path
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 100);
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
      console.log("Attempting registration for:", email);
      
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt to sign out any existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log("Pre-registration sign out failed, continuing anyway:", err);
      }
      
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
        toast.error("Registration failed: " + error.message);
        throw error;
      }
      
      if (data.user) {
        console.log("Registration successful for:", data.user.email);
        
        // Set session first
        setSession(data.session);
        
        // Wait a moment for the trigger to create the store
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const authUser = await transformUser(data.user);
        setUser(authUser);
        
        toast.success("Registration successful!");
        
        // Force page reload to ensure clean state - ENSURE correct admin path
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 100);
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out user");
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Then sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear state
      setUser(null);
      setSession(null);
      
      toast.success("Logged out successfully");
      
      // Force page reload to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const updateStoreSettings = async (settings: any) => {
    if (!user || !user.store) return;
    
    try {
      console.log("Updating store settings");
      
      const { data, error } = await supabase
        .from('stores')
        .update({ 
          settings: {
            ...user.store.settings,
            ...settings
          }
        })
        .eq('id', user.store.id)
        .select()
        .single();
        
      if (error) {
        console.error("Update settings error:", error);
        toast.error("Failed to update settings: " + error.message);
        throw error;
      }
      
      setUser(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          store: {
            ...prev.store!,
            settings: {
              ...prev.store!.settings,
              ...settings
            }
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
