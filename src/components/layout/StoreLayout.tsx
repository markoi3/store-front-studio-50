
import { ReactNode } from "react";
import { StoreHeader } from "./StoreHeader";
import { Footer } from "./Footer";
import { usePageViewTracking } from "@/hooks/usePageViewTracking";

type StoreLayoutProps = {
  children: ReactNode;
};

export const StoreLayout = ({ children }: StoreLayoutProps) => {
  // Track page views for analytics
  usePageViewTracking();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StoreHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
