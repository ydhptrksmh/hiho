import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Disease, Article, DailyTip, AdminUser, AdminStats, ActivityMedia } from '../types';
import { diseasesData as defaultDiseases } from '../data/diseases';
import { articlesData as defaultArticles } from '../data/articles';
import { dailyNutritionTips as defaultTips } from '../data/nutritionTips';
import { defaultActivities } from '../data/activities';
import {
  supabase,
  isSupabaseConfigured,
  isSchemaMissingError,
  DiseaseRow,
  ArticleRow,
  mapRowToDisease,
  mapDiseaseToRow,
  mapRowToArticle,
  mapArticleToRow,
} from '../lib/supabase';

export interface CrudResult {
  success: boolean;
  error?: string;
}

interface DataContextType {
  // Public data state
  diseases: Disease[];
  articles: Article[];
  tips: DailyTip[];
  activities: ActivityMedia[];
  isLoadingData: boolean;
  isSchemaMissing: boolean;
  dataError: string | null;
  clearDataError: () => void;
  retrySupabaseSync: () => Promise<void>;

  // Diseases CRUD (Realtime Supabase-backed with graceful fallback)
  addDisease: (disease: Disease) => Promise<CrudResult>;
  updateDisease: (id: string, updated: Partial<Disease>) => Promise<CrudResult>;
  deleteDisease: (id: string) => Promise<CrudResult>;
  resetDiseases: () => Promise<CrudResult>;

  // Articles CRUD (Realtime Supabase-backed with graceful fallback)
  addArticle: (article: Article) => Promise<CrudResult>;
  updateArticle: (id: string, updated: Partial<Article>) => Promise<CrudResult>;
  deleteArticle: (id: string) => Promise<CrudResult>;
  resetArticles: () => Promise<CrudResult>;

  // Daily Tips CRUD
  addTip: (tip: DailyTip) => void;
  updateTip: (id: number | string, updated: Partial<DailyTip>) => void;
  deleteTip: (id: number | string) => void;
  toggleTipActive: (id: number | string) => void;
  resetTips: () => void;

  // Activity Media CRUD
  addActivity: (activity: ActivityMedia) => void;
  updateActivity: (id: string, updated: Partial<ActivityMedia>) => void;
  deleteActivity: (id: string) => void;
  resetActivities: () => void;

  // Admin Auth
  adminUser: AdminUser | null;
  isAdmin: boolean;
  login: (identity: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;

  // Admin Stats
  stats: AdminStats;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_DISEASES_KEY = 'hiho_diseases_data_v4';
const STORAGE_ARTICLES_KEY = 'hiho_articles_data_v4';
const STORAGE_TIPS_KEY = 'hiho_tips_data_v4';
const STORAGE_ACTIVITIES_KEY = 'hiho_activities_data_v6';
const STORAGE_ADMIN_KEY = 'hiho_admin_session_v4';

function loadFallbackDiseases(): Disease[] {
  try {
    const saved = localStorage.getItem(STORAGE_DISEASES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // fallback
  }
  return defaultDiseases;
}

function loadFallbackArticles(): Article[] {
  try {
    const saved = localStorage.getItem(STORAGE_ARTICLES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // fallback
  }
  return defaultArticles.map((a) => ({ ...a, status: a.status || 'published' }));
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Diseases State (starts with local fallback so the site never renders blank if tables aren't created yet)
  const [diseases, setDiseases] = useState<Disease[]>(loadFallbackDiseases);

  // Articles State (ensure default status is published)
  const [articles, setArticles] = useState<Article[]>(loadFallbackArticles);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(isSupabaseConfigured);
  const [isSchemaMissing, setIsSchemaMissing] = useState<boolean>(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const clearDataError = useCallback(() => setDataError(null), []);

  // Keep refs for safe rollback during optimistic mutations
  const diseasesRef = useRef<Disease[]>(diseases);
  const articlesRef = useRef<Article[]>(articles);

  useEffect(() => {
    diseasesRef.current = diseases;
  }, [diseases]);

  useEffect(() => {
    articlesRef.current = articles;
  }, [articles]);

  // Daily Tips State
  const [tips, setTips] = useState<DailyTip[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TIPS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return defaultTips.map((t) => ({ ...t, isActive: t.isActive ?? true }));
  });

  // Activity Media State
  const [activities, setActivities] = useState<ActivityMedia[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACTIVITIES_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return defaultActivities;
  });

  // Admin User State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ADMIN_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return null;
  });

  const loadSupabaseData = useCallback(async () => {
    const client = supabase;
    if (!client) {
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    try {
      const [diseasesRes, articlesRes] = await Promise.all([
        client.from('diseases').select('*').order('created_at', { ascending: false }),
        client.from('articles').select('*').order('created_at', { ascending: false }),
      ]);

      const missingDiseasesTable = isSchemaMissingError(diseasesRes.error);
      const missingArticlesTable = isSchemaMissingError(articlesRes.error);

      if (missingDiseasesTable || missingArticlesTable) {
        console.warn(
          'Tabel Supabase belum tersedia (PGRST205). Menggunakan data lokal sementara hingga script supabase/schema.sql dijalankan.'
        );
        setIsSchemaMissing(true);
        setDiseases(loadFallbackDiseases());
        setArticles(loadFallbackArticles());
        setDataError(null);
        return;
      }

      setIsSchemaMissing(false);

      if (diseasesRes.error) {
        console.warn('Gagal mengambil data penyakit dari Supabase:', diseasesRes.error.message);
        setDataError(`Gagal memuat data penyakit: ${diseasesRes.error.message}`);
      } else {
        const mappedDiseases = (diseasesRes.data as DiseaseRow[]).map(mapRowToDisease);
        setDiseases(mappedDiseases);
        setDataError(null);
      }

      if (articlesRes.error) {
        console.warn('Gagal mengambil data artikel dari Supabase:', articlesRes.error.message);
        setDataError(`Gagal memuat data artikel: ${articlesRes.error.message}`);
      } else {
        const mappedArticles = (articlesRes.data as ArticleRow[]).map(mapRowToArticle);
        setArticles(mappedArticles);
        if (!diseasesRes.error) {
          setDataError(null);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal terhubung ke Supabase';
      console.warn('Koneksi Supabase gagal, menggunakan data lokal:', msg);
      setDataError(msg);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Fetch initial Diseases & Articles from Supabase
  useEffect(() => {
    loadSupabaseData();
  }, [loadSupabaseData]);

  // Subscribe to Realtime changes only once tables are confirmed available
  useEffect(() => {
    const client = supabase;
    if (!client || isSchemaMissing) {
      return;
    }

    const channel = client
      .channel('hiho-realtime-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'diseases' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            const inserted = mapRowToDisease(payload.new as DiseaseRow);
            setDiseases((prev) => {
              const exists = prev.some((d) => d.id === inserted.id);
              return exists
                ? prev.map((d) => (d.id === inserted.id ? inserted : d))
                : [inserted, ...prev];
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const updated = mapRowToDisease(payload.new as DiseaseRow);
            setDiseases((prev) => {
              const exists = prev.some((d) => d.id === updated.id);
              return exists
                ? prev.map((d) => (d.id === updated.id ? updated : d))
                : [updated, ...prev];
            });
          } else if (payload.eventType === 'DELETE' && payload.old) {
            const deletedId = (payload.old as { id?: string }).id;
            if (deletedId) {
              setDiseases((prev) => prev.filter((d) => d.id !== deletedId));
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'articles' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            const inserted = mapRowToArticle(payload.new as ArticleRow);
            setArticles((prev) => {
              const exists = prev.some((a) => a.id === inserted.id);
              return exists
                ? prev.map((a) => (a.id === inserted.id ? inserted : a))
                : [inserted, ...prev];
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const updated = mapRowToArticle(payload.new as ArticleRow);
            setArticles((prev) => {
              const exists = prev.some((a) => a.id === updated.id);
              return exists
                ? prev.map((a) => (a.id === updated.id ? updated : a))
                : [updated, ...prev];
            });
          } else if (payload.eventType === 'DELETE' && payload.old) {
            const deletedId = (payload.old as { id?: string }).id;
            if (deletedId) {
              setArticles((prev) => prev.filter((a) => a.id !== deletedId));
            }
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [isSchemaMissing]);

  // Sync Diseases to LocalStorage when running in offline/fallback or schema-pending mode
  useEffect(() => {
    if (isSupabaseConfigured && !isSchemaMissing) return;
    try {
      localStorage.setItem(STORAGE_DISEASES_KEY, JSON.stringify(diseases));
    } catch (e) {
      console.warn('Failed to sync diseases:', e);
    }
  }, [diseases, isSchemaMissing]);

  // Sync Articles to LocalStorage when running in offline/fallback or schema-pending mode
  useEffect(() => {
    if (isSupabaseConfigured && !isSchemaMissing) return;
    try {
      localStorage.setItem(STORAGE_ARTICLES_KEY, JSON.stringify(articles));
    } catch (e) {
      console.warn('Failed to sync articles:', e);
    }
  }, [articles, isSchemaMissing]);

  // Sync Tips to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TIPS_KEY, JSON.stringify(tips));
    } catch (e) {
      console.warn('Failed to sync tips:', e);
    }
  }, [tips]);

  // Sync Activities to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACTIVITIES_KEY, JSON.stringify(activities));
    } catch (e) {
      console.warn('Failed to sync activities:', e);
    }
  }, [activities]);

  // Sync Admin User
  useEffect(() => {
    try {
      if (adminUser) {
        localStorage.setItem(STORAGE_ADMIN_KEY, JSON.stringify(adminUser));
      } else {
        localStorage.removeItem(STORAGE_ADMIN_KEY);
      }
    } catch (e) {
      console.warn('Failed to sync admin session:', e);
    }
  }, [adminUser]);

  // Diseases CRUD Implementations
  const addDisease = async (newDisease: Disease): Promise<CrudResult> => {
    const previous = diseasesRef.current;
    setDiseases((prev) => [newDisease, ...prev]);

    if (!supabase || isSchemaMissing) {
      return { success: true };
    }

    const rowPayload = mapDiseaseToRow(newDisease);
    const { data, error } = await supabase
      .from('diseases')
      .insert(rowPayload)
      .select()
      .single();

    if (error) {
      if (isSchemaMissingError(error)) {
        setIsSchemaMissing(true);
        return { success: true };
      }
      console.warn('Supabase addDisease error:', error.message);
      setDiseases(previous);
      setDataError(`Gagal menambah penyakit: ${error.message}`);
      return { success: false, error: error.message };
    }

    if (data) {
      const synced = mapRowToDisease(data as DiseaseRow);
      setDiseases((prev) => prev.map((d) => (d.id === synced.id ? synced : d)));
    }
    return { success: true };
  };

  const updateDisease = async (id: string, updated: Partial<Disease>): Promise<CrudResult> => {
    const previous = diseasesRef.current;
    setDiseases((prev) => prev.map((d) => (d.id === id ? { ...d, ...updated } : d)));

    if (!supabase || isSchemaMissing) {
      return { success: true };
    }

    const rowPayload = mapDiseaseToRow(updated);
    const { data, error } = await supabase
      .from('diseases')
      .update(rowPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (isSchemaMissingError(error)) {
        setIsSchemaMissing(true);
        return { success: true };
      }
      console.warn('Supabase updateDisease error:', error.message);
      setDiseases(previous);
      setDataError(`Gagal memperbarui penyakit: ${error.message}`);
      return { success: false, error: error.message };
    }

    if (data) {
      const synced = mapRowToDisease(data as DiseaseRow);
      setDiseases((prev) => prev.map((d) => (d.id === synced.id ? synced : d)));
    }
    return { success: true };
  };

  const deleteDisease = async (id: string): Promise<CrudResult> => {
    const previous = diseasesRef.current;
    setDiseases((prev) => prev.filter((d) => d.id !== id));

    if (!supabase || isSchemaMissing) {
      return { success: true };
    }

    const { error } = await supabase.from('diseases').delete().eq('id', id);

    if (error) {
      if (isSchemaMissingError(error)) {
        setIsSchemaMissing(true);
        return { success: true };
      }
      console.warn('Supabase deleteDisease error:', error.message);
      setDiseases(previous);
      setDataError(`Gagal menghapus penyakit: ${error.message}`);
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const resetDiseases = async (): Promise<CrudResult> => {
    const previous = diseasesRef.current;
    setDiseases(defaultDiseases);

    if (!supabase) {
      return { success: true };
    }

    const rows = defaultDiseases.map((d) => mapDiseaseToRow(d));
    const { data, error } = await supabase
      .from('diseases')
      .upsert(rows, { onConflict: 'id' })
      .select();

    if (error) {
      if (isSchemaMissingError(error)) {
        setIsSchemaMissing(true);
        return { success: true };
      }
      console.warn('Supabase resetDiseases error:', error.message);
      setDiseases(previous);
      setDataError(`Gagal mereset data penyakit: ${error.message}`);
      return { success: false, error: error.message };
    }

    setIsSchemaMissing(false);
    if (data) {
      setDiseases((data as DiseaseRow[]).map(mapRowToDisease));
    }
    return { success: true };
  };

  // Articles CRUD Implementations
  const addArticle = async (newArticle: Article): Promise<CrudResult> => {
    const withStatus: Article = {
      ...newArticle,
      status: newArticle.status || 'published',
    };
    const previous = articlesRef.current;
    setArticles((prev) => [withStatus, ...prev]);

    if (!supabase || isSchemaMissing) {
      return { success: true };
    }

    const rowPayload = mapArticleToRow(withStatus);
    const { data, error } = await supabase
      .from('articles')
      .insert(rowPayload)
      .select()
      .single();

    if (error) {
      if (isSchemaMissingError(error)) {
        setIsSchemaMissing(true);
        return { success: true };
      }
      console.warn('Supabase addArticle error:', error.message);
      setArticles(previous);
      setDataError(`Gagal menerbitkan artikel: ${error.message}`);
      return { success: false, error: error.message };
    }

    if (data) {
      const synced = mapRowToArticle(data as ArticleRow);
      setArticles((prev) => prev.map((a) => (a.id === synced.id ? synced : a)));
    }
    return { success: true };
  };

  const updateArticle = async (id: string, updated: Partial<Article>): Promise<CrudResult> => {
    const previous = articlesRef.current;
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));

    if (!supabase || isSchemaMissing) {
      return { success: true };
    }

    const rowPayload = mapArticleToRow(updated);
    const { data, error } = await supabase
      .from('articles')
      .update(rowPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (isSchemaMissingError(error)) {
        setIsSchemaMissing(true);
        return { success: true };
      }
      console.warn('Supabase updateArticle error:', error.message);
      setArticles(previous);
      setDataError(`Gagal memperbarui artikel: ${error.message}`);
      return { success: false, error: error.message };
    }

    if (data) {
      const synced = mapRowToArticle(data as ArticleRow);
      setArticles((prev) => prev.map((a) => (a.id === synced.id ? synced : a)));
    }
    return { success: true };
  };

  const deleteArticle = async (id: string): Promise<CrudResult> => {
    const previous = articlesRef.current;
    setArticles((prev) => prev.filter((a) => a.id !== id));

    if (!supabase || isSchemaMissing) {
      return { success: true };
    }

    const { error } = await supabase.from('articles').delete().eq('id', id);

    if (error) {
      if (isSchemaMissingError(error)) {
        setIsSchemaMissing(true);
        return { success: true };
      }
      console.warn('Supabase deleteArticle error:', error.message);
      setArticles(previous);
      setDataError(`Gagal menghapus artikel: ${error.message}`);
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const resetArticles = async (): Promise<CrudResult> => {
    const seeded = defaultArticles.map((a) => ({ ...a, status: a.status || 'published' }));
    const previous = articlesRef.current;
    setArticles(seeded);

    if (!supabase) {
      return { success: true };
    }

    const rows = seeded.map((a) => mapArticleToRow(a));
    const { data, error } = await supabase
      .from('articles')
      .upsert(rows, { onConflict: 'id' })
      .select();

    if (error) {
      if (isSchemaMissingError(error)) {
        setIsSchemaMissing(true);
        return { success: true };
      }
      console.warn('Supabase resetArticles error:', error.message);
      setArticles(previous);
      setDataError(`Gagal mereset data artikel: ${error.message}`);
      return { success: false, error: error.message };
    }

    setIsSchemaMissing(false);
    if (data) {
      setArticles((data as ArticleRow[]).map(mapRowToArticle));
    }
    return { success: true };
  };

  // Daily Tips CRUD Implementations
  const addTip = (newTip: DailyTip) => {
    const withActive = {
      ...newTip,
      isActive: newTip.isActive ?? true,
      date:
        newTip.date ||
        new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
    };
    setTips((prev) => [withActive, ...prev]);
  };

  const updateTip = (id: number | string, updated: Partial<DailyTip>) => {
    setTips((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  };

  const deleteTip = (id: number | string) => {
    setTips((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTipActive = (id: number | string) => {
    setTips((prev) => prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t)));
  };

  const resetTips = () => {
    setTips(defaultTips.map((t) => ({ ...t, isActive: t.isActive ?? true })));
  };

  // Activity Media CRUD
  const addActivity = (activity: ActivityMedia) => {
    setActivities((prev) => [activity, ...prev]);
  };

  const updateActivity = (id: string, updated: Partial<ActivityMedia>) => {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const resetActivities = () => {
    setActivities(defaultActivities);
  };

  // Admin Authentication
  const login = (identity: string, pass: string): { success: boolean; error?: string } => {
    const cleanId = identity.trim();
    const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
    const procEnv = typeof process !== 'undefined' ? process.env : undefined;

    const validUser =
      metaEnv?.VITE_ADMIN_USER ||
      metaEnv?.NEXT_PUBLIC_ADMIN_USER ||
      procEnv?.VITE_ADMIN_USER ||
      procEnv?.NEXT_PUBLIC_ADMIN_USER ||
      'admin@hiho.id';

    const validPass =
      metaEnv?.VITE_ADMIN_PASS ||
      metaEnv?.NEXT_PUBLIC_ADMIN_PASS ||
      procEnv?.VITE_ADMIN_PASS ||
      procEnv?.NEXT_PUBLIC_ADMIN_PASS ||
      'HihoHealth2026!';

    if (cleanId === validUser && pass === validPass) {
      const user: AdminUser = {
        username: cleanId.includes('@') ? cleanId.split('@')[0] : cleanId,
        name: 'dr. Sarah Daniswara (Admin Redaksi)',
        role: 'Super Admin & Tim Medis',
        email: cleanId.includes('@') ? cleanId : 'admin@hiho.id',
        token: `hiho_token_${Date.now()}`,
      };
      setAdminUser(user);
      return { success: true };
    }

    return {
      success: false,
      error: 'Username atau password yang Anda masukkan salah!',
    };
  };

  const logout = () => {
    setAdminUser(null);
  };

  // Stats calculation
  const stats: AdminStats = {
    totalDiseases: diseases.length,
    totalArticles: articles.length,
    publishedArticles: articles.filter((a) => a.status !== 'draft').length,
    draftArticles: articles.filter((a) => a.status === 'draft').length,
    totalTips: tips.length,
    activeTips: tips.filter((t) => t.isActive !== false).length,
    totalActivities: activities.length,
  };

  return (
    <DataContext.Provider
      value={{
        diseases,
        articles,
        tips,
        activities,
        isLoadingData,
        isSchemaMissing,
        dataError,
        clearDataError,
        retrySupabaseSync: loadSupabaseData,
        addDisease,
        updateDisease,
        deleteDisease,
        resetDiseases,
        addArticle,
        updateArticle,
        deleteArticle,
        resetArticles,
        addTip,
        updateTip,
        deleteTip,
        toggleTipActive,
        resetTips,
        addActivity,
        updateActivity,
        deleteActivity,
        resetActivities,
        adminUser,
        isAdmin: Boolean(adminUser),
        login,
        logout,
        stats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
