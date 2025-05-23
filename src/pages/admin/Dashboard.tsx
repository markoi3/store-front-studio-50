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
  Cell,
  ReferenceLine,
  ComposedChart,
  Line,
  Scatter,
  Legend
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Input } from "@/components/ui/input"
import { addDays } from 'date-fns';
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/contexts/CartContext";

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
  email?: string;
  avatar_url?: string | null;
  name?: string | null;
  updated_at?: string | null;
}

const Dashboard = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [filter, setFilter] = useState<string>('30d');
  const { toast } = useToast()
  const { clearCart } = useCart();

  const { data: products, isLoading: isLoadingProducts, error: productsError } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
      if (error) {
        throw error;
      }
      
      return (data || []).map(product => ({
        ...product,
        sold_count: product.sold_count || 0
      }));
    },
  });

  const { data: orders, isLoading: isLoadingOrders, error: ordersError } = useQuery<Order[]>({
    queryKey: ['orders', date?.from, date?.to],
    queryFn: async () => {
      if (!date?.from || !date?.to) {
        return [];
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', date.from.toISOString())
        .lte('created_at', date.to.toISOString());

      if (error) {
        throw error;
      }
      return data || [];
    },
  });

  const { data: customers, isLoading: isLoadingCustomers, error: customersError } = useQuery<Customer[]>({
    queryKey: ['customers', date?.from, date?.to],
    queryFn: async () => {
      if (!date?.from || !date?.to) {
        return [];
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .gte('created_at', date.from.toISOString())
        .lte('created_at', date.to.toISOString());

      if (error) {
        throw error;
      }
      
      return (data || []).map(profile => ({
        id: profile.id,
        created_at: profile.updated_at || new Date().toISOString(), 
        email: profile.email || 'Unknown',
        avatar_url: profile.avatar_url,
        name: profile.name,
        updated_at: profile.updated_at
      }));
    },
  });

  useEffect(() => {
    if (productsError) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem fetching products.",
        variant: "destructive",
      })
    }
  }, [productsError, toast]);

  useEffect(() => {
    if (ordersError) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem fetching orders.",
        variant: "destructive",
      })
    }
  }, [ordersError, toast]);

  useEffect(() => {
    if (customersError) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem fetching customers.",
        variant: "destructive",
      })
    }
  }, [customersError, toast]);

  const calculateMetrics = (products: Product[]) => {
    const totalSold = products.reduce((sum, product) => sum + (product.sold_count || 0), 0);
    
    const revenue = products.reduce((total, product) => {
      const price = typeof product.price === 'number' ? product.price : 0;
      const soldCount = product.sold_count || 0;
      return total + (price * soldCount);
    }, 0);
    
    return {
      totalRevenue: revenue,
      totalSold: totalSold,
      totalProducts: products.length,
    };
  };

  const metrics = products ? calculateMetrics(products) : null;

  const productRevenue = products?.map(product => ({
    name: product.name,
    revenue: product.price * product.sold_count,
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const orderAmounts = orders?.map(order => order.amount) || [];

  // Safe formatter for numeric values that might be strings
  const formatCurrency = (value: any): string => {
    if (typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    } else if (typeof value === 'string' && !isNaN(Number(value))) {
      return `$${Number(value).toFixed(2)}`;
    }
    return 'N/A';
  };

  // Fixed chart tooltip formatter to handle ValueType properly
  const formatChartValue = (value: any): string => {
    if (typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    } else if (typeof value === 'string' && !isNaN(Number(value))) {
      return `$${Number(value).toFixed(2)}`;
    }
    return String(value);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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
    <div className="container mx-auto py-10">
      <div className="mb-4 flex items-center justify-between">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>Total revenue generated</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingProducts ? (
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
            <CardTitle>Products Sold</CardTitle>
            <CardDescription>Number of products sold</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingProducts ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <div className="text-2xl font-bold">
                {metrics ? metrics.totalSold : 'N/A'}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
            <CardDescription>Number of products available</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingProducts ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <div className="text-2xl font-bold">
                {metrics ? metrics.totalProducts : 'N/A'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>Revenue generated over the selected time period</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={orders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="created_at" tickFormatter={formatDate} />
                  <YAxis />
                  <RechartsTooltip labelFormatter={formatDate} formatter={(value) => formatChartValue(value)} />
                  <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Order Amounts</CardTitle>
            <CardDescription>Distribution of order amounts</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <div className="h-[200px] flex items-center justify-center">
                {orderAmounts.length > 0 ? (
                  <p>Order amounts data visualization would go here</p>
                ) : (
                  <p className="text-muted-foreground">No order data available</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Top 5 products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingProducts ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip formatter={(value: any) => formatChartValue(value)} />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Last 5 orders placed</CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto">
            {isLoadingOrders ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Order ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
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
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>New Customers</CardTitle>
            <CardDescription>Last 5 new customers</CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto">
            {isLoadingCustomers ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Customer ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
