import { render } from '@testing-library/react-native';
import { CoinDetailsView } from '../View';
import { Crypto } from '@/types';
import { useTheme } from '@/hooks';

jest.mock('@/hooks', () => ({
  useCryptoCoins: jest.fn(),
  useTheme: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
  Stack: {
    Screen: jest.fn(({ children }) => <>{children}</>), // Mock implementation
  },
}));

const mockCoin: Crypto = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'btc',
  image: 'https://example.com/bitcoin.png',
  current_price: 50000,
  price_change_percentage_24h: 2.5,
  market_cap: 1000000000,
  total_volume: 50000000,
  high_24h: 51000,
  ath: 60000,
  ath_change_percentage: -16.67,
  atl: 100,
  atl_change_percentage: 49900,
  circulating_supply: 19000000,
  max_supply: 21000000,
  sparkline_in_7d: { price: [48000, 49000, 50000] },
};

describe('CoinDetailsView', () => {
  const mockTheme = {
    background: '#fff',
    text: '#000',
    card: '#f0f0f0',
    success: '#00ff00',
    error: '#ff0000',
  };

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({ theme: mockTheme });
  });

  it('renders the coin details correctly', () => {
    const { getByText } = render(<CoinDetailsView coin={mockCoin} />);

    expect(getByText('Bitcoin')).toBeTruthy();
    expect(getByText('BTC')).toBeTruthy();
    expect(getByText('US$ 50.000,00')).toBeTruthy();
    expect(getByText('2,50%')).toBeTruthy();
    expect(getByText('Market Cap')).toBeTruthy();
    expect(getByText('US$ 1.000.000.000,00')).toBeTruthy();
  });

  it('renders "∞" for max supply if not provided', () => {
    const coinWithoutMaxSupply = { ...mockCoin, max_supply: null };
    const { getByText } = render(
      <CoinDetailsView coin={coinWithoutMaxSupply as unknown as Crypto} />,
    );

    expect(getByText('∞')).toBeTruthy();
  });

  it('handles null coin gracefully', () => {
    const { queryByText } = render(<CoinDetailsView coin={null} />);

    expect(queryByText('Bitcoin')).toBeNull();
    expect(queryByText('$50,000.00')).toBeNull();
  });
});
