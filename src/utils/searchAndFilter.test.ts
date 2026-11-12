import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterDiseasesByCategory,
  searchDiseases,
  searchFoods,
  searchGlobal,
  getStatusDetails,
  validateArticle,
  validateDiseaseData,
  validateAdminCredentials,
  validateActivityData,
} from './searchAndFilter';

test('validateDiseaseData checks required fields correctly', () => {
  const invalid = validateDiseaseData({ name: 'A' });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.length >= 2);

  const valid = validateDiseaseData({
    name: 'Asma Bronkial',
    category: 'pencernaan',
    summary: 'Kondisi peradangan saluran napas dengan pantangan alergen pangan.',
    quickAllowed: ['Sayur bayam', 'Jahe hangat'],
    quickAvoid: ['Pengawet sulfit', 'Minuman es dingin'],
  });
  assert.equal(valid.isValid, true);
  assert.equal(valid.errors.length, 0);
});

test('validateAdminCredentials accepts valid production credentials and rejects empty/old demo', () => {
  assert.equal(validateAdminCredentials('', '').isValid, false);
  assert.equal(validateAdminCredentials('admin@hiho.id', 'admin123').isValid, false);
  assert.equal(validateAdminCredentials('admin', 'password').isValid, false);
  assert.equal(validateAdminCredentials('no', '12').isValid, false);
  const valid = validateAdminCredentials('admin@hiho.id', 'HihoHealth2026!');
  assert.equal(valid.isValid, true);
  const invalid = validateAdminCredentials('admin@hiho.id', 'wrongpass');
  assert.equal(invalid.isValid, false);
  assert.equal(invalid.error, 'Username atau password yang Anda masukkan salah!');
});

import { diseasesData } from '../data/diseases';
import { articlesData } from '../data/articles';
import { foodDatabase } from '../data/foodDatabase';

test('filterDiseasesByCategory returns all items when category is "semua"', () => {
  const result = filterDiseasesByCategory(diseasesData, 'semua');
  assert.equal(result.length, diseasesData.length);
});

test('filterDiseasesByCategory filters correctly by category', () => {
  const metabolik = filterDiseasesByCategory(diseasesData, 'metabolik');
  assert.ok(metabolik.length > 0);
  assert.ok(metabolik.every((d) => d.category === 'metabolik'));

  const pencernaan = filterDiseasesByCategory(diseasesData, 'pencernaan');
  assert.ok(pencernaan.length > 0);
  assert.ok(pencernaan.every((d) => d.category === 'pencernaan'));
});

test('searchDiseases finds diseases by name or symptoms/food keywords', () => {
  const diabetesMatch = searchDiseases(diseasesData, 'diabetes');
  assert.ok(diabetesMatch.length >= 1);
  assert.equal(diabetesMatch[0].id, 'diabetes-melitus');

  const foodKeywordMatch = searchDiseases(diseasesData, 'shirataki');
  assert.ok(foodKeywordMatch.length >= 1);
  assert.equal(foodKeywordMatch[0].id, 'diabetes-melitus');
});

test('searchFoods finds food items by name and traffic light notes', () => {
  const kembung = searchFoods(foodDatabase, 'kembung');
  assert.equal(kembung.length, 1);
  assert.equal(kembung[0].name, 'Ikan Kembung Panggang / Pepes');

  const emping = searchFoods(foodDatabase, 'emping');
  assert.equal(emping.length, 1);
  assert.equal(emping[0].gout.status, 'avoid');
});

test('searchGlobal combines diseases, articles, and food items accurately', () => {
  const results = searchGlobal('asam urat', diseasesData, articlesData, foodDatabase);
  assert.ok(results.totalMatches > 0);
  assert.ok(results.diseases.some((d) => d.id === 'asam-urat'));
  assert.ok(results.articles.some((a) => a.id === 'mitos-fakta-asam-urat'));
});

test('getStatusDetails returns correct styles and labels', () => {
  const safe = getStatusDetails('safe');
  assert.equal(safe.label, 'Aman / Dianjurkan');
  assert.equal(safe.badgeBg, 'bg-emerald-100');

  const avoid = getStatusDetails('avoid');
  assert.equal(avoid.label, 'Hindari / Pantang');
  assert.equal(avoid.badgeBg, 'bg-rose-100');
});

test('validateArticle rejects incomplete article and accepts complete article', () => {
  const invalid = validateArticle({ title: 'Kecil' });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.length > 0);

  const valid = validateArticle({
    title: 'Panduan Menu Rendah Purin untuk Sendi Sehat',
    summary: 'Rekomendasi pangan segar bebas jeroan untuk menurunkan asam urat.',
    category: 'Panduan Pola Makan',
    contentParagraphs: ['Paragraf edukasi lengkap mengenai purin.'],
    keyTakeaways: ['Poin utama diet sendi.'],
    author: 'dr. Sarah Daniswara, Sp.GK',
    reviewer: 'dr. Hendra Wicaksono, Sp.PD-KR',
  });
  assert.equal(valid.isValid, true);
  assert.equal(valid.errors.length, 0);
});

import { generateFoodExplanation, PRESET_CATEGORIES, PRESET_EMOJIS } from './nutritionAutoHelper';

test('nutritionAutoHelper includes all 10 required categories and 20 emojis', () => {
  assert.equal(PRESET_CATEGORIES.length, 10);
  assert.ok(PRESET_CATEGORIES.includes('Metabolik & Gula Darah'));
  assert.ok(PRESET_CATEGORIES.includes('Jantung & Pembuluh Darah'));
  assert.ok(PRESET_CATEGORIES.includes('Pencernaan & Lambung'));
  assert.ok(PRESET_CATEGORIES.includes('Sendi & Tulang'));
  assert.ok(PRESET_CATEGORIES.includes('Ginjal & Saluran Kemih'));
  assert.ok(PRESET_CATEGORIES.includes('Pernapasan'));
  assert.ok(PRESET_CATEGORIES.includes('Kolesterol & Lemak'));
  assert.ok(PRESET_CATEGORIES.includes('Ibu & Anak'));
  assert.ok(PRESET_CATEGORIES.includes('Lansia'));
  assert.ok(PRESET_CATEGORIES.includes('Gizi & Nutrisi Umum'));

  assert.equal(PRESET_EMOJIS.length, 20);
  assert.ok(PRESET_EMOJIS.includes('🩸'));
  assert.ok(PRESET_EMOJIS.includes('🫀'));
  assert.ok(PRESET_EMOJIS.includes('🥑'));
});

test('generateFoodExplanation generates accurate clinical explanations in AUTO mode', () => {
  const allowedSpinach = generateFoodExplanation('Bayam kukus', true, 'Hipertensi', 'Jantung');
  assert.ok(allowedSpinach.detail.length > 10);
  assert.ok(allowedSpinach.category.includes('Sayuran') || allowedSpinach.category.includes('Serat'));

  const allowedFish = generateFoodExplanation('Ikan kembung bakar', true, 'Hipertensi', 'Jantung');
  assert.ok(allowedFish.detail.includes('Omega-3') || allowedFish.detail.includes('anti-inflamasi'));

  const avoidSalt = generateFoodExplanation('Ikan asin goreng', false, 'Hipertensi', 'Jantung');
  assert.ok(avoidSalt.category.includes('Natrium') || avoidSalt.category.includes('Sodium'));

  const avoidGoutOrgan = generateFoodExplanation('Jeroan hati sapi', false, 'Asam Urat', 'Sendi');
  assert.ok(avoidGoutOrgan.category.includes('Purin') || avoidGoutOrgan.detail.includes('purin'));
});

test('validateActivityData validates required title and imageUrl', () => {
  const invalid = validateActivityData({ title: '' });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.length >= 2);

  const valid = validateActivityData({
    title: 'Edukasi Gizi Seimbang Lapangan',
    imageUrl: 'https://images.unsplash.com/photo-12345',
  });
  assert.equal(valid.isValid, true);
  assert.equal(valid.errors.length, 0);
});

import {
  mapDiseaseToRow,
  mapRowToDisease,
  mapArticleToRow,
  mapRowToArticle,
  isSchemaMissingError,
  resolveSupabaseConfig,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_ANON_KEY,
  DiseaseRow,
  ArticleRow,
} from '../lib/supabase';

test('resolveSupabaseConfig falls back to hardcoded default URL and placeholder key when env is empty', () => {
  const empty = resolveSupabaseConfig('', '');
  assert.equal(empty.url, 'https://fnemzuoszcgxnfhlmqnt.supabase.co');
  assert.equal(empty.anonKey, 'sb_publishable_hxIP4wG4eWC3WZbEMycWjg_6MqSsbq8');
  assert.equal(empty.isPlaceholderKey, false);
  assert.equal(empty.isConfigured, true);

  const exampleEnv = resolveSupabaseConfig('MY_SUPABASE_URL', 'MY_SUPABASE_ANON_KEY');
  assert.equal(exampleEnv.url, DEFAULT_SUPABASE_URL);
  assert.equal(exampleEnv.anonKey, DEFAULT_SUPABASE_ANON_KEY);
  assert.equal(exampleEnv.isPlaceholderKey, false);
  assert.equal(exampleEnv.isConfigured, true);

  const placeholderEnv = resolveSupabaseConfig('', 'PASTE_PUBLISHABLE_KEY_LENGKAP_DISINI');
  assert.equal(placeholderEnv.isPlaceholderKey, true);
  assert.equal(placeholderEnv.isConfigured, false);

  const customKeyOnly = resolveSupabaseConfig('', 'sb_publishable_live_key_123');
  assert.equal(customKeyOnly.url, DEFAULT_SUPABASE_URL);
  assert.equal(customKeyOnly.anonKey, 'sb_publishable_live_key_123');
  assert.equal(customKeyOnly.isPlaceholderKey, false);
  assert.equal(customKeyOnly.isConfigured, true);
});

test('isSchemaMissingError detects PGRST205 and 42P01 missing table errors cleanly', () => {
  assert.equal(isSchemaMissingError(null), false);
  assert.equal(
    isSchemaMissingError({
      code: 'PGRST205',
      message: "Could not find the table 'public.diseases' in the schema cache",
    }),
    true
  );
  assert.equal(
    isSchemaMissingError({
      code: '42P01',
      message: 'relation "public.articles" does not exist',
    }),
    true
  );
  assert.equal(
    isSchemaMissingError({
      code: '42501',
      message: 'new row violates row-level security policy',
    }),
    false
  );
});

test('Supabase disease mappers round-trip nested JSONB fields cleanly', () => {
  const sample = diseasesData[0];
  const row = mapDiseaseToRow(sample) as DiseaseRow;
  assert.equal(row.id, sample.id);
  assert.equal(row.indonesian_name, sample.indonesianName);
  assert.deepEqual(row.allowed_foods, sample.allowedFoods);
  assert.deepEqual(row.avoid_foods, sample.avoidFoods);
  assert.deepEqual(row.sample_meal_plan, sample.sampleMealPlan);

  const roundTripped = mapRowToDisease(row);
  assert.equal(roundTripped.id, sample.id);
  assert.equal(roundTripped.name, sample.name);
  assert.equal(roundTripped.indonesianName, sample.indonesianName);
  assert.deepEqual(roundTripped.allowedFoods, sample.allowedFoods);
  assert.deepEqual(roundTripped.avoidFoods, sample.avoidFoods);
  assert.deepEqual(roundTripped.sampleMealPlan, sample.sampleMealPlan);
});

test('Supabase article mappers round-trip articles and draft status cleanly', () => {
  const sample = { ...articlesData[0], status: 'draft' as const };
  const row = mapArticleToRow(sample) as ArticleRow;
  assert.equal(row.id, sample.id);
  assert.equal(row.reading_time, sample.readingTime);
  assert.equal(row.status, 'draft');
  assert.deepEqual(row.key_takeaways, sample.keyTakeaways);
  assert.deepEqual(row.content_paragraphs, sample.contentParagraphs);
  assert.deepEqual(row.references, sample.references);

  const roundTripped = mapRowToArticle(row);
  assert.equal(roundTripped.id, sample.id);
  assert.equal(roundTripped.title, sample.title);
  assert.equal(roundTripped.status, 'draft');
  assert.deepEqual(roundTripped.keyTakeaways, sample.keyTakeaways);
  assert.deepEqual(roundTripped.contentParagraphs, sample.contentParagraphs);
  assert.deepEqual(roundTripped.references, sample.references);
});

