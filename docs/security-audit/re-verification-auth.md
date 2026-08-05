# Auth & RLS Re-Verification — CCNA_Lessons

**Date:** 2026-08-05
**Purpose:** Verify which findings from the original audit are still valid vs fixed

---

## Summary

| # | Finding | Status |
|---|---------|--------|
| 1 | RLS anonymous access | PARTIALLY FIXED (data protected, no explicit deny policies) |
| 2 | Admin UPDATE policies missing | STILL VALID |
| 3 | delete_user_account GRANT too broad | STILL VALID |
| 4 | No email verification enforcement | STILL VALID |
| 5 | Account deletion not using RPC | STILL VALID |
| 6 | Realtime IDOR via localStorage | STILL VALID (mitigated by RLS) |
| 7 | Client-side quiz score tampering | STILL VALID (RPC exists but unused) |
| 8 | Missing HTTP security headers | STILL VALID |
| 9 | display_name no validation | STILL VALID |

**Key development:** Migration 007 introduced server-side RPC functions (`save_quiz_score`, `complete_lesson`, `delete_own_account`) that would address findings 5 and 7, but the client-side code has NOT been updated to call them.

---

### [PARTIALLY FIXED] RLS Anonymous Access to Sensitive Tables
- Data is protected (anonymous users get empty arrays)
- No explicit deny policies for `anon` role
- This is standard Supabase behavior, not a real vulnerability

### [STILL VALID] Admin UPDATE RLS Policies Missing
- `lesson_progress`: Only SELECT and DELETE for admin, no UPDATE
- `quiz_scores`: Only SELECT and DELETE for admin, no UPDATE
- `user_points`: Only SELECT and DELETE for admin, no UPDATE
- Only `profiles` has admin UPDATE policy

### [STILL VALID] delete_user_account GRANT Too Broad
- Function granted to all `authenticated` users
- Internal auth check exists but broad GRANT increases attack surface

### [STILL VALID] No Email Verification Enforcement
- User redirected to dashboard immediately after signup
- No check for `email_confirmed_at` anywhere in code
- Relies entirely on Supabase server-side configuration

### [STILL VALID] Account Deletion Not Using RPC
- Profile page does individual table deletes
- Never calls `delete_user_account()` or `delete_own_account()` RPC
- `auth.users` record never deleted client-side

### [STILL VALID] Realtime IDOR via localStorage
- userId read from localStorage for subscription filter
- Mitigated by RLS (Supabase applies policies server-side)
- Not best practice but not exploitable

### [STILL VALID] Client-Side Quiz Score Tampering
- Score calculated entirely client-side in QuizEngine.tsx
- `save_quiz_score` RPC exists in migration 007 but is NOT called
- Client does direct INSERT into quiz_scores with fabricated scores

### [STILL VALID] Missing HTTP Security Headers
- No middleware file exists
- No CSP, X-Frame-Options, HSTS, X-Content-Type-Options configured
- No security headers in astro.config.mjs or deployment config

### [STILL VALID] display_name No Validation
- No maxLength, minLength, or pattern on input
- No JavaScript validation on form submit
- No database CHECK constraint
