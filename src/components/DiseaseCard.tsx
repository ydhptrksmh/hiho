import React, { useState } from 'react';
import { Disease } from '../types';
import {
  Activity,
  HeartPulse,
  ShieldAlert,
  Flame,
  Droplet,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';

interface DiseaseCardProps {
  disease: Disease;
  onSelect: (disease: Disease) => void;
}

export const DiseaseCard: React.FC<DiseaseCardProps> = ({ disease, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  const renderIcon = (iconName: string) => {
    if (!iconName) return <Activity className="w-5 h-5 text-slate-800" />;
    if (/\p{Extended_Pictographic}/u.test(iconName) || iconName.length <= 4) {
      return <span className="text-xl leading-none select-none">{iconName}</span>;
    }
    const iconClass = 'w-5 h-5 text-slate-800';
    switch (iconName) {
      case 'Activity':
        return <Activity className={iconClass} />;
      case 'HeartPulse':
        return <HeartPulse className={iconClass} />;
      case 'ShieldAlert':
        return <ShieldAlert className={iconClass} />;
      case 'Flame':
        return <Flame className={iconClass} />;
      case 'Droplet':
        return <Droplet className={iconClass} />;
      default:
        return <Activity className={iconClass} />;
    }
  };

  // Defensive extraction for allowed food tags
  const allowedItems: string[] = Array.isArray(disease?.quickAllowed) && disease.quickAllowed.length > 0
    ? disease.quickAllowed
    : Array.isArray(disease?.allowedFoods) && disease.allowedFoods.length > 0
    ? disease.allowedFoods.map((f: any) => (typeof f === 'string' ? f : f?.item || '')).filter(Boolean)
    : Array.isArray((disease as any)?.recommendedFoods)
    ? (disease as any).recommendedFoods.map((f: any) => (typeof f === 'string' ? f : f?.item || '')).filter(Boolean)
    : [];

  // Defensive extraction for avoid food tags
  const avoidItems: string[] = Array.isArray(disease?.quickAvoid) && disease.quickAvoid.length > 0
    ? disease.quickAvoid
    : Array.isArray(disease?.avoidFoods) && disease.avoidFoods.length > 0
    ? disease.avoidFoods.map((f: any) => (typeof f === 'string' ? f : f?.item || '')).filter(Boolean)
    : Array.isArray((disease as any)?.foodsToAvoid)
    ? (disease as any).foodsToAvoid.map((f: any) => (typeof f === 'string' ? f : f?.item || '')).filter(Boolean)
    : [];

  const hasCoverImage = Boolean(disease?.imageUrl && !imageError);

  return (
    <div
      onClick={() => onSelect(disease)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(disease);
        }
      }}
      className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-in-out flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      {/* Top Cover Thumbnail with graceful fallback */}
      {hasCoverImage ? (
        <div className="relative h-36 w-full overflow-hidden bg-slate-100">
          <img
            src={disease.imageUrl}
            alt={disease.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          <div className="absolute top-2.5 right-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-950 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs border border-emerald-200">
              {disease?.categoryLabel || disease?.category || 'Kondisi Medis'}
            </span>
          </div>
        </div>
      ) : null}

      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header: Icon & Category (if not shown in image banner or image failed) */}
          {!hasCoverImage && (
            <div className="flex items-start justify-between gap-3 mb-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#A8E6CF]/40 border border-[#A8E6CF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {renderIcon(disease?.iconName || '')}
              </div>
              <div className="flex flex-col items-end text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-[#A8E6CF]/25 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {disease?.categoryLabel || disease?.category || 'Kondisi Medis'}
                </span>
              </div>
            </div>
          )}

          {hasCoverImage && (
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-[#A8E6CF]/40 border border-[#A8E6CF] flex items-center justify-center shrink-0">
                {renderIcon(disease?.iconName || '')}
              </div>
              <span className="text-xs font-bold text-slate-500 truncate">
                {disease?.indonesianName || ''}
              </span>
            </div>
          )}

          {/* Titles & Summary */}
          <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-950 transition-colors leading-snug">
            {disease?.name}
          </h3>
          {!hasCoverImage && (
            <p className="text-xs font-semibold text-slate-500 mb-2">
              {disease?.indonesianName}
            </p>
          )}
          <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
            {disease?.summary}
          </p>

          {/* Quick Tags: Boleh Dimakan vs Hindari (Defensive Rendering) */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            {/* Quick Allowed (Soft Pastel Green) */}
            <div className="p-2.5 rounded-xl bg-[#A8E6CF]/25 border border-emerald-200/60">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-900 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Dianjurkan:</span>
              </div>
              <p className="text-xs text-emerald-950 leading-snug">
                {allowedItems.length > 0
                  ? allowedItems.slice(0, 3).join(', ')
                  : 'Lihat daftar makanan anjuran lengkap'}
              </p>
            </div>

            {/* Quick Avoid (Soft Pastel Orange/Red) */}
            <div className="p-2.5 rounded-xl bg-[#FFD3B6]/30 border border-orange-200/80">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-950 mb-1">
                <XCircle className="w-3.5 h-3.5 text-orange-700 shrink-0" />
                <span>Pantangan Utama:</span>
              </div>
              <p className="text-xs text-orange-950 leading-snug">
                {avoidItems.length > 0
                  ? avoidItems.slice(0, 3).join(', ')
                  : 'Lihat daftar pantangan lengkap'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 mt-4 border-t border-slate-100">
          <div className="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-[#FAF9F6] group-hover:bg-[#A8E6CF]/50 transition-all duration-200 ease-in-out border border-slate-200/80 group-hover:border-emerald-300">
            <span>Buka Panduan Diet Lengkap</span>
            <ArrowRight className="w-4 h-4 text-emerald-800 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
