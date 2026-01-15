import { memo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from 'shared/theme';
import { ExpandableDescription } from './ExpandableDescription';
import { useFeedUIStore } from '../store';
import type { Snip } from '../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FeedItemProps {
  snip: Snip;
  index: number;
}

/**
 * FeedItem - Memoized presentational component for a single feed item
 * Displays a full-screen TikTok-like item with video placeholder, title, and description
 *
 * Uses Zustand for UI state (expanded descriptions)
 */
function FeedItemComponent({ snip }: FeedItemProps) {
  // Get Zustand store hooks for expanded snips and toggle action
  const expandedSnipIds = useFeedUIStore((state) => state.expandedSnipIds);
  const toggleExpandedSnip = useFeedUIStore((state) => state.toggleExpandedSnip);

  const isDescriptionExpanded = expandedSnipIds.has(snip.id);

  // Build description from available metadata
  const description = [
    snip.titleName,
    snip.episodeName ? `EP${snip.episodeNumber}: ${snip.episodeName}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <View style={styles.container}>
      {/* Video/Image placeholder */}
      <View style={styles.videoContainer}>
        <View style={styles.videoPlaceholder}>
          <Text style={styles.videoPlaceholderText}>
            {snip.titleName.slice(0, 2).toUpperCase()}
          </Text>
          <Text style={styles.durationText}>{snip.duration}s</Text>
        </View>
      </View>

      {/* Bottom overlay with content info */}
      <View style={styles.overlay}>
        {/* Title and description */}
        <View style={styles.infoSection}>
          <Text style={styles.title} numberOfLines={2}>
            {snip.titleName}
          </Text>
          {description && (
            <ExpandableDescription
              text={description}
              snipId={snip.id}
              isExpanded={isDescriptionExpanded}
              onToggle={toggleExpandedSnip}
            />
          )}
        </View>

        {/* Action buttons (mocked, not clickable) */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} disabled>
            <Text style={styles.actionLabel}>❤️</Text>
            <Text style={styles.actionText}>1.2K</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} disabled>
            <Text style={styles.actionLabel}>💬</Text>
            <Text style={styles.actionText}>342</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} disabled>
            <Text style={styles.actionLabel}>↗️</Text>
            <Text style={styles.actionText}>89</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} disabled>
            <Text style={styles.actionLabel}>🔖</Text>
            <Text style={styles.actionText}>45</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Memoize to prevent unnecessary re-renders during scroll
export const FeedItem = memo(FeedItemComponent, (prev, next) => {
  return prev.snip.id === next.snip.id && prev.index === next.index;
});

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    backgroundColor: theme.colors.background,
    position: 'relative',
  },
  videoContainer: {
    flex: 1,
    width: '100%',
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderText: {
    ...theme.typography.h1,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  durationText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing['2xl'],
  },
  infoSection: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionLabel: {
    fontSize: 20,
    marginBottom: theme.spacing.xs,
  },
  actionText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
});
