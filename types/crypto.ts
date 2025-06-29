export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  sparkline_in_7d?: {
    price?: number[];
  };
  market_cap: number;
  total_volume: number;
  high_24h: number;
  ath: number;
  ath_change_percentage?: number;
  atl: number;
  atl_change_percentage?: number;
  circulating_supply: number;
  max_supply?: number;
}
