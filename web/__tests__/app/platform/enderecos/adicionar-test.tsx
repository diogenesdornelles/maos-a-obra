import { useGetBairrosBySearch } from '@/hooks/queries/bairros/useGetBairrosBySearch';
import { usePostCreateEndereco } from '@/hooks/queries/enderecos/usePostCreateEndereco';
import { useDebounce } from '@/hooks/useDebounce';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import EnderecosAdicionarScreen from './../../../../src/app/(platform)/enderecos/adicionar';

jest.mock('@/hooks/queries/bairros/useGetBairrosBySearch');
jest.mock('@/hooks/queries/enderecos/usePostCreateEndereco');
jest.mock('@/hooks/useDebounce');
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
  Stack: {
    Screen: ({ options }: any) => null,
  },
}));

jest.mock('react-hook-form', () => {
  const actual = jest.requireActual('react-hook-form');
  return {
    ...actual,
    useForm: () => {
      const formMethods = actual.useForm({
        mode: 'onChange',
        defaultValues: {
          bairroId: '',
          logradouro: '',
          numero: '',
          cep: '',
          complemento: '',
        },
      });

      return {
        ...formMethods,
        formState: {
          ...formMethods.formState,
          errors: {},
          isValid: true,
        },
      };
    },
  };
});

jest.mock('@/components/Inputs/InputText', () => ({
  InputText: ({ label, onChangeText, value, error }: any) => {
    const { Text, TextInput, View } = require('react-native');
    return (
      <View>
        <Text>{label}</Text>
        <TextInput
          testID={`input-${label.toLowerCase()}`}
          onChangeText={onChangeText}
          value={value}
        />
        {error && <Text testID={`error-${label.toLowerCase()}`}>{error}</Text>}
      </View>
    );
  },
}));

jest.mock('@/components/Inputs/Select', () => ({
  Select: ({ label, onValueChange, value, error, options }: any) => {
    const { Text, TouchableOpacity, View } = require('react-native');
    return (
      <View>
        <Text>{label}</Text>
        {options?.map((option: any) => (
          <TouchableOpacity
            key={option.value}
            testID={`select-option-${option.value}`}
            onPress={() => onValueChange(option.value)}>
            <Text>{option.label}</Text>
          </TouchableOpacity>
        ))}
        {error && <Text testID={`error-${label.toLowerCase()}`}>{error}</Text>}
      </View>
    );
  },
}));

jest.mock('@/components/Modal', () => ({
  Modal: ({ isOpen, title, description, footerButtons }: any) => {
    const { Text, View } = require('react-native');
    if (!isOpen) return null;
    return (
      <View testID="modal">
        <Text testID="modal-title">{title}</Text>
        <Text testID="modal-description">{description}</Text>
        {footerButtons}
      </View>
    );
  },
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ onPress, disabled, children }: any) => {
    const { TouchableOpacity } = require('react-native');
    return (
      <TouchableOpacity testID="button" onPress={onPress} disabled={disabled}>
        {children}
      </TouchableOpacity>
    );
  },
}));

jest.mock('@/components/ui/text', () => ({
  Text: ({ children }: any) => {
    const { Text: RNText } = require('react-native');
    return <RNText>{children}</RNText>;
  },
}));

describe('EnderecosAdicionarScreen', () => {
  const mockMutate = jest.fn();
  const mockFetchNextPage = jest.fn();

  const mockBairrosData = {
    pages: [
      [
        { id: '1', nome: 'Centro', uf: 'SP' },
        { id: '2', nome: 'Jardim', uf: 'RJ' },
      ],
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useDebounce as jest.Mock).mockReturnValue({ debouncedValue: '' });

    (useGetBairrosBySearch as jest.Mock).mockReturnValue({
      data: mockBairrosData,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
    });

    (usePostCreateEndereco as jest.Mock).mockReturnValue({
      mutate: mockMutate,
    });
  });

  it('should render all form fields', () => {
    render(<EnderecosAdicionarScreen />);

    expect(screen.getByText('Bairro')).toBeTruthy();
    expect(screen.getByText('Logradouro')).toBeTruthy();
    expect(screen.getByText('Número')).toBeTruthy();
    expect(screen.getByText('CEP')).toBeTruthy();
    expect(screen.getByText('Complemento')).toBeTruthy();
  });

  it('should call mutate on form submission with correct data', async () => {
    const { getByTestId, getAllByTestId } = render(<EnderecosAdicionarScreen />);

    fireEvent.press(getByTestId('select-option-1'));

    fireEvent.changeText(getByTestId('input-logradouro'), 'Rua das Flores');
    fireEvent.changeText(getByTestId('input-número'), '123');
    fireEvent.changeText(getByTestId('input-cep'), '12345-678');
    fireEvent.changeText(getByTestId('input-complemento'), 'Apto 101');

    const buttons = getAllByTestId('button');
    fireEvent.press(buttons[0]);

    await waitFor(
      () => {
        expect(mockMutate).toHaveBeenCalledWith(
          expect.objectContaining({
            bairroId: '1',
            logradouro: 'Rua das Flores',
            numero: '123',
            cep: '12345-678',
            complemento: 'Apto 101',
            pais: 'Brasil',
            status: true,
          }),
          expect.any(Object)
        );
      },
      { timeout: 3000 }
    );
  });

  it('should show success modal when submission is successful', async () => {
    mockMutate.mockImplementation((data, { onSuccess }) => {
      onSuccess();
    });

    const { getByTestId, getAllByTestId } = render(<EnderecosAdicionarScreen />);

    fireEvent.press(getByTestId('select-option-1'));
    fireEvent.changeText(getByTestId('input-logradouro'), 'Rua das Flores');

    const buttons = getAllByTestId('button');
    fireEvent.press(buttons[0]);

    await waitFor(
      () => {
        expect(screen.getByTestId('modal')).toBeTruthy();
        expect(screen.getByTestId('modal-title')).toHaveTextContent('Endereço adicionado.');
        expect(screen.getByTestId('modal-description')).toHaveTextContent(
          'Endereço foi adiciona com sucesso'
        );
      },
      { timeout: 3000 }
    );
  });

  it('should show error modal when submission fails', async () => {
    const errorMessage = 'Erro ao salvar endereço';
    mockMutate.mockImplementation((data, { onError }) => {
      onError({ data: { message: errorMessage } });
    });

    const { getByTestId, getAllByTestId } = render(<EnderecosAdicionarScreen />);

    fireEvent.press(getByTestId('select-option-1'));
    fireEvent.changeText(getByTestId('input-logradouro'), 'Rua das Flores');

    const buttons = getAllByTestId('button');
    fireEvent.press(buttons[0]);

    await waitFor(
      () => {
        expect(screen.getByTestId('modal')).toBeTruthy();
        expect(screen.getByTestId('modal-title')).toHaveTextContent('Erro ao adicionar.');
        expect(screen.getByTestId('modal-description')).toHaveTextContent(errorMessage);
      },
      { timeout: 3000 }
    );
  });

  it('should close modal when clicking close button in error modal', async () => {
    mockMutate.mockImplementation((data, { onError }) => {
      onError({ data: { message: 'Error' } });
    });

    const { getByTestId, getAllByTestId, queryByTestId } = render(<EnderecosAdicionarScreen />);

    fireEvent.press(getByTestId('select-option-1'));
    fireEvent.changeText(getByTestId('input-logradouro'), 'Rua das Flores');

    const submitButtons = getAllByTestId('button');
    fireEvent.press(submitButtons[0]);

    await waitFor(
      () => {
        expect(screen.getByTestId('modal')).toBeTruthy();
      },
      { timeout: 3000 }
    );

    const allButtons = getAllByTestId('button');
    const closeButton = allButtons[allButtons.length - 1];
    fireEvent.press(closeButton);

    await waitFor(
      () => {
        expect(queryByTestId('modal')).toBeNull();
      },
      { timeout: 3000 }
    );
  });

  it('should navigate back when clicking "Voltar" button in success modal', async () => {
    mockMutate.mockImplementation((data, { onSuccess }) => {
      onSuccess();
    });

    const { getByTestId, getAllByTestId } = render(<EnderecosAdicionarScreen />);

    fireEvent.press(getByTestId('select-option-1'));
    fireEvent.changeText(getByTestId('input-logradouro'), 'Rua das Flores');

    const submitButtons = getAllByTestId('button');
    fireEvent.press(submitButtons[0]);

    await waitFor(
      () => {
        expect(screen.getByTestId('modal')).toBeTruthy();
      },
      { timeout: 3000 }
    );

    const allButtons = getAllByTestId('button');
    const voltarButton = allButtons[allButtons.length - 1];
    fireEvent.press(voltarButton);

    expect(router.back).toHaveBeenCalled();
  });

  it('should render bairros options from query data', () => {
    render(<EnderecosAdicionarScreen />);

    expect(screen.getByText('Centro, SP')).toBeTruthy();
    expect(screen.getByText('Jardim, RJ')).toBeTruthy();
  });
});
