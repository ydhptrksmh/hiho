import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { DailyTip } from '../types';
import {
  Lightbulb,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from 'lucide-react';

export const AdminTipsView: React.FC = () => {
  const { tips, addTip, updateTip, deleteTip, toggleTipActive, resetTips } = useData();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<DailyTip | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [tipText, setTipText] = useState('');
  const [category, setCategory] = useState('Pola Makan & Serat');
  const [scientificContext, setScientificContext] = useState('');
  const [date, setDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState('');

  // Delete Target State
  const [deleteTarget, setDeleteTarget] = useState<DailyTip | null>(null);

  const resetForm = () => {
    setTitle('');
    setTipText('');
    setCategory('Pola Makan & Serat');
    setScientificContext('');
    setDate(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
    setIsActive(true);
    setFormError('');
    setEditingTip(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tipItem: DailyTip) => {
    setEditingTip(tipItem);
    setTitle(tipItem.title);
    setTipText(tipItem.tip);
    setCategory(tipItem.category);
    setScientificContext(tipItem.scientificContext || '');
    setDate(tipItem.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
    setIsActive(tipItem.isActive !== false);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !tipText.trim()) {
      setFormError('Judul tips dan isi teks tips wajib diisi.');
      return;
    }

    if (editingTip) {
      updateTip(editingTip.id, {
        title: title.trim(),
        tip: tipText.trim(),
        category: category.trim(),
        scientificContext: scientificContext.trim(),
        date: date.trim(),
        isActive,
      });
    } else {
      const newEntry: DailyTip = {
        id: `tip-${Date.now()}`,
        title: title.trim(),
        tip: tipText.trim(),
        category: category.trim(),
        scientificContext: scientificContext.trim(),
        date: date.trim() || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        isActive,
      };
      addTip(newEntry);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteTip(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const filteredTips = tips.filter((t) => {
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.tip.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = Array.from(new Set(tips.map((t) => t.category)));

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Kelola Tips Harian Gizi Sehat
            </h2>
            <span className="text-xs font-bold text-amber-950 bg-[#FFF5BA] border border-amber-300 px-2.5 py-0.5 rounded-full">
              {tips.length} Tips
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola tips nutrisi harian yang tampil di banner beranda. Anda dapat menambah, menyunting, mengaktifkan, atau menonaktifkan tips.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (window.confirm('Reset semua tips gizi ke data bawaan awal?')) {
                resetTips();
              }
            }}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold transition-colors"
            title="Reset data tips ke bawaan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-102 active:scale-98"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Tambah Tips Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari topik tips, kata kunci makanan..."
            className="w-full pl-9 pr-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 w-full sm:w-auto"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tips Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Judul Tips & Teks</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4 text-center">Status Beranda</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTips.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Tidak ada data tips yang sesuai pencarian.
                  </td>
                </tr>
              ) : (
                filteredTips.map((tip) => (
                  <tr key={tip.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 align-top max-w-md">
                      <p className="font-bold text-slate-900 text-sm leading-snug">{tip.title}</p>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{tip.tip}</p>
                      {tip.scientificContext && (
                        <p className="text-[10px] text-slate-400 line-clamp-1 italic mt-1">
                          Ref: {tip.scientificContext}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <span className="inline-block text-[10px] font-bold text-amber-950 bg-[#FFF5BA] px-2 py-0.5 rounded-md border border-amber-300">
                        {tip.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-top text-slate-500 text-[11px] whitespace-nowrap">
                      {tip.date || '-'}
                    </td>

                    <td className="py-3.5 px-4 align-top text-center">
                      <button
                        onClick={() => toggleTipActive(tip.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                          tip.isActive !== false
                            ? 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                        }`}
                        title="Klik untuk mengubah status tayang di beranda"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            tip.isActive !== false ? 'bg-emerald-600' : 'bg-slate-400'
                          }`}
                        />
                        <span>{tip.isActive !== false ? 'Aktif' : 'Nonaktif'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 align-top text-right shrink-0">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(tip)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                          title="Edit Tips"
                          aria-label={`Edit ${tip.title}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(tip)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Tips"
                          aria-label={`Hapus ${tip.title}`}
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

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#FAF9F6] px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FFF5BA] border border-amber-300 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-amber-950" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    {editingTip ? 'Sunting Tips Gizi Sehat' : 'Tambah Tips Gizi Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Tampil pada banner tips beranda utama</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Judul Tips Singkat <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Makan Sayur Terlebih Dahulu Sebelum Nasi"
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kategori Tips <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Contoh: Jadwal & Urutan Makan, Dehidrasi, Serat, Gula"
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Isi Anjuran Tips Praktis <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={tipText}
                  onChange={(e) => setTipText(e.target.value)}
                  placeholder="Jelaskan langkah konkret yang mudah dilakukan keluarga di rumah..."
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Dasar Ilmiah / Konteks Fisiologis (Mengapa Ini Penting?)
                </label>
                <textarea
                  rows={3}
                  value={scientificContext}
                  onChange={(e) => setScientificContext(e.target.value)}
                  placeholder="Riset klinis atau mekanisme biologis di balik anjuran ini..."
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="28 Oktober 2026"
                    className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Penayangan</label>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="isActiveToggle"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <label htmlFor="isActiveToggle" className="font-semibold text-slate-700 text-xs">
                      Aktifkan di Banner Beranda
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-xs"
                >
                  {editingTip ? 'Simpan Perubahan' : 'Terbitkan Tips'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Hapus Tips Nutrisi Ini?
              </h3>
              <p className="text-xs text-slate-500">
                Apakah Anda yakin ingin menghapus tips "<strong>{deleteTarget.title}</strong>"?
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-xs"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
