import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, Text, View, TextInput, ActivityIndicator } from 'react-native';
import { useCryptoCoins } from '@/hooks/useCrypto';
import { useTheme } from '@/hooks';
import { CryptoItem } from '@/components/CryptoItem';
import Header from '@/components/Header';
import { styles } from '@/screens/Home/styles';
import Toast from 'react-native-toast-message';

export function HomeScreen() {
  const { data, isLoading, isRefreshing, isFetchingMore, refresh, error, fetchNext, initialLoad } =
    useCryptoCoins();
  const { theme } = useTheme();
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

  const refreshComponent = useMemo(
    () => <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={theme.text} />,
    [isRefreshing, refresh, theme.text],
  );

  const emptyComponent = useMemo(
    () =>
      !isLoading ? (
        <Text style={[styles.emptyText, { color: theme.text }]}>No data available</Text>
      ) : undefined,
    [isLoading, theme.text],
  );

  const footerComponent = useMemo(
    () =>
      isFetchingMore ? (
        <View style={styles.footer}>
          <ActivityIndicator color={theme.text} />
        </View>
      ) : null,
    [isFetchingMore, theme.text],
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header />
      <TextInput
        placeholder="Search by name or symbol"
        placeholderTextColor={theme.text}
        value={search}
        onChangeText={setSearch}
        style={[styles.textBox, { color: theme.text, backgroundColor: theme.card }]}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        refreshControl={refreshComponent}
        renderItem={({ item }) => <CryptoItem item={item} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={emptyComponent}
        ListFooterComponent={footerComponent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        onEndReached={data.length > 0 && !search ? loadMore : undefined}
        // When the user reaches 25% of the screen list it will trigger the load more function
        onEndReachedThreshold={0.25}
      />
    </View>
  );
}
