import React, { useState } from 'react';
import { Article } from '../types';
import { validateArticle } from '../utils/searchAndFilter';
import {
  X,
  Plus,
  Trash2,
  Eye,
  Edit3,
  CheckCircle,
  AlertCircle,
  FileText,
  Sparkles,
  BookOpen,
  UserCheck,
  Calendar,
  Clock,
} from 'lucide-react';

interface CreateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveArticle: (article: Article) => void;
}

export const CreateArticleModal: React.FC<CreateArticleModalProps> = ({
  isOpen,
  onClose,
  onSaveArticle,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('Panduan Pola Makan');
  const [readingTime, setReadingTime] = useState('4 menit baca');
  const [author, setAuthor] = useState('Tim Dokter & Dietisien HIHO');
  const [reviewer, setReviewer] = useState('dr. Sarah Daniswara, Sp.GK');
  const [publishDate, setPublishDate] = useState('28 Oktober 2026');

  const [keyTakeaways, setKeyTakeaways] = useState<string[]>([
    'Bagi porsi piring makan dengan prinsip seimbang.',
    'Pilih makanan segar utuh dibanding pangan olahan berpengawet.',
  ]);

  const [contentParagraphs, setContentParagraphs] = useState<string[]>([
    'Pola makan yang tepat memegang peranan krusial dalam pencegahan dan pengendalian penyakit kronis. Melalui panduan gizi terstruktur, tubuh mendapatkan asupan mikronutrien penting tanpa membebani organ metabolisme.',
    'Konsultasikan selalu kondisi spesifik Anda dengan dokter spesialis gizi klinis untuk mendapatkan takaran kalori dan mikronutrien yang tepat sesuai kebutuhan personal.',
  ]);

  const [references, setReferences] = useState<string[]>([
    'Kementerian Kesehatan Republik Indonesia. Pedoman Gizi Seimbang Nasional.',
    'World Health Organization (WHO). Healthy Diet Fact Sheet.',
  ]);

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Preset Template loader for easy testing
  const loadQuickTemplate = () => {
    setTitle('Manfaat Asupan Magnesium untuk Menstabilkan Tensi & Kualitas Tidur');
    setSummary('Bagaimana mineral magnesium bekerja mengendurkan otot dinding pembuluh darah serta sumber makanan lezat penyuplai magnesium harian.');
    setCategory('Gizi Kardiovaskular');
    setReadingTime('3 menit baca');
    setAuthor('dr. Dimas Prasetyo, Sp.JP, FIHA');
    setReviewer('dr. Sarah Daniswara, Sp.GK');
    setKeyTakeaways([
      'Magnesium membantu sintesis nitrik oksida alami untuk melebarkan arteri.',
      'Sumber terbaik: biji labu, bayam rebus, alpukat matang, dan pisang.',
      'Defisiensi magnesium sering memicu ketegangan otot leher dan tidur gelisah.',
    ]);
    setContentParagraphs([
      'Magnesium sering dijuluki sebagai mineral relaksasi alami tubuh. Di dalam sistem peredaran darah, magnesium bersinergi dengan kalium untuk menyeimbangkan natrium dan mencegah kekakuan pada dinding pembuluh darah perifer.',
      'Masyarakat modern seringkali mengalami defisiensi magnesium tersembunyi akibat pola makan yang didominasi tepung rafinasi dan makanan cepat saji. Padahal, hanya dengan menambahkan segenggam biji labu panggang atau 1 mangkuk sayur bayam bening ke menu harian, kebutuhan magnesium 300-400 mg sudah terpenuhi optimal.',
      'Bagi penderita hipertensi maupun insomnia ringan, mengonsumsi sumber magnesium alami saat makan malam terbukti membantu meningkatkan kualitas fase tidur dalam (deep sleep).',
    ]);
    setReferences([
      'National Institutes of Health (NIH). Magnesium Fact Sheet for Health Professionals.',
      'American Heart Association (AHA). Dietary Electrolytes and Cardiovascular Health.',
    ]);
    setFormErrors([]);
  };

  const handleAddTakeaway = () => {
    setKeyTakeaways([...keyTakeaways, '']);
  };

  const handleUpdateTakeaway = (index: number, val: string) => {
    const updated = [...keyTakeaways];
    updated[index] = val;
    setKeyTakeaways(updated);
  };

  const handleRemoveTakeaway = (index: number) => {
    if (keyTakeaways.length > 1) {
      setKeyTakeaways(keyTakeaways.filter((_, i) => i !== index));
    }
  };

  const handleAddParagraph = () => {
    setContentParagraphs([...contentParagraphs, '']);
  };

  const handleUpdateParagraph = (index: number, val: string) => {
    const updated = [...contentParagraphs];
    updated[index] = val;
    setContentParagraphs(updated);
  };

  const handleRemoveParagraph = (index: number) => {
    if (contentParagraphs.length > 1) {
      setContentParagraphs(contentParagraphs.filter((_, i) => i !== index));
    }
  };

  const handleUploadPosterParagraph = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { processImageFile } = await import('../utils/nutritionAutoHelper');
      const dataUrl = await processImageFile(file);
      const title = file.name.replace(/\.[^/.]+$/, '') || 'Poster Edukasi Gizi';
      setContentParagraphs([...contentParagraphs, `![${title}](${dataUrl})`]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses poster';
      alert(msg);
    }
  };

  const handleAddReference = () => {
    setReferences([...references, '']);
  };

  const handleUpdateReference = (index: number, val: string) => {
    const updated = [...references];
    updated[index] = val;
    setReferences(updated);
  };

  const handleRemoveReference = (index: number) => {
    if (references.length > 1) {
      setReferences(references.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newArticleCandidate: Partial<Article> = {
      title,
      summary,
      category,
      readingTime,
      publishDate,
      author,
      reviewer,
      keyTakeaways: keyTakeaways.filter((t) => t.trim().length > 0),
      contentParagraphs: contentParagraphs.filter((p) => p.trim().length > 0),
      references: references.filter((r) => r.trim().length > 0),
    };

    const validation = validateArticle(newArticleCandidate);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      setIsSubmitting(false);
      setActiveTab('editor');
      return;
    }

    const uniqueId = `artikel-${Date.now()}`;
    const completeArticle: Article = {
      id: uniqueId,
      title: title.trim(),
      summary: summary.trim(),
      category: category.trim(),
      readingTime: readingTime.trim(),
      publishDate: publishDate.trim(),
      author: author.trim(),
      reviewer: reviewer.trim(),
      coverGradient: 'from-emerald-100 to-teal-50',
      keyTakeaways: keyTakeaways.filter((t) => t.trim().length > 0),
      contentParagraphs: contentParagraphs.filter((p) => p.trim().length > 0),
      references: references.filter((r) => r.trim().length > 0),
    };

    onSaveArticle(completeArticle);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-article-modal-title"
    >
      <div className="bg-[#FAF9F6] w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header - Sticky top-0 z-20 */}
        <div className="bg-white/95 backdrop-blur-xs px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A8E6CF] to-[#8DE9D1] flex items-center justify-center text-slate-900 font-extrabold shadow-xs">
              <FileText className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="create-article-modal-title" className="text-base sm:text-lg font-bold text-slate-900">
                  Tambah Artikel Edukasi Baru
                </h2>
                <span className="text-[10px] font-bold text-emerald-900 bg-[#A8E6CF]/50 px-2 py-0.5 rounded-md border border-emerald-300">
                  Admin Redaksi
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Terbitkan tulisan panduan nutrisi medis terstandarisasi untuk masyarakat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'editor'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Form Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pratinjau Live</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Tutup editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8">
          {/* Quick Template Banner */}
          {activeTab === 'editor' && (
            <div className="mb-6 p-4 rounded-2xl bg-[#FFF5BA]/60 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-800 shrink-0" />
                <span>
                  Ingin mengisi cepat untuk pengujian? Gunakan templat artikel ilmiah otomatis:
                </span>
              </div>
              <button
                type="button"
                onClick={loadQuickTemplate}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-amber-300 font-bold text-amber-950 rounded-xl transition-colors shrink-0"
              >
                Muat Contoh Artikel Otomatis
              </button>
            </div>
          )}

          {/* Validation Errors Alert */}
          {formErrors.length > 0 && activeTab === 'editor' && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-900">
                <AlertCircle className="w-4 h-4" />
                <span>Mohon lengkapi kolom berikut sebelum menerbitkan artikel:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 pl-2">
                {formErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* TAB 1: FORM EDITOR */}
          {activeTab === 'editor' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Metadata Section */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  1. Judul & Informasi Dasar Artikel
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Judul Artikel <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Strategi Mengatur Porsi Makan Ramah Diabetes & Asam Urat"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ringkasan / Sinopsis Singkat <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Penjelasan 1-2 kalimat mengenai manfaat atau intisari yang dibahas artikel..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kategori Gizi <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Estimasi Waktu Baca
                    </label>
                    <input
                      type="text"
                      value={readingTime}
                      onChange={(e) => setReadingTime(e.target.value)}
                      placeholder="Contoh: 4 menit baca"
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                    </input>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Penulis / Ahli Gizi
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Dokter Peninjau Medis (Sp.GK / Sp.PD)
                    </label>
                    <input
                      type="text"
                      value={reviewer}
                      onChange={(e) => setReviewer(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tanggal Publikasi
                    </label>
                    <input
                      type="text"
                      value={publishDate}
                      onChange={(e) => setPublishDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* Key Takeaways Section */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      2. Poin Inti yang Perlu Diingat (Key Takeaways)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tampil di kotak kuning pastel pada bagian atas artikel
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTakeaway}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-[#A8E6CF] text-emerald-950 rounded-xl hover:bg-[#8DE9D1] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Poin</span>
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  {keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                      <input
                        type="text"
                        value={takeaway}
                        onChange={(e) => handleUpdateTakeaway(idx, e.target.value)}
                        placeholder="Tuliskan poin kunci yang mudah diingat pembaca..."
                        className="flex-1 px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                      {keyTakeaways.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTakeaway(idx)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Hapus poin ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Content Paragraphs */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      3. Paragraf Konten Lengkap
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tuliskan pembahasan ilmiah dengan bahasa ramah keluarga
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs">
                      <span>🖼️ Upload Poster/Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadPosterParagraph}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleAddParagraph}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-[#A8E6CF] text-emerald-950 rounded-xl hover:bg-[#8DE9D1] cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Paragraf</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {contentParagraphs.map((para, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-xs font-bold text-slate-400 w-5 mt-2">P{idx + 1}</span>
                      <textarea
                        rows={3}
                        value={para}
                        onChange={(e) => handleUpdateParagraph(idx, e.target.value)}
                        placeholder={`Tuliskan paragraf ${idx + 1}...`}
                        className="flex-1 px-3.5 py-2.5 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                      {contentParagraphs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveParagraph(idx)}
                          className="p-2 mt-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Hapus paragraf ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* References Section */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      4. Daftar Referensi & Rujukan Medis
                    </h3>
                    <p className="text-xs text-slate-500">
                      Jurnal, konsensus medis resmi, atau pedoman Kemenkes RI
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddReference}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-[#A8E6CF] text-emerald-950 rounded-xl hover:bg-[#8DE9D1] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Referensi</span>
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  {references.map((ref, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 w-6">[{idx + 1}]</span>
                      <input
                        type="text"
                        value={ref}
                        onChange={(e) => handleUpdateReference(idx, e.target.value)}
                        placeholder="Contoh: Kemenkes RI. Pedoman Pengelolaan Diet Hipertensi."
                        className="flex-1 px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                      {references.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveReference(idx)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Hapus referensi ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs sm:text-sm font-bold text-slate-800 transition-colors"
                >
                  Lihat Pratinjau
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md transition-colors"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Terbitkan Artikel Sekarang</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: LIVE PREVIEW MODE */}
          {activeTab === 'preview' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                <span>
                  Ini adalah simulasi tampilan artikel saat dibaca oleh pengunjung website HIHO.
                </span>
                <button
                  onClick={() => setActiveTab('editor')}
                  className="font-bold underline text-emerald-950"
                >
                  Kembali ke Editor
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <span className="bg-[#A8E6CF]/40 px-2.5 py-1 rounded-md border border-emerald-300/40">
                    {category || 'Kategori Artikel'}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500 font-normal">{readingTime}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {title || 'Judul Artikel Belum Diisi'}
                </h1>

                <p className="text-sm text-slate-600 leading-relaxed italic">
                  {summary || 'Ringkasan artikel akan tampil di sini...'}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 pt-2 pb-4 border-b border-slate-100">
                  <span className="font-semibold text-slate-800">Ditulis oleh: {author}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Review Medis: {reviewer}</span>
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{publishDate}</span>
                  </span>
                </div>
              </div>

              {/* Takeaways in Preview */}
              <div className="p-5 rounded-2xl bg-[#FFF5BA]/50 border border-amber-200 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950">
                  Poin Inti yang Perlu Diingat:
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800">
                  {keyTakeaways
                    .filter((t) => t.trim().length > 0)
                    .map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-800 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Content Paragraphs in Preview with Poster Support */}
              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                {contentParagraphs
                  .filter((p) => p.trim().length > 0)
                  .map((para, idx) => {
                    const trimmed = para.trim();
                    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
                    if (imgMatch) {
                      return (
                        <figure key={idx} className="my-4 flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                          <img
                            src={imgMatch[2]}
                            alt={imgMatch[1]}
                            className="max-h-72 w-auto rounded-lg object-contain bg-white shadow-xs"
                          />
                          {imgMatch[1] && (
                            <figcaption className="text-xs font-semibold text-slate-600 mt-2 text-center">
                              {imgMatch[1]}
                            </figcaption>
                          )}
                        </figure>
                      );
                    }
                    return <p key={idx}>{trimmed}</p>;
                  })}
              </div>

              {/* References in Preview */}
              <div className="pt-6 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-slate-600" />
                  <span>Daftar Referensi & Kepustakaan Ilmiah:</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-500">
                  {references
                    .filter((r) => r.trim().length > 0)
                    .map((ref, idx) => (
                      <li key={idx}>[{idx + 1}] {ref}</li>
                    ))}
                </ul>
              </div>

              {/* Action buttons in preview */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  ← Edit Ulang
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md transition-colors"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Konfirmasi & Terbitkan</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
