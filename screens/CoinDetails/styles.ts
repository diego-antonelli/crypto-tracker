import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    alignContent: 'center',
    alignItems: 'flex-start',
    gap: 4,
  },
  coinImage: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginStart: 8,
  },
  symbol: {
    fontSize: 14,
    marginStart: 8,
    marginBottom: 4,
  },
  price: {
    fontSize: 36,
    fontWeight: '600',
  },
  priceChange: {
    fontSize: 18,
    fontWeight: '600',
  },
  metrics: {
    marginTop: 24,
    gap: 16,
  },
  lineChartStyle: { height: 200 },
});
