import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks';
import { formatNumber } from '@/utils';

export function Metric({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change?: number;
}) {
  const { theme } = useTheme();
  const isPositive = useMemo(() => (change ? change >= 0 : null), [change]);
  return (
    <View style={styles.metricRow}>
      <Text style={[styles.metricLabel, { color: theme.text }]}>{label}</Text>
      <View style={styles.metricContentContainer}>
        <Text style={[styles.metricValue, { color: theme.text }]}>{value}</Text>
        {change !== undefined && (
          <Text style={{ color: isPositive ? theme.success : theme.error }}>
            {/* Reduces the text to make more sense to the user for 1K+ changes */}
            {change > 1000 ? `+${formatNumber(Math.floor(change), 0)}` : `${formatNumber(change)}%`}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 15,
  },
  metricContentContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
