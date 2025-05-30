
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface FontSettings {
  headingFont: string;
  paragraphFont: string;
  headingFontSize: string;
  paragraphFontSize: string;
}

const FontSelector: React.FC = () => {
  const { user, updateStoreSettings } = useAuth();
  const [fontSettings, setFontSettings] = useState<FontSettings>({
    headingFont: 'Inter',
    paragraphFont: 'Inter',
    headingFontSize: 'large',
    paragraphFontSize: 'medium'
  });

  const availableFonts = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Nunito', label: 'Nunito' },
    { value: 'Source Sans Pro', label: 'Source Sans Pro' },
    { value: 'Raleway', label: 'Raleway' },
    { value: 'Ubuntu', label: 'Ubuntu' },
    { value: 'Playfair Display', label: 'Playfair Display' },
    { value: 'Merriweather', label: 'Merriweather' },
    { value: 'PT Serif', label: 'PT Serif' },
    { value: 'Crimson Text', label: 'Crimson Text' }
  ];

  const fontSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'xlarge', label: 'Extra Large' }
  ];

  useEffect(() => {
    // Load existing font settings
    if (user?.store?.settings?.fontSettings) {
      setFontSettings(user.store.settings.fontSettings);
    }
  }, [user]);

  const handleFontChange = (type: keyof FontSettings, value: string) => {
    setFontSettings(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const applyFonts = async () => {
    try {
      // Update CSS custom properties for fonts
      const root = document.documentElement;
      
      // Load Google Fonts
      const fontLinks = [];
      if (!document.querySelector(`link[href*="${fontSettings.headingFont}"]`)) {
        fontLinks.push(fontSettings.headingFont);
      }
      if (!document.querySelector(`link[href*="${fontSettings.paragraphFont}"]`) && 
          fontSettings.paragraphFont !== fontSettings.headingFont) {
        fontLinks.push(fontSettings.paragraphFont);
      }

      // Add Google Fonts links
      fontLinks.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
        document.head.appendChild(link);
      });

      // Apply CSS custom properties
      root.style.setProperty('--font-heading', `"${fontSettings.headingFont}", sans-serif`);
      root.style.setProperty('--font-paragraph', `"${fontSettings.paragraphFont}", sans-serif`);
      
      // Save to store settings
      await updateStoreSettings({
        ...user?.store?.settings,
        fontSettings: fontSettings
      });

      toast.success("Font settings applied", {
        description: "Fonts have been updated across all store pages."
      });
    } catch (error) {
      console.error("Error applying fonts:", error);
      toast.error("Failed to apply font settings");
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Typography Settings</h3>
            <p className="text-muted-foreground mb-6">
              Choose fonts that will be applied across all pages of your store including homepage, product pages, cart, checkout, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Heading Font</h4>
              <div>
                <Label htmlFor="headingFont">Font Family</Label>
                <Select
                  value={fontSettings.headingFont}
                  onValueChange={(value) => handleFontChange('headingFont', value)}
                >
                  <SelectTrigger id="headingFont">
                    <SelectValue placeholder="Select heading font" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFonts.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.value }}>{font.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="headingSize">Default Size</Label>
                <Select
                  value={fontSettings.headingFontSize}
                  onValueChange={(value) => handleFontChange('headingFontSize', value)}
                >
                  <SelectTrigger id="headingSize">
                    <SelectValue placeholder="Select heading size" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Paragraph Font</h4>
              <div>
                <Label htmlFor="paragraphFont">Font Family</Label>
                <Select
                  value={fontSettings.paragraphFont}
                  onValueChange={(value) => handleFontChange('paragraphFont', value)}
                >
                  <SelectTrigger id="paragraphFont">
                    <SelectValue placeholder="Select paragraph font" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFonts.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.value }}>{font.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paragraphSize">Default Size</Label>
                <Select
                  value={fontSettings.paragraphFontSize}
                  onValueChange={(value) => handleFontChange('paragraphFontSize', value)}
                >
                  <SelectTrigger id="paragraphSize">
                    <SelectValue placeholder="Select paragraph size" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-medium mb-4">Preview</h4>
            <div className="space-y-4 p-4 border rounded-lg bg-background">
              <div 
                style={{ 
                  fontFamily: `"${fontSettings.headingFont}", sans-serif`,
                  fontSize: fontSettings.headingFontSize === 'small' ? '1.5rem' : 
                           fontSettings.headingFontSize === 'medium' ? '2rem' :
                           fontSettings.headingFontSize === 'large' ? '2.5rem' : '3rem'
                }}
              >
                Sample Heading Text
              </div>
              <div 
                style={{ 
                  fontFamily: `"${fontSettings.paragraphFont}", sans-serif`,
                  fontSize: fontSettings.paragraphFontSize === 'small' ? '0.875rem' : 
                           fontSettings.paragraphFontSize === 'medium' ? '1rem' :
                           fontSettings.paragraphFontSize === 'large' ? '1.125rem' : '1.25rem'
                }}
              >
                This is sample paragraph text that shows how your content will look with the selected fonts. 
                Your customers will see this typography across all pages of your store.
              </div>
            </div>
          </div>

          <Button onClick={applyFonts} className="w-full">
            Apply Font Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FontSelector;
