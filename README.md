# NetAcad — Interactive CCNA Training Platform

An interactive 3D-accented web platform for learning CCNA networking concepts from scratch. Built with Astro, React, Tailwind CSS, and Supabase.

## 🚀 Live Site

**Coming soon on Wasmer.io**

## ✨ Features

- **35 comprehensive lessons** across 6 CCNA 200-301 modules
- **3D interactive network topology** on landing page (React Three Fiber)
- **Gamified quizzes** with multiple question types
- **Progress tracking** with points, streaks, and achievements
- **Bilingual support** — English and Greek
- **Dark/Light mode** with dark as primary
- **GDPR compliant** with encrypted user data
- **Revolut payment integration** for Pro plan
- **PDF certificate generation** for course completion

## 📚 Curriculum

| Module | Topic | Lessons | Exam Weight |
|--------|-------|---------|-------------|
| 1 | Network Fundamentals | 8 | 20% |
| 2 | Network Access | 7 | 20% |
| 3 | IP Connectivity | 6 | 25% |
| 4 | IP Services | 5 | 10% |
| 5 | Security Fundamentals | 5 | 15% |
| 6 | Automation & Programmability | 4 | 10% |

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Astro 4.x | Static site generation, i18n routing |
| Interactive UI | React 18 | Islands for 3D, quizzes, auth |
| 3D Graphics | React Three Fiber + Three.js | 3D network topology |
| Styling | Tailwind CSS | Dark/light mode, responsive design |
| Backend | Supabase | Auth, PostgreSQL, row-level security |
| Payment | Revolut Business API | Subscription management |
| Certificate | jsPDF | Client-side PDF generation |
| Hosting | Wasmer.io | Static site (free tier) |

## 🏗️ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── pages/              # Route pages
│   ├── en/             # English pages
│   ├── el/             # Greek pages
│   └── api/            # API endpoints
├── components/
│   ├── 3d/             # React Three Fiber components
│   ├── quiz/           # Quiz engine
│   ├── auth/           # Authentication
│   ├── layout/         # Header, Footer
│   └── ui/             # Shared UI components
├── lib/
│   ├── supabase.ts     # Supabase client
│   ├── auth.ts         # Auth helpers
│   ├── quiz-data.ts    # Quiz questions
│   └── lessons/        # Lesson content (35 lessons)
├── i18n/               # Translations (en.json, el.json)
├── layouts/            # Base layout
└── styles/             # Global CSS
```

## 🔐 Supabase Setup

1. Run the migration SQL in Supabase Dashboard SQL Editor
2. See `supabase/README.md` for detailed instructions

## 🚢 Deployment

Deployed to Wasmer.io via GitHub auto-deploy on push to `main`.

```bash
# Manual deploy
wasmer deploy
```

## 📄 License

MIT

## 🙏 Acknowledgments

- CCNA® is a registered trademark of Cisco Systems, Inc.
- This platform is an independent educational resource
