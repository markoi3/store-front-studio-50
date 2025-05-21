
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopLayout } from "@/components/layout/ShopLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const StorePrivacyPolicy = () => {
  const { storeId } = useParams();
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoreData = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData.store && userData.store.slug === storeId) {
            setStoreData({
              name: userData.store.name,
              privacyPolicy: userData.store.settings?.privacyPolicy || "Politika privatnosti nije definisana."
            });
          } else {
            // Store not found in current user, set default message
            setStoreData({
              name: "Prodavnica",
              privacyPolicy: "Politika privatnosti nije definisana."
            });
          }
        } else {
          // No user found, set default message
          setStoreData({
            name: "Prodavnica",
            privacyPolicy: "Politika privatnosti nije definisana."
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading store data:", error);
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
