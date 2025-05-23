
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Customer {
  id: string;
  name?: string;
  email: string;
}

interface Order {
  id: string;
  customer: Customer;
  date: string;
  total: number;
  status: string;
  items: number;
  paymentMethod: string;
}

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.store?.id) return;
      
      try {
        setLoading(true);
        
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*, customer:customer_id(*)')
          .eq('store_id', user.store.id)
          .order('created_at', { ascending: false });
          
        if (ordersError) {
          toast.error("Error loading orders: " + ordersError.message);
          throw ordersError;
        }
        
        if (ordersData) {
          const formattedOrders = ordersData.map((order: any) => ({
            id: order.id,
            customer: order.customer || {
              name: 'Guest Customer',
              email: 'N/A'
            },
            date: order.created_at,
            total: parseFloat(order.amount) || 0,
            status: order.status || 'pending',
            items: order.items?.length || 0,
            paymentMethod: order.payment_status === 'paid' ? 'credit-card' : 'pending'
          }));
          
          setOrders(formattedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);
  
  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.includes(search) ||
      order.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('store_id', user?.store?.id);
        
      if (error) {
        toast.error("Failed to update order status: " + error.message);
        throw error;
      }
      
      setOrders(
        orders.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
      
      toast.success(`Order #${id.substring(0, 6)} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Porudžbine</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Pretraži po ID-u, imenu ili email-u..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Sve porudžbine</SelectItem>
                <SelectItem value="processing">U obradi</SelectItem>
                <SelectItem value="shipped">Poslato</SelectItem>
                <SelectItem value="completed">Završeno</SelectItem>
                <SelectItem value="cancelled">Otkazano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-custom overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8">
                <div className="flex justify-center items-center">
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-muted rounded-md w-full md:w-[700px]"></div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                      ID porudžbine
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                      Kupac
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                      Datum
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                      Stavke
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                      Ukupno
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                      Status
                    </th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-4">
                      Akcije
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-8 text-center text-muted-foreground"
                      >
                        {search || statusFilter !== 'all' ? 
                          "Nema porudžbina koje odgovaraju vašoj pretrazi" :
                          "Još uvek nema porudžbina"
                        }
                        <div className="mt-4">
                          <p className="text-sm">
                            Kada kupci naprave porudžbinu, videćete ih ovde.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border">
                        <td className="p-4 font-medium">#{order.id.substring(0, 6)}</td>
                        <td className="p-4">
                          <div>
                            <p>{order.customer?.name || 'Gost'}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.customer?.email || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">{new Date(order.date).toLocaleDateString('sr-RS')}</td>
                        <td className="p-4">{order.items}</td>
                        <td className="p-4">{order.total.toLocaleString('sr-RS')} RSD</td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status === 'completed' ? 'Završeno' :
                             order.status === 'processing' ? 'U obradi' :
                             order.status === 'shipped' ? 'Poslato' :
                             order.status === 'cancelled' ? 'Otkazano' :
                             order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Akcije
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/orders/${order.id}`)}>
                                Vidi detalje
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(order.id, "processing")
                                }
                              >
                                Označi kao "U obradi"
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(order.id, "shipped")
                                }
                              >
                                Označi kao "Poslato"
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(order.id, "completed")
                                }
                              >
                                Označi kao "Završeno"
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(order.id, "cancelled")
                                }
                                className="text-destructive"
                              >
                                Otkaži porudžbinu
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Orders;
