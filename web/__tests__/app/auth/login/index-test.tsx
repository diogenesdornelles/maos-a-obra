import { render, screen } from '@testing-library/react-native';
import LoginScreen from '../../../../src/app/(auth)/login';

jest.mock('@/hooks/useSession', () => ({
  useSession: jest.fn(() => ({
    signIn: jest.fn(),
  })),
}));

jest.mock('@/hooks/queries/auth/usePostLogin', () => ({
  usePostLogin: jest.fn(() => ({
    mutate: jest.fn(),
  })),
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    back: jest.fn(),
  },
  Stack: {
    Screen: ({ children, ...props }: any) => null,
  },
}));

jest.mock('@/components/Modal', () => {
  const React = require('react');
  return {
    Modal: ({ children, ...props }: any) => null,
  };
});

jest.mock('@/components/Inputs/InputText', () => {
  const React = require('react');
  const { TextInput } = require('react-native');
  return {
    InputText: React.forwardRef((props: any, ref: any) => (
      <TextInput {...props} ref={ref} testID={props.label} />
    )),
  };
});

describe('LoginScreen', () => {
  it('should render the screen', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Faça Login')).toBeTruthy();
  });

  it('should render the login button', () => {
    render(<LoginScreen />);
    expect(screen.getByTestId('button-send-form')).toBeTruthy();
  });

  it('should render email input field', () => {
    render(<LoginScreen />);
    expect(screen.getByTestId('Email')).toBeTruthy();
  });

  it('should render password input field', () => {
    render(<LoginScreen />);
    expect(screen.getByTestId('Senha')).toBeTruthy();
  });

  it('should render login button text', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Logar')).toBeTruthy();
  });
});
