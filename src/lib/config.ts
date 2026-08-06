// ============================================================
// Centralized Configuration — Single Source of Truth
// ============================================================

// --- Supabase ---
export const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || 'https://jhesstimsojwmkdysmpy.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoZXNzdGltc29qd21reWRzbXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMjY5NzQsImV4cCI6MjA1MDcwMjk3NH0.bHJy8ZJe9Sp5M1UQyS4eJ6oL6FDNVfMa2kXRFljIjXI';

// --- Admin ---
// Admin validation is now done via database (profiles.is_admin column)
// No hardcoded email in client code

// --- Contact ---
export const CONTACT_EMAIL = 'info@abcdigital360.com';
export const SUPPORT_EMAIL = 'support@abcdigital360.com';
export const ENTITY_NAME = 'abcdigital360';

// --- Site ---
export const SITE_NAME = 'NetworkLearn';
export const SITE_URL = 'https://networklearn.wasmer.app';

// --- Pricing ---
export const PRO_PRICE_MONTHLY = 0.99;
export const PRO_PRICE_YEARLY = 9.99;

// --- Quiz ---
export const PASSING_SCORE = 80;
export const POINTS_PER_CORRECT = 10;
export const STREAK_BONUS = 5;
export const STREAK_THRESHOLD = 3;
export const QUESTIONS_PER_MODULE = 15;

// --- Feature Flags ---
export const ENABLE_REGISTRATION = true;
export const ENABLE_PASSWORD_RESET = true;
export const ENABLE_GOOGLE_OAUTH = false;
export const MAINTENANCE_MODE = false;

// Helper: Check if user is admin (queries database)
export async function checkIsAdmin(supabase: any): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return false;
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single();
  return profile?.is_admin === true;
}
