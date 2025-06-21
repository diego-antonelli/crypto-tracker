import axios from 'axios';
import { Crypto } from '@/types';

export const fetchCryptos = async (page = 1): Promise<Crypto[]> => {
    const res = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 10,
                page,
                sparkline: true,
            },
        }
    );
    return res.data;
};
