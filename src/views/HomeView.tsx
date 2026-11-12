import React, { useState } from 'react';
import { Disease, Article } from '../types';
import { useData } from '../context/DataContext';
import { DiseaseCard } from '../components/DiseaseCard';
import {
  ArrowRight,
  Heart,
  Lightbulb,
  RotateCw,
  BookOpen,
  Share2,
  Calendar,
} from 'lucide-react';

interface HomeViewProps {
  featuredDiseases: Disease[];
  latestArticles: Article[];
  onSelectDisease: (disease: Disease) => void;
  onSelectArticle: (article: Article) => void;
  onNavigate: (tabId: string) => void;
  onOpenSearch: () => void;
  onOpenChecker?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  featuredDiseases,
  latestArticles,
  onSelectDisease,
  onSelectArticle,
  onNavigate,
}) => {
  const { tips } = useData();

  // Active tips managed dynamically from Admin CRUD
  const activeTips = tips.filter((t) => t.isActive !== false);
  const effectiveTips = activeTips.length > 0 ? activeTips : tips;

  const [tipIndex, setTipIndex] = useState(0);
  const currentTip = effectiveTips[tipIndex % effectiveTips.length];
  const [tipCopied, setTipCopied] = useState(false);

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % effectiveTips.length);
  };

  const copyTip = () => {
    if (!currentTip) return;
    navigator.clipboard.writeText(`Tips Gizi HIHO: ${currentTip.title} - ${currentTip.tip}`);
    setTipCopied(true);
    setTimeout(() => setTipCopied(false), 2000);
  };

  return (
    <div className="space-y-14 sm:space-y-16 pb-8">
      {/* ============================================================== */}
      {/* 1. INTRO / HERO SECTION (Clean, Focused, No Micro-Badge Clutter) */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden pt-4 sm:pt-10 pb-4 sm:pb-6">
        {/* Soft Pastel Ambient Glow */}
        <div className="absolute top-0 right-0 -mr-24 -mt-20 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[#A8E6CF]/30 blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-20 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[#FFD3B6]/30 blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.18]">
            Makan Enak, Hidup Sehat,{' '}
            <span className="relative inline-block text-emerald-800">
              Bebas Cemas
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#A8E6CF]/40 -z-10 rounded-sm" />
            </span>{' '}
            Penyakit.
          </h1>

          {/* Mission Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            HIHO (<em>Healthy Inside Healthy Outside</em>) mendampingi keluarga Indonesia
            memahami anjuran gizi dan pantangan ramah kondisi medis — dari Diabetes, Hipertensi,
            Asam Urat, hingga GERD — dengan bahasa yang praktis, mudah diterapkan, dan terstandar klinis.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => onNavigate('penyakit')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:scale-102 hover:-translate-y-0.5 active:scale-98"
            >
              <span>Jelajahi Direktori Penyakit</span>
              <ArrowRight className="w-4 h-4 text-[#8DE9D1]" />
            </button>

            <button
              onClick={() => onNavigate('artikel')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200/90 shadow-xs cursor-pointer transition-all duration-200 ease-in-out hover:scale-102 hover:-translate-y-0.5 active:scale-98"
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Baca Artikel & Panduan Gizi</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. TIPS HARIAN GIZI SEHAT (Dynamic Tip from Admin CRUD Data)   */}
      {/* ============================================================== */}
      <section className="max-w-5xl mx-auto">
        {currentTip ? (
          <div className="bg-gradient-to-r from-[#FFF5BA] via-[#FFEAA7] to-[#FFF5BA] p-6 sm:p-8 rounded-3xl border border-amber-300 shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-400/40 flex items-center justify-center text-amber-950">
                    <Lightbulb className="w-5 h-5 text-amber-950" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-950">
                    Tips Harian Gizi Sehat ({tipIndex + 1} dari {effectiveTips.length})
                  </span>
                  <span className="text-[10px] font-bold text-amber-950 bg-white/80 px-2.5 py-0.5 rounded-md border border-amber-300">
                    {currentTip.category}
                  </span>
                  {currentTip.date && (
                    <span className="text-[10px] text-amber-900/80 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      {currentTip.date}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  "{currentTip.title}"
                </h3>

                <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                  {currentTip.tip}
                </p>

                {currentTip.scientificContext && (
                  <p className="text-xs text-slate-700 leading-relaxed bg-white/60 p-3.5 rounded-2xl border border-amber-200 mt-2">
                    <strong>Mengapa ini penting?</strong> {currentTip.scientificContext}
                  </p>
                )}
              </div>

              {/* Tip Navigation & Share */}
              <div className="flex flex-row md:flex-col items-center gap-2.5 shrink-0 self-stretch md:self-auto justify-end">
                <button
                  onClick={nextTip}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                  aria-label="Tampilkan tips nutrisi berikutnya"
                >
                  <RotateCw className="w-3.5 h-3.5 text-amber-300" />
                  <span>Tips Berikutnya</span>
                </button>

                <button
                  onClick={copyTip}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-xs font-bold border border-amber-300 cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-xs active:scale-95"
                  title="Salin tips ke papan klip"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>{tipCopied ? 'Tersalin!' : 'Bagikan Tips'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-white rounded-3xl border border-amber-200 text-center text-sm text-slate-500">
            Belum ada tips gizi aktif. Tambahkan melalui Portal Admin.
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 3. DIREKTORI PENYAKIT (Maximum of 3 disease cards)            */}
      {/* ============================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <Heart className="w-3.5 h-3.5" />
              <span>Direktori Medis Terpopuler</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pilihan Panduan Nutrisi Penyakit
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Pelajari parameter kriteria medis, makanan dianjurkan, dan makanan yang harus dibatasi.
            </p>
          </div>

          <button
            onClick={() => onNavigate('penyakit')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer transition-all duration-200 ease-in-out hover:-translate-x-0.5 self-start sm:self-auto group"
          >
            <span>Lihat Semua Penyakit ({featuredDiseases.length}+)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Responsive Grid: Maximum exactly 3 cards */}
        {featuredDiseases.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-xs space-y-2">
            <p className="text-sm font-bold text-slate-800">
              Belum ada data penyakit yang dipublikasikan.
            </p>
            <p className="text-xs text-slate-500">
              Tambahkan kondisi medis atau isi data bawaan melalui Portal Admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredDiseases.slice(0, 3).map((disease) => (
              <DiseaseCard
                key={disease.id}
                disease={disease}
                onSelect={onSelectDisease}
              />
            ))}
          </div>
        )}

        {/* Prominent "Lihat Semua Penyakit" button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => onNavigate('penyakit')}
            className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:scale-102 hover:-translate-y-0.5 active:scale-98"
          >
            <Heart className="w-4 h-4 text-[#8DE9D1]" />
            <span>Lihat Semua Direktori Penyakit ({featuredDiseases.length} Kondisi Medis)</span>
            <ArrowRight className="w-4 h-4 text-[#8DE9D1]" />
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. ARTIKEL GIZI (Maximum of 3 article cards)                   */}
      {/* ============================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Edukasi & Riset Gizi Klinis Terkini</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Artikel & Wawasan Gizi Terbaru
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Ulasan mendalam berbasis pedoman klinis Kemenkes, ADA, dan ESPEN.
            </p>
          </div>

          <button
            onClick={() => onNavigate('artikel')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer transition-all duration-200 ease-in-out self-start sm:self-auto group"
          >
            <span>Semua Artikel ({latestArticles.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Articles Responsive Grid: Maximum exactly 3 cards, fully clickable */}
        {latestArticles.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-xs space-y-2">
            <p className="text-sm font-bold text-slate-800">
              Belum ada artikel gizi yang diterbitkan.
            </p>
            <p className="text-xs text-slate-500">
              Terbitkan artikel pertama Anda melalui Portal Admin atau menu Artikel Gizi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {latestArticles.slice(0, 3).map((article) => (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-lg transition-all duration-200 ease-in-out hover:-translate-y-1 flex flex-col justify-between group cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectArticle(article);
                  }
                }}
              >
                {/* Cover Image Thumbnail if available */}
                {article.imageUrl ? (
                  <div className="h-44 w-full overflow-hidden relative bg-slate-100">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold text-emerald-950 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-emerald-200 shadow-xs">
                        {article.category}
                      </span>
                    </div>
                  </div>
                ) : null}

                <div className="p-4 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    {!article.imageUrl && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-bold text-emerald-800">{article.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{article.readingTime}</span>
                      </div>
                    )}

                    {article.imageUrl && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{article.readingTime}</span>
                        <span aria-hidden="true">·</span>
                        <span>{article.publishDate}</span>
                      </div>
                    )}

                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-950 transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium truncate max-w-[170px]">
                      Review: {article.reviewer}
                    </span>
                    <span
                      className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 inline-flex items-center gap-1"
                    >
                      <span>Baca</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Prominent "Lihat Semua Artikel" button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => onNavigate('artikel')}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm border border-slate-200 shadow-xs cursor-pointer transition-all duration-200 ease-in-out hover:scale-102 hover:-translate-y-0.5 active:scale-98"
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Lihat Semua Artikel Gizi & Edukasi ({latestArticles.length} Tulisan)</span>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </section>
    </div>
  );
};
