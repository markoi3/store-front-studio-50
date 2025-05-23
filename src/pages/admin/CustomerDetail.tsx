
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CustomerType {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    zip?: string;
    country?: string;
  };
  created_at: string;
}

interface OrderType {
  id: string;
  created_at: string;
  amount: number;
  status: string;
}

const CustomerDetail = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<CustomerType | null>(null);
  const [orders, setOrders] = useState<OrderType[]>([]);
  
  useEffect(() => {
    const loadCustomerDetails = async () => {
      if (!customerId || !user?.store?.id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', customerId)
          .eq('store_id', user.store.id)
          .single();
          
        if (error) {
          toast.error("Greška pri učitavanju kupca: " + error.message);
          throw error;
        }
        
        if (data) {
          setCustomer(data as CustomerType);
          
          // Load customer's orders
          const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('customer_id', customerId)
            .eq('store_id', user.store.id)
            .order('created_at', { ascending: false });
            
          if (ordersError) {
            console.error("Error loading orders:", ordersError);
          } else {
            setOrders(ordersData || []);
          }
        }
      } catch (error) {
        console.error("Error loading customer details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCustomerDetails();
  }, [customerId, user]);

  const handleDelete = async () => {
    if (!customer || !user?.store?.id) return;
    
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customer.id)
        .eq('store_id', user.store.id);
        
      if (error) {
        toast.error("Greška pri brisanju kupca: " + error.message);
        throw error;
      }
      
      toast.success("Kupac je uspešno izbrisan");
      navigate("/customers");
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded-md w-64"></div>
            <div className="h-24 bg-muted rounded-md w-full max-w-lg"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!customer) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Kupac nije pronađen</h2>
          <p className="text-muted-foreground mt-2">
            Kupac sa ID-om {customerId} nije pronađen ili ne pripada vašoj prodavnici.
          </p>
          <Button onClick={() => navigate("/customers")} className="mt-4">
            Nazad na listu kupaca
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Detalji kupca</h1>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => navigate("/customers")}>
              Nazad
            </Button>
            <Button onClick={() => navigate(`/customers/edit/${customer.id}`)}>
              Izmeni
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Izbriši</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Da li ste sigurni?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ova akcija ne može biti poništena. Ovo će trajno izbrisati
                    kupca {customer.name} i sve povezane podatke.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Otkaži</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Da, izbriši
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Detalji kupca</TabsTrigger>
            <TabsTrigger value="orders">Porudžbine</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Lični podaci</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Ime i prezime</p>
                    <p className="font-medium">{customer.name || 'Nije uneto'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email adresa</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Broj telefona</p>
                    <p className="font-medium">{customer.phone || 'Nije uneto'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Datum registracije</p>
                    <p className="font-medium">
                      {new Date(customer.created_at).toLocaleDateString('sr-RS')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Adresa za dostavu</CardTitle>
              </CardHeader>
              <CardContent>
                {customer.address ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Ulica i broj</p>
                      <p className="font-medium">{customer.address.street || 'Nije uneto'}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Grad</p>
                      <p className="font-medium">{customer.address.city || 'Nije uneto'}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Poštanski broj</p>
                      <p className="font-medium">{customer.address.zip || 'Nije uneto'}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Država</p>
                      <p className="font-medium">{customer.address.country || 'Nije uneto'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Adresa nije uneta</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Porudžbine kupca</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Ovaj kupac nema porudžbina.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left text-muted-foreground text-sm">
                          <th className="pb-2">ID porudžbine</th>
                          <th className="pb-2">Datum</th>
                          <th className="pb-2">Iznos</th>
                          <th className="pb-2">Status</th>
                          <th className="pb-2 text-right">Akcije</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b">
                            <td className="py-3">#{order.id.substring(0, 8)}</td>
                            <td className="py-3">
                              {new Date(order.created_at).toLocaleDateString('sr-RS')}
                            </td>
                            <td className="py-3">{parseFloat(order.amount.toString()).toLocaleString('sr-RS')} RSD</td>
                            <td className="py-3">
                              <span
                                className={`inline-block px-2 py-1 text-xs rounded-full ${
                                  order.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "processing"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "shipped"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {order.status === "completed"
                                  ? "Završeno"
                                  : order.status === "processing"
                                  ? "U obradi"
                                  : order.status === "shipped"
                                  ? "Poslato"
                                  : order.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/orders/${order.id}`)}
                              >
                                Detalji
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default CustomerDetail;
