import { renderHook, act } from '@testing-library/react-hooks';
import { useTheme } from '@/hooks/useTheme';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setTheme } from '@/stores/slices/themeSlice';

const mockedUseAppDispatch = jest.fn();

jest.mock('@/hooks/useAppDispatch', () => ({
  useAppDispatch: jest.fn(),
}));
jest.mock('@/hooks/useAppSelector');
jest.mock('@/stores/slices/themeSlice', () => ({
  setTheme: jest.fn(),
}));

const mockedColorScheme = jest.fn(() => 'light');
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  ...jest.requireActual('react-native/Libraries/Utilities/useColorScheme'),
  useColorScheme: mockedColorScheme,
}));
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe('useTheme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockedUseAppDispatch);
  });

  it('initializes theme based on system color scheme if not manually set', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      theme: 'light',
      name: 'Light Theme',
      manuallySet: false,
    });
    mockedColorScheme.mockReturnValue('dark');

    renderHook(() => useTheme());

    expect(mockedUseAppDispatch).toHaveBeenCalledWith(
      setTheme({
        theme: 'dark',
        manuallySet: false,
      }),
    );
  });

  it('does not override theme if manually set', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      theme: 'dark',
      name: 'Dark Theme',
      manuallySet: true,
    });
    mockedColorScheme.mockReturnValue('light');

    renderHook(() => useTheme());

    expect(mockedUseAppDispatch).not.toHaveBeenCalled();
  });

  it('sets theme manually to dark using setThemeAction', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      theme: 'light',
      name: 'Light Theme',
      manuallySet: true,
    });

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(mockedUseAppDispatch).toHaveBeenCalledWith(
      setTheme({
        theme: 'dark',
        manuallySet: false,
      }),
    );
  });

  it('sets theme manually to light using setThemeAction', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      theme: 'dark',
      name: 'Dark Theme',
      manuallySet: true,
    });

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('light');
    });

    expect(mockedUseAppDispatch).toHaveBeenCalledWith(
      setTheme({
        theme: 'light',
        manuallySet: false,
      }),
    );
  });

  it('returns the correct theme values', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      theme: 'dark',
      name: 'Dark Theme',
      manuallySet: true,
    });

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
    expect(result.current.themeName).toBe('Dark Theme');
  });
});
