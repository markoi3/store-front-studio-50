
export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface FooterLink {
  id: string;
  text: string;
  url: string;
  openInNewTab: boolean;
}

export interface SocialMediaLink {
  id: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'youtube';
  url: string;
}

export interface NewsletterSettings {
  enabled: boolean;
  title: string;
  placeholder: string;
  buttonText: string;
  successMessage: string;
}

export interface FooterSettings {
  enabled: boolean;
  copyrightText: string;
  columns: FooterColumn[];
  socialMedia: SocialMediaLink[];
  newsletter: NewsletterSettings;
  contactInfo: {
    enabled: boolean;
    email: string;
    phone: string;
    address: string;
  };
  customHtml: string;
  seoText: string;
  styling: {
    backgroundColor: string;
    textColor: string;
    linkColor: string;
    borderColor: string;
  };
}
