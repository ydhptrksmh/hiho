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

const STORAGE_TIPS_KEY = 'hiho_tips_data_v4';
const STORAGE_ACTIVITIES_KEY = 'hiho_activities_data_v6';
const STORAGE_ADMIN_KEY = 'hiho_admin_session_v4';

const SUPABASE_KEY_MISSING_MSG =
  'Koneksi Supabase belum aktif: ganti PASTE_PUBLISHABLE_KEY_LENGKAP_DISINI pada src/lib/supabase.ts dengan Publishable/Anon Key Supabase Anda.';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Single Source of Truth: always starts empty and loads directly from Supabase
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(isSupabaseConfigured);
  const [isSchemaMissing, setIsSchemaMissing] = useState<boolean>(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const clearDataError = useCallback(() => setDataError(null), []);

  // Keep refs for safe rollback during optimistic mutations, auto-seed deduplication, and refresh throttling
  const diseasesRef = useRef<Disease[]>(diseases);
  const articlesRef = useRef<Article[]>(articles);
  const autoSeedInFlightRef = useRef<boolean>(false);
  const fetchInFlightRef = useRef<boolean>(false);
  const lastFetchAtRef = useRef<number>(0);

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

  const loadSupabaseData = useCallback(async (options?: { silent?: boolean }) => {
    if (!isSupabaseConfigured) {
      setIsLoadingData(false);
      setDataError(SUPABASE_KEY_MISSING_MSG);
      return;
    }

    if (fetchInFlightRef.current) {
      return;
    }

    fetchInFlightRef.current = true;
    if (!options?.silent) {
      setIsLoadingData(true);
    }

    try {
      const [diseasesRes, articlesRes] = await Promise.all([
        supabase.from('diseases').select('*').order('created_at', { ascending: false }),
        supabase.from('articles').select('*').order('created_at', { ascending: false }),
      ]);

      const missingDiseasesTable = isSchemaMissingError(diseasesRes.error);
      const missingArticlesTable = isSchemaMissingError(articlesRes.error);

      if (missingDiseasesTable || missingArticlesTable) {
        const missingMsg =
          'Tabel public.diseases atau public.articles belum tersedia di Supabase. Jalankan script supabase/schema.sql di SQL Editor Supabase Anda.';
        console.error(missingMsg);
        setIsSchemaMissing(true);
        setDataError(missingMsg);
        return;
      }

      setIsSchemaMissing(false);
      let nextError: string | null = null;

      const diseaseRows = (!diseasesRes.error && (diseasesRes.data as DiseaseRow[])) || [];
      const articleRows = (!articlesRes.error && (articlesRes.data as ArticleRow[])) || [];

      const needSeedDiseases = !diseasesRes.error && diseaseRows.length === 0;
      const needSeedArticles = !articlesRes.error && articleRows.length === 0;

      if ((needSeedDiseases || needSeedArticles) && !autoSeedInFlightRef.current) {
        autoSeedInFlightRef.current = true;
        const seededDefaultArticles = defaultArticles.map((a) => ({
          ...a,
          status: a.status || 'published',
        }));

        const [seededDiseasesRes, seededArticlesRes] = await Promise.all([
          needSeedDiseases
            ? supabase
                .from('diseases')
                .upsert(defaultDiseases.map((d) => mapDiseaseToRow(d)), { onConflict: 'id' })
                .select()
            : Promise.resolve(null),
          needSeedArticles
            ? supabase
                .from('articles')
                .upsert(seededDefaultArticles.map((a) => mapArticleToRow(a)), { onConflict: 'id' })
                .select()
            : Promise.resolve(null),
        ]);

        if (needSeedDiseases) {
          if (seededDiseasesRes?.error) {
            console.error('Auto-seed diseases Supabase gagal:', seededDiseasesRes.error.message);
            nextError = `Gagal auto-seed data penyakit ke Supabase: ${seededDiseasesRes.error.message}`;
          } else if (seededDiseasesRes?.data) {
            setDiseases((seededDiseasesRes.data as DiseaseRow[]).map(mapRowToDisease));
          }
        } else if (!diseasesRes.error) {
          setDiseases(diseaseRows.map(mapRowToDisease));
        }

        if (needSeedArticles) {
          if (seededArticlesRes?.error) {
            console.error('Auto-seed articles Supabase gagal:', seededArticlesRes.error.message);
            nextError =
              nextError || `Gagal auto-seed data artikel ke Supabase: ${seededArticlesRes.error.message}`;
          } else if (seededArticlesRes?.data) {
            setArticles((seededArticlesRes.data as ArticleRow[]).map(mapRowToArticle));
          }
        } else if (!articlesRes.error) {
          setArticles(articleRows.map(mapRowToArticle));
        }
      } else {
        if (!diseasesRes.error) {
          setDiseases(diseaseRows.map(mapRowToDisease));
        }
        if (!articlesRes.error) {
          setArticles(articleRows.map(mapRowToArticle));
        }
      }

      if (diseasesRes.error) {
        console.error('Gagal mengambil data penyakit dari Supabase:', diseasesRes.error.message);
        nextError = nextError || `Gagal memuat data penyakit dari Supabase: ${diseasesRes.error.message}`;
      }
      if (articlesRes.error) {
        console.error('Gagal mengambil data artikel dari Supabase:', articlesRes.error.message);
        nextError = nextError || `Gagal memuat data artikel dari Supabase: ${articlesRes.error.message}`;
      }

      setDataError(nextError);
      lastFetchAtRef.current = Date.now();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal terhubung ke Supabase';
      console.error('Koneksi Supabase gagal:', msg);
      setDataError(`Gagal terhubung ke Supabase: ${msg}`);
    } finally {
      autoSeedInFlightRef.current = false;
      fetchInFlightRef.current = false;
      setIsLoadingData(false);
    }
  }, []);

  // Fetch initial Diseases & Articles from Supabase (with automatic empty-table seeding)
  useEffect(() => {
    loadSupabaseData();
  }, [loadSupabaseData]);

  // Auto-refresh from Supabase when browser tab regains focus or becomes visible across devices
  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    const handleSyncOnResume = () => {
      if (document.visibilityState && document.visibilityState !== 'visible') {
        return;
      }
      if (Date.now() - lastFetchAtRef.current < 1500) {
        return;
      }
      void loadSupabaseData({ silent: true });
    };

    window.addEventListener('focus', handleSyncOnResume);
    document.addEventListener('visibilitychange', handleSyncOnResume);

    return () => {
      window.removeEventListener('focus', handleSyncOnResume);
      document.removeEventListener('visibilitychange', handleSyncOnResume);
    };
  }, [loadSupabaseData]);

  // Subscribe to Realtime changes only once tables are confirmed available
  useEffect(() => {
    if (!isSupabaseConfigured || isSchemaMissing) {
      return;
    }

    const client = supabase;

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

  // Diseases CRUD Implementations (Strict Supabase Single Source of Truth)
  const addDisease = async (newDisease: Disease): Promise<CrudResult> => {
    if (!isSupabaseConfigured) {
      setDataError(SUPABASE_KEY_MISSING_MSG);
      return { success: false, error: SUPABASE_KEY_MISSING_MSG };
    }

    const previous = diseasesRef.current;
    setDiseases((prev) => [newDisease, ...prev]);

    const rowPayload = mapDiseaseToRow(newDisease);
    const { data, error } = await supabase
      .from('diseases')
      .upsert(rowPayload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      if (isSchemaMissingError(error)) {
        setIsSchemaMissing(true);
      }
      console.error('Supabase addDisease error:', error.message);
      setDiseases(previous);
      const errMsg = `Gagal menyimpan penyakit ke Supabase: ${error.message}`;
      setDataError(errMsg);
      return { success: false, error: errMsg };
    }

    setIsSchemaMissing(false);
    setDataError(null);
    if (data) {
      const synced = mapRowToDisease(data as DiseaseRow);
      setDiseases((prev) => prev.map((d) => (d.id === synced.id ? synced : d)));
    }
    return { success: true };
  };

  const updateDisease = async (id: string, updated: Partial<Disease>): Promise<CrudResult> => {
    if (!isSupabaseConfigured) {
      setDataError(SUPABASE_KEY_MISSING_MSG);
      return { success: false, error: SUPABASE_KEY_MISSING_MSG };
    }

    const previous = diseasesRef.current;
    setDiseases((prev) => prev.map((d) => (d.id === id ? { ...d, ...updated } : d)));

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
      }
      console.error('Supabase updateDisease error:', error.message);
      setDiseases(previous);
      const errMsg = `Gagal memperbarui penyakit di Supabase: ${error.message}`;
      setDataError(errMsg);
      return { success: false, error: errMsg };
    }

    setIsSchemaMissing(false);
    setDataError(null);
    if (data) {
      const synced = mapRowToDisease(data as DiseaseRow);
      setDiseases((prev) => prev.map((d) => (d.id === synced.id ? synced : d)));
    }
    return { success: true };
  };

  const deleteDisease = async (id: string): Promise<CrudResult> => {
    if (!isSupabaseConfigured) {
      setDataError(SUPABASE_KEY_MISSING_MSG);
      return { success: false, error: SUPABASE_KEY_MISSING_MSG };
    }

    const previous = diseasesRef.current;
    setDiseases((prev) => prev.filter((d) => d.id !== id));

    const { error } = await supabase.from('diseases').delete().eq('id', id);

    if (error) {
      if (isSchemaMissingError(error)) {
        setIsSchemaMissing(true);
      }
      console.error('Supabase deleteDisease error:', error.message);
      setDiseases(previous);
      const errMsg = `Gagal menghapus penyakit di Supabase: ${error.message}`;
      setDataError(errMsg);
      return { success: false, error: errMsg };
    }

    setIsSchemaMissing(false);
    setDataError(null);
    return { success: true };
  };

  const resetDiseases = async (): Promise<CrudResult> => {
    if (!isSupabaseConfigured) {
      setDataError(SUPABASE_KEY_MISSING_MSG);
      return { success: false, error: SUPABASE_KEY_MISSING_MSG };
    }

    const previous = diseasesRef.current;
    const rows = defaultDiseases.map((d) => mapDiseaseToRow(d));
    const { data, error } = await supabase
      .from('diseases')
      .upsert(rows, { onConflict: 'id' })
      .select();

    if (error) {
      if (isSchemaMissingError(error)) {
        setIsSchemaMissing(true);
      }
      console.error('Supabase resetDiseases error:', error.message);
      setDiseases(previous);
      const errMsg = `Gagal mereset data penyakit di Supabase: ${error.message}`;
      setDataError(errMsg);
      return { success: false, error: errMsg };
    }

    setIsSchemaMissing(false);
    setDataError(null);
    if (data) {
      setDiseases((data as DiseaseRow[]).map(mapRowToDisease));
    }
    return { success: true };
  };

  // Articles CRUD Implementations (Strict Supabase Single Source of Truth)
  const addArticle = async (newArticle: Article): Promise<CrudResult> => {
    if (!isSupabaseConfigured) {
      setDataError(SUPABASE_KEY_MISSING_MSG);
      return { success: false, error: SUPABASE_KEY_MISSING_MSG };
    }

    const withStatus: Article = {
      ...newArticle,
      status: newArticle.status || 'published',
    };
    const previous = articlesRef.current;
    setArticles((prev) => [withStatus, ...prev]);

    const rowPayload = mapArticleToRow(withStatus);
    const { data, error } = await supabase
      .from('articles')
      .upsert(rowPayload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      if (isSchemaMissingError(error)) {
        setIsSchemaMissing(true);
      }
      console.error('Supabase addArticle error:', error.message);
      setArticles(previous);
      const errMsg = `Gagal menerbitkan artikel ke Supabase: ${error.message}`;
      setDataError(errMsg);
      return { success: false, error: errMsg };
    }

    setIsSchemaMissing(false);
    setDataError(null);
    if (data) {
      const synced = mapRowToArticle(data as ArticleRow);
      setArticles((prev) => prev.map((a) => (a.id === synced.id ? synced : a)));
    }
    return { success: true };
  };

  const updateArticle = async (id: string, updated: Partial<Article>): Promise<CrudResult> => {
    if (!isSupabaseConfigured) {
      setDataError(SUPABASE_KEY_MISSING_MSG);
      return { success: false, error: SUPABASE_KEY_MISSING_MSG };
    }

    const previous = articlesRef.current;
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));

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
      }
      console.error('Supabase updateArticle error:', error.message);
      setArticles(previous);
      const errMsg = `Gagal memperbarui artikel di Supabase: ${error.message}`;
      setDataError(errMsg);
      return { success: false, error: errMsg };
    }

    setIsSchemaMissing(false);
    setDataError(null);
    if (data) {
      const synced = mapRowToArticle(data as ArticleRow);
      setArticles((prev) => prev.map((a) => (a.id === synced.id ? synced : a)));
    }
    return { success: true };
  };

  const deleteArticle = async (id: string): Promise<CrudResult> => {
    if (!isSupabaseConfigured) {
      setDataError(SUPABASE_KEY_MISSING_MSG);
      return { success: false, error: SUPABASE_KEY_MISSING_MSG };
    }

    const previous = articlesRef.current;
    setArticles((prev) => prev.filter((a) => a.id !== id));

    const { error } = await supabase.from('articles').delete().eq('id', id);

    if (error) {
      if (isSchemaMissingError(error)) {
        setIsSchemaMissing(true);
      }
      console.error('Supabase deleteArticle error:', error.message);
      setArticles(previous);
      const errMsg = `Gagal menghapus artikel di Supabase: ${error.message}`;
      setDataError(errMsg);
      return { success: false, error: errMsg };
    }

    setIsSchemaMissing(false);
    setDataError(null);
    return { success: true };
  };

  const resetArticles = async (): Promise<CrudResult> => {
    if (!isSupabaseConfigured) {
      setDataError(SUPABASE_KEY_MISSING_MSG);
      return { success: false, error: SUPABASE_KEY_MISSING_MSG };
    }

    const seeded = defaultArticles.map((a) => ({ ...a, status: a.status || 'published' }));
    const previous = articlesRef.current;
    const rows = seeded.map((a) => mapArticleToRow(a));
    const { data, error } = await supabase
      .from('articles')
      .upsert(rows, { onConflict: 'id' })
      .select();

    if (error) {
      if (isSchemaMissingError(error)) {
        setIsSchemaMissing(true);
      }
      console.error('Supabase resetArticles error:', error.message);
      setArticles(previous);
      const errMsg = `Gagal mereset data artikel di Supabase: ${error.message}`;
      setDataError(errMsg);
      return { success: false, error: errMsg };
    }

    setIsSchemaMissing(false);
    setDataError(null);
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
