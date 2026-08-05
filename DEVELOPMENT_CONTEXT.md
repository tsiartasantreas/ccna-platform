# NetworkLearn — CCNA Training Platform

## Development Context & Continuation Guide

This document provides everything needed to continue development of the NetworkLearn CCNA training platform.

---

## 1. Project Overview

**NetworkLearn** is an interactive, bilingual (English/Greek) CCNA 200-301 training platform with:
- 35 lessons across 6 modules with comprehensive networking content
- 3D animated landing page (React Three Fiber)
- Interactive quizzes with multiple question types
- User authentication and progress tracking (Supabase)
- Admin dashboard with user management and analytics
- Certificate generation (PDF via jsPDF)
- Revolut payment integration for Pro plan
- Dark/Light mode (dark primary)
- GDPR compliance with data export/deletion

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
│   ├── en/                      # English pages
│   │   ├── index.astro          # Landing page with 3D hero
│   │   ├── curriculum.astro     # All modules overview
│   │   ├── pricing.astro        # Free vs Pro comparison
│   │   ├── login.astro          # Auth (login/signup)
│   │   ├── dashboard.astro      # User progress dashboard
│   │   ├── profile.astro        # Settings, GDPR controls
│   │   ├── admin.astro          # Admin dashboard (6 tabs)
│   │   ├── reset-password.astro # Password reset page
│   │   ├── privacy.astro        # Privacy Policy
│   │   ├── terms.astro          # Terms of Service
│   │   ├── contact.astro        # Contact page
│   │   └── lessons/
│   │       └── [module]/
│   │           ├── [lesson].astro  # Lesson content page
│   │           └── quiz.astro      # Module quiz page
│   ├── el/                      # Greek pages (mirrored)
│   │   └── (same structure as en/)
│   └── api/                     # API endpoints (placeholder)
├── components/
│   ├── 3d/
│   │   └── NetworkHero.tsx      # 3D animated network topology
│   ├── layout/
│   │   ├── Header.tsx           # Nav with scroll-hide, user menu
│   │   └── Footer.tsx           # Footer with links
│   ├── quiz/
│   │   └── QuizEngine.tsx       # Interactive quiz with Supabase save
│   └── ui/
│       ├── FeedbackForm.tsx     # Star rating feedback
│       └── FeedbackDisplay.tsx  # Testimonials carousel
├── lib/
│   ├── supabase.ts              # Supabase client + type interfaces
│   ├── auth.ts                  # Auth functions (signup, login, GDPR)
│   ├── admin.ts                 # Admin config, demo data
│   ├── i18n.ts                  # Translation helper
│   ├── quiz-data.ts             # Quiz questions (older format)
│   ├── quiz-data-full.ts        # Full quiz with scoring logic
│   └── lessons/
│       ├── index.ts             # Lesson content router
│       ├── module1.ts           # Network Fundamentals (EN)
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
    └── global.css               # Tailwind + custom styles

public/
├── favicon.svg                  # NL logo favicon
├── images/
│   ├── logo.png                 # NetworkLearn logo (200x200)
│   ├── certificate-bg.png       # Canva certificate template
│   └── diagrams/                # 11 SVG diagrams
│       ├── osi-model.svg
│       ├── tcp-handshake.svg
│       ├── subnetting.svg
│       ├── vlan-topology.svg
│       ├── stp-topology.svg
│       ├── ospf-states.svg
│       ├── dhcp-dora.svg
│       ├── nat-translation.svg
│       ├── acl-flowchart.svg
│       ├── sdn-architecture.svg
│       └── rest-api.svg

supabase/
└── migrations/
    └── 001_initial_schema.sql   # Database schema

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
  email TEXT,                          -- Added later via migration
  avatar_url TEXT,                     -- Added later via migration
  display_name TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'el')),
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
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
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_number, lesson_number)
);

-- Quiz Scores
CREATE TABLE quiz_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  module_number INTEGER NOT NULL CHECK (module_number BETWEEN 1 AND 6),
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
  last_activity_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Required Additional SQL (run after initial migration)

```sql
-- Add email column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Add avatar_url column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Fix trigger to include email
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, preferred_language, theme, plan)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    'en', 'dark', 'free'
  );
  INSERT INTO public.user_points (user_id, total_points, current_streak, longest_streak)
  VALUES (NEW.id, 0, 0, 0);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error creating user profile: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin RLS policies (allows admin to read all data)
CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  USING (auth.jwt() ->> 'email' = 'tsiartasantreas@gmail.com');

CREATE POLICY "Admin can view all lesson progress"
  ON lesson_progress FOR SELECT
  USING (auth.jwt() ->> 'email' = 'tsiartasantreas@gmail.com');

CREATE POLICY "Admin can view all quiz scores"
  ON quiz_scores FOR SELECT
  USING (auth.jwt() ->> 'email' = 'tsiartasantreas@gmail.com');

CREATE POLICY "Admin can view all user points"
  ON user_points FOR SELECT
  USING (auth.jwt() ->> 'email' = 'tsiartasantreas@gmail.com');

CREATE POLICY "Admin can update any profile"
  ON profiles FOR UPDATE
  USING (auth.jwt() ->> 'email' = 'tsiartasantreas@gmail.com');
```

### Supabase Dashboard Configuration

**Authentication → URL Configuration:**
- Site URL: `http://localhost:4321` (dev) or `https://networklearn.wasmer.app` (prod)
- Redirect URLs: Add all of:
  - `http://localhost:4321/en/reset-password`
  - `http://localhost:4321/el/reset-password`
  - `http://localhost:4321/en/dashboard`
  - `http://localhost:4321/el/dashboard`
  - `https://networklearn.wasmer.app/**`

**Authentication → Email Templates:** Customize with NetworkLearn branding (HTML templates provided in conversation history).

**Authentication → Providers:** Enable Email and optionally Google OAuth.

---

## 5. Environment Variables

```env
# Supabase
PUBLIC_SUPABASE_URL=https://jhesstimsojwmkdysmpy.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>

# Revolut Business API
REVOLUT_API_KEY=<your_revolut_api_key>
REVOLUT_WEBHOOK_SECRET=<your_webhook_secret>

# Environment
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

### Module 1: Network Fundamentals
1. OSI & TCP/IP Models
2. Network Topologies & Types
3. Cabling & Physical Infrastructure
4. IPv4 Addressing & Binary Math
5. IPv4 Subnetting & VLSM
6. IPv6 Addressing
7. TCP, UDP, ARP, DNS, ICMP
8. Cisco CLI Basics

### Module 2: Network Access
1. Ethernet & MAC Addresses
2. Switch Operations
3. VLANs & Trunking (802.1Q)
4. EtherChannel
5. Spanning Tree Protocol (STP)
6. Wireless Fundamentals
7. PoE & Wireless Security

### Module 3: IP Connectivity
1. Routing Table & Path Selection
2. Static Routes
3. Inter-VLAN Routing
4. OSPF Single Area
5. OSPF Multi-Area Concepts
6. First Hop Redundancy (HSRP/VRRP)

### Module 4: IP Services
1. DHCP
2. NAT & PAT
3. NTP & Syslog
4. SNMP & QoS
5. SSH & Remote Access

### Module 5: Security Fundamentals
1. Security Threats Overview
2. Access Control Lists (ACLs)
3. Port Security & DHCP Snooping
4. AAA & 802.1X
5. VPN Concepts & Firewalls

### Module 6: Automation & Programmability
1. SDN Concepts
2. REST APIs & Data Formats
3. Configuration Management
4. Cisco DNA Center & Programmability

---

## 7. Features Status

### ✅ Completed Features

| Feature | Status | Notes |
|---------|--------|-------|
| Landing page with 3D hero | ✅ | React Three Fiber animated network |
| 35 lessons (English) | ✅ | Full CCNA content with objectives, key terms |
| 35 lessons (Greek) | ✅ | Translated content |
| Interactive quizzes | ✅ | 12 questions per module, multiple choice |
| User authentication | ✅ | Email/password + Google OAuth |
| Password reset | ✅ | Supabase email with validation |
| Dashboard | ✅ | Real-time progress from Supabase |
| Profile management | ✅ | Avatar upload, theme, language |
| Admin dashboard | ✅ | 6 tabs: Stats, Users, Subs, Revolut, Supabase, Settings |
| Certificate generation | ✅ | PDF with Canva template background |
| Dark/Light mode | ✅ | Toggle with localStorage persistence |
| English/Greek i18n | ✅ | Full translation files |
| GDPR compliance | ✅ | Data export, account deletion |
| Revolut payment flow | ✅ | Error fallback when not configured |
| Feedback system | ✅ | Star ratings on quizzes, testimonials |
| Lesson completion tracking | ✅ | Mark as Complete button, sidebar badges |
| Scroll-hide header | ✅ | Hides on scroll down, shows on scroll up |
| Back-to-top button | ✅ | Appears after 500px scroll |
| 11 SVG diagrams | ✅ | Embedded in lesson content |
| Supabase integration | ✅ | Auth, database, RLS |
| Wasmer deployment config | ✅ | wasmer.toml + app.yaml |

### 📋 Requires Manual Setup

| Task | How |
|------|-----|
| Run Supabase migration | Paste SQL in Supabase SQL Editor |
| Add email/avatar columns | Run ALTER TABLE SQL |
| Add admin RLS policies | Run admin policy SQL |
| Configure redirect URLs | Supabase Dashboard → Auth → URL Config |
| Customize email templates | Supabase Dashboard → Auth → Email Templates |
| Enable Google OAuth | Supabase Dashboard → Auth → Providers |
| Set up Revolut Business | Create account, get API keys |
| Connect GitHub to Wasmer | Wasmer Dashboard → Git settings |

---

## 8. Authentication Flow

1. **Signup:** User enters email/password → Supabase creates auth user → Trigger creates profile + user_points → Email verification sent → User verifies → Redirects to dashboard
2. **Login:** Email/password → Supabase validates → Session created → JWT stored → Profile fetched
3. **Google OAuth:** Redirect to Google → Callback → Supabase session → Dashboard
4. **Password Reset:** Profile page → Reset email sent → User clicks link → /reset-password page → New password → Supabase updateUser → Success
5. **Admin Check:** Header checks `session.user.email === 'tsiartasantreas@gmail.com'` → Shows admin link

---

## 9. Quiz System

- **Question types:** Multiple choice (currently), drag-drop, CLI simulation, topology debug (components exist)
- **Scoring:** 10 points per correct answer, 5 bonus for 3+ streak
- **Passing:** 80% to pass module quiz
- **Storage:** Saved to `quiz_scores` table in Supabase
- **Points:** Added to `user_points` table after each quiz

---

## 10. Certificate System

- **Template:** Canva-designed PNG stored at `public/images/certificate-bg.png`
- **Generation:** jsPDF loads template as background, overlays dynamic text
- **Content:** Recipient name, program name, issue date
- **Download:** PDF saved as `NetworkLearn-Certificate-{name}.pdf`
- **Access:** Pro users only, generated from admin panel

---

## 11. Deployment

### Wasmer.io
- `wasmer.toml` — Package config, static site serving
- `app.yaml` — Edge deployment config
- GitHub auto-deploy on push to `main`

### Build
```bash
npm run build    # Outputs to dist/
npm run dev      # Local dev server at localhost:4321
```

---

## 12. Known Issues & TODOs

| Issue | Priority | Notes |
|-------|----------|-------|
| `quiz 2.astro` duplicate files | Low | Clean up unused files |
| `admin 2.astro` duplicate | Low | Clean up |
| Greek lesson content shorter than English | Medium | Modules 3-6 Greek content is ~50% of English |
| Canva quota limits | Low | Diagrams generated, may need refresh |
| Git ref corruption | Low | `refs/heads/main 2` exists, may cause issues |
| Supabase `increment_points` RPC | Medium | Referenced in auth.ts but may not exist — create it |
| Revolut integration | Low | Placeholder — needs real API keys |
| Google OAuth | Medium | Needs Supabase provider configuration |
| No server-side rendering | By design | Static site, all logic client-side |
| Avatar stored as base64 | Medium | Consider Supabase Storage for production |

---

## 13. Recommended Next Steps

1. **Run all Supabase SQL** — migration + additional columns + admin policies
2. **Configure Supabase Auth** — redirect URLs, email templates, Google OAuth
3. **Test full user flow** — signup → verify → login → lessons → quiz → dashboard
4. **Deploy to Wasmer** — connect GitHub repo for auto-deploy
5. **Set up Revolut** — get Business API keys for payments
6. **Clean up duplicate files** — remove `quiz 2.astro`, `admin 2.astro`
7. **Expand Greek content** — bring Greek lessons to same depth as English
8. **Add Supabase Storage** — for avatar images instead of base64
9. **Create `increment_points` RPC function** — referenced but not created
10. **Performance optimization** — lazy load 3D components, code splitting

---

## 14. Key Patterns & Conventions

### i18n Pattern
- UI strings: `src/i18n/{locale}.json`
- Lesson content: `src/lib/lessons/module{N}-{locale}.ts`
- Routes: `/{locale}/path`
- Helper: `src/lib/i18n.ts` with `t()` function

### Supabase Pattern
- Client: `src/lib/supabase.ts` exports `supabase` client
- Auth: `src/lib/auth.ts` wraps Supabase auth functions
- Components use `createClient()` directly with inline credentials
- RLS ensures users only access their own data

### Lesson Content Pattern
```typescript
export const moduleNLessons: Record<number, {
  objectives: string[];
  keyTerms: { term: string; definition: string }[];
  content: string;  // Markdown-formatted content
}> = { ... };
```

### Admin Pattern
- Admin email hardcoded in `admin.ts` and checked via `session.user.email`
- Admin auto-upgraded to Pro on login
- Settings stored in localStorage under `adminSettings` key
- Header/Footer read settings via `localStorage.getItem('adminSettings')`

### Theme Pattern
- Default: dark mode
- Toggle: `localStorage.setItem('theme', 'dark'|'light')`
- CSS: `html.dark` / `html.light` classes
- Colors: CSS custom properties in `global.css`

---

## 15. Conversation History Summary

This project was built in a single extended session covering:
1. Initial project scaffolding (Astro + React + Tailwind)
2. CCNA curriculum research and content creation
3. 3D landing page with React Three Fiber
4. Supabase authentication and database setup
5. Interactive quiz engine
6. Admin dashboard with 6 management tabs
7. Certificate generation with Canva template
8. Bilingual support (English + Greek)
9. GDPR compliance features
10. Revolut payment integration
11. SVG diagram generation for lessons
12. Lesson progress tracking with sidebar badges
13. Profile picture upload
14. Header scroll behavior
15. Multiple iterations of design refinement

Total: ~63 git commits, 118 pages, ~11,000 lines of lesson content.
