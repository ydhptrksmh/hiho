import React, { useState } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { X, RotateCcw, Check, Sliders, FileCode, Sparkles } from 'lucide-react';

interface SiteConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SiteConfigDrawer: React.FC<SiteConfigDrawerProps> = ({ isOpen, onClose }) => {
  const { config, updateConfig, resetConfig, isCustomized } = useSiteConfig();

  const [logoText, setLogoText] = useState(config.brand.logo.text);
  const [logoAccent, setLogoAccent] = useState(config.brand.logo.accentText);
  const [logoBadge, setLogoBadge] = useState(config.brand.logo.badge);
  const [brandFullName, setBrandFullName] = useState(config.brand.fullName);
  const [searchPlaceholder, setSearchPlaceholder] = useState(config.header.searchPlaceholder);
  const [ctaLabel, setCtaLabel] = useState(config.header.ctaButton.label);
  const [brandTagline, setBrandTagline] = useState(config.footer.brandTagline);
  const [disclaimerText, setDisclaimerText] = useState(config.footer.disclaimerText);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        fullName: brandFullName,
        logo: {
          ...prev.brand.logo,
          text: logoText,
          accentText: logoAccent,
          badge: logoBadge,
        },
      },
      header: {
        ...prev.header,
        searchPlaceholder: searchPlaceholder,
        ctaButton: {
          ...prev.header.ctaButton,
          label: ctaLabel,
        },
      },
      footer: {
        ...prev.footer,
        brandTagline: brandTagline,
        disclaimerText: disclaimerText,
      },
    }));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    resetConfig();
    setLogoText('HI');
    setLogoAccent('HO');
    setLogoBadge('Edukasi Gizi Klinis');
    setBrandFullName('HIHO Health & Nutrition Education');
    setSearchPlaceholder('Cari penyakit, pantangan, atau bahan makanan (cth: Asam Urat, Santan, Diabetes)...');
    setCtaLabel('Cek Pantangan Makanan');
    setBrandTagline('Pusat edukasi nutrisi terstandar klinis. Membimbing pola makan yang tepat untuk mendampingi terapi medis dan pencegahan penyakit degeneratif.');
    setDisclaimerText('Disclaimer Medis: Seluruh informasi, panduan diet, dan rekomendasi makanan di situs HIHO disiapkan semata-mata untuk tujuan edukasi kesehatan umum. Konten ini tidak dimaksudkan untuk menggantikan diagnosis dokter, pemeriksaan medis personal, atau preskripsi diet khusus dari dokter spesialis gizi klinis (Sp.GK) dan dietisien teregistrasi. Selalu konsultasikan kondisi klinis spesifik Anda dengan tenaga medis profesional sebelum melakukan perubahan drastis pada pola makan Anda.');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-[#FAF9F6] border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#A8E6CF] rounded-xl text-emerald-950 font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 id="drawer-title" className="text-sm font-bold text-slate-900">
                Pusat Kustomisasi Konfigurasi (siteConfig.ts)
              </h2>
              <p className="text-[11px] text-slate-500">
                Ubah teks logo, tombol, placeholder, atau disclaimer secara real-time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
            aria-label="Tutup panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Banner */}
        <div className="px-6 py-3 bg-[#FFF5BA]/60 border-b border-amber-200 text-xs text-slate-700 flex items-start gap-2.5">
          <FileCode className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <p>
            Komponen <strong className="text-slate-900">Header</strong> dan{' '}
            <strong className="text-slate-900">Footer</strong> dirancang 100% modular dan membaca langsung dari{' '}
            <code className="text-amber-950 font-mono font-bold bg-white px-1 py-0.5 rounded border border-amber-300">
              src/data/siteConfig.ts
            </code>
            . Coba ubah teks di bawah ini dan klik "Terapkan Perubahan" untuk melihat pembaruan instan!
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleApply} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {savedSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 font-semibold rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Perubahan konfigurasi berhasil diterapkan ke seluruh halaman!</span>
            </div>
          )}

          {/* Section: Brand & Logo */}
          <div className="space-y-3 pb-4 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>1. Branding & Header Logo</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Teks Utama Logo</label>
                <input
                  type="text"
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Aksen Logo</label>
                <input
                  type="text"
                  value={logoAccent}
                  onChange={(e) => setLogoAccent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Badge Tagline Logo</label>
              <input
                type="text"
                value={logoBadge}
                onChange={(e) => setLogoBadge(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nama Panjang Brand</label>
              <input
                type="text"
                value={brandFullName}
                onChange={(e) => setBrandFullName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          {/* Section: Header Controls */}
          <div className="space-y-3 pb-4 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              2. Tombol CTA & Search Header
            </h4>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Placeholder Pencarian Global</label>
              <input
                type="text"
                value={searchPlaceholder}
                onChange={(e) => setSearchPlaceholder(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Label Tombol CTA Header</label>
              <input
                type="text"
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Section: Footer & Legal */}
          <div className="space-y-3 pb-4">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              3. Tagline & Disclaimer Footer
            </h4>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tagline Footer</label>
              <textarea
                rows={2}
                value={brandTagline}
                onChange={(e) => setBrandTagline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Teks Disclaimer Medis Legal</label>
              <textarea
                rows={4}
                value={disclaimerText}
                onChange={(e) => setDisclaimerText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Terapkan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
