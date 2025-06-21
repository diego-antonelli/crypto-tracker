import { memo, useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Crypto } from '@/types';
import { useTheme } from '@/hooks';
import { LineChart } from '@/components/LineChart';
import { useRouter } from 'expo-router';
import { formatCurrency, formatNumber } from '@/utils';

export const CryptoItem = memo(({ item }: { item: Crypto }) => {
  const { theme } = useTheme();
  const isPositive = useMemo(
    () => item.price_change_percentage_24h >= 0,
    [item.price_change_percentage_24h],
  );
  const router = useRouter();

  return (
    <Animated.View entering={FadeInRight.duration(400)}>
      <TouchableOpacity
        onPress={() => {
          router.push(`/coin/${item.id}`);
        }}
      >
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Image source={{ uri: item.image }} style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
            <Text style={{ color: theme.text, opacity: 0.6 }}>{item.symbol.toUpperCase()}</Text>
          </View>
          <LineChart
            isPositive={item.price_change_percentage_24h >= 0}
            values={item.sparkline_in_7d?.price?.slice(-20) ?? []}
            style={styles.lineChartStyle}
          />
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.price, { color: theme.text }]}>
              {formatCurrency(item.current_price)}
            </Text>
            <Text style={{ color: isPositive ? theme.success : theme.error }}>
              {formatNumber(item.price_change_percentage_24h)}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

CryptoItem.displayName = 'CryptoItem';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  icon: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  lineChartStyle: { width: 70, height: 40 },
});
