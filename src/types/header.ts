
export interface HeaderMenuItem {
  id: string;
  label: string;
  url: string;
  type: 'link' | 'dropdown';
  icon?: string;
  openInNewTab?: boolean;
  children?: HeaderMenuItem[];
  isActive?: boolean;
}

export interface CallToActionButton {
  id: string;
  text: string;
  url: string;
  style: 'primary' | 'secondary' | 'outline';
  icon?: string;
  openInNewTab?: boolean;
}

export interface PromotionalBar {
  enabled: boolean;
  text: string;
  backgroundColor: string;
  textColor: string;
  linkText?: string;
  linkUrl?: string;
  closeable: boolean;
}

export interface HeaderSettings {
  logo: {
    position: 'left' | 'center';
    url?: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  navigation: {
    position: 'left' | 'center' | 'right';
    style: 'horizontal' | 'dropdown';
    showIcons: boolean;
  };
  layout: 'default' | 'centered' | 'split' | 'minimal';
  sticky: boolean;
  backgroundColor: string;
  textColor: string;
  height: number;
  menuItems: HeaderMenuItem[];
  ctaButtons: CallToActionButton[];
  promotionalBar: PromotionalBar;
  mobileBreakpoint: number;
  customCss?: string;
  autoAddCustomPages: boolean;
}

export const defaultHeaderSettings: HeaderSettings = {
  logo: {
    position: 'left',
    width: 120,
    height: 40,
  },
  navigation: {
    position: 'center',
    style: 'horizontal',
    showIcons: false,
  },
  layout: 'default',
  sticky: true,
  backgroundColor: 'hsl(var(--background))',
  textColor: 'hsl(var(--foreground))',
  height: 64,
  menuItems: [
    { id: "1", label: "Početna", url: "/", type: 'link' },
    { id: "2", label: "Proizvodi", url: "/shop", type: 'link' },
    { id: "3", label: "O nama", url: "/about", type: 'link' },
    { id: "4", label: "Kontakt", url: "/contact", type: 'link' }
  ],
  ctaButtons: [],
  promotionalBar: {
    enabled: false,
    text: "Besplatna dostava za porudžbine preko 5000 RSD!",
    backgroundColor: '#000000',
    textColor: '#ffffff',
    closeable: true,
  },
  mobileBreakpoint: 768,
  autoAddCustomPages: true,
};
