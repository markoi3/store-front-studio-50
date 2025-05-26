import { ReactNode } from "react";
// Uklanjamo sve header/footer iz ShopLayout jer withStoreLayout već ih dodaje
type ShopLayoutProps = {
  children: ReactNode;
};

export const ShopLayout = ({ children }: ShopLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Nema header-a - withStoreLayout ga dodaje */}
      <main className="flex-1">
        {children}
      </main>
      {/* Nema footer-a - withStoreLayout ga dodaje */}
    </div>
  );
};
