
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopLayout } from "@/components/layout/ShopLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const StorePrivacyPolicy = () => {
  const { storeId } = useParams();
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStoreData = () => {
      try {
        // Mock API call to fetch store data based on slug
        // First, check if there's a logged-in user with this store slug
        const storedUser = localStorage.getItem("user");
        let foundStore = false;
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData.store && userData.store.slug === storeId) {
            setStoreData({
              name: userData.store.name,
              privacyPolicy: userData.store.settings?.privacyPolicy || "Politika privatnosti nije definisana."
            });
            foundStore = true;
          }
        }
        
        // If not found in current user, search all users (in a real app this would be a database query)
        if (!foundStore) {
          // For demo purposes, we're hardcoding this check
          if (storeId === "demo-prodavnica") {
            setStoreData({
              name: "Demo Prodavnica",
              privacyPolicy: "Ovo je demo politika privatnosti za Demo Prodavnicu."
            });
          } else {
            // In this case, the store wasn't found
            setError("Prodavnica nije pronađena");
            setStoreData({
              name: "Nepoznata Prodavnica",
              privacyPolicy: "Prodavnica sa ovim URL-om ne postoji."
            });
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading store data:", error);
        setError("Došlo je do greške pri učitavanju podataka");
        setStoreData({
          name: "Prodavnica",
          privacyPolicy: "Došlo je do greške pri učitavanju politike privatnosti."
        });
        setLoading(false);
      }
    };

    loadStoreData();
  }, [storeId]);

  if (loading) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
            <div className="h-8 w-64 bg-muted rounded mb-8"></div>
            <div className="h-4 w-full bg-muted rounded"></div>
            <div className="h-4 w-5/6 bg-muted rounded"></div>
            <div className="h-4 w-4/6 bg-muted rounded"></div>
          </div>
        </div>
      </ShopLayout>
    );
  }

  if (error) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Store Not Found</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Link to="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link 
            to={`/store/${storeId}`}
            className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Nazad na prodavnicu
          </Link>
          
          <h1 className="text-3xl font-bold mb-8">Politika privatnosti</h1>
          
          <div className="prose prose-sm md:prose-base max-w-none">
            {storeData.privacyPolicy.split('\n').map((paragraph: string, idx: number) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};

export default StorePrivacyPolicy;
