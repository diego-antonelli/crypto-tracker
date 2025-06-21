import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeView } from '../View';
import { Crypto } from '@/types';
import { useTheme } from '@/hooks';

jest.mock('@/hooks', () => ({
  useCryptoCoins: jest.fn(),
  useTheme: jest.fn(),
}));

const mockData: Crypto[] = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    current_price: 50000,
    price_change_percentage_24h: 0.5,
  } as Crypto,
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    current_price: 3000,
    price_change_percentage_24h: -1.2,
  } as Crypto,
];

describe('HomeView', () => {
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

  it('renders correctly with data', () => {
    const { getByTestId, getByPlaceholderText } = render(
      <HomeView
        data={mockData}
        isRefreshing={false}
        refresh={jest.fn()}
        isLoading={false}
        search=""
        setSearch={jest.fn()}
      />,
    );

    expect(getByTestId('crypto-list')).toBeTruthy();
    expect(getByPlaceholderText('Search by name or symbol')).toBeTruthy();
  });

  it('displays empty component when no data is available', () => {
    const { getByText } = render(
      <HomeView
        data={[]}
        isRefreshing={false}
        refresh={jest.fn()}
        isLoading={false}
        search=""
        setSearch={jest.fn()}
      />,
    );

    expect(getByText('No data available')).toBeTruthy();
  });

  it('calls refresh function on pull-to-refresh', () => {
    const mockRefresh = jest.fn();
    const { getByTestId } = render(
      <HomeView
        data={mockData}
        isRefreshing={false}
        refresh={mockRefresh}
        isLoading={false}
        search=""
        setSearch={jest.fn()}
      />,
    );

    const flatList = getByTestId('crypto-list');

    //Triggers the refresh control manually
    flatList.props.refreshControl.props.onRefresh();
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('calls setSearch when typing in the search box', () => {
    const mockSetSearch = jest.fn();
    const { getByPlaceholderText } = render(
      <HomeView
        data={mockData}
        isRefreshing={false}
        refresh={jest.fn()}
        isLoading={false}
        search=""
        setSearch={mockSetSearch}
      />,
    );

    fireEvent.changeText(getByPlaceholderText('Search by name or symbol'), 'Bitcoin');
    expect(mockSetSearch).toHaveBeenCalledWith('Bitcoin');
  });

  it('renders footer component when fetching more data', () => {
    const { getByTestId } = render(
      <HomeView
        data={mockData}
        isRefreshing={false}
        refresh={jest.fn()}
        isLoading={false}
        isFetchingMore={true}
        search=""
        setSearch={jest.fn()}
      />,
    );

    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('calls onLoadMore when reaching the end of the list', () => {
    const mockOnLoadMore = jest.fn();
    const { getByTestId } = render(
      <HomeView
        data={mockData}
        isRefreshing={false}
        refresh={jest.fn()}
        isLoading={false}
        search=""
        setSearch={jest.fn()}
        onLoadMore={mockOnLoadMore}
      />,
    );

    const flatList = getByTestId('crypto-list');

    //Triggers the infinite loading manually
    flatList.props.onEndReached();

    expect(mockOnLoadMore).toHaveBeenCalled();
  });
});
