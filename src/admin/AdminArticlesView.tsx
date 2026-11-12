import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { Article } from '../types';
import { validateArticle } from '../utils/searchAndFilter';
import { processImageFile } from '../utils/nutritionAutoHelper';
import {
  FileText,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Filter,
  Eye,
  Bold,
  Italic,
  Heading2,
  List,
  Quote,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react';

export const AdminArticlesView: React.FC = () => {
  const { articles, addArticle, updateArticle, deleteArticle, dataError, clearDataError } = useData();

  // Search and Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');

  // Form Fields
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('Panduan Pola Makan');
  const [author, setAuthor] = useState('Tim Dokter & Dietisien HIHO');
  const [reviewer, setReviewer] = useState('dr. Sarah Daniswara, Sp.GK');
  const [readingTime, setReadingTime] = useState('4 menit baca');
  const [publishDate, setPublishDate] = useState('29 Oktober 2026');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [imageUrl, setImageUrl] = useState('');

  // Rich Text / Markdown Content & Poster Embeds
  const [rawContent, setRawContent] = useState('');
  const [keyTakeawaysText, setKeyTakeawaysText] = useState('');
  const [referencesText, setReferencesText] = useState('');

  // Poster Embed Helper State
  const [posterCaption, setPosterCaption] = useState('');
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [showUrlPosterModal, setShowUrlPosterModal] = useState(false);
  const [urlPosterLink, setUrlPosterLink] = useState('');

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  const posterFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle('');
    setSummary('');
    setCategory('Panduan Pola Makan');
    setAuthor('Tim Dokter & Dietisien HIHO');
    setReviewer('dr. Sarah Daniswara, Sp.GK');
    setReadingTime('4 menit baca');
    setPublishDate('29 Oktober 2026');
    setStatus('published');
    setImageUrl('');
    setRawContent('');
    setKeyTakeawaysText('');
    setReferencesText('');
    setPosterCaption('');
    setUrlPosterLink('');
    setShowUrlPosterModal(false);
    setFormErrors([]);
    setEditingArticle(null);
    setEditorMode('edit');
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article: Article) => {
    setEditingArticle(article);
    setTitle(article.title);
    setSummary(article.summary);
    setCategory(article.category);
    setAuthor(article.author);
    setReviewer(article.reviewer);
    setReadingTime(article.readingTime);
    setPublishDate(article.publishDate);
    setStatus(article.status || 'published');
    setImageUrl(article.imageUrl || '');
    setRawContent(article.contentParagraphs.join('\n\n'));
    setKeyTakeawaysText(article.keyTakeaways.join('\n'));
    setReferencesText(article.references.join('\n'));
    setFormErrors([]);
    setEditorMode('edit');
    setIsModalOpen(true);
  };

  // Helper formatting insert
  const insertFormatting = (prefix: string, suffix: string = '') => {
    setRawContent((prev) => `${prev}\n\n${prefix}Teks penting${suffix}`);
  };

  // Local Poster File Upload Handler
  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPoster(true);
      const dataUrl = await processImageFile(file);
      const caption = posterCaption.trim() || file.name.replace(/\.[^/.]+$/, '') || 'Poster Edukasi Gizi';
      const markdownImage = `\n\n![${caption}](${dataUrl})\n\n`;
      setRawContent((prev) => `${prev.trim()}${markdownImage}`);
      setPosterCaption('');
      if (posterFileInputRef.current) posterFileInputRef.current.value = '';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses gambar.';
      alert(msg);
    } finally {
      setIsUploadingPoster(false);
    }
  };

  // URL Poster Insertion Handler
  const handleInsertUrlPoster = () => {
    if (!urlPosterLink.trim()) return;
    const caption = posterCaption.trim() || 'Poster Edukasi Gizi';
    const markdownImage = `\n\n![${caption}](${urlPosterLink.trim()})\n\n`;
    setRawContent((prev) => `${prev.trim()}${markdownImage}`);
    setUrlPosterLink('');
    setPosterCaption('');
    setShowUrlPosterModal(false);
  };

  // Local Cover Image Upload Handler
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await processImageFile(file);
      setImageUrl(dataUrl);
      if (coverFileInputRef.current) coverFileInputRef.current.value = '';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses gambar sampul.';
      alert(msg);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const paragraphs = rawContent
      .split('\n\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const takeaways = keyTakeawaysText
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const refs = referencesText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const candidate: Partial<Article> = {
      title,
      summary,
      category,
      author,
      reviewer,
      contentParagraphs: paragraphs,
      keyTakeaways: takeaways,
    };

    const validation = validateArticle(candidate);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      setEditorMode('edit');
      return;
    }

    setIsSaving(true);
    setFormErrors([]);

    let result;
    if (editingArticle) {
      result = await updateArticle(editingArticle.id, {
        title: title.trim(),
        summary: summary.trim(),
        category,
        author: author.trim(),
        reviewer: reviewer.trim(),
        readingTime,
        publishDate,
        status,
        imageUrl: imageUrl.trim(),
        rawContent: rawContent.trim(),
        contentParagraphs: paragraphs,
        keyTakeaways: takeaways,
        references: refs.length > 0 ? refs : editingArticle.references,
      });
    } else {
      const newEntry: Article = {
        id: `artikel-${Date.now()}`,
        title: title.trim(),
        summary: summary.trim(),
        category,
        author: author.trim(),
        reviewer: reviewer.trim(),
        readingTime,
        publishDate,
        status,
        imageUrl: imageUrl.trim(),
        rawContent: rawContent.trim(),
        coverGradient: 'from-emerald-100 to-teal-50',
        contentParagraphs: paragraphs,
        keyTakeaways: takeaways,
        references:
          refs.length > 0
            ? refs
            : [
                'Kementerian Kesehatan Republik Indonesia. Pedoman Gizi Seimbang.',
                'World Health Organization (WHO) Nutrition Standards.',
              ],
      };
      result = await addArticle(newEntry);
    }

    setIsSaving(false);

    if (!result.success) {
      setFormErrors([result.error || 'Gagal menyimpan artikel ke database.']);
      return;
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleToggleStatus = async (article: Article) => {
    const nextStatus = article.status === 'draft' ? 'published' : 'draft';
    await updateArticle(article.id, { status: nextStatus });
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await deleteArticle(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  // Find all embedded posters inside rawContent
  const embeddedPosters = Array.from(rawContent.matchAll(/!\[(.*?)\]\((.*?)\)/g)).map((match) => ({
    alt: match[1],
    src: match[2],
    raw: match[0],
  }));

  const removePosterFromContent = (rawPattern: string) => {
    setRawContent((prev) => prev.replace(rawPattern, '').replace(/\n{3,}/g, '\n\n'));
  };

  // Filtered List
  const filteredArticles = articles.filter((a) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && a.status !== 'draft') ||
      (statusFilter === 'draft' && a.status === 'draft');

    const matchesSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Kelola Artikel Gizi & Edukasi
            </h2>
            <span className="text-xs font-bold text-orange-950 bg-[#FFD3B6] px-2.5 py-0.5 rounded-full">
              {articles.length} Artikel
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Publikasikan tulisan nutrisi klinis dengan dukungan upload poster lokal, rich text, dan status draft
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:scale-102 hover:-translate-y-0.5 active:scale-98 shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Tambah Artikel Baru</span>
        </button>
      </div>

      {dataError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{dataError}</span>
          </div>
          <button
            type="button"
            onClick={clearDataError}
            className="text-rose-700 hover:text-rose-900 font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul artikel, topik, atau penulis..."
            className="w-full pl-9 pr-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex items-center bg-[#FAF9F6] p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all duration-200 ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({articles.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all duration-200 ${
                statusFilter === 'published'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all duration-200 ${
                statusFilter === 'draft' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Draft
            </button>
          </div>
        </div>
      </div>

      {/* Articles Table View */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Artikel & Topik</th>
                <th className="py-3.5 px-4">Penulis & Reviewer</th>
                <th className="py-3.5 px-4">Waktu & Tanggal</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Tidak ditemukan artikel yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex items-start gap-3">
                        {article.imageUrl ? (
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-800">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 text-sm leading-snug">{article.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{article.summary}</p>
                          <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-[#A8E6CF]/40 px-2 py-0.5 rounded border border-emerald-200">
                            {article.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top text-slate-600">
                      <p className="font-semibold text-slate-800">{article.author}</p>
                      <p className="text-[11px] text-slate-400">Review: {article.reviewer}</p>
                    </td>

                    <td className="py-3.5 px-4 align-top text-slate-500">
                      <p className="font-semibold text-slate-700">{article.readingTime}</p>
                      <p className="text-[11px] text-slate-400">{article.publishDate}</p>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <button
                        onClick={() => handleToggleStatus(article)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all duration-200 hover:scale-105 ${
                          article.status === 'draft'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                        }`}
                        title="Klik untuk ubah status tayang"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            article.status === 'draft' ? 'bg-amber-600' : 'bg-emerald-600'
                          }`}
                        />
                        <span>{article.status === 'draft' ? 'DRAFT' : 'PUBLISHED'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 align-top text-right shrink-0">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(article)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 cursor-pointer transition-all duration-200 hover:scale-105"
                          title="Sunting Artikel"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(article)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-all duration-200 hover:scale-105"
                          title="Hapus Artikel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL WITH POSTER EMBED SUPPORT */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FAF9F6] w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header - Sticky top-0 z-20 */}
            <div className="bg-white/95 backdrop-blur-xs px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingArticle ? 'Edit Artikel Gizi' : 'Tulis Artikel Edukasi Gizi Baru'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Dukungan upload poster lokal, format teks tebal/subjudul, dan pratinjau publik
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setEditorMode('edit')}
                    className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                      editorMode === 'edit'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('preview')}
                    className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      editorMode === 'preview'
                        ? 'bg-white text-emerald-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Pratinjau</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-4 text-xs">
              {formErrors.length > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 space-y-1">
                  <div className="flex items-center gap-1 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Periksa data wajib:</span>
                  </div>
                  <ul className="list-disc list-inside">
                    {formErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {editorMode === 'edit' ? (
                <>
                  <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Metadata & Kredensial
                    </h4>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Judul Artikel <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Contoh: Manfaat Serat Beta-Glukan untuk Menurunkan Kolesterol"
                        className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Ringkasan / Sinopsis <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Ringkasan inti yang tampil pada kartu artikel..."
                        className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Kategori / Tag</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                          <option value="Panduan Pola Makan">Panduan Pola Makan</option>
                          <option value="Fakta vs Mitos Gizi">Fakta vs Mitos Gizi</option>
                          <option value="Kesehatan Pencernaan">Kesehatan Pencernaan</option>
                          <option value="Gizi Kardiovaskular">Gizi Kardiovaskular</option>
                          <option value="Gizi Lansia">Gizi Lansia</option>
                          <option value="Nutrisi Ibu & Anak">Nutrisi Ibu & Anak</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Status Publikasi</label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                          <option value="published">Published (Langsung Tayang)</option>
                          <option value="draft">Draft (Simpan Konsep)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Waktu Baca</label>
                        <input
                          type="text"
                          value={readingTime}
                          onChange={(e) => setReadingTime(e.target.value)}
                          placeholder="4 menit baca"
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Penulis (Author)</label>
                        <input
                          type="text"
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Review Medis</label>
                        <input
                          type="text"
                          value={reviewer}
                          onChange={(e) => setReviewer(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      </div>
                    </div>

                    {/* Cover Image Upload (Local Laptop + URL) */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block font-bold text-slate-700">
                          Foto Sampul Utama Artikel (Cover Image)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          ref={coverFileInputRef}
                          onChange={handleCoverUpload}
                          className="hidden"
                          id="cover-article-upload"
                        />
                        <label
                          htmlFor="cover-article-upload"
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#A8E6CF] hover:bg-[#8DE9D1] text-emerald-950 font-bold rounded-lg cursor-pointer text-[11px] transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Sampul dari Laptop</span>
                        </label>
                      </div>

                      <div className="flex gap-3 items-center">
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="Atau masukkan URL gambar sampul (https://...)..."
                          className="flex-1 px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                        {imageUrl && (
                          <div className="relative group shrink-0">
                            <img
                              src={imageUrl}
                              alt="Cover preview"
                              className="w-12 h-12 rounded-xl object-cover border border-emerald-300 shadow-xs"
                            />
                            <button
                              type="button"
                              onClick={() => setImageUrl('')}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rich Text Editor Toolbar with INLINE POSTER UPLOADER */}
                  <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div>
                        <label className="block font-bold text-slate-900 text-xs uppercase tracking-wider">
                          Isi Konten Artikel & Poster Media <span className="text-rose-500">*</span>
                        </label>
                        <p className="text-[11px] text-slate-400">
                          Pisahkan paragraf dengan baris kosong. Dukung upload poster langsung ke dalam artikel.
                        </p>
                      </div>

                      {/* Text Formatting Toolbar */}
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
                        <button
                          type="button"
                          onClick={() => insertFormatting('**', '**')}
                          className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white cursor-pointer transition-colors"
                          title="Tebal (Bold)"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('*', '*')}
                          className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white cursor-pointer transition-colors"
                          title="Miring (Italic)"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('## Subjudul: ')}
                          className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white cursor-pointer transition-colors"
                          title="Subjudul"
                        >
                          <Heading2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('• ')}
                          className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white cursor-pointer transition-colors"
                          title="Daftar Butir"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('> Catatan Medis: ')}
                          className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white cursor-pointer transition-colors"
                          title="Kutipan Medis"
                        >
                          <Quote className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Dedicated Media / Poster Upload Action Bar */}
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2 flex-1">
                        <ImageIcon className="w-4 h-4 text-emerald-800 shrink-0" />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={posterCaption}
                            onChange={(e) => setPosterCaption(e.target.value)}
                            placeholder="Judul / Keterangan Poster (cth: Infografis Piring Gizi Seimbang)..."
                            className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Local Poster File Input */}
                        <input
                          type="file"
                          accept="image/*"
                          ref={posterFileInputRef}
                          onChange={handlePosterUpload}
                          className="hidden"
                          id="poster-body-upload"
                        />
                        <label
                          htmlFor="poster-body-upload"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer text-xs transition-all duration-200 hover:-translate-y-0.5 shadow-2xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingPoster ? 'Memproses...' : 'Upload Poster Laptop'}</span>
                        </label>

                        {/* Insert URL Poster Button */}
                        <button
                          type="button"
                          onClick={() => setShowUrlPosterModal(!showUrlPosterModal)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer text-xs transition-colors"
                        >
                          <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                          <span>Poster via URL</span>
                        </button>
                      </div>
                    </div>

                    {/* Sub-form: Insert URL Poster */}
                    {showUrlPosterModal && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                        <label className="block font-bold text-slate-700 text-[11px]">
                          Masukkan URL Gambar Poster:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={urlPosterLink}
                            onChange={(e) => setUrlPosterLink(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="flex-1 px-3 py-1.5 bg-[#FAF9F6] border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          />
                          <button
                            type="button"
                            onClick={handleInsertUrlPoster}
                            className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-slate-800 cursor-pointer"
                          >
                            Sisipkan
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Textarea for Content */}
                    <textarea
                      rows={8}
                      required
                      value={rawContent}
                      onChange={(e) => setRawContent(e.target.value)}
                      placeholder="Tuliskan materi edukasi gizi di sini. Poster yang diunggah akan otomatis disisipkan dengan sintaks ![Judul](link)..."
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-400 leading-relaxed"
                    />

                    {/* Gallery of Embedded Posters */}
                    {embeddedPosters.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <span className="text-[11px] font-bold text-slate-700 block">
                          Poster & Gambar Tersemat dalam Artikel ({embeddedPosters.length}):
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {embeddedPosters.map((poster, pIdx) => (
                            <div
                              key={pIdx}
                              className="relative group p-2 bg-[#FAF9F6] border border-slate-200 rounded-xl flex flex-col items-center text-center"
                            >
                              <img
                                src={poster.src}
                                alt={poster.alt}
                                className="w-full h-20 object-contain rounded-lg bg-white border border-slate-100"
                              />
                              <span className="text-[10px] text-slate-600 font-semibold truncate w-full mt-1">
                                {poster.alt || 'Poster'}
                              </span>
                              <button
                                type="button"
                                onClick={() => removePosterFromContent(poster.raw)}
                                className="mt-1 text-[10px] text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                              >
                                Hapus dari Teks
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Key Takeaways */}
                  <div className="space-y-1 bg-white p-5 rounded-2xl border border-amber-200">
                    <label className="block font-bold text-amber-950 text-xs">
                      Poin Inti yang Perlu Diingat (1 baris = 1 poin) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={keyTakeawaysText}
                      onChange={(e) => setKeyTakeawaysText(e.target.value)}
                      placeholder="Masukkan 1 poin per baris (cth: Konsumsi serat larut air sebelum karbohidrat)..."
                      className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </>
              ) : (
                /* Live Preview Mode with Full Media Poster Rendering */
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                  {imageUrl && (
                    <div className="w-full h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mb-2">
                      <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                    <span className="bg-[#A8E6CF]/50 px-2.5 py-0.5 rounded">{category}</span>
                    <span>·</span>
                    <span>{readingTime}</span>
                    <span>·</span>
                    <span className="font-bold text-slate-700">Status: {status.toUpperCase()}</span>
                  </div>

                  <h2 className="text-2xl font-black text-slate-900">{title || 'Judul Artikel'}</h2>
                  <p className="text-xs text-slate-600 italic">{summary}</p>

                  <div className="p-4 rounded-xl bg-[#FFF5BA]/60 border border-amber-200 space-y-1 text-xs">
                    <h5 className="font-bold text-amber-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                      <span>Poin Inti yang Perlu Diingat:</span>
                    </h5>
                    <ul className="list-disc list-inside text-slate-800 space-y-1">
                      {keyTakeawaysText
                        .split('\n')
                        .filter((t) => t.trim().length > 0)
                        .map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                    </ul>
                  </div>

                  {/* Render paragraphs & centered posters in live preview */}
                  <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                    {rawContent
                      .split('\n\n')
                      .filter((p) => p.trim().length > 0)
                      .map((p, i) => {
                        const trimmed = p.trim();
                        const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
                        if (imgMatch) {
                          return (
                            <figure
                              key={i}
                              className="my-4 flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-2xl"
                            >
                              <img
                                src={imgMatch[2]}
                                alt={imgMatch[1]}
                                className="max-h-80 w-auto rounded-lg object-contain bg-white shadow-xs"
                              />
                              {imgMatch[1] && (
                                <figcaption className="text-[11px] font-semibold text-slate-600 mt-2 text-center">
                                  {imgMatch[1]}
                                </figcaption>
                              )}
                            </figure>
                          );
                        }
                        if (trimmed.startsWith('## ')) {
                          return (
                            <h4 key={i} className="text-sm font-bold text-slate-900 pt-2 border-b border-slate-100">
                              {trimmed.replace(/^##\s+/, '')}
                            </h4>
                          );
                        }
                        return <p key={i}>{trimmed}</p>;
                      })}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {editorMode === 'preview' ? 'Tampilan pratinjau seperti yang dilihat publik' : 'Mode Penyuntingan'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold rounded-xl shadow-xs cursor-pointer transition-all duration-200 ease-in-out hover:scale-102 hover:-translate-y-0.5"
                  >
                    {isSaving
                      ? 'Menyimpan...'
                      : editingArticle
                        ? 'Simpan Perubahan'
                        : 'Terbitkan Artikel'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Konfirmasi Hapus Artikel
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Apakah Anda yakin ingin menghapus artikel{' '}
                <strong className="text-slate-900">"{deleteTarget.title}"</strong>?
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer transition-all duration-200"
              >
                Ya, Hapus Artikel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
