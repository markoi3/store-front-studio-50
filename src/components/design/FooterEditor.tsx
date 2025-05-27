
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, GripVertical, CreditCard, Shield, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { FooterSettings, FooterColumn, FooterLink, SocialMediaLink, TrustBadge } from "@/types/footer";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const FooterEditor = () => {
  const { user, updateStoreSettings } = useAuth();
  const [footerSettings, setFooterSettings] = useState<FooterSettings>({
    enabled: true,
    copyrightText: `© ${new Date().getFullYear()} ${user?.store?.name || 'Your Store'}. All rights reserved.`,
    columns: [
      {
        id: '1',
        title: 'Quick Links',
        type: 'links',
        links: [
          { id: '1', text: 'About Us', url: '/about', openInNewTab: false },
          { id: '2', text: 'Contact', url: '/contact', openInNewTab: false }
        ]
      }
    ],
    socialMedia: [],
    newsletter: {
      enabled: false,
      title: 'Subscribe to our newsletter',
      placeholder: 'Enter your email',
      buttonText: 'Subscribe',
      successMessage: 'Thank you for subscribing!'
    },
    contactInfo: {
      enabled: false,
      email: '',
      phone: '',
      address: ''
    },
    trustBadges: [],
    customHtml: '',
    customJavascript: '',
    seoText: '',
    styling: {
      backgroundColor: '#f8f9fa',
      textColor: '#6b7280',
      linkColor: '#3b82f6',
      borderColor: '#e5e7eb'
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.store?.settings?.footer) {
      setFooterSettings({
        ...footerSettings,
        ...user.store.settings.footer,
        trustBadges: user.store.settings.footer.trustBadges || [],
        customJavascript: user.store.settings.footer.customJavascript || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateStoreSettings({
        ...user?.store?.settings,
        footer: footerSettings
      });
      toast.success("Footer settings saved successfully");
    } catch (error) {
      console.error("Error saving footer settings:", error);
      toast.error("Failed to save footer settings");
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(footerSettings.columns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFooterSettings(prev => ({
      ...prev,
      columns: items
    }));
  };

  const addColumn = () => {
    const newColumn: FooterColumn = {
      id: Date.now().toString(),
      title: 'New Column',
      type: 'links',
      links: []
    };
    setFooterSettings(prev => ({
      ...prev,
      columns: [...prev.columns, newColumn]
    }));
  };

  const updateColumn = (columnId: string, updates: Partial<FooterColumn>) => {
    setFooterSettings(prev => ({
      ...prev,
      columns: prev.columns.map(col => 
        col.id === columnId ? { ...col, ...updates } : col
      )
    }));
  };

  const removeColumn = (columnId: string) => {
    setFooterSettings(prev => ({
      ...prev,
      columns: prev.columns.filter(col => col.id !== columnId)
    }));
  };

  const addLink = (columnId: string) => {
    const newLink: FooterLink = {
      id: Date.now().toString(),
      text: 'New Link',
      url: '/',
      openInNewTab: false
    };
    
    setFooterSettings(prev => ({
      ...prev,
      columns: prev.columns.map(col => 
        col.id === columnId 
          ? { ...col, links: [...col.links, newLink] }
          : col
      )
    }));
  };

  const updateLink = (columnId: string, linkId: string, updates: Partial<FooterLink>) => {
    setFooterSettings(prev => ({
      ...prev,
      columns: prev.columns.map(col => 
        col.id === columnId 
          ? {
              ...col,
              links: col.links.map(link => 
                link.id === linkId ? { ...link, ...updates } : link
              )
            }
          : col
      )
    }));
  };

  const removeLink = (columnId: string, linkId: string) => {
    setFooterSettings(prev => ({
      ...prev,
      columns: prev.columns.map(col => 
        col.id === columnId 
          ? { ...col, links: col.links.filter(link => link.id !== linkId) }
          : col
      )
    }));
  };

  const addSocialLink = () => {
    const newSocialLink: SocialMediaLink = {
      id: Date.now().toString(),
      platform: 'facebook',
      url: ''
    };
    setFooterSettings(prev => ({
      ...prev,
      socialMedia: [...prev.socialMedia, newSocialLink]
    }));
  };

  const updateSocialLink = (id: string, updates: Partial<SocialMediaLink>) => {
    setFooterSettings(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.map(social => 
        social.id === id ? { ...social, ...updates } : social
      )
    }));
  };

  const removeSocialLink = (id: string) => {
    setFooterSettings(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.filter(social => social.id !== id)
    }));
  };

  const addTrustBadge = () => {
    const newBadge: TrustBadge = {
      id: Date.now().toString(),
      type: 'payment',
      name: 'Visa',
      url: ''
    };
    setFooterSettings(prev => ({
      ...prev,
      trustBadges: [...prev.trustBadges, newBadge]
    }));
  };

  const updateTrustBadge = (id: string, updates: Partial<TrustBadge>) => {
    setFooterSettings(prev => ({
      ...prev,
      trustBadges: prev.trustBadges.map(badge => 
        badge.id === id ? { ...badge, ...updates } : badge
      )
    }));
  };

  const removeTrustBadge = (id: string) => {
    setFooterSettings(prev => ({
      ...prev,
      trustBadges: prev.trustBadges.filter(badge => badge.id !== id)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Footer Designer</h3>
          <p className="text-muted-foreground">
            Customize your store's footer with links, contact info, and more.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="footer-enabled"
              checked={footerSettings.enabled}
              onCheckedChange={(checked) => 
                setFooterSettings(prev => ({ ...prev, enabled: checked }))
              }
            />
            <Label htmlFor="footer-enabled">Enable Footer</Label>
          </div>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {footerSettings.enabled && (
        <Tabs defaultValue="columns" className="space-y-4">
          <TabsList>
            <TabsTrigger value="columns">Columns & Links</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
            <TabsTrigger value="trust">Trust & Payment</TabsTrigger>
            <TabsTrigger value="styling">Styling</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="columns" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Footer Columns</CardTitle>
                  <Button variant="outline" onClick={addColumn} className="flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add Column
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="columns">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {footerSettings.columns.map((column, index) => (
                          <Draggable key={column.id} draggableId={column.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="border rounded-lg p-4 space-y-3 bg-background"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div {...provided.dragHandleProps}>
                                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                    </div>
                                    <Input
                                      value={column.title}
                                      onChange={(e) => updateColumn(column.id, { title: e.target.value })}
                                      className="font-medium flex-1"
                                    />
                                    <Select
                                      value={column.type}
                                      onValueChange={(value: 'links' | 'html') => 
                                        updateColumn(column.id, { type: value })
                                      }
                                    >
                                      <SelectTrigger className="w-32">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="links">Links</SelectItem>
                                        <SelectItem value="html">HTML</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeColumn(column.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                {column.type === 'links' ? (
                                  <div className="space-y-2">
                                    {column.links.map((link) => (
                                      <div key={link.id} className="flex items-center gap-2 p-2 border rounded">
                                        <Input
                                          placeholder="Link text"
                                          value={link.text}
                                          onChange={(e) => updateLink(column.id, link.id, { text: e.target.value })}
                                          className="flex-1"
                                        />
                                        <Input
                                          placeholder="URL"
                                          value={link.url}
                                          onChange={(e) => updateLink(column.id, link.id, { url: e.target.value })}
                                          className="flex-1"
                                        />
                                        <div className="flex items-center space-x-1">
                                          <Switch
                                            checked={link.openInNewTab}
                                            onCheckedChange={(checked) => 
                                              updateLink(column.id, link.id, { openInNewTab: checked })
                                            }
                                          />
                                          <Label className="text-xs">New tab</Label>
                                        </div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => removeLink(column.id, link.id)}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => addLink(column.id)}
                                      className="w-full"
                                    >
                                      <Plus className="h-3 w-3 mr-1" /> Add Link
                                    </Button>
                                  </div>
                                ) : (
                                  <div>
                                    <Label>HTML Content</Label>
                                    <Textarea
                                      value={column.htmlContent || ''}
                                      onChange={(e) => updateColumn(column.id, { htmlContent: e.target.value })}
                                      placeholder="Enter HTML content..."
                                      rows={6}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                      You can use HTML tags here. Be careful with script tags.
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Copyright Text</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={footerSettings.copyrightText}
                  onChange={(e) => 
                    setFooterSettings(prev => ({ ...prev, copyrightText: e.target.value }))
                  }
                  placeholder="© 2024 Your Store. All rights reserved."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Social Media Links</CardTitle>
                  <Button variant="outline" onClick={addSocialLink} className="flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add Social Link
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {footerSettings.socialMedia.map((social) => (
                  <div key={social.id} className="flex items-center gap-3 p-3 border rounded">
                    <Select
                      value={social.platform}
                      onValueChange={(value: any) => 
                        updateSocialLink(social.id, { platform: value })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Social media URL"
                      value={social.url}
                      onChange={(e) => updateSocialLink(social.id, { url: e.target.value })}
                      className="flex-1"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSocialLink(social.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {footerSettings.socialMedia.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No social media links added yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Contact Information</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={footerSettings.contactInfo.enabled}
                      onCheckedChange={(checked) => 
                        setFooterSettings(prev => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, enabled: checked }
                        }))
                      }
                    />
                    <Label>Show contact info</Label>
                  </div>
                </div>
              </CardHeader>
              {footerSettings.contactInfo.enabled && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      value={footerSettings.contactInfo.email}
                      onChange={(e) => 
                        setFooterSettings(prev => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, email: e.target.value }
                        }))
                      }
                      placeholder="contact@yourstore.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-phone">Phone</Label>
                    <Input
                      id="contact-phone"
                      value={footerSettings.contactInfo.phone}
                      onChange={(e) => 
                        setFooterSettings(prev => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, phone: e.target.value }
                        }))
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-address">Address</Label>
                    <Textarea
                      id="contact-address"
                      value={footerSettings.contactInfo.address}
                      onChange={(e) => 
                        setFooterSettings(prev => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, address: e.target.value }
                        }))
                      }
                      placeholder="123 Main Street, City, State 12345"
                      rows={3}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="trust" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Trust Badges & Payment Methods</CardTitle>
                  <Button variant="outline" onClick={addTrustBadge} className="flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add Badge
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {footerSettings.trustBadges.map((badge) => (
                  <div key={badge.id} className="flex items-center gap-3 p-3 border rounded">
                    <Select
                      value={badge.type}
                      onValueChange={(value: 'payment' | 'security' | 'custom') => 
                        updateTrustBadge(badge.id, { type: value })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Badge name"
                      value={badge.name}
                      onChange={(e) => updateTrustBadge(badge.id, { name: e.target.value })}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Image URL (optional)"
                      value={badge.image || ''}
                      onChange={(e) => updateTrustBadge(badge.id, { image: e.target.value })}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Link URL (optional)"
                      value={badge.url || ''}
                      onChange={(e) => updateTrustBadge(badge.id, { url: e.target.value })}
                      className="flex-1"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeTrustBadge(badge.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {footerSettings.trustBadges.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No trust badges added yet.
                  </p>
                )}
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">
                    <strong>Quick examples:</strong><br />
                    Payment: Visa, MasterCard, PayPal<br />
                    Security: SSL Secure, Money-back Guarantee, Secure Payment
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="styling" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Footer Styling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bg-color">Background Color</Label>
                    <Input
                      id="bg-color"
                      type="color"
                      value={footerSettings.styling.backgroundColor}
                      onChange={(e) => 
                        setFooterSettings(prev => ({
                          ...prev,
                          styling: { ...prev.styling, backgroundColor: e.target.value }
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="text-color">Text Color</Label>
                    <Input
                      id="text-color"
                      type="color"
                      value={footerSettings.styling.textColor}
                      onChange={(e) => 
                        setFooterSettings(prev => ({
                          ...prev,
                          styling: { ...prev.styling, textColor: e.target.value }
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="link-color">Link Color</Label>
                    <Input
                      id="link-color"
                      type="color"
                      value={footerSettings.styling.linkColor}
                      onChange={(e) => 
                        setFooterSettings(prev => ({
                          ...prev,
                          styling: { ...prev.styling, linkColor: e.target.value }
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="border-color">Border Color</Label>
                    <Input
                      id="border-color"
                      type="color"
                      value={footerSettings.styling.borderColor}
                      onChange={(e) => 
                        setFooterSettings(prev => ({
                          ...prev,
                          styling: { ...prev.styling, borderColor: e.target.value }
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="custom-html">Custom HTML/Embed Code</Label>
                  <Textarea
                    id="custom-html"
                    value={footerSettings.customHtml}
                    onChange={(e) => 
                      setFooterSettings(prev => ({ ...prev, customHtml: e.target.value }))
                    }
                    placeholder="Add custom HTML or embed codes here..."
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This HTML will be rendered in the footer. Use with caution.
                  </p>
                </div>
                <div>
                  <Label htmlFor="custom-javascript">Custom JavaScript</Label>
                  <Textarea
                    id="custom-javascript"
                    value={footerSettings.customJavascript}
                    onChange={(e) => 
                      setFooterSettings(prev => ({ ...prev, customJavascript: e.target.value }))
                    }
                    placeholder="console.log('Hello from footer!'); // Add custom JavaScript here..."
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    JavaScript code for chat widgets, analytics, site verification, etc. Use with caution.
                  </p>
                </div>
                <div>
                  <Label htmlFor="seo-text">SEO Text</Label>
                  <Textarea
                    id="seo-text"
                    value={footerSettings.seoText}
                    onChange={(e) => 
                      setFooterSettings(prev => ({ ...prev, seoText: e.target.value }))
                    }
                    placeholder="Additional text for SEO purposes..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This text will be displayed at the bottom of the footer for SEO purposes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default FooterEditor;
