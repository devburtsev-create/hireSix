import { useQuery } from '@tanstack/react-query';
import { homeFeatureApi } from '../api';
import type { HomePageResponse } from '../types';

// Query keys for home feature - used for cache management
const homeQueryKeys = {
  all: ['home'] as const,
  page: () => [...homeQueryKeys.all, 'page'] as const,
};

/**
 * Hook to fetch home page data using React Query
 * Handles loading, error, and data states automatically
 *
 * Usage:
 * const { data, isLoading, error } = useHome();
 */
export function useHome() {
  return useQuery<HomePageResponse, Error>({
    queryKey: homeQueryKeys.page(),
    queryFn: homeFeatureApi.fetchHomePage,
    // Reasonable defaults for mobile app
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });
}
