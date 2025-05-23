
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    conversionRate: 0
  });
  const [salesData, setSalesData] = useState([
    { name: "Jan", sales: 0 },
    { name: "Feb", sales: 0 },
    { name: "Mar", sales: 0 },
    { name: "Apr", sales: 0 },
    { name: "Maj", sales: 0 },
    { name: "Jun", sales: 0 },
    { name: "Jul", sales: 0 },
  ]);
  const [productSalesData, setProductSalesData] = useState<Array<{name: string, sales: number}>>([]);
  const [recentOrders, setRecentOrders] = useState<Array<any>>([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.store?.id) return;
      
      setLoading(true);
      try {
        // Fetch statistics
        
        // 1. Get total revenue
        const { data: revenueData, error: revenueError } = await supabase
          .from('orders')
          .select('amount')
          .eq('store_id', user.store.id);
          
        if (revenueError) console.error("Error fetching revenue:", revenueError);
        
        const totalRevenue = revenueData?.reduce((sum, order) => {
          return sum + parseFloat(order.amount || 0);
        }, 0) || 0;
        
        // 2. Count orders
        const { count: orderCount, error: orderError } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('store_id', user.store.id);
          
        if (orderError) console.error("Error counting orders:", orderError);
        
        // 3. Count customers
        const { count: customerCount, error: customerError } = await supabase
          .from('customers')
          .select('id', { count: 'exact', head: true })
          .eq('store_id', user.store.id);
          
        if (customerError) console.error("Error counting customers:", customerError);
        
        // 4. Fetch recent orders
        const { data: orderData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            id, 
            created_at, 
            amount,
            status,
            customer:customer_id (name, email)
          `)
          .eq('store_id', user.store.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (ordersError) console.error("Error fetching recent orders:", ordersError);
        
        // Update state
        setStats({
          revenue: totalRevenue,
          orders: orderCount || 0,
          customers: customerCount || 0,
          conversionRate: orderCount && customerCount ? parseFloat(((orderCount / customerCount) * 100).toFixed(1)) : 0
        });
        
        setRecentOrders(orderData || []);
        
        // 5. Fetch top products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('name')
          .eq('store_id', user.store.id)
          .order('stock', { ascending: false })
          .limit(5);
          
        if (productsError) console.error("Error fetching top products:", productsError);
        
        // Mock product sales data using real product names
        if (productsData && productsData.length > 0) {
          const mockProductSalesData = productsData.map((product, index) => ({
            name: product.name,
            sales: Math.floor(Math.random() * 10) + 1  // Random sales number for visualization
          }));
          setProductSalesData(mockProductSalesData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user?.store?.id]);
  
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
              {loading ? (
                <div className="h-8 bg-muted rounded-md animate-pulse"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold font-numeric">{stats.revenue.toLocaleString('sr-RS')} RSD</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ukupan prihod od svih porudžbina
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
              {loading ? (
                <div className="h-8 bg-muted rounded-md animate-pulse"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold font-numeric">{stats.orders}</div>
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
              {loading ? (
                <div className="h-8 bg-muted rounded-md animate-pulse"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold font-numeric">{stats.customers}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ukupan broj kupaca
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
              {loading ? (
                <div className="h-8 bg-muted rounded-md animate-pulse"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold font-numeric">{stats.conversionRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Procenat kupaca koji su izvršili kupovinu
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
                {productSalesData.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Dodajte proizvode i kreirajte porudžbine da biste videli grafik prodaje
                    </p>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
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
                {productSalesData.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Dodajte proizvode da biste videli njihove performanse
                    </p>
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
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted rounded-md w-full"></div>
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Još uvek nema porudžbina. Porudžbine će se pojaviti ovde kada ih kupci kreiraju.
                </p>
                <Link to="/products/new">
                  <Button variant="outline" className="mt-4">Dodaj prvi proizvod</Button>
                </Link>
              </div>
            ) : (
              <>
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
                          <td className="py-3">#{order.id.substring(0, 6)}</td>
                          <td className="py-3">{order.customer?.name || 'Gost'}</td>
                          <td className="py-3">{new Date(order.created_at).toLocaleDateString('sr-RS')}</td>
                          <td className="py-3 font-numeric">{parseFloat(order.amount).toLocaleString('sr-RS')} RSD</td>
                          <td className="py-3">
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status === "completed" ? "završeno" : 
                               order.status === "processing" ? "u obradi" : "poslato"}
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
                <div className="mt-4 text-center">
                  <Link to="/orders">
                    <Button variant="outline">Prikaži sve porudžbine</Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
