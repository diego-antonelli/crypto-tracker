import { styles } from '@/screens/Home/styles';
import Header from '@/components/Header';
import { ActivityIndicator, FlatList, RefreshControl, Text, TextInput, View } from 'react-native';
import { CryptoItem } from '@/components/CryptoItem';
import { useMemo } from 'react';
import { useTheme } from '@/hooks';
import { Crypto } from '@/types';

interface HomeViewProps {
  data: Crypto[];
  isRefreshing: boolean;
  refresh: () => void;
  isLoading: boolean;
  isFetchingMore?: boolean;
  onLoadMore?: () => void;
  search: string;
  setSearch: (text: string) => void;
}

export function HomeView({
  data,
  isRefreshing,
  refresh,
  isLoading,
  isFetchingMore,
  search,
  setSearch,
  onLoadMore,
}: HomeViewProps) {
  const { theme } = useTheme();

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
          <ActivityIndicator color={theme.text} testID="activity-indicator" />
        </View>
      ) : null,
    [isFetchingMore, theme.text],
  );

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
        testID="crypto-list"
        data={data}
        keyExtractor={(item) => item.id}
        refreshControl={refreshComponent}
        renderItem={({ item }) => <CryptoItem item={item} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={emptyComponent}
        ListFooterComponent={footerComponent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        onEndReached={onLoadMore}
        // When the user reaches 25% of the screen list it will trigger the load more function
        onEndReachedThreshold={0.25}
      />
    </View>
  );
}
