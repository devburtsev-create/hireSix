import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useHome } from '../index';
import { HomeSection } from '../components/HomeSection';
import { theme } from 'shared/theme';

/**
 * HomeScreen - Container component for the home feed
 * Manages data fetching and error handling
 * Delegates rendering to presentational components
 */
export function HomeScreen() {
  const { data, isLoading, error } = useHome();

  // Handle loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.text} testID="home-loading" />
      </View>
    );
  }

  // Handle error state
  if (error || !data?.data?.components) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Unable to load content</Text>
        <Text style={styles.errorMessage}>
          {error?.message || 'Something went wrong. Please try again.'}
        </Text>
      </View>
    );
  }

  // Render home sections
  const renderSection = ({ item }: { item: (typeof data.data.components)[0] }) => (
    <HomeSection title={item.sectionTitle} titles={item.titles} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data.data.components}
        renderItem={renderSection}
        keyExtractor={(item) => item.id}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        testID="home-sections-list"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingVertical: theme.spacing.lg,
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
