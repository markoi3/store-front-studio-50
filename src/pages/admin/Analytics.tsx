
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

// Sample data for charts
const revenueData = [
  { month: "Jan", revenue: 5000 },
  { month: "Feb", revenue: 7500 },
  { month: "Mar", revenue: 6800 },
  { month: "Apr", revenue: 9200 },
  { month: "May", revenue: 8100 },
  { month: "Jun", revenue: 11500 },
  { month: "Jul", revenue: 10200 },
  { month: "Aug", revenue: 12500 },
  { month: "Sep", revenue: 14000 },
  { month: "Oct", revenue: 12700 },
  { month: "Nov", revenue: 15500 },
  { month: "Dec", revenue: 19000 },
];

const ordersData = [
  { month: "Jan", orders: 45 },
  { month: "Feb", orders: 62 },
  { month: "Mar", orders: 58 },
  { month: "Apr", orders: 78 },
  { month: "May", orders: 71 },
  { month: "Jun", orders: 98 },
  { month: "Jul", orders: 87 },
  { month: "Aug", orders: 104 },
  { month: "Sep", orders: 112 },
  { month: "Oct", orders: 98 },
  { month: "Nov", orders: 121 },
  { month: "Dec", orders: 142 },
];

const categoryData = [
  { name: "Furniture", value: 45 },
  { name: "Kitchen", value: 30 },
  { name: "Lighting", value: 25 },
];

const productPerformanceData = [
  { name: "Coffee Table", sales: 28, revenue: 5598.72 },
  { name: "Office Chair", sales: 22, revenue: 5499.78 },
  { name: "Ceramic Mug Set", sales: 58, revenue: 2319.42 },
  { name: "Floor Lamp", sales: 19, revenue: 2469.81 },
  { name: "Dining Chair", sales: 15, revenue: 2249.85 },
  { name: "Pendant Light", sales: 12, revenue: 1079.88 },
  { name: "Knife Set", sales: 25, revenue: 1999.75 },
  { name: "Bookshelf", sales: 9, revenue: 1619.91 },
];

const customerData = [
  { month: "Jan", new: 18, returning: 7 },
  { month: "Feb", new: 25, returning: 9 },
  { month: "Mar", new: 22, returning: 11 },
  { month: "Apr", new: 30, returning: 14 },
  { month: "May", new: 28, returning: 12 },
  { month: "Jun", new: 35, returning: 19 },
  { month: "Jul", new: 31, returning: 18 },
  { month: "Aug", new: 38, returning: 22 },
  { month: "Sep", new: 42, returning: 28 },
  { month: "Oct", new: 36, returning: 23 },
  { month: "Nov", new: 45, returning: 32 },
  { month: "Dec", new: 52, returning: 39 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

const Analytics = () => {
  const [timeframe, setTimeframe] = useState("year");
  
  // Filter data based on selected timeframe
  const getFilteredData = (data: any[]) => {
    if (timeframe === "year") {
      return data;
    } else if (timeframe === "quarter") {
      return data.slice(-3);
    } else {
      return data.slice(-1);
    }
  };
  
  const filteredRevenueData = getFilteredData(revenueData);
  const filteredOrdersData = getFilteredData(ordersData);
  const filteredCustomerData = getFilteredData(customerData);
  
  // Calculate summary values
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = ordersData.reduce((sum, item) => sum + item.orders, 0);
  const totalCustomers = customerData.reduce(
    (sum, item) => sum + item.new + item.returning,
    0
  );
  const averageOrderValue = totalRevenue / totalOrders;
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Analytics & Reporting</h1>
          
          <Select
            value={timeframe}
            onValueChange={setTimeframe}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year">Past 12 Months</SelectItem>
              <SelectItem value="quarter">Past 3 Months</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Lifetime total sales revenue
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Lifetime total orders processed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Lifetime unique customers
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Order Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${averageOrderValue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Average value per order
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <Tabs defaultValue="revenue">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>
          
          {/* Revenue Tab */}
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
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
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Highest Revenue
                    </p>
                    <p className="text-lg font-medium">
                      ${Math.max(...filteredRevenueData.map((d) => d.revenue)).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Lowest Revenue
                    </p>
                    <p className="text-lg font-medium">
                      ${Math.min(...filteredRevenueData.map((d) => d.revenue)).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Average Monthly Revenue
                    </p>
                    <p className="text-lg font-medium">
                      $
                      {(
                        filteredRevenueData.reduce((sum, item) => sum + item.revenue, 0) /
                        filteredRevenueData.length
                      ).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Growth Rate
                    </p>
                    <p className="text-lg font-medium">
                      {filteredRevenueData.length > 1
                        ? (
                            ((filteredRevenueData[filteredRevenueData.length - 1].revenue -
                              filteredRevenueData[0].revenue) /
                              filteredRevenueData[0].revenue) *
                            100
                          ).toFixed(2)
                        : "0"}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredOrdersData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="orders" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">
                    Sales by Category
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
                            `${value} orders`,
                            props.payload.name,
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">
                          Product
                        </th>
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">
                          Units Sold
                        </th>
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">
                          Revenue
                        </th>
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">
                          Avg. Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productPerformanceData.map((product) => (
                        <tr key={product.name} className="border-b border-border">
                          <td className="p-3 font-medium">{product.name}</td>
                          <td className="p-3">{product.sales}</td>
                          <td className="p-3">${product.revenue.toFixed(2)}</td>
                          <td className="p-3">
                            ${(product.revenue / product.sales).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">
                    Top Selling Products
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={productPerformanceData
                          .sort((a, b) => b.sales - a.sales)
                          .slice(0, 5)}
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
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Customers Tab */}
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredCustomerData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="new" fill="#8884d8" name="New Customers" />
                      <Bar
                        dataKey="returning"
                        fill="#82ca9d"
                        name="Returning Customers"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Customer Retention Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">48%</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Of customers make repeat purchases
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Customer Acquisition Cost
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$32.50</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Average cost to acquire a new customer
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Customer Lifetime Value
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$254.80</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Average revenue per customer over time
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
