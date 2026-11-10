import React from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import {
  Heart,
  ShieldAlert,
  MessageCircle,
  Mail,
} from 'lucide-react';

interface FooterProps {
  onNavigate?: (tabId: string) => void;
  onFilterCategory?: (category: any) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const { config } = useSiteConfig();

  const whatsappInfo = config.footer.educationContacts?.whatsapp || {
    label: '0822 1180 7736 a/n Bu Martha',
    number: '0822 1180 7736',
    url: 'https://wa.me/6282211807736',
  };

  const emailInfo = config.footer.educationContacts?.email || {
    address: 'hrd.health@toyota.co.id',
    url: 'mailto:hrd.health@toyota.co.id',
  };

  const brandTagline =
    config.footer.brandTagline ||
    'Tetap Konsisten menerapkan gaya hidup sehat dan rutin pengecekan Kesehatan, untuk kualitas hidup yang lebih baik ke depannya, karena sehatnya tubuh, kita yang tentukan';

  const copyrightText = config.footer.copyright || '© 2026 HIHO. All rights reserved.';

  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-700 pt-12 sm:pt-14 pb-10 mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Area: Brand + Tagline (Left) & Saluran Edukasi (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-slate-100 items-start">
          {/* 1. Brand Header & 2. Main Tagline Statement */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A8E6CF] via-[#8DE9D1] to-[#FFD3B6] flex items-center justify-center text-slate-900 font-extrabold shadow-xs">
                <Heart className="w-5 h-5 text-slate-900 fill-white/80" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight leading-none">
                  <span className="text-[#FF9F68]">HI</span>
                  <span className="text-[#4ECCA3]">HO</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5">
                  Healthy Inside Healthy Outside
                </span>
              </div>
            </div>

            {/* Main Tagline Statement */}
            <div className="bg-emerald-50/50 p-4 sm:p-5 rounded-2xl border border-emerald-200/70 shadow-2xs">
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed font-medium">
                "{brandTagline}"
              </p>
            </div>
          </div>

          {/* 3. Saluran Edukasi (Contact Block) */}
          <div className="lg:col-span-5 space-y-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Saluran Edukasi
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Layanan konsultasi & informasi gizi keluarga
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {/* WhatsApp Clickable Link */}
              <a
                href={whatsappInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-xs"
                aria-label="Hubungi WhatsApp Edukasi Gizi HIHO"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-4 h-4 fill-white" />
                </div>
                <div className="text-xs leading-tight min-w-0">
                  <span className="font-bold block text-[11px] text-emerald-900">WhatsApp</span>
                  <span className="font-semibold text-slate-800 group-hover:text-emerald-950">
                    {whatsappInfo.label}
                  </span>
                </div>
              </a>

              {/* Email Clickable Link */}
              <a
                href={emailInfo.url}
                className="group flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200 text-slate-900 cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-xs"
                aria-label="Kirim Email ke HRD Health"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-xs leading-tight min-w-0">
                  <span className="font-bold block text-[11px] text-slate-500">Email Resmi</span>
                  <span className="font-semibold text-slate-800 group-hover:text-emerald-950 break-all">
                    {emailInfo.address}
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* 4. Medical Disclaimer Box */}
        <div className="my-8 p-5 rounded-2xl bg-[#FFF5BA]/40 border border-amber-200/80 text-xs text-slate-700 leading-relaxed flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <p className="font-semibold text-slate-900">Pemberitahuan Medis Penting:</p>
            <p>{config.footer.disclaimerText}</p>
            <p className="text-slate-600 italic">{config.footer.emergencyText}</p>
          </div>
        </div>

        {/* 5. Copyright Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center text-xs text-slate-500 text-center">
          <p>{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
};
