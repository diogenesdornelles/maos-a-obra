import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import LoginScreen from '../../../../src/app/(auth)/login';

const mockSignIn = jest.fn();
const mockMutate = jest.fn();

jest.mock('@/hooks/useSession', () => ({
  useSession: jest.fn(() => ({
    signIn: mockSignIn,
  })),
}));

jest.mock('@/hooks/queries/auth/usePostLogin', () => ({
  usePostLogin: jest.fn(() => ({
    mutate: mockMutate,
  })),
}));

jest.mock('@/components/Modal', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Modal: ({ isOpen, title, description, footerButtons, ...props }: any) =>
      isOpen ? (
        <View testID="modal">
          <Text>{title}</Text>
          <Text>{description}</Text>
          {footerButtons}
        </View>
      ) : null,
  };
});

jest.mock('@/components/Inputs/InputText', () => {
  const React = require('react');
  const { TextInput, View, Text } = require('react-native');
  return {
    InputText: React.forwardRef((props: any, ref: any) => (
      <View>
        <Text>{props.label}</Text>
        <TextInput {...props} ref={ref} testID={props.label} />
        {props.error && <Text testID={`${props.label}-error`}>{props.error}</Text>}
      </View>
    )),
  };
});

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the screen', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Faça Login')).toBeTruthy();
  });

  it('should render email input field', () => {
    render(<LoginScreen />);
    expect(screen.getByTestId('Email')).toBeTruthy();
  });

  it('should render password input field', () => {
    render(<LoginScreen />);
    expect(screen.getByTestId('Senha')).toBeTruthy();
  });

  it('should render login button', () => {
    render(<LoginScreen />);
    expect(screen.getByTestId('button-send-form')).toBeTruthy();
  });

  it('should call mutate function when form is submitted with valid data', async () => {
    render(<LoginScreen />);

    const emailInput = screen.getByTestId('Email');
    const passwordInput = screen.getByTestId('Senha');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'ValidPassword123!');

    await waitFor(() => {
      const submitButton = screen.getByTestId('button-send-form');
      expect(submitButton.props.accessibilityState?.disabled).toBeFalsy();
    });

    const submitButton = screen.getByTestId('button-send-form');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { email: 'test@example.com', pass: 'ValidPassword123!' },
        expect.any(Object)
      );
    });
  });

  it('should call signIn and navigate to home on successful login', async () => {
    mockMutate.mockImplementation((data, { onSuccess }) => {
      onSuccess({ access_token: 'fake-token' });
    });

    render(<LoginScreen />);

    const emailInput = screen.getByTestId('Email');
    const passwordInput = screen.getByTestId('Senha');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'ValidPassword123!');

    await waitFor(() => {
      const submitButton = screen.getByTestId('button-send-form');
      expect(submitButton.props.accessibilityState?.disabled).toBeFalsy();
    });

    const submitButton = screen.getByTestId('button-send-form');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('fake-token');
      expect(router.replace).toHaveBeenCalledWith('/(platform)/home');
    });
  });

  it('should show error modal on login failure', async () => {
    mockMutate.mockImplementation((data, { onError }) => {
      onError(new Error('Login failed'));
    });

    render(<LoginScreen />);

    const emailInput = screen.getByTestId('Email');
    const passwordInput = screen.getByTestId('Senha');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'ValidPassword123!');

    await waitFor(() => {
      const submitButton = screen.getByTestId('button-send-form');
      expect(submitButton.props.accessibilityState?.disabled).toBeFalsy();
    });

    const submitButton = screen.getByTestId('button-send-form');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeTruthy();
      expect(screen.getByText('Erro na autenticação')).toBeTruthy();
    });
  });

  it('should close modal when continue button is pressed', async () => {
    mockMutate.mockImplementation((data, { onError }) => {
      onError(new Error('Login failed'));
    });

    render(<LoginScreen />);

    const emailInput = screen.getByTestId('Email');
    const passwordInput = screen.getByTestId('Senha');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'ValidPassword123!');

    await waitFor(() => {
      const submitButton = screen.getByTestId('button-send-form');
      expect(submitButton.props.accessibilityState?.disabled).toBeFalsy();
    });

    const submitButton = screen.getByTestId('button-send-form');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeTruthy();
    });

    const continueButton = screen.getByText('Continuar');
    fireEvent.press(continueButton);

    await waitFor(() => {
      expect(screen.queryByTestId('modal')).toBeNull();
    });
  });

  it('should navigate back when home button is pressed in error modal', async () => {
    mockMutate.mockImplementation((data, { onError }) => {
      onError(new Error('Login failed'));
    });

    render(<LoginScreen />);

    const emailInput = screen.getByTestId('Email');
    const passwordInput = screen.getByTestId('Senha');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'ValidPassword123!');

    await waitFor(() => {
      const submitButton = screen.getByTestId('button-send-form');
      expect(submitButton.props.accessibilityState?.disabled).toBeFalsy();
    });

    const submitButton = screen.getByTestId('button-send-form');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeTruthy();
    });

    const homeButton = screen.getByText('Página inicial');
    fireEvent.press(homeButton);

    expect(router.back).toHaveBeenCalled();
  });
});
