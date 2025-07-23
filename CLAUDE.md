# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Pokécardmaker.net**, a Next.js application that allows users to create custom Pokémon cards in the modern Sword and Shield format. The application supports various card types including Pokémon-V, V-Max, and Full Art Trainers.

## Development Commands

**Primary development workflow:**
```bash
npm install          # Install dependencies
npm start           # Start development server (runs create:data first)
npm run dev         # Alternative to npm start
npm run build       # Production build (runs create:data first)
npm run typecheck   # Validate TypeScript types
npm run lint        # Lint the codebase
npm run lint:fix    # Fix linting errors automatically
```

**Asset and data management:**
```bash
npm run create:data      # Generate card image path arrays (required after adding new card assets)
npm run optimize:images  # Optimize images in assets folder
```

## Architecture Overview

The codebase follows **Domain-Driven Design (DDD)** with feature-based organization:

### Core Architectural Layers
- **`src/domain/`** - Business entities, value objects, and domain logic
- **`src/application/`** - Commands and queries following CQRS pattern  
- **`src/infrastructure/`** - Database, auth, and external service adapters
- **`src/features/`** - Self-contained feature modules

### Main Feature: Card Editor (`src/features/cardEditor/`)
The card editor is split into three coordinated modules:
- **`cardLogic/`** - Business rules and card mechanics calculations
- **`cardOptions/`** - Form state management and user input handling
- **`cardStyles/`** - Visual presentation and card template styling

### State Management
Uses **Zustand** for all state management with these main stores:
- `useCardOptionsStore` - Main card data and form state
- `useCardLogicStore` - Business logic and calculations
- `useCardStylesStore` - Visual styling and templates  
- `useSettingsStore` - Application settings

## TypeScript Path Aliases

The project uses comprehensive path aliases defined in `tsconfig.json`:
```typescript
"@cardEditor/*": ["src/features/cardEditor/*"]
"@features/*": ["src/features/*"]
"@components/*": ["src/components/*"]
"@hooks/*": ["src/hooks/*"]
"@utils/*": ["src/utils/*"]
"@assets/*": ["public/assets/*"]
"@/*": ["src/*"]
```

## Adding New Card Assets

When adding new card types, icons, or templates:

1. **Add data definition** to appropriate data file (e.g., `src/features/cardEditor/cardOptions/setIcon/data.ts`)
2. **Add PNG image** to correct folder in `public/assets/`
3. **Ensure filename matches** the `slug` from step 1
4. **Run `npm run create:data`** to refresh image path arrays
5. **Restart dev server** to see changes

**Important:** Card images must follow the specific folder structure in `public/assets/cards/baseSets/` as the system automatically discovers images based on this hierarchy.

## Environment Setup

Copy `.env.example` to `.env` and configure:
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Authentication secret key
- `GEMINI_API_KEY` - Required for AI image generation feature
- Avoid setting `NEXT_PUBLIC_GTM_ID` during development

## Key Technologies

- **Next.js 12** with SSR/SSG
- **React 17** with TypeScript
- **MUI (Material-UI)** for components
- **Emotion** for CSS-in-JS styling
- **Zustand** for state management
- **NextAuth** for authentication
- **PostgreSQL** with Prisma ORM
- **Stripe** for payments