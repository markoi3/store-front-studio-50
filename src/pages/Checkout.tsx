
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/hooks/useStore";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CreditCard, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { getStoreUrl, store } = useStore();
  const { user } = useAuth();
  
  const shippingCost = subtotal > 100 ? 0 : 10;
  const totalCost = subtotal + shippingCost;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "us",
    paymentMethod: "card",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvc: "",
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // First, create or update customer record
      const customerData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        store_id: store?.id,
        address: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        }
      };
      
      // Check if customer with this email already exists for this store
      const { data: existingCustomers } = await supabase
        .from('customers')
        .select('id')
        .eq('email', formData.email)
        .eq('store_id', store?.id)
        .maybeSingle();
      
      let customerId;
      
      if (existingCustomers?.id) {
        // Update existing customer
        const { error: updateError } = await supabase
          .from('customers')
          .update({
            name: customerData.name,
            phone: customerData.phone,
            address: customerData.address
          })
          .eq('id', existingCustomers.id);
        
        if (updateError) throw updateError;
        customerId = existingCustomers.id;
      } else {
        // Create new customer
        const { data: newCustomer, error: createError } = await supabase
          .from('customers')
          .insert(customerData)
          .select('id')
          .single();
        
        if (createError) throw createError;
        if (!newCustomer?.id) throw new Error("Failed to create customer");
        customerId = newCustomer.id;
      }
      
      // Now create the order
      const orderData = {
        store_id: store?.id,
        customer_id: customerId,
        amount: totalCost,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        billing_info: {
          payment_method: formData.paymentMethod,
          card_info: formData.paymentMethod === 'card' ? {
            cardName: formData.cardName,
            cardNumber: formData.cardNumber ? `****-****-****-${formData.cardNumber.slice(-4)}` : null,
            expiryDate: formData.expiryDate
          } : null
        },
        shipping_info: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        status: 'processing',
        payment_status: 'paid'
      };
      
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select('id')
        .single();
      
      if (orderError) throw orderError;
      if (!newOrder?.id) throw new Error("Failed to create order");
      
      console.log("Created new order:", newOrder.id);
      
      clearCart();
      navigate(getStoreUrl(`/thank-you?orderId=${newOrder.id}`));
      
    } catch (error: any) {
      console.error("Error processing order:", error);
      toast.error("Error processing your order: " + (error.message || "Please try again"));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Redirect if cart is empty
  if (items.length === 0) {
    navigate(getStoreUrl("/cart"));
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={getStoreUrl("/cart")} 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Product Information & Review */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-6">Product Information & Review</h2>
              <p className="text-sm text-gray-600 mb-6">
                By placing your order, you agree to Storelo Inc's Privacy and Policy.
              </p>
              
              {/* Products */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.variant ? `Variant: ${item.variant.name}` : 'White'}
                      </p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery/Shipping Options */}
            <div>
              <h3 className="text-lg font-medium mb-4">Delivery/Shipping</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium">$4.99 • Fast Delivery</p>
                      <p className="text-sm text-gray-600">Get it by Tomorrow, 12 Oct 23</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-blue-600">Recommend</span>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                    <div>
                      <p className="font-medium">Free Delivery</p>
                      <p className="text-sm text-gray-600">Get it by Friday, 17 - 18 Oct 23</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Details */}
          <div className="bg-white rounded-lg p-8 border h-fit">
            <h2 className="text-xl font-semibold mb-2">Payment Details</h2>
            <p className="text-gray-600 text-sm mb-8">
              Complete your purchase by providing your payment details.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Address */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="berlydesign@gmail.com"
                  className="mt-2"
                  required
                />
              </div>

              {/* Payment Method Selection */}
              <div>
                <Label className="text-sm font-medium mb-4 block">Select Payment Method</Label>
                <RadioGroup 
                  value={formData.paymentMethod} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <Label htmlFor="card" className="flex-1">Debit / Credit Card</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="virtual" id="virtual" />
                    <Wallet className="h-5 w-5 text-gray-600" />
                    <Label htmlFor="virtual" className="flex-1">Virtual account</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Card Details */}
              {formData.paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardName" className="text-sm font-medium">Card Details</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="Barly Vallendito"
                      className="mt-2"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Input
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="8899 2893 7876 1112"
                      className="pr-12"
                      required
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <span className="text-xs font-medium text-blue-600">VISA</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="02 / 25"
                      required
                    />
                    <Input
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      placeholder="•••"
                      type="password"
                      required
                    />
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    Payment are secure and encrypted
                  </p>
                </div>
              )}

              {/* Billing Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Sub Total</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discount</span>
                  <span className="font-medium">$0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-3">
                  <span>Total</span>
                  <span>${totalCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 text-white py-3 text-base font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : `Pay $${totalCost.toFixed(2)} →`}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
