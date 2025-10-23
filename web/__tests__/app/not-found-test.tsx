import { render, screen } from '@testing-library/react-native';
import NotFoundScreen from '../../src/app/+not-found';

jest.mock('expo-router', () => ({
  Link: ({ children, href }: any) => {
    const { View } = require('react-native');
    return <View testID={`link-${href}`}>{children}</View>;
  },
  Stack: {
    Screen: ({ options }: any) => null,
  },
}));

jest.mock('@/components/ui/text', () => ({
  Text: ({ children, className }: any) => {
    const { Text: RNText } = require('react-native');
    return <RNText className={className}>{children}</RNText>;
  },
}));

describe('NotFoundScreen', () => {
  it('should render error message', () => {
    render(<NotFoundScreen />);

    expect(screen.getByText('Essa tela não é válida.')).toBeTruthy();
  });

  it('should render link to home', () => {
    render(<NotFoundScreen />);

    expect(screen.getByTestId('link-/')).toBeTruthy();
    expect(screen.getByText('Vá para tela inical!')).toBeTruthy();
  });
});
