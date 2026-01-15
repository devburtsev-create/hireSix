import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from 'shared/theme';

interface ExpandableDescriptionProps {
  text: string;
  collapsedLines?: number;
}

/**
 * Expandable description component
 * Shows limited lines by default, expands/collapses on press
 */
export function ExpandableDescription({ text, collapsedLines = 2 }: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View>
      <Text style={styles.text} numberOfLines={isExpanded ? undefined : collapsedLines}>
        {text}
      </Text>
      {text.split('\n').length > collapsedLines && (
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} activeOpacity={0.7}>
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
