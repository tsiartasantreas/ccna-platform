# NetAcad CCNA Training Platform — Design Specification

## 1. Overview

**Project:** NetAcad — Interactive CCNA Training Platform
**Goal:** A visually engaging, 3D-accented web platform for learning CCNA networking concepts from scratch
**Target Audience:** Complete beginners to networking preparing for CCNA 200-301
**Repository:** GitHub (auto-deploy to Wasmer.io)

## 2. Architecture

### Tech Stack
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Astro 4.x | Static site generation, content pages, i18n routing |
| Interactive UI | React 18 | Islands for 3D, quizzes, auth, dashboard |
| 3D Graphics | React Three Fiber + Three.js | 3D accent elements throughout the site |
| Styling | Tailwind CSS 3.x | Dark/light mode, responsive design |
| Backend | Supabase | Auth, PostgreSQL database, row-level security |
| Payment | Revolut Business API | Subscription management |
| Certificate | jsPDF | Client-side PDF generation |
| Hosting | Wasmer.io | Static site deployment (free tier) |
| Repository | GitHub | Source control, auto-deploy to Wasmer |

### Project Structure
```
ccna-platform/
├── src/
│   ├── pages/
│   │   ├── en/                    # English routes
│   │   │   ├── index.astro        # Landing page
│   │   │   ├── curriculum.astro   # All modules overview
│   │   │   ├── pricing.astro      # Plans & pricing
│   │   │   ├── login.astro        # Auth page
│   │   │   ├── dashboard.astro    # User dashboard
│   │   │   ├── profile.astro      # Settings, GDPR controls
│   │   │   └── lessons/
│   │   │       └── [module]/
│   │   │           └── [lesson].astro
│   │   ├── el/                    # Greek routes (mirrored)
│   │   └── api/
│   │       ├── revolut/
│   │       │   └── webhook.ts     # Revolut webhook handler
│   │       └── certificate/
│   │           └── generate.ts    # Certificate generation
│   ├── components/
│   │   ├── 3d/                    # React Three Fiber components
│   │   ├── quiz/                  # Quiz engine components
│   │   ├── auth/                  # Authentication components
│   │   ├── layout/                # Layout components
│   │   └── ui/                    # Shared UI components
│   ├── content/
│   │   └── lessons/               # Lesson content (MDX)
│   │       ├── en/
│   │       └── el/
│   ├── i18n/
│   │   ├── en.json                # UI strings (English)
│   │   └── el.json                # UI strings (Greek)
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client
│   │   ├── revolut.ts             # Revolut API client
│   │   ├── quiz-data.ts           # Quiz questions data
│   │   └── certificate.ts         # Certificate generation
│   └── styles/
│       └── global.css             # Tailwind + custom styles
├── public/
│   ├── images/                    # Canva-generated diagrams
│   └── models/                    # 3D model assets (GLTF)
├── supabase/
│   └── migrations/                # Database migrations
├── wasmer.toml                    # Wasmer package config
├── app.yaml                       # Wasmer deployment config
└── astro.config.mjs               # Astro configuration
```

## 3. Curriculum

### Module 1: Network Fundamentals (20% of exam) — 8 lessons
1. OSI & TCP/IP Models
2. Network Topologies & Types
3. Cabling & Physical Infrastructure
4. IPv4 Addressing & Binary Math
5. IPv4 Subnetting & VLSM
6. IPv6 Addressing
7. TCP, UDP, ARP, DNS, ICMP
8. Cisco CLI Basics

### Module 2: Network Access (20% of exam) — 7 lessons
1. Ethernet & MAC Addresses
2. Switch Operations
3. VLANs & Trunking (802.1Q)
4. EtherChannel
5. Spanning Tree Protocol (STP)
6. Wireless Fundamentals
7. PoE & Wireless Security

### Module 3: IP Connectivity (25% of exam) — 6 lessons
1. Routing Table & Path Selection
2. Static Routes
3. Inter-VLAN Routing
4. OSPF Single Area
5. OSPF Multi-Area Concepts
6. First Hop Redundancy (HSRP/VRRP)

### Module 4: IP Services (10% of exam) — 5 lessons
1. DHCP
2. NAT & PAT
3. NTP & Syslog
4. SNMP & QoS
5. SSH & Remote Access

### Module 5: Security Fundamentals (15% of exam) — 5 lessons
1. Security Threats Overview
2. Access Control Lists (ACLs)
3. Port Security & DHCP Snooping
4. AAA & 802.1X
5. VPN Concepts & Firewalls

### Module 6: Automation & Programmability (10% of exam) — 4 lessons
1. SDN Concepts
2. REST APIs & Data Formats
3. Configuration Management
4. Cisco DNA Center & Programmability

**Total: 35 lessons, 6 module quizzes, 1 final comprehensive exam**

## 4. Visual Design

### Theme
- **Dark mode (primary):** Background #0a0f1e, accents #00d4ff (cyan), purple gradients
- **Light mode:** Background #fafafa, accents #2563eb (blue)
- **Font:** Inter (body), JetBrains Mono (code/CLI)
- **Toggle:** Persistent in header, saved to user profile

### 3D Elements (React Three Fiber)
| Location | Element | Interaction |
|----------|---------|-------------|
| Landing hero | Animated network topology | Auto-rotate, mouse parallax |
| Module 1 | OSI Layer cake | Click layers to explore |
| Module 2 | VLAN segmentation | Interactive switches |
| Module 3 | Routing path animation | Click routers for tables |
| Module 4 | NAT translation visual | Hover for translations |
| Module 5 | Firewall rules | Toggle rules on/off |
| Module 6 | SDN architecture | Click components |
| Quiz correct | Trophy/achievement animation | Celebration effect |
| Dashboard | 3D progress ring | Interactive hover |

## 5. Authentication & Data (Supabase)

### Auth Flow
- Email + password signup with email verification
- OAuth (Google) as optional
- JWT tokens for session management
- No login required for lesson content

### Database Schema
- `profiles` — User profile data (display_name, language, theme, plan)
- `lesson_progress` — Per-lesson completion tracking
- `quiz_scores` — Quiz attempt history with scores
- `user_points` — Points, streaks, achievements

### Security
- Row-Level Security (RLS) — users access only their own data
- PII encrypted at rest (Supabase default)
- Passwords hashed with bcrypt
- TLS in transit

## 6. Payment & Monetization

### Plans
| Feature | Free | Pro (€9.99/mo or €79.99/yr) |
|---------|------|------------------------------|
| All 35 lessons | ✅ | ✅ |
| Text + diagrams + 3D | ✅ | ✅ |
| Basic review questions | ✅ | ✅ |
| Full gamified quizzes | ❌ | ✅ |
| Points, streaks, leaderboard | ❌ | ✅ |
| Progress dashboard | ✅ | ✅ |
| Completion certificate | ❌ | ✅ |

### Revolut Integration
1. User clicks "Upgrade to Pro"
2. Frontend calls API → creates Revolut payment order
3. Redirect to Revolut checkout
4. Webhook confirms payment → updates plan in Supabase

## 7. Quiz System

### Question Types
1. Multiple Choice — Standard A/B/C/D
2. Drag & Drop — Subnetting exercises, matching
3. CLI Simulation — Type Cisco commands
4. Topology Troubleshooting — Click on broken link

### Scoring
- 10 points per correct answer
- 5 bonus points for streak (3+ consecutive correct)
- Module completion requires 80%+ score
- Certificate requires all modules passed

## 8. GDPR Compliance

| Requirement | Implementation |
|-------------|---------------|
| Consent | Cookie consent banner (first visit) |
| Data Minimization | Only email, name, progress data |
| Right to Access | "Download My Data" button → JSON export |
| Right to Deletion | "Delete Account" button → 30-day removal |
| Encryption | At rest (Supabase) + in transit (TLS) |
| Privacy Policy | Dedicated page, linked from footer |
| Terms of Service | Required acceptance during signup |

## 9. i18n

- Astro built-in i18n routing: `/en/...` and `/el/...`
- UI strings in `en.json` and `el.json`
- Lesson content stored with language variants
- Language toggle in header, preference saved to profile
- Primary language: English

## 10. Deployment

- GitHub → Wasmer auto-deploy on push to main
- `wasmer.toml` maps `dist/` to static site
- `app.yaml` configures edge deployment
- Free tier: 100K requests, 150GB bandwidth, 3 apps
