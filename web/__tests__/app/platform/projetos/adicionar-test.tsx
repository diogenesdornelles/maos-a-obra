import { useGetClientesBySearch } from '@/hooks/queries/clients/useGetClientesBySearch';
import { useGetEstadosBySearch } from '@/hooks/queries/estados/useGetEstadosBySearch';
import { usePostCreateProjeto } from '@/hooks/queries/projetos/usePostCreateProjeto';
import { useDebounce } from '@/hooks/useDebounce';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import ProjetosAdicionarScreen from './../../../../src/app/(platform)/projetos/adicionar';

jest.mock('@/hooks/queries/clients/useGetClientesBySearch');
jest.mock('@/hooks/queries/estados/useGetEstadosBySearch');
jest.mock('@/hooks/queries/projetos/usePostCreateProjeto');
jest.mock('@/hooks/useDebounce');
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
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
          nome: '',
          clienteId: '',
          descricao: '',
          estadoId: '',
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
  InputText: ({ label, onChangeText, value, placeholder, error }: any) => {
    const { Text, TextInput, View } = require('react-native');
    return (
      <View>
        <Text>{label}</Text>
        <TextInput
          testID={`input-${label.toLowerCase()}`}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
        />
        {error && <Text testID={`error-${label.toLowerCase()}`}>{error}</Text>}
      </View>
    );
  },
}));

jest.mock('@/components/Inputs/InputTextArea', () => ({
  InputTextArea: ({ label, onChangeText, value, placeholder, error }: any) => {
    const { Text, TextInput, View } = require('react-native');
    return (
      <View>
        <Text>{label}</Text>
        <TextInput
          testID={`input-${label.toLowerCase()}`}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          multiline
        />
        {error && <Text testID={`error-${label.toLowerCase()}`}>{error}</Text>}
      </View>
    );
  },
}));

jest.mock('@/components/Inputs/Select', () => ({
  Select: ({ label, onValueChange, options, error }: any) => {
    const { Text, TouchableOpacity, View } = require('react-native');
    return (
      <View testID={`select-${label.toLowerCase()}`}>
        <Text>{label}</Text>
        {options?.map((option: any, index: number) => (
          <TouchableOpacity
            key={option.value}
            testID={`select-${label.toLowerCase()}-option-${index}`}
            onPress={() => onValueChange(option.value)}>
            <Text>{option.label}</Text>
          </TouchableOpacity>
        ))}
        {error && <Text testID={`error-${label.toLowerCase()}`}>{error}</Text>}
      </View>
    );
  },
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ onPress, disabled, children }: any) => {
    const { TouchableOpacity } = require('react-native');
    return (
      <TouchableOpacity testID="button-salvar" onPress={onPress} disabled={disabled}>
        {children}
      </TouchableOpacity>
    );
  },
}));

jest.mock('@/components/ui/text', () => ({
  Text: ({ children, className }: any) => {
    const { Text: RNText } = require('react-native');
    return <RNText className={className}>{children}</RNText>;
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

describe('ProjetosAdicionarScreen', () => {
  const mockMutateAsync = jest.fn();

  const mockClientes = {
    pages: [
      [
        {
          id: '1',
          nome: 'João',
          sobrenome: 'Silva',
          cpf: '123.456.789-00',
          email: 'joao@example.com',
          telefone: '(11) 99999-9999',
        },
        {
          id: '2',
          nome: 'Maria',
          sobrenome: 'Santos',
          cnpj: '12.345.678/0001-90',
          email: 'maria@example.com',
        },
      ],
    ],
  };

  const mockEstados = {
    pages: [
      [
        { id: '1', nome: 'São Paulo', uf: 'SP' },
        { id: '2', nome: 'Rio de Janeiro', uf: 'RJ' },
      ],
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useDebounce as jest.Mock).mockReturnValue({ debouncedValue: '' });

    (useGetClientesBySearch as jest.Mock).mockReturnValue({
      data: mockClientes,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });

    (useGetEstadosBySearch as jest.Mock).mockReturnValue({
      data: mockEstados,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });

    (usePostCreateProjeto as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });
  });

  it('should render all form fields', () => {
    render(<ProjetosAdicionarScreen />);

    expect(screen.getByText('Nome')).toBeTruthy();
    expect(screen.getByText('Cliente')).toBeTruthy();
    expect(screen.getByText('Descrição')).toBeTruthy();
    expect(screen.getByText('Estado')).toBeTruthy();
    expect(screen.getByTestId('button-salvar')).toBeTruthy();
  });

  it('should update input values when typing', () => {
    const { getByTestId } = render(<ProjetosAdicionarScreen />);

    fireEvent.changeText(getByTestId('input-nome'), 'Projeto Teste');
    fireEvent.changeText(getByTestId('input-descrição'), 'Descrição do projeto');

    expect(getByTestId('input-nome').props.value).toBe('Projeto Teste');
    expect(getByTestId('input-descrição').props.value).toBe('Descrição do projeto');
  });

  it('should render cliente options', () => {
    render(<ProjetosAdicionarScreen />);

    expect(screen.getByText('João Silva')).toBeTruthy();
    expect(screen.getByText('Maria Santos')).toBeTruthy();
  });

  it('should render estado options', () => {
    render(<ProjetosAdicionarScreen />);

    expect(screen.getByText('São Paulo')).toBeTruthy();
    expect(screen.getByText('Rio de Janeiro')).toBeTruthy();
  });

  it('should select cliente when clicking option', () => {
    const { getByTestId } = render(<ProjetosAdicionarScreen />);

    fireEvent.press(getByTestId('select-cliente-option-0'));

    expect(getByTestId('select-cliente')).toBeTruthy();
  });

  it('should submit form and navigate on success', async () => {
    mockMutateAsync.mockResolvedValue({ id: 'projeto-123' });

    const { getByTestId } = render(<ProjetosAdicionarScreen />);

    fireEvent.changeText(getByTestId('input-nome'), 'Projeto Teste');
    fireEvent.press(getByTestId('select-cliente-option-0'));
    fireEvent.press(getByTestId('select-estado-option-0'));

    fireEvent.press(getByTestId('button-salvar'));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
      expect(router.replace).toHaveBeenCalledWith('/(platform)/projetos/projeto-123');
    });
  });

  it('should display loading state for clientes', () => {
    (useGetClientesBySearch as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });

    render(<ProjetosAdicionarScreen />);

    expect(screen.getByTestId('select-cliente')).toBeTruthy();
  });

  it('should display loading state for estados', () => {
    (useGetEstadosBySearch as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });

    render(<ProjetosAdicionarScreen />);

    expect(screen.getByTestId('select-estado')).toBeTruthy();
  });
});
