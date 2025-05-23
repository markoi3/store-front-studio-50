
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  date: string;
  total: number;
  status: string;
  items: number;
  paymentMethod: string;
}

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  
  useEffect(() => {
    if (!user?.store?.id) return;
    
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch orders for this store
        const { data: storeOrders, error: ordersError } = await supabase
          .from('orders')
          .select('*, customer_id')
          .eq('store_id', user.store.id)
          .order('created_at', { ascending: false });
          
        if (ordersError) throw ordersError;
        
        // Fetch customers to enrich order data
        const { data: customers, error: customersError } = await supabase
          .from('customers')
          .select('id, name, email')
          .eq('store_id', user.store.id);
          
        if (customersError) throw customersError;
        
        // Map customers to orders
        const formattedOrders = storeOrders.map(order => {
          const customer = customers.find(c => c.id === order.customer_id);
          const itemCount = Array.isArray(order.items) ? order.items.length : 0;
          
          // Fix billing_info.payment_method access by checking if it's an object first
          let paymentMethod = 'credit-card'; // Default value
          if (order.billing_info && typeof order.billing_info === 'object') {
            // Check if payment_method exists on the billing_info object
            paymentMethod = order.billing_info.payment_method || 'credit-card';
          }
          
          return {
            id: order.id,
            customer: {
              name: customer ? customer.name : 'Nepoznat kupac',
              email: customer ? customer.email : 'Email nije dostupan'
            },
            date: order.created_at ? new Date(order.created_at).toISOString().split('T')[0] : 'N/A',
            total: typeof order.amount === 'number' ? order.amount : 0,
            status: order.status || 'pending',
            items: itemCount,
            paymentMethod: paymentMethod
          };
        });
        
        setOrders(formattedOrders);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Greška pri učitavanju porudžbina");
        toast.error("Greška pri učitavanju porudžbina");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user?.store?.id]);
  
  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
      
      toast.success(`Status porudžbine uspešno ažuriran na: ${newStatus}`);
    } catch (err: any) {
      console.error("Error updating order status:", err);
      toast.error("Greška pri ažuriranju statusa: " + (err.message || "Nepoznata greška"));
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
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center mt-6 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Prethodna
        </Button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Sledeća
        </Button>
      </div>
    );
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Orders</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by ID, name, or email..."
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
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-custom overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-4">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              <p>{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-4"
              >
                Pokušaj ponovo
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                      Order ID
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                      Customer
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                      Date
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                      Items
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                      Total
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                      Status
                    </th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-4 text-center text-muted-foreground"
                      >
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    currentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border">
                        <td className="p-4 font-medium">{order.id.substring(0, 8)}</td>
                        <td className="p-4">
                          <div>
                            <p>{order.customer.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.customer.email}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">{order.date}</td>
                        <td className="p-4">{order.items}</td>
                        <td className="p-4">{order.total.toLocaleString('sr-RS')} RSD</td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Link to={`/orders/${order.id}`} className="w-full">
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(order.id, "processing")
                                }
                              >
                                Mark as Processing
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(order.id, "shipped")
                                }
                              >
                                Mark as Shipped
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(order.id, "completed")
                                }
                              >
                                Mark as Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(order.id, "cancelled")
                                }
                                className="text-destructive"
                              >
                                Cancel Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {renderPagination()}
      </div>
    </AdminLayout>
  );
};

export default Orders;
