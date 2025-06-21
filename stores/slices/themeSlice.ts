import { createSlice } from '@reduxjs/toolkit';
import { Theme, ThemeOptions } from '@/types';
import { dark, light } from '@/theme';

interface State {
  theme: Theme;
  name: ThemeOptions;
  manuallySet?: boolean;
}

const initialState: State = {
  theme: light,
  name: 'light',
  manuallySet: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: { payload: { theme: ThemeOptions; manuallySet: boolean } }) => {
      state.theme = action.payload.theme === 'dark' ? dark : light;
      state.name = action.payload.theme;
      state.manuallySet = action.payload.manuallySet;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
