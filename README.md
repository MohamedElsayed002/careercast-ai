# 🚀 CareerCastAI

> A Next.js 15 platform offering two powerful AI-powered services: Podcast Generator and CV Reviewer. Create professional podcasts or get AI-powered CV analysis to match with job descriptions.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-green)](https://www.prisma.io/)

## 📋 Overview

CareerCastAI is a comprehensive web platform that provides two distinct AI-powered services:

### 🎙️ Service 1: Podcast Generator
Transform simple prompts into professional podcast episodes. The platform generates realistic debate-style podcasts between two AI voices, creates accompanying PDF briefs, and manages the entire workflow from prompt to publication.

### 📄 Service 2: CV Reviewer
Upload your CV and job description to get AI-powered analysis. The system evaluates your CV against job requirements, provides match percentage, identifies strengths and weaknesses, and offers actionable recommendations to improve your job application.

## ✨ Key Features

### Podcast Generator Features
- 🤖 **AI-Powered Content Generation**: Transform simple prompts into full podcast episodes
- 🎤 **Multiple Voice Options**: Choose from various AI voices for realistic conversations
- 📄 **Automatic PDF Generation**: Get detailed briefs and summaries automatically
- 🎨 **Image Generation**: AI-generated cover images using DALL-E
- ⏱️ **Customizable Duration**: Create 1, 5, 10, or 20-minute podcasts
- 🎚️ **Voice Speed Control**: Adjustable playback speed

### CV Reviewer Features
- 📊 **AI-Powered Analysis**: Analyzes CVs against job descriptions
- 🎯 **Match Scoring**: Provides percentage match and detailed feedback
- 💪 **Strengths Identification**: Highlights your key qualifications
- ⚠️ **Weakness Detection**: Identifies areas for improvement
- 📝 **Actionable Recommendations**: Suggests specific improvements
- 🔍 **Missing Skills Detection**: Identifies critical skills gaps
- 📈 **Experience Assessment**: Compares required vs. actual experience

### Platform Features
- 🔐 **Secure Authentication**: Better Auth with role-based access control
- 💳 **Subscription Management**: Free and Pro tiers with Polar integration
- 🎯 **Admin Dashboard**: User management and analytics
- 🌙 **Dark Mode**: Full dark mode support
- 📱 **Responsive Design**: Mobile-first approach
- 🔑 **Credential Management**: Securely store and manage OpenAI API keys

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** (App Router) - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Radix UI** - Accessible components
- **TanStack Query v5** - Data fetching & caching
- **Framer Motion** - Animations
- **Sonner** - Toast notifications

### Backend
- **Next.js API Routes** - Server endpoints
- **tRPC v11** - Type-safe APIs
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Database
- **Better Auth** - Authentication
- **Inngest** - Background job processing

### Services & Integrations
- **OpenAI** - GPT-4, TTS, DALL-E
- **UploadThing** - File storage
- **Polar** - Subscription management
- **Sentry** - Error tracking
- **Upstash** - Rate limiting (Redis)

## 📁 Project Structure

```
careercast-ai/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (community)/         # Community features
│   │   ├── community/
│   │   ├── contact/
│   │   └── how-it-works/
│   ├── api/                 # API endpoints
│   │   ├── auth/
│   │   ├── generate/
│   │   ├── generate-image/
│   │   ├── trpc/
│   │   └── uploadthing/
│   ├── podcast/             # Podcast Generator routes
│   ├── reviewer/            # CV Reviewer routes
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # Reusable UI components (Radix)
│   ├── podcast-form/        # Podcast creation forms
│   ├── cv-reviwer/          # CV review components
│   ├── home/                # Homepage components
│   └── ...
├── actions/                 # Server actions
│   ├── index.ts             # AI helpers (text, TTS, summary, image)
│   └── cv-reviewer.ts       # CV analysis logic
├── trpc/                    # tRPC setup
│   ├── routers/             # API routers
│   ├── client.tsx           # Client setup
│   └── init.ts              # Server setup
├── utils/                   # Utility functions
│   ├── auth.ts              # Auth configuration
│   ├── db.ts                # Prisma client
│   ├── uploadthing.ts       # UploadThing client
│   └── pdf-utils.ts         # PDF generation
├── lib/                     # Shared libraries
│   ├── encryption.ts        # Credential encryption
│   ├── ratelimit.ts         # Rate limiting
│   └── utils.ts             # Helper functions
├── prisma/                  # Database
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Migration files
├── features/                # Feature-level code
│   ├── create-podcast/
│   └── subscriptions/
├── hooks/                   # Custom React hooks
└── public/                  # Static assets
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ 
- **PostgreSQL** database
- **OpenAI API Key**
- **UploadThing Account**
- **Polar Account** (for subscriptions)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd careercast-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in the required values in `.env`:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   
   # Authentication
   AUTH_SECRET="your-secret-key"
   AUTH_URL="http://localhost:3000"
   
   # OpenAI
   OPENAI_API_KEY="sk-..."
   
   # UploadThing
   UPLOADTHING_SECRET="sk_..."
   UPLOADTHING_APP_ID="..."
   
   # Polar (Subscriptions)
   POLAR_ACCESS_TOKEN="..."
   POLAR_WEBHOOK_SECRET="..."
   
   # Sentry (Optional)
   SENTRY_DSN="..."
   SENTRY_AUTH_TOKEN="..."
   
   # Upstash (Rate Limiting)
   UPSTASH_REDIS_REST_URL="..."
   UPSTASH_REDIS_REST_TOKEN="..."
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   # or for production
   npx prisma migrate deploy
   ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)

## 🔄 Core Workflows

### 🎙️ Podcast Generator Flow

1. User fills out podcast form (title, description, voices, duration)
2. User selects credential (OpenAI API key)
3. User generates/selects cover image
4. Form submission triggers `createPodcast` tRPC mutation
5. Inngest job processes:
   - Generates script via OpenAI
   - Generates audio via TTS
   - Creates PDF brief
   - Uploads files to UploadThing
   - Saves to database
6. User receives notification with links

### 📄 CV Reviewer Flow

1. **Upload CV**: User uploads their CV in PDF format
2. **Select Credential**: User chooses their OpenAI API credential
3. **Paste Job Description**: User pastes the complete job description
4. **AI Analysis**: System analyzes the match and provides:
   - **Match Percentage**: Overall compatibility score (0-100%)
   - **Match Verdict**: Boolean indicating if candidate is a good fit
   - **Matched Skills**: Skills from job description found in CV
   - **Missing Skills**: Critical skills not found in CV
   - **Strengths**: 4-6 specific strengths with evidence
   - **Weaknesses**: 3-5 areas where CV falls short
   - **Recommendations**: 5-7 actionable improvements
   - **Experience Match**: Comparison of required vs. actual experience
   - **Key Highlights**: Standout achievements from CV
5. **Review Results**: User receives comprehensive analysis report

## 📡 API Reference

### tRPC Procedures

#### Public
- `getHomePodcast` - Get featured podcasts
- `getPodcastsWithPagination` - Paginated podcast list
- `singlePodcast` - Get single podcast details

#### Protected
- `getUser` - Get current user profile
- `updateUser` - Update user profile
- `getCredential` - Get user credentials
- `addCredentials` - Add new credential
- `deleteCredential` - Delete credential
- `createPodcast` - Create new podcast (Podcast Generator)
- `changePodcastStatus` - Toggle public/private

#### Premium
- `generateImage` - Generate cover image (Podcast Generator)
- `generateCVReview` - Analyze CV (CV Reviewer Pro)

#### Admin
- `allUsers` - Get all users
- `adminDashboardStats` - Dashboard statistics
- `deleteUser` - Delete user
- `getUserByAdmin` - Get user details
- `getUserPodcastsPublic` - Get user's public podcasts

### REST Endpoints

- `POST /api/generate` - Generate podcast (legacy)
- `POST /api/generate-image` - Generate image (legacy)
- `POST /api/uploadthing` - UploadThing file router
- `POST /api/auth/*` - Better Auth endpoints
- `POST /api/trpc/*` - tRPC HTTP handler
- `POST /api/polar-webhook` - Polar subscription webhooks
- `POST /api/inngest` - Inngest webhook

## 🗄️ Database Schema

### Key Models

- **User** - User accounts, subscriptions, trials
- **Podcast** - Generated podcasts with metadata (Podcast Generator)
- **Credential** - Encrypted API keys
- **CVReviewer** - CV review results (CV Reviewer)
- **Session** - User sessions
- **Account** - OAuth accounts

See `prisma/schema.prisma` for full schema.

## 🔐 Security

- ✅ Authentication with Better Auth
- ✅ Role-based access control (USER, ADMIN)
- ✅ Input validation with Zod
- ✅ Rate limiting with Upstash
- ✅ Credential encryption with Cryptr
- ✅ Protected API routes
- ✅ CSRF protection
- ✅ Error tracking with Sentry

## 🎨 Features

### User Features

**Podcast Generator:**
- Create AI-generated podcasts
- Generate cover images
- Manage podcast library
- Share podcasts
- Download PDF briefs

**CV Reviewer:**
- Upload and analyze CVs
- Get match percentage
- Receive improvement recommendations
- Track review history

**Platform:**
- Manage credentials
- Edit profile
- Subscription management
- View usage statistics

### Admin Features
- User management
- Analytics dashboard
- Content moderation
- Subscription management

## 💳 Subscription Tiers

### Free Tier
- **Podcast Generator**: 3 trial podcasts
- **CV Reviewer**: Not available

### Pro Tier
- **Podcast Generator**: Unlimited podcasts
- **CV Reviewer**: Unlimited CV reviews
- **Image Generation**: Access to DALL-E image generation
- **Priority Support**: Faster processing

## 🧪 Testing

Currently, the project does not include automated tests. Recommended additions:

- **Unit Tests**: Vitest or Jest
- **Integration Tests**: Testing Library
- **E2E Tests**: Playwright or Cypress

## 📝 Environment Variables

See `.env.example` for all required variables.

## 🐛 Troubleshooting

### Common Issues

**Prisma Client not found**
```bash
npx prisma generate
```

**UploadThing uploads failing**
- Check `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID`
- Verify file size limits

**OpenAI API errors**
- Verify API key is valid
- Check rate limits
- Ensure model names are correct

**Database connection issues**
- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running
- Run migrations: `npx prisma migrate dev`

**CV Review not working**
- Ensure you have CV Reviewer Pro subscription
- Verify credential is valid
- Check PDF format is correct

## 📚 Documentation

- [Project Analysis](./PROJECT_ANALYSIS.md) - Detailed code review and ratings
- [Notion Project Doc](./NOTION_PROJECT_DOC.md) - Comprehensive project documentation

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the development team.

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- UploadThing for file storage
- Radix UI for accessible components
- Next.js team for the amazing framework

---

**Version**: 0.1.0  
**Last Updated**: 2025  
**Status**: Active Development
