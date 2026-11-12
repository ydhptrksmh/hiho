import React, { useState, useEffect, useRef } from 'react';
import { Disease, Article } from '../types';
import { useData } from '../context/DataContext';
import { foodDatabase } from '../data/foodDatabase';
import { searchGlobal, GlobalSearchResult } from '../utils/searchAndFilter';
import { Search, X, Activity, BookOpen, Utensils, ArrowRight } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDisease: (disease: Disease) => void;
  onSelectArticle: (article: Article) => void;
  onOpenFoodChecker: (foodQuery?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectDisease,
  onSelectArticle,
  onOpenFoodChecker,
}) => {
  const { diseases, articles } = useData();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult>({
    diseases: [],
    articles: [],
    foods: [],
    totalMatches: 0,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ diseases: [], articles: [], foods: [], totalMatches: 0 });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) return;
    const published = articles.filter((a) => a.status !== 'draft');
    setResults(searchGlobal(query, diseases, published, foodDatabase));
  }, [query, diseases, articles]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    const published = articles.filter((a) => a.status !== 'draft');
    const res = searchGlobal(val, diseases, published, foodDatabase);
    setResults(res);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-20"
      role="dialog"
      aria-modal="true"
      aria-label="Pencarian Global HIHO"
    >
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar - Sticky top-0 z-20 */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-200 flex items-center gap-2.5 sm:gap-3 sticky top-0 z-20 bg-white">
          <Search className="w-5 h-5 text-emerald-700 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Cari penyakit, pantangan, atau bahan makanan (cth: Diabetes, Asam Urat, Santan)..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => handleQueryChange('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              aria-label="Hapus kata kunci"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-sans font-semibold text-slate-400 bg-slate-100 rounded border border-slate-200">
              ESC
            </kbd>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 ml-2"
          >
            Tutup
          </button>
        </div>

        {/* Quick Suggestion Pills when query is empty */}
        {!query && (
          <div className="p-6 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pencarian Populer:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'Diabetes Melitus',
                'Asam Urat',
                'Hipertensi',
                'GERD & Maag',
                'Sate Kambing',
                'Ikan Kembung',
                'Emping Melinjo',
                'Piring Model T',
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => handleQueryChange(term)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#A8E6CF]/40 text-xs font-medium text-slate-700 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Mencari di seluruh direktori penyakit, artikel, dan pantangan makanan.</span>
            </div>
          </div>
        )}

        {/* Search Results Display */}
        {query && (
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
            {results.totalMatches === 0 ? (
              <div className="p-8 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-700">
                  Tidak ditemukan hasil untuk "{query}"
                </p>
                <p className="text-xs text-slate-500">
                  Coba kata kunci lain seperti nama bahan masakan (ikan, telur, beras), gejala, atau nama penyakit.
                </p>
              </div>
            ) : (
              <>
                {/* 1. Diseases Results */}
                {results.diseases.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider px-2">
                      <Activity className="w-3.5 h-3.5" />
                      <span>Kondisi & Penyakit ({results.diseases.length})</span>
                    </div>
                    <div className="space-y-1">
                      {results.diseases.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => {
                            onSelectDisease(d);
                            onClose();
                          }}
                          className="w-full text-left p-3 rounded-2xl hover:bg-[#A8E6CF]/25 transition-colors flex items-center justify-between group border border-transparent hover:border-emerald-200"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-950">
                              {d.name}
                            </p>
                            <p className="text-xs text-slate-500 line-clamp-1">{d.summary}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Food Checker Results */}
                {results.foods.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900 uppercase tracking-wider px-2">
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Bahan & Makanan Terkait ({results.foods.length})</span>
                    </div>
                    <div className="space-y-1">
                      {results.foods.map((f, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            onOpenFoodChecker(f.name);
                            onClose();
                          }}
                          className="w-full text-left p-3 rounded-2xl hover:bg-[#FFD3B6]/25 transition-colors flex items-center justify-between group border border-transparent hover:border-orange-200"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-900">{f.name}</p>
                            <p className="text-xs text-slate-500">{f.category} · {f.portion}</p>
                          </div>
                          <span className="text-xs font-semibold text-orange-950 group-hover:underline">
                            Cek Status Pantangan →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Articles Results */}
                {results.articles.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider px-2">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Artikel Gizi Terkait ({results.articles.length})</span>
                    </div>
                    <div className="space-y-1">
                      {results.articles.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => {
                            onSelectArticle(a);
                            onClose();
                          }}
                          className="w-full text-left p-3 rounded-2xl hover:bg-slate-100 transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-900">{a.title}</p>
                            <p className="text-xs text-slate-500">{a.category} · {a.readingTime}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
