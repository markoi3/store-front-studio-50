
import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

type AdminLayoutProps = {
  children: ReactNode;
};

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 ml-0 md:ml-64 p-4 overflow-auto">
        {children}
      </main>
    </div>
  );
};
