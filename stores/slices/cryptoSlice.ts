import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCryptos } from '@/services/coingecko';
import { Crypto } from '@/types';

export const getCryptos = createAsyncThunk('cryptos/getCryptos', async (page?: number) => {
  return await fetchCryptos(page);
});

interface State {
  data: Crypto[];
  page: number;
  loading: boolean;
  error?: string;
}

const initialState: State = {
  data: [],
  page: 1,
  loading: false,
};

const cryptoSlice = createSlice({
  name: 'cryptos',
  initialState,
  reducers: {
    resetCoins: (state) => {
      state.data = [];
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCryptos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCryptos.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload.page;
        if (action.payload.page === 1) {
          state.data = action.payload.items;
        } else {
          action.payload.items.forEach((item) => {
            if (!state.data.some((coin) => coin.id === item.id)) {
              state.data.push(item);
            }
          });
        }
      })
      .addCase(getCryptos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export const { resetCoins } = cryptoSlice.actions;
export default cryptoSlice.reducer;
