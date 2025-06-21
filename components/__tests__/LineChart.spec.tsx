import React from 'react';
import { render } from '@testing-library/react-native';
import { LineChart } from '../LineChart';
import { useTheme } from '@/hooks';

jest.mock('@/hooks', () => ({
  useTheme: jest.fn(),
}));

describe('LineChart', () => {
  const mockTheme = {
    success: 'green',
    error: 'red',
  };

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({ theme: mockTheme });
  });

  it('renders correctly with positive values', () => {
    const { getByTestId } = render(<LineChart values={[1, 2, 3]} />);
    const chart = getByTestId('line-chart');
    expect(chart).toBeTruthy();
  });

  it('applies success color for positive trend', () => {
    const { getByTestId } = render(<LineChart values={[1, 2, 3]} />);
    const chart = getByTestId('line-chart');
    expect(chart.props.children.props.svg.stroke).toBe(mockTheme.success);
  });

  it('applies error color for negative trend', () => {
    const { getByTestId } = render(<LineChart values={[3, 2, 1]} />);
    const chart = getByTestId('line-chart');
    expect(chart.props.children.props.svg.stroke).toBe(mockTheme.error);
  });

  it('overrides trend with isPositive prop', () => {
    const { getByTestId } = render(<LineChart values={[3, 2, 1]} isPositive />);
    const chart = getByTestId('line-chart');
    expect(chart.props.children.props.svg.stroke).toBe(mockTheme.success);
  });

  it('applies custom styles', () => {
    const customStyle = { marginTop: 10 };
    const { getByTestId } = render(<LineChart values={[1, 2, 3]} style={customStyle} />);
    const chart = getByTestId('line-chart');
    expect(chart.props.style).toContainEqual(customStyle);
  });
});
