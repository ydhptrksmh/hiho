import React, { useState, useId } from 'react';
import { useData } from '../context/DataContext';
import { ActivityMedia } from '../types';
import { processImageFile } from '../utils/nutritionAutoHelper';
import { validateActivityData } from '../utils/searchAndFilter';
import {
  Camera,
  Plus,
  Search,
  Calendar,
  MapPin,
  Edit2,
  Trash2,
  Upload,
  Link as LinkIcon,
  X,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';

export const AdminGalleryView: React.FC = () => {
  const { activities, addActivity, updateActivity, deleteActivity } = useData();

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  // Upload feedback state
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const fileInputId = useId();

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const resetForm = () => {
    setTitle('');
    setImageUrl('');
    setDescription('');
    setDate('');
    setLocation('');
    setFormErrors([]);
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (activity: ActivityMedia) => {
    resetForm();
    setEditingId(activity.id);
    setTitle(activity.title);
    setImageUrl(activity.imageUrl);
    setDescription(activity.description || '');
    setDate(activity.date || '');
    setLocation(activity.location || '');
    setIsModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih berkas gambar yang valid (JPG, PNG, WEBP).');
      return;
    }

    try {
      setIsProcessingImage(true);
      const dataUrl = await processImageFile(file);
      setImageUrl(dataUrl);
    } catch (err: any) {
      alert(err.message || 'Gagal memproses gambar');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const activityData: Partial<ActivityMedia> = {
      title: title.trim(),
      imageUrl: imageUrl.trim(),
      description: description.trim(),
      date: date.trim(),
      location: location.trim(),
    };

    const validation = validateActivityData(activityData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    if (editingId) {
      updateActivity(editingId, {
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        description: description.trim() || undefined,
        date: date.trim() || undefined,
        location: location.trim() || undefined,
      });
      showNotification('Dokumentasi kegiatan berhasil diperbarui!');
    } else {
      const newActivity: ActivityMedia = {
        id: `activity-${Date.now()}`,
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        description: description.trim() || undefined,
        date: date.trim() || undefined,
        location: location.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      addActivity(newActivity);
      showNotification('Dokumentasi kegiatan baru berhasil ditambahkan!');
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, activityTitle: string) => {
    if (window.confirm(`Hapus dokumentasi kegiatan "${activityTitle}"? Tindakan ini tidak dapat dibatalkan.`)) {
      deleteActivity(id);
      showNotification(`Kegiatan "${activityTitle}" berhasil dihapus.`);
    }
  };

  // Filtered activities
  const filteredActivities = activities.filter((act) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      act.title.toLowerCase().includes(q) ||
      (act.description && act.description.toLowerCase().includes(q)) ||
      (act.location && act.location.toLowerCase().includes(q)) ||
      (act.date && act.date.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Camera className="w-4 h-4" />
            <span>Manajemen Galeri Kegiatan HIHO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Kelola Dokumentasi & Kegiatan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Unggah dan kelola foto dokumentasi kegiatan lapangan, skrining kesehatan, dan workshop gizi yang tampil di halaman Tentang Kami.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#4ECCA3] hover:bg-[#3dbd94] text-slate-950 font-bold text-xs sm:text-sm shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Kegiatan Baru</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Search Bar & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul kegiatan, tanggal, atau lokasi..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none shadow-2xs"
          />
        </div>

        <div className="text-xs font-bold text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto">
          Total: <span className="text-emerald-800">{activities.length} Kegiatan</span>
        </div>
      </div>

      {/* Activity Cards Grid / List */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#A8E6CF]/30 text-emerald-800 flex items-center justify-center mx-auto">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchQuery ? 'Tidak Ada Kegiatan yang Cocok' : 'Belum Ada Kegiatan Terdokumentasi'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'Coba gunakan kata kunci pencarian yang lain.'
              : 'Klik tombol "Tambah Kegiatan Baru" untuk mengunggah foto kegiatan pertama Anda.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              {/* Photo Thumbnail */}
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden border-b border-slate-100">
                <img
                  src={act.imageUrl}
                  alt={act.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {(act.date || act.location) && (
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {act.date && (
                      <span className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-800 shadow-xs border border-slate-200/60 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-700" />
                        {act.date}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <h3 className="text-base font-black text-slate-900 leading-snug line-clamp-2">
                    {act.title}
                  </h3>

                  {act.location && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-[#FF9F68] shrink-0" />
                      <span className="truncate">{act.location}</span>
                    </div>
                  )}

                  {act.description && (
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed pt-1">
                      {act.description}
                    </p>
                  )}
                </div>

                {/* Card Actions: Edit & Delete */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {act.id.slice(0, 12)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(act)}
                      className="p-2 rounded-xl text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                      title="Sunting kegiatan"
                      aria-label="Sunting kegiatan"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(act.id, act.title)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus kegiatan"
                      aria-label="Hapus kegiatan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Tambah / Edit Kegiatan */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 my-auto">
            {/* Modal Header - Sticky top-0 z-20 */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 bg-white/95 backdrop-blur-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#A8E6CF]/50 text-emerald-950 flex items-center justify-center font-bold">
                  <Camera className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    {editingId ? 'Sunting Dokumentasi Kegiatan' : 'Tambah Dokumentasi Kegiatan Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Foto dan judul akan langsung tampil di halaman publik Tentang Kami.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                aria-label="Tutup form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Validation Errors */}
              {formErrors.length > 0 && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-1 text-xs text-rose-800">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Harap lengkapi kolom yang wajib diisi:</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {formErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 1. Judul Kegiatan (Required) */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Judul / Title Kegiatan <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Edukasi Gizi Seimbang & Pengecekan Kesehatan Lapangan"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  required
                />
              </div>

              {/* 2. Upload Foto Kegiatan (Local File Uploader or URL) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Foto Kegiatan <span className="text-rose-600">*</span>
                </label>

                {/* Action Buttons for Image Source */}
                <div className="flex flex-wrap items-center gap-2">
                  <label
                    htmlFor={fileInputId}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isProcessingImage ? 'Memproses Foto...' : 'Upload Foto dari Laptop'}</span>
                  </label>
                  <input
                    id={fileInputId}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isProcessingImage}
                  />

                  <span className="text-xs text-slate-400">atau masukkan URL langsung:</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full pl-8 pr-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl text-xs cursor-pointer"
                      title="Hapus foto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Instant Image Preview */}
                {imageUrl && (
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Pratinjau Foto Kegiatan:
                    </span>
                    <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-slate-900/10 max-h-48">
                      <img
                        src={imageUrl}
                        alt="Pratinjau Foto"
                        className="w-full h-full object-cover"
                        onError={() => setFormErrors((prev) => [...prev, 'Foto gagal dimuat. Pastikan URL valid.'])}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Tanggal & Lokasi (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Tanggal Kegiatan
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Contoh: 28 Oktober 2026"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Lokasi Kegiatan
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Gedung Serbaguna, Jakarta"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* 4. Deskripsi Ringkas Kegiatan (Optional) */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Deskripsi Ringkas Kegiatan
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ringkasan singkat tentang materi edukasi, peserta yang hadir, atau hasil kegiatan..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessingImage}
                  className="px-5 py-2.5 rounded-xl bg-[#4ECCA3] hover:bg-[#3dbd94] text-slate-950 text-xs font-bold shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 disabled:opacity-50"
                >
                  {editingId ? 'Simpan Perubahan' : 'Terbitkan Kegiatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
