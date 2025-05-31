
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Calendar, CreditCard } from "lucide-react";

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId") || "ORDER-12345";

  // Mock order data
  const order = {
    id: orderId,
    status: "confirmed",
    total: 159.97,
    items: [
      { name: "Premium Product", quantity: 1, price: 99.99 },
      { name: "Basic Product", quantity: 2, price: 29.99 }
    ],
    shipping: {
      method: "Standard Shipping",
      address: "123 Main St, City, State 12345",
      estimatedDelivery: "3-5 business days"
    },
    payment: {
      method: "Credit Card",
      last4: "4242"
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div className="text-center space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Order ID:</span>
            <span>{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span className="capitalize">{order.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Total:</span>
            <span className="font-bold">${order.total}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                </div>
                <span>${item.price}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Shipping Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-medium">Method:</span>
            <span className="ml-2">{order.shipping.method}</span>
          </div>
          <div>
            <span className="font-medium">Address:</span>
            <span className="ml-2">{order.shipping.address}</span>
          </div>
          <div>
            <span className="font-medium">Estimated Delivery:</span>
            <span className="ml-2">{order.shipping.estimatedDelivery}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <span className="font-medium">Payment Method:</span>
            <span className="ml-2">{order.payment.method} ending in {order.payment.last4}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate("/orders")} className="flex-1">
          View All Orders
        </Button>
        <Button onClick={() => navigate("/products")} className="flex-1">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
