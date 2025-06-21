import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedToast } from '../Toast';
import { useTheme } from '@/hooks';

jest.mock('@/hooks', () => ({
  useTheme: jest.fn(),
}));

describe('Toast', () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: {
        error: '#FF0000',
        success: '#00FF00',
      },
    });
  });

  it('renders the error toast with correct text', () => {
    render(<ThemedToast />);

    const errorConfig = ThemedToast().props.config.error({
      text1: 'Error Title',
      text2: 'Error Message',
    });

    const { getByText: getErrorText } = render(errorConfig);

    expect(getErrorText('Error Title')).toBeTruthy();
    expect(getErrorText('Error Message')).toBeTruthy();
  });

  it('renders the success toast with correct text', () => {
    render(<ThemedToast />);

    const successConfig = ThemedToast().props.config.success({
      text1: 'Success Title',
      text2: 'Success Message',
    });

    const { getByText: getSuccessText } = render(successConfig);

    expect(getSuccessText('Success Title')).toBeTruthy();
    expect(getSuccessText('Success Message')).toBeTruthy();
  });

  it('renders the error toast without text2 when it is not provided', () => {
    const errorConfig = ThemedToast().props.config.error({
      text1: 'Error Title',
    });

    const { getByText, queryByText } = render(errorConfig);

    expect(getByText('Error Title')).toBeTruthy();
    expect(queryByText('Error Message')).toBeNull();
  });

  it('renders the success toast without text2 when it is not provided', () => {
    const successConfig = ThemedToast().props.config.success({
      text1: 'Success Title',
    });

    const { getByText, queryByText } = render(successConfig);

    expect(getByText('Success Title')).toBeTruthy();
    expect(queryByText('Success Message')).toBeNull();
  });
});
