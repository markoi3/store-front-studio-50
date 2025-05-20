
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

// Sample orders data
const allOrders = [
  {
    id: "1001",
    customer: {
      name: "John Doe",
      email: "john@example.com",
    },
    date: "2023-06-10",
    total: 249.99,
    status: "completed",
    items: 3,
    paymentMethod: "credit-card",
  },
  {
    id: "1002",
    customer: {
      name: "Jane Smith",
      email: "jane@example.com",
    },
    date: "2023-06-09",
    total: 129.99,
    status: "processing",
    items: 1,
    paymentMethod: "paypal",
  },
  {
    id: "1003",
    customer: {
      name: "Mike Johnson",
      email: "mike@example.com",
    },
    date: "2023-06-08",
    total: 349.98,
    status: "completed",
    items: 2,
    paymentMethod: "credit-card",
  },
  {
    id: "1004",
    customer: {
      name: "Sarah Williams",
      email: "sarah@example.com",
    },
    date: "2023-06-07",
    total: 199.99,
    status: "shipped",
    items: 1,
    paymentMethod: "bank-transfer",
  },
  {
    id: "1005",
    customer: {
      name: "Alex Brown",
      email: "alex@example.com",
    },
    date: "2023-06-06",
    total: 79.99,
    status: "completed",
    items: 2,
    paymentMethod: "credit-card",
  },
  {
    id: "1006",
    customer: {
      name: "Emma Wilson",
      email: "emma@example.com",
    },
    date: "2023-06-05",
    total: 159.98,
    status: "cancelled",
    items: 2,
    paymentMethod: "paypal",
  },
  {
    id: "1007",
    customer: {
      name: "David Lee",
      email: "david@example.com",
    },
    date: "2023-06-04",
    total: 299.99,
    status: "processing",
    items: 3,
    paymentMethod: "credit-card",
  },
  {
    id: "1008",
    customer: {
      name: "Linda Chen",
      email: "linda@example.com",
    },
    date: "2023-06-03",
    total: 89.99,
    status: "shipped",
    items: 1,
    paymentMethod: "paypal",
  },
  {
    id: "1009",
    customer: {
      name: "Tom Anderson",
      email: "tom@example.com",
    },
    date: "2023-06-02",
    total: 149.99,
    status: "completed",
    items: 1,
    paymentMethod: "credit-card",
  },
];

const Orders = () => {
  const [orders, setOrders] = useState(allOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.includes(search) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleUpdateStatus = (id: string, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
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
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-4 text-center text-muted-foreground"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border">
                      <td className="p-4 font-medium">{order.id}</td>
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
                      <td className="p-4">${order.total.toFixed(2)}</td>
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default Orders;
