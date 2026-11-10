import React from 'react';
import { useData } from '../context/DataContext';
import {
  Activity,
  FileText,
  CheckCircle2,
  FileClock,
  Plus,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Lightbulb,
  Sliders,
  ShieldCheck,
  Camera,
} from 'lucide-react';

interface AdminDashboardViewProps {
  onGoToDiseases: () => void;
  onGoToArticles: () => void;
  onOpenCreateDisease: () => void;
  onOpenCreateArticle: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onGoToDiseases,
  onGoToArticles,
  onOpenCreateDisease,
  onOpenCreateArticle,
}) => {
  const { stats, diseases, articles, tips, resetDiseases, resetArticles, resetTips } = useData();

  const handleResetAll = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh data penyakit, artikel, dan tips ke setelan default awal?')) {
      resetDiseases();
      resetArticles();
      resetTips();
    }
  };

  const categoryCounts = diseases.reduce((acc, d) => {
    acc[d.categoryLabel] = (acc[d.categoryLabel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-br from-[#A8E6CF]/30 via-white to-[#FFD3B6]/30 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pusat Kendali Konten HIHO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Manajemen Medis & Edukasi Gizi
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Kelola direktori penyakit, parameter cut-off medis, anjuran & pantangan makanan, artikel edukasi gizi, tips harian, dan konfigurasi situs secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
          <button
            onClick={handleResetAll}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:text-rose-700 hover:bg-slate-50 transition-colors"
            title="Reset seluruh data ke default awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Penyakit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Penyakit
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#A8E6CF]/40 border border-emerald-300 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-800" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{stats.totalDiseases}</span>
            <span className="text-xs font-semibold text-emerald-800">Kondisi Medis</span>
          </div>
          <button
            onClick={onGoToDiseases}
            className="text-xs font-bold text-slate-700 hover:text-emerald-800 inline-flex items-center gap-1 pt-1"
          >
            <span>Kelola Daftar Penyakit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Total Artikel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Artikel
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FFD3B6]/40 border border-orange-300 flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-950" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{stats.totalArticles}</span>
            <span className="text-xs font-semibold text-orange-950">Tulisan Edukasi</span>
          </div>
          <button
            onClick={onGoToArticles}
            className="text-xs font-bold text-slate-700 hover:text-orange-950 inline-flex items-center gap-1 pt-1"
          >
            <span>Kelola Koleksi Artikel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Tips Harian Gizi */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tips Harian Gizi
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FFF5BA] border border-amber-300 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-amber-950" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-950">{stats.totalTips}</span>
            <span className="text-xs font-semibold text-amber-800">
              {stats.activeTips} Aktif di Beranda
            </span>
          </div>
          <a
            href="#admin/tips"
            className="text-xs font-bold text-slate-700 hover:text-amber-900 inline-flex items-center gap-1 pt-1"
          >
            <span>Kelola Tips Gizi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Card 4: Draft Artikel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Draft / Review
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <FileClock className="w-5 h-5 text-amber-700" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{stats.draftArticles}</span>
            <span className="text-xs font-semibold text-slate-500">Menunggu Terbit</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">Belum tampil di halaman publik</p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Aksi Cepat Manajemen
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={onOpenCreateDisease}
            className="flex items-center justify-between p-4 rounded-2xl bg-[#A8E6CF]/25 hover:bg-[#A8E6CF]/40 border border-emerald-300 transition-all group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#A8E6CF] flex items-center justify-center text-slate-900">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-950">
                  Tambah Data Penyakit
                </h4>
                <p className="text-xs text-slate-500">
                  Input cut-off medis, risiko, & anjuran makanan
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-800 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenCreateArticle}
            className="flex items-center justify-between p-4 rounded-2xl bg-[#FFD3B6]/25 hover:bg-[#FFD3B6]/40 border border-orange-300 transition-all group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFD3B6] flex items-center justify-center text-orange-950">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-950">
                  Tambah Artikel Gizi
                </h4>
                <p className="text-xs text-slate-500">
                  Tulis artikel dengan cover image & markdown
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-orange-900 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#admin/gallery"
            className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/50 hover:bg-emerald-100/50 border border-emerald-300 transition-all group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-950">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-950">
                  Galeri Kegiatan
                </h4>
                <p className="text-xs text-slate-500">
                  Upload & kelola foto dokumentasi Tentang Kami ({stats.totalActivities || 0})
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-800 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#admin/site-config"
            className="flex items-center justify-between p-4 rounded-2xl bg-[#FFF5BA]/35 hover:bg-[#FFF5BA]/50 border border-amber-300 transition-all group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF5BA] flex items-center justify-center text-amber-950">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-950">
                  Pengaturan Situs
                </h4>
                <p className="text-xs text-slate-500">
                  Kustomisasi brand, tagline, & disclaimer
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-950 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Two Columns: Category Breakdown & Recent Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Category Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Distribusi Kategori Penyakit
            </h3>
            <span className="text-xs text-slate-400">{diseases.length} total</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(categoryCounts).map(([catName, count]) => {
              const pct = Math.round((count / (diseases.length || 1)) * 100);
              return (
                <div key={catName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700">{catName}</span>
                    <span className="text-slate-500">{count} kondisi ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-[#A8E6CF] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Recent Articles Preview */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Artikel Terbaru yang Terdaftar
            </h3>
            <button
              onClick={onGoToArticles}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="space-y-2.5 pt-1">
            {articles.slice(0, 4).map((art) => (
              <div
                key={art.id}
                className="p-3 rounded-2xl bg-[#FAF9F6] border border-slate-100 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {art.imageUrl && (
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{art.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {art.category} · {art.author}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                    art.status === 'draft'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}
                >
                  {art.status === 'draft' ? 'Draft' : 'Published'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
