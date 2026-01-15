import { apiClient } from './axios';

// API endpoints - pure data fetching, no business logic
// Each endpoint is a simple function that returns the HTTP request

export const homeApi = {
  // Fetch home page data
  getHomePage: () =>
    apiClient.get('https://snips-testing-data.s3.us-east-2.amazonaws.com/homePage.json'),
};

export const feedApi = {
  // Fetch feed page data
  getFeedPage: (page: number = 1) =>
    apiClient.get(`https://snips-testing-data.s3.us-east-2.amazonaws.com/FeedPage${page}.json`),
};
