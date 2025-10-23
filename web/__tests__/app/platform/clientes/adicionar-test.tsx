import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import ClientesAdicionarScreen from '../../../../src/app/(platform)/clientes/adicionar';

const mockMutate = jest.fn();
const mockFetchNextPage = jest.fn();

jest.mock('@/hooks/queries/clients/usePostCreateClient', () => ({
  usePostCreateClient: jest.fn(() => ({
    mutate: mockMutate,
  })),
}));

jest.mock('@/hooks/queries/enderecos/useGetEnderecosBySearch', () => ({
  useGetEnderecosBySearch: jest.fn(() => ({
    data: {
      pages: [
        [
          {
            id: '1',
            logradouro: 'Rua Teste',
            numero: '123',
            bairro: {
              nome: 'Bairro Teste - Cidade Teste',
              uf: 'SP',
            },
          },
        ],
      ],
    },
    isLoading: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: mockFetchNextPage,
  })),
}));

jest.mock('@/hooks/useDebounce', () => ({
  useDebounce: jest.fn((value) => ({ debouncedValue: value })),
}));

jest.mock('@/components/Modal', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Modal: ({ isOpen, title, description, footerButtons, ...props }: any) =>
      isOpen ? (
        <View testID="modal">
          <Text testID="modal-title">{title}</Text>
          <Text testID="modal-description">{description}</Text>
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

jest.mock('@/components/Inputs/InputDate', () => {
  const React = require('react');
  const { TextInput, View, Text } = require('react-native');
  return {
    InputDate: React.forwardRef((props: any, ref: any) => (
      <View>
        <Text>{props.label}</Text>
        <TextInput {...props} ref={ref} testID={props.label} />
        {props.error && <Text testID={`${props.label}-error`}>{props.error}</Text>}
      </View>
    )),
  };
});

jest.mock('@/components/Inputs/Select', () => {
  const React = require('react');
  const { TouchableOpacity, View, Text } = require('react-native');
  return {
    Select: ({ label, options, onValueChange, error, ...props }: any) => (
      <View>
        <Text>{label}</Text>
        <TouchableOpacity
          testID={label}
          onPress={() => options?.[0] && onValueChange(options[0].value)}>
          <Text>Select Option</Text>
        </TouchableOpacity>
        {error && <Text testID={`${label}-error`}>{error}</Text>}
      </View>
    ),
  };
});

describe('ClientesAdicionarScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the screen', () => {
    render(<ClientesAdicionarScreen />);
    expect(screen.getByTestId('Nome')).toBeTruthy();
  });

  it('should render all input fields', () => {
    render(<ClientesAdicionarScreen />);

    expect(screen.getByTestId('Nome')).toBeTruthy();
    expect(screen.getByTestId('Sobrenome')).toBeTruthy();
    expect(screen.getByTestId('Endereço')).toBeTruthy();
    expect(screen.getByTestId('CPF')).toBeTruthy();
    expect(screen.getByTestId('CNPJ')).toBeTruthy();
    expect(screen.getByTestId('Telefone')).toBeTruthy();
    expect(screen.getByTestId('Nascimento')).toBeTruthy();
    expect(screen.getByTestId('Email')).toBeTruthy();
  });

  it('should render save button', () => {
    render(<ClientesAdicionarScreen />);
    expect(screen.getByText('Salvar')).toBeTruthy();
  });

  it('should call mutate function when form is submitted with valid data', async () => {
    render(<ClientesAdicionarScreen />);

    const nomeInput = screen.getByTestId('Nome');

    fireEvent.changeText(nomeInput, 'João Silva');

    await waitFor(
      () => {
        const saveButton = screen.getByText('Salvar');
        expect(saveButton.props.accessibilityState?.disabled).toBeFalsy();
      },
      { timeout: 3000 }
    );

    const saveButton = screen.getByText('Salvar');
    fireEvent.press(saveButton);

    await waitFor(
      () => {
        expect(mockMutate).toHaveBeenCalledWith(
          expect.objectContaining({
            nome: 'João Silva',
            status: true,
          }),
          expect.any(Object)
        );
      },
      { timeout: 3000 }
    );
  });

  it('should show success modal on successful client creation', async () => {
    mockMutate.mockImplementation((data, { onSuccess }) => {
      onSuccess();
    });

    render(<ClientesAdicionarScreen />);

    const nomeInput = screen.getByTestId('Nome');
    fireEvent.changeText(nomeInput, 'João Silva');

    await waitFor(
      () => {
        const saveButton = screen.getByText('Salvar');
        expect(saveButton.props.accessibilityState?.disabled).toBeFalsy();
      },
      { timeout: 3000 }
    );

    const saveButton = screen.getByText('Salvar');
    fireEvent.press(saveButton);

    await waitFor(
      () => {
        expect(screen.getByTestId('modal')).toBeTruthy();
        expect(screen.getByText('Cliente adicionado.')).toBeTruthy();
      },
      { timeout: 3000 }
    );
  });

  it('should show error modal on client creation failure', async () => {
    mockMutate.mockImplementation((data, { onError }) => {
      onError({
        data: {
          message: ['Erro ao criar cliente'],
        },
      });
    });

    render(<ClientesAdicionarScreen />);

    const nomeInput = screen.getByTestId('Nome');
    fireEvent.changeText(nomeInput, 'João Silva');

    await waitFor(
      () => {
        const saveButton = screen.getByText('Salvar');
        expect(saveButton.props.accessibilityState?.disabled).toBeFalsy();
      },
      { timeout: 3000 }
    );

    const saveButton = screen.getByText('Salvar');
    fireEvent.press(saveButton);

    await waitFor(
      () => {
        expect(screen.getByTestId('modal')).toBeTruthy();
        expect(screen.getByText('Cliente NÃO adicionado.')).toBeTruthy();
      },
      { timeout: 3000 }
    );
  });

  it('should close modal when continue button is pressed on success', async () => {
    mockMutate.mockImplementation((data, { onSuccess }) => {
      onSuccess();
    });

    render(<ClientesAdicionarScreen />);

    const nomeInput = screen.getByTestId('Nome');
    fireEvent.changeText(nomeInput, 'João Silva');

    await waitFor(
      () => {
        const saveButton = screen.getByText('Salvar');
        expect(saveButton.props.accessibilityState?.disabled).toBeFalsy();
      },
      { timeout: 3000 }
    );

    const saveButton = screen.getByText('Salvar');
    fireEvent.press(saveButton);

    await waitFor(
      () => {
        expect(screen.getByTestId('modal')).toBeTruthy();
      },
      { timeout: 3000 }
    );

    const continueButton = screen.getByText('Continuar');
    fireEvent.press(continueButton);

    await waitFor(
      () => {
        expect(screen.queryByTestId('modal')).toBeNull();
      },
      { timeout: 3000 }
    );
  });

  it('should navigate back when back button is pressed on success modal', async () => {
    mockMutate.mockImplementation((data, { onSuccess }) => {
      onSuccess();
    });

    render(<ClientesAdicionarScreen />);

    const nomeInput = screen.getByTestId('Nome');
    fireEvent.changeText(nomeInput, 'João Silva');

    await waitFor(
      () => {
        const saveButton = screen.getByText('Salvar');
        expect(saveButton.props.accessibilityState?.disabled).toBeFalsy();
      },
      { timeout: 3000 }
    );

    const saveButton = screen.getByText('Salvar');
    fireEvent.press(saveButton);

    await waitFor(
      () => {
        expect(screen.getByTestId('modal')).toBeTruthy();
      },
      { timeout: 3000 }
    );

    const backButton = screen.getByText('Voltar');
    fireEvent.press(backButton);

    expect(router.back).toHaveBeenCalled();
  });

  it('should submit form with minimal required fields only', async () => {
    render(<ClientesAdicionarScreen />);

    fireEvent.changeText(screen.getByTestId('Nome'), 'João da Silva');

    await waitFor(
      () => {
        const saveButton = screen.getByText('Salvar');
        expect(saveButton.props.accessibilityState?.disabled).toBeFalsy();
      },
      { timeout: 3000 }
    );

    const saveButton = screen.getByText('Salvar');
    fireEvent.press(saveButton);

    await waitFor(
      () => {
        expect(mockMutate).toHaveBeenCalledWith(
          expect.objectContaining({
            nome: 'João da Silva',
            status: true,
          }),
          expect.any(Object)
        );
      },
      { timeout: 3000 }
    );
  });
});
