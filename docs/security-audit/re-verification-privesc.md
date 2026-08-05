# Privilege Escalation & Code Re-Verification — CCNA_Lessons

**Date:** 2026-08-05

---

## Summary

| # | Finding | Status |
|---|---------|--------|
| 1 | Self-promote to admin | STILL VALID |
| 2 | Self-upgrade to Pro | STILL VALID |
| 3 | Hardcoded Supabase credentials | PARTIALLY FIXED |
| 4 | Stored XSS via innerHTML | STILL VALID |
| 5 | Incomplete localStorage cleanup | PARTIALLY FIXED |
| 6 | Service role key in localStorage | ✅ FIXED |
| 7 | Feature flags not enforced | STILL VALID |
| 8 | increment_points lacks bounds check | STILL VALID |
| 9 | Quiz answers in client bundle | STILL VALID |
| 10 | Admin page no server-side auth | STILL VALID |

**Overall:** 1 fully fixed, 2 partially fixed, 7 still valid.

---

### [FIXED] Service Role Key in localStorage
The service role key input has been removed from admin.astro. The Supabase tab now shows only the project URL (read-only) with a message that keys are server-side.

### [PARTIALLY FIXED] Hardcoded Supabase Credentials
Most pages now import from centralized `src/lib/supabase.ts`. However, `FeedbackDisplay.tsx` still has hardcoded credentials with an independent `createClient()` call.

### [PARTIALLY FIXED] Incomplete localStorage Cleanup
`userEmail` and `userId` are cleared on sign-out. However, `userAvatar` is NOT removed.

### [STILL VALID] Self-Promote to Admin
RLS policy `USING (auth.uid() = id)` has no WITH CHECK clause restricting `is_admin` column. Any user can set `is_admin: true` on their own row.

### [STILL VALID] Self-Upgrade to Pro
Same RLS issue. Users can call `update({ plan: 'pro' })` on their own profile.

### [STILL VALID] Stored XSS via innerHTML
`display_name` still interpolated into innerHTML in admin.astro (lines 498, 512, 631) without sanitization.

### [STILL VALID] Feature Flags Not Enforced
`ENABLE_GOOGLE_OAUTH`, `ENABLE_REGISTRATION`, `MAINTENANCE_MODE` defined in config.ts but never imported or checked in any page.

### [STILL VALID] increment_points Lacks Bounds Check
No validation on `p_points` value. Users can call RPC with arbitrary large numbers.

### [STILL VALID] Quiz Answers in Client Bundle
`correct` field included in QuizQuestion objects sent to client. All answers visible in browser dev tools.

### [STILL VALID] Admin Page No Server-Side Auth
No middleware exists. Admin HTML served to all visitors. Client-side JS hides content but code is accessible.
