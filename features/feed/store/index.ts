import { create } from 'zustand';

/**
 * Feed UI Store
 *
 * PURPOSE: Store ONLY UI/client state that React Query cannot manage
 * - NOT server data (React Query handles that)
 * - IS local UI state, preferences, transient UI flags
 *
 * When to use Zustand vs React Query:
 * - Zustand: UI state (expanded descriptions, active index, liked state)
 * - React Query: Server data (snips, paginated content)
 */

interface FeedUIStore {
  // Expanded description IDs - which snip descriptions are expanded
  expandedSnipIds: Set<string>;
  toggleExpandedSnip: (snipId: string) => void;

  // Current active snip index - useful for analytics and navigation
  activeSnipIndex: number;
  setActiveSnipIndex: (index: number) => void;

  // Reset all UI state (e.g., when navigating away from feed)
  reset: () => void;
}

/**
 * Zustand store for feed UI state
 * Uses Set for O(1) lookups on expanded snips
 * Kept minimal - only UI state, no data
 *
 * Performance note:
 * - Selectors required in components to prevent unnecessary re-renders
 * - Use: useFeedUIStore((state) => state.expandedSnipIds.has(snipId))
 * - NOT: useFeedUIStore((state) => state.expandedSnipIds)
 */
export const useFeedUIStore = create<FeedUIStore>((set) => ({
  // Initial state
  expandedSnipIds: new Set(),
  activeSnipIndex: 0,

  // Actions
  toggleExpandedSnip: (snipId: string) =>
    set((state) => {
      const expanded = new Set(state.expandedSnipIds);
      if (expanded.has(snipId)) {
        expanded.delete(snipId);
      } else {
        expanded.add(snipId);
      }
      return { expandedSnipIds: expanded };
    }),

  setActiveSnipIndex: (index: number) => set({ activeSnipIndex: index }),

  reset: () =>
    set({
      expandedSnipIds: new Set(),
      activeSnipIndex: 0,
    }),
}));
