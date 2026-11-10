import React, { useState } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useData } from '../context/DataContext';
import { ActivityMedia } from '../types';
import {
  Heart,
  Calendar,
  MapPin,
  Sparkles,
  Maximize2,
  X,
  Camera,
  Smile,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { config } = useSiteConfig();
  const { activities } = useData();

  // Lightbox pop-up state
  const [selectedActivity, setSelectedActivity] = useState<ActivityMedia | null>(null);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Warm Header & Mission Section */}
      <section className="bg-gradient-to-br from-[#A8E6CF]/30 via-white to-[#FFD3B6]/30 rounded-3xl p-8 sm:p-12 border border-emerald-200/80 shadow-xs space-y-6">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A8E6CF] text-xs font-bold text-emerald-950">
            <Heart className="w-4 h-4 text-emerald-900 fill-white" />
            <span>Tentang HIHO & Misi Kami</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Menjadikan Edukasi Gizi Sehat Mudah Dipahami & Diterapkan Setiap Keluarga.
          </h1>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
            {config.brand.mission}
          </p>

          <p className="text-sm text-slate-600 leading-relaxed">
            HIHO (Healthy Inside Healthy Outside) hadir untuk mendampingi keluarga Indonesia dalam
            memilih pola makan yang aman, bergizi seimbang, dan ramah kondisi tubuh. Kami percaya
            bahwa kesehatan berawal dari kebiasaan makan yang konsisten, menyenangkan, dan dapat
            diterapkan di kehidupan sehari-hari tanpa kebingungan.
          </p>

          {/* Core Values Chips */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-emerald-900 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Praktis & Mudah Dipahami</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-orange-200 text-xs font-bold text-orange-950 shadow-2xs">
              <Smile className="w-4 h-4 text-[#FF9F68]" />
              <span>Ramah Meja Makan Keluarga</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs font-bold text-amber-950 shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Gaya Hidup Berkelanjutan</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dokumentasi & Kegiatan HIHO (User-Facing Activity Media Gallery) */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <Camera className="w-4 h-4" />
              <span>Galeri & Dokumentasi Kegiatan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Dokumentasi & Kegiatan HIHO
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Liputan momen edukasi interaktif, skrining kesehatan rutin, dan kegiatan literasi gizi
              bersama komunitas dan keluarga Indonesia.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs shrink-0 self-start sm:self-auto">
            {activities.length} Kegiatan Terdokumentasi
          </div>
        </div>

        {/* Activity Media Grid */}
        {activities.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#A8E6CF]/40 text-emerald-800 flex items-center justify-center mx-auto">
              <Camera className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Belum Ada Dokumentasi Kegiatan</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Dokumentasi foto kegiatan HIHO akan segera diunggah oleh tim administrator melalui Admin Portal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activities.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                {/* STRICT REQUIREMENT: Judul Kegiatan / Title FIRST */}
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug tracking-tight group-hover:text-emerald-800 transition-colors">
                    {item.title}
                  </h3>

                  {/* Optional Badges (Date / Location) placed near title header */}
                  {(item.date || item.location) && (
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {item.date && (
                        <span className="inline-flex items-center gap-1.5 bg-[#FAF9F6] px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{item.date}</span>
                        </span>
                      )}
                      {item.location && (
                        <span className="inline-flex items-center gap-1.5 bg-[#FAF9F6] px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#FF9F68]" />
                          <span>{item.location}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Foto Kegiatan (Directly below Title) with Hover Zoom & Click Lightbox */}
                <div
                  onClick={() => setSelectedActivity(item)}
                  className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[16/10] cursor-pointer border border-slate-200/70 shadow-2xs group/img"
                  title="Klik untuk melihat foto resolusi penuh"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedActivity(item);
                    }
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/img:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle Gradient Overlay & Fullscreen Indicator on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                    <span className="text-xs font-semibold text-white/90">
                      Buka Foto Resolusi Penuh
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white/90 text-slate-900 flex items-center justify-center shadow-md">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Sub-caption / Deskripsi Kegiatan */}
                {item.description && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Interactive Lightbox Pop-Up View */}
      {selectedActivity && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedActivity(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header with Title & Close Button - Sticky top-0 z-20 */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 sticky top-0 z-20 bg-white/95 backdrop-blur-xs">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Dokumentasi Kegiatan HIHO
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {selectedActivity.title}
                </h3>
                {(selectedActivity.date || selectedActivity.location) && (
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    {selectedActivity.date && (
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        {selectedActivity.date}
                      </span>
                    )}
                    {selectedActivity.location && (
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#FF9F68]" />
                        {selectedActivity.location}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedActivity(null)}
                className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
                aria-label="Tutup foto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Image Container */}
            <div className="flex-1 overflow-auto bg-slate-900 flex items-center justify-center min-h-[300px] max-h-[60vh] p-2">
              <img
                src={selectedActivity.imageUrl}
                alt={selectedActivity.title}
                className="max-h-full max-w-full object-contain rounded-xl"
              />
            </div>

            {/* Lightbox Footer Caption */}
            {selectedActivity.description && (
              <div className="p-5 sm:p-6 bg-[#FAF9F6] border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                <p>{selectedActivity.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
