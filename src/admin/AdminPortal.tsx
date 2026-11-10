import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { AdminLayout, AdminTabType } from './AdminLayout';
import { AdminLoginView } from './AdminLoginView';
import { AdminDashboardView } from './AdminDashboardView';
import { AdminDiseasesView } from './AdminDiseasesView';
import { AdminArticlesView } from './AdminArticlesView';
import { AdminTipsView } from './AdminTipsView';
import { AdminGalleryView } from './AdminGalleryView';
import { AdminSiteConfigView } from './AdminSiteConfigView';

interface AdminPortalProps {
  onBackToSite: () => void;
  initialSubRoute?: 'login' | 'dashboard' | 'diseases' | 'articles' | 'tips' | 'gallery' | 'site-config';
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToSite,
  initialSubRoute = 'dashboard',
}) => {
  const { isAdmin } = useData();

  // Active admin sub-tab: 'dashboard' | 'diseases' | 'articles' | 'tips' | 'site-config' | 'login'
  const [activeTab, setActiveTab] = useState<AdminTabType | 'login'>(() => {
    if (!isAdmin) return 'login';
    return initialSubRoute === 'login' ? 'dashboard' : initialSubRoute;
  });

  // Route Guard: enforce login if not authenticated
  useEffect(() => {
    if (!isAdmin) {
      setActiveTab('login');
      window.location.hash = 'admin/login';
    } else {
      if (activeTab === 'login') {
        setActiveTab('dashboard');
        window.location.hash = 'admin/dashboard';
      }
    }
  }, [isAdmin, activeTab]);

  // Sync route with window hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('admin/')) {
        const sub = hash.replace('admin/', '');
        if (sub === 'login') {
          setActiveTab('login');
        } else if (['dashboard', 'diseases', 'articles', 'tips', 'gallery', 'site-config'].includes(sub)) {
          if (isAdmin) {
            setActiveTab(sub as AdminTabType);
          } else {
            setActiveTab('login');
          }
        }
      }
    };

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isAdmin]);

  const handleNavigateTab = (tab: AdminTabType) => {
    setActiveTab(tab);
    window.location.hash = `admin/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setActiveTab('dashboard');
    window.location.hash = 'admin/dashboard';
  };

  // If unauthenticated, show Login Page
  if (!isAdmin || activeTab === 'login') {
    return (
      <AdminLoginView
        onSuccess={handleLoginSuccess}
        onBackToSite={onBackToSite}
      />
    );
  }

  // If authenticated, render Admin Layout
  return (
    <AdminLayout
      currentAdminTab={activeTab as AdminTabType}
      onNavigateTab={handleNavigateTab}
      onBackToSite={onBackToSite}
    >
      {activeTab === 'dashboard' && (
        <AdminDashboardView
          onGoToDiseases={() => handleNavigateTab('diseases')}
          onGoToArticles={() => handleNavigateTab('articles')}
          onOpenCreateDisease={() => handleNavigateTab('diseases')}
          onOpenCreateArticle={() => handleNavigateTab('articles')}
        />
      )}

      {activeTab === 'diseases' && <AdminDiseasesView />}

      {activeTab === 'articles' && <AdminArticlesView />}

      {activeTab === 'tips' && <AdminTipsView />}

      {activeTab === 'gallery' && <AdminGalleryView />}

      {activeTab === 'site-config' && <AdminSiteConfigView />}
    </AdminLayout>
  );
};
