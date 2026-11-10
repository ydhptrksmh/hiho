export type HealthCategory =
  | 'semua'
  | 'metabolik'
  | 'pencernaan'
  | 'jantung'
  | 'lansia'
  | 'ibu-anak'
  | 'Metabolik & Gula Darah'
  | 'Jantung & Pembuluh Darah'
  | 'Pencernaan & Lambung'
  | 'Sendi & Tulang'
  | 'Ginjal & Saluran Kemih'
  | 'Pernapasan'
  | 'Kolesterol & Lemak'
  | 'Ibu & Anak'
  | 'Lansia'
  | 'Gizi & Nutrisi Umum'
  | string;

export interface NavLink {
  id: string;
  label: string;
  href: string;
  badge?: string;
}

export interface SocialLink {
  platform: string;
  label: string;
  url: string;
  icon: string;
}

export interface QuickLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  brand: {
    name: string;
    fullName: string;
    tagline: string;
    mission: string;
    logo: {
      text: string;
      accentText: string;
      badge: string;
    };
  };
  header: {
    navLinks: NavLink[];
    searchPlaceholder: string;
    ctaButton: {
      label: string;
      action: 'open_checker' | 'open_directory';
    };
  };
  footer: {
    brandTagline: string;
    quickLinksTitle: string;
    quickLinks: QuickLink[];
    categoriesTitle: string;
    categories: { label: string; filter: HealthCategory }[];
    socialLinksTitle: string;
    socialLinks: SocialLink[];
    educationContacts?: {
      whatsapp: { label: string; number: string; url: string };
      email: { address: string; url: string };
    };
    copyright: string;
    disclaimerText: string;
    emergencyText: string;
  };
}

export interface MedicalReviewer {
  name: string;
  title: string;
  institution: string;
  registrationNumber?: string;
  verifiedDate: string;
}

export interface FoodGuideline {
  item: string;
  category?: string;
  detail?: string;
  portionOrReason: string;
  imageUrl?: string;
}

export interface SampleMealPlan {
  breakfast: string;
  snackPagi?: string;
  lunch: string;
  snackSore?: string;
  dinner: string;
  snack?: string;
}

export interface Disease {
  id: string;
  name: string;
  indonesianName: string;
  category: HealthCategory;
  categoryLabel: string;
  iconName: string;
  summary: string;
  pathophysiology: string;
  criteria?: string;
  riskFactors?: string[];
  healthImpacts?: string[];
  quickAllowed: string[];
  quickAvoid: string[];
  allowedFoods: FoodGuideline[];
  avoidFoods: FoodGuideline[];
  sampleMealPlan: SampleMealPlan;
  medicalReviewer?: MedicalReviewer;
  clinicalSources?: string[];
  warningSymptoms?: string[];
  imageUrl?: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  readingTime: string;
  publishDate: string;
  author: string;
  reviewer: string;
  coverGradient: string;
  imageUrl?: string;
  rawContent?: string;
  status?: 'published' | 'draft';
  keyTakeaways: string[];
  contentParagraphs: string[];
  references: string[];
}

export interface AdminUser {
  username: string;
  name: string;
  role: string;
  email: string;
  token: string;
}

export interface ActivityMedia {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  date?: string;
  location?: string;
  createdAt?: string;
}

export interface AdminStats {
  totalDiseases: number;
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalTips: number;
  activeTips: number;
  totalActivities: number;
}

export interface FoodRating {
  name: string;
  category: string;
  portion: string;
  diabetes: { status: 'safe' | 'moderate' | 'avoid'; note: string };
  hypertension: { status: 'safe' | 'moderate' | 'avoid'; note: string };
  gout: { status: 'safe' | 'moderate' | 'avoid'; note: string };
  gerd: { status: 'safe' | 'moderate' | 'avoid'; note: string };
}

export interface DailyTip {
  id: number | string;
  category: string;
  title: string;
  tip: string;
  scientificContext: string;
  date?: string;
  isActive?: boolean;
}

