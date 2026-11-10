import React, { useState } from 'react';
import { Disease, HealthCategory } from '../types';
import { DiseaseCard } from '../components/DiseaseCard';
import { filterDiseasesByCategory, searchDiseases } from '../utils/searchAndFilter';
import { Search, Filter, ShieldCheck, Heart, Sparkles, X } from 'lucide-react';

interface DiseasesViewProps {
  diseases: Disease[];
  selectedCategory: HealthCategory;
  onCategoryChange: (category: HealthCategory) => void;
  onSelectDisease: (disease: Disease) => void;
  onOpenChecker: () => void;
}

export const DiseasesView: React.FC<DiseasesViewProps> = ({
  diseases,
  selectedCategory,
  onCategoryChange,
  onSelectDisease,
  onOpenChecker,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const categoryFilters: { id: HealthCategory; label: string }[] = [
    { id: 'semua', label: 'Semua Kondisi' },
    { id: 'metabolik', label: 'Metabolik (Diabetes & Urat)' },
    { id: 'pencernaan', label: 'Pencernaan (GERD & Maag)' },
    { id: 'jantung', label: 'Jantung & Hipertensi' },
    { id: 'lansia', label: 'Lansia & Ginjal' },
    { id: 'ibu-anak', label: 'Ibu & Anak (Anemia)' },
  ];

  // Apply category filtering then text search
  const categoryFiltered = filterDiseasesByCategory(diseases, selectedCategory);
  const finalFiltered = searchDiseases(categoryFiltered, searchQuery);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5" />
          <span>Direktori Gizi Klinis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Pilihan Direktori Penyakit & Panduan Makanan
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Temukan panduan gizi terpercaya untuk kondisi medis tertentu. Setiap panduan dilengkapi
          daftar makanan yang dianjurkan, pantangan yang harus dihindari, serta contoh menu 1 hari.
        </p>
      </div>

      {/* Search Bar & Category Segmented Controls */}
      <div className="space-y-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari penyakit atau bahan makanan (cth: Gula, Emping, Hipertensi, Oat, Maag)..."
            className="w-full pl-10 pr-10 py-3 bg-[#FAF9F6] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Hapus pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Tabs / Segmented Buttons (Compliant with Frontend Design rules for functional controls) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1" aria-label="Filter Kategori Penyakit">
          {categoryFilters.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onCategoryChange(tab.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl shrink-0 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Summary Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Menampilkan {finalFiltered.length} dari {diseases.length} kondisi terdaftar</span>
          <button
            onClick={onOpenChecker}
            className="text-emerald-800 hover:text-emerald-950 font-bold inline-flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Cek Pantangan Makanan Cepat →</span>
          </button>
        </div>
      </div>

      {/* Diseases Grid */}
      {finalFiltered.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-emerald-100 shadow-xs space-y-4 max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 mx-auto flex items-center justify-center">
            <Search className="w-7 h-7 text-amber-700" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Tidak ada penyakit ditemukan
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Tidak ada kondisi medis atau makanan yang sesuai dengan kata kunci{' '}
              <strong className="text-emerald-950 font-bold">"{searchQuery || selectedCategory}"</strong>.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setSearchQuery('');
                onCategoryChange('semua');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <span>Reset Semua Filter & Pencarian</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {finalFiltered.map((disease) => (
            <DiseaseCard
              key={disease.id}
              disease={disease}
              onSelect={onSelectDisease}
            />
          ))}
        </div>
      )}
    </div>
  );
};
