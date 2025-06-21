import { render, fireEvent } from '@testing-library/react-native';
import Header from '../Header';
import { useTheme } from '@/hooks';

jest.mock('@/hooks', () => ({
  useTheme: jest.fn(),
}));

describe('Header Component', () => {
  it('renders correctly with the light theme', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: { card: '#fff', text: '#000' },
      themeName: 'light',
      setTheme: jest.fn(),
    });

    const { getByText, getByTestId } = render(<Header />);

    expect(getByText('Crypto Tracker')).toBeTruthy();
    expect(getByTestId('header-container').props.style).toContainEqual({ backgroundColor: '#fff' });
    expect(getByTestId('header-title').props.style).toContainEqual({ color: '#000' });
  });

  it('renders correctly with the dark theme', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: { card: '#000', text: '#fff' },
      themeName: 'dark',
      setTheme: jest.fn(),
    });

    const { getByText, getByTestId } = render(<Header />);

    expect(getByText('Crypto Tracker')).toBeTruthy();
    expect(getByTestId('header-container').props.style).toContainEqual({ backgroundColor: '#000' });
    expect(getByTestId('header-title').props.style).toContainEqual({ color: '#fff' });
  });

  it('toggles the theme when the switch is pressed', () => {
    const setThemeMock = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      theme: { card: '#000', text: '#fff' },
      themeName: 'dark',
      setTheme: setThemeMock,
    });

    const { getByTestId } = render(<Header />);
    const switchElement = getByTestId('theme-switch');

    fireEvent(switchElement, 'valueChange', true);

    expect(setThemeMock).toHaveBeenCalledWith('light');
  });
});
