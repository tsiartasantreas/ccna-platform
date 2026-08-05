# NetworkLearn — CCNA Training Platform

## Development Context & Continuation Guide

This document provides everything needed to continue development of the NetworkLearn CCNA training platform. Last updated: August 5, 2026.

---

## 1. Project Overview

**NetworkLearn** is an interactive, bilingual (English/Greek) CCNA 200-301 training platform with:
- 35 lessons across 6 modules with comprehensive networking content
- 3D animated landing page (React Three Fiber)
- Interactive quizzes with 12 multiple-choice questions per module
- User authentication and progress tracking (Supabase)
- Admin dashboard with real-time user management and analytics
- Certificate generation (PDF via jsPDF with Canva template)
- Revolut payment integration for Pro plan (€0.99/month)
- Dark/Light mode (dark primary)
- GDPR compliance with data export/deletion
- Profile picture upload
- Lesson completion tracking with in-page modals
- Scroll-hide header with back-to-top button

**Owner:** abcdigital360 — info@abcdigital360.com
**Admin Email:** tsiartasantreas@gmail.com
**Live URL:** https://networklearn.wasmer.app
**GitHub:** https://github.com/tsiartasantreas/ccna-platform

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Astro | 7.1.6 |
| UI Islands | React | 19.2.8 |
| 3D Graphics | React Three Fiber + Three.js | 9.7.0 / 0.185.1 |
| Styling | Tailwind CSS | 4.3.3 |
| Backend | Supabase (Auth + PostgreSQL) | supabase-js 2.112.0 |
| Payment | Revolut Business API | — |
| Certificate | jsPDF | 4.2.1 |
| Hosting | Wasmer.io | Free tier |
| Language | TypeScript | Strict mode |

---

## 3. Project Structure

```
src/
├── pages/
│   ├── index.astro              # Redirects to /en/
│   ├── en/                      # English pages (15 files)
│   │   ├── index.astro          # Landing page with 3D hero
│   │   ├── curriculum.astro     # All modules overview
│   │   ├── pricing.astro        # Free vs Pro comparison
│   │   ├── login.astro          # Auth (login/signup with Supabase)
│   │   ├── dashboard.astro      # User progress dashboard (real Supabase data)
│   │   ├── profile.astro        # Settings, avatar upload, GDPR controls
│   │   ├── admin.astro          # Admin dashboard (6 tabs, admin-only)
│   │   ├── reset-password.astro # Password reset with validation
│   │   ├── privacy.astro        # Privacy Policy
│   │   ├── terms.astro          # Terms of Service
│   │   ├── contact.astro        # Contact page with form
│   │   └── lessons/
│   │       └── [module]/
│   │           ├── [lesson].astro  # Lesson content with sidebar, completion modal
│   │           └── quiz.astro      # Module quiz with QuizEngine
│   ├── el/                      # Greek pages (mirrored structure)
│   └── api/                     # API endpoints (placeholder)
├── components/
│   ├── 3d/
│   │   └── NetworkHero.tsx      # 3D animated network topology
│   ├── layout/
│   │   ├── Header.tsx           # Nav with scroll-hide, user menu, avatar
│   │   └── Footer.tsx           # Footer with site name
│   ├── quiz/
│   │   └── QuizEngine.tsx       # Interactive quiz with Supabase score saving
│   └── ui/
│       ├── FeedbackForm.tsx     # Star rating feedback
│       └── FeedbackDisplay.tsx  # Testimonials carousel
├── lib/
│   ├── supabase.ts              # Supabase client + TypeScript interfaces
│   ├── auth.ts                  # Auth functions (signup, login, GDPR export/delete)
│   ├── admin.ts                 # Admin config, demo data
│   ├── i18n.ts                  # Translation helper
│   ├── quiz-data.ts             # Quiz questions (6 modules, 12 each)
│   └── lessons/
│       ├── index.ts             # Lesson content router
│       ├── module1.ts           # Network Fundamentals (EN, 1949 lines)
│       ├── module1-el.ts        # Network Fundamentals (EL)
│       ├── module2.ts           # Network Access (EN)
│       ├── module2-el.ts        # Network Access (EL)
│       ├── module3.ts           # IP Connectivity (EN)
│       ├── module3-el.ts        # IP Connectivity (EL)
│       ├── module4.ts           # IP Services (EN)
│       ├── module4-el.ts        # IP Services (EL)
│       ├── module5.ts           # Security Fundamentals (EN)
│       ├── module5-el.ts        # Security Fundamentals (EL)
│       ├── module6.ts           # Automation (EN)
│       └── module6-el.ts        # Automation (EL)
├── i18n/
│   ├── en.json                  # English UI strings
│   └── el.json                  # Greek UI strings
├── layouts/
│   └── BaseLayout.astro         # HTML shell, theme init
└── styles/
    └── global.css               # Tailwind + custom styles (dark/light modes)

public/
├── favicon.svg                  # NL logo favicon
├── images/
│   ├── logo.png                 # NetworkLearn logo (200x200)
│   ├── certificate-bg.png       # Canva certificate template background
│   └── diagrams/                # 11 SVG diagrams
│       ├── osi-model.svg        # Module 1: OSI 7-layer model
│       ├── tcp-handshake.svg    # Module 1: TCP three-way handshake
│       ├── subnetting.svg       # Module 1: IPv4 subnetting
│       ├── vlan-topology.svg    # Module 2: VLAN & trunk topology
│       ├── stp-topology.svg     # Module 2: Spanning Tree Protocol
│       ├── ospf-states.svg      # Module 3: OSPF neighbor states
│       ├── dhcp-dora.svg        # Module 4: DHCP DORA process
│       ├── nat-translation.svg  # Module 4: NAT translation
│       ├── acl-flowchart.svg    # Module 5: ACL processing logic
│       ├── sdn-architecture.svg # Module 6: SDN architecture
│       └── rest-api.svg         # Module 6: REST API flow

supabase/
└── migrations/
    ├── 001_initial_schema.sql   # Database schema (4 tables, RLS, triggers)
    └── 002_increment_points_rpc.sql # RPC function for points

Config files:
├── astro.config.mjs             # Astro + React + Tailwind + i18n
├── wasmer.toml                  # Wasmer package config
├── app.yaml                     # Wasmer deployment config
├── tsconfig.json                # TypeScript strict config
├── package.json                 # Dependencies
└── .env                         # Environment variables (gitignored)
```

---

## 4. Database Schema (Supabase PostgreSQL)

### Tables

```sql
-- Profiles (linked to auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  avatar_url TEXT,
  display_name TEXT,
  preferred_language TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'dark',
  plan TEXT DEFAULT 'free',
  revolut_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lesson Progress
CREATE TABLE lesson_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  module_number INTEGER NOT NULL CHECK (module_number BETWEEN 1 AND 6),
  lesson_number INTEGER NOT NULL CHECK (lesson_number BETWEEN 1 AND 8),
  status TEXT DEFAULT 'not_started',
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  UNIQUE(user_id, module_number, lesson_number)
);

-- Quiz Scores
CREATE TABLE quiz_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  module_number INTEGER NOT NULL,
  score NUMERIC(5,2) NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  time_taken_seconds INTEGER NOT NULL,
  attempt_number INTEGER DEFAULT 1,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Points
CREATE TABLE user_points (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE
);
```

### Required SQL to Run in Supabase Dashboard

```sql
-- 1. Add email column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Add avatar column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 3. Fix trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, preferred_language, theme, plan)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), 'en', 'dark', 'free');
  INSERT INTO public.user_points (user_id, total_points, current_streak, longest_streak)
  VALUES (NEW.id, 0, 0, 0);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Admin RLS policies
CREATE POLICY "Admin can view all profiles" ON profiles FOR SELECT USING (auth.jwt() ->> 'email' = 'tsiartasantreas@gmail.com');
CREATE POLICY "Admin can view all lesson progress" ON lesson_progress FOR SELECT USING (auth.jwt() ->> 'email' = 'tsiartasantreas@gmail.com');
CREATE POLICY "Admin can view all quiz scores" ON quiz_scores FOR SELECT USING (auth.jwt() ->> 'email' = 'tsiartasantreas@gmail.com');
CREATE POLICY "Admin can view all user points" ON user_points FOR SELECT USING (auth.jwt() ->> 'email' = 'tsiartasantreas@gmail.com');
CREATE POLICY "Admin can update any profile" ON profiles FOR UPDATE USING (auth.jwt() ->> 'email' = 'tsiartasantreas@gmail.com');

-- 5. Increment points RPC
CREATE OR REPLACE FUNCTION increment_points(p_user_id UUID, p_points INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE user_points SET total_points = total_points + p_points, updated_at = NOW() WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Supabase Dashboard Config
- **Authentication → URL Configuration:**
  - Site URL: `http://localhost:4321` (dev) / `https://networklearn.wasmer.app` (prod)
  - Redirect URLs: Add `/en/reset-password`, `/el/reset-password`, `/en/dashboard`, `/el/dashboard`
- **Authentication → Email Templates:** Customize with NetworkLearn branding
- **Authentication → Providers:** Enable Email, optionally Google OAuth

---

## 5. Environment Variables

```env
PUBLIC_SUPABASE_URL=https://jhesstimsojwmkdysmpy.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
REVOLUT_API_KEY=<your_revolut_api_key>
REVOLUT_WEBHOOK_SECRET=<your_webhook_secret>
NODE_ENV=development
```

---

## 6. Curriculum (CCNA 200-301)

| Module | Topic | Lessons | Exam Weight |
|--------|-------|---------|-------------|
| 1 | Network Fundamentals | 8 | 20% |
| 2 | Network Access | 7 | 20% |
| 3 | IP Connectivity | 6 | 25% |
| 4 | IP Services | 5 | 10% |
| 5 | Security Fundamentals | 5 | 15% |
| 6 | Automation & Programmability | 4 | 10% |

**Total: 35 lessons, 6 module quizzes (12 questions each)**

---

## 7. Key Features & Implementation

### Authentication
- Supabase Auth with email/password and Google OAuth
- Password validation: 8+ chars, uppercase, lowercase, number, special char
- Password reset flow with Supabase email → `/reset-password` page
- Admin check: `session.user.email === 'tsiartasantreas@gmail.com'`

### Lesson Completion System
- **localStorage fallback** — works without login
- **Supabase sync** — persists when logged in
- **In-page modal** on "Next Lesson" button (not browser confirm)
- **Sidebar badges** — green ✓ for completed lessons
- **Completed badge** shown when lesson already done

### Quiz Engine
- React component with multiple choice questions
- 12 questions per module
- Saves scores to Supabase `quiz_scores` table
- Updates `user_points` table
- Shows results with correct/incorrect feedback

### Admin Dashboard (6 tabs)
1. **Statistics** — Real-time from Supabase (users, revenue, scores)
2. **Users** — Email, plan dropdown, save/reset/certificate buttons
3. **Subscriptions** — Pro users list, cancel option
4. **Revolut** — API key, webhook config
5. **Supabase** — Connection settings, DB status
6. **Settings** — Site name, logo URL, feature flags, SMTP

### Certificate
- Canva template background (`certificate-bg.png`)
- jsPDF overlays dynamic text (name, date)
- Downloadable PDF
- Admin can generate for any user

### 3D Landing Page
- React Three Fiber with animated network topology
- 8 network nodes (routers, switches, servers)
- Data packets flowing along connections
- Mouse parallax, auto-rotation
- Background particles

### Scroll Behavior
- Header hides on scroll down, shows on scroll up
- Back-to-top button appears after 500px
- Works on ALL pages (shared Header component)

---

## 8. Known Issues & TODOs

| Issue | Status | Notes |
|-------|--------|-------|
| ~~Duplicate files~~ | ✅ Fixed | Removed quiz 2.astro, admin 2.astro |
| ~~Git ref corruption~~ | ✅ Fixed | Removed refs/heads/main 2 |
| ~~increment_points RPC~~ | ✅ Fixed | Created migration 002 |
| ~~Scroll-hide header~~ | ✅ Fixed | useEffect bug fixed |
| ~~Lesson completion~~ | ✅ Fixed | localStorage fallback added |
| Greek content depth | ⚠️ | Modules 3-6 Greek is ~50% of English |
| Avatar stored as base64 | ⚠️ | Consider Supabase Storage |
| Revolut integration | ⚠️ | Placeholder — needs real API keys |
| Google OAuth | ⚠️ | Needs Supabase provider config |

---

## 9. Deployment

### Wasmer.io
- `wasmer.toml` — Package config, static site
- `app.yaml` — Edge deployment
- GitHub auto-deploy on push to `main`

### Build
```bash
npm install
npm run build    # Outputs to dist/
npm run dev      # Local dev at localhost:4321
```

### Git History
12 commits on main, force-pushed once to fix ref corruption.

---

## 10. Key Patterns

### i18n
- UI strings: `src/i18n/{locale}.json`
- Lesson content: `src/lib/lessons/module{N}-{locale}.ts`
- Routes: `/{locale}/path`

### Supabase
- Client: `src/lib/supabase.ts`
- Components use `createClient()` inline
- RLS ensures users only access own data
- Admin bypasses RLS via JWT email check

### Theme
- Default: dark
- Toggle: `localStorage.setItem('theme', 'dark'|'light')`
- CSS: `html.dark` / `html.light` classes

### Admin
- Email hardcoded: `tsiartasantreas@gmail.com`
- Settings in localStorage under `adminSettings`
- Header/Footer read settings dynamically

---

## 11. Build Stats

- **105 pages** built
- **~11,000 lines** of lesson content (EN + EL)
- **11 SVG diagrams** embedded in lessons
- **12 commits** on main branch
- Build time: ~5-15 seconds
