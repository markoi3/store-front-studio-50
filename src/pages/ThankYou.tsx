
import { useEffect, useState } from "react";
import { ShopLayout } from "@/components/layout/ShopLayout";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(orderId));

  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrderDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id')
          .eq('id', orderId)
          .single();
        
        if (error) throw error;
        setOrderNumber(data.id);
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
          
          <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
          
          <p className="text-muted-foreground mb-6">
            Your order has been placed and is being processed. You will receive an
            email confirmation shortly.
          </p>
          
          <div className="bg-accent p-4 rounded-md mb-6">
            <h2 className="font-medium mb-2">Order Details</h2>
            {isLoading ? (
              <Skeleton className="h-6 w-32 mx-auto" />
            ) : (
              <p className="text-muted-foreground">
                Order Number: #{orderNumber || Math.floor(100000 + Math.random() * 900000)}
              </p>
            )}
          </div>
          
          <div className="space-y-4">
            <Link to="/">
              <Button>Return to Home</Button>
            </Link>
            
            <p className="text-sm text-muted-foreground">
              If you have any questions, please contact our customer support.
            </p>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};

export default ThankYou;
