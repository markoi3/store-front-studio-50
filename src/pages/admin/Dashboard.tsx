
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

// Sample chart data
const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 2780 },
  { name: "May", sales: 1890 },
  { name: "Jun", sales: 2390 },
  { name: "Jul", sales: 3490 },
];

const productSalesData = [
  { name: "Coffee Table", sales: 12 },
  { name: "Office Chair", sales: 19 },
  { name: "Mug Set", sales: 32 },
  { name: "Floor Lamp", sales: 14 },
  { name: "Dining Chair", sales: 10 },
];

// Sample recent orders
const recentOrders = [
  {
    id: "123456",
    customer: "John Doe",
    date: "2023-06-10",
    amount: 249.99,
    status: "completed",
  },
  {
    id: "123457",
    customer: "Jane Smith",
    date: "2023-06-09",
    amount: 129.99,
    status: "processing",
  },
  {
    id: "123458",
    customer: "Mike Johnson",
    date: "2023-06-08",
    amount: 349.98,
    status: "completed",
  },
  {
    id: "123459",
    customer: "Sarah Williams",
    date: "2023-06-07",
    amount: 199.99,
    status: "shipped",
  },
  {
    id: "123460",
    customer: "Alex Brown",
    date: "2023-06-06",
    amount: 79.99,
    status: "completed",
  },
];

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link to="/products/new">
            <Button>Add New Product</Button>
          </Link>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$15,236.89</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground mt-1">
                +8.2% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78</div>
              <p className="text-xs text-muted-foreground mt-1">
                +5.7% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2%</div>
              <p className="text-xs text-muted-foreground mt-1">
                +0.5% from last month
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <Tabs defaultValue="sales">
          <TabsList>
            <TabsTrigger value="sales">Sales Overview</TabsTrigger>
            <TabsTrigger value="products">Product Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-t border-border">
                      <td className="py-3">{order.id}</td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3">{order.date}</td>
                      <td className="py-3">${order.amount.toFixed(2)}</td>
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
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <Link to={`/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            View
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
                <Button variant="outline">View All Orders</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
