import React from 'react';
import { Article } from '../types';
import { X, Calendar, Clock, UserCheck, BookOpen, Sparkles, Image as ImageIcon } from 'lucide-react';

interface ArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
}) => {
  if (!article) return null;

  // Helper function to render a paragraph which may be text, markdown image (![alt](url)), heading, or quote
  const renderParagraph = (para: string, idx: number) => {
    const trimmed = para.trim();

    // Check if paragraph is or contains Markdown image syntax: ![alt](url)
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      const altText = imgMatch[1];
      const imgSrc = imgMatch[2];
      return (
        <div key={idx} className="my-6 flex flex-col items-center justify-center">
          <figure className="w-full max-w-2xl bg-slate-50 border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
            <img
              src={imgSrc}
              alt={altText || 'Poster Edukasi Gizi HIHO'}
              className="w-full max-h-[550px] object-contain mx-auto bg-white"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {altText && (
              <figcaption className="text-xs font-semibold text-slate-600 py-2.5 px-4 text-center border-t border-slate-100 bg-white flex items-center justify-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{altText}</span>
              </figcaption>
            )}
          </figure>
        </div>
      );
    }

    // Markdown Subheading: ## Title
    if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
      const headingText = trimmed.replace(/^#{2,3}\s+/, '');
      return (
        <h3 key={idx} className="text-lg sm:text-xl font-black text-slate-900 pt-4 pb-1 border-b border-slate-100">
          {headingText}
        </h3>
      );
    }

    // Markdown Quote / Callout: > Quote text
    if (trimmed.startsWith('> ')) {
      const quoteText = trimmed.replace(/^>\s+/, '');
      return (
        <blockquote key={idx} className="p-4 my-3 bg-emerald-50/50 border-l-4 border-emerald-500 rounded-r-2xl text-xs sm:text-sm text-slate-800 italic leading-relaxed">
          {quoteText}
        </blockquote>
      );
    }

    // List item: • or -
    if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
      const itemText = trimmed.replace(/^[•-]\s+/, '');
      return (
        <div key={idx} className="flex items-start gap-2.5 text-slate-700 text-sm sm:text-base pl-2">
          <span className="text-emerald-600 font-bold mt-1 text-xs shrink-0">●</span>
          <p className="leading-relaxed flex-1">{itemText}</p>
        </div>
      );
    }

    // Standard paragraph with bold parsing support
    return (
      <p key={idx} className="text-slate-700 text-sm sm:text-base leading-relaxed">
        {trimmed}
      </p>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-article-title"
    >
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Top Header - Sticky top-0 z-20 for touch accessibility */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-xs z-20">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
            <span className="bg-[#A8E6CF]/40 px-2.5 py-1 rounded-md border border-emerald-300/40">
              {article.category}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500 font-normal">{article.readingTime}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-all duration-200 ease-in-out"
            aria-label="Tutup artikel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Cover Image if available */}
          {article.imageUrl && (
            <div className="w-full max-h-72 rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 shadow-xs">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover max-h-72"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="space-y-3">
            <h1 id="modal-article-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {article.title}
            </h1>

            {/* Author and Reviewer Bar */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 pt-2 pb-4 border-b border-slate-100">
              <span className="font-semibold text-slate-800">Ditulis oleh: {article.author}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Review Medis: {article.reviewer}</span>
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{article.publishDate}</span>
              </span>
            </div>
          </div>

          {/* Key Takeaways Box (Soft Pastel Yellow) */}
          <div className="p-5 rounded-2xl bg-[#FFF5BA]/50 border border-amber-200 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-800" />
              <span>Poin Inti yang Perlu Diingat:</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
              {article.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-800 font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Article Paragraphs with Rich Inline Posters & Formatting */}
          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
            {article.contentParagraphs.map((para, idx) => renderParagraph(para, idx))}
          </div>

          {/* References */}
          {article.references && article.references.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-slate-600" />
                <span>Daftar Referensi & Kepustakaan Ilmiah:</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-500">
                {article.references.map((ref, idx) => (
                  <li key={idx}>[{idx + 1}] {ref}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF9F6] px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">HIHO Literasi Gizi Nusantara</span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer transition-all duration-200 ease-in-out hover:bg-slate-800 hover:-translate-y-0.5 shadow-xs"
          >
            Selesai Membaca
          </button>
        </div>
      </div>
    </div>
  );
};
