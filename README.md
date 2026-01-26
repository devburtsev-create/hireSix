# hireSix Mobile App

A production-quality React Native mobile app built with Expo, demonstrating clean architecture, performance optimization, and modern state management patterns.

## Overview

A two-screen mobile application featuring:

- **Home Screen**: Curated content collections in horizontal scrolling sections
- **Feed Screen**: TikTok-like vertical feed with infinite pagination

Focus areas: clean code, performance optimization, and maintainable architecture.

## Tech Stack & Reasoning

### Core Framework

- **Expo (managed workflow)** — Rapid development without build complexity. Suitable for content-driven apps.
- **React Native 0.81.5** — Cross-platform development with native performance.
- **TypeScript** — Type safety reduces bugs, improves IDE support, scales with team size.

### State Management

- **TanStack Query v5** — Server state only. Handles caching, pagination, background updates automatically.
  - Chosen over Redux: simpler, reduces boilerplate, perfect for API-driven apps
- **Zustand v5** — Client/UI state only (expanded descriptions, active index).
  - Chosen over Context: fine-grained reactivity via selectors prevents unnecessary re-renders

### Performance & Rendering

- **FlashList (@shopify/flash-list)** — Replaces FlatList for smooth, optimized virtualization.
  - Used for both Home and Feed screens. Estimated item sizes provided for accuracy.
- **React Navigation** — Minimal bundle addition, solid tab/stack navigation patterns.
- **Memoization** — Strategic memo() with custom comparators, useCallback for expensive handlers.

### API & HTTP

- **Axios** — Lightweight HTTP client with interceptor support for future auth/error handling.
- **Shared axios instance** — Single configuration point, no logic duplication.

### Styling

- **NativeWind + Tailwind** — CSS-in-JS alternative with theme tokens (colors, spacing, typography).
- **StyleSheet.create()** — For complex layouts and performance (static optimization).

### Animations

- **LayoutAnimation** — Built-in React Native for simple layout transitions (expand/collapse).
  - Chosen over Reanimated: zero dependency overhead for non-gesture animations.

## Architecture

### Feature-Based Structure

```
features/
├── home/
│   ├── types.ts              # TypeScript interfaces
│   ├── api/index.ts          # Feature API wrapper
│   ├── hooks/useHome.ts      # React Query hook
│   ├── components/           # Presentational components
│   ├── screens/home-screen.tsx
│   └── store/                # (if needed, currently uses hooks)
│
├── feed/
│   ├── types.ts
│   ├── api/index.ts
│   ├── hooks/useFeed.ts      # Infinite query with getNextPageParam
│   ├── store/index.ts        # Zustand UI state
│   ├── components/
│   │   ├── FeedItem.tsx      # Memoized, uses Zustand selector
│   │   └── ExpandableDescription.tsx
│   └── screens/feed-screen.tsx

shared/
├── api/
│   ├── axios.ts              # Configured HTTP client
│   └── endpoints.ts          # Pure data-fetching functions
├── theme/                    # Design tokens (colors, spacing, typography)
```

### Data Flow Philosophy

**Server Data** (React Query):

```
Shared Axios Instance
    ↓
Endpoints (pure HTTP calls)
    ↓
Feature API wrapper (typing)
    ↓
React Query hook (caching, pagination)
    ↓
Container Component (data management)
    ↓
Presentational Component (UI only)
```

**UI State** (Zustand):

```
Zustand store (global UI state)
    ↓ (fine-grained selectors)
Component subscribes to relevant slice
    ↓
Local state updates trigger re-renders only for affected components
```

**Key Principle**: Never store server data in Zustand. React Query handles caching, invalidation, and background updates.

### Performance Optimizations

1. **Zustand Selectors** — Components subscribe to specific snip state, not entire store
2. **FlashList estimatedItemSize** — Accurate virtualization calculation
3. **Memoization** — FeedItem uses custom memo comparator (snip.id-based)
4. **Avoid useMemo bloat** — Description string concat is cheap; useCallback only for animation handler
5. **No inline functions** — keyExtractor and renderItem are stable references

## How to Run

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator or Android Emulator (or EAS Go for preview)

### Installation

```bash
cd my-expo-app
npm install
```

### Development

```bash
# Start Expo server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Web preview
npm run web
```

### Linting & Formatting

```bash
# Check lint + formatting
npm run lint

# Auto-fix + format
npm run format
```

### Build for Production

```bash
# Prebuild native code (if ejecting from managed)
npm run prebuild

# EAS Build (recommended for Expo projects)
eas build --platform ios --platform android
```

## API Endpoints

Data sourced from AWS S3 (test/demo):

- **Home**: `https://snips-testing-data.s3.us-east-2.amazonaws.com/homePage.json`
- **Feed**: `https://snips-testing-data.s3.us-east-2.amazonaws.com/FeedPage{page}.json`

Endpoints are immutable; API responses define the data structure.

## Assumptions Made

### Product/Business

1. **No authentication required** — Data is public, no user login implemented
2. **S3 URLs are stable** — Content URLs won't change; caching is safe
3. **Pagination is simple** — Feed has `hasMore` flag; no cursor-based pagination needed
4. **Content is short-lived** — Stale time of 5 minutes is acceptable for this use case

### Technical

1. **TypeScript is strict** — No `any` types; better IDE support and onboarding
2. **React Query v5 is preferred** — Modern API with breaking changes from v4 acceptable
3. **Expo managed workflow** — No custom native modules needed; EAS for builds
4. **Mobile-first** — Web/desktop not a priority
5. **Bundle size matters** — Avoid large dependencies; Zustand chosen over Redux for this reason

### Performance

1. **Full-screen paging** — Feed designed as TikTok-like, vertical paging (estimatedItemSize = 800)
2. **Memoization justified** — Each re-render from Zustand would be expensive at 60+ fps
3. **No real video playback** — Video placeholders only; actual playback would need VideoView wrapper

### UI/UX

1. **Accessibility basic** — hitSlop on buttons, proper contrast, no performance-critical animations
2. **Offline not supported** — React Query caching helps, but no offline-first sync
3. **Error states simple** — Generic error messages; no retry logic (could be added)



## License

Proprietary — hireSix
