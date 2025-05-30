import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart,
  Bar,
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { addDays } from 'date-fns';
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { AdminLayout } from "@/components/layout/AdminLayout";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  created_at?: string;
  image?: string;
  sold_count: number;
}

interface Order {
  id: string;
  amount: number;
  created_at: string;
}

interface Customer {
  id: string;
  created_at: string;
  email: string;
  name?: string;
  address?: any;
}

const Dashboard = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [filter, setFilter] = useState<string>('30d');
  const { toast } = useToast()
  const { clearCart } = useCart();
  const { user } = useAuth();

  // Get store ID from user context for filtering
  const storeId = user?.store?.id;

  console.log("Dashboard: Current user:", user);
  console.log("Dashboard: Store ID:", storeId);

  const { data: products, isLoading: isLoadingProducts, error: productsError } = useQuery<Product[]>({
    queryKey: ['products', storeId],
    queryFn: async () => {
      console.log("Dashboard: Fetching products for store ID:", storeId);
      
      if (!storeId) {
        console.log("Dashboard: No store ID available, returning empty array");
        return [];
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId);
      
      if (error) {
        console.error("Dashboard: Error fetching products:", error);
        throw error;
      }
      
      console.log("Dashboard: Raw products data:", data);
      console.log("Dashboard: Number of products fetched:", data?.length || 0);
      
      const formattedProducts = (data || []).map(product => {
        console.log("Dashboard: Processing product:", product.name, "sold_count:", product.sold_count);
        return {
          ...product,
          sold_count: product.sold_count || 0
        };
      });
      
      console.log("Dashboard: Formatted products:", formattedProducts);
      return formattedProducts;
    },
    enabled: !!storeId,
  });

  const { data: orders, isLoading: isLoadingOrders, error: ordersError } = useQuery<Order[]>({
    queryKey: ['orders', date?.from, date?.to, storeId],
    queryFn: async () => {
      if (!date?.from || !date?.to || !storeId) {
        return [];
      }

      console.log("Dashboard: Fetching orders for store ID:", storeId);

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('store_id', storeId)
        .gte('created_at', date.from.toISOString())
        .lte('created_at', date.to.toISOString());

      if (error) {
        console.error("Dashboard: Error fetching orders:", error);
        throw error;
      }
      
      console.log("Dashboard: Orders data:", data);
      return data || [];
    },
    enabled: !!storeId,
  });

  const { data: customers, isLoading: isLoadingCustomers, error: customersError } = useQuery<Customer[]>({
    queryKey: ['customers', date?.from, date?.to, storeId],
    queryFn: async () => {
      if (!date?.from || !date?.to || !storeId) {
        return [];
      }

      console.log("Dashboard: Fetching customers for store ID:", storeId);

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('store_id', storeId)
        .gte('created_at', date.from.toISOString())
        .lte('created_at', date.to.toISOString());

      if (error) {
        console.error("Dashboard: Error fetching customers:", error);
      } else {
        console.log("Dashboard: Customers data:", data);
      }
      
      return (data || []).map(customer => ({
        id: customer.id,
        created_at: customer.created_at || new Date().toISOString(), 
        email: customer.email || 'Unknown',
        name: customer.name,
        address: customer.address
      }));
    },
    enabled: !!storeId,
  });

  // Fetch page views for analytics
  const { data: pageViews, isLoading: isLoadingPageViews } = useQuery({
    queryKey: ['pageViews', date?.from, date?.to, storeId],
    queryFn: async () => {
      if (!date?.from || !date?.to || !storeId) {
        return [];
      }

      console.log("Dashboard: Fetching page views for store ID:", storeId);

      const { data, error } = await supabase
        .from('page_views')
        .select('*')
        .eq('store_id', storeId)
        .gte('created_at', date.from.toISOString())
        .lte('created_at', date.to.toISOString());

      if (error) {
        console.error("Dashboard: Error fetching page views:", error);
        return [];
      }
      
      console.log("Dashboard: Page views data:", data);
      return data || [];
    },
    enabled: !!storeId,
  });

  useEffect(() => {
    if (productsError) {
      console.error("Dashboard: Products error:", productsError);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem fetching products.",
        variant: "destructive",
      })
    }
  }, [productsError, toast]);

  useEffect(() => {
    if (ordersError) {
      console.error("Dashboard: Orders error:", ordersError);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem fetching orders.",
        variant: "destructive",
      })
    }
  }, [ordersError, toast]);

  useEffect(() => {
    if (customersError) {
      console.error("Dashboard: Customers error:", customersError);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem fetching customers.",
        variant: "destructive",
      })
    }
  }, [customersError, toast]);

  const calculateMetrics = (orders: Order[], products: Product[]) => {
    console.log("Dashboard: Calculating metrics for orders:", orders);
    console.log("Dashboard: Calculating metrics for products:", products);
    
    // Calculate total revenue from actual orders
    const totalRevenue = orders.reduce((sum, order) => {
      const amount = typeof order.amount === 'number' ? order.amount : 0;
      console.log(`Dashboard: Order ${order.id} amount: ${amount}`);
      return sum + amount;
    }, 0);
    
    // Calculate total sold from products
    const totalSold = products.reduce((sum, product) => {
      const soldCount = product.sold_count || 0;
      console.log(`Dashboard: Product ${product.name} sold count: ${soldCount}`);
      return sum + soldCount;
    }, 0);
    
    console.log("Dashboard: Total revenue from orders:", totalRevenue);
    console.log("Dashboard: Total sold from products:", totalSold);
    console.log("Dashboard: Total products:", products.length);
    console.log("Dashboard: Total page views:", pageViews?.length || 0);
    
    return {
      totalRevenue: totalRevenue,
      totalSold: totalSold,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalPageViews: pageViews?.length || 0,
    };
  };

  const metrics = orders && products ? calculateMetrics(orders, products) : null;

  const productRevenue = products?.map(product => ({
    name: product.name,
    revenue: product.price * product.sold_count,
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // RSD formatter for Serbian locale
  const formatCurrency = (value: any): string => {
    if (typeof value === 'number') {
      return `${value.toLocaleString('sr-RS', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })} RSD`;
    } else if (typeof value === 'string' && !isNaN(Number(value))) {
      return `${Number(value).toLocaleString('sr-RS', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })} RSD`;
    }
    return 'N/A';
  };

  // Fixed chart tooltip formatter to handle ValueType properly
  const formatChartValue = (value: any): string => {
    if (typeof value === 'number') {
      return `${value.toLocaleString('sr-RS', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })} RSD`;
    } else if (typeof value === 'string' && !isNaN(Number(value))) {
      return `${Number(value).toLocaleString('sr-RS', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })} RSD`;
    }
    return String(value);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const recentOrders = orders && orders.length > 0 
    ? [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)
    : [];

  const newCustomers = customers && customers.length > 0
    ? [...customers].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)
    : [];

  const changeDateRange = (range: DateRange | undefined) => {
    setDate(range);
    if (range?.from && range?.to) {
      const diff = range.to.getTime() - range.from.getTime();
      const days = Math.ceil(diff / (1000 * 3600 * 24));

      if (days <= 30) {
        setFilter('30d');
      } else if (days <= 90) {
        setFilter('90d');
      } else if (days <= 180) {
        setFilter('180d');
      } else {
        setFilter('1y');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-10 max-w-7xl">
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    `${format(date.from, "MMM dd, yyyy")} - ${format(date.to, "MMM dd, yyyy")}`
                  ) : (
                    format(date.from, "MMM dd, yyyy")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={changeDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Ukupni prihod</CardTitle>
              <CardDescription>Ukupno ostvareni prihod iz porudžbina</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingOrders ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                <div className="text-2xl font-bold">
                  {metrics ? formatCurrency(metrics.totalRevenue) : 'N/A'}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prodati proizvodi</CardTitle>
              <CardDescription>Ukupan broj prodatih proizvoda</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProducts ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                <div className="text-2xl font-bold">
                  {metrics ? metrics.totalSold.toLocaleString('sr-RS') : 'N/A'}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ukupno proizvoda</CardTitle>
              <CardDescription>Broj dostupnih proizvoda</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProducts ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                <div className="text-2xl font-bold">
                  {metrics ? metrics.totalProducts.toLocaleString('sr-RS') : 'N/A'}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pregledi stranica</CardTitle>
              <CardDescription>Ukupan broj pregleda stranica</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPageViews ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                <div className="text-2xl font-bold">
                  {metrics ? metrics.totalPageViews.toLocaleString('sr-RS') : 'N/A'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Prihod kroz vreme</CardTitle>
              <CardDescription>Prihod ostvaren u izabranom periodu</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingOrders ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <div className="w-full overflow-hidden">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={orders}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="created_at" tickFormatter={formatDate} />
                      <YAxis />
                      <RechartsTooltip labelFormatter={formatDate} formatter={(value) => formatChartValue(value)} />
                      <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Najbolji proizvodi</CardTitle>
              <CardDescription>Top 5 proizvoda po prihodu</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProducts ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <div className="w-full overflow-hidden">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={productRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip formatter={(value: any) => formatChartValue(value)} />
                      <Bar dataKey="revenue" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Nedavne porudžbine</CardTitle>
              <CardDescription>Poslednjih 5 porudžbina</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
              {isLoadingOrders ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <div className="w-full overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID porudžbine</TableHead>
                        <TableHead>Iznos</TableHead>
                        <TableHead>Datum</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
                          <TableCell>{formatCurrency(order.amount)}</TableCell>
                          <TableCell>{formatDate(order.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Novi kupci</CardTitle>
              <CardDescription>Poslednjih 5 novih kupaca</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
              {isLoadingCustomers ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <div className="w-full overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID kupca</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Datum</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">{customer.id.substring(0, 8)}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{formatDate(customer.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
