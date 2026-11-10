import { SiteConfig } from '../types';

/**
 * CENTRALIZED SITE CONFIGURATION (HIHO)
 * -------------------------------------------------------------
 * Crucial Requirement: The Header and Footer components DO NOT
 * hardcode text or navigation links directly. All labels, menus,
 * logos, CTA buttons, search placeholders, social links, and
 * legal medical disclaimers are read directly from this file.
 *
 * Editing any property here immediately updates the whole application.
 */
export const defaultSiteConfig: SiteConfig = {
  brand: {
    name: 'HIHO',
    fullName: 'HIHO Health & Nutrition Education',
    tagline: 'Panduan Gizi & Edukasi Kesehatan Terpercaya untuk Keluarga Sehat',
    mission: 'Membantu setiap individu dan keluarga Indonesia memahami panduan nutrisi berbasis bukti medis dengan bahasa yang sederhana, praktis, dan ramah penyakit.',
    logo: {
      text: 'HI',
      accentText: 'HO',
      badge: 'Edukasi Gizi Klinis',
    },
  },
  header: {
    navLinks: [
      { id: 'home', label: 'Home', href: '#home' },
      { id: 'penyakit', label: 'Direktori Penyakit', href: '#penyakit' },
      { id: 'artikel', label: 'Artikel Gizi', href: '#artikel' },
      { id: 'tentang', label: 'Tentang Kami', href: '#tentang' },
    ],
    searchPlaceholder: 'Cari penyakit, pantangan, atau bahan makanan (cth: Asam Urat, Santan, Diabetes)...',
    ctaButton: {
      label: 'Cek Pantangan Makanan',
      action: 'open_checker',
    },
  },
  footer: {
    brandTagline: 'Tetap Konsisten menerapkan gaya hidup sehat dan rutin pengecekan Kesehatan, untuk kualitas hidup yang lebih baik ke depannya, karena sehatnya tubuh, kita yang tentukan',
    quickLinksTitle: 'Navigasi Utama',
    quickLinks: [
      { label: 'Beranda Utama', href: '#home' },
      { label: 'Pilihan & Direktori Penyakit', href: '#penyakit' },
      { label: 'Artikel & Panduan Nutrisi', href: '#artikel' },
      { label: 'Tentang & Standar Medis HIHO', href: '#tentang' },
      { label: 'Pedoman Editorial Klinis', href: '#tentang' },
    ],
    categoriesTitle: 'Kategori Penyakit',
    categories: [
      { label: 'Penyakit Metabolik (Diabetes & Asam Urat)', filter: 'metabolik' },
      { label: 'Kesehatan Pencernaan (GERD & Maag)', filter: 'pencernaan' },
      { label: 'Kardiovaskular & Hipertensi', filter: 'jantung' },
      { label: 'Gizi Lansia & Degeneratif', filter: 'lansia' },
      { label: 'Nutrisi Ibu Hamil & Tumbuh Kembang Anak', filter: 'ibu-anak' },
    ],
    socialLinksTitle: 'Saluran Edukasi',
    socialLinks: [
      { platform: 'Instagram', label: '@hiho.health', url: 'https://instagram.com', icon: 'Instagram' },
      { platform: 'YouTube', label: 'HIHO Nutrition Channel', url: 'https://youtube.com', icon: 'Youtube' },
      { platform: 'Podcast', label: 'Obrolan Gizi Sehat', url: 'https://spotify.com', icon: 'Radio' },
    ],
    educationContacts: {
      whatsapp: {
        label: '0822 1180 7736 a/n Bu Martha',
        number: '0822 1180 7736',
        url: 'https://wa.me/6282211807736',
      },
      email: {
        address: 'hrd.health@toyota.co.id',
        url: 'mailto:hrd.health@toyota.co.id',
      },
    },
    copyright: '© 2026 HIHO. All rights reserved.',
    disclaimerText: 'Disclaimer Medis: Seluruh informasi, panduan diet, dan rekomendasi makanan di situs HIHO disiapkan semata-mata untuk tujuan edukasi kesehatan umum. Konten ini tidak dimaksudkan untuk menggantikan diagnosis dokter, pemeriksaan medis personal, atau preskripsi diet khusus dari dokter spesialis gizi klinis (Sp.GK) dan dietisien teregistrasi. Selalu konsultasikan kondisi klinis spesifik Anda dengan tenaga medis profesional sebelum melakukan perubahan drastis pada pola makan Anda.',
    emergencyText: 'Jika Anda atau kerabat mengalami gejala akut/kegawatdaruratan medis mendadak (misalnya nyeri dada mendadak, sesak napas berat, atau penurunan kesadaran), segera hubungi IGD rumah sakit terdekat atau nomor darurat 119/112.',
  },
};
