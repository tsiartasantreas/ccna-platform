# NetworkLearn — Complete Session Context

## For Continuation in New Chat Sessions

This document captures the full development history, architecture, decisions, and current state of the NetworkLearn CCNA training platform.

---

## Project Summary

**NetworkLearn** is a bilingual (English/Greek) CCNA 200-301 training platform built with:
- Astro 7 (static site) + React 19 (islands) + Tailwind CSS 4
- Supabase (auth, database, RLS)
- React Three Fiber (3D landing page)
- jsPDF (certificate generation)
- Wasmer.io (hosting)

**Live:** https://networklearn.wasmer.app
**GitHub:** https://github.com/tsiartasantreas/ccna-platform
**Owner:** abcdigital360 — info@abcdigital360.com
**Admin:** tsiartasantreas@gmail.com (stored in DB as `is_admin = true`)

---

## Security Architecture (IMPORTANT)

### Supabase Configuration
- **URL:** https://jhesstimsojwmkdysmpy.supabase.co
- **Anon Key:** Configured in `.env` as `PUBLIC_SUPABASE_ANON_KEY`
- **All page files** import from `src/lib/supabase.ts` (centralized client)
- **No hardcoded keys** in page scripts (fixed in security hardening)
- **Admin validation** via `profiles.is_admin` column in database (not client-side email check)

### Supabase Migrations to Run (in order):
1. `001_initial_schema.sql` — 4 tables, RLS, triggers
2. `002_increment_points_rpc.sql` — Points increment function
3. `003_admin_email_access.sql` — Admin email correlation table
4. `004_security_fixes.sql` — DELETE policies, increment_points auth
5. `005_admin_validation_db.sql` — is_admin column, RLS updates
6. `006_delete_account.sql` — Account deletion function
7. `007_server_side_functions.sql` — Server-side functions for security

### Key SQL to Run in Supabase SQL Editor:
```sql
-- Add is_admin column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
UPDATE profiles SET is_admin = TRUE WHERE email = 'tsiartasantreas@gmail.com';

-- Add email and avatar columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Admin RLS policies (run after is_admin column exists)
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Database Schema

### Tables:
- `profiles` — id, email, avatar_url, display_name, preferred_language, theme, plan, is_admin, revolut_customer_id
- `lesson_progress` — user_id, module_number, lesson_number, status, completed_at, time_spent_seconds
- `quiz_scores` — user_id, module_number, score, total_questions, correct_answers, time_taken_seconds, attempt_number
- `user_points` — user_id, total_points, current_streak, longest_streak, last_activity_date
- `admin_user_emails` — user_id, email_encrypted (admin-only access)

---

## Features Built

### Core:
- 35 lessons (6 modules) with full CCNA content in English and Greek
- 11 SVG diagrams embedded in lessons
- Interactive quiz engine (15 questions per module)
- Progress tracking (Supabase + localStorage fallback)
- Dark/Light mode (dark primary)
- English/Greek i18n

### Authentication:
- Supabase Auth (email/password + Google OAuth)
- Password validation (8+ chars, uppercase, lowercase, number, special)
- Password reset via email
- Profile picture upload
- Admin dashboard (6 tabs)

### Dashboard:
- Real-time progress from Supabase
- Per-module progress bars
- Quiz scores with pass/fail status
- Points and streak tracking
- Certificate generation (Pro users, all quizzes passed)

### Admin Dashboard:
- Statistics (real-time from Supabase)
- User management (plan changes, password reset, certificates)
- Subscription management
- Settings (site name, logo, feature flags)
- Auto-refresh every 5 minutes + manual refresh

### Payment:
- Revolut integration (placeholder — needs API keys)
- Pro plan: €0.99/month, €9.99/year
- Free plan: All lessons, basic features
- Pro plan: Quizzes, certificates, gamification

### Legal:
- Privacy Policy (EN/EL)
- Terms of Service (EN/EL)
- Contact page (EN/EL)

---

## File Structure

```
src/
├── components/
│   ├── 3d/NetworkHero.tsx          # 3D landing page
│   ├── layout/Header.tsx           # Nav with scroll-hide, user menu
│   ├── layout/Footer.tsx           # Footer
│   ├── quiz/QuizEngine.tsx         # Interactive quiz with Supabase
│   └── ui/FeedbackForm.tsx         # Star rating feedback
├── lib/
│   ├── config.ts                   # Centralized constants
│   ├── supabase.ts                 # Supabase client
│   ├── auth.ts                     # Auth functions
│   ├── admin.ts                    # Admin config
│   ├── i18n.ts                     # Translation helper
│   ├── quiz-questions.ts           # 15 questions per module
│   └── lessons/                    # 12 content files (6 EN + 6 EL)
├── pages/
│   ├── en/ (15 pages)
│   │   ├── index.astro             # Landing
│   │   ├── curriculum.astro
│   │   ├── pricing.astro
│   │   ├── login.astro             # Supabase auth
│   │   ├── dashboard.astro         # Real-time progress
│   │   ├── profile.astro           # Avatar, GDPR
│   │   ├── admin.astro             # 6-tab admin
│   │   ├── reset-password.astro
│   │   ├── privacy.astro / terms.astro / contact.astro
│   │   └── lessons/[module]/
│   │       ├── [lesson].astro      # Lesson content + completion
│   │       └── quiz.astro          # Quiz with Pro gate
│   ├── el/ (mirrored)
│   └── api/ (empty — server-side via Supabase RPC)
├── i18n/en.json + el.json
├── layouts/BaseLayout.astro
└── styles/global.css

public/
├── images/
│   ├── logo.png                    # NetworkLearn logo (200x200)
│   ├── certificate-bg.png          # Canva certificate template
│   └── diagrams/ (11 SVG files)
```

---

## Key Patterns

### Supabase Usage:
```typescript
// All pages import from centralized client
import { supabase } from '../../lib/supabase';

// All queries filter by user.id
const { data } = await supabase
  .from('lesson_progress')
  .select('*')
  .eq('user_id', user.id);
```

### localStorage (user-specific):
```javascript
// Keys are user-specific to prevent data sharing
const userId = localStorage.getItem('userId');
localStorage.setItem(`completedLessons_${userId}`, JSON.stringify(data));
```

### Admin Check (database-side):
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('is_admin')
  .eq('id', user.id)
  .single();
const isAdmin = profile?.is_admin === true;
```

---

## Environment Variables (.env)

```
PUBLIC_SUPABASE_URL=https://jhesstimsojwmkdysmpy.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
REVOLUT_API_KEY=<your_key>
REVOLUT_WEBHOOK_SECRET=<your_secret>
```

---

## Build & Deploy

```bash
npm install
npm run dev        # localhost:4321
npm run build      # outputs to dist/
git push origin main  # auto-deploys to Wasmer
```

**Wasmer config:** wasmer.toml + app.yaml (static site with not_found redirect)

---

## Known Issues & TODOs

1. **Supabase migration SQL** — Run all 7 migration files in order
2. **Google OAuth** — Needs Supabase provider configuration
3. **Revolut integration** — Needs real API keys
4. **Greek content** — Modules 3-6 are shorter than English
5. **Edge Functions** — Not yet implemented (server-side operations via RPC instead)
6. **Email templates** — Customize in Supabase dashboard

---

## Supabase Dashboard Configuration

### Authentication → URL Configuration:
- Site URL: `http://localhost:4321` (dev) / `https://networklearn.wasmer.app` (prod)
- Redirect URLs: Add `/en/reset-password`, `/el/reset-password`, `/en/dashboard`, `/el/dashboard`

### Authentication → Email Templates:
Customize with NetworkLearn branding (HTML templates available in chat history)

### Authentication → Providers:
- Email: Enabled (default)
- Google: Optional (needs OAuth setup)

---

## Conversation History Summary

This project was built in one extended session covering:
1. Initial scaffolding (Astro + React + Tailwind)
2. CCNA curriculum research and content creation (35 lessons)
3. 3D landing page with React Three Fiber
4. Supabase authentication and database setup
5. Interactive quiz engine with 4 question types
6. Admin dashboard with 6 management tabs
7. Certificate generation with Canva template
8. Bilingual support (English + Greek)
9. GDPR compliance features
10. Revolut payment integration
11. SVG diagram generation (11 diagrams)
12. Lesson progress tracking with sidebar badges
13. Profile picture upload
14. Header scroll-hide behavior
15. Security hardening (centralized imports, server-side functions)
16. Multiple iterations of design refinement

**Total: ~30+ commits, 105 pages, ~11,000 lines of lesson content**
