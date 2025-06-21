import { useCallback, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { RootState, ThemeOptions } from '@/types';
import { setTheme } from '@/stores/slices/themeSlice';
import { useColorScheme } from 'react-native';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const systemColorScheme = useColorScheme();
  const { theme, name, manuallySet } = useAppSelector((state: RootState) => state.theme);

  const setThemeAction = useCallback((theme: ThemeOptions) => {
    dispatch(setTheme({ theme, manuallySet: true }));
  }, []);

  useEffect(() => {
    if (!manuallySet) {
      dispatch(setTheme({ theme: systemColorScheme as ThemeOptions, manuallySet: false }));
    }
    //@eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    theme,
    themeName: name,
    setTheme: setThemeAction,
  };
};
