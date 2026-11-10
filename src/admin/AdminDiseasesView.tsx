import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { Disease, FoodGuideline, SampleMealPlan } from '../types';
import { validateDiseaseData } from '../utils/searchAndFilter';
import {
  PRESET_CATEGORIES,
  PRESET_EMOJIS,
  generateFoodExplanation,
  processImageFile,
} from '../utils/nutritionAutoHelper';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Info,
  Clock,
  Layers,
  Activity,
  HeartPulse,
  Flame,
  Droplet,
  ShieldAlert,
  Utensils,
  Wand2,
} from 'lucide-react';

export const AdminDiseasesView: React.FC = () => {
  const { diseases, addDisease, updateDisease, deleteDisease } = useData();

  // Search & Filter & Pagination
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDisease, setEditingDisease] = useState<Disease | null>(null);
  const [activeFormTab, setActiveFormTab] = useState<'info' | 'klinis' | 'makanan' | 'menu'>('info');

  // Form Fields - Basic
  const [name, setName] = useState('');
  const [indonesianName, setIndonesianName] = useState('');
  const [category, setCategory] = useState<string>(PRESET_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [iconName, setIconName] = useState('🩸');
  const [customEmoji, setCustomEmoji] = useState('');
  const [summary, setSummary] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Form Fields - Clinical
  const [criteria, setCriteria] = useState('');
  const [pathophysiology, setPathophysiology] = useState('');
  const [riskFactorsText, setRiskFactorsText] = useState('');
  const [healthImpactsText, setHealthImpactsText] = useState('');

  // Form Fields - Food Guidance (Auto vs Manual Toggle)
  const [foodExplanationMode, setFoodExplanationMode] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const [allowedFoods, setAllowedFoods] = useState<FoodGuideline[]>([]);
  const [avoidFoods, setAvoidFoods] = useState<FoodGuideline[]>([]);

  // Input state for adding Allowed Food
  const [newAllowedItem, setNewAllowedItem] = useState('');
  const [newAllowedCategory, setNewAllowedCategory] = useState('');
  const [newAllowedDetail, setNewAllowedDetail] = useState('');
  const [newAllowedPortion, setNewAllowedPortion] = useState('');
  const [newAllowedImage, setNewAllowedImage] = useState('');

  // Input state for adding Avoid Food
  const [newAvoidItem, setNewAvoidItem] = useState('');
  const [newAvoidCategory, setNewAvoidCategory] = useState('');
  const [newAvoidDetail, setNewAvoidDetail] = useState('');
  const [newAvoidPortion, setNewAvoidPortion] = useState('');
  const [newAvoidImage, setNewAvoidImage] = useState('');

  // Form Fields - Daily Meal Plan
  const [breakfast, setBreakfast] = useState('');
  const [snackPagi, setSnackPagi] = useState('');
  const [lunch, setLunch] = useState('');
  const [snackSore, setSnackSore] = useState('');
  const [dinner, setDinner] = useState('');

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Disease | null>(null);

  // File input refs
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const allowedFileInputRef = useRef<HTMLInputElement>(null);
  const avoidFileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setName('');
    setIndonesianName('');
    setCategory(PRESET_CATEGORIES[0]);
    setCustomCategory('');
    setIsCustomCategory(false);
    setIconName('🩸');
    setCustomEmoji('');
    setSummary('');
    setCoverImageUrl('');
    setCriteria('');
    setPathophysiology('');
    setRiskFactorsText('');
    setHealthImpactsText('');
    setFoodExplanationMode('AUTO');
    setAllowedFoods([]);
    setAvoidFoods([]);
    setNewAllowedItem('');
    setNewAllowedCategory('');
    setNewAllowedDetail('');
    setNewAllowedPortion('');
    setNewAllowedImage('');
    setNewAvoidItem('');
    setNewAvoidCategory('');
    setNewAvoidDetail('');
    setNewAvoidPortion('');
    setNewAvoidImage('');
    setBreakfast('');
    setSnackPagi('');
    setLunch('');
    setSnackSore('');
    setDinner('');
    setFormErrors([]);
    setEditingDisease(null);
    setActiveFormTab('info');
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (disease: Disease) => {
    setEditingDisease(disease);
    setName(disease.name);
    setIndonesianName(disease.indonesianName || '');

    // Category
    if (PRESET_CATEGORIES.includes(disease.categoryLabel || disease.category)) {
      setCategory(disease.categoryLabel || disease.category);
      setIsCustomCategory(false);
    } else {
      setIsCustomCategory(true);
      setCustomCategory(disease.categoryLabel || disease.category);
    }

    setIconName(disease.iconName || '🩸');
    setSummary(disease.summary);
    setCoverImageUrl(disease.imageUrl || '');
    setCriteria(disease.criteria || '');
    setPathophysiology(disease.pathophysiology || '');
    setRiskFactorsText((disease.riskFactors || []).join('\n'));
    setHealthImpactsText((disease.healthImpacts || []).join('\n'));

    // Populate food guidelines
    setAllowedFoods(disease.allowedFoods ? [...disease.allowedFoods] : []);
    setAvoidFoods(disease.avoidFoods ? [...disease.avoidFoods] : []);

    // Meal plan
    if (disease.sampleMealPlan) {
      setBreakfast(disease.sampleMealPlan.breakfast || '');
      setSnackPagi(disease.sampleMealPlan.snackPagi || disease.sampleMealPlan.snack || '');
      setLunch(disease.sampleMealPlan.lunch || '');
      setSnackSore(disease.sampleMealPlan.snackSore || '');
      setDinner(disease.sampleMealPlan.dinner || '');
    }

    setFormErrors([]);
    setActiveFormTab('info');
    setIsModalOpen(true);
  };

  // Local Image Upload Handlers
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingCover(true);
      const dataUrl = await processImageFile(file);
      setCoverImageUrl(dataUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses gambar.';
      alert(msg);
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleAllowedFoodImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file);
      setNewAllowedImage(dataUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses gambar.';
      alert(msg);
    }
  };

  const handleAvoidFoodImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file);
      setNewAvoidImage(dataUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses gambar.';
      alert(msg);
    }
  };

  // Allowed Food Adding
  const handleAddAllowedFood = () => {
    const itemName = newAllowedItem.trim();
    if (!itemName) return;

    let finalCategory = newAllowedCategory.trim();
    let finalDetail = newAllowedDetail.trim();
    let finalPortion = newAllowedPortion.trim();

    if (foodExplanationMode === 'AUTO' || !finalDetail || !finalPortion) {
      const auto = generateFoodExplanation(
        itemName,
        true,
        name,
        isCustomCategory ? customCategory : category
      );
      if (!finalCategory) finalCategory = auto.category;
      if (!finalDetail) finalDetail = auto.detail;
      if (!finalPortion) finalPortion = auto.portionOrReason;
    }

    const newFood: FoodGuideline = {
      item: itemName,
      category: finalCategory || 'Pangan Sehat Terpilih',
      detail: finalDetail || 'Mendukung pemulihan fungsi organ dan menstabilkan metabolisme.',
      portionOrReason: finalPortion || '1 porsi sedang per kali makan',
      imageUrl: newAllowedImage || undefined,
    };

    setAllowedFoods([...allowedFoods, newFood]);
    setNewAllowedItem('');
    setNewAllowedCategory('');
    setNewAllowedDetail('');
    setNewAllowedPortion('');
    setNewAllowedImage('');
    if (allowedFileInputRef.current) allowedFileInputRef.current.value = '';
  };

  const handleRemoveAllowedFood = (index: number) => {
    setAllowedFoods(allowedFoods.filter((_, i) => i !== index));
  };

  // Avoid Food Adding
  const handleAddAvoidFood = () => {
    const itemName = newAvoidItem.trim();
    if (!itemName) return;

    let finalCategory = newAvoidCategory.trim();
    let finalDetail = newAvoidDetail.trim();
    let finalPortion = newAvoidPortion.trim();

    if (foodExplanationMode === 'AUTO' || !finalDetail || !finalPortion) {
      const auto = generateFoodExplanation(
        itemName,
        false,
        name,
        isCustomCategory ? customCategory : category
      );
      if (!finalCategory) finalCategory = auto.category;
      if (!finalDetail) finalDetail = auto.detail;
      if (!finalPortion) finalPortion = auto.portionOrReason;
    }

    const newFood: FoodGuideline = {
      item: itemName,
      category: finalCategory || 'Pantangan / Dibatasi',
      detail: finalDetail || 'Berisiko memicu peradangan atau komplikasi perburukan kondisi.',
      portionOrReason: finalPortion || 'Hindari sepenuhnya atau batasi ketat',
      imageUrl: newAvoidImage || undefined,
    };

    setAvoidFoods([...avoidFoods, newFood]);
    setNewAvoidItem('');
    setNewAvoidCategory('');
    setNewAvoidDetail('');
    setNewAvoidPortion('');
    setNewAvoidImage('');
    if (avoidFileInputRef.current) avoidFileInputRef.current.value = '';
  };

  const handleRemoveAvoidFood = (index: number) => {
    setAvoidFoods(avoidFoods.filter((_, i) => i !== index));
  };

  // Save Disease
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategoryName = isCustomCategory ? customCategory.trim() : category;

    const quickAllowed = allowedFoods.map((f) => f.item);
    const quickAvoid = avoidFoods.map((f) => f.item);

    const candidate: Partial<Disease> = {
      name: name.trim(),
      category: finalCategoryName,
      summary: summary.trim(),
      quickAllowed,
      quickAvoid,
    };

    const validation = validateDiseaseData(candidate);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    const parsedRiskFactors = riskFactorsText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const parsedHealthImpacts = healthImpactsText
      .split('\n')
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const mealPlan: SampleMealPlan = {
      breakfast: breakfast.trim() || 'Sarapan bergizi seimbang tinggi serat dan protein berkualitas.',
      snackPagi: snackPagi.trim() || '1 porsi buah segar dengan indeks glikemik bersahabat.',
      lunch: lunch.trim() || 'Makan siang prinsip Piring Model T porsi sayur seimbang.',
      snackSore: snackSore.trim() || 'Kudapan rebus tanpa perasa tambahan.',
      dinner: dinner.trim() || 'Makan malam porsi ringan sebelum pukul 19.30.',
    };

    if (editingDisease) {
      // Update existing
      updateDisease(editingDisease.id, {
        name: name.trim(),
        indonesianName: indonesianName.trim() || name.trim(),
        category: finalCategoryName,
        categoryLabel: finalCategoryName,
        iconName: iconName.trim(),
        imageUrl: coverImageUrl.trim() || undefined,
        summary: summary.trim(),
        pathophysiology:
          pathophysiology.trim() ||
          `Pengaturan pola makan yang tepat terbukti membantu meringankan kerja organ serta menstabilkan kondisi ${name}.`,
        criteria: criteria.trim() || 'Evaluasi parameter klinis dengan dokter spesialis terkait.',
        riskFactors: parsedRiskFactors.length > 0 ? parsedRiskFactors : editingDisease.riskFactors,
        healthImpacts: parsedHealthImpacts.length > 0 ? parsedHealthImpacts : editingDisease.healthImpacts,
        quickAllowed,
        quickAvoid,
        allowedFoods,
        avoidFoods,
        sampleMealPlan: mealPlan,
      });
    } else {
      // Create new disease
      const newId = `penyakit-${Date.now()}`;
      const newEntry: Disease = {
        id: newId,
        name: name.trim(),
        indonesianName: indonesianName.trim() || name.trim(),
        category: finalCategoryName,
        categoryLabel: finalCategoryName,
        iconName: iconName.trim() || '🩸',
        imageUrl: coverImageUrl.trim() || undefined,
        summary: summary.trim(),
        pathophysiology:
          pathophysiology.trim() ||
          `Pengaturan pola makan yang tepat terbukti membantu meringankan kerja organ serta menstabilkan kondisi ${name}.`,
        criteria: criteria.trim() || 'Konsultasikan dengan dokter untuk evaluasi parameter laboratorium spesifik.',
        riskFactors:
          parsedRiskFactors.length > 0
            ? parsedRiskFactors
            : ['Pola makan tinggi lemak jenuh / natrium / gula', 'Kurang aktivitas fisik aerobik'],
        healthImpacts:
          parsedHealthImpacts.length > 0
            ? parsedHealthImpacts
            : ['Risiko perburukan fungsi organ dan komplikasi kronis'],
        quickAllowed,
        quickAvoid,
        allowedFoods,
        avoidFoods,
        sampleMealPlan: mealPlan,
      };
      addDisease(newEntry);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteDisease(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  // Filtered List
  const filteredDiseases = diseases.filter((d) => {
    const matchesCategory =
      selectedCategory === 'semua' ||
      d.category === selectedCategory ||
      d.categoryLabel === selectedCategory;
    const matchesSearch =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.indonesianName.toLowerCase().includes(search.toLowerCase()) ||
      d.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredDiseases.length / itemsPerPage) || 1;
  const paginatedDiseases = filteredDiseases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderIcon = (icon: string) => {
    if (!icon) return <Activity className="w-4 h-4 text-emerald-800" />;
    if (/\p{Extended_Pictographic}/u.test(icon) || icon.length <= 4) {
      return <span className="text-base select-none leading-none">{icon}</span>;
    }
    switch (icon) {
      case 'HeartPulse':
        return <HeartPulse className="w-4 h-4 text-rose-700" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-orange-700" />;
      case 'Droplet':
        return <Droplet className="w-4 h-4 text-sky-700" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4 text-amber-700" />;
      default:
        return <Activity className="w-4 h-4 text-emerald-800" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Kelola Direktori Penyakit
            </h2>
            <span className="text-xs font-bold text-emerald-900 bg-[#A8E6CF] px-2.5 py-0.5 rounded-full">
              {diseases.length} Terdaftar
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola data kondisi klinis, upload foto cover/makanan, kriteria cut-off, dan panduan makanan
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-102 active:scale-98 shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Tambah Penyakit Baru</span>
        </button>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nama penyakit atau gejala..."
            className="w-full pl-9 pr-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="semua">Semua Kategori</option>
            {PRESET_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="metabolik">Metabolik (Legacy)</option>
            <option value="pencernaan">Pencernaan (Legacy)</option>
            <option value="jantung">Kardiovaskular (Legacy)</option>
          </select>
        </div>
      </div>

      {/* Data Table View */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Kondisi & Kategori</th>
                <th className="py-3.5 px-4">Deskripsi Ringkas</th>
                <th className="py-3.5 px-4">Panduan Makanan Dianjurkan</th>
                <th className="py-3.5 px-4">Pantangan Utama</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedDiseases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Tidak ditemukan data penyakit yang cocok.
                  </td>
                </tr>
              ) : (
                paginatedDiseases.map((disease) => (
                  <tr key={disease.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Condition Name, Category & Thumbnail */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex items-start gap-2.5">
                        {disease.imageUrl ? (
                          <img
                            src={disease.imageUrl}
                            alt={disease.name}
                            className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-200 mt-0.5"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-[#A8E6CF]/30 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                            {renderIcon(disease.iconName)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span>{disease.name}</span>
                            {disease.imageUrl && (
                              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1 rounded border border-emerald-200">
                                Foto
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {disease.indonesianName}
                          </p>
                          <span className="inline-block mt-1 text-[10px] font-bold text-emerald-900 bg-[#A8E6CF]/40 px-2 py-0.5 rounded border border-emerald-200">
                            {disease.categoryLabel || disease.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Summary */}
                    <td className="py-3.5 px-4 align-top text-slate-600 max-w-xs leading-relaxed">
                      {disease.summary}
                    </td>

                    {/* Allowed Foods Tags */}
                    <td className="py-3.5 px-4 align-top max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {disease.quickAllowed.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-md font-medium"
                          >
                            ✓ {item}
                          </span>
                        ))}
                        {disease.quickAllowed.length > 3 && (
                          <span className="text-[10px] text-slate-400">
                            +{disease.quickAllowed.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Avoid Foods Tags */}
                    <td className="py-3.5 px-4 align-top max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {disease.quickAvoid.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-orange-50 text-orange-950 border border-orange-200 px-2 py-0.5 rounded-md font-medium"
                          >
                            ✕ {item}
                          </span>
                        ))}
                        {disease.quickAvoid.length > 3 && (
                          <span className="text-[10px] text-slate-400">
                            +{disease.quickAvoid.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 align-top text-right shrink-0">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(disease)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                          title="Edit Lengkap Penyakit"
                          aria-label={`Edit ${disease.name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(disease)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Penyakit"
                          aria-label={`Hapus ${disease.name}`}
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

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Halaman {currentPage} dari {totalPages} ({filteredDiseases.length} total)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* COMPREHENSIVE CREATE / EDIT MODAL WITH TABS & LOCAL FILE UPLOAD */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FAF9F6] w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header - Sticky top-0 z-20 for touch accessibility */}
            <div className="bg-white/95 backdrop-blur-xs px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingDisease ? `Edit Penyakit: ${editingDisease.name}` : 'Tambah Penyakit Baru'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Kelola informasi medis lengkap, foto cover, panduan makanan (Auto/Manual), dan menu harian
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Section Navigation Tabs */}
            <div className="bg-white border-b border-slate-200 px-6 flex items-center gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveFormTab('info')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                  activeFormTab === 'info'
                    ? 'border-emerald-600 text-emerald-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>1. Info Dasar & Foto</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('klinis')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                  activeFormTab === 'klinis'
                    ? 'border-emerald-600 text-emerald-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>2. Parameter & Tinjauan Klinis</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('makanan')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                  activeFormTab === 'makanan'
                    ? 'border-emerald-600 text-emerald-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>3. Panduan Makanan ({allowedFoods.length + avoidFoods.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('menu')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                  activeFormTab === 'menu'
                    ? 'border-emerald-600 text-emerald-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>4. Contoh Menu Harian</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-5 text-xs flex-1">
              {formErrors.length > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 space-y-1">
                  <div className="flex items-center gap-1 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Periksa kelengkapan form:</span>
                  </div>
                  <ul className="list-disc list-inside">
                    {formErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 1: INFO DASAR, KATEGORI, EMOJI & FOTO COVER               */}
              {/* ============================================================== */}
              {activeFormTab === 'info' && (
                <div className="space-y-4">
                  {/* Name & Indonesian Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Nama Medis Penyakit <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Asam Urat (Gout Arthritis)"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Nama Awam / Istilah Indonesia
                      </label>
                      <input
                        type="text"
                        value={indonesianName}
                        onChange={(e) => setIndonesianName(e.target.value)}
                        placeholder="Contoh: Nyeri Sendi Kristal Purin"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  </div>

                  {/* Extended Health Categories Dropdown + Custom Category */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                    <label className="block font-bold text-slate-800">
                      Kategori Kesehatan <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <select
                        value={isCustomCategory ? '__CUSTOM__' : category}
                        onChange={(e) => {
                          if (e.target.value === '__CUSTOM__') {
                            setIsCustomCategory(true);
                          } else {
                            setIsCustomCategory(false);
                            setCategory(e.target.value);
                          }
                        }}
                        className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      >
                        {PRESET_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="__CUSTOM__">➕ Kategori Kustom (Ketik Sendiri)...</option>
                      </select>

                      {isCustomCategory && (
                        <input
                          type="text"
                          required
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="Ketik kategori baru (cth: Dermatologi, Tiroid)..."
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-emerald-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      )}
                    </div>
                  </div>

                  {/* Extended Emoji Icon Picker */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                    <label className="block font-bold text-slate-800">
                      Pilihan Ikon Emoji: <span className="text-xl ml-1">{iconName}</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-2 bg-[#FAF9F6] rounded-xl border border-slate-200">
                      {PRESET_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setIconName(emoji);
                            setCustomEmoji('');
                          }}
                          className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                            iconName === emoji
                              ? 'bg-emerald-200 border-2 border-emerald-500 scale-110 shadow-xs'
                              : 'bg-white hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-slate-400 text-[11px]">Atau ketik emoji lain:</span>
                      <input
                        type="text"
                        value={customEmoji}
                        onChange={(e) => {
                          setCustomEmoji(e.target.value);
                          if (e.target.value.trim()) setIconName(e.target.value.trim());
                        }}
                        placeholder="cth: 🍇"
                        className="w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  </div>

                  {/* Main Disease Cover Image (Local Laptop Upload + Instant Preview) */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-slate-800">
                        Foto Cover / Thumbnail Penyakit (Upload dari Laptop)
                      </label>
                      {coverImageUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setCoverImageUrl('');
                            if (coverFileInputRef.current) coverFileInputRef.current.value = '';
                          }}
                          className="text-[11px] font-bold text-rose-600 hover:text-rose-800"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <input
                        type="file"
                        accept="image/*"
                        ref={coverFileInputRef}
                        onChange={handleCoverUpload}
                        className="hidden"
                        id="cover-file-input"
                      />
                      <label
                        htmlFor="cover-file-input"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#A8E6CF] hover:bg-[#8DE9D1] text-emerald-950 font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{coverImageUrl ? 'Ganti Foto dari Laptop' : 'Pilih Foto dari Laptop'}</span>
                      </label>

                      <div className="flex-1 w-full">
                        <input
                          type="url"
                          value={coverImageUrl}
                          onChange={(e) => setCoverImageUrl(e.target.value)}
                          placeholder="Atau tempel URL gambar (https://...)..."
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      </div>
                    </div>

                    {isUploadingCover && (
                      <p className="text-xs text-emerald-700 italic">Memproses gambar dari laptop...</p>
                    )}

                    {/* Instant Preview */}
                    {coverImageUrl && (
                      <div className="relative mt-2 rounded-xl overflow-hidden border border-emerald-200 h-36 w-full max-w-md bg-slate-100">
                        <img
                          src={coverImageUrl}
                          alt="Preview Cover"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          Preview Cover
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Deskripsi / Ringkasan Medis <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Ringkasan penjelasan kondisi penyakit untuk pasien dan keluarga..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 2: PARAMETER CUT-OFF & TINJAUAN KLINIS                     */}
              {/* ============================================================== */}
              {activeFormTab === 'klinis' && (
                <div className="space-y-4">
                  {/* Parameter & Kriteria Cut-off */}
                  <div className="bg-[#FFF5BA]/40 p-4 rounded-2xl border border-amber-300/80 space-y-1.5">
                    <label className="block font-bold text-amber-950">
                      Parameter & Kriteria Batas Medis (Cut-Off Threshold)
                    </label>
                    <p className="text-[11px] text-amber-900">
                      Nilai laboratorium atau batas klinis diagnosis (cth: Gula Darah Puasa ≥ 126 mg/dL, Tekanan Darah ≥ 130/80 mmHg, Asam Urat &gt; 7.0 mg/dL)
                    </p>
                    <input
                      type="text"
                      value={criteria}
                      onChange={(e) => setCriteria(e.target.value)}
                      placeholder="Contoh: Gula Darah Puasa (GDP) ≥ 126 mg/dL atau HbA1c ≥ 6.5%"
                      className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold text-slate-800"
                    />
                  </div>

                  {/* Pathophysiology */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                    <label className="block font-bold text-slate-800">
                      Mekanisme Biologis / Fisiologis (Mengapa Nutrisi Berpengaruh)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Jelaskan proses kerja gizi terhadap organ, sel, atau peradangan pada kondisi ini
                    </p>
                    <textarea
                      rows={3}
                      value={pathophysiology}
                      onChange={(e) => setPathophysiology(e.target.value)}
                      placeholder="Contoh: Pada penderita diabetes tipe 2, sel tubuh mengalami resistensi insulin. Karbohidrat sederhana berindeks glikemik tinggi mempercepat beban pankreas..."
                      className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  {/* Risk Factors & Health Impacts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                      <label className="block font-bold text-slate-800">
                        Faktor Risiko Utama (1 baris per poin)
                      </label>
                      <textarea
                        rows={4}
                        value={riskFactorsText}
                        onChange={(e) => setRiskFactorsText(e.target.value)}
                        placeholder="Riwayat keluarga&#10;Berat badan berlebih (IMT ≥ 25)&#10;Kurang aktivitas fisik aerobik&#10;Konsumsi gula / natrium tinggi"
                        className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-rose-200 space-y-1">
                      <label className="block font-bold text-rose-950">
                        Dampak Jika Tidak Terkontrol (1 baris per poin)
                      </label>
                      <textarea
                        rows={4}
                        value={healthImpactsText}
                        onChange={(e) => setHealthImpactsText(e.target.value)}
                        placeholder="Kerusakan pembuluh darah perifer&#10;Gagal ginjal kronis&#10;Serangan jantung atau stroke vaskular"
                        className="w-full px-3 py-2 bg-rose-50/30 border border-rose-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 3: PANDUAN MAKANAN (AUTO / MANUAL TOGGLE & LOCAL UPLOAD)   */}
              {/* ============================================================== */}
              {activeFormTab === 'makanan' && (
                <div className="space-y-6">
                  {/* Mode Toggle Switch: AUTO vs MANUAL */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#A8E6CF]/30 via-white to-[#FFD3B6]/30 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                        <Wand2 className="w-4 h-4 text-emerald-700" />
                        <span>Mode Penjelasan Makanan:</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white">
                          {foodExplanationMode}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {foodExplanationMode === 'AUTO'
                          ? 'Sistem otomatis mengisikan alasan klinis & takaran cerdas dari kamus gizi.'
                          : 'Admin bebas menulis sendiri kategori, alasan klinis, dan takaran kustom.'}
                      </p>
                    </div>

                    <div className="inline-flex p-1 bg-slate-200 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setFoodExplanationMode('AUTO')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          foodExplanationMode === 'AUTO'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        ⚡ AUTO (Otomatis)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFoodExplanationMode('MANUAL')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          foodExplanationMode === 'MANUAL'
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        ✏️ MANUAL (Kustom)
                      </button>
                    </div>
                  </div>

                  {/* 3A. MAKANAN DIANJURKAN (Soft Pastel Green) */}
                  <div className="bg-white p-5 rounded-2xl border border-emerald-300 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#A8E6CF] flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">
                          Makanan Sangat Dianjurkan ({allowedFoods.length})
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Boleh Dimakan
                      </span>
                    </div>

                    {/* Input Sub-form to Add Food */}
                    <div className="p-3 bg-[#FAF9F6] rounded-xl border border-emerald-200/80 space-y-2.5">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={newAllowedItem}
                          onChange={(e) => setNewAllowedItem(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && foodExplanationMode === 'AUTO') {
                              e.preventDefault();
                              handleAddAllowedFood();
                            }
                          }}
                          placeholder="Nama makanan anjuran (cth: Bayam kukus, Ikan kembung, Oat)..."
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 font-semibold"
                        />
                        <button
                          type="button"
                          onClick={handleAddAllowedFood}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs shrink-0 flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tambah Makanan</span>
                        </button>
                      </div>

                      {/* If MANUAL Mode, show explicit fields */}
                      {foodExplanationMode === 'MANUAL' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                              Kategori Gizi Bahan:
                            </label>
                            <input
                              type="text"
                              value={newAllowedCategory}
                              onChange={(e) => setNewAllowedCategory(e.target.value)}
                              placeholder="cth: Sayuran Berserat / Karbohidrat Rendah GI"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                              Anjuran Takaran / Porsi:
                            </label>
                            <input
                              type="text"
                              value={newAllowedPortion}
                              onChange={(e) => setNewAllowedPortion(e.target.value)}
                              placeholder="cth: 1 mangkuk sedang (100–150g) per sesi makan"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                              Alasan & Manfaat Medis:
                            </label>
                            <input
                              type="text"
                              value={newAllowedDetail}
                              onChange={(e) => setNewAllowedDetail(e.target.value)}
                              placeholder="cth: Memperlambat penyerapan glukosa dan menjaga flora usus seimbang."
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      )}

                      {/* Food Thumbnail Uploader */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="file"
                          accept="image/*"
                          ref={allowedFileInputRef}
                          onChange={handleAllowedFoodImageUpload}
                          className="hidden"
                          id="allowed-food-file-input"
                        />
                        <label
                          htmlFor="allowed-food-file-input"
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg cursor-pointer text-[11px] font-semibold"
                        >
                          <Upload className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{newAllowedImage ? 'Ganti Foto Bahan' : 'Upload Foto Bahan'}</span>
                        </label>
                        {newAllowedImage && (
                          <div className="flex items-center gap-1.5">
                            <img
                              src={newAllowedImage}
                              alt="Thumbnail preview"
                              className="w-7 h-7 rounded-lg object-cover border border-emerald-300"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setNewAllowedImage('');
                                if (allowedFileInputRef.current) allowedFileInputRef.current.value = '';
                              }}
                              className="text-[10px] text-rose-600 hover:text-rose-800"
                            >
                              Batal Foto
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Existing Allowed Foods List */}
                    <div className="space-y-2">
                      {allowedFoods.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#A8E6CF]/20 border border-emerald-200 flex items-start justify-between gap-3"
                        >
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.item}
                                className="w-12 h-12 rounded-lg object-cover shrink-0 border border-emerald-300"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-[#A8E6CF]/40 border border-emerald-300 flex items-center justify-center shrink-0">
                                <Utensils className="w-5 h-5 text-emerald-900" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-slate-900 text-xs">{item.item}</h5>
                                {item.category && (
                                  <span className="text-[9px] font-bold text-emerald-900 bg-white px-1.5 py-0.2 rounded border border-emerald-300">
                                    {item.category}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                                {item.detail}
                              </p>
                              <p className="text-[10px] font-bold text-emerald-950 mt-0.5">
                                Takaran: {item.portionOrReason}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAllowedFood(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Hapus Makanan"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {allowedFoods.length === 0 && (
                        <p className="text-slate-400 text-center py-3 italic text-[11px]">
                          Belum ada makanan anjuran ditambahkan.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 3B. MAKANAN DIPANTANG (Soft Pastel Orange) */}
                  <div className="bg-white p-5 rounded-2xl border border-orange-300 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-orange-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#FFD3B6] flex items-center justify-center">
                          <XCircle className="w-4 h-4 text-orange-950" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">
                          Makanan Dipantang / Dibatasi ({avoidFoods.length})
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold text-orange-950 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                        Hindari / Pantang
                      </span>
                    </div>

                    {/* Input Sub-form to Add Avoid Food */}
                    <div className="p-3 bg-[#FAF9F6] rounded-xl border border-orange-200/80 space-y-2.5">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={newAvoidItem}
                          onChange={(e) => setNewAvoidItem(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && foodExplanationMode === 'AUTO') {
                              e.preventDefault();
                              handleAddAvoidFood();
                            }
                          }}
                          placeholder="Nama makanan pantangan (cth: Jeroan, Emping, Santan kental, Gula)..."
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 font-semibold"
                        />
                        <button
                          type="button"
                          onClick={handleAddAvoidFood}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs shrink-0 flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5 text-orange-400" />
                          <span>Tambah Pantangan</span>
                        </button>
                      </div>

                      {/* If MANUAL Mode, show explicit fields */}
                      {foodExplanationMode === 'MANUAL' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                              Kategori Pantangan:
                            </label>
                            <input
                              type="text"
                              value={newAvoidCategory}
                              onChange={(e) => setNewAvoidCategory(e.target.value)}
                              placeholder="cth: Tinggi Purin / Tinggi Natrium / Lemak Jenuh"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                              Alasan Bahaya Klinis:
                            </label>
                            <input
                              type="text"
                              value={newAvoidPortion}
                              onChange={(e) => setNewAvoidPortion(e.target.value)}
                              placeholder="cth: Memicu lonjakan asam urat akut dan kristal sendi"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                              Penjelasan Detail Pantangan:
                            </label>
                            <input
                              type="text"
                              value={newAvoidDetail}
                              onChange={(e) => setNewAvoidDetail(e.target.value)}
                              placeholder="cth: Hindari sepenuhnya terutama pada fase serangan nyeri aktif."
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      )}

                      {/* Avoid Food Thumbnail Uploader */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="file"
                          accept="image/*"
                          ref={avoidFileInputRef}
                          onChange={handleAvoidFoodImageUpload}
                          className="hidden"
                          id="avoid-food-file-input"
                        />
                        <label
                          htmlFor="avoid-food-file-input"
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg cursor-pointer text-[11px] font-semibold"
                        >
                          <Upload className="w-3.5 h-3.5 text-orange-700" />
                          <span>{newAvoidImage ? 'Ganti Foto Pantangan' : 'Upload Foto Pantangan'}</span>
                        </label>
                        {newAvoidImage && (
                          <div className="flex items-center gap-1.5">
                            <img
                              src={newAvoidImage}
                              alt="Thumbnail preview"
                              className="w-7 h-7 rounded-lg object-cover border border-orange-300"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setNewAvoidImage('');
                                if (avoidFileInputRef.current) avoidFileInputRef.current.value = '';
                              }}
                              className="text-[10px] text-rose-600 hover:text-rose-800"
                            >
                              Batal Foto
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Existing Avoid Foods List */}
                    <div className="space-y-2">
                      {avoidFoods.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#FFD3B6]/20 border border-orange-200 flex items-start justify-between gap-3"
                        >
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.item}
                                className="w-12 h-12 rounded-lg object-cover shrink-0 border border-orange-300"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-[#FFD3B6]/40 border border-orange-300 flex items-center justify-center shrink-0">
                                <Utensils className="w-5 h-5 text-orange-950" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-slate-900 text-xs">{item.item}</h5>
                                {item.category && (
                                  <span className="text-[9px] font-bold text-orange-950 bg-white px-1.5 py-0.2 rounded border border-orange-300">
                                    {item.category}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                                {item.detail}
                              </p>
                              <p className="text-[10px] font-bold text-orange-950 mt-0.5">
                                Alasan: {item.portionOrReason}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAvoidFood(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Hapus Pantangan"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {avoidFoods.length === 0 && (
                        <p className="text-slate-400 text-center py-3 italic text-[11px]">
                          Belum ada makanan pantangan ditambahkan.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 4: CONTOH MENU HARIAN (SARAPAN, SNACK, SIANG, MALAM)       */}
              {/* ============================================================== */}
              {activeFormTab === 'menu' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      Contoh Menu Sehari Seimbang
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Rekomendasi menu praktis ramah kondisi untuk panduan pasien & keluarga di rumah
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="block font-bold text-emerald-900 text-[11px] mb-1">
                        1. Sarapan Pagi (06.30 - 07.30)
                      </label>
                      <input
                        type="text"
                        value={breakfast}
                        onChange={(e) => setBreakfast(e.target.value)}
                        placeholder="cth: Oatmeal seduh susu kedelai tanpa gula + potongan buah stroberi"
                        className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="block font-bold text-amber-900 text-[11px] mb-1">
                        2. Snack Pagi (09.30 - 10.00)
                      </label>
                      <input
                        type="text"
                        value={snackPagi}
                        onChange={(e) => setSnackPagi(e.target.value)}
                        placeholder="cth: 1 buah apel lokal dicuci bersih dengan kulitnya"
                        className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="block font-bold text-emerald-900 text-[11px] mb-1">
                        3. Makan Siang (12.00 - 13.00)
                      </label>
                      <input
                        type="text"
                        value={lunch}
                        onChange={(e) => setLunch(e.target.value)}
                        placeholder="cth: Nasi merah (1 kepal) + Ikan nila kukus jahe + Sayur bayam bening + Tahu kukus"
                        className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="block font-bold text-amber-900 text-[11px] mb-1">
                        4. Snack Sore (15.30 - 16.00)
                      </label>
                      <input
                        type="text"
                        value={snackSore}
                        onChange={(e) => setSnackSore(e.target.value)}
                        placeholder="cth: Edamame rebus 1 mangkuk kecil tanpa garam tambahan"
                        className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="block font-bold text-emerald-900 text-[11px] mb-1">
                        5. Makan Malam (18.30 - 19.30)
                      </label>
                      <input
                        type="text"
                        value={dinner}
                        onChange={(e) => setDinner(e.target.value)}
                        placeholder="cth: Pepes ayam dada tanpa kulit + Tumis buncis minyak zaitun + Tempe bacem tanpa gula"
                        className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Navigation & Submit Button Bar */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  {activeFormTab !== 'info' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeFormTab === 'klinis') setActiveFormTab('info');
                        else if (activeFormTab === 'makanan') setActiveFormTab('klinis');
                        else if (activeFormTab === 'menu') setActiveFormTab('makanan');
                      }}
                      className="px-3 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                    >
                      ← Kembali
                    </button>
                  )}
                  {activeFormTab !== 'menu' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeFormTab === 'info') setActiveFormTab('klinis');
                        else if (activeFormTab === 'klinis') setActiveFormTab('makanan');
                        else if (activeFormTab === 'makanan') setActiveFormTab('menu');
                      }}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl"
                    >
                      Lanjut →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all hover:scale-102"
                  >
                    {editingDisease ? 'Simpan Perubahan Penyakit' : 'Terbitkan Data Penyakit'}
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
                Konfirmasi Hapus Penyakit
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Apakah Anda yakin ingin menghapus data penyakit{' '}
                <strong className="text-slate-900">"{deleteTarget.name}"</strong>? Data ini akan langsung hilang dari direktori publik.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
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
