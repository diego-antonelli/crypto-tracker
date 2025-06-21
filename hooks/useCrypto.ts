import { useCallback, useState } from 'react';
import { getCryptos, resetCoins } from '@/stores/slices/cryptoSlice';
import { RootState } from '@/types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import Toast from 'react-native-toast-message';

export const useCryptoCoins = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error, page } = useAppSelector((state: RootState) => state.cryptos);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const initialLoad = useCallback(() => {
    console.log('Initial load of crypto data...');
    if (data.length === 0) {
      dispatch(getCryptos(1));
    }
  }, [dispatch, data]);

  const fetchNext = useCallback(() => {
    setIsFetchingMore(true);
    const nextPage = page + 1;
    console.log('Fetching next page of crypto data...', nextPage);
    dispatch(getCryptos(nextPage));
    setIsFetchingMore(false);
  }, [dispatch, page]);

  const refresh = useCallback(() => {
    console.log('Refreshing crypto data...');
    setIsRefreshing(true);
    dispatch(resetCoins());
    dispatch(getCryptos(1));
    setIsRefreshing(false);
    Toast.show({
      type: 'success',
      text1: 'Cryptos refreshed!',
      text2: 'Your crypto list got refreshed.',
    });
  }, [dispatch]);

  return {
    data,
    isLoading: loading,
    initialLoad,
    isRefreshing,
    isFetchingMore,
    error,
    fetchNext,
    refresh,
  };
};
