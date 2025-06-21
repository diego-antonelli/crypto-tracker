import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { HomeScreen } from '../index';
import { useCryptoCoins } from '@/hooks/useCrypto';
import { useTheme } from '@/hooks';
import Toast from 'react-native-toast-message';

jest.mock('@/hooks/useCrypto');
jest.mock('@/hooks');
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe('HomeScreen', () => {
  const mockUseCryptoCoins = useCryptoCoins as jest.Mock;
  const mockUseTheme = useTheme as jest.Mock;

  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      theme: {
        text: '#000',
        background: '#fff',
        card: '#f0f0f0',
      },
    });

    mockUseCryptoCoins.mockReturnValue({
      data: [
        { id: '1', name: 'Bitcoin', symbol: 'BTC' },
        { id: '2', name: 'Ethereum', symbol: 'ETH' },
      ],
      isLoading: false,
      isRefreshing: false,
      isFetchingMore: false,
      refresh: jest.fn(),
      fetchNext: jest.fn(),
      initialLoad: jest.fn(),
      error: null,
    });
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<HomeScreen />);

    expect(getByPlaceholderText('Search by name or symbol')).toBeTruthy();
    expect(getByText('Bitcoin')).toBeTruthy();
    expect(getByText('Ethereum')).toBeTruthy();
  });

  it('filters data based on search input', () => {
    const { getByPlaceholderText, queryByText } = render(<HomeScreen />);
    const searchInput = getByPlaceholderText('Search by name or symbol');

    fireEvent.changeText(searchInput, 'Bitcoin');
    expect(queryByText('Bitcoin')).toBeTruthy();
    expect(queryByText('Ethereum')).toBeNull();
  });

  it('shows a loading indicator when loading more (infinite scrolling) is triggered', () => {
    mockUseCryptoCoins.mockReturnValueOnce({
      ...mockUseCryptoCoins(),
      isFetchingMore: true,
    });

    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('calls refresh when pull-to-refresh is triggered', () => {
    const mockRefresh = jest.fn();
    mockUseCryptoCoins.mockReturnValueOnce({
      ...mockUseCryptoCoins(),
      refresh: mockRefresh,
      isRefreshing: true,
    });

    const { getByTestId } = render(<HomeScreen />);
    const flatList = getByTestId('crypto-list');

    //Triggers the refresh control manually
    flatList.props.refreshControl.props.onRefresh();
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('displays an error message when there is an error', async () => {
    mockUseCryptoCoins.mockReturnValueOnce({
      ...mockUseCryptoCoins(),
      error: 'Network error',
    });

    render(<HomeScreen />);
    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Failed to load crypto coins',
        text2: 'Network error',
      });
    });
  });
});
