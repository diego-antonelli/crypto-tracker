import {configureStore} from "@reduxjs/toolkit";
import cryptosSlice from "./slices/cryptoSlice";

export const store = configureStore({
    reducer: {
        cryptos: cryptosSlice,
    },
});
