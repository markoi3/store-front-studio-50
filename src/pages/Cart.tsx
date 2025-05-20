
import { ShopLayout } from "@/components/layout/ShopLayout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { Trash } from "lucide-react";

const Cart = () => {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  
  // Calculate shipping cost (simplified example)
  const shippingCost = subtotal > 100 ? 0 : 10;
  
  // Calculate total cost
  const totalCost = subtotal + shippingCost;
  
  if (items.length === 0) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
          <div className="bg-card p-8 rounded-lg shadow-custom text-center">
            <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </ShopLayout>
    );
  }
  
  return (
    <ShopLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-card rounded-lg shadow-custom overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span>Item</span>
                  <div className="flex space-x-16">
                    <span className="hidden md:block">Price</span>
                    <span>Quantity</span>
                    <span className="hidden md:block">Total</span>
                    <span></span>
                  </div>
                </div>
              </div>
              
              {items.map((item) => (
                <div key={item.id} className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-accent rounded-md overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        {item.variant && (
                          <p className="text-sm text-muted-foreground">
                            Variant: {item.variant.name}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground md:hidden">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-16">
                      <span className="hidden md:block">
                        ${item.price.toFixed(2)}
                      </span>
                      
                      <div className="flex items-center">
                        <button
                          className="w-8 h-8 rounded-l-md border border-input bg-background flex items-center justify-center hover:bg-accent"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <div className="w-10 h-8 border-t border-b border-input flex items-center justify-center">
                          {item.quantity}
                        </div>
                        <button
                          className="w-8 h-8 rounded-r-md border border-input bg-background flex items-center justify-center hover:bg-accent"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      <span className="hidden md:block">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      
                      <button
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="p-6 flex justify-between">
                <Button variant="outline" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Link to="/shop">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-card rounded-lg shadow-custom p-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
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
              
              <Link to="/checkout">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};

export default Cart;
