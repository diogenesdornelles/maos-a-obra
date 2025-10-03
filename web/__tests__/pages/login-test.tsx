import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React, { act } from 'react';

const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockMutate = jest.fn();
const mockSignIn = jest.fn();

jest.mock('expo-router', () => ({
  __esModule: true,
  router: {
    replace: mockReplace,
    back: mockBack,
  },
  Stack: {
    Screen: () => null,
  },
}));

jest.mock('@/contexts/authStore', () => ({
  __esModule: true,
  signIn: mockSignIn,
  signOut: jest.fn(),
  validateToken: jest.fn(),
  getSession: jest.fn(),
  restoreSession: jest.fn(),
  useStoreSession: jest.fn(),
}));

jest.mock('@/hooks/queries/auth/usePostLogin', () => ({
  usePostLogin: () => ({
    mutate: mockMutate,
  }),
}));

const LoginScreen = require('../../src/app/(auth)/login/index')
  .default as typeof import('../../src/app/(auth)/login/index').default;

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMutate.mockImplementation((credentials, { onSuccess }) => {
      process.nextTick(() => {
        onSuccess({ access_token: 'mock-token' });
      });
    });
  });

  it('renderiza campos e botão', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    expect(getByPlaceholderText('Digite seu email')).toBeTruthy();
    expect(getByPlaceholderText('Senha')).toBeTruthy();
    expect(getByText('Logar')).toBeTruthy();
  });

  it('renderiza o que foi escrito', async () => {
    const { getByPlaceholderText } = render(<LoginScreen />);

    const inputEmail = getByPlaceholderText('Digite seu email');
    const inputPassword = getByPlaceholderText('Senha');

    await act(async () => {
      fireEvent.changeText(inputEmail, 'user@mail.com');
      fireEvent.changeText(inputPassword, '@@11acAAde');
    });

    expect(inputEmail.props.value).toBe('user@mail.com');
    expect(inputPassword.props.value).toBe('@@11acAAde');
  });

  it('botão de logar habilitado', async () => {
    const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);

    const inputEmail = getByPlaceholderText('Digite seu email');
    const inputPassword = getByPlaceholderText('Senha');
    const buttonSend = getByTestId('button-send-form');

    expect(buttonSend).toBeDisabled();

    await act(async () => {
      fireEvent.changeText(inputEmail, 'user@mail.com');
      fireEvent.changeText(inputPassword, '@@11acAAde');
    });

    expect(buttonSend).toBeEnabled();
  });

  it('envia formulário', async () => {
    const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);

    const inputEmail = getByPlaceholderText('Digite seu email');
    const inputPassword = getByPlaceholderText('Senha');
    const buttonSend = getByTestId('button-send-form');

    await act(async () => {
      fireEvent.changeText(inputEmail, 'user@mail.com');
      fireEvent.changeText(inputPassword, '@@11acAAde');
    });

    await act(async () => {
      fireEvent.press(buttonSend);
    });

    expect(mockMutate).toHaveBeenCalledWith(
      { email: 'user@mail.com', pass: '@@11acAAde' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('mock-token');
      expect(mockReplace).toHaveBeenCalledWith('/(platform)/home');
    });
  });
});
