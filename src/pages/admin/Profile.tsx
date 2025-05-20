
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "Shop Owner",
    email: user?.email || "owner@example.com",
    phone: "+1 (555) 123-4567",
    company: "My E-Commerce Shop",
    address: "123 Main St, New York, NY 10001",
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailOrderUpdates: true,
    emailInventoryAlerts: true,
    emailNewsletter: false,
    smsOrderUpdates: false,
    smsInventoryAlerts: false,
  });
  
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };
  
  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };
  
  const handleNotificationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = e.target;
    setNotificationSettings({ ...notificationSettings, [name]: checked });
  };
  
  const handleSaveProfile = () => {
    // Here you would normally send the data to your API
    console.log("Profile Data:", profileData);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would normally send the data to your API
    console.log("Password Data:", passwordData);
    
    toast({
      title: "Password changed",
      description: "Your password has been changed successfully.",
    });
    
    // Reset password fields
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };
  
  const handleSaveNotifications = () => {
    // Here you would normally send the data to your API
    console.log("Notification Settings:", notificationSettings);
    
    toast({
      title: "Notification preferences updated",
      description: "Your notification preferences have been updated successfully.",
    });
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Account Profile</h1>
        
        <Tabs defaultValue="profile">
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="profile">Personal Information</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 py-4">
            <div className="bg-card rounded-lg shadow-custom p-6">
              <h2 className="text-lg font-bold mb-6">Personal Information</h2>
              
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center overflow-hidden">
                    <span className="text-3xl font-medium">
                      {profileData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  
                  <div className="space-y-1 mt-2">
                    <h3 className="font-medium">{profileData.name}</h3>
                    <p className="text-muted-foreground">{profileData.email}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      This information will be displayed on your invoices and receipts.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      name="company"
                      value={profileData.company}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Password Tab */}
          <TabsContent value="password" className="space-y-6 py-4">
            <div className="bg-card rounded-lg shadow-custom p-6">
              <h2 className="text-lg font-bold mb-6">Change Password</h2>
              
              <form
                onSubmit={handleChangePassword}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Password should be at least 8 characters with a mix of letters, numbers, and symbols.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div>
                  <Button type="submit">Update Password</Button>
                </div>
              </form>
            </div>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 py-4">
            <div className="bg-card rounded-lg shadow-custom p-6">
              <h2 className="text-lg font-bold mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-sm">Email Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="emailOrderUpdates"
                        className="font-medium"
                      >
                        Order Updates
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive emails about order status changes
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      id="emailOrderUpdates"
                      name="emailOrderUpdates"
                      checked={notificationSettings.emailOrderUpdates}
                      onChange={handleNotificationChange}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="emailInventoryAlerts"
                        className="font-medium"
                      >
                        Inventory Alerts
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive emails when inventory is low
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      id="emailInventoryAlerts"
                      name="emailInventoryAlerts"
                      checked={notificationSettings.emailInventoryAlerts}
                      onChange={handleNotificationChange}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="emailNewsletter"
                        className="font-medium"
                      >
                        Newsletter
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive monthly newsletter with tips and updates
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      id="emailNewsletter"
                      name="emailNewsletter"
                      checked={notificationSettings.emailNewsletter}
                      onChange={handleNotificationChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-sm">SMS Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="smsOrderUpdates"
                        className="font-medium"
                      >
                        Order Updates
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive text messages about order status changes
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      id="smsOrderUpdates"
                      name="smsOrderUpdates"
                      checked={notificationSettings.smsOrderUpdates}
                      onChange={handleNotificationChange}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="smsInventoryAlerts"
                        className="font-medium"
                      >
                        Inventory Alerts
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive text messages when inventory is low
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      id="smsInventoryAlerts"
                      name="smsInventoryAlerts"
                      checked={notificationSettings.smsInventoryAlerts}
                      onChange={handleNotificationChange}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveNotifications}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Profile;
