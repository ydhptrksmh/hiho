import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Article, Disease, FoodGuideline, SampleMealPlan } from '../types';

function readEnvVar(primaryKey: string, fallbackKey: string): string {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  const procEnv = typeof process !== 'undefined' ? process.env : undefined;

  return (
    metaEnv?.[primaryKey] ||
    metaEnv?.[fallbackKey] ||
    procEnv?.[primaryKey] ||
    procEnv?.[fallbackKey] ||
    ''
  ).trim();
}

export const supabaseUrl = readEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL');
export const supabaseAnonKey = readEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('MY_SUPABASE') &&
  !supabaseAnonKey.includes('MY_SUPABASE')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

export interface SupabaseErrorLike {
  code?: string | null;
  message?: string | null;
  details?: string | null;
  hint?: string | null;
}

export function isSchemaMissingError(error: SupabaseErrorLike | null | undefined): boolean {
  if (!error) return false;
  const code = (error.code || '').toUpperCase();
  const message = (error.message || '').toLowerCase();

  return (
    code === 'PGRST205' ||
    code === '42P01' ||
    message.includes('schema cache') ||
    message.includes('could not find the table') ||
    message.includes('does not exist')
  );
}

// ============================================================================
// Database Row Types & Bidirectional Mappers
// ============================================================================

export interface DiseaseRow {
  id: string;
  name: string;
  indonesian_name: string;
  category: string;
  category_label: string;
  icon_name: string;
  summary: string;
  pathophysiology: string;
  criteria: string | null;
  risk_factors: string[] | null;
  health_impacts: string[] | null;
  quick_allowed: string[] | null;
  quick_avoid: string[] | null;
  allowed_foods: FoodGuideline[] | null;
  avoid_foods: FoodGuideline[] | null;
  sample_meal_plan: SampleMealPlan | null;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ArticleRow {
  id: string;
  title: string;
  summary: string;
  category: string;
  reading_time: string;
  publish_date: string;
  author: string;
  reviewer: string;
  cover_gradient: string;
  image_url: string | null;
  raw_content: string | null;
  status: 'published' | 'draft' | null;
  key_takeaways: string[] | null;
  content_paragraphs: string[] | null;
  references: string[] | null;
  created_at?: string;
  updated_at?: string;
}

export function mapRowToDisease(row: DiseaseRow): Disease {
  return {
    id: row.id,
    name: row.name,
    indonesianName: row.indonesian_name || '',
    category: row.category || 'metabolik',
    categoryLabel: row.category_label || row.category || '',
    iconName: row.icon_name || '🩺',
    summary: row.summary || '',
    pathophysiology: row.pathophysiology || '',
    criteria: row.criteria || undefined,
    riskFactors: Array.isArray(row.risk_factors) ? row.risk_factors : [],
    healthImpacts: Array.isArray(row.health_impacts) ? row.health_impacts : [],
    quickAllowed: Array.isArray(row.quick_allowed) ? row.quick_allowed : [],
    quickAvoid: Array.isArray(row.quick_avoid) ? row.quick_avoid : [],
    allowedFoods: Array.isArray(row.allowed_foods) ? row.allowed_foods : [],
    avoidFoods: Array.isArray(row.avoid_foods) ? row.avoid_foods : [],
    sampleMealPlan: row.sample_meal_plan && typeof row.sample_meal_plan === 'object'
      ? row.sample_meal_plan
      : { breakfast: '', lunch: '', dinner: '' },
    imageUrl: row.image_url || undefined,
  };
}

export function mapDiseaseToRow(disease: Partial<Disease>): Partial<DiseaseRow> {
  const row: Partial<DiseaseRow> = {};

  if (disease.id !== undefined) row.id = disease.id;
  if (disease.name !== undefined) row.name = disease.name;
  if (disease.indonesianName !== undefined) row.indonesian_name = disease.indonesianName;
  if (disease.category !== undefined) row.category = String(disease.category);
  if (disease.categoryLabel !== undefined) row.category_label = disease.categoryLabel;
  if (disease.iconName !== undefined) row.icon_name = disease.iconName;
  if (disease.summary !== undefined) row.summary = disease.summary;
  if (disease.pathophysiology !== undefined) row.pathophysiology = disease.pathophysiology;
  if (disease.criteria !== undefined) row.criteria = disease.criteria || null;
  if (disease.riskFactors !== undefined) row.risk_factors = disease.riskFactors;
  if (disease.healthImpacts !== undefined) row.health_impacts = disease.healthImpacts;
  if (disease.quickAllowed !== undefined) row.quick_allowed = disease.quickAllowed;
  if (disease.quickAvoid !== undefined) row.quick_avoid = disease.quickAvoid;
  if (disease.allowedFoods !== undefined) row.allowed_foods = disease.allowedFoods;
  if (disease.avoidFoods !== undefined) row.avoid_foods = disease.avoidFoods;
  if (disease.sampleMealPlan !== undefined) row.sample_meal_plan = disease.sampleMealPlan;
  if (disease.imageUrl !== undefined) row.image_url = disease.imageUrl || null;

  return row;
}

export function mapRowToArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary || '',
    category: row.category || 'Panduan Pola Makan',
    readingTime: row.reading_time || '4 menit baca',
    publishDate: row.publish_date || '',
    author: row.author || 'Tim Dokter & Dietisien HIHO',
    reviewer: row.reviewer || 'dr. Sarah Daniswara, Sp.GK',
    coverGradient: row.cover_gradient || 'from-emerald-100 to-teal-50',
    imageUrl: row.image_url || undefined,
    rawContent: row.raw_content || undefined,
    status: row.status === 'draft' ? 'draft' : 'published',
    keyTakeaways: Array.isArray(row.key_takeaways) ? row.key_takeaways : [],
    contentParagraphs: Array.isArray(row.content_paragraphs) ? row.content_paragraphs : [],
    references: Array.isArray(row.references) ? row.references : [],
  };
}

export function mapArticleToRow(article: Partial<Article>): Partial<ArticleRow> {
  const row: Partial<ArticleRow> = {};

  if (article.id !== undefined) row.id = article.id;
  if (article.title !== undefined) row.title = article.title;
  if (article.summary !== undefined) row.summary = article.summary;
  if (article.category !== undefined) row.category = article.category;
  if (article.readingTime !== undefined) row.reading_time = article.readingTime;
  if (article.publishDate !== undefined) row.publish_date = article.publishDate;
  if (article.author !== undefined) row.author = article.author;
  if (article.reviewer !== undefined) row.reviewer = article.reviewer;
  if (article.coverGradient !== undefined) row.cover_gradient = article.coverGradient;
  if (article.imageUrl !== undefined) row.image_url = article.imageUrl || null;
  if (article.rawContent !== undefined) row.raw_content = article.rawContent || null;
  if (article.status !== undefined) row.status = article.status;
  if (article.keyTakeaways !== undefined) row.key_takeaways = article.keyTakeaways;
  if (article.contentParagraphs !== undefined) row.content_paragraphs = article.contentParagraphs;
  if (article.references !== undefined) row.references = article.references;

  return row;
}
