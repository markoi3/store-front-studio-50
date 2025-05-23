
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Update the currency formatter to accept both string and number
const formatCurrency = (value: string | number) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
  }).format(numValue);
};

const Dashboard = () => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load real data from database
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      
      try {
        // Fetch orders for this store
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('store_id', user.store?.id)
          .order('created_at', { ascending: false });
          
        if (ordersError) throw ordersError;
        
        // Fetch products for this store
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', user.store?.id);
          
        if (productsError) throw productsError;
        
        // Fetch customers for this store
        const { data: customers, error: customersError } = await supabase
          .from('customers')
          .select('*')
          .eq('store_id', user.store?.id);
          
        if (customersError) throw customersError;
        
        // Calculate statistics
        const totalRevenue = orders?.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0) || 0;
        
        setStatistics({
          totalOrders: orders?.length || 0,
          totalRevenue,
          totalProducts: products?.length || 0,
          totalCustomers: customers?.length || 0
        });
        
        // Set recent orders (limit to 5)
        setRecentOrders(orders?.slice(0, 5) || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Pregled Vašeg poslovanja
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ukupno porudžbina
              </CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart text-muted-foreground"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {loading ? 'Učitavanje...' : 'Broj porudžbina'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ukupan prihod
              </CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card text-muted-foreground"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(statistics.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? 'Učitavanje...' : 'Ukupan prihod'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ukupno proizvoda
              </CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package text-muted-foreground"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                {loading ? 'Učitavanje...' : 'Broj proizvoda'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ukupno kupaca
              </CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                {loading ? 'Učitavanje...' : 'Broj kupaca'}
              </p>
            </CardContent>
          </Card>
        </div>
          
        <Card>
          <CardHeader>
            <CardTitle>Nedavne porudžbine</CardTitle>
            <CardDescription>
              Poslednje primljene porudžbine
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-2 border rounded">
                    <div className="w-1/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-1/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-1/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="divide-y">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-2">
                    <div className="font-medium">#{order.order_number}</div>
                    <div className="text-muted-foreground">{order.customer_name || 'Gost'}</div>
                    <div>{formatCurrency(order.total)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                Nema porudžbina za prikaz
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <a href="/orders" className="text-sm text-blue-600 hover:underline">Prikaži sve porudžbine</a>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
