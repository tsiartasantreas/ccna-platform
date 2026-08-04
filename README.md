# NetworkLearn — Interactive CCNA Training Platform

An interactive 3D-accented web platform for learning CCNA networking concepts from scratch. Built with Astro, React, Tailwind CSS, and Supabase.

## 🚀 Live Site

**https://networklearn.wasmer.app**

## ✨ Features

- **35 comprehensive lessons** across 6 CCNA 200-301 modules
- **3D animated network topology** on landing page (React Three Fiber)
- **Interactive quizzes** with multiple question types (12 per module)
- **Progress tracking** with points, streaks, and achievements
- **Bilingual support** — English and Greek
- **Dark/Light mode** with dark as primary
- **GDPR compliant** with encrypted user data
- **Revolut payment integration** for Pro plan (€0.99/month)
- **PDF certificate generation** for course completion
- **Admin dashboard** with user management and analytics

## 📚 Curriculum (CCNA 200-301)

| Module | Topic | Lessons | Weight |
|--------|-------|---------|--------|
| 1 | Network Fundamentals | 8 | 20% |
| 2 | Network Access | 7 | 20% |
| 3 | IP Connectivity | 6 | 25% |
| 4 | IP Services | 5 | 10% |
| 5 | Security Fundamentals | 5 | 15% |
| 6 | Automation & Programmability | 4 | 10% |

## 🛠️ Tech Stack

- **Framework:** Astro 4.x with React islands
- **3D:** React Three Fiber + Three.js
- **Styling:** Tailwind CSS (dark/light mode)
- **Backend:** Supabase (Auth + PostgreSQL + RLS)
- **Payment:** Revolut Business API
- **Hosting:** Wasmer.io (free tier)

## 🏗️ Quick Start

```bash
npm install
npm run dev     # http://localhost:4321/en/
npm run build   # outputs to dist/
```

## 📁 Project Structure

```
src/
├── pages/          # Route pages (en/, el/)
├── components/     # React components (3d/, quiz/, auth/, layout/)
├── lib/            # Utilities (supabase, auth, admin, quiz-data)
├── i18n/           # Translations (en.json, el.json)
├── layouts/        # Base layout
└── styles/         # Global CSS
```

## 🔐 Admin Access

Admin dashboard available at `/en/admin` for authorized users.

## 📄 License

MIT

## 🏢 Owner

**abcdigital360** — info@abcdigital360.com
