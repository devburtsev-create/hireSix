import { homeApi } from 'shared/api/endpoints';
import type { HomePageResponse } from '../types';

// Home feature API layer - handles data fetching specific to the home feature
// Wraps the shared API endpoints with feature-specific typing

export const homeFeatureApi = {
  /**
   * Fetch home page data
   * @returns Promise with typed home page response
   */
  fetchHomePage: async (): Promise<HomePageResponse> => {
    const response = await homeApi.getHomePage();
    return response.data;
  },
};
