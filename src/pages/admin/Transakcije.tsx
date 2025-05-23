
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { 
  FileCheck, 
  CreditCard, 
  Package, 
  Truck, 
  CalendarDays,
  Receipt,
  Download,
  Loader2,
  MapPin
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Transakcije = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchOrderDetails = async () => {
      setLoading(true);
      
      try {
        console.log("Fetching order with ID:", id);
        // Fetch order data
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        if (orderError) {
          throw orderError;
        }
        
        if (!orderData) {
          console.log("Order not found");
          setLoading(false);
          return;
        }
        
        console.log("Found order:", orderData);
        setOrder(orderData);
        
        // If customer_id exists, fetch customer data
        if (orderData.customer_id) {
          const { data: customerData, error: customerError } = await supabase
            .from('customers')
            .select('*')
            .eq('id', orderData.customer_id)
            .maybeSingle();
            
          if (customerError) {
            console.error("Error fetching customer:", customerError);
          } else if (customerData) {
            console.log("Found customer:", customerData);
            setCustomer(customerData);
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Greška pri učitavanju detalja porudžbine");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Učitavanje detalja porudžbine...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <p className="text-xl text-muted-foreground mb-4">Porudžbina nije pronađena</p>
          <Button onClick={() => navigate("/orders")}>
            Nazad na sve porudžbine
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('sr-RS');
  };

  // Extract billing information
  const billingInfo = order.billing_info || {};
  const shippingInfo = order.shipping_info || {};
  const items = Array.isArray(order.items) ? order.items : [];
  
  // Format payment method
  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "card":
        return "Kreditna kartica";
      case "bank_transfer":
        return "Bankovni prenos";
      case "cash_on_delivery":
        return "Plaćanje pouzećem";
      default:
        return method || "Nije navedeno";
    }
  };

  // Format address from object or string
  const formatAddress = (addressData: any) => {
    if (!addressData) return "Nije dostupna";
    
    if (typeof addressData === 'string') {
      return addressData;
    }
    
    if (typeof addressData === 'object') {
      const parts = [];
      if (addressData.street) parts.push(addressData.street);
      if (addressData.number) parts.push(addressData.number);
      if (addressData.city) parts.push(addressData.city);
      if (addressData.postal_code) parts.push(addressData.postal_code);
      if (addressData.country) parts.push(addressData.country);
      
      return parts.length > 0 ? parts.join(', ') : "Nije dostupna";
    }
    
    return "Nije dostupna";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Porudžbina {order.id.substring(0, 8)}</h1>
            <p className="text-muted-foreground">
              Datum: {formatDate(order.created_at)} · Status: 
              <span 
                className={`ml-2 py-1 px-2 rounded-full text-xs ${getStatusBadgeClass(order.status)}`}
              >
                {order.status}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/orders")}>
              Nazad na porudžbine
            </Button>
            <Button variant="outline">
              <Receipt className="mr-2 h-4 w-4" /> Preuzmi fakturu
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" /> Detalji plaćanja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Iznos:</span>
                <span className="font-medium">{order.amount.toLocaleString("sr-RS")} RSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metoda plaćanja:</span>
                <span className="capitalize">{getPaymentMethodName(billingInfo.payment_method)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status plaćanja:</span>
                <span className={`${
                  order.payment_status === "paid" 
                    ? "text-green-600" 
                    : order.payment_status === "processing" 
                    ? "text-amber-600" 
                    : "text-red-600"
                }`}>
                  {order.payment_status === "paid" 
                    ? "Plaćeno" 
                    : order.payment_status === "processing" 
                    ? "U obradi" 
                    : "Nije plaćeno"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" /> Proizvodi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {items.length > 0 ? (
                  items.map((item: any, index: number) => (
                    <div key={index} className="border-b pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between">
                        <span>{item.name}</span>
                        <span>{item.quantity} x {item.price.toLocaleString("sr-RS")} RSD</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">Nema proizvoda za prikaz</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" /> Isporuka
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Način isporuke:</span>
                <span>{shippingInfo.shipping_method || "Standardna dostava"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Adresa:</span>
                <span className="text-right">{formatAddress(shippingInfo.address || billingInfo.address)}</span>
              </div>
              {shippingInfo.notes && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Napomena:</span>
                  <span className="text-right max-w-[70%]">{shippingInfo.notes}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Podaci o kupcu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Ime i prezime</p>
                <p className="font-medium">
                  {customer?.name || billingInfo.full_name || "Nepoznat kupac"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">E-mail adresa</p>
                <p className="font-medium">
                  {customer?.email || billingInfo.email || "Nije dostupna"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">Telefon</p>
                <p className="font-medium">
                  {customer?.phone || billingInfo.phone || "Nije dostupan"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" /> Detalji adrese
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Billing Address */}
              <div>
                <h3 className="font-medium text-lg mb-4">Adresa za naplatu</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-muted-foreground">Ulica:</p>
                    <p className="font-medium">
                      {billingInfo.address?.street || billingInfo.street || "Nije dostupna"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-muted-foreground">Broj:</p>
                    <p className="font-medium">
                      {billingInfo.address?.number || billingInfo.number || "Nije dostupan"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-muted-foreground">Grad:</p>
                    <p className="font-medium">
                      {billingInfo.address?.city || billingInfo.city || "Nije dostupan"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-muted-foreground">Poštanski broj:</p>
                    <p className="font-medium">
                      {billingInfo.address?.postal_code || billingInfo.postal_code || "Nije dostupan"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-muted-foreground">Država:</p>
                    <p className="font-medium">
                      {billingInfo.address?.country || billingInfo.country || "Nije dostupna"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-medium text-lg mb-4">Adresa za isporuku</h3>
                <div className="space-y-2">
                  {shippingInfo.address || Object.keys(shippingInfo).some(key => ['street', 'number', 'city', 'postal_code', 'country'].includes(key)) ? (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-muted-foreground">Ulica:</p>
                        <p className="font-medium">
                          {shippingInfo.address?.street || shippingInfo.street || "Nije dostupna"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-muted-foreground">Broj:</p>
                        <p className="font-medium">
                          {shippingInfo.address?.number || shippingInfo.number || "Nije dostupan"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-muted-foreground">Grad:</p>
                        <p className="font-medium">
                          {shippingInfo.address?.city || shippingInfo.city || "Nije dostupan"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-muted-foreground">Poštanski broj:</p>
                        <p className="font-medium">
                          {shippingInfo.address?.postal_code || shippingInfo.postal_code || "Nije dostupan"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-muted-foreground">Država:</p>
                        <p className="font-medium">
                          {shippingInfo.address?.country || shippingInfo.country || "Nije dostupna"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground italic">Ista kao adresa za naplatu</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalji porudžbine</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proizvod</TableHead>
                  <TableHead className="text-right">Količina</TableHead>
                  <TableHead className="text-right">Cena</TableHead>
                  <TableHead className="text-right">Ukupno</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length > 0 ? (
                  items.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.price.toLocaleString("sr-RS")} RSD</TableCell>
                      <TableCell className="text-right">{(item.price * item.quantity).toLocaleString("sr-RS")} RSD</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      Nema proizvoda za prikaz
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            <div className="mt-6 space-y-2">
              <Separator />
              <div className="flex justify-between pt-4">
                <span>Ukupno:</span>
                <span className="font-bold">{order.amount.toLocaleString("sr-RS")} RSD</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {billingInfo.additional_info && (
          <Card>
            <CardHeader>
              <CardTitle>Dodatne informacije</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{billingInfo.additional_info}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Transakcije;
