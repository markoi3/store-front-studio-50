import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { user, updateStoreSettings } = useAuth();

  const [storeInfo, setStoreInfo] = useState({
    name: "",
    slug: "",
  });
  
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

  const [contentSettings, setContentSettings] = useState({
    aboutUs: "",
    privacyPolicy: "",
    contactInfo: ""
  });
  
  const [isUpdatingStore, setIsUpdatingStore] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Load store information when component mounts
  useEffect(() => {
    if (user?.store) {
      setStoreInfo({
        name: user.store.name || "",
        slug: user.store.slug || ""
      });

      // Load content settings from store
      if (user.store.settings) {
        setContentSettings({
          aboutUs: user.store.settings.aboutUs || "",
          privacyPolicy: user.store.settings.privacyPolicy || "",
          contactInfo: user.store.settings.contactInfo || ""
        });
        
        // Load other settings if they exist in the store settings
        if (user.store.settings.storeSettings) {
          setStoreSettings(user.store.settings.storeSettings);
        }
        
        if (user.store.settings.paymentSettings) {
          setPaymentSettings(user.store.settings.paymentSettings);
        }
        
        if (user.store.settings.shippingSettings) {
          setShippingSettings(user.store.settings.shippingSettings);
        }
        
        if (user.store.settings.taxSettings) {
          setTaxSettings(user.store.settings.taxSettings);
        }
      }
    }
  }, [user]);
  
  const handleStoreInfoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setStoreInfo({ ...storeInfo, [name]: value });
  };

  const handleContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContentSettings({ ...contentSettings, [name]: value });
  };
  
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
  
  const handleUpdateStoreInfo = async () => {
    if (!user?.store) return;
    
    setIsUpdatingStore(true);
    try {
      // Validate store slug
      const slug = storeInfo.slug.toLowerCase().trim().replace(/[^a-z0-9\-]/g, '-');
      
      if (slug !== user.store.slug) {
        // Check if slug is already taken
        const { data: existingStore, error: slugCheckError } = await supabase
          .from('stores')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();
        
        if (slugCheckError) {
          throw new Error(slugCheckError.message);
        }
        
        if (existingStore) {
          toast.error("This store URL is already taken. Please choose another one.");
          setIsUpdatingStore(false);
          return;
        }
      }
      
      // Update store info
      const { error } = await supabase
        .from('stores')
        .update({
          name: storeInfo.name,
          slug: slug
        })
        .eq('id', user.store.id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("Store information updated successfully!");
      
      // Refresh the page to update user context
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Error updating store information: " + (error as Error).message);
    } finally {
      setIsUpdatingStore(false);
    }
  };
  
  const handleSaveSettings = async () => {
    if (!user?.store) {
      toast.error("No store found for your account");
      return;
    }
    
    setIsSavingSettings(true);
    try {
      // Combine all settings into one object
      const combinedSettings = {
        aboutUs: contentSettings.aboutUs,
        privacyPolicy: contentSettings.privacyPolicy,
        contactInfo: contentSettings.contactInfo,
        storeSettings,
        paymentSettings,
        shippingSettings,
        taxSettings,
        menuItems: user.store.settings?.menuItems || [
          { id: "1", label: "Početna", url: "/" },
          { id: "2", label: "Proizvodi", url: "/shop" },
          { id: "3", label: "O nama", url: "/about" },
          { id: "4", label: "Kontakt", url: "/contact" }
        ]
      };
      
      // Update the database
      const { error } = await supabase
        .from('stores')
        .update({
          settings: combinedSettings
        })
        .eq('id', user.store.id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update the local context without causing infinite loop
      if (updateStoreSettings) {
        await updateStoreSettings(combinedSettings);
      }
      
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings: " + (error as Error).message);
    } finally {
      setIsSavingSettings(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Store Settings</h1>
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSavingSettings}
          >
            {isSavingSettings ? "Saving..." : "Save Settings"}
          </Button>
        </div>
        
        {/* Store Information Section */}
        <div className="bg-card rounded-lg shadow-custom p-6 space-y-4">
          <h2 className="text-lg font-bold">Store Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input
                id="name"
                name="name"
                value={storeInfo.name}
                onChange={handleStoreInfoChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Store URL</Label>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">/store/</span>
                <Input
                  id="slug"
                  name="slug"
                  value={storeInfo.slug}
                  onChange={handleStoreInfoChange}
                  placeholder="my-store"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This will be the URL of your store: /store/{storeInfo.slug}
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleUpdateStoreInfo}
            disabled={isUpdatingStore}
          >
            {isUpdatingStore ? "Updating..." : "Update Store Info"}
          </Button>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="tax">Tax</TabsTrigger>
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
          
          {/* Content Settings */}
          <TabsContent value="content" className="space-y-6 py-4">
            <div className="bg-card rounded-lg shadow-custom p-6">
              <h2 className="text-lg font-bold mb-6">Store Content</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="aboutUs">About Us</Label>
                  <Textarea
                    id="aboutUs"
                    name="aboutUs"
                    rows={6}
                    placeholder="Tell customers about your business..."
                    value={contentSettings.aboutUs}
                    onChange={handleContentChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="privacyPolicy">Privacy Policy</Label>
                  <Textarea
                    id="privacyPolicy"
                    name="privacyPolicy"
                    rows={10}
                    placeholder="Your store's privacy policy..."
                    value={contentSettings.privacyPolicy}
                    onChange={handleContentChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactInfo">Contact Information</Label>
                  <Textarea
                    id="contactInfo"
                    name="contactInfo"
                    rows={4}
                    placeholder="Additional contact information for your customers..."
                    value={contentSettings.contactInfo}
                    onChange={handleContentChange}
                  />
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
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
