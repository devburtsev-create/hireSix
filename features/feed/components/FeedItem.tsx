import { memo, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, ViewComponent } from 'react-native';
import { theme } from 'shared/theme';
import { ExpandableDescription } from './ExpandableDescription';
import { useFeedUIStore } from '../store';
import type { Snip } from '../types';
import { useVideoPlayer, VideoView } from 'expo-video';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FeedItemProps {
  snip: Snip;
  index: number;
}

/**
 * FeedItem - Memoized presentational component for a single feed item
 * Displays a full-screen TikTok-like item with video placeholder, title, and description
 *
 * Performance optimizations:
 * - Zustand selector: subscribe only to THIS snip's expanded state (not all)
 * - Memoized with custom comparator (snip.id is the key)
 * - Video playback controlled by activeSnipIndex from FeedScreen
 */
function FeedItemComponent({ snip, index }: FeedItemProps) {
  // Zustand selector optimization: only re-render if THIS snip's expanded state changes
  // Without this selector, component would re-render on ANY Zustand store change
  const isDescriptionExpanded = useFeedUIStore((state) => state.expandedSnipIds.has(snip.id));
  const toggleExpandedSnip = useFeedUIStore((state) => state.toggleExpandedSnip);

  // Read active index to determine if this item's video should play
  const activeSnipIndex = useFeedUIStore((state) => state.activeSnipIndex);
  const isActive = index === activeSnipIndex;

  // Description is cheap to compute (string concat), no need for useMemo
  const description = [
    snip.name_en,
    snip.captions_en ? `EP${snip.name_en}: ${snip.captions_en}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  // Initialize video player WITHOUT autoplay
  const player = useVideoPlayer(snip.video_playback_url, (player) => {
    player.loop = true; // Enable looping for continuous playback
  });

  // Control video playback based on visibility in the feed
  // Only play when this item is the active (visible) item
  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  return (
    <View style={styles.container}>
      {/* Video/Image placeholder */}
      <View style={styles.videoContainer}>
        <View style={styles.videoPlaceholder}>
          <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
        </View>
      </View>

      {/* Bottom overlay with content info */}
      <View style={styles.overlay}>
        {/* Title and description */}
        <View style={styles.infoSection}>
          <Text style={styles.title} numberOfLines={2}>
            {snip.id}
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
  video: { width: '100%', height: '100%' },
});
