/\*\*

- Home Feature Architecture
-
- Data Flow:
- ─────────
-
- Shared API (axios)
-     ↓
- shared/api/endpoints.ts (HTTP layer)
-     ↓
- features/home/api/index.ts (Feature-specific API wrapper)
-     ↓
- features/home/hooks/useHome.ts (React Query hook - caching, loading, error)
-     ↓
- HomeScreen (Container - manages data & error states)
-     ↓
- HomeSection (Presentational - renders section with horizontal list)
-
- Key Principles:
- ──────────────
- 1.  Zero business logic in components - only data fetching and rendering
- 2.  React Query handles caching and background updates
- 3.  StyleSheet + theme tokens for consistent styling
- 4.  FlatList used for performance with large lists
- 5.  Error and loading states handled at container level
- 6.  Presentational components are pure and reusable
      \*/
