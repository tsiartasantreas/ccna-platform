// Admin configuration
export const ADMIN_EMAIL = 'tsiartasantreas@gmail.com';

export function isAdmin(email: string | undefined): boolean {
  return email === ADMIN_EMAIL;
}

// Admin settings stored in localStorage (would be in Supabase for production)
export interface AdminSettings {
  revolutApiKey: string;
  revolutWebhookSecret: string;
  revolutMerchantId: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey: string;
  stripePublicKey: string;
  stripeSecretKey: string;
  emailSmtpHost: string;
  emailSmtpPort: string;
  emailSmtpUser: string;
  emailSmtpPass: string;
  siteName: string;
  siteUrl: string;
  enableRegistration: boolean;
  enablePasswordReset: boolean;
  enableGoogleOAuth: boolean;
  maintenanceMode: boolean;
}

const defaultSettings: AdminSettings = {
  revolutApiKey: '',
  revolutWebhookSecret: '',
  revolutMerchantId: '',
  supabaseUrl: 'https://jhesstimsojwmkdysmpy.supabase.co',
  supabaseAnonKey: '',
  supabaseServiceKey: '',
  stripePublicKey: '',
  stripeSecretKey: '',
  emailSmtpHost: '',
  emailSmtpPort: '587',
  emailSmtpUser: '',
  emailSmtpPass: '',
  siteName: 'NetAcad',
  siteUrl: 'https://ccna-platform.wasmer.app',
  enableRegistration: true,
  enablePasswordReset: true,
  enableGoogleOAuth: false,
  maintenanceMode: false,
};

export function getAdminSettings(): AdminSettings {
  if (typeof window === 'undefined') return defaultSettings;
  const stored = localStorage.getItem('adminSettings');
  if (stored) {
    try {
      return { ...defaultSettings, ...JSON.parse(stored) };
    } catch {
      return defaultSettings;
    }
  }
  return defaultSettings;
}

export function saveAdminSettings(settings: Partial<AdminSettings>): void {
  if (typeof window === 'undefined') return;
  const current = getAdminSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem('adminSettings', JSON.stringify(updated));
}

// User statistics (demo data - would come from Supabase in production)
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  proUsers: number;
  freeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  averageQuizScore: number;
  totalLessonsCompleted: number;
  totalQuizzesTaken: number;
  revenueThisMonth: number;
  revenueTotal: number;
}

export function getUserStats(): UserStats {
  // In production, this would query Supabase
  return {
    totalUsers: 156,
    activeUsers: 89,
    proUsers: 23,
    freeUsers: 133,
    newUsersToday: 5,
    newUsersThisWeek: 34,
    newUsersThisMonth: 89,
    averageQuizScore: 76.5,
    totalLessonsCompleted: 1247,
    totalQuizzesTaken: 456,
    revenueThisMonth: 229.77,
    revenueTotal: 1839.54,
  };
}

// Registered users (demo - would come from Supabase)
export interface RegisteredUser {
  id: string;
  email: string;
  displayName: string;
  plan: 'free' | 'pro';
  registeredAt: string;
  lastActiveAt: string;
  lessonsCompleted: number;
  quizzesTaken: number;
  averageScore: number;
}

export function getRegisteredUsers(): RegisteredUser[] {
  return [
    { id: '1', email: 'tsiartasantreas@gmail.com', displayName: 'Andreas Tsiartas', plan: 'pro', registeredAt: '2026-08-01', lastActiveAt: '2026-08-04', lessonsCompleted: 35, quizzesTaken: 6, averageScore: 95 },
    { id: '2', email: 'john@example.com', displayName: 'John Smith', plan: 'pro', registeredAt: '2026-08-02', lastActiveAt: '2026-08-04', lessonsCompleted: 12, quizzesTaken: 3, averageScore: 82 },
    { id: '3', email: 'maria@example.com', displayName: 'Maria Papadaki', plan: 'free', registeredAt: '2026-08-02', lastActiveAt: '2026-08-03', lessonsCompleted: 8, quizzesTaken: 0, averageScore: 0 },
    { id: '4', email: 'giorgos@example.com', displayName: 'Giorgos Nikolaou', plan: 'free', registeredAt: '2026-08-03', lastActiveAt: '2026-08-04', lessonsCompleted: 5, quizzesTaken: 1, averageScore: 70 },
    { id: '5', email: 'sarah@example.com', displayName: 'Sarah Johnson', plan: 'pro', registeredAt: '2026-08-03', lastActiveAt: '2026-08-04', lessonsCompleted: 20, quizzesTaken: 4, averageScore: 88 },
  ];
}

// Subscription management
export interface Subscription {
  id: string;
  userId: string;
  email: string;
  plan: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  amount: number;
  paymentMethod: 'revolut' | 'stripe';
}

export function getSubscriptions(): Subscription[] {
  return [
    { id: 'sub_1', userId: '1', email: 'tsiartasantreas@gmail.com', plan: 'yearly', status: 'active', startDate: '2026-08-01', endDate: '2027-08-01', amount: 79.99, paymentMethod: 'revolut' },
    { id: 'sub_2', userId: '2', email: 'john@example.com', plan: 'monthly', status: 'active', startDate: '2026-08-02', endDate: '2026-09-02', amount: 9.99, paymentMethod: 'stripe' },
    { id: 'sub_3', userId: '5', email: 'sarah@example.com', plan: 'monthly', status: 'active', startDate: '2026-08-03', endDate: '2026-09-03', amount: 9.99, paymentMethod: 'revolut' },
  ];
}
