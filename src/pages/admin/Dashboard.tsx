
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [productSalesData, setProductSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    orderCount: 0,
    customerCount: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    if (!user?.store?.id) return;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch orders for this store
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*, customer_id, amount, items, payment_status, status, created_at')
          .eq('store_id', user.store.id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        // Fetch customers for this store
        const { data: customers, error: customersError } = await supabase
          .from('customers')
          .select('*')
          .eq('store_id', user.store.id);

        if (customersError) throw customersError;

        // Calculate stats
        const totalRevenue = orders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
        const orderCount = orders?.length || 0;
        const customerCount = customers?.length || 0;
        // Dummy conversion rate calculation (can be replaced with actual analytics in the future)
        const conversionRate = orderCount > 0 ? ((orderCount / Math.max(customerCount, 1)) * 100).toFixed(1) : 0;

        setStats({
          totalRevenue,
          orderCount,
          customerCount,
          conversionRate,
        });

        // Prepare sales data by month
        const monthlySales = prepareMonthlyData(orders || []);
        setSalesData(monthlySales);

        // Prepare product sales data
        const productSales = prepareProductData(orders || []);
        setProductSalesData(productSales.slice(0, 5)); // Get top 5 products

        // Set recent orders
        setRecentOrders(
          (orders || []).slice(0, 5).map(order => {
            // Find customer name from customers array or use placeholder
            const customer = customers?.find(c => c.id === order.customer_id);
            return {
              id: order.id,
              customer: customer ? customer.name : 'Nepoznat kupac',
              date: order.created_at ? new Date(order.created_at).toISOString().split('T')[0] : 'N/A',
              amount: order.amount || 0,
              status: order.status || 'pending'
            };
          })
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Set fallback data if fetching fails
        setSalesData(generateFallbackMonthlyData());
        setProductSalesData(generateFallbackProductData());
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.store?.id]);

  // Helper function to prepare monthly sales data
  const prepareMonthlyData = (orders) => {
    if (!orders || orders.length === 0) return generateFallbackMonthlyData();
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"];
    const result = [];
    
    // Get current month and go back 6 months
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    
    // Initialize all months with 0 sales
    for (let i = 6; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12; // Handle wrapping around to previous year
      result.push({
        name: monthNames[monthIndex],
        sales: 0
      });
    }
    
    // Aggregate sales by month
    orders.forEach(order => {
      if (!order.created_at) return;
      
      const orderDate = new Date(order.created_at);
      const orderMonth = orderDate.getMonth();
      const monthDiff = (currentMonth - orderMonth + 12) % 12;
      
      if (monthDiff <= 6) {
        const monthIndex = 6 - monthDiff;
        result[monthIndex].sales += Number(order.amount) || 0;
      }
    });
    
    return result;
  };

  // Helper function to prepare product sales data
  const prepareProductData = (orders) => {
    if (!orders || orders.length === 0) return generateFallbackProductData();
    
    const productSales = {};
    
    // Extract items from all orders
    orders.forEach(order => {
      if (!order.items || !Array.isArray(order.items)) return;
      
      order.items.forEach(item => {
        if (!item || !item.name) return;
        
        const productName = item.name;
        const quantity = Number(item.quantity) || 1;
        
        if (productSales[productName]) {
          productSales[productName] += quantity;
        } else {
          productSales[productName] = quantity;
        }
      });
    });
    
    // Convert to array and sort by sales
    return Object.entries(productSales)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales);
  };

  // Fallback data generators
  const generateFallbackMonthlyData = () => {
    return [
      { name: "Jan", sales: 4000 },
      { name: "Feb", sales: 3000 },
      { name: "Mar", sales: 5000 },
      { name: "Apr", sales: 2780 },
      { name: "Maj", sales: 1890 },
      { name: "Jun", sales: 2390 },
      { name: "Jul", sales: 3490 },
    ];
  };

  const generateFallbackProductData = () => {
    return [
      { name: "Klub sto", sales: 12 },
      { name: "Kancelarijska stolica", sales: 19 },
      { name: "Set šolja", sales: 32 },
      { name: "Podna lampa", sales: 14 },
      { name: "Trpezarijska stolica", sales: 10 },
    ];
  };

  // Format functions for better display
  const formatCurrency = (value) => {
    return value.toLocaleString('sr-RS');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Kontrolna tabla</h1>
          <Link to="/products/new">
            <Button>Dodaj novi proizvod</Button>
          </Link>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ukupan prihod
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-36" />
              ) : (
                <>
                  <div className="text-2xl font-bold font-numeric">{formatCurrency(stats.totalRevenue)} RSD</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ukupan prihod od prodaje
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Porudžbine
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold font-numeric">{stats.orderCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ukupan broj porudžbina
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Kupci
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold font-numeric">{stats.customerCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Registrovanih kupaca
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Stopa konverzije
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold font-numeric">{stats.conversionRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Porudžbine / kupci
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <Tabs defaultValue="sales">
          <TabsList>
            <TabsTrigger value="sales">Pregled prodaje</TabsTrigger>
            <TabsTrigger value="products">Performanse proizvoda</TabsTrigger>
          </TabsList>
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Pregled prodaje</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                    <p className="text-muted-foreground">Učitavanje podataka...</p>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${formatCurrency(value)} RSD`, 'Prodaja']} />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          stroke="#8884d8"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Performanse proizvoda</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                    <p className="text-muted-foreground">Učitavanje podataka...</p>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productSalesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sales" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Nedavne porudžbine</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="pb-2">ID porudžbine</th>
                      <th className="pb-2">Kupac</th>
                      <th className="pb-2">Datum</th>
                      <th className="pb-2">Iznos</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Akcije</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-t border-border">
                        <td className="py-3">{order.id.substring(0, 8)}</td>
                        <td className="py-3">{order.customer}</td>
                        <td className="py-3">{order.date}</td>
                        <td className="py-3 font-numeric">{formatCurrency(order.amount)} RSD</td>
                        <td className="py-3">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "shipped"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {order.status === "completed" ? "završeno" : 
                            order.status === "processing" ? "u obradi" : 
                            order.status === "shipped" ? "poslato" : "na čekanju"}
                          </span>
                        </td>
                        <td className="py-3">
                          <Link to={`/orders/${order.id}`}>
                            <Button variant="ghost" size="sm">
                              Pregled
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nema porudžbina za prikaz</p>
                <p className="text-sm">Porudžbine će se pojaviti ovde kada kupci obave kupovinu</p>
              </div>
            )}
            <div className="mt-4 text-center">
              <Link to="/orders">
                <Button variant="outline">Prikaži sve porudžbine</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
