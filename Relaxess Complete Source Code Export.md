# Relaxess Complete Source Code Export

**Export Date:** June 30, 2026  
**Format:** TAR.GZ (gzip compressed)  
**File:** `relaxess-source-complete.tar.gz`  
**Size:** 2.0 MB  
**Total Files:** 206  
**Source Code Files:** 150+ (.ts, .tsx, .js, .json, .md, .css)

---

## 📦 Archive Contents

### Application Source Code

#### `/app` - React Native Screens & Navigation
- `app/_layout.tsx` - Root layout with providers
- `app/(tabs)/_layout.tsx` - Tab bar navigation
- `app/(tabs)/index.tsx` - Home screen
- `app/(tabs)/music.tsx` - Music/audio screen
- `app/(tabs)/settings.tsx` - Settings screen
- `app/session.tsx` - AI conversation screen
- `app/sleep.tsx` - Sleep mode screen
- `app/breathing.tsx` - Breathing exercise
- `app/body-scan.tsx` - Body scan exercise
- `app/grounding.tsx` - Grounding exercise
- `app/safe-place-visualization.tsx` - Visualization exercise
- `app/quiet.tsx` - Quiet relaxation screen
- `app/relaxation-tools.tsx` - Relaxation tools menu
- `app/dev/theme-lab.tsx` - Development theme lab
- `app/oauth/callback.tsx` - OAuth callback handler

#### `/components` - React Components
- `screen-container.tsx` - SafeArea wrapper component
- `themed-view.tsx` - Theme-aware view component
- `haptic-tab.tsx` - Tab with haptic feedback
- `calmspace-header.tsx` - App header component
- `global-audio-bar.tsx` - Global audio player bar
- `ui/icon-symbol.tsx` - Icon mapping component
- `ui/collapsible.tsx` - Collapsible UI component
- Additional UI components and utilities

#### `/hooks` - React Hooks
- `use-auth.ts` - Authentication hook
- `use-colors.ts` - Theme colors hook
- `use-color-scheme.ts` - Color scheme detection
- Additional custom hooks

#### `/lib` - Core Libraries & Utilities
- `app-context.tsx` - Global app context
- `theme-provider.tsx` - Theme provider
- `openai-service.ts` - OpenAI API integration
- `openai-context.tsx` - OpenAI context provider
- `audio-controller.ts` - Audio playback control
- `session-handlers.ts` - Session management
- `free-tier-limits.ts` - Free tier limitations
- `dev-testing-panel.tsx` - Development testing panel
- `i18n.ts` - Internationalization
- `utils.ts` - Utility functions
- `trpc.ts` - tRPC client
- `_core/` - Core modules (API, auth, theme, etc.)

#### `/constants` - Application Constants
- `theme.ts` - Theme configuration
- `oauth.ts` - OAuth configuration
- `const.ts` - General constants

#### `/assets` - Images & Media
- `images/icon.png` - App icon
- `images/splash-icon.png` - Splash screen icon
- `images/favicon.png` - Web favicon
- `images/android-icon-*.png` - Android adaptive icons
- `images/*.jpg` - Background images

#### `/shared` - Shared Types & Utilities
- `types.ts` - TypeScript type definitions
- `const.ts` - Shared constants
- `_core/errors.ts` - Error handling

#### `/server` - Backend Server Code
- `server/_core/index.ts` - Server entry point
- `server/_core/context.ts` - Server context
- `server/_core/env.ts` - Environment configuration
- `server/_core/auth.ts` - Authentication logic
- `server/_core/oauth.ts` - OAuth implementation
- `server/_core/llm.ts` - LLM integration
- `server/_core/imageGeneration.ts` - Image generation
- `server/_core/voiceTranscription.ts` - Voice transcription
- `server/_core/notification.ts` - Push notifications
- `server/_core/storageProxy.ts` - Storage proxy
- `server/_core/dataApi.ts` - Data API
- `server/_core/trpc.ts` - tRPC server setup
- `server/_core/systemRouter.ts` - System router
- `server/db.ts` - Database setup
- `server/routers.ts` - API routers
- `server/storage.ts` - Storage configuration
- `server/README.md` - Server documentation

#### `/drizzle` - Database Schema & Migrations
- `schema.ts` - Database schema definition
- `relations.ts` - Database relations
- `migrations/` - Database migration files

#### `/tests` - Test Files
- `auth.logout.test.ts` - Authentication tests
- Additional test files

#### `/scripts` - Build & Setup Scripts
- `generate_qr.mjs` - QR code generator
- `load-env.js` - Environment loader
- `reset-project.js` - Project reset script

#### `/references` - Reference Documentation
- `periodic-updates.md` - Periodic update guide

### Configuration Files

- `app.config.ts` - Expo app configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `babel.config.js` - Babel configuration
- `metro.config.js` - Metro bundler configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `theme.config.js` - Theme configuration
- `theme.config.d.ts` - Theme type definitions
- `drizzle.config.ts` - Drizzle ORM configuration
- `eslint.config.js` - ESLint configuration
- `.npmrc` - NPM configuration
- `.watchmanconfig` - Watchman configuration
- `.gitignore` - Git ignore rules

### Documentation Files

- `README.md` - Main project README
- `ARCHITECTURE_REFACTOR.md` - Architecture documentation
- `AUDIO_SETUP.md` - Audio setup guide
- `AUDIO_UPDATE_GUIDE.md` - Audio update guide
- `DEBUG_DARK_THEME.md` - Dark theme debugging
- `DEV_TESTING_GUIDE.md` - Development testing guide
- `GROUNDING_DESIGN.md` - Grounding exercise design
- `OPENAI_INTEGRATION.md` - OpenAI integration guide
- `SESSION_SCREEN_ARCHITECTURE.md` - Session screen architecture
- `SETTINGS_FIX_SUMMARY.md` - Settings fixes summary
- `STATUS_BAR_AREA_INSPECTION.md` - Status bar inspection
- `STATUS_BAR_FIX_SUMMARY.md` - Status bar fixes
- `STATUS_BAR_REGRESSION_FIX.md` - Status bar regression fix
- `PRIVACY_POLICY.md` - Privacy policy
- `TERMS_OF_USE.md` - Terms of use

### Global Styles

- `global.css` - Global CSS with Tailwind directives

### Type Definitions

- `expo-env.d.ts` - Expo environment types
- `nativewind-env.d.ts` - NativeWind environment types

---

## 🗂️ Directory Structure

```
relaxess-source-complete/
├── app/                          # React Native screens & navigation
│   ├── (tabs)/                   # Tab-based screens
│   ├── dev/                      # Development-only screens
│   ├── oauth/                    # OAuth callback
│   ├── *.tsx                     # Individual screens
│   └── _layout.tsx               # Root layout
├── components/                   # Reusable React components
│   ├── ui/                       # UI components
│   └── *.tsx                     # Component files
├── hooks/                        # Custom React hooks
├── lib/                          # Core libraries & utilities
│   ├── _core/                    # Core modules
│   └── *.ts                      # Library files
├── constants/                    # Application constants
├── assets/                       # Images and media
│   └── images/                   # Image assets
├── server/                       # Backend server code
│   ├── _core/                    # Core server modules
│   ├── db.ts                     # Database setup
│   ├── routers.ts                # API routers
│   └── README.md                 # Server documentation
├── drizzle/                      # Database schema & migrations
│   ├── schema.ts                 # Schema definition
│   ├── relations.ts              # Relations
│   └── migrations/               # Migration files
├── shared/                       # Shared types & utilities
├── tests/                        # Test files
├── scripts/                      # Build & setup scripts
├── references/                   # Reference documentation
├── app.config.ts                 # Expo configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.js            # Tailwind config
├── theme.config.js               # Theme config
├── babel.config.js               # Babel config
├── metro.config.js               # Metro config
├── drizzle.config.ts             # Drizzle config
├── eslint.config.js              # ESLint config
├── global.css                    # Global styles
├── README.md                     # Project README
└── [documentation files]         # Various .md files
```

---

## 📋 File Statistics

| Category | Count |
|----------|-------|
| Total Files | 206 |
| TypeScript/TSX Files | 80+ |
| JavaScript Files | 15+ |
| JSON Files | 10+ |
| Markdown Files | 20+ |
| CSS Files | 5+ |
| Image Files | 10+ |
| Configuration Files | 15+ |
| Other Files | 40+ |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ or 20+
- pnpm 9.x (or npm/yarn)
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation

1. **Extract the archive:**
   ```bash
   tar -xzf relaxess-source-complete.tar.gz
   cd calmspace
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Configure environment:**
   Create a `.env.local` file with your configuration (API keys, database URL, etc.)

4. **Start development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Run on specific platform:**
   ```bash
   pnpm ios      # iOS simulator
   pnpm android  # Android emulator
   pnpm web      # Web browser
   ```

### Available Scripts

```bash
pnpm dev              # Start development server
pnpm dev:server       # Start backend server only
pnpm dev:metro        # Start Metro bundler only
pnpm build            # Build for production
pnpm start            # Start production server
pnpm check            # Type check
pnpm lint             # Run linter
pnpm format           # Format code
pnpm test             # Run tests
pnpm db:push          # Push database schema
pnpm android          # Run on Android
pnpm ios              # Run on iOS
pnpm qr               # Generate QR code
```

---

## 🔧 Technology Stack

### Frontend
- **React Native 0.81** - Mobile framework
- **Expo SDK 54** - Development platform
- **Expo Router 6** - Navigation
- **React 19** - UI library
- **TypeScript 5.9** - Type safety
- **NativeWind 4** - Tailwind CSS for React Native
- **React Native Reanimated 4** - Animations
- **TanStack React Query** - Data fetching

### Backend
- **Express.js** - Web server
- **tRPC** - Type-safe API
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database

### AI & Services
- **OpenAI API** - AI conversations
- **AWS S3** - Audio streaming
- **Expo Notifications** - Push notifications

### Development
- **Metro** - React Native bundler
- **Tailwind CSS** - Utility-first CSS
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Testing framework

---

## 🔐 Environment Configuration

The project requires environment variables for configuration. Key variables include:

- `OPENAI_API_KEY` - OpenAI API key
- `DATABASE_URL` - PostgreSQL database URL
- `AWS_ACCESS_KEY_ID` - AWS credentials
- `AWS_SECRET_ACCESS_KEY` - AWS credentials
- `EXPO_PUBLIC_API_URL` - Backend API URL

Refer to the server documentation for complete configuration details.

---

## 📱 Features Included

- ✅ AI-powered conversations
- ✅ Guided relaxation exercises
- ✅ Ambient audio streaming
- ✅ Sleep mode
- ✅ Mood tracking
- ✅ Premium subscriptions
- ✅ Dark mode support
- ✅ Internationalization (i18n)
- ✅ Push notifications
- ✅ User authentication
- ✅ Local data persistence
- ✅ Voice input support

---

## 🎯 Project Structure Notes

### Key Directories

**`/app`** - All React Native screens and navigation logic. Uses Expo Router for file-based routing.

**`/components`** - Reusable React components including UI elements, headers, and global components.

**`/lib`** - Core application logic including OpenAI integration, audio control, theme management, and utilities.

**`/server`** - Backend server code with tRPC API, database setup, and third-party integrations.

**`/drizzle`** - Database schema, relations, and migrations using Drizzle ORM.

**`/hooks`** - Custom React hooks for authentication, theming, and color management.

**`/constants`** - Application-wide constants and configuration values.

**`/assets`** - Static assets including images, icons, and splash screens.

---

## 🔍 What's Included

### ✅ Complete Source Code
- All React Native screens and components
- Full backend server implementation
- Database schema and migrations
- OpenAI integration
- Audio streaming setup
- Authentication system
- Theme system
- Internationalization

### ✅ Configuration Files
- Expo app configuration
- TypeScript configuration
- Tailwind CSS configuration
- Database configuration
- ESLint and Prettier configuration

### ✅ Documentation
- Architecture documentation
- Setup guides
- Integration guides
- Feature documentation

### ✅ Development Tools
- Build scripts
- QR code generator
- Environment loader
- Test files

---

## ❌ What's NOT Included

The following are intentionally excluded to reduce archive size:

- `node_modules/` - Install with `pnpm install`
- `.expo/` - Generated by Expo CLI
- `.manus-logs/` - Development logs
- `dist/` - Build output
- `build/` - Build artifacts
- `.git/` - Git history
- `*.log` - Log files

These will be generated automatically when you run `pnpm install` and `pnpm dev`.

---

## 🚨 Important Notes

1. **Dependencies:** Run `pnpm install` immediately after extraction to install all dependencies.

2. **Environment Variables:** Configure `.env.local` with your API keys and database URL before running the app.

3. **Database:** Set up your PostgreSQL database and run migrations with `pnpm db:push`.

4. **Backend Server:** The backend server runs on port 3000 by default. Configure the API URL in environment variables.

5. **Development:** Use `pnpm dev` to start both the Metro bundler and backend server concurrently.

---

## 📞 Support

For questions about the project structure or setup, refer to:
- `README.md` - Main project documentation
- `server/README.md` - Backend server documentation
- Individual `.md` files for specific features

---

## ✨ Status

**Export Status:** ✅ COMPLETE  
**Source Code:** ✅ FULL  
**Configuration:** ✅ INCLUDED  
**Documentation:** ✅ INCLUDED  
**Ready to Run:** ✅ YES

---

**Export Date:** June 30, 2026  
**Version:** 1.0.0  
**Archive:** relaxess-source-complete.tar.gz (2.0 MB)

This is a complete, production-ready source code export ready for local development, GitHub upload, or team collaboration.
