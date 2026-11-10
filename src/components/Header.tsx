import React, { useState } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { Search, Menu, X, ShieldCheck, Heart } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tabId: string) => void;
  onOpenSearch: () => void;
  onOpenChecker?: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenSearch,
  onOpenAdmin,
}) => {
  const { config } = useSiteConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-emerald-950/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-6">
          {/* Logo & Sub-headline - Spacious gap between logo area and navigation */}
          <div className="flex items-center gap-3 shrink-0 mr-4 sm:mr-8 lg:mr-10">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-2xl p-1 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-95"
              aria-label="HIHO - Healthy Inside Healthy Outside - Beranda"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#A8E6CF] via-[#8DE9D1] to-[#FFD3B6] flex items-center justify-center text-slate-900 font-extrabold shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-200 shrink-0">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900 fill-white/80" />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 leading-none">
                  <span className="text-xl sm:text-2xl font-black tracking-tight flex items-baseline">
                    <span className="text-[#FF9F68]">HI</span>
                    <span className="text-[#4ECCA3]">HO</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-emerald-900 bg-[#A8E6CF]/60 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-300/50 shrink-0">
                    {config.brand.logo.badge || 'Edukasi Gizi'}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[11px] font-medium text-slate-500 tracking-wide mt-0.5 leading-tight truncate max-w-[145px] sm:max-w-none">
                  Healthy Inside Healthy Outside
                </span>
              </div>
            </button>
          </div>

          {/* Desktop/Tablet Navigation Links (visible on md: >= 768px) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5 flex-1 justify-start ml-2" aria-label="Navigasi Utama">
            {config.header.navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative px-3 lg:px-4 py-2 text-xs lg:text-sm font-semibold rounded-xl cursor-pointer transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    isActive
                      ? 'text-emerald-950 bg-[#A8E6CF]/40 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 hover:-translate-y-0.5'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 lg:left-4 lg:right-4 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Header Actions: Search & Admin Portal */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Global Search Trigger Bar */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 sm:gap-2.5 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-200/90 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium shadow-xs cursor-pointer transition-all duration-200 ease-in-out hover:border-emerald-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Buka pencarian global"
            >
              <Search className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="hidden lg:inline-block text-slate-500 max-w-[200px] truncate text-left">
                {config.header.searchPlaceholder}
              </span>
              <span className="lg:hidden text-slate-600 font-medium text-xs">Cari</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-sans font-semibold text-slate-400 bg-slate-100 rounded border border-slate-200">
                ⌘K
              </kbd>
            </button>

            {/* Admin Portal Button */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-all duration-200 ease-in-out shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-98"
                title="Buka Portal Admin HIHO"
                aria-label="Buka Portal Admin"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#8DE9D1]" />
                <span>Portal Admin</span>
              </button>
            )}

            {/* Dedicated Mobile Hamburger Menu Button (< 768px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-over Drawer / Dropdown (< 768px) */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200/80 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 bg-[#FAF9F6] px-2 rounded-2xl mb-3 shadow-md border">
            {/* Mobile Search Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full flex items-center gap-2.5 bg-white border border-slate-200/90 px-4 py-2.5 rounded-xl text-left text-xs font-medium text-slate-500 shadow-xs hover:border-emerald-300"
            >
              <Search className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Cari penyakit, bahan makanan, artikel...</span>
            </button>

            {/* Nav Links */}
            <div className="space-y-1 pt-1">
              {config.header.navLinks.map((link) => {
                const isActive = currentTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold rounded-xl text-left cursor-pointer transition-all duration-200 ${
                      isActive
                        ? 'bg-[#A8E6CF]/40 text-emerald-950 font-bold border border-emerald-300/50'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Admin Link */}
            {onOpenAdmin && (
              <div className="pt-2 border-t border-slate-200">
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-xs cursor-pointer transition-all duration-200"
                >
                  <ShieldCheck className="w-4 h-4 text-[#8DE9D1]" />
                  <span>Buka Portal Admin HIHO</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
