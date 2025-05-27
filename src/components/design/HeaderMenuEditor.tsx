import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, GripVertical, ChevronDown, ChevronRight } from "lucide-react";
import { HeaderSettings, HeaderMenuItem, CallToActionButton, PromotionalBar, defaultHeaderSettings } from "@/types/header";

const HeaderMenuEditor = () => {
  const { user, updateStoreSettings } = useAuth();
  const [headerSettings, setHeaderSettings] = useState<HeaderSettings>(defaultHeaderSettings);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("layout");

  useEffect(() => {
    if (user?.store?.settings?.header) {
      setHeaderSettings({ ...defaultHeaderSettings, ...user.store.settings.header });
    } else {
      // Migrate existing menu items if they exist
      const existingMenuItems = user?.store?.settings?.menuItems;
      if (existingMenuItems && Array.isArray(existingMenuItems)) {
        setHeaderSettings(prev => ({
          ...prev,
          menuItems: existingMenuItems.map(item => ({
            ...item,
            type: 'link' as const
          }))
        }));
      }
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Auto-add custom pages if enabled
      let updatedMenuItems = [...headerSettings.menuItems];
      
      if (headerSettings.autoAddCustomPages && user?.store?.settings?.customPages) {
        const customPages = user.store.settings.customPages;
        
        customPages.forEach(page => {
          const pageUrl = `/page/${page.slug}`;
          const existingMenuItem = updatedMenuItems.find(item => item.url === pageUrl);
          
          if (!existingMenuItem) {
            updatedMenuItems.push({
              id: `custom-page-${page.id}`,
              label: page.title,
              url: pageUrl,
              type: 'link'
            });
          }
        });
      }

      const updatedSettings = {
        ...headerSettings,
        menuItems: updatedMenuItems
      };

      await updateStoreSettings({
        ...user?.store?.settings,
        header: updatedSettings,
        // Keep legacy menuItems for backward compatibility
        menuItems: updatedMenuItems
      });

      setHeaderSettings(updatedSettings);
      toast.success("Header settings saved successfully");
    } catch (error) {
      console.error("Error saving header settings:", error);
      toast.error("Failed to save header settings");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenuItem = () => {
    const newItem: HeaderMenuItem = {
      id: `item-${Date.now()}`,
      label: "New Item",
      url: "/new-page",
      type: 'link'
    };

    setHeaderSettings(prev => ({
      ...prev,
      menuItems: [...prev.menuItems, newItem]
    }));
  };

  const handleUpdateMenuItem = (id: string, updates: Partial<HeaderMenuItem>) => {
    setHeaderSettings(prev => ({
      ...prev,
      menuItems: prev.menuItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  const handleRemoveMenuItem = (id: string) => {
    setHeaderSettings(prev => ({
      ...prev,
      menuItems: prev.menuItems.filter(item => item.id !== id)
    }));
  };

  const handleMoveMenuItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === headerSettings.menuItems.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedItems = [...headerSettings.menuItems];
    [updatedItems[index], updatedItems[newIndex]] = [updatedItems[newIndex], updatedItems[index]];

    setHeaderSettings(prev => ({
      ...prev,
      menuItems: updatedItems
    }));
  };

  const handleAddCTAButton = () => {
    const newButton: CallToActionButton = {
      id: `cta-${Date.now()}`,
      text: "Get Started",
      url: "/shop",
      style: 'primary'
    };

    setHeaderSettings(prev => ({
      ...prev,
      ctaButtons: [...prev.ctaButtons, newButton]
    }));
  };

  const handleUpdateCTAButton = (id: string, updates: Partial<CallToActionButton>) => {
    setHeaderSettings(prev => ({
      ...prev,
      ctaButtons: prev.ctaButtons.map(button =>
        button.id === id ? { ...button, ...updates } : button
      )
    }));
  };

  const handleRemoveCTAButton = (id: string) => {
    setHeaderSettings(prev => ({
      ...prev,
      ctaButtons: prev.ctaButtons.filter(button => button.id !== id)
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Header Menu Designer</CardTitle>
              <p className="text-muted-foreground">
                Customize your store's header navigation, layout, and branding
              </p>
            </div>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
              <TabsTrigger value="logo">Logo</TabsTrigger>
              <TabsTrigger value="cta">CTA Buttons</TabsTrigger>
              <TabsTrigger value="promo">Promo Bar</TabsTrigger>
              <TabsTrigger value="styling">Styling</TabsTrigger>
            </TabsList>

            <TabsContent value="layout" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Header Layout</Label>
                  <Select
                    value={headerSettings.layout}
                    onValueChange={(value: any) => setHeaderSettings(prev => ({ ...prev, layout: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="centered">Centered</SelectItem>
                      <SelectItem value="split">Split</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Header Height (px)</Label>
                  <Input
                    type="number"
                    value={headerSettings.height}
                    onChange={(e) => setHeaderSettings(prev => ({ ...prev, height: parseInt(e.target.value) || 64 }))}
                    min="40"
                    max="120"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={headerSettings.sticky}
                  onCheckedChange={(checked) => setHeaderSettings(prev => ({ ...prev, sticky: checked }))}
                />
                <Label>Sticky Header</Label>
              </div>

              <div>
                <Label>Mobile Breakpoint (px)</Label>
                <Input
                  type="number"
                  value={headerSettings.mobileBreakpoint}
                  onChange={(e) => setHeaderSettings(prev => ({ ...prev, mobileBreakpoint: parseInt(e.target.value) || 768 }))}
                />
              </div>
            </TabsContent>

            <TabsContent value="navigation" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Navigation Position</Label>
                  <Select
                    value={headerSettings.navigation.position}
                    onValueChange={(value: any) => setHeaderSettings(prev => ({
                      ...prev,
                      navigation: { ...prev.navigation, position: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Navigation Style</Label>
                  <Select
                    value={headerSettings.navigation.style}
                    onValueChange={(value: any) => setHeaderSettings(prev => ({
                      ...prev,
                      navigation: { ...prev.navigation, style: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="horizontal">Horizontal</SelectItem>
                      <SelectItem value="dropdown">Dropdown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={headerSettings.navigation.showIcons}
                  onCheckedChange={(checked) => setHeaderSettings(prev => ({
                    ...prev,
                    navigation: { ...prev.navigation, showIcons: checked }
                  }))}
                />
                <Label>Show Icons in Navigation</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={headerSettings.autoAddCustomPages}
                  onCheckedChange={(checked) => setHeaderSettings(prev => ({ ...prev, autoAddCustomPages: checked }))}
                />
                <Label>Auto-add Custom Pages to Menu</Label>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Menu Items</h4>
                  <Button onClick={handleAddMenuItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                {headerSettings.menuItems.map((item, index) => (
                  <Card key={item.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveMenuItem(index, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveMenuItem(index, 'down')}
                            disabled={index === headerSettings.menuItems.length - 1}
                          >
                            ↓
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveMenuItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Label</Label>
                          <Input
                            value={item.label}
                            onChange={(e) => handleUpdateMenuItem(item.id, { label: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>URL</Label>
                          <Input
                            value={item.url}
                            onChange={(e) => handleUpdateMenuItem(item.id, { url: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Type</Label>
                          <Select
                            value={item.type}
                            onValueChange={(value: any) => handleUpdateMenuItem(item.id, { type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="link">Link</SelectItem>
                              <SelectItem value="dropdown">Dropdown</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Icon (Optional)</Label>
                          <Input
                            value={item.icon || ''}
                            onChange={(e) => handleUpdateMenuItem(item.id, { icon: e.target.value })}
                            placeholder="home, shopping-cart, etc."
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={item.openInNewTab || false}
                          onCheckedChange={(checked) => handleUpdateMenuItem(item.id, { openInNewTab: checked })}
                        />
                        <Label>Open in New Tab</Label>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="logo" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Logo Position</Label>
                  <Select
                    value={headerSettings.logo.position}
                    onValueChange={(value: any) => setHeaderSettings(prev => ({
                      ...prev,
                      logo: { ...prev.logo, position: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Logo URL</Label>
                <Input
                  value={headerSettings.logo.url || ''}
                  onChange={(e) => setHeaderSettings(prev => ({
                    ...prev,
                    logo: { ...prev.logo, url: e.target.value }
                  }))}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <Label>Alt Text</Label>
                <Input
                  value={headerSettings.logo.alt || ''}
                  onChange={(e) => setHeaderSettings(prev => ({
                    ...prev,
                    logo: { ...prev.logo, alt: e.target.value }
                  }))}
                  placeholder="Company Logo"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Width (px)</Label>
                  <Input
                    type="number"
                    value={headerSettings.logo.width || 120}
                    onChange={(e) => setHeaderSettings(prev => ({
                      ...prev,
                      logo: { ...prev.logo, width: parseInt(e.target.value) || 120 }
                    }))}
                  />
                </div>
                <div>
                  <Label>Height (px)</Label>
                  <Input
                    type="number"
                    value={headerSettings.logo.height || 40}
                    onChange={(e) => setHeaderSettings(prev => ({
                      ...prev,
                      logo: { ...prev.logo, height: parseInt(e.target.value) || 40 }
                    }))}
                  />
                </div>
              </div>

              {headerSettings.logo.url && (
                <div className="border rounded-md p-4 flex justify-center">
                  <img
                    src={headerSettings.logo.url}
                    alt={headerSettings.logo.alt || "Logo preview"}
                    style={{
                      width: headerSettings.logo.width,
                      height: headerSettings.logo.height,
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x80?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="cta" className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Call-to-Action Buttons</h4>
                <Button onClick={handleAddCTAButton} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add CTA Button
                </Button>
              </div>

              {headerSettings.ctaButtons.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-md text-muted-foreground">
                  No CTA buttons yet. Click "Add CTA Button" to create one.
                </div>
              ) : (
                <div className="space-y-4">
                  {headerSettings.ctaButtons.map((button) => (
                    <Card key={button.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{button.text}</span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveCTAButton(button.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Button Text</Label>
                            <Input
                              value={button.text}
                              onChange={(e) => handleUpdateCTAButton(button.id, { text: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>URL</Label>
                            <Input
                              value={button.url}
                              onChange={(e) => handleUpdateCTAButton(button.id, { url: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Style</Label>
                            <Select
                              value={button.style}
                              onValueChange={(value: any) => handleUpdateCTAButton(button.id, { style: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="primary">Primary</SelectItem>
                                <SelectItem value="secondary">Secondary</SelectItem>
                                <SelectItem value="outline">Outline</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Icon (Optional)</Label>
                            <Input
                              value={button.icon || ''}
                              onChange={(e) => handleUpdateCTAButton(button.id, { icon: e.target.value })}
                              placeholder="shopping-cart, arrow-right, etc."
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={button.openInNewTab || false}
                            onCheckedChange={(checked) => handleUpdateCTAButton(button.id, { openInNewTab: checked })}
                          />
                          <Label>Open in New Tab</Label>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="promo" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={headerSettings.promotionalBar.enabled}
                  onCheckedChange={(checked) => setHeaderSettings(prev => ({
                    ...prev,
                    promotionalBar: { ...prev.promotionalBar, enabled: checked }
                  }))}
                />
                <Label>Enable Promotional Bar</Label>
              </div>

              {headerSettings.promotionalBar.enabled && (
                <div className="space-y-4">
                  <div>
                    <Label>Promotional Text</Label>
                    <Input
                      value={headerSettings.promotionalBar.text}
                      onChange={(e) => setHeaderSettings(prev => ({
                        ...prev,
                        promotionalBar: { ...prev.promotionalBar, text: e.target.value }
                      }))}
                      placeholder="Free shipping on orders over $50!"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Background Color</Label>
                      <Input
                        type="color"
                        value={headerSettings.promotionalBar.backgroundColor}
                        onChange={(e) => setHeaderSettings(prev => ({
                          ...prev,
                          promotionalBar: { ...prev.promotionalBar, backgroundColor: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label>Text Color</Label>
                      <Input
                        type="color"
                        value={headerSettings.promotionalBar.textColor}
                        onChange={(e) => setHeaderSettings(prev => ({
                          ...prev,
                          promotionalBar: { ...prev.promotionalBar, textColor: e.target.value }
                        }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Link Text (Optional)</Label>
                      <Input
                        value={headerSettings.promotionalBar.linkText || ''}
                        onChange={(e) => setHeaderSettings(prev => ({
                          ...prev,
                          promotionalBar: { ...prev.promotionalBar, linkText: e.target.value }
                        }))}
                        placeholder="Shop Now"
                      />
                    </div>
                    <div>
                      <Label>Link URL (Optional)</Label>
                      <Input
                        value={headerSettings.promotionalBar.linkUrl || ''}
                        onChange={(e) => setHeaderSettings(prev => ({
                          ...prev,
                          promotionalBar: { ...prev.promotionalBar, linkUrl: e.target.value }
                        }))}
                        placeholder="/shop"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={headerSettings.promotionalBar.closeable}
                      onCheckedChange={(checked) => setHeaderSettings(prev => ({
                        ...prev,
                        promotionalBar: { ...prev.promotionalBar, closeable: checked }
                      }))}
                    />
                    <Label>Allow users to close the bar</Label>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="styling" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Background Color</Label>
                  <Input
                    type="color"
                    value={headerSettings.backgroundColor}
                    onChange={(e) => setHeaderSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Text Color</Label>
                  <Input
                    type="color"
                    value={headerSettings.textColor}
                    onChange={(e) => setHeaderSettings(prev => ({ ...prev, textColor: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Custom CSS</Label>
                <Textarea
                  value={headerSettings.customCss || ''}
                  onChange={(e) => setHeaderSettings(prev => ({ ...prev, customCss: e.target.value }))}
                  placeholder="/* Add custom CSS here */"
                  rows={6}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Add custom CSS to further customize the header appearance
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeaderMenuEditor;
