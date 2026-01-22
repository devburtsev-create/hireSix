import { memo, useEffect, useRef, useState, useCallback } from 'react';
import { Dimensions, StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native';
import { theme } from 'shared/theme';
import { ExpandableDescription } from './ExpandableDescription';
import { useFeedUIStore } from '../store';
import type { Snip } from '../types';
import { useVideoPlayer, VideoView } from 'expo-video';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();

  // Zustand selector optimization: only re-render if THIS snip's expanded state changes
  // Without this selector, component would re-render on ANY Zustand store change
  const isDescriptionExpanded = useFeedUIStore((state) => state.expandedSnipIds.has(snip.id));
  const toggleExpandedSnip = useFeedUIStore((state) => state.toggleExpandedSnip);

  // Read active index to determine if this item's video should play
  const activeSnipIndex = useFeedUIStore((state) => state.activeSnipIndex);
  const isActive = index === activeSnipIndex;

  // Track if video is paused due to long-press (to resume correctly on press out)
  const [isPausedByLongPress, setIsPausedByLongPress] = useState(false);
  const [isScreenFocused, setIsScreenFocused] = useState(true);
  const playerRef = useRef<ReturnType<typeof useVideoPlayer> | null>(null);

  // Description is cheap to compute (string concat), no need for useMemo
  const description = snip?.captions_en;

  // Initialize video player WITHOUT autoplay
  const player = useVideoPlayer(snip.video_playback_url, (player) => {
    player.loop = true; // Enable looping for continuous playback
  });

  // Store player reference for long-press handling
  playerRef.current = player;

  // Control video playback based on visibility in the feed
  // Only play when this item is the active (visible) item AND not paused by long-press AND screen is focused
  useEffect(() => {
    if (isActive && !isPausedByLongPress && isScreenFocused) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, isPausedByLongPress, isScreenFocused, player]);

  // Detect when screen comes into focus or loses focus
  // Pause all videos when leaving screen, resume active video when returning
  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);
      return () => {
        setIsScreenFocused(false);
        // Pause video when leaving the screen
        playerRef.current?.pause();
      };
    }, [])
  );

  // Handle long press: pause video while holding
  const handleLongPressIn = () => {
    setIsPausedByLongPress(true);
    playerRef.current?.pause();
  };

  // Handle press out: resume video if it should be playing
  const handlePressOut = () => {
    setIsPausedByLongPress(false);
    // Video will automatically resume via useEffect if isActive is true
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <Pressable
        onLongPress={handleLongPressIn}
        onPressOut={handlePressOut}
        style={styles.container}>
        {/* Video */}
        <View style={styles.videoContainer}>
          <View style={styles.videoPlaceholder}>
            <VideoView
              style={styles.video}
              nativeControls={false}
              player={player}
              allowsPictureInPicture
            />
          </View>
        </View>

        {/* Back Button - Top Left */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>

        {/* Left side: Title, Description, Watch Now Button */}
        <View style={styles.leftOverlay}>
          <View style={styles.contentWrapper}>
            {/* Title */}
            <Text style={styles.title} numberOfLines={2}>
              {snip.name_en}
            </Text>

            {/* Description */}
            {description && (
              <ExpandableDescription
                text={description}
                snipId={snip.id}
                isExpanded={isDescriptionExpanded}
                onToggle={toggleExpandedSnip}
              />
            )}

            {/* Watch Now Button */}
            <TouchableOpacity style={styles.watchButton} activeOpacity={0.8}>
              <Text style={styles.watchButtonIcon}>▶</Text>
              <Text style={styles.watchButtonText}>Watch Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right side: Action Buttons */}
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionEmoji}>🔖</Text>
            <Text style={styles.actionCount}>2.4 k</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionEmoji}>≡</Text>
            <Text style={styles.actionCount}>Episodes</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

// Memoize to prevent unnecessary re-renders during scroll
export const FeedItem = memo(FeedItemComponent, (prev, next) => {
  return prev.snip.id === next.snip.id && prev.index === next.index;
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: theme.colors.background,
    position: 'relative',
  },
  videoContainer: {
    flex: 1,
    width: '100%',
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },

  // Back button - top left
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
  },

  // Left overlay - title, description, button
  leftOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 60,
    backgroundColor: 'transparent',
  },
  contentWrapper: {
    padding: theme.spacing.lg,
    paddingRight: theme.spacing.md,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontWeight: '700',
  },

  // Watch Now Button
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF1744',
    borderRadius: theme.radius.full,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  watchButtonIcon: {
    fontSize: 16,
    color: '#fff',
    marginRight: 8,
    fontWeight: '700',
  },
  watchButtonText: {
    ...theme.typography.button,
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  // Right side action buttons
  rightActions: {
    position: 'absolute',
    right: 12,
    bottom: 120,
    width: 50,
    justifyContent: 'flex-end',
    gap: theme.spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionCount: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
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
  infoSection: {
    marginBottom: theme.spacing.lg,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
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
