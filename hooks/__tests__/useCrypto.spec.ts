import { renderHook, act } from '@testing-library/react-hooks';
import { useAppDispatch, useAppSelector, useCryptoCoins } from '@/hooks';
import { getCryptos, resetCoins } from '@/stores/slices/cryptoSlice';
import Toast from 'react-native-toast-message';

jest.mock('@/hooks/useAppDispatch');
jest.mock('@/hooks/useAppSelector');
jest.mock('@/stores/slices/cryptoSlice');
jest.mock('react-native-toast-message');

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe('useCryptoCoins', () => {
  const mockDispatch = jest.fn();
  const mockToastShow = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (Toast.show as jest.Mock).mockImplementation(mockToastShow);
  });

  it('initializes and load data if empty', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      data: [],
      loading: false,
      error: null,
      page: 1,
    });

    const { result } = renderHook(() => useCryptoCoins());

    act(() => {
      result.current.initialLoad();
    });

    expect(mockDispatch).toHaveBeenCalledWith(getCryptos(1));
  });

  it('fetches the next page of data', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      data: [{ id: 1, name: 'Bitcoin' }],
      loading: false,
      error: null,
      page: 1,
    });

    const { result } = renderHook(() => useCryptoCoins());

    act(() => {
      result.current.fetchNext();
    });

    expect(mockDispatch).toHaveBeenCalledWith(getCryptos(2));
  });

  it('refreshes the data', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      data: [{ id: 1, name: 'Bitcoin' }],
      loading: false,
      error: null,
      page: 1,
    });

    const { result } = renderHook(() => useCryptoCoins());

    act(() => {
      result.current.refresh();
    });

    expect(mockDispatch).toHaveBeenCalledWith(resetCoins());
    expect(mockDispatch).toHaveBeenCalledWith(getCryptos(1));
    expect(mockToastShow).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Cryptos refreshed!',
      text2: 'Your crypto list got refreshed.',
    });
  });

  it('returns the correct state values', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      data: [{ id: 1, name: 'Bitcoin' }],
      loading: true,
      error: 'Error message',
      page: 1,
    });

    const { result } = renderHook(() => useCryptoCoins());

    expect(result.current.data).toEqual([{ id: 1, name: 'Bitcoin' }]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe('Error message');
  });
});
