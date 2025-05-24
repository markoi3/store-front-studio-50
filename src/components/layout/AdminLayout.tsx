
import { ReactNode, useEffect, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type AdminLayoutProps = {
  children: ReactNode;
};

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, session, isLoading } = useAuth();
  const [storeLoading, setStoreLoading] = useState(false);
  
  useEffect(() => {
    // Check if user has store information
    if (user && !user.store) {
      console.log("No store found for user, creating one...");
      toast.error("No store found for your account. Creating one...");
      createStoreForUser();
    }
    
    // Clean up localStorage on user change to prevent data leakage
    if (user) {
      const cleanLocalStorage = () => {
        // Remove products to prevent displaying products from other accounts
        localStorage.removeItem("products");
      };
      
      cleanLocalStorage();
    }
  }, [user]);
  
  // Function to create a store for user if one doesn't exist
  const createStoreForUser = async () => {
    if (!user) return;
    
    setStoreLoading(true);
    try {
      // Generate store slug from email
      const emailUsername = user.email.split('@')[0];
      // Ensure the slug is clean and valid
      const storeSlug = emailUsername.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const storeName = `${user.name}'s Store`;
      
      console.log("Creating store with slug:", storeSlug);
      
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
        console.log("Store created successfully:", data);
        toast.success("Store created successfully! Refreshing...");
        // Reload the page to update user context with new store
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Error in createStoreForUser:", error);
      toast.error("An unexpected error occurred while creating your store.");
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
  
  // Check both user and session to ensure we're properly authenticated
  if (!user || !session) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }
  
return (
  <div className="min-h-screen bg-background relative">
    {/* Fiksiran sidebar levo */}
    <div className="fixed top-0 left-0 w-64 h-full z-10">
      <AdminSidebar />
    </div>

    {/* Glavni sadržaj sa paddingom da ne ide ispod sidebar-a */}
    <main className="pl-64 p-6">
      {children}
    </main>
  </div>
);