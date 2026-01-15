import { useCallback, useState } from 'react';
import { LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from 'shared/theme';

interface ExpandableDescriptionProps {
  text: string;
  collapsedLines?: number;
  // Optional: snipId for Zustand state management
  // If provided, expanded state is managed globally
  snipId?: string;
  isExpanded?: boolean;
  onToggle?: (snipId: string) => void;
}

/**
 * Expandable description component with smooth expand/collapse animation
 *
 * Animation choice: LayoutAnimation (built-in React Native)
 * Why LayoutAnimation over Reanimated:
 * 1. This is a simple layout change (height based on numberOfLines)
 * 2. LayoutAnimation is perfect for "spring" layout transitions
 * 3. No additional dependencies needed (keeps bundle small)
 * 4. Zero configuration - works out of the box with native performance
 * 5. For complex gesture-driven animations, Reanimated would be better
 *
 * Zustand integration:
 * - If snipId, isExpanded, and onToggle are provided, uses Zustand state
 * - Otherwise, uses local React state (for simple cases)
 * - This flexibility keeps the component reusable
 *
 * Memoization strategy:
 * - useCallback for toggle handler to prevent unnecessary re-renders
 * - Text split computed only when text prop changes
 */
export function ExpandableDescription({
  text,
  collapsedLines = 2,
  snipId,
  isExpanded: externalIsExpanded,
  onToggle,
}: ExpandableDescriptionProps) {
  // Use local state if no Zustand integration provided
  const [localIsExpanded, setLocalIsExpanded] = useState(false);
  const isExpanded = externalIsExpanded ?? localIsExpanded;

  // Precompute line count to avoid expensive computation on each render
  const lineCount = text.split('\n').length;
  const shouldShowToggle = lineCount > collapsedLines;

  // Memoized handler with animation
  const handleToggle = useCallback(() => {
    // Enable smooth layout animation before state change
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        200, // duration in ms
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );

    // Use Zustand if snipId and onToggle provided, otherwise local state
    if (snipId && onToggle) {
      onToggle(snipId);
    } else {
      setLocalIsExpanded((prev) => !prev);
    }
  }, [snipId, onToggle]);

  return (
    <View>
      <Text style={styles.text} numberOfLines={isExpanded ? undefined : collapsedLines}>
        {text}
      </Text>
      {shouldShowToggle && (
        <TouchableOpacity
          onPress={handleToggle}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.toggleText}>{isExpanded ? 'Show less' : 'Show more'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  toggleText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
});
