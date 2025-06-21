import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {fetchCryptos} from "@/services/coingecko";
import {Crypto} from "@/types";

export const getCryptos = createAsyncThunk(
    'cryptos/getCryptos',
    async (page?: number) => {
        return await fetchCryptos(page);
    },
);

interface State {
    data: Crypto[],
    page: number,
    loading: boolean,
    error?: string,
}

 const initialState: State = {
    data: [],
    page: 1,
    loading: false,
 }

const cryptoSlice = createSlice({
    name: 'cryptos',
    initialState,
    reducers: {
        resetCoins: (state) => {
            state.data = [];
            state.page = 1;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCryptos.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCryptos.fulfilled, (state, action) => {
                state.loading = false;
                if (state.page === 1) {
                    state.data = action.payload;
                } else {
                    state.data = [...state.data, ...action.payload];
                }
            })
            .addCase(getCryptos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Unknown error';
            });
    },
});

export const { resetCoins, setPage } = cryptoSlice.actions;
export default cryptoSlice.reducer;
