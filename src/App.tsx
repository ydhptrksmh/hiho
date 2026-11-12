/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { DataProvider, useData } from './context/DataContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { DiseasesView } from './views/DiseasesView';
import { ArticlesView } from './views/ArticlesView';
import { AboutView } from './views/AboutView';
import { DiseaseDetailModal } from './components/DiseaseDetailModal';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { FoodCheckerModal } from './components/FoodCheckerModal';
import { CreateArticleModal } from './components/CreateArticleModal';
import { AdminPortal } from './admin/AdminPortal';
import { Disease, Article, HealthCategory } from './types';
import { AlertCircle, ArrowUp, CheckCircle2, ShieldCheck } from 'lucide-react';

function MainApp() {
  const {
    diseases,
    articles,
    addArticle,
    deleteArticle,
    isAdmin,
    isLoadingData,
    dataError,
    clearDataError,
    retrySupabaseSync,
  } = useData();

  // Mode: public site or admin portal
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return window.location.hash.startsWith('#admin') || window.location.pathname.startsWith('/admin');
  });

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<HealthCategory>('semua');
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckerOpen, setIsCheckerOpen] = useState(false);
  const [checkerQuery, setCheckerQuery] = useState('');
  const [isCreateArticleOpen, setIsCreateArticleOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync hash with admin mode
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#admin') || window.location.pathname.startsWith('/admin')) {
        setIsAdminMode(true);
      } else {
        setIsAdminMode(false);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleNavigate = (tabId: string) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCheckerWithFood = (foodQuery?: string) => {
    if (foodQuery) setCheckerQuery(foodQuery);
    setIsCheckerOpen(true);
  };

  const handleFilterFromFooter = (category: HealthCategory) => {
    setSelectedCategory(category);
    setCurrentTab('penyakit');
  };

  const handleOpenAdmin = () => {
    setIsAdminMode(true);
    window.location.hash = isAdmin ? 'admin/dashboard' : 'admin/login';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSite = () => {
    setIsAdminMode(false);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Only show published articles on public site, and keep open detail modals live-synced
  const publishedArticles = articles.filter((a) => a.status !== 'draft');
  const activeSelectedDisease = selectedDisease
    ? diseases.find((d) => d.id === selectedDisease.id) || selectedDisease
    : null;
  const activeSelectedArticle = selectedArticle
    ? articles.find((a) => a.id === selectedArticle.id) || selectedArticle
    : null;

  // If in Admin Mode, render the full protected Admin Portal
  if (isAdminMode) {
    return <AdminPortal onBackToSite={handleBackToSite} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-800">
      {/* 100% Config-Driven Modular Header with Admin Portal button */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {dataError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-rose-900"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{dataError}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => void retrySupabaseSync()}
                className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-colors"
              >
                Muat Ulang Supabase
              </button>
              <button
                type="button"
                onClick={clearDataError}
                className="px-2.5 py-1.5 rounded-xl text-rose-800 hover:bg-rose-100 text-xs font-bold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
        {isLoadingData && diseases.length === 0 && articles.length === 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs text-center text-xs sm:text-sm font-semibold text-emerald-900 animate-pulse">
            Memuat data direktori penyakit &amp; artikel terbaru dari Supabase...
          </div>
        )}
        {currentTab === 'home' && (
          <HomeView
            featuredDiseases={diseases}
            latestArticles={publishedArticles}
            onSelectDisease={(d) => setSelectedDisease(d)}
            onSelectArticle={(a) => setSelectedArticle(a)}
            onNavigate={handleNavigate}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {currentTab === 'penyakit' && (
          <DiseasesView
            diseases={diseases}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onSelectDisease={(d) => setSelectedDisease(d)}
            onOpenChecker={() => {
              setCheckerQuery('');
              setIsCheckerOpen(true);
            }}
          />
        )}

        {currentTab === 'artikel' && (
          <ArticlesView
            articles={publishedArticles}
            onSelectArticle={(a) => setSelectedArticle(a)}
            onOpenCreateArticle={() => setIsCreateArticleOpen(true)}
            onDeleteArticle={async (id) => {
              const res = await deleteArticle(id);
              showToast(res.success ? 'Artikel berhasil dihapus.' : res.error || 'Gagal menghapus artikel.');
            }}
          />
        )}

        {currentTab === 'tentang' && <AboutView />}
      </main>

      {/* 100% Config-Driven Modular Footer with Admin Portal link */}
      <Footer
        onNavigate={handleNavigate}
        onFilterCategory={handleFilterFromFooter}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Interactive Modals & Drawers */}
      <DiseaseDetailModal
        disease={activeSelectedDisease}
        onClose={() => setSelectedDisease(null)}
        onOpenChecker={() => {
          setCheckerQuery('');
          setIsCheckerOpen(true);
        }}
      />

      <ArticleDetailModal
        article={activeSelectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectDisease={(d) => setSelectedDisease(d)}
        onSelectArticle={(a) => setSelectedArticle(a)}
        onOpenFoodChecker={handleOpenCheckerWithFood}
      />

      <FoodCheckerModal
        isOpen={isCheckerOpen}
        onClose={() => setIsCheckerOpen(false)}
        initialQuery={checkerQuery}
      />

      <CreateArticleModal
        isOpen={isCreateArticleOpen}
        onClose={() => setIsCreateArticleOpen(false)}
        onSaveArticle={async (newArt) => {
          const res = await addArticle({ ...newArt, status: 'published' });
          if (res.success) {
            showToast(`Artikel "${newArt.title}" berhasil diterbitkan!`);
            setSelectedArticle(newArt);
          } else {
            showToast(res.error || 'Gagal menerbitkan artikel ke database.');
          }
        }}
      />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-4 duration-200 border border-emerald-500/30"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-2.5">
        {/* Floating Quick Action: Admin Portal Access */}
        <button
          onClick={handleOpenAdmin}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 border border-slate-700"
          title="Buka Portal Admin & Manajemen CRUD"
        >
          <ShieldCheck className="w-4 h-4 text-[#8DE9D1]" />
          <span>Portal Admin</span>
        </button>

        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg hover:bg-slate-800 transition-all hover:scale-110 focus:outline-none"
            aria-label="Kembali ke atas"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SiteConfigProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </SiteConfigProvider>
  );
}
