import React, { useState, useEffect } from 'react';
import { FoodRating } from '../types';
import { foodDatabase } from '../data/foodDatabase';
import { searchFoods, getStatusDetails } from '../utils/searchAndFilter';
import { Search, X, Utensils, AlertCircle, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface FoodCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const FoodCheckerModal: React.FC<FoodCheckerModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const [search, setSearch] = useState(initialQuery);
  const [selectedFood, setSelectedFood] = useState<FoodRating>(foodDatabase[0]);

  useEffect(() => {
    if (initialQuery) {
      setSearch(initialQuery);
      const match = foodDatabase.find((f) =>
        f.name.toLowerCase().includes(initialQuery.toLowerCase())
      );
      if (match) setSelectedFood(match);
    }
  }, [initialQuery]);

  if (!isOpen) return null;

  const filteredFoods = searchFoods(foodDatabase, search);

  const renderStatusBadge = (status: 'safe' | 'moderate' | 'avoid') => {
    const details = getStatusDetails(status);
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${details.badgeBg} ${details.badgeText} border ${details.borderColor}`}
      >
        {status === 'safe' && <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />}
        {status === 'moderate' && <AlertCircle className="w-3.5 h-3.5 text-amber-700" />}
        {status === 'avoid' && <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />}
        <span>{details.label}</span>
      </span>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-food-checker-title"
    >
      <div className="bg-[#FAF9F6] w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header - Sticky top-0 z-20 */}
        <div className="bg-white/95 backdrop-blur-xs px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFD3B6] flex items-center justify-center text-orange-950 font-bold">
              <Utensils className="w-5 h-5 text-orange-950" />
            </div>
            <div>
              <h2 id="modal-food-checker-title" className="text-base sm:text-lg font-bold text-slate-900">
                Cek Pantangan Makanan Harian
              </h2>
              <p className="text-xs text-slate-500">
                Panduan status keamanan makanan bagi Diabetes, Hipertensi, Asam Urat, & GERD
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Tutup jendela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Preset Chips */}
        <div className="bg-white px-6 py-3 border-b border-slate-200 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ketik makanan: Sate, Ikan Kembung, Santan, Emping, Bayam, Kopi..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-medium shrink-0">Pilihan Cepat:</span>
            {foodDatabase.slice(0, 7).map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setSelectedFood(item);
                  setSearch(item.name);
                }}
                className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition-colors ${
                  selectedFood.name === item.name
                    ? 'bg-[#FFD3B6] text-orange-950 font-bold shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {filteredFoods.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-sm font-bold text-slate-700">
                Makanan "{search}" belum ada di database cepat kami.
              </p>
              <p className="text-xs text-slate-500">
                Coba pilih menu populer di atas atau cari bahan dasarnya (misal: "daging", "ikan", "santan").
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active Food Card Banner */}
              <div className="bg-white p-5 rounded-2xl border border-orange-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-800">
                    {selectedFood.category}
                  </span>
                  <h3 className="text-xl font-black text-slate-900">{selectedFood.name}</h3>
                  <p className="text-xs text-slate-500">Porsi rujukan standar: {selectedFood.portion}</p>
                </div>
                <div className="px-3 py-1.5 bg-[#FAF9F6] rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 self-start sm:self-auto">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Review Medis HIHO</span>
                </div>
              </div>

              {/* Condition Safety Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Diabetes */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Diabetes Melitus</h4>
                      <p className="text-[11px] text-slate-500">Pengaruh terhadap gula darah</p>
                    </div>
                    {renderStatusBadge(selectedFood.diabetes.status)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed bg-[#FAF9F6] p-3 rounded-xl border border-slate-100">
                    {selectedFood.diabetes.note}
                  </p>
                </div>

                {/* 2. Hipertensi */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Hipertensi</h4>
                      <p className="text-[11px] text-slate-500">Pengaruh terhadap tekanan darah</p>
                    </div>
                    {renderStatusBadge(selectedFood.hypertension.status)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed bg-[#FAF9F6] p-3 rounded-xl border border-slate-100">
                    {selectedFood.hypertension.note}
                  </p>
                </div>

                {/* 3. Asam Urat */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Asam Urat (Gout)</h4>
                      <p className="text-[11px] text-slate-500">Kadar purin & risiko sendi</p>
                    </div>
                    {renderStatusBadge(selectedFood.gout.status)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed bg-[#FAF9F6] p-3 rounded-xl border border-slate-100">
                    {selectedFood.gout.note}
                  </p>
                </div>

                {/* 4. GERD & Maag */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">GERD & Maag</h4>
                      <p className="text-[11px] text-slate-500">Refluks asam & iritasi mukosa</p>
                    </div>
                    {renderStatusBadge(selectedFood.gerd.status)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed bg-[#FAF9F6] p-3 rounded-xl border border-slate-100">
                    {selectedFood.gerd.note}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-6 py-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Hasil panduan ini bersifat rekomendasi umum untuk keluarga sehat</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
