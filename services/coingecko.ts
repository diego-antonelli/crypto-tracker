import axios from 'axios';
import { Crypto } from '@/types';
import { leadingThrottle } from '@/utils/throttle';

type FetchCryptosResponse = { page: number; items: Crypto[] };

export const fetchCryptos = async (page = 1): Promise<FetchCryptosResponse> => {
  const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 10,
      page,
      sparkline: true,
    },
  });
  return { page, items: res.data } as FetchCryptosResponse;
};

export const fetchCryptosThrottled = leadingThrottle(
  async (page = 1, fn: (value: FetchCryptosResponse) => void, reject: (error: Error) => void) => {
    try {
      console.log('Fetching cryptos throttled for page:', page);
      fn(await fetchCryptos(page));
    } catch (error) {
      console.error('Error fetching cryptos:', error);
      reject(error instanceof Error ? error : new Error('Unknown error'));
    }
  },
  5000,
);
