
import { ReactNode } from "react";
import { StoreHeader } from "./StoreHeader";
import { Footer } from "./Footer";

type StoreLayoutProps = {
  children: ReactNode;
};

export const StoreLayout = ({ children }: StoreLayoutProps) => {
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
