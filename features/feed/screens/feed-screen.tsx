import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useFeed, getFlatSnips } from '../index';
import { FeedItem } from '../components/FeedItem';
import { theme } from 'shared/theme';
import { getFeedPaginationMetadata } from '../hooks/useFeed';
/**
 * FeedScreen - Container component for TikTok-like vertical feed
 * Manages infinite scroll pagination and error handling
 * Delegates rendering to memoized FeedItem components
 * Uses FlashList for optimized performance with full-screen paging
 */
export function FeedScreen() {
  // Fetch paginated feed data with infinite scroll support
  const { data, isLoading, error, hasNextPage, fetchNextPage } = useFeed();

  // Flatten all pages into a single array for list rendering
  // data.pages = [FeedPageData, FeedPageData, ...] → snips = [Snip, Snip, ...]
  const snips = getFlatSnips(data);

  // Get pagination metadata for debugging (optional)
  const paginationInfo = getFeedPaginationMetadata(data);

  // Handle loading state
  if (isLoading && !data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.text} testID="feed-loading" />
      </View>
    );
  }

  // Handle error state
  if (error && !data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Unable to load feed</Text>
        <Text style={styles.errorMessage}>
          {error?.message || 'Something went wrong. Please try again.'}
        </Text>
      </View>
    );
  }

  // Handle empty state
  if (snips.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>No content available</Text>
        <Text style={styles.errorMessage}>Check back later for more snips</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={snips ?? []}
        // Memoized renderItem: prevents new function creation on every FeedScreen render
        renderItem={({ item, index }) => <FeedItem snip={item} index={index} />}
        keyExtractor={(item) => item.id}
        scrollEventThrottle={16}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },
  errorTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  errorMessage: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
