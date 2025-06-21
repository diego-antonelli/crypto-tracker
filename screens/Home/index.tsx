import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useCryptoCoins } from '@/hooks/useCrypto';
import Toast from 'react-native-toast-message';
import { HomeView } from '@/screens/Home/View';

export function HomeScreen() {
  const { data, isLoading, isRefreshing, isFetchingMore, refresh, error, fetchNext, initialLoad } =
    useCryptoCoins();
  const [search, setSearch] = useState('');

  const loadMore = useCallback(() => {
    if (!isLoading && !isRefreshing) {
      fetchNext();
    } else {
      console.log(isLoading, isRefreshing, 'Cannot load more data while loading or refreshing');
    }
  }, [isLoading, isRefreshing, fetchNext]);

  const filteredData = useMemo(
    () =>
      data?.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.symbol.toLowerCase().includes(search.toLowerCase()),
      ),
    [data, search],
  );

  // Handles error messages
  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load crypto coins',
        text2: error,
      });
    }
  }, [error]);

  // Loads data before painting
  useLayoutEffect(() => {
    initialLoad();
    //@eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <HomeView
      data={filteredData}
      onLoadMore={data.length > 0 && !search ? loadMore : undefined}
      search={search}
      setSearch={setSearch}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      isFetchingMore={isFetchingMore}
      refresh={refresh}
    />
  );
}
