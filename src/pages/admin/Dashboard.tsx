
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
  { name: "Maj", sales: 1890 },
  { name: "Jun", sales: 2390 },
  { name: "Jul", sales: 3490 },
];

const productSalesData = [
  { name: "Klub sto", sales: 12 },
  { name: "Kancelarijska stolica", sales: 19 },
  { name: "Set šolja", sales: 32 },
  { name: "Podna lampa", sales: 14 },
  { name: "Trpezarijska stolica", sales: 10 },
];

// Sample recent orders
const recentOrders = [
  {
    id: "123456",
    customer: "Marko Marković",
    date: "2023-06-10",
    amount: 24999,
    status: "completed",
  },
  {
    id: "123457",
    customer: "Ana Jovanović",
    date: "2023-06-09",
    amount: 12999,
    status: "processing",
  },
  {
    id: "123458",
    customer: "Milan Petrović",
    date: "2023-06-08",
    amount: 34998,
    status: "completed",
  },
  {
    id: "123459",
    customer: "Sara Nikolić",
    date: "2023-06-07",
    amount: 19999,
    status: "shipped",
  },
  {
    id: "123460",
    customer: "Aleksandar Simić",
    date: "2023-06-06",
    amount: 7999,
    status: "completed",
  },
];

const Dashboard = () => {
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
              <div className="text-2xl font-bold font-numeric">15.236,89 RSD</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12,5% u odnosu na prošli mesec
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Porudžbine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-numeric">142</div>
              <p className="text-xs text-muted-foreground mt-1">
                +8,2% u odnosu na prošli mesec
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Kupci
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-numeric">78</div>
              <p className="text-xs text-muted-foreground mt-1">
                +5,7% u odnosu na prošli mesec
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Stopa konverzije
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-numeric">3,2%</div>
              <p className="text-xs text-muted-foreground mt-1">
                +0,5% u odnosu na prošli mesec
              </p>
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
                <CardTitle>Performanse proizvoda</CardTitle>
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
            <CardTitle>Nedavne porudžbine</CardTitle>
          </CardHeader>
          <CardContent>
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
                      <td className="py-3">{order.id}</td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3">{order.date}</td>
                      <td className="py-3 font-numeric">{order.amount.toLocaleString('sr-RS')} RSD</td>
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
