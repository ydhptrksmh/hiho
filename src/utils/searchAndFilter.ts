import { Disease, HealthCategory, Article, FoodRating, ActivityMedia } from '../types';

export function filterDiseasesByCategory(diseases: Disease[], category: HealthCategory): Disease[] {
  if (!category || category === 'semua') {
    return diseases;
  }
  return diseases.filter((d) => d.category === category);
}

export function searchDiseases(diseases: Disease[], query: string): Disease[] {
  const q = query.trim().toLowerCase();
  if (!q) return diseases;

  return diseases.filter((d) => {
    return (
      d.name.toLowerCase().includes(q) ||
      d.indonesianName.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q) ||
      d.categoryLabel.toLowerCase().includes(q) ||
      d.quickAllowed.some((item) => item.toLowerCase().includes(q)) ||
      d.quickAvoid.some((item) => item.toLowerCase().includes(q))
    );
  });
}

export function searchFoods(foods: FoodRating[], query: string): FoodRating[] {
  const q = query.trim().toLowerCase();
  if (!q) return foods;

  return foods.filter((f) => {
    return (
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.diabetes.note.toLowerCase().includes(q) ||
      f.hypertension.note.toLowerCase().includes(q) ||
      f.gout.note.toLowerCase().includes(q) ||
      f.gerd.note.toLowerCase().includes(q)
    );
  });
}

export interface GlobalSearchResult {
  diseases: Disease[];
  articles: Article[];
  foods: FoodRating[];
  totalMatches: number;
}

export function searchGlobal(
  query: string,
  diseases: Disease[],
  articles: Article[],
  foods: FoodRating[]
): GlobalSearchResult {
  const q = query.trim().toLowerCase();
  if (!q) {
    return { diseases: [], articles: [], foods: [], totalMatches: 0 };
  }

  const matchedDiseases = searchDiseases(diseases, q);
  const matchedArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.keyTakeaways.some((t) => t.toLowerCase().includes(q))
  );
  const matchedFoods = searchFoods(foods, q);

  return {
    diseases: matchedDiseases,
    articles: matchedArticles,
    foods: matchedFoods,
    totalMatches: matchedDiseases.length + matchedArticles.length + matchedFoods.length,
  };
}

export function getStatusDetails(status: 'safe' | 'moderate' | 'avoid'): {
  label: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
} {
  switch (status) {
    case 'safe':
      return {
        label: 'Aman / Dianjurkan',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-800',
        borderColor: 'border-emerald-200',
      };
    case 'moderate':
      return {
        label: 'Batasi Porsi',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-800',
        borderColor: 'border-amber-200',
      };
    case 'avoid':
      return {
        label: 'Hindari / Pantang',
        badgeBg: 'bg-rose-100',
        badgeText: 'text-rose-800',
        borderColor: 'border-rose-200',
      };
  }
}

export function validateArticle(article: Partial<Article>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!article.title || article.title.trim().length < 5) {
    errors.push('Judul artikel wajib diisi minimal 5 karakter.');
  }

  if (!article.summary || article.summary.trim().length < 10) {
    errors.push('Ringkasan artikel wajib diisi minimal 10 karakter.');
  }

  if (!article.category || article.category.trim().length === 0) {
    errors.push('Kategori artikel wajib dipilih.');
  }

  const validParagraphs = (article.contentParagraphs || []).filter((p) => p.trim().length > 0);
  if (validParagraphs.length === 0) {
    errors.push('Artikel wajib memiliki minimal 1 paragraf konten lengkap.');
  }

  const validTakeaways = (article.keyTakeaways || []).filter((t) => t.trim().length > 0);
  if (validTakeaways.length === 0) {
    errors.push('Artikel wajib memiliki minimal 1 poin inti (key takeaway).');
  }

  if (!article.author || article.author.trim().length === 0) {
    errors.push('Nama penulis artikel wajib diisi.');
  }

  if (!article.reviewer || article.reviewer.trim().length === 0) {
    errors.push('Dokter peninjau medis wajib diisi untuk akreditasi.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateDiseaseData(disease: Partial<Disease>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!disease.name || disease.name.trim().length < 3) {
    errors.push('Nama penyakit/kondisi wajib diisi minimal 3 karakter.');
  }

  if (!disease.category) {
    errors.push('Kategori penyakit wajib dipilih.');
  }

  if (!disease.summary || disease.summary.trim().length < 10) {
    errors.push('Deskripsi ringkas penyakit wajib diisi minimal 10 karakter.');
  }

  const allowed = disease.quickAllowed || [];
  if (allowed.filter((a) => a.trim().length > 0).length === 0) {
    errors.push('Minimal sertakan 1 makanan yang dianjurkan.');
  }

  const avoid = disease.quickAvoid || [];
  if (avoid.filter((a) => a.trim().length > 0).length === 0) {
    errors.push('Minimal sertakan 1 makanan yang dipantang.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateAdminCredentials(identity: string, pass: string): { isValid: boolean; error?: string } {
  const cleanId = identity.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!cleanId) {
    return { isValid: false, error: 'Email atau username admin tidak boleh kosong.' };
  }

  if (!cleanPass) {
    return { isValid: false, error: 'Password admin tidak boleh kosong.' };
  }

  if (
    (cleanId === 'admin' || cleanId === 'admin@hiho.id' || cleanId === 'editor@hiho.id') &&
    (cleanPass === 'admin123' || cleanPass === 'hiho2026' || cleanPass === 'password')
  ) {
    return { isValid: true };
  }

  if (cleanId.length >= 3 && cleanPass.length >= 6) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: 'Kredensial tidak valid. Gunakan demo: admin@hiho.id / admin123',
  };
}

export function validateActivityData(activity: Partial<ActivityMedia>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!activity.title || activity.title.trim().length < 3) {
    errors.push('Judul kegiatan wajib diisi minimal 3 karakter.');
  }

  if (!activity.imageUrl || activity.imageUrl.trim().length < 5) {
    errors.push('Foto kegiatan wajib diunggah atau memiliki URL valid.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}


