
import { ReactNode, useEffect, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type AdminLayoutProps = {
  children: ReactNode;
};

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [storeLoading, setStoreLoading] = useState(false);
  
  useEffect(() => {
    // Check if user has store information
    if (user && !user.store) {
      toast.error("No store found for your account. Attempting to create one...");
      createStoreForUser();
    }
  }, [user]);
  
  // Function to create a store for user if one doesn't exist
  const createStoreForUser = async () => {
    if (!user) return;
    
    setStoreLoading(true);
    try {
      // Generate store slug from email
      const emailUsername = user.email.split('@')[0];
      const storeSlug = emailUsername.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const storeName = `${user.name}'s Store`;
      
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
      
      const { data, error } = await supabase
        .from('stores')
        .insert({
          user_id: user.id,
          name: storeName,
          slug: storeSlug,
          settings: defaultSettings
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating store:", error);
        toast.error("Failed to create store: " + error.message);
      } else {
        toast.success("Store created successfully! Refreshing...");
        // Reload the page to update user context with new store
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Error in createStoreForUser:", error);
    } finally {
      setStoreLoading(false);
    }
  };
  
  if (isLoading || storeLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 ml-0 md:ml-64 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
};
