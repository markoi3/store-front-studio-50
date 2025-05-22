import { useState } from "react";
import { withStoreLayout } from "@/components/layout/StorePageLayout";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/hooks/useStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { getStoreUrl } = useStore();
  
  // Simplified shipping cost
  const shippingCost = subtotal > 100 ? 0 : 10;
  
  // Calculate total cost
  const totalCost = subtotal + shippingCost;
  
  const [formStep, setFormStep] = useState(1);
  
  // Form states
  const [shippingDetails, setShippingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "us",
  });
  
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvc: "",
  });
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStep(2);
    window.scrollTo(0, 0);
  };
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process payment (this would normally call a payment API)
    // For demo purposes, we'll just simulate a successful payment
    setFormStep(3);
    window.scrollTo(0, 0);
  };
  
  const handleOrderComplete = () => {
    clearCart();
    navigate(getStoreUrl("/thank-you"));
  };
  
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };
  
  // Redirect if cart is empty
  if (items.length === 0 && formStep !== 3) {
    navigate(getStoreUrl("/cart"));
    return null;
  }
  
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      
      {/* Checkout Steps */}
      <div className="flex mb-8">
        <div className={`flex-1 text-center pb-4 border-b-2 ${formStep >= 1 ? "border-primary" : "border-border"}`}>
          <span className={formStep >= 1 ? "font-medium" : "text-muted-foreground"}>
            1. Shipping
          </span>
        </div>
        <div className={`flex-1 text-center pb-4 border-b-2 ${formStep >= 2 ? "border-primary" : "border-border"}`}>
          <span className={formStep >= 2 ? "font-medium" : "text-muted-foreground"}>
            2. Payment
          </span>
        </div>
        <div className={`flex-1 text-center pb-4 border-b-2 ${formStep >= 3 ? "border-primary" : "border-border"}`}>
          <span className={formStep >= 3 ? "font-medium" : "text-muted-foreground"}>
            3. Confirmation
          </span>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Step 1: Shipping Details */}
          {formStep === 1 && (
            <div className="bg-card rounded-lg shadow-custom p-6">
              <h2 className="text-lg font-bold mb-4">Shipping Information</h2>
              
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={shippingDetails.firstName}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={shippingDetails.lastName}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={shippingDetails.email}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={shippingDetails.phone}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={shippingDetails.address}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingDetails.city}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={shippingDetails.state}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={shippingDetails.postalCode}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={shippingDetails.country}
                    onValueChange={(value) =>
                      setShippingDetails({ ...shippingDetails, country: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="w-full">
                    Continue to Payment
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {/* Step 2: Payment */}
          {formStep === 2 && (
            <div className="bg-card rounded-lg shadow-custom p-6">
              <h2 className="text-lg font-bold mb-4">Payment Method</h2>
              
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem id="credit-card" value="credit-card" />
                    <Label htmlFor="credit-card">Credit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem id="paypal" value="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="bank-transfer" value="bank-transfer" />
                    <Label htmlFor="bank-transfer">Bank Transfer</Label>
                  </div>
                </RadioGroup>
                
                {paymentMethod === "credit-card" && (
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={handleCardChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        placeholder="John Doe"
                        value={cardDetails.cardName}
                        onChange={handleCardChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={cardDetails.expiryDate}
                          onChange={handleCardChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          name="cvc"
                          placeholder="123"
                          value={cardDetails.cvc}
                          onChange={handleCardChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormStep(1)}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    Place Order
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {/* Step 3: Confirmation */}
          {formStep === 3 && (
            <div className="bg-card rounded-lg shadow-custom p-6 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-8 h-8 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for your purchase. Your order has been placed and
                will be processed soon.
              </p>
              <div className="mb-6">
                <p className="font-medium">Order Number</p>
                <p className="text-muted-foreground">
                  #{Math.floor(100000 + Math.random() * 900000)}
                </p>
              </div>
              <Button onClick={handleOrderComplete}>
                Complete Purchase
              </Button>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="w-full lg:w-80">
          <div className="bg-card rounded-lg shadow-custom p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shippingCost === 0
                    ? "Free"
                    : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withStoreLayout(Checkout);
