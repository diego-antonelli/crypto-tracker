import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, Image, ScrollView } from 'react-native';
import { useCryptoCoins, useTheme } from '@/hooks';
import { Crypto } from '@/types';
import { LineChart } from '@/components/LineChart';
import { Metric } from '@/components/Metric';
import { formatCurrency, formatNumber } from '@/utils';
import { styles } from '@/screens/CoinDetails/styles';
import Toast from 'react-native-toast-message';

export function CoinDetails() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const { data } = useCryptoCoins();
  const router = useRouter();

  const [coin, setCoin] = useState<Crypto | null>(null);

  useEffect(() => {
    const match = data?.find((c: Crypto) => c.id === id);
    if (match) setCoin(match);

    if (!match) {
      Toast.show({ type: 'error', text1: 'Crypto coin not found' });
      router.back();
    }
  }, [id, data]);

  const isPositive = useMemo(() => (coin?.price_change_percentage_24h ?? 0) >= 0, [coin]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Stack.Screen
        options={{
          headerTitle: `${coin?.name ?? 'Coin'} details`,
          headerStyle: { backgroundColor: theme.card },
          headerTintColor: theme.text,
        }}
      />

      <View style={styles.topSection}>
        <View style={{ flexDirection: 'row' }}>
          <Image source={{ uri: coin?.image }} style={styles.coinImage} />
          <View>
            <Text style={[styles.name, { color: theme.text }]}>{coin?.name}</Text>
            <Text style={[styles.symbol, { color: theme.text, opacity: 0.7 }]}>
              {coin?.symbol?.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={[styles.price, { color: theme.text }]}>
          {formatCurrency(coin?.current_price)}
        </Text>
        <Text style={[styles.priceChange, { color: isPositive ? theme.success : theme.error }]}>
          {formatNumber(coin?.price_change_percentage_24h)}%
        </Text>
      </View>

      <View style={{ marginVertical: 24 }}>
        <LineChart
          values={coin?.sparkline_in_7d?.price ?? []}
          isPositive={isPositive}
          style={styles.lineChartStyle}
        />
      </View>

      <View style={styles.metrics}>
        <Metric label="Market Cap" value={formatCurrency(coin?.market_cap)} />
        <Metric label="Total Volume" value={formatNumber(coin?.total_volume, 0)} />
        <Metric label="24h High" value={formatCurrency(coin?.high_24h)} />
        <Metric
          label="All-Time High"
          value={formatCurrency(coin?.ath)}
          change={coin?.ath_change_percentage}
        />
        <Metric
          label="All-Time Low"
          value={formatCurrency(coin?.atl)}
          change={coin?.atl_change_percentage}
        />
        <Metric label="Circulating Supply" value={formatNumber(coin?.circulating_supply, 0)} />
        <Metric
          label="Max Supply"
          value={coin?.max_supply ? formatNumber(coin?.max_supply, 0) : '∞'}
        />
      </View>
    </ScrollView>
  );
}
