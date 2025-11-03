UploadThing Audio – AI Podcast Generator

Overview
UploadThing Audio is a Next.js 15 application that generates podcast audio and a companion PDF brief from user prompts using OpenAI, stores assets via UploadThing, persists metadata with Prisma/PostgreSQL, and exposes both tRPC procedures and REST endpoints. It includes authentication (Better Auth), subscription gating, and a modern UI built with Radix and Tailwind v4.

Key Features
- AI script generation and TTS: Converts prompts to a long-form script and generates speech via OpenAI
- PDF brief: Builds a concise PDF summary/brief for the episode
- File storage: Uploads audio, images, and PDFs to UploadThing
- Auth and trials: Better Auth with user trials and Pro-gated features
- tRPC API: Typed server procedures for create podcast, image generation, user data
- REST endpoints: Parallel REST routes for chat/image generation
- Dashboard UX: Create podcast form, generated content section, recent podcasts

Tech Stack
- Next.js 15 (App Router) + React 19
- TypeScript + Zod
- tRPC v11 + TanStack Query v5
- Prisma + PostgreSQL (Accelerate optional)
- Better Auth + Polar (webhook) for subscriptions
- UploadThing (utapi) for asset storage
- OpenAI SDKs (text, images, TTS)
- Tailwind CSS v4 + Radix UI + Lucide Icons
- Sentry for observability

Monorepo/Project Layout
```
actions/                 # AI helpers (text, TTS, summary, image)
app/                     # Next.js app router, routes, APIs, layouts
  api/                   # REST endpoints: chat, generate-image, auth, trpc, uploadthing
components/              # UI and feature components
features/                # Feature-level hooks (e.g., podcast creation)
hooks/                   # Shared hooks (e.g., audio playback)
lib/                     # config, utility helpers
prisma/                  # Prisma schema and migrations
trpc/                    # tRPC client, server, router
utils/                   # auth, db, uploadthing, pdf-utils, server
```

Getting Started
Prerequisites
- Node.js 20+
- PostgreSQL database

Installation
```bash
pnpm install # or npm ci / yarn install
```

Environment Setup
Copy .env.example to .env and fill the values:
```bash
cp .env.example .env
```

Run Database Migrations
```bash
npx prisma migrate deploy
# or during dev after edits
npx prisma migrate dev
```

Development
```bash
npm run dev
```

Build and Start
```bash
npm run build
npm start
```

Core Flows
Create Podcast (tRPC)
1) Client calls trpc.createPodcast with { message, voice, image? }
2) Server:
   - Validates auth and trial/pro access
   - createText(message) → long-form script via OpenAI
   - generateAudio(script, voice) → TTS bytes
   - Uploads audio (UploadThing)
   - Creates PDF from script (pdf-utils) and uploads
   - Persists Podcast in Prisma
   - Returns audioUrl/pdfUrl and IDs

Generate Image (tRPC/REST)
1) generateImage(message) → OpenAI Image → fetch → utapi.uploadFiles → return URL

REST Endpoints
- POST /api/chat: Generate audio + PDF summary from message and voice
- POST /api/generate-image: Generate and upload a cover image from prompt
- POST /api/uploadthing: UploadThing file router

tRPC Procedures
- createPodcast: Protected, creates audio+PDF and saves Podcast row
- generateImage: Premium-gated, uploads AI-generated image and returns URL
- getUser: Protected, returns profile + podcasts list
- getAllPodcast: Public, returns recent podcasts

Configuration and Env Vars
- DATABASE_URL: PostgreSQL connection string
- OPENAI_API_KEY: OpenAI API key
- UPLOADTHING_TOKEN: UploadThing secret token (server)
- SENTRY_AUTH_TOKEN / SENTRY_DSN: Optional observability
- AUTH_SECRET and provider keys for Better Auth
- POLAR_*: Polar webhook/SDK keys if subscriptions used

Scripts
- dev: next dev
- build: next build
- start: next start
- lint: eslint
- postinstall: prisma generate

Testing Notes
- Add Vitest/Jest for unit tests (suggested)
- Use Playwright for e2e (suggested)

Security & Privacy
- All server-side AI calls and UploadThing uploads are executed on server routes or tRPC procedures
- Validations: zod on inputs, auth checks for protected/premium routes

Troubleshooting
- Prisma client path is configured to output src/generated/prisma. Ensure postinstall ran
- If UploadThing URLs are undefined, check UPLOADTHING_TOKEN and that utapi.uploadFiles returns data.url
- If OpenAI responses are empty, verify models and API key; some regions/models may differ

License
Proprietary (update if needed)
