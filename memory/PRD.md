# ViceHub — Product Requirements Document

## Original Problem Statement
Premium pre-launch landing page for **ViceHub**, an AI-powered companion platform for GTA 6.
Single objective: **get visitors to join the waitlist** through exceptional, mysterious, premium design
(inspired by Apple, Linear, Stripe, PlayStation, Rockstar, Porsche). GTA 6-inspired dark palette,
no neon/RGB/esports look. Mobile-first, 60fps, anticipation over information.

## User Choices
- Waitlist storage: **Supabase PostgreSQL** (`waitlist` table) + **Resend** confirmation email (best-effort).
- AI Companion: **real LLM** responses (Emergent universal key, OpenAI gpt-5.4-mini, SSE streaming).
- Countdown target: **GTA 6 launch — November 19, 2026**.
- Typography: Outfit (headings) + Manrope (body), chosen premium pairing.

## Architecture
- **Frontend**: React (CRA + craco), Tailwind, framer-motion, shadcn/ui. Single route `/` composed of section components under `src/components`, content in `src/data/content.js`, API in `src/lib/api.js`, waitlist dialog via `WaitlistContext`.
- **Backend**: FastAPI (`server.py`), asyncpg pool → Supabase (transaction pooler, statement_cache_size=0). Resend via `asyncio.to_thread`. AI chat via emergentintegrations `LlmChat.stream_message` → SSE.
- **Env**: DATABASE_URL, RESEND_API_KEY, SENDER_EMAIL, EMERGENT_LLM_KEY in backend/.env.

## User Personas
- GTA 6 fans / players awaiting launch who want an edge and a polished companion.
- Early adopters who join waitlists for premium tools.

## Core Requirements (static)
- Floating glass nav, cinematic hero + countdown + parallax mockup, product preview cards w/ concept modals,
  live AI companion chat preview, blurred interactive map preview, why-love-it cards, coming-soon grid,
  animated roadmap, strong waitlist CTA, FAQ accordion, premium footer. Waitlist CTA repeated across page.

## Implemented (2026-06-26)
- Full landing page, all sections, mobile-responsive, subtle animations.
- Hero mockup redesigned to a GTA6/Vice City HUD (location, wanted level, cash, Jason/Lucia markers, mission objective) using a generated Vice City neon map.
- Real VICEHUB logo integrated (monogram + wordmark in nav, full lockup in footer/dialog) via screen-blend.
- Waitlist → Supabase persistence (idempotent) + Resend confirmation (best-effort).
- AI Companion real streaming responses. Countdown to Nov 19, 2026.
- SEO BLOG (2026-06-26): admin-only JWT auth (Supabase admin_users, bcrypt), Markdown editor with live preview, cover image uploads via Emergent object storage, public /blog + /blog/:slug, per-post SEO meta + OG/Twitter + Article JSON-LD + canonical, dynamic /api/sitemap.xml + robots.txt. Admin panel at /admin (login, dashboard, create/edit/delete).
- Verified: backend 12/12 blog pytest + earlier suites; frontend admin/public/SEO flows pass. Fixed Navbar useNavigate crash.

## Backlog / Remaining
- P1: Verify a Resend domain so confirmation emails reach ALL recipients (currently testing mode → owner only).
- P2: Blog categories/search, related posts, RSS feed, pagination for many posts.
- P2: Per-post meta description fallback from content snippet when excerpt empty.
- P2: Admin view/export for waitlist signups; CTA conversion analytics.
- P2: Migrate FastAPI @app.on_event to lifespan handlers.

## Next Tasks
1. Resend domain verification (sender email update).
2. Optional admin/export endpoint for waitlist.
