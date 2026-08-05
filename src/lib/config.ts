// Centralized configuration
// All sensitive values loaded from environment variables

export const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || 'https://jhesstimsojwmkdysmpy.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

// Admin email (intentionally hardcoded - this is access control, not a secret)
export const ADMIN_EMAIL = 'tsiartasantreas@gmail.com';

// Feature flags
export const ENABLE_REGISTRATION = true;
export const ENABLE_PASSWORD_RESET = true;
export const ENABLE_GOOGLE_OAUTH = false;
export const MAINTENANCE_MODE = false;

// Pricing
export const PRO_PRICE_MONTHLY = 0.99;
export const PRO_PRICE_YEARLY = 9.99;

// Quiz settings
export const PASSING_SCORE = 80;
export const POINTS_PER_CORRECT = 10;
export const STREAK_BONUS = 5;
export const STREAK_THRESHOLD = 3;
