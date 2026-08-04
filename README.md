# NetAcad — Interactive CCNA Training Platform

An interactive 3D-accented web platform for learning CCNA networking concepts from scratch. Built with Astro, React, Tailwind CSS, and Supabase.

## Features

- **35 lessons** across 6 CCNA modules
- **3D interactive diagrams** powered by React Three Fiber
- **Gamified quizzes** with multiple question types
- **Progress tracking** with points, streaks, and achievements
- **Bilingual support** — English and Greek
- **Dark/Light mode** with dark as primary
- **GDPR compliant** with encrypted user data
- **Revolut payment integration** for Pro plan

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 4.x |
| Interactive UI | React 18 |
| 3D Graphics | React Three Fiber + Three.js |
| Styling | Tailwind CSS |
| Backend | Supabase (Auth + PostgreSQL) |
| Payment | Revolut Business API |
| Hosting | Wasmer.io (free tier) |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── pages/          # Route pages (en/, el/)
├── components/     # React components (3d/, quiz/, auth/, layout/, ui/)
├── content/        # Lesson content (MDX)
├── i18n/           # Translation files (en.json, el.json)
├── lib/            # Utilities (supabase, quiz-data, etc.)
├── layouts/        # Base layout
└── styles/         # Global CSS
```

## Curriculum

1. **Network Fundamentals** (20%) — 8 lessons
2. **Network Access** (20%) — 7 lessons
3. **IP Connectivity** (25%) — 6 lessons
4. **IP Services** (10%) — 5 lessons
5. **Security Fundamentals** (15%) — 5 lessons
6. **Automation & Programmability** (10%) — 4 lessons

## Deployment

Deployed to Wasmer.io via GitHub auto-deploy on push to `main`.

```bash
# Manual deploy
wasmer deploy
```

## License

MIT
