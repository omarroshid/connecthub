# Somali Cameo-Style App Monorepo

This is the monorepo starter for the Somali Cameo-Style app—a platform connecting Somali celebrities and influencers to their fans for paid personalized video shoutouts, calls, and more.

## 🏗️ Directory Structure

```
somali-cameo/
├── apps/
│   ├── web/           # Next.js (web frontend)
│   ├── mobile/        # React Native (mobile app, Expo)
│   └── api/           # Node.js/Express (backend API)
├── packages/
│   ├── ui/            # Shared UI components (web/mobile)
│   └── types/         # Shared TypeScript types/interfaces
├── .env.example       # Environment config template
├── package.json       # Monorepo/workspaces, shared scripts
├── README.md          # This file
```

---

## 🚀 Getting Started

1. **Clone the repo:**
   ```sh
   git clone <your-repo-url>
   cd somali-cameo
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```
3. **Copy & configure local environment:**
   ```sh
   cp .env.example .env
   # Edit .env with your own secrets and config
   ```
4. **Start each app (in separate terminals):**
   - Web:
     ```sh
     cd apps/web && npm run dev
     ```
   - Mobile:
     ```sh
     cd apps/mobile && npm run start
     ```
   - API:
     ```sh
     cd apps/api && npm run dev
     ```

## 📦 Key Packages & Tech
- Next.js 14 (apps/web)
- React Native w/ Expo (apps/mobile)
- Express & TypeScript (apps/api)
- PostgreSQL w/ Prisma ORM
- Cloudinary for storage (future)
- Stripe & Somali wallet integrations (mock for MVP)
- Firebase Auth
- Shared Types & UI via packages/

## 🌐 Localization
Supports English, Somali, Arabic. Switch language in-app (see `i18n` folder in frontend/apps).

---

## 👥 User Roles
- Fans: Book personalized messages
- Creators: Offer video/call/message shoutouts, manage bookings
- Admin: Onboard creators, oversee payments, dispute management

---

## 🛠️ Contributing
- Install all deps from repo root
- Make all PRs atomic & clear
- Share types/interfaces in `packages/types`

---

Start with one app (web, api, or mobile), then grow and connect! Follow this README and app-specific docs for guidance.
