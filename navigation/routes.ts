// Navigation route names
// Organized by navigator type for easy reference

export const ROOT_ROUTES = {
  BOTTOM_TABS: 'BottomTabs',
} as const;

export const BOTTOM_TAB_ROUTES = {
  HOME: 'HomeTab',
  FEED: 'FeedTab',
} as const;

export const HOME_STACK_ROUTES = {
  HOME_SCREEN: 'HomeScreen',
} as const;

export const FEED_STACK_ROUTES = {
  FEED_SCREEN: 'FeedScreen',
} as const;

// Export all routes as a single object for easier access
export const ROUTES = {
  ...ROOT_ROUTES,
  ...BOTTOM_TAB_ROUTES,
  ...HOME_STACK_ROUTES,
  ...FEED_STACK_ROUTES,
} as const;
