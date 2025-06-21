import { configureStore } from '@reduxjs/toolkit';
import cryptosSlice from './slices/cryptoSlice';
import themeSlice from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    cryptos: cryptosSlice,
    theme: themeSlice,
  },
});
