
import { useParams } from "react-router-dom";
import { useStoreData } from "@/hooks/useStoreData";
import { useAuth } from "@/contexts/AuthContext";

const ComingSoon = () => {
  const { storeId } = useParams();
  const { user } = useAuth();
  const { store, loading } = useStoreData({ 
    storeId, 
    currentUserId: user?.id 
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-40 bg-muted rounded mb-4"></div>
        </div>
      </div>
    );
  }

  // Get logo from store settings
  const logo = store?.settings?.logo || null;
  const storeName = store?.name || "Store";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Store Logo or Name */}
        {logo && logo.url ? (
          <img 
            src={logo.url} 
            alt={logo.alt || storeName} 
            className="h-16 mb-8 mx-auto max-w-[200px] object-contain" 
          />
        ) : (
          <h2 className="text-2xl font-bold mb-8 text-foreground">{storeName}</h2>
        )}
        
        {/* Coming Soon Message */}
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
          Coming Soon
        </h1>
        
        <p className="text-muted-foreground text-lg">
          We're working on something amazing. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
