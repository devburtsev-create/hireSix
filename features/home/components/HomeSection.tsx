import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { theme } from 'shared/theme';
import type { Title } from '../types';

interface HomeSectionProps {
  title: string;
  titles: Title[];
}

/**
 * Presentational component for a single home section
 * Displays a section title and a horizontal list of content titles
 */
export function HomeSection({ title, titles }: HomeSectionProps) {
  const renderTitle = ({ item }: { item: Title }) => (
    <View style={styles.titleContainer}>
      {item.posterUrl && (
        <View style={styles.poster}>
          <Image source={{ uri: item.posterUrl }} style={styles.posterImage} resizeMode="cover" />
        </View>
      )}

      <View className="items-end justify-end">
        <Text style={styles.genre} numberOfLines={2}>
          {item.genres.join(' ') || 'N/A'}
        </Text>
        <Text style={styles.titleText}>{item.nameEn}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={titles}
        renderItem={renderTitle}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: theme.spacing['2xl'],
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  listContent: {
    paddingRight: theme.spacing.lg,
  },
  titleContainer: {
    marginRight: theme.spacing.lg,
    width: 120,
  },
  poster: {
    width: '100%',
    aspectRatio: 0.7,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterImage: {
    borderRadius: 12,
    width: '100%',
    height: '100%',
  },
  posterPlaceholder: {
    ...theme.typography.h2,
    color: theme.colors.textSecondary,
  },
  titleText: {
    ...theme.typography.caption,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  genre: {
    ...theme.typography.caption,
    textTransform: 'uppercase',
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
});
