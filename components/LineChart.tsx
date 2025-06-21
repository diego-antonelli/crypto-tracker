import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { LineChart as RNLineChart } from 'react-native-svg-charts';
import { useTheme } from '@/hooks';
import { useMemo } from 'react';

export function LineChart({
  isPositive,
  values,
  style,
}: {
  isPositive?: boolean;
  values: number[];
  style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useTheme();
  const isPositiveValue = useMemo(
    () => (isPositive === undefined ? values[0] < values.slice(-1)[0] : isPositive),
    [isPositive, values],
  );

  return (
    <View style={[styles.container, style]} testID="line-chart">
      {/* @ts-expect-error - TypeScript does not recognize the JSX component */}
      <RNLineChart
        style={styles.chartContainer}
        data={values}
        svg={{
          stroke: isPositiveValue ? theme.success : theme.error,
          strokeWidth: 2,
        }}
        contentInset={styles.chartInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: 8 },
  chartContainer: { flex: 1 },
  chartInsets: { top: 4, bottom: 4 },
});
