
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

const Analytics = () => {
  const [timeframe, setTimeframe] = useState("year");
  const { user } = useAuth();
  const storeId = user?.store?.id;
  
  // Calculate date range based on timeframe
  const getDateRange = () => {
    const now = new Date();
    switch (timeframe) {
      case "month":
        return { from: subDays(now, 30), to: now };
      case "quarter":
        return { from: subDays(now, 90), to: now };
      default:
        return { from: subDays(now, 365), to: now };
    }
  };

  const dateRange = getDateRange();

  // Fetch real data from database
  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['analytics-orders', storeId, timeframe],
    queryFn: async () => {
      if (!storeId) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('store_id', storeId)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!storeId,
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['analytics-products', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!storeId,
  });

  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['analytics-customers', storeId, timeframe],
    queryFn: async () => {
      if (!storeId) return [];
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('store_id', storeId)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!storeId,
  });

  const { data: pageViews, isLoading: isLoadingPageViews } = useQuery({
    queryKey: ['analytics-pageviews', storeId, timeframe],
    queryFn: async () => {
      if (!storeId) return [];
      
      const { data, error } = await supabase
        .from('page_views')
        .select('*')
        .eq('store_id', storeId)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!storeId,
  });

  // Calculate metrics from real data
  const totalRevenue = orders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
  const totalOrders = orders?.length || 0;
  const totalCustomers = customers?.length || 0;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Process revenue data by month
  const revenueData = orders?.reduce((acc: any[], order) => {
    const month = format(new Date(order.created_at), 'MMM');
    const existingMonth = acc.find(item => item.month === month);
    
    if (existingMonth) {
      existingMonth.revenue += order.amount || 0;
    } else {
      acc.push({ month, revenue: order.amount || 0 });
    }
    
    return acc;
  }, []) || [];

  // Process orders data by month
  const ordersData = orders?.reduce((acc: any[], order) => {
    const month = format(new Date(order.created_at), 'MMM');
    const existingMonth = acc.find(item => item.month === month);
    
    if (existingMonth) {
      existingMonth.orders += 1;
    } else {
      acc.push({ month, orders: 1 });
    }
    
    return acc;
  }, []) || [];

  // Process product performance data
  const productPerformanceData = products?.map(product => ({
    name: product.name,
    sales: product.sold_count || 0,
    revenue: (product.price || 0) * (product.sold_count || 0),
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 8) || [];

  // Process category data (if products have categories)
  const categoryData = products?.reduce((acc: any[], product) => {
    const category = product.category || 'Nekategorizovano';
    const existingCategory = acc.find(item => item.name === category);
    
    if (existingCategory) {
      existingCategory.value += product.sold_count || 0;
    } else {
      acc.push({ name: category, value: product.sold_count || 0 });
    }
    
    return acc;
  }, []) || [];

  // Process customer data by month
  const customerData = customers?.reduce((acc: any[], customer) => {
    const month = format(new Date(customer.created_at), 'MMM');
    const existingMonth = acc.find(item => item.month === month);
    
    if (existingMonth) {
      existingMonth.new += 1;
    } else {
      acc.push({ month, new: 1, returning: 0 }); // We don't track returning customers yet
    }
    
    return acc;
  }, []) || [];

  const isLoading = isLoadingOrders || isLoadingProducts || isLoadingCustomers || isLoadingPageViews;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Analitika i Izveštaji</h1>
          
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Izaberite period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year">Poslednih 12 meseci</SelectItem>
              <SelectItem value="quarter">Poslednja 3 meseca</SelectItem>
              <SelectItem value="month">Poslednji mesec</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ukupni prihod
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  {totalRevenue.toLocaleString('sr-RS')} RSD
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Ukupan prihod za period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ukupno porudžbina
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{totalOrders}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Broj obrađenih porudžbina
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ukupno kupaca
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{totalCustomers}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Broj jedinstvenih kupaca
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Prosečna vrednost porudžbine
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  {averageOrderValue.toFixed(0)} RSD
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Prosečna vrednost po porudžbini
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <Tabs defaultValue="revenue">
          <TabsList>
            <TabsTrigger value="revenue">Prihod</TabsTrigger>
            <TabsTrigger value="orders">Porudžbine</TabsTrigger>
            <TabsTrigger value="products">Proizvodi</TabsTrigger>
            <TabsTrigger value="customers">Kupci</TabsTrigger>
          </TabsList>
          
          {/* Revenue Tab */}
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Prihod kroz vreme</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} RSD`, "Prihod"]} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#8884d8"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Porudžbine kroz vreme</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ordersData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="orders" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
                {categoryData.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">
                      Prodaja po kategorijama
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {categoryData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name, props) => [
                              `${value} prodaja`,
                              props.payload.name,
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Performanse proizvoda</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left text-xs font-medium text-muted-foreground p-3">
                              Proizvod
                            </th>
                            <th className="text-left text-xs font-medium text-muted-foreground p-3">
                              Prodano jedinica
                            </th>
                            <th className="text-left text-xs font-medium text-muted-foreground p-3">
                              Prihod
                            </th>
                            <th className="text-left text-xs font-medium text-muted-foreground p-3">
                              Pros. cena
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {productPerformanceData.map((product) => (
                            <tr key={product.name} className="border-b border-border">
                              <td className="p-3 font-medium">{product.name}</td>
                              <td className="p-3">{product.sales}</td>
                              <td className="p-3">{product.revenue.toFixed(2)} RSD</td>
                              <td className="p-3">
                                {product.sales > 0 ? (product.revenue / product.sales).toFixed(2) : '0'} RSD
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">
                        Najbolji proizvodi
                      </h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={productPerformanceData.slice(0, 5)}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis
                              dataKey="name"
                              type="category"
                              width={100}
                              tick={{ fontSize: 12 }}
                            />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sales" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Customers Tab */}
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Rast broja kupaca</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={customerData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="new" fill="#8884d8" name="Novi kupci" />
                        <Bar
                          dataKey="returning"
                          fill="#82ca9d"
                          name="Vraćeni kupci"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Stopa zadržavanja kupaca
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">N/A</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Potrebno implementirati praćenje
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Cena privlačenja kupca
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">N/A</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Potrebno implementirati marketing troškove
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Životna vrednost kupca
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {totalCustomers > 0 ? (totalRevenue / totalCustomers).toFixed(2) : '0'} RSD
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Prosečan prihod po kupcu
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
