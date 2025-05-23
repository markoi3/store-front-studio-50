
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Define the shape of the user profile data
interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  updated_at?: string;
  store?: {
    id: string;
    name: string;
    slug: string;
    settings?: Record<string, any>;
  };
}

// Define the shape of the authentication context
interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ user: User | null; session: Session | null; } | { user: null; session: null; }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ user: User | null; session: Session | null; } | { user: null; session: null; }>;
  refreshUserProfile: () => Promise<void>;
  updateStoreSettings: (settings: Record<string, any>) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  login: async () => ({ user: null, session: null }),
  logout: async () => {},
  register: async () => ({ user: null, session: null }),
  refreshUserProfile: async () => {},
  updateStoreSettings: async () => {},
});

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to fetch and format user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      // First, try to get the user profile (if one exists)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
      }
      
      // Get the store associated with this user
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (storeError) {
        console.error("Error fetching store data:", storeError);
      }
      
      // Parse store settings if needed
      let storeSettings = {};
      if (storeData?.settings) {
        if (typeof storeData.settings === 'string') {
          try {
            storeSettings = JSON.parse(storeData.settings);
          } catch (e) {
            console.error("Error parsing store settings:", e);
          }
        } else {
          storeSettings = storeData.settings;
        }
      }
      
      // Combine user data with profile data
      const userProfile: UserProfile = {
        id: userId,
        ...(profileData || {}),
        store: storeData ? {
          id: storeData.id,
          name: storeData.name,
          slug: storeData.slug,
          settings: storeSettings
        } : undefined
      };
      
      setUser(userProfile);
      
      console.log("Set user profile:", userProfile);
      
      return userProfile;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };
  
  // Function to update store settings
  const updateStoreSettings = async (settings: Record<string, any>) => {
    if (!user?.store?.id) {
      toast.error("No store found for your account");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('stores')
        .update({
          settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.store.id);
      
      if (error) {
        toast.error("Failed to update store settings: " + error.message);
        throw error;
      }
      
      // Update the local user state with new settings
      setUser(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          store: {
            ...prev.store!,
            settings
          }
        };
      });
      
      toast.success("Store settings updated successfully");
    } catch (error) {
      console.error("Error updating store settings:", error);
      throw error;
    }
  };
  
  // Function to refresh user profile data
  const refreshUserProfile = async () => {
    if (!session?.user?.id) return;
    
    await fetchUserProfile(session.user.id);
    console.log("User profile refreshed");
  };
  
  // Set up the auth state listener
  useEffect(() => {
    const setupAuthListener = async () => {
      setIsLoading(true);
      
      // First, set up the auth state change listener
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          console.log("Auth state changed:", event, currentSession?.user?.id);
          
          setSession(currentSession);
          
          if (event === 'INITIAL_SESSION') {
            // This will be handled by the getSession call below
            return;
          }
          
          if (event === 'SIGNED_IN' && currentSession) {
            // When the user signs in, fetch their profile
            await fetchUserProfile(currentSession.user.id);
          } else if (event === 'SIGNED_OUT') {
            // When the user signs out, clear user data
            setUser(null);
          } else if (event === 'USER_UPDATED') {
            // When the user is updated, refresh their profile
            if (currentSession?.user?.id) {
              await fetchUserProfile(currentSession.user.id);
            }
          }
          
          setIsLoading(false);
        }
      );
      
      // Check for an existing session
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      setSession(initialSession);
      
      if (initialSession?.user?.id) {
        // If there's an existing session, fetch the user's profile
        await fetchUserProfile(initialSession.user.id);
      }
      
      setIsLoading(false);
      
      // Clean up the listener when the component unmounts
      return () => {
        subscription.unsubscribe();
      };
    };
    
    setupAuthListener();
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting to log in user:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Error signing in:", error);
        throw error;
      }
      
      console.log("User logged in successfully:", data);
      
      // The auth state listener will update the user state
      // Redirect user to dashboard
      if (data.session) {
        console.log("Redirecting to dashboard");
        window.location.href = '/dashboard';
      }
      
      return data;
    } catch (error) {
      console.error("Error in login function:", error);
      throw error;
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      console.log("Logging out...");
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        throw error;
      }
      
      console.log("User logged out successfully");
      
      // The auth state listener will update the user state
      // Redirect user to home
      window.location.href = '/';
    } catch (error) {
      console.error("Error in logout function:", error);
      throw error;
    }
  };
  
  // Register function
  const register = async (email: string, password: string, name: string) => {
    try {
      console.log("Attempting to register user:", email);
      
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });
      
      if (error) {
        console.error("Error registering:", error);
        throw error;
      }
      
      console.log("User registered successfully:", data);
      
      // Note: The auth state listener will handle updating the user state
      // once email verification is complete
      
      return data;
    } catch (error) {
      console.error("Error in register function:", error);
      throw error;
    }
  };
  
  // Provide the auth context to the app
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        isLoading, 
        login, 
        logout, 
        register, 
        refreshUserProfile,
        updateStoreSettings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
