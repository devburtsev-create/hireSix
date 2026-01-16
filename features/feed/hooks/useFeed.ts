import { useInfiniteQuery } from '@tanstack/react-query';
import { feedFeatureApi } from '../api';
import type { FeedPageData, Snip } from '../types';

// Query keys for feed feature - used for cache management
const feedQueryKeys = {
  all: ['feed'] as const,
  infinite: () => [...feedQueryKeys.all, 'infinite'] as const,
};

/**
 * Hook to fetch feed pages with infinite scroll support
 * Automatically flattens paginated data into a continuous feed
 *
 * Usage:
 * const { data, hasNextPage, fetchNextPage, isLoading, error } = useFeed();
 */
export function useFeed() {
  return useInfiniteQuery<FeedPageData, Error>({
    queryKey: feedQueryKeys.infinite(),
    queryFn: ({ pageParam = 1 }) => feedFeatureApi.fetchFeedPage(pageParam as number),
    getNextPageParam: (lastPage) => {
      // Return next page number if hasMore, otherwise undefined to stop fetching
      return lastPage?.nextPage ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    // Reasonable defaults for mobile infinite scroll
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });
}

/**
 * Helper to flatten paginated feed data into a single array of snips
 * Efficiently flattens all pages into a continuous array for list rendering
 * Handles null/undefined safely
 *
 * @param data - Data from useInfiniteQuery
 * @returns Flattened array of all snips across all pages
 */
export function getFlatSnips(data: ReturnType<typeof useFeed>['data'] | undefined): Snip[] {
  return data?.pages?.flatMap((page) => page?.feedTitles ?? []) ?? [];
}

/**
 * Helper to get pagination metadata from feed data
 * Useful for debugging and handling edge cases
 *
 * @param data - Data from useInfiniteQuery
 * @returns Object with pagination info (currentPage, totalPages, total)
 */
export function getFeedPaginationMetadata(
  data: ReturnType<typeof useFeed>['data'] | undefined
): { currentPage: number; totalPages: number; total: number } | null {
  const lastPage = data?.pages?.[data.pages.length - 1];
  if (!lastPage) return null;
  return {
    currentPage: lastPage.currentPage,
    totalPages: lastPage.totalPages,
    total: lastPage.total,
  };
}
