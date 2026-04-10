import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SiteSettings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  address: string;
  instagram: string;
  facebook: string;
  youtube: string;
  linkedin: string;
  twitter: string;
  metaTitle: string;
  metaDescription: string;
  maintenanceMode: boolean;
  heroImages: string[];
}

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setSettings({
          siteName: data.site_name,
          contactEmail: data.contact_email,
          contactPhone: data.contact_phone,
          whatsapp: data.whatsapp,
          address: data.address,
          instagram: data.instagram,
          facebook: data.facebook,
          youtube: data.youtube,
          linkedin: data.linkedin,
          twitter: data.twitter,
          metaTitle: data.meta_title,
          metaDescription: data.meta_description,
          maintenanceMode: data.maintenance_mode,
          heroImages: data.hero_images || []
        });

        if (data.meta_title) {
          document.title = data.meta_title;
        }
        if (data.meta_description) {
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute('content', data.meta_description);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
