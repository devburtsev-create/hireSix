import axios from 'axios';

// Shared axios instance with common configuration
// No business logic here - only HTTP client setup
export const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors can be added here for global error handling,
// auth tokens, request/response transformation, etc.
