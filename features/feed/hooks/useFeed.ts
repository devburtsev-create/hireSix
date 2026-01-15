import { useInfiniteQuery } from '@tanstack/react-query';
import { feedFeatureApi } from '../api';
import type { FeedPageResponse, Snip } from '../types';

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
  return useInfiniteQuery<FeedPageResponse, Error>({
    queryKey: feedQueryKeys.infinite(),
    queryFn: ({ pageParam = 1 }) => feedFeatureApi.fetchFeedPage(pageParam as number),
    getNextPageParam: (lastPage) => {
      // Return next page number if hasMore, otherwise undefined to stop fetching
      return lastPage.data.hasMore ? lastPage.data.pageNumber + 1 : undefined;
    },
    initialPageParam: 1,
    // Reasonable defaults for mobile infinite scroll
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });
}

/**
 * Helper to flatten paginated feed data into a single array of snips
 * Useful for FlatList rendering
 *
 * @param data - Data from useInfiniteQuery
 * @returns Flattened array of all snips
 */
export function getFlatSnips(data: ReturnType<typeof useFeed>['data']): Snip[] {
  if (!data?.pages) return [];
  return data.pages.flatMap((page) => page.data.items.flatMap((item) => item.snips));
}
