// StorePageLayout.tsx
import { ReactNode, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useStoreVisibility } from "@/hooks/useStoreVisibility";
import ComingSoon from "@/pages/ComingSoon";

type StorePageLayoutProps = {
  children: ReactNode;
};

export const StorePageLayout = ({ children }: StorePageLayoutProps) => {
  // ... (keep all your existing logic)

  if (loading || visibilityLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-40 bg-muted rounded mb-4"></div>
          <div className="h-4 w-60 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (shouldShowComingSoon) {
    return <ComingSoon />;
  }

  // This is the critical change - return raw children
  return <>{children}</>;
};

export const withStoreLayout = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <StorePageLayout>
      <Component {...props} />
    </StorePageLayout>
  );
};
