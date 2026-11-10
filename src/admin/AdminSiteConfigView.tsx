import React, { useState } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import {
  Sliders,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Heart,
  Globe,
  ShieldCheck,
  Search,
  Share2,
  AlertTriangle,
} from 'lucide-react';

export const AdminSiteConfigView: React.FC = () => {
  const { config, updateConfig, resetConfig, isCustomized } = useSiteConfig();
  const [savedAlert, setSavedAlert] = useState(false);

  const showSaved = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleBrandChange = (field: string, value: string) => {
    updateConfig((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        [field]: value,
      },
    }));
    showSaved();
  };

  const handleLogoChange = (field: string, value: string) => {
    updateConfig((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        logo: {
          ...prev.brand.logo,
          [field]: value,
        },
      },
    }));
    showSaved();
  };

  const handleSearchPlaceholderChange = (value: string) => {
    updateConfig((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        searchPlaceholder: value,
      },
    }));
    showSaved();
  };

  const handleFooterChange = (field: string, value: string) => {
    updateConfig((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        [field]: value,
      },
    }));
    showSaved();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Pengaturan & Kustomisasi Situs (siteConfig)
            </h2>
            {isCustomized && (
              <span className="text-[10px] font-bold text-amber-950 bg-[#FFF5BA] px-2.5 py-0.5 rounded-full border border-amber-300">
                Terkustomisasi
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola teks brand, tagline, placeholder pencarian, teks disclaimer medis, dan footer secara sentral tanpa menyentuh kode.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset semua konfigurasi situs ke bawaan awal default?')) {
              resetConfig();
            }
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:text-rose-700 hover:bg-slate-50 transition-colors shadow-xs shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset ke Bawaan</span>
        </button>
      </div>

      {savedAlert && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pengaturan situs berhasil diperbarui dan langsung aktif di seluruh website!</span>
        </div>
      )}

      {/* Grid: Form Sections & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Settings (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Identitas Brand & Logo */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Heart className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                1. Identitas Brand & Logo
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Brand</label>
                <input
                  type="text"
                  value={config.brand.name}
                  onChange={(e) => handleBrandChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Institusi</label>
                <input
                  type="text"
                  value={config.brand.fullName}
                  onChange={(e) => handleBrandChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Logo Badge Label</label>
                <input
                  type="text"
                  value={config.brand.logo.badge}
                  onChange={(e) => handleLogoChange('badge', e.target.value)}
                  placeholder="Edukasi Gizi Klinis"
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Placeholder Pencarian Global</label>
                <input
                  type="text"
                  value={config.header.searchPlaceholder}
                  onChange={(e) => handleSearchPlaceholderChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Tagline Brand</label>
                <input
                  type="text"
                  value={config.brand.tagline}
                  onChange={(e) => handleBrandChange('tagline', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Misi Singkat HIHO</label>
                <textarea
                  rows={2}
                  value={config.brand.mission}
                  onChange={(e) => handleBrandChange('mission', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Disclaimer Medis & Kontak Darurat */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                2. Legal Medis & Pemberitahuan Darurat
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pernyataan Disclaimer Medis (Tampil di Footer)
                </label>
                <textarea
                  rows={4}
                  value={config.footer.disclaimerText}
                  onChange={(e) => handleFooterChange('disclaimerText', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Peringatan Kegawatdaruratan Medis (Emergency 119/112)
                </label>
                <textarea
                  rows={2}
                  value={config.footer.emergencyText}
                  onChange={(e) => handleFooterChange('emergencyText', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teks Hak Cipta (Copyright)</label>
                <input
                  type="text"
                  value={config.footer.copyright}
                  onChange={(e) => handleFooterChange('copyright', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Kutipan Filosofi Footer (Tagline) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                3. Kutipan Filosofi Gaya Hidup Sehat (Footer Tagline)
              </h3>
            </div>
            <div className="text-xs space-y-2">
              <label className="block font-bold text-slate-700">
                Teks Kutipan Filosofi di Bawah Logo HIHO (Footer)
              </label>
              <textarea
                rows={3}
                value={config.footer.brandTagline}
                onChange={(e) => handleFooterChange('brandTagline', e.target.value)}
                placeholder="Tetap Konsisten menerapkan gaya hidup sehat dan rutin pengecekan Kesehatan, untuk kualitas hidup yang lebih baik ke depannya, karena sehatnya tubuh, kita yang tentukan"
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none font-medium leading-relaxed"
              />
              <p className="text-[11px] text-slate-500">
                Kutipan ini ditampilkan di dalam kotak berlatar pastel hijau di footer beranda utama.
              </p>
            </div>
          </div>

          {/* Section 4: Saluran Edukasi & Kontak Resmi */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Share2 className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                4. Saluran Edukasi & Kontak Resmi
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">WhatsApp Label & Kontak</label>
                <input
                  type="text"
                  value={config.footer.educationContacts?.whatsapp?.label || '0822 1180 7736 a/n Bu Martha'}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateConfig((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        educationContacts: {
                          ...prev.footer.educationContacts!,
                          whatsapp: {
                            ...prev.footer.educationContacts?.whatsapp!,
                            label: val,
                            number: val.split('a/n')[0].trim(),
                            url: prev.footer.educationContacts?.whatsapp?.url || 'https://wa.me/6282211807736',
                          },
                          email: prev.footer.educationContacts?.email || { address: 'hrd.health@toyota.co.id', url: 'mailto:hrd.health@toyota.co.id' },
                        },
                      },
                    }));
                    showSaved();
                  }}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp Link URL (wa.me)</label>
                <input
                  type="text"
                  value={config.footer.educationContacts?.whatsapp?.url || 'https://wa.me/6282211807736'}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateConfig((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        educationContacts: {
                          ...prev.footer.educationContacts!,
                          whatsapp: {
                            ...prev.footer.educationContacts?.whatsapp!,
                            label: prev.footer.educationContacts?.whatsapp?.label || '0822 1180 7736 a/n Bu Martha',
                            number: prev.footer.educationContacts?.whatsapp?.number || '0822 1180 7736',
                            url: val,
                          },
                          email: prev.footer.educationContacts?.email || { address: 'hrd.health@toyota.co.id', url: 'mailto:hrd.health@toyota.co.id' },
                        },
                      },
                    }));
                    showSaved();
                  }}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Resmi Edukasi</label>
                <input
                  type="text"
                  value={config.footer.educationContacts?.email?.address || 'hrd.health@toyota.co.id'}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateConfig((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        educationContacts: {
                          ...prev.footer.educationContacts!,
                          whatsapp: prev.footer.educationContacts?.whatsapp || {
                            label: '0822 1180 7736 a/n Bu Martha',
                            number: '0822 1180 7736',
                            url: 'https://wa.me/6282211807736',
                          },
                          email: {
                            address: val,
                            url: `mailto:${val}`,
                          },
                        },
                      },
                    }));
                    showSaved();
                  }}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Preview: Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 sticky top-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Pratinjau Langsung (Header & Brand)
              </h3>
            </div>

            {/* Header Mini Preview */}
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A8E6CF] via-[#8DE9D1] to-[#FFD3B6] flex items-center justify-center text-slate-900 font-extrabold shadow-xs">
                  <Heart className="w-5 h-5 text-slate-900 fill-white/80" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="text-xl font-black tracking-tight">
                      <span className="text-[#FF9F68]">HI</span>
                      <span className="text-[#4ECCA3]">HO</span>
                    </span>
                    <span className="text-[9px] font-bold text-emerald-900 bg-[#A8E6CF]/60 px-1.5 py-0.5 rounded-full border border-emerald-300">
                      {config.brand.logo.badge}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-medium tracking-wide mt-0.5">
                    Healthy Inside Healthy Outside
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-400 flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">{config.header.searchPlaceholder}</span>
              </div>
            </div>

            {/* Tagline Preview */}
            <div className="p-3.5 rounded-2xl bg-[#FFF5BA]/50 border border-amber-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-950">
                Tagline Aktif:
              </span>
              <p className="text-xs font-bold text-slate-900 leading-snug">
                "{config.brand.tagline}"
              </p>
            </div>

            {/* Disclaimer Mini Preview */}
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-950">
                Pratinjau Disclaimer:
              </span>
              <p className="text-[10px] text-slate-600 line-clamp-3 leading-relaxed">
                {config.footer.disclaimerText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
