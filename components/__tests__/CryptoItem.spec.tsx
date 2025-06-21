import { render, fireEvent } from '@testing-library/react-native';
import { CryptoItem } from '../CryptoItem';
import { useTheme } from '@/hooks';
import { useRouter } from 'expo-router';
import { Crypto } from '@/types';

jest.mock('@/hooks', () => ({
  useTheme: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('CryptoItem', () => {
  const mockRouterPush = jest.fn();
  const mockTheme = {
    theme: {
      card: '#fff',
      text: '#000',
      success: '#0f0',
      error: '#f00',
    },
  };

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue(mockTheme);
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockItem = {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'btc',
    image: 'https://example.com/bitcoin.png',
    current_price: 50000,
    price_change_percentage_24h: 5.5,
    sparkline_in_7d: {
      price: [48000, 49000, 50000],
    },
  } as Crypto;

  it('renders correctly with given item data', () => {
    const { getByText, getByTestId } = render(<CryptoItem item={mockItem} />);

    expect(getByText('Bitcoin')).toBeTruthy();
    expect(getByText('BTC')).toBeTruthy();
    expect(getByText('US$ 50.000,00')).toBeTruthy();
    expect(getByText('5,50%')).toBeTruthy();
    expect(getByTestId('line-chart')).toBeTruthy();
  });

  it('applies correct styles based on theme', () => {
    const { getByText } = render(<CryptoItem item={mockItem} />);

    const nameText = getByText('Bitcoin');
    expect(nameText.props.style).toContainEqual({ color: mockTheme.theme.text });

    const priceChangeText = getByText('5,50%');
    expect(priceChangeText.props.style).toEqual(
      expect.objectContaining({ color: mockTheme.theme.success }),
    );
  });

  it('navigates to the correct route on press', () => {
    const { getByTestId } = render(<CryptoItem item={mockItem} />);

    const touchable = getByTestId('crypto-item-touchable');
    fireEvent.press(touchable);

    expect(mockRouterPush).toHaveBeenCalledWith('/coin/bitcoin');
  });

  it('handles negative price change percentage correctly', () => {
    const negativeItem = { ...mockItem, price_change_percentage_24h: -3.2 };
    const { getByText } = render(<CryptoItem item={negativeItem} />);

    const priceChangeText = getByText('-3,20%');
    expect(priceChangeText.props.style).toEqual(
      expect.objectContaining({ color: mockTheme.theme.error }),
    );
  });
});
