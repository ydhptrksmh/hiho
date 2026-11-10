import React, { useState } from 'react';
import { Article } from '../types';
import { Search, BookOpen, Clock, Calendar, ArrowRight, UserCheck, X, Plus, Sparkles, Trash2 } from 'lucide-react';

interface ArticlesViewProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onOpenCreateArticle: () => void;
  onDeleteArticle?: (id: string) => void;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({
  articles,
  onSelectArticle,
  onOpenCreateArticle,
  onDeleteArticle,
}) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('semua');

  const tags = ['semua', 'Panduan Pola Makan', 'Fakta vs Mitos Gizi', 'Kesehatan Pencernaan', 'Gizi Kardiovaskular', 'Gizi Lansia', 'Nutrisi Ibu & Anak'];

  const filteredArticles = articles.filter((a) => {
    const matchesTag = selectedTag === 'semua' || a.category === selectedTag;
    const matchesQuery =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Header & Admin Trigger Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Wawasan Nutrisi Medis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Artikel & Edukasi Gizi Berbasis Bukti
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Kumpulan artikel panduan diet, pembongkaran mitos keliru, dan resep gizi ramah kondisi medis
            yang disusun berdasarkan pedoman Kemenkes RI, ADA, dan ESPEN.
          </p>
        </div>

        {/* Admin Action Button */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={onOpenCreateArticle}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-102 active:scale-98"
            aria-label="Tulis dan tambahkan artikel edukasi gizi baru sebagai admin"
          >
            <div className="w-5 h-5 rounded-lg bg-[#A8E6CF] flex items-center justify-center text-slate-950 font-black">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span>+ Tulis Artikel Baru (Admin)</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari topik artikel (cth: Piring Model T, Tempe Asam Urat, Kolesterol Salmon, Es Teh)..."
            className="w-full pl-10 pr-10 py-3 bg-[#FAF9F6] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Hapus kata kunci"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1" aria-label="Kategori Artikel">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl shrink-0 transition-colors ${
                selectedTag === tag
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tag === 'semua' ? 'Semua Topik' : tag}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Menampilkan {filteredArticles.length} artikel edukasi</span>
          <span className="text-emerald-800 font-semibold hidden sm:inline">
            Terbuka untuk kontribusi artikel tim medis & dietisien
          </span>
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <p className="text-base font-bold text-slate-800">
            Tidak ada artikel yang sesuai dengan pencarian Anda.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setSearch('');
                setSelectedTag('semua');
              }}
              className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200"
            >
              Reset Pencarian
            </button>
            <button
              onClick={onOpenCreateArticle}
              className="px-4 py-2 bg-[#A8E6CF] text-emerald-950 rounded-xl text-xs font-bold hover:bg-[#8DE9D1]"
            >
              Tulis Artikel Baru
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const isCustom = article.id.startsWith('artikel-');
            return (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectArticle(article);
                  }
                }}
                className={`bg-white rounded-3xl overflow-hidden border shadow-xs hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all duration-200 ease-in-out flex flex-col justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  isCustom
                    ? 'border-emerald-300 ring-2 ring-emerald-100/80'
                    : 'border-slate-200/80 hover:border-emerald-300'
                }`}
              >
                {article.imageUrl && (
                  <div className="h-44 w-full overflow-hidden relative bg-slate-100">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold text-emerald-950 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-emerald-200 shadow-xs">
                        {article.category}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Clean unboxed metadata per Frontend Design rules */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        {!article.imageUrl && (
                          <>
                            <span className="font-semibold text-emerald-800">{article.category}</span>
                            <span aria-hidden="true">·</span>
                          </>
                        )}
                        <span>{article.readingTime}</span>
                        <span aria-hidden="true">·</span>
                        <span>{article.publishDate}</span>
                      </div>
                      {isCustom && (
                        <span className="text-[10px] font-bold text-emerald-900 bg-[#A8E6CF]/60 px-2 py-0.5 rounded-md border border-emerald-300">
                          Artikel Baru Admin
                        </span>
                      )}
                    </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-950 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>

                  {/* Reviewer Notice */}
                  <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Review: {article.reviewer}</span>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectArticle(article)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-900 bg-[#FAF9F6] hover:bg-[#A8E6CF] group-hover:bg-[#A8E6CF]/40 transition-colors border border-slate-200/80"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-800 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {isCustom && onDeleteArticle && (
                    <button
                      onClick={() => onDeleteArticle(article.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                      title="Hapus artikel custom ini"
                      aria-label="Hapus artikel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
