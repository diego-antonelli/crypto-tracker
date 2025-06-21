import { render, screen, waitFor } from '@testing-library/react-native';
import { CoinDetails } from '../index';
import { useCryptoCoins, useTheme } from '@/hooks';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

jest.mock('@/hooks', () => ({
  useCryptoCoins: jest.fn(),
  useTheme: jest.fn(),
}));

const mockBack = jest.fn();

const mockShowToast = jest.spyOn(Toast, 'show').mockImplementation((params) => params);

jest.mock('expo-router', () => ({
  useRouter: jest.fn().mockReturnValue({ back: mockBack }),
  useLocalSearchParams: jest.fn(),
  Stack: {
    Screen: jest.fn(({ children }) => <>{children}</>), // Mock implementation
  },
}));

describe('CoinDetails', () => {
  const mockRouter = { back: jest.fn() };
  const mockTheme = {
    background: '#fff',
    text: '#000',
    card: '#f0f0f0',
    success: '#00ff00',
    error: '#ff0000',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useTheme as jest.Mock).mockReturnValue({ theme: mockTheme });
  });

  it('renders correctly with valid coin data', async () => {
    const mockCoin = {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'btc',
      image: 'https://example.com/bitcoin.png',
      current_price: 50000,
      price_change_percentage_24h: 2.5,
      sparkline_in_7d: { price: [48000, 49000, 50000] },
      market_cap: 1000000000,
      total_volume: 50000000,
      high_24h: 51000,
      ath: 60000,
      ath_change_percentage: -10,
      atl: 100,
      atl_change_percentage: 50000,
      circulating_supply: 19000000,
      max_supply: 21000000,
    };

    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'bitcoin' });
    (useCryptoCoins as jest.Mock).mockReturnValue({ data: [mockCoin] });

    render(<CoinDetails />);

    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeTruthy();
      expect(screen.getByText('BTC')).toBeTruthy();
      expect(screen.getByText('US$ 50.000,00')).toBeTruthy();
      expect(screen.getByText('2,50%')).toBeTruthy();
    });
  });

  it('shows an error and navigates back if coin is not found', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'unknown' });
    (useCryptoCoins as jest.Mock).mockReturnValue({ data: [] });

    render(<CoinDetails />);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Crypto coin not found',
      });
      expect(mockRouter.back).toHaveBeenCalled();
    });
  });
});
