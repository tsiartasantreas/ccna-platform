// ============================================================
// Centralized Configuration — Single Source of Truth
// ============================================================
// All constants, keys, and configuration values live here.
// Import from this file instead of hardcoding values.

// --- Supabase ---
export const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || 'https://jhesstimsojwmkdysmpy.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

// --- Admin ---
export const ADMIN_EMAIL = 'tsiartasantreas@gmail.com';

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
