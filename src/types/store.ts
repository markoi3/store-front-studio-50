
import { Json } from "@/integrations/supabase/types";
import { FooterSettings } from "./footer";

export interface StoreMenuItem {
  id: string;
  label: string;
  url: string;
}

export interface StoreSettings {
  menuItems?: StoreMenuItem[];
  aboutUs?: string;
  privacyPolicy?: string;
  contactInfo?: string;
  pageElements?: any[];
  comingSoonElements?: any[];
  is_public: boolean;
  storeSettings?: any;
  paymentSettings?: any;
  shippingSettings?: any;
  taxSettings?: any;
  footer?: FooterSettings;
  logo?: {
    url?: string;
    alt?: string;
  };
  [key: string]: any;
}

export interface StoreData {
  id: string;
  name: string;
  slug: string;
  user_id: string; // Added user_id for ownership checking
  settings: StoreSettings;
  elements: any[];
}

// Type guard to check if the settings object has the is_public property
export function isValidStoreSettings(settings: any): settings is StoreSettings {
  return settings !== null && 
         typeof settings === 'object' && 
         typeof settings.is_public === 'boolean';
}
