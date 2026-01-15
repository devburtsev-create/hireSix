import { feedApi } from 'shared/api/endpoints';
import type { FeedPageResponse } from '../types';

// Feed feature API layer - handles data fetching specific to the feed feature
// Wraps the shared API endpoints with feature-specific typing

export const feedFeatureApi = {
  /**
   * Fetch a specific page of the feed
   * @param page - Page number (1-indexed)
   * @returns Promise with typed feed page response
   */
  fetchFeedPage: async (page: number = 1): Promise<FeedPageResponse> => {
    const response = await feedApi.getFeedPage(page);
    return response.data;
  },
};
