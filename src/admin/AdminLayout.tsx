import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import {
  LayoutDashboard,
  Activity,
  FileText,
  Lightbulb,
  Sliders,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Heart,
  ShieldCheck,
  User,
  ChevronRight,
  Camera,
} from 'lucide-react';

export type AdminTabType = 'dashboard' | 'diseases' | 'articles' | 'tips' | 'gallery' | 'site-config';

interface AdminLayoutProps {
  currentAdminTab: AdminTabType;
  onNavigateTab: (tab: AdminTabType) => void;
  onBackToSite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentAdminTab,
  onNavigateTab,
  onBackToSite,
  children,
}) => {
  const { adminUser, logout } = useData();
  const { config } = useSiteConfig();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems: { id: AdminTabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'diseases',
      label: 'Kelola Penyakit (CRUD)',
      icon: <Activity className="w-4 h-4" />,
    },
    {
      id: 'articles',
      label: 'Kelola Artikel Gizi (CRUD)',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'tips',
      label: 'Kelola Tips Gizi (CRUD)',
      icon: <Lightbulb className="w-4 h-4" />,
    },
    {
      id: 'gallery',
      label: 'Galeri Kegiatan (CRUD)',
      icon: <Camera className="w-4 h-4" />,
    },
    {
      id: 'site-config',
      label: 'Pengaturan Situs (Config)',
      icon: <Sliders className="w-4 h-4" />,
    },
  ];

  const handleSelectTab = (tab: AdminTabType) => {
    onNavigateTab(tab);
    setMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    onBackToSite();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col lg:flex-row text-slate-800">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#A8E6CF] to-[#8DE9D1] flex items-center justify-center font-bold text-slate-900">
            <Heart className="w-4 h-4 text-slate-900 fill-white" />
          </div>
          <div>
            <span className="font-black text-slate-900 tracking-tight text-sm">
              <span className="text-[#FF9F68]">HI</span>
              <span className="text-[#4ECCA3]">HO</span>
            </span>
            <span className="ml-1.5 text-[9px] font-bold text-emerald-900 bg-[#A8E6CF]/60 px-1.5 py-0.5 rounded">
              Admin
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900"
          aria-label="Toggle menu"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-full lg:h-screen w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto p-5">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A8E6CF] via-[#8DE9D1] to-[#FFD3B6] flex items-center justify-center shadow-xs">
                <Heart className="w-5 h-5 text-slate-900 fill-white/80" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black text-slate-900 tracking-tight">
                    <span className="text-[#FF9F68]">HI</span>
                    <span className="text-[#4ECCA3]">HO</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-900 bg-[#A8E6CF] px-2 py-0.5 rounded-full border border-emerald-300">
                    Portal
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-slate-400">Admin & Content Management</p>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="mt-5 p-3 rounded-2xl bg-[#FAF9F6] border border-slate-200/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FFD3B6] flex items-center justify-center text-orange-950 font-bold shrink-0">
              <User className="w-4 h-4 text-orange-950" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {adminUser?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-emerald-800 font-semibold truncate">
                {adminUser?.role || 'Super Admin'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5 flex-1" aria-label="Menu Admin">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Menu Navigasi
            </p>
            {menuItems.map((item) => {
              const isActive = currentAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#A8E6CF]/40 text-emerald-950 border border-emerald-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-emerald-800' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-800" />}
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions: Back to Main Site & Logout */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={onBackToSite}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>Lihat Website Utama</span>
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Keluar (Logout)</span>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full">
        {children}
      </main>
    </div>
  );
};
