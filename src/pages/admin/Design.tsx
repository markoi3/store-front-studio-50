
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const Design = () => {
  const [activeTheme, setActiveTheme] = useState("minimal");
  
  const [themeCustomization, setThemeCustomization] = useState({
    primaryColor: "#000000",
    secondaryColor: "#e0e0e0",
    accentColor: "#f5f5f5",
    textColor: "#1a1a1a",
    headerBackgroundColor: "#ffffff",
    footerBackgroundColor: "#f5f5f5",
    buttonRadius: "medium",
    cardRadius: "medium",
    fontPrimary: "Inter",
    fontHeadings: "Inter",
  });
  
  const [logoSettings, setLogoSettings] = useState({
    logoUrl: "https://via.placeholder.com/200x80?text=Your+Logo",
    logoWidth: "200",
    logoHeight: "80",
    favicon: "https://via.placeholder.com/32x32",
  });
  
  const [headerSettings, setHeaderSettings] = useState({
    headerImageUrl: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80",
    headerHeight: "400",
    headerText: "Welcome to our store",
    headerSubtext: "Discover our curated collection of products",
    showSearch: true,
    showCategories: true,
  });
  
  const [footerSettings, setFooterSettings] = useState({
    showSocialLinks: true,
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    copyrightText: `© ${new Date().getFullYear()} My E-Shop. All rights reserved.`,
    showNewsletter: true,
    newsletterText: "Subscribe to our newsletter for updates and special offers.",
  });
  
  const handleThemeChange = (value: string) => {
    setActiveTheme(value);
    
    // Set theme specific customizations
    if (value === "minimal") {
      setThemeCustomization({
        ...themeCustomization,
        primaryColor: "#000000",
        secondaryColor: "#e0e0e0",
        accentColor: "#f5f5f5",
        buttonRadius: "medium",
        cardRadius: "medium",
      });
    } else if (value === "modern") {
      setThemeCustomization({
        ...themeCustomization,
        primaryColor: "#3b82f6",
        secondaryColor: "#e2e8f0",
        accentColor: "#f1f5f9",
        buttonRadius: "large",
        cardRadius: "large",
      });
    } else if (value === "bold") {
      setThemeCustomization({
        ...themeCustomization,
        primaryColor: "#ef4444",
        secondaryColor: "#fecaca",
        accentColor: "#fee2e2",
        buttonRadius: "small",
        cardRadius: "medium",
      });
    }
  };
  
  const handleColorChange = (name: string, value: string) => {
    setThemeCustomization({ ...themeCustomization, [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setThemeCustomization({ ...themeCustomization, [name]: value });
  };
  
  const handleInputChange = (
    stateSetter: Function,
    state: any,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    stateSetter({ ...state, [name]: value });
  };
  
  const handleSaveDesign = () => {
    // Here you would normally send the data to your API
    console.log("Active Theme:", activeTheme);
    console.log("Theme Customization:", themeCustomization);
    console.log("Logo Settings:", logoSettings);
    console.log("Header Settings:", headerSettings);
    console.log("Footer Settings:", footerSettings);
    
    toast({
      title: "Design saved",
      description: "Your store design has been updated successfully.",
    });
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Store Design</h1>
          <Button onClick={handleSaveDesign}>Save Design</Button>
        </div>
        
        <Tabs defaultValue="theme">
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="logo">Logo</TabsTrigger>
            <TabsTrigger value="header">Header</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
          </TabsList>
          
          {/* Theme Settings */}
          <TabsContent value="theme" className="space-y-6 py-4">
            <div className="bg-card rounded-lg shadow-custom p-6">
              <h2 className="text-lg font-bold mb-6">Theme Selection</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`border ${
                    activeTheme === "minimal"
                      ? "border-primary bg-accent"
                      : "border-border"
                  } rounded-lg p-4 cursor-pointer`}
                  onClick={() => handleThemeChange("minimal")}
                >
                  <h3 className="font-medium mb-2">Minimal</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Clean, minimalist design with emphasis on typography and whitespace.
                  </p>
                  <div className="h-20 bg-black rounded-md mb-2"></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-4 bg-gray-200 rounded-sm"></div>
                    <div className="h-4 bg-gray-300 rounded-sm"></div>
                    <div className="h-4 bg-gray-400 rounded-sm"></div>
                  </div>
                </div>
                
                <div
                  className={`border ${
                    activeTheme === "modern"
                      ? "border-primary bg-accent"
                      : "border-border"
                  } rounded-lg p-4 cursor-pointer`}
                  onClick={() => handleThemeChange("modern")}
                >
                  <h3 className="font-medium mb-2">Modern</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Contemporary design with softer edges and a blue color scheme.
                  </p>
                  <div className="h-20 bg-blue-500 rounded-2xl mb-2"></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-4 bg-slate-200 rounded-full"></div>
                    <div className="h-4 bg-slate-300 rounded-full"></div>
                    <div className="h-4 bg-slate-400 rounded-full"></div>
                  </div>
                </div>
                
                <div
                  className={`border ${
                    activeTheme === "bold"
                      ? "border-primary bg-accent"
                      : "border-border"
                  } rounded-lg p-4 cursor-pointer`}
                  onClick={() => handleThemeChange("bold")}
                >
                  <h3 className="font-medium mb-2">Bold</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Eye-catching design with vibrant colors and strong contrasts.
                  </p>
                  <div className="h-20 bg-red-500 rounded-md mb-2"></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-4 bg-red-200 rounded-sm"></div>
                    <div className="h-4 bg-red-300 rounded-sm"></div>
                    <div className="h-4 bg-red-400 rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg shadow-custom p-6">
              <h2 className="text-lg font-bold mb-6">Theme Customization</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-sm">Colors</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded-full border border-border"
                        style={{ backgroundColor: themeCustomization.primaryColor }}
                      ></div>
                      <Input
                        id="primaryColor"
                        type="color"
                        value={themeCustomization.primaryColor}
                        onChange={(e) =>
                          handleColorChange("primaryColor", e.target.value)
                        }
                        className="w-12 h-8 p-0 overflow-hidden"
                      />
                      <Input
                        value={themeCustomization.primaryColor}
                        onChange={(e) =>
                          handleColorChange("primaryColor", e.target.value)
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded-full border border-border"
                        style={{ backgroundColor: themeCustomization.secondaryColor }}
                      ></div>
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={themeCustomization.secondaryColor}
                        onChange={(e) =>
                          handleColorChange("secondaryColor", e.target.value)
                        }
                        className="w-12 h-8 p-0 overflow-hidden"
                      />
                      <Input
                        value={themeCustomization.secondaryColor}
                        onChange={(e) =>
                          handleColorChange("secondaryColor", e.target.value)
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded-full border border-border"
                        style={{ backgroundColor: themeCustomization.accentColor }}
                      ></div>
                      <Input
                        id="accentColor"
                        type="color"
                        value={themeCustomization.accentColor}
                        onChange={(e) =>
                          handleColorChange("accentColor", e.target.value)
                        }
                        className="w-12 h-8 p-0 overflow-hidden"
                      />
                      <Input
                        value={themeCustomization.accentColor}
                        onChange={(e) =>
                          handleColorChange("accentColor", e.target.value)
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="textColor">Text Color</Label>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded-full border border-border"
                        style={{ backgroundColor: themeCustomization.textColor }}
                      ></div>
                      <Input
                        id="textColor"
                        type="color"
                        value={themeCustomization.textColor}
                        onChange={(e) =>
                          handleColorChange("textColor", e.target.value)
                        }
                        className="w-12 h-8 p-0 overflow-hidden"
                      />
                      <Input
                        value={themeCustomization.textColor}
                        onChange={(e) =>
                          handleColorChange("textColor", e.target.value)
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-sm">Typography & Layout</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fontPrimary">Primary Font</Label>
                    <Select
                      value={themeCustomization.fontPrimary}
                      onValueChange={(value) =>
                        handleSelectChange("fontPrimary", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fontHeadings">Headings Font</Label>
                    <Select
                      value={themeCustomization.fontHeadings}
                      onValueChange={(value) =>
                        handleSelectChange("fontHeadings", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="buttonRadius">Button Corners</Label>
                    <Select
                      value={themeCustomization.buttonRadius}
                      onValueChange={(value) =>
                        handleSelectChange("buttonRadius", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select corner style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Square</SelectItem>
                        <SelectItem value="small">Slightly Rounded</SelectItem>
                        <SelectItem value="medium">Rounded</SelectItem>
                        <SelectItem value="large">Very Rounded</SelectItem>
                        <SelectItem value="full">Pill</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardRadius">Card Corners</Label>
                    <Select
                      value={themeCustomization.cardRadius}
                      onValueChange={(value) =>
                        handleSelectChange("cardRadius", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select corner style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Square</SelectItem>
                        <SelectItem value="small">Slightly Rounded</SelectItem>
                        <SelectItem value="medium">Rounded</SelectItem>
                        <SelectItem value="large">Very Rounded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Logo Settings */}
          <TabsContent value="logo" className="space-y-6 py-4">
            <div className="bg-card rounded-lg shadow-custom p-6">
              <h2 className="text-lg font-bold mb-6">Logo Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo Image URL</Label>
                    <Input
                      id="logoUrl"
                      name="logoUrl"
                      value={logoSettings.logoUrl}
                      onChange={(e) =>
                        handleInputChange(setLogoSettings, logoSettings, e)
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the URL of your logo image. Recommended size: 200x80px.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="logoWidth">Width (px)</Label>
                      <Input
                        id="logoWidth"
                        name="logoWidth"
                        type="number"
                        min="0"
                        value={logoSettings.logoWidth}
                        onChange={(e) =>
                          handleInputChange(setLogoSettings, logoSettings, e)
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="logoHeight">Height (px)</Label>
                      <Input
                        id="logoHeight"
                        name="logoHeight"
                        type="number"
                        min="0"
                        value={logoSettings.logoHeight}
                        onChange={(e) =>
                          handleInputChange(setLogoSettings, logoSettings, e)
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="favicon">Favicon URL</Label>
                    <Input
                      id="favicon"
                      name="favicon"
                      value={logoSettings.favicon}
                      onChange={(e) =>
                        handleInputChange(setLogoSettings, logoSettings, e)
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the URL of your favicon. Recommended size: 32x32px.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-sm">Logo Preview</h3>
                  
                  <div className="border border-border p-4 rounded-lg">
                    <div className="bg-background p-4 flex justify-center items-center mb-4">
                      <img
                        src={logoSettings.logoUrl}
                        alt="Logo Preview"
                        style={{
                          width: `${logoSettings.logoWidth}px`,
                          height: `${logoSettings.logoHeight}px`,
                          maxWidth: "100%",
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <img
                        src={logoSettings.favicon}
                        alt="Favicon Preview"
                        className="w-8 h-8"
                      />
                      <span>Favicon</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    In a production environment, you would have a file upload feature here.
                    For this demo, please enter image URLs directly.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Header Settings */}
          <TabsContent value="header" className="space-y-6 py-4">
            <div className="bg-card rounded-lg shadow-custom p-6">
              <h2 className="text-lg font-bold mb-6">Header Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="headerImageUrl">Hero Image URL</Label>
                    <Input
                      id="headerImageUrl"
                      name="headerImageUrl"
                      value={headerSettings.headerImageUrl}
                      onChange={(e) =>
                        handleInputChange(setHeaderSettings, headerSettings, e)
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the URL of your header image. Recommended size: 1920x400px.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="headerHeight">Header Height (px)</Label>
                    <Input
                      id="headerHeight"
                      name="headerHeight"
                      type="number"
                      min="0"
                      value={headerSettings.headerHeight}
                      onChange={(e) =>
                        handleInputChange(setHeaderSettings, headerSettings, e)
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="headerText">Header Text</Label>
                    <Input
                      id="headerText"
                      name="headerText"
                      value={headerSettings.headerText}
                      onChange={(e) =>
                        handleInputChange(setHeaderSettings, headerSettings, e)
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="headerSubtext">Header Subtext</Label>
                    <Textarea
                      id="headerSubtext"
                      name="headerSubtext"
                      rows={3}
                      value={headerSettings.headerSubtext}
                      onChange={(e) =>
                        handleInputChange(setHeaderSettings, headerSettings, e)
                      }
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-sm">Header Preview</h3>
                  
                  <div className="border border-border rounded-lg overflow-hidden">
                    <div
                      className="relative"
                      style={{
                        height: `${Math.min(Number(headerSettings.headerHeight), 300)}px`,
                      }}
                    >
                      <img
                        src={headerSettings.headerImageUrl}
                        alt="Header Preview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center px-4 text-white text-center">
                        <h2 className="text-xl font-bold mb-2">
                          {headerSettings.headerText}
                        </h2>
                        <p>{headerSettings.headerSubtext}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="showSearch"
                        checked={headerSettings.showSearch}
                        onChange={(e) =>
                          setHeaderSettings({
                            ...headerSettings,
                            showSearch: e.target.checked,
                          })
                        }
                      />
                      <Label htmlFor="showSearch">Show search in header</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="showCategories"
                        checked={headerSettings.showCategories}
                        onChange={(e) =>
                          setHeaderSettings({
                            ...headerSettings,
                            showCategories: e.target.checked,
                          })
                        }
                      />
                      <Label htmlFor="showCategories">
                        Show categories in header
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Footer Settings */}
          <TabsContent value="footer" className="space-y-6 py-4">
            <div className="bg-card rounded-lg shadow-custom p-6">
              <h2 className="text-lg font-bold mb-6">Footer Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="copyrightText">Copyright Text</Label>
                    <Input
                      id="copyrightText"
                      name="copyrightText"
                      value={footerSettings.copyrightText}
                      onChange={(e) =>
                        handleInputChange(setFooterSettings, footerSettings, e)
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        id="showSocialLinks"
                        checked={footerSettings.showSocialLinks}
                        onChange={(e) =>
                          setFooterSettings({
                            ...footerSettings,
                            showSocialLinks: e.target.checked,
                          })
                        }
                      />
                      <Label htmlFor="showSocialLinks">
                        Show social media links
                      </Label>
                    </div>
                    
                    {footerSettings.showSocialLinks && (
                      <div className="space-y-2 ml-6">
                        <div className="space-y-2">
                          <Label htmlFor="facebookUrl">Facebook URL</Label>
                          <Input
                            id="facebookUrl"
                            name="facebookUrl"
                            value={footerSettings.facebookUrl}
                            onChange={(e) =>
                              handleInputChange(
                                setFooterSettings,
                                footerSettings,
                                e
                              )
                            }
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="instagramUrl">Instagram URL</Label>
                          <Input
                            id="instagramUrl"
                            name="instagramUrl"
                            value={footerSettings.instagramUrl}
                            onChange={(e) =>
                              handleInputChange(
                                setFooterSettings,
                                footerSettings,
                                e
                              )
                            }
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="twitterUrl">Twitter URL</Label>
                          <Input
                            id="twitterUrl"
                            name="twitterUrl"
                            value={footerSettings.twitterUrl}
                            onChange={(e) =>
                              handleInputChange(
                                setFooterSettings,
                                footerSettings,
                                e
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        id="showNewsletter"
                        checked={footerSettings.showNewsletter}
                        onChange={(e) =>
                          setFooterSettings({
                            ...footerSettings,
                            showNewsletter: e.target.checked,
                          })
                        }
                      />
                      <Label htmlFor="showNewsletter">
                        Show newsletter signup
                      </Label>
                    </div>
                    
                    {footerSettings.showNewsletter && (
                      <div className="space-y-2 ml-6">
                        <Label htmlFor="newsletterText">Newsletter Text</Label>
                        <Textarea
                          id="newsletterText"
                          name="newsletterText"
                          rows={3}
                          value={footerSettings.newsletterText}
                          onChange={(e) =>
                            handleInputChange(
                              setFooterSettings,
                              footerSettings,
                              e
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="border border-border p-4 rounded-lg mt-6">
                    <h3 className="font-medium text-sm mb-4">Footer Preview</h3>
                    
                    <div className="bg-accent p-4 rounded-md">
                      {footerSettings.showNewsletter && (
                        <div className="mb-4 pb-4 border-b border-border">
                          <p className="text-sm mb-2">
                            {footerSettings.newsletterText}
                          </p>
                          <div className="flex">
                            <Input placeholder="Your email" />
                            <Button size="sm" className="ml-2">
                              Subscribe
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {footerSettings.showSocialLinks && (
                        <div className="flex space-x-4 mb-4">
                          <div className="w-8 h-8 bg-foreground rounded-full"></div>
                          <div className="w-8 h-8 bg-foreground rounded-full"></div>
                          <div className="w-8 h-8 bg-foreground rounded-full"></div>
                        </div>
                      )}
                      
                      <p className="text-sm text-muted-foreground">
                        {footerSettings.copyrightText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Design;
