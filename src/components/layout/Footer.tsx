
import { Link } from "react-router-dom";
import { useStore } from "@/hooks/useStore";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Footer = () => {
  const { store, getStoreUrl } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  // Get footer settings or use defaults
  const footerSettings = store?.settings?.footer;
  
  // If footer is disabled, don't render anything
  if (footerSettings && !footerSettings.enabled) {
    return null;
  }
  
  // Get store name or fallback to default
  const storeName = store?.name || "E-Shop";
  
  // Default footer structure if no custom footer is configured
  if (!footerSettings) {
    return (
      <footer className="bg-accent mt-auto py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">{storeName}</h3>
              <p className="text-muted-foreground">
                Your one-stop shop for everything you need.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Shop</h3>
              <ul className="space-y-2">
                <li>
                  <Link to={getStoreUrl("/shop")} className="text-muted-foreground hover:text-foreground">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to={getStoreUrl("/shop?category=new")} className="text-muted-foreground hover:text-foreground">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link to={getStoreUrl("/shop?category=bestsellers")} className="text-muted-foreground hover:text-foreground">
                    Bestsellers
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">About</h3>
              <ul className="space-y-2">
                <li>
                  <Link to={getStoreUrl("/about")} className="text-muted-foreground hover:text-foreground">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link to={getStoreUrl("/contact")} className="text-muted-foreground hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to={getStoreUrl("/terms")} className="text-muted-foreground hover:text-foreground">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to={getStoreUrl("/privacy")} className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setIsSubscribing(true);
    try {
      // Simulate newsletter subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(footerSettings.newsletter.successMessage);
      setNewsletterEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      default:
        return null;
    }
  };

  // Calculate grid columns based on content
  const hasContactInfo = footerSettings.contactInfo.enabled;
  const hasNewsletter = footerSettings.newsletter.enabled;
  const columnCount = footerSettings.columns.length;
  const totalColumns = columnCount + (hasContactInfo ? 1 : 0) + (hasNewsletter ? 1 : 0);
  const gridCols = totalColumns <= 2 ? 'md:grid-cols-2' : 
                  totalColumns <= 3 ? 'md:grid-cols-3' : 
                  totalColumns <= 4 ? 'md:grid-cols-4' : 'md:grid-cols-5';

  return (
    <footer 
      className="mt-auto py-8 border-t"
      style={{
        backgroundColor: footerSettings.styling.backgroundColor,
        color: footerSettings.styling.textColor,
        borderColor: footerSettings.styling.borderColor
      }}
    >
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
          {/* Custom Columns */}
          {footerSettings.columns.map((column) => (
            <div key={column.id}>
              <h3 className="font-bold text-lg mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      to={link.url.startsWith('/') ? getStoreUrl(link.url) : link.url}
                      target={link.openInNewTab ? '_blank' : undefined}
                      rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                      className="hover:opacity-80 transition-opacity"
                      style={{ color: footerSettings.styling.linkColor }}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Information */}
          {hasContactInfo && (
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <div className="space-y-2">
                {footerSettings.contactInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a 
                      href={`mailto:${footerSettings.contactInfo.email}`}
                      className="hover:opacity-80 transition-opacity"
                      style={{ color: footerSettings.styling.linkColor }}
                    >
                      {footerSettings.contactInfo.email}
                    </a>
                  </div>
                )}
                {footerSettings.contactInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a 
                      href={`tel:${footerSettings.contactInfo.phone}`}
                      className="hover:opacity-80 transition-opacity"
                      style={{ color: footerSettings.styling.linkColor }}
                    >
                      {footerSettings.contactInfo.phone}
                    </a>
                  </div>
                )}
                {footerSettings.contactInfo.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    <span className="text-sm whitespace-pre-line">
                      {footerSettings.contactInfo.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Newsletter */}
          {hasNewsletter && (
            <div>
              <h3 className="font-bold text-lg mb-4">{footerSettings.newsletter.title}</h3>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <Input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={footerSettings.newsletter.placeholder}
                  className="bg-background"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubscribing}
                >
                  {isSubscribing ? 'Subscribing...' : footerSettings.newsletter.buttonText}
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Social Media Links */}
        {footerSettings.socialMedia.length > 0 && (
          <div className="flex justify-center gap-4 mt-8 pt-6 border-t" style={{ borderColor: footerSettings.styling.borderColor }}>
            {footerSettings.socialMedia.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                style={{ color: footerSettings.styling.linkColor }}
              >
                {getSocialIcon(social.platform)}
              </a>
            ))}
          </div>
        )}

        {/* Custom HTML */}
        {footerSettings.customHtml && (
          <div 
            className="mt-6 pt-6 border-t" 
            style={{ borderColor: footerSettings.styling.borderColor }}
            dangerouslySetInnerHTML={{ __html: footerSettings.customHtml }}
          />
        )}

        {/* SEO Text */}
        {footerSettings.seoText && (
          <div className="mt-6 pt-6 border-t text-sm opacity-70" style={{ borderColor: footerSettings.styling.borderColor }}>
            {footerSettings.seoText}
          </div>
        )}

        {/* Copyright */}
        <div className="border-t mt-8 pt-8 text-center text-sm opacity-70" style={{ borderColor: footerSettings.styling.borderColor }}>
          <p>{footerSettings.copyrightText}</p>
        </div>
      </div>
    </footer>
  );
};
