import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

const mockBack = jest.fn();
const mockMutate = jest.fn();

jest.mock('expo-router', () => ({
  __esModule: true,
  router: { back: mockBack },
  Stack: { Screen: () => null },
}));

jest.mock('@/hooks/queries/usuarios/usePostCreateUser', () => ({
  usePostCreateUser: () => ({ mutate: mockMutate }),
}));

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: (fn: any) => () =>
      fn({
        name: 'João',
        lastName: 'Silva',
        cpf: '123.456.789-00',
        bornDate: '01/01/2000',
        email: 'joão@silva.com',
        password: 'SEcret123!',
        repassword: 'SEcret123!',
      }),
    formState: { errors: {}, isValid: true },
  }),
  Controller: ({ render }: any) => render({ field: { onChange: jest.fn(), value: '' } }),
}));

const SignUp = require('../../src/app/(auth)/signUp/index')
  .default as typeof import('../../src/app/(auth)/signUp/index').default;

describe('SignUp screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('envia dados quando clica em registrar', () => {
    const { getByText } = render(<SignUp />);

    fireEvent.press(getByText('Registrar'));

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'João',
        sobrenome: 'Silva',
        email: 'joão@silva.com',
      }),
      expect.any(Object)
    );
  });
});
