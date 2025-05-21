import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StoreBuilder } from "@/components/design/StoreBuilder";
import { toast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const [menuItems, setMenuItems] = useState<any[]>([]);
  
  const [storeSettings, setStoreSettings] = useState({
    storeName: "My E-Shop",
    storeEmail: "contact@myeshop.com",
    storePhone: "+1 (555) 123-4567",
    storeAddress: "123 Main St, New York, NY 10001, USA",
    currency: "usd",
    weightUnit: "kg",
    timezone: "America/New_York",
  });
  
  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: false,
    stripePublicKey: "",
    stripeSecretKey: "",
    
    paypalEnabled: false,
    paypalClientId: "",
    paypalSecretKey: "",
    
    bankTransferEnabled: true,
    bankName: "Example Bank",
    accountNumber: "123456789",
    accountName: "My Store",
    bankInstructions: "Please include your order number in the payment reference.",
  });
  
  const [shippingSettings, setShippingSettings] = useState({
    flatRateEnabled: true,
    flatRateAmount: "10",
    
    freeShippingEnabled: true,
    freeShippingThreshold: "100",
    
    localPickupEnabled: false,
    localPickupAddress: "",
    localPickupInstructions: "",
  });
  
  const [taxSettings, setTaxSettings] = useState({
    taxEnabled: true,
    taxRate: "10",
    taxIncludedInPrices: false,
  });

  useEffect(() => {
    // Load menu items from localStorage
    const storedMenuItems = localStorage.getItem("storeMenuItems");
    if (storedMenuItems) {
      setMenuItems(JSON.parse(storedMenuItems));
    } else {
      // Set default menu items if none exist
      const defaultMenuItems = [
        { id: "1", label: "Početna", url: "/" },
        { id: "2", label: "Proizvodi", url: "/shop" },
        { id: "3", label: "O nama", url: "/about" },
        { id: "4", label: "Kontakt", url: "/contact" }
      ];
      setMenuItems(defaultMenuItems);
      localStorage.setItem("storeMenuItems", JSON.stringify(defaultMenuItems));
    }
  }, []);
  
  const handleStoreChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStoreSettings({ ...storeSettings, [name]: value });
  };
  
  const handleStoreSelectChange = (name: string, value: string) => {
    setStoreSettings({ ...storeSettings, [name]: value });
  };
  
  const handlePaymentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPaymentSettings({ ...paymentSettings, [name]: value });
  };
  
  const handlePaymentSwitchChange = (name: string, checked: boolean) => {
    setPaymentSettings({ ...paymentSettings, [name]: checked });
  };
  
  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setShippingSettings({ ...shippingSettings, [name]: value });
  };
  
  const handleShippingSwitchChange = (name: string, checked: boolean) => {
    setShippingSettings({ ...shippingSettings, [name]: checked });
  };
  
  const handleTaxChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTaxSettings({ ...taxSettings, [name]: value });
  };
  
  const handleTaxSwitchChange = (name: string, checked: boolean) => {
    setTaxSettings({ ...taxSettings, [name]: checked });
  };

  // Menu editor functionality
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  
  const handleAddItem = () => {
    if (!newLabel || !newUrl) return;
    
    const newItem = {
      id: Date.now().toString(),
      label: newLabel,
      url: newUrl.startsWith("/") ? newUrl : "/" + newUrl
    };
    
    const updatedItems = [...menuItems, newItem];
    setMenuItems(updatedItems);
    localStorage.setItem("storeMenuItems", JSON.stringify(updatedItems));
    
    setNewLabel("");
    setNewUrl("");
  };
  
  const handleRemoveItem = (id: string) => {
    const updatedItems = menuItems.filter(item => item.id !== id);
    setMenuItems(updatedItems);
    localStorage.setItem("storeMenuItems", JSON.stringify(updatedItems));
  };
  
  const handleMoveItem = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === menuItems.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedItems = [...menuItems];
    [updatedItems[index], updatedItems[newIndex]] = [updatedItems[newIndex], updatedItems[index]];
    
    setMenuItems(updatedItems);
    localStorage.setItem("storeMenuItems", JSON.stringify(updatedItems));
  };
  
  const handleSaveSettings = () => {
    // Here you would normally send the data to your API
    console.log("Store Settings:", storeSettings);
    console.log("Payment Settings:", paymentSettings);
    console.log("Shipping Settings:", shippingSettings);
    console.log("Tax Settings:", taxSettings);
    console.log("Menu Items:", menuItems);
    
    toast({
      title: "Settings saved",
      description: "Your store settings have been updated successfully.",
    });
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Store Settings</h1>
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="tax">Tax</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general" className="space-y-6 py-4">
            <div className="bg-card rounded-lg shadow-custom p-6">
              <h2 className="text-lg font-bold mb-6">Store Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      name="storeName"
                      value={storeSettings.storeName}
                      onChange={handleStoreChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="storeEmail">Email</Label>
                    <Input
                      id="storeEmail"
                      name="storeEmail"
                      type="email"
                      value={storeSettings.storeEmail}
                      onChange={handleStoreChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="storePhone">Phone</Label>
                    <Input
                      id="storePhone"
                      name="storePhone"
                      value={storeSettings.storePhone}
                      onChange={handleStoreChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeAddress">Address</Label>
                    <Textarea
                      id="storeAddress"
                      name="storeAddress"
                      rows={4}
                      value={storeSettings.storeAddress}
                      onChange={handleStoreChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg shadow-custom p-6">
              <h2 className="text-lg font-bold mb-6">Regional Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={storeSettings.currency}
                    onValueChange={(value) => handleStoreSelectChange("currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="cad">CAD (CA$)</SelectItem>
                      <SelectItem value="aud">AUD (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weightUnit">Weight Unit</Label>
                  <Select
                    value={storeSettings.weightUnit}
                    onValueChange={(value) => handleStoreSelectChange("weightUnit", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select weight unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="lb">Pounds (lb)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={storeSettings.timezone}
                    onValueChange={(value) => handleStoreSelectChange("timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Payment Settings */}
          <TabsContent value="payment" className="space-y-6 py-4">
            <div className="bg-card rounded-lg shadow-custom p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Stripe</h2>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="stripeEnabled"
                    checked={paymentSettings.stripeEnabled}
                    onCheckedChange={(checked) =>
                      handlePaymentSwitchChange("stripeEnabled", checked)
                    }
                  />
                  <Label htmlFor="stripeEnabled">Enable Stripe</Label>
                </div>
              </div>
              
              {paymentSettings.stripeEnabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripePublicKey">Stripe Public Key</Label>
                    <Input
                      id="stripePublicKey"
                      name="stripePublicKey"
                      value={paymentSettings.stripePublicKey}
                      onChange={handlePaymentChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                    <Input
                      id="stripeSecretKey"
                      name="stripeSecretKey"
                      type="password"
                      value={paymentSettings.stripeSecretKey}
                      onChange={handlePaymentChange}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-card rounded-lg shadow-custom p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">PayPal</h2>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="paypalEnabled"
                    checked={paymentSettings.paypalEnabled}
                    onCheckedChange={(checked) =>
                      handlePaymentSwitchChange("paypalEnabled", checked)
                    }
                  />
                  <Label htmlFor="paypalEnabled">Enable PayPal</Label>
                </div>
              </div>
              
              {paymentSettings.paypalEnabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paypalClientId">PayPal Client ID</Label>
                    <Input
                      id="paypalClientId"
                      name="paypalClientId"
                      value={paymentSettings.paypalClientId}
                      onChange={handlePaymentChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paypalSecretKey">PayPal Secret Key</Label>
                    <Input
                      id="paypalSecretKey"
                      name="paypalSecretKey"
                      type="password"
                      value={paymentSettings.paypalSecretKey}
                      onChange={handlePaymentChange}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-card rounded-lg shadow-custom p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Bank Transfer</h2>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="bankTransferEnabled"
                    checked={paymentSettings.bankTransferEnabled}
                    onCheckedChange={(checked) =>
                      handlePaymentSwitchChange("bankTransferEnabled", checked)
                    }
                  />
                  <Label htmlFor="bankTransferEnabled">Enable Bank Transfer</Label>
                </div>
              </div>
              
              {paymentSettings.bankTransferEnabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      name="bankName"
                      value={paymentSettings.bankName}
                      onChange={handlePaymentChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        value={paymentSettings.accountNumber}
                        onChange={handlePaymentChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Account Name</Label>
                      <Input
                        id="accountName"
                        name="accountName"
                        value={paymentSettings.accountName}
                        onChange={handlePaymentChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bankInstructions">Instructions for Customer</Label>
                    <Textarea
                      id="bankInstructions"
                      name="bankInstructions"
                      rows={3}
                      value={paymentSettings.bankInstructions}
                      onChange={handlePaymentChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Shipping Settings */}
          <TabsContent value="shipping" className="space-y-6 py-4">
            <div className="bg-card rounded-lg shadow-custom p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Flat Rate Shipping</h2>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="flatRateEnabled"
                    checked={shippingSettings.flatRateEnabled}
                    onCheckedChange={(checked) =>
                      handleShippingSwitchChange("flatRateEnabled", checked)
                    }
                  />
                  <Label htmlFor="flatRateEnabled">Enable Flat Rate</Label>
                </div>
              </div>
              
              {shippingSettings.flatRateEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="flatRateAmount">Flat Rate Amount ($)</Label>
                  <Input
                    id="flatRateAmount"
                    name="flatRateAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={shippingSettings.flatRateAmount}
                    onChange={handleShippingChange}
                  />
                </div>
              )}
            </div>
            
            <div className="bg-card rounded-lg shadow-custom p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Free Shipping</h2>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="freeShippingEnabled"
                    checked={shippingSettings.freeShippingEnabled}
                    onCheckedChange={(checked) =>
                      handleShippingSwitchChange("freeShippingEnabled", checked)
                    }
                  />
                  <Label htmlFor="freeShippingEnabled">Enable Free Shipping</Label>
                </div>
              </div>
              
              {shippingSettings.freeShippingEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">
                    Minimum Order Amount for Free Shipping ($)
                  </Label>
                  <Input
                    id="freeShippingThreshold"
                    name="freeShippingThreshold"
                    type="number"
                    min="0"
                    step="0.01"
                    value={shippingSettings.freeShippingThreshold}
                    onChange={handleShippingChange}
                  />
                </div>
              )}
            </div>
            
            <div className="bg-card rounded-lg shadow-custom p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Local Pickup</h2>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="localPickupEnabled"
                    checked={shippingSettings.localPickupEnabled}
                    onCheckedChange={(checked) =>
                      handleShippingSwitchChange("localPickupEnabled", checked)
                    }
                  />
                  <Label htmlFor="localPickupEnabled">Enable Local Pickup</Label>
                </div>
              </div>
              
              {shippingSettings.localPickupEnabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="localPickupAddress">Pickup Address</Label>
                    <Textarea
                      id="localPickupAddress"
                      name="localPickupAddress"
                      rows={3}
                      value={shippingSettings.localPickupAddress}
                      onChange={handleShippingChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="localPickupInstructions">Pickup Instructions</Label>
                    <Textarea
                      id="localPickupInstructions"
                      name="localPickupInstructions"
                      rows={3}
                      value={shippingSettings.localPickupInstructions}
                      onChange={handleShippingChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Tax Settings */}
          <TabsContent value="tax" className="space-y-6 py-4">
            <div className="bg-card rounded-lg shadow-custom p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Tax Settings</h2>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="taxEnabled"
                    checked={taxSettings.taxEnabled}
                    onCheckedChange={(checked) =>
                      handleTaxSwitchChange("taxEnabled", checked)
                    }
                  />
                  <Label htmlFor="taxEnabled">Enable Tax</Label>
                </div>
              </div>
              
              {taxSettings.taxEnabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      name="taxRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={taxSettings.taxRate}
                      onChange={handleTaxChange}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="taxIncludedInPrices"
                      checked={taxSettings.taxIncludedInPrices}
                      onCheckedChange={(checked) =>
                        handleTaxSwitchChange("taxIncludedInPrices", checked)
                      }
                    />
                    <Label htmlFor="taxIncludedInPrices">
                      Prices are inclusive of tax
                    </Label>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Design Tab */}
          <TabsContent value="design" className="space-y-6 py-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Store Design</h2>
              </div>
              
              <Tabs defaultValue="builder" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="builder">Page Elements</TabsTrigger>
                  <TabsTrigger value="menu">Menu</TabsTrigger>
                </TabsList>
                
                <TabsContent value="builder" className="space-y-4">
                  <StoreBuilder />
                </TabsContent>
                
                <TabsContent value="menu" className="space-y-4">
                  <div className="bg-card p-6 rounded-lg shadow-sm space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Edit Menu</h3>
                      <p className="text-muted-foreground mb-4">
                        Add, remove, or change the order of links in your store's navigation menu.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium text-sm">Name</div>
                        <div className="font-medium text-sm">URL</div>
                        <div className="font-medium text-sm text-right">Actions</div>
                      </div>
                      
                      {menuItems.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-3 gap-4 items-center p-3 border rounded-md bg-background">
                          <div>{item.label}</div>
                          <div className="text-muted-foreground">{item.url}</div>
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleMoveItem(index, "up")}
                              disabled={index === 0}
                              className="p-1 rounded hover:bg-accent disabled:opacity-50"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => handleMoveItem(index, "down")}
                              disabled={index === menuItems.length - 1}
                              className="p-1 rounded hover:bg-accent disabled:opacity-50"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1 rounded hover:bg-red-100 text-red-600"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Add new link</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="newLabel" className="block text-sm mb-1">Name</label>
                          <Input
                            id="newLabel"
                            type="text"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            className="w-full"
                            placeholder="e.g., About Us"
                          />
                        </div>
                        <div>
                          <label htmlFor="newUrl" className="block text-sm mb-1">URL</label>
                          <Input
                            id="newUrl"
                            type="text"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            className="w-full"
                            placeholder="e.g., /about"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleAddItem}
                        disabled={!newLabel || !newUrl}
                        className="mt-4"
                      >
                        Add Link
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
