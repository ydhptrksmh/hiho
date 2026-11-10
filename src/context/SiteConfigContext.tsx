import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteConfig } from '../types';
import { defaultSiteConfig } from '../data/siteConfig';

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (updater: (prev: SiteConfig) => SiteConfig) => void;
  resetConfig: () => void;
  isCustomized: boolean;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

const STORAGE_KEY = 'hiho_site_config_override_v5';

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback to default
    }
    return defaultSiteConfig;
  });

  const [isCustomized, setIsCustomized] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      return false;
    }
  });

  const updateConfig = (updater: (prev: SiteConfig) => SiteConfig) => {
    setConfig((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      setIsCustomized(true);
      return next;
    });
  };

  const resetConfig = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setConfig(defaultSiteConfig);
    setIsCustomized(false);
  };

  return (
    <SiteConfigContext.Provider value={{ config, updateConfig, resetConfig, isCustomized }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = (): SiteConfigContextType => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};
