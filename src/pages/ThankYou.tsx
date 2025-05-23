
import { useEffect, useState } from "react";
import { ShopLayout } from "@/components/layout/ShopLayout";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderDetails, setOrderDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(orderId));

  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrderDetails = async () => {
      try {
        console.log("Fetching order with ID:", orderId);
        const { data, error } = await supabase
          .from('orders')
          .select('id, amount, created_at, items, billing_info, shipping_info, payment_status')
          .eq('id', orderId)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          console.log("Found order details:", data);
          setOrderDetails(data);
        } else {
          console.log("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);
  
  return (
    <ShopLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-custom p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-10 h-10 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Hvala na vašoj porudžbini!</h1>
          
          <p className="text-muted-foreground mb-6">
            Vaša porudžbina je primljena i biće obrađena u najkraćem roku. 
            Uskoro ćete dobiti email sa potvrdom porudžbine.
          </p>
          
          <div className="bg-accent p-6 rounded-md mb-6">
            <h2 className="font-medium text-lg mb-4">Detalji porudžbine</h2>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-6 w-40 mx-auto" />
                <Skeleton className="h-6 w-24 mx-auto" />
              </div>
            ) : (
              <>
                {orderDetails ? (
                  <div className="space-y-4 text-left">
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-muted-foreground">Broj porudžbine:</p>
                      <p className="font-medium">#{orderDetails.id.substring(0, 8)}</p>
                    </div>
                    
                    {orderDetails.amount && (
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-muted-foreground">Ukupan iznos:</p>
                        <p className="font-medium">{orderDetails.amount.toLocaleString('sr-RS')} RSD</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-muted-foreground">Status plaćanja:</p>
                      <p className="font-medium">
                        {orderDetails.payment_status === "paid" 
                          ? "Plaćeno" 
                          : orderDetails.payment_status === "processing" 
                          ? "U obradi" 
                          : "Na čekanju"}
                      </p>
                    </div>
                    
                    {orderDetails.items && Array.isArray(orderDetails.items) && (
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-muted-foreground">Broj artikala:</p>
                        <p className="font-medium">{orderDetails.items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)}</p>
                      </div>
                    )}
                    
                    {orderDetails.created_at && (
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-muted-foreground">Datum:</p>
                        <p className="font-medium">{new Date(orderDetails.created_at).toLocaleDateString('sr-RS')}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Porudžbina je uspešno obrađena.
                  </p>
                )}
              </>
            )}
          </div>
          
          <div className="space-y-4">
            <Link to="/">
              <Button>Povratak na početnu</Button>
            </Link>
            
            <p className="text-sm text-muted-foreground">
              Ukoliko imate pitanja, kontaktirajte našu korisničku podršku.
            </p>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};

export default ThankYou;
