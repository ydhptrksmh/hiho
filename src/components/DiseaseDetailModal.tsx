import React, { useState } from 'react';
import { Disease } from '../types';
import {
  X,
  CheckCircle2,
  XCircle,
  Printer,
  Share2,
  AlertTriangle,
  Clock,
  Info,
  Gauge,
  Activity,
  HeartPulse,
  Flame,
  Droplet,
  ShieldAlert,
  Utensils,
  Image as ImageIcon,
} from 'lucide-react';

interface DiseaseDetailModalProps {
  disease: Disease | null;
  onClose: () => void;
  onOpenChecker?: () => void;
}

// Subcomponent for food card with graceful image fallback
const FoodItemRow: React.FC<{
  item: { item: string; category?: string; portionOrReason?: string; detail?: string; imageUrl?: string };
  type: 'allowed' | 'avoid';
}> = ({ item, type }) => {
  const [imgError, setImgError] = useState(false);
  const isAllowed = type === 'allowed';

  return (
    <div
      className={`p-3 sm:p-3.5 rounded-2xl flex gap-3 items-start transition-colors ${
        isAllowed
          ? 'bg-[#A8E6CF]/15 border border-emerald-200/80 hover:bg-[#A8E6CF]/25'
          : 'bg-[#FFD3B6]/15 border border-orange-200/80 hover:bg-[#FFD3B6]/25'
      }`}
    >
      {item.imageUrl && !imgError ? (
        <img
          src={item.imageUrl}
          alt={item.item}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border shadow-xs ${
            isAllowed ? 'border-emerald-200' : 'border-orange-200'
          }`}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border flex items-center justify-center shrink-0 ${
            isAllowed
              ? 'bg-[#A8E6CF]/40 border-emerald-200 text-emerald-800'
              : 'bg-[#FFD3B6]/40 border-orange-200 text-orange-950'
          }`}
        >
          <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      )}

      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h5 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
            {item.item}
          </h5>
          {item.category && (
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                isAllowed
                  ? 'text-emerald-900 bg-white border-emerald-300'
                  : 'text-orange-950 bg-white border-orange-300'
              }`}
            >
              {item.category}
            </span>
          )}
        </div>
        {item.detail && (
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
            {item.detail}
          </p>
        )}
        <p
          className={`text-[11px] font-bold pt-0.5 ${
            isAllowed ? 'text-emerald-950' : 'text-orange-950'
          }`}
        >
          {isAllowed ? 'Takaran:' : 'Alasan:'} {item.portionOrReason || (isAllowed ? 'Sesuai anjuran' : 'Batasi ketat')}
        </p>
      </div>
    </div>
  );
};

export const DiseaseDetailModal: React.FC<DiseaseDetailModalProps> = ({
  disease,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'panduan' | 'menu'>('panduan');
  const [copied, setCopied] = useState(false);
  const [bannerError, setBannerError] = useState(false);

  if (!disease) return null;

  // Defensive food lists extraction
  type FoodItem = { item: string; category?: string; portionOrReason?: string; detail?: string; imageUrl?: string };

  const allowedList: FoodItem[] = Array.isArray(disease?.allowedFoods) && disease.allowedFoods.length > 0
    ? (disease.allowedFoods as FoodItem[])
    : Array.isArray((disease as any)?.recommendedFoods)
    ? (disease as any).recommendedFoods.map((f: any) =>
        typeof f === 'string' ? { item: f, portionOrReason: 'Porsi sesuai anjuran' } : f
      )
    : [];

  const avoidList: FoodItem[] = Array.isArray(disease?.avoidFoods) && disease.avoidFoods.length > 0
    ? (disease.avoidFoods as FoodItem[])
    : Array.isArray((disease as any)?.foodsToAvoid)
    ? (disease as any).foodsToAvoid.map((f: any) =>
        typeof f === 'string' ? { item: f, portionOrReason: 'Pantang dikonsumsi' } : f
      )
    : [];

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const allowedSummary = Array.isArray(disease?.quickAllowed) && disease.quickAllowed.length > 0
      ? disease.quickAllowed.join(', ')
      : allowedList.map((f: any) => f.item).slice(0, 5).join(', ');

    const avoidSummary = Array.isArray(disease?.quickAvoid) && disease.quickAvoid.length > 0
      ? disease.quickAvoid.join(', ')
      : avoidList.map((f: any) => f.item).slice(0, 5).join(', ');

    navigator.clipboard.writeText(
      `Panduan Nutrisi HIHO - ${disease?.name} (${disease?.indonesianName})\nKriteria Cut-off: ${disease?.criteria || 'Lihat panduan klinis'}\nDianjurkan: ${allowedSummary}\nHindari: ${avoidSummary}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderIcon = (icon: string) => {
    if (!icon) return <Activity className="w-6 h-6 text-slate-800" />;
    if (/\p{Extended_Pictographic}/u.test(icon) || icon.length <= 4) {
      return <span className="text-2xl leading-none select-none">{icon}</span>;
    }
    switch (icon) {
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6 text-slate-800" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-slate-800" />;
      case 'Droplet':
        return <Droplet className="w-6 h-6 text-slate-800" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-slate-800" />;
      default:
        return <Activity className="w-6 h-6 text-slate-800" />;
    }
  };

  const hasBanner = Boolean(disease?.imageUrl && !bannerError);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-disease-title"
    >
      <div className="bg-[#FAF9F6] w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Top Header Bar - Sticky top-0 z-20 for instant mobile accessibility */}
        <div className="bg-white/95 backdrop-blur-xs px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 flex items-center justify-between gap-3 sticky top-0 z-20">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#A8E6CF] to-[#8DE9D1] flex items-center justify-center shadow-xs shrink-0">
              {renderIcon(disease?.iconName || '')}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-900 bg-[#A8E6CF]/50 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-300 truncate inline-block">
                {disease?.categoryLabel || disease?.category || 'Kondisi Medis'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Salin ringkasan panduan"
              aria-label="Salin ringkasan panduan"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors hidden sm:inline-flex"
              title="Cetak lembar edukasi"
              aria-label="Cetak lembar edukasi"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-950 bg-slate-100 sm:bg-transparent hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Tutup jendela modal"
            >
              <X className="w-5 h-5 text-slate-800" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-7 md:p-8 space-y-5 sm:space-y-6 flex-1">
          {/* Main Disease Cover Banner / Thumbnail (Dynamic with graceful fallback) */}
          {hasBanner && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs max-h-56 bg-slate-100">
              <img
                src={disease.imageUrl}
                alt={disease.name}
                className="w-full h-40 sm:h-52 object-cover"
                onError={() => setBannerError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-bold bg-slate-900/80 backdrop-blur-xs px-3 py-1 rounded-lg">
                  {disease.name}
                </span>
              </div>
            </div>
          )}

          {/* Title & Indonesian Name & Summary */}
          <div className="space-y-2">
            <h2 id="modal-disease-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {disease.name}
            </h2>
            <p className="text-sm font-bold text-emerald-800">
              {disease.indonesianName}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {disease.summary}
            </p>
          </div>

          {copied && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold rounded-xl text-center">
              Ringkasan panduan & kriteria cut-off berhasil disalin ke papan klip!
            </div>
          )}

          {/* 1. CUT-OFF / CRITERIA PARAMETER BOX */}
          <div className="bg-gradient-to-r from-[#FFF5BA] via-[#FFEAA7] to-[#FFF5BA] p-4 sm:p-5 rounded-2xl border border-amber-300 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-400/40 flex items-center justify-center text-amber-950">
                <Gauge className="w-4 h-4 text-amber-950" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-950">
                Parameter & Kriteria Batas Medis (Cut-Off Threshold)
              </span>
            </div>
            <p className="text-xs sm:text-sm font-black text-slate-900 leading-relaxed pl-9">
              {disease.criteria || 'Konsultasikan dengan dokter untuk evaluasi batas parameter laboratorium spesifik.'}
            </p>
          </div>

          {/* 2. PENJELASAN RINGKAS (PATHOPHYSIOLOGY) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>Mekanisme Fisiologis (Mengapa Nutrisi Berpengaruh):</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {disease.pathophysiology}
            </p>
          </div>

          {/* 3. FAKTOR RISIKO & DAMPAK KESEHATAN JIKA TIDAK TERKONTROL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Risk Factors Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-[#FFD3B6]/60 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-orange-950" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Faktor Risiko Utama
                </h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {(disease.riskFactors || [
                  'Pola makan tidak seimbang dan tinggi natrium/gula',
                  'Kurang aktivitas fisik aerobik teratur',
                  'Faktor genetik atau riwayat keluarga',
                ]).map((rf, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold shrink-0 mt-0.5">•</span>
                    <span>{rf}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Health Impacts Card */}
            <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-rose-100">
                <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-rose-700" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-950">
                  Dampak Jika Tidak Terkontrol
                </h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {(disease.healthImpacts || [
                  'Peningkatan risiko komplikasi vaskular akut',
                  'Beban kerja organ metabolik meningkat drastis',
                  'Kualitas hidup menurun akibat kekambuhan berulang',
                ]).map((hi, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                    <span>{hi}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Navigation Controls: strictly "Panduan Makanan" and "Contoh Menu Harian" */}
          <div className="flex items-center gap-2 p-1 bg-slate-200/60 rounded-xl">
            <button
              onClick={() => setActiveTab('panduan')}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'panduan'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Panduan Makanan
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'menu'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Contoh Menu Harian
            </button>
          </div>

          {/* TAB 1: SECTION STRICTLY NAMED "Panduan Makanan" */}
          {activeTab === 'panduan' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Panduan Makanan
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {allowedList.length} Dianjurkan · {avoidList.length} Dipantang
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 4A. MAKANAN SANGAT DIANJURKAN (Soft Pastel Green) */}
                <div className="bg-white rounded-3xl p-4 sm:p-6 border border-emerald-300 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-emerald-100">
                    <div className="w-8 h-8 rounded-xl bg-[#A8E6CF] flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-950" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        Makanan Dianjurkan
                      </h4>
                      <p className="text-[11px] text-emerald-800 font-medium">
                        Mendukung pemulihan & kestabilan klinis
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {allowedList.map((item, idx) => (
                      <FoodItemRow key={idx} item={item} type="allowed" />
                    ))}
                    {allowedList.length === 0 && (
                      <p className="text-xs text-slate-400 italic text-center py-4">
                        Belum ada daftar makanan anjuran.
                      </p>
                    )}
                  </div>
                </div>

                {/* 4B. MAKANAN DIBATASI / DIPANTANG (Soft Pastel Orange) */}
                <div className="bg-white rounded-3xl p-4 sm:p-6 border border-orange-300 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-orange-100">
                    <div className="w-8 h-8 rounded-xl bg-[#FFD3B6] flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-orange-950" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        Makanan Dipantang / Dibatasi
                      </h4>
                      <p className="text-[11px] text-orange-900 font-medium">
                        Memicu kekambuhan & komplikasi akut
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {avoidList.map((item, idx) => (
                      <FoodItemRow key={idx} item={item} type="avoid" />
                    ))}
                    {avoidList.length === 0 && (
                      <p className="text-xs text-slate-400 italic text-center py-4">
                        Belum ada daftar makanan pantangan.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTOH MENU HARIAN */}
          {activeTab === 'menu' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Clock className="w-5 h-5 text-emerald-700" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Contoh Menu Harian
                  </h3>
                  <p className="text-xs text-slate-500">
                    Jadwal & panduan porsi makan ramah kondisi {disease.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Sarapan Pagi (06.30 - 07.30)
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {disease.sampleMealPlan?.breakfast || 'Pilihan sarapan berserat tinggi dan rendah natrium.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                    Snack Pagi (09.30 - 10.00)
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {disease.sampleMealPlan?.snackPagi || disease.sampleMealPlan?.snack || '1 porsi buah segar berserat tinggi.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Makan Siang (12.00 - 13.00)
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {disease.sampleMealPlan?.lunch || 'Menu gizi seimbang prinsip Piring Model T.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                    Snack Sore (15.30 - 16.00)
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {disease.sampleMealPlan?.snackSore || 'Kudapan rebus atau kacang-kacangan tanpa garam.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 space-y-1 sm:col-span-2">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Makan Malam (18.30 - 19.30)
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {disease.sampleMealPlan?.dinner || 'Makan malam porsi ringan 3 jam sebelum waktu tidur.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-white px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#FF9F68]">HI</span>
            <span className="font-bold text-[#4ECCA3]">HO</span>
            <span>· Healthy Inside Healthy Outside · Edukasi Nutrisi Keluarga</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-xs"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
