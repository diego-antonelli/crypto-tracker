import React from 'react';
import { render } from '@testing-library/react-native';
import { Metric } from '../Metric';
import { useTheme } from '@/hooks';
import { formatNumber } from '@/utils';

jest.mock('@/hooks', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@/utils', () => ({
  formatNumber: jest.fn(),
}));

describe('Metric', () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: {
        text: '#000000',
        success: '#00FF00',
        error: '#FF0000',
      },
    });
    (formatNumber as jest.Mock).mockImplementation((value) => value.toString());
  });

  it('renders the label and value correctly', () => {
    const { getByText } = render(<Metric label="Test Label" value="123" />);
    expect(getByText('Test Label')).toBeTruthy();
    expect(getByText('123')).toBeTruthy();
  });

  it('renders the change value as positive with success color', () => {
    const { getByText } = render(<Metric label="Test Label" value="123" change={10} />);
    const changeText = getByText('10%');
    expect(changeText).toBeTruthy();
    expect(changeText.props.style).toEqual(expect.objectContaining({ color: '#00FF00' }));
  });

  it('renders the change value as negative with error color', () => {
    const { getByText } = render(<Metric label="Test Label" value="123" change={-5} />);
    const changeText = getByText('-5%');
    expect(changeText).toBeTruthy();
    expect(changeText.props.style).toEqual(expect.objectContaining({ color: '#FF0000' }));
  });

  it('formats large change values correctly', () => {
    (formatNumber as jest.Mock).mockImplementation((value) => `${value}K`);
    const { getByText } = render(<Metric label="Test Label" value="123" change={1500} />);
    const changeText = getByText('+1500K');
    expect(changeText).toBeTruthy();
  });

  it('does not render change text if change is undefined', () => {
    const { queryByText } = render(<Metric label="Test Label" value="123" />);
    expect(queryByText('%')).toBeNull();
  });
});
