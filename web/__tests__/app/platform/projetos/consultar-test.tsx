import { useGetClientesBySearch } from '@/hooks/queries/clients/useGetClientesBySearch';
import { useGetEstadosBySearch } from '@/hooks/queries/estados/useGetEstadosBySearch';
import { useGetProjetosBySearch } from '@/hooks/queries/projetos/useGeProjetosBySearch';
import { useDebounce } from '@/hooks/useDebounce';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import ProjetosConsultarScreen from './../../../../src/app/(platform)/projetos/consultar';

jest.mock('@/hooks/queries/projetos/useGeProjetosBySearch');
jest.mock('@/hooks/queries/clients/useGetClientesBySearch');
jest.mock('@/hooks/queries/estados/useGetEstadosBySearch');
jest.mock('@/hooks/useDebounce');
jest.mock('expo-router', () => ({
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
          estado: '',
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
  InputText: ({ label, onChangeText, value, placeholder }: any) => {
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
      </View>
    );
  },
}));

jest.mock('@/components/Inputs/Select', () => ({
  Select: ({ label, options, onValueChange }: any) => {
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
      </View>
    );
  },
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ onPress, disabled, children }: any) => {
    const { TouchableOpacity } = require('react-native');
    return (
      <TouchableOpacity testID="button-consultar" onPress={onPress} disabled={disabled}>
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

jest.mock('@/components/InfiniteList', () => ({
  InfiniteList: ({ data, renderItem, isLoading, emptyMessage }: any) => {
    const { Text, View, ActivityIndicator } = require('react-native');

    if (isLoading) {
      return (
        <View testID="infinite-list-loading">
          <ActivityIndicator />
        </View>
      );
    }

    if (!data || data.length === 0) {
      return (
        <View testID="infinite-list-empty">
          <Text>{emptyMessage}</Text>
        </View>
      );
    }

    return (
      <View testID="infinite-list">
        {data.map((item: any, index: number) => (
          <View key={index} testID={`list-item-${index}`}>
            {renderItem(item)}
          </View>
        ))}
      </View>
    );
  },
}));

describe('ProjetosConsultarScreen', () => {
  const mockClientes = {
    pages: [
      [
        {
          id: '1',
          nome: 'João',
          sobrenome: 'Silva',
          cpf: '123.456.789-00',
          email: 'joao@example.com',
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

  const mockProjetos = {
    pages: [
      [
        {
          id: '1',
          nome: 'Projeto A',
          descricao: 'Descrição do Projeto A',
          valorTotal: '5000.00',
          cliente: {
            nome: 'João',
            sobrenome: 'Silva',
          },
        },
        {
          id: '2',
          nome: 'Projeto B',
          valorTotal: '3000.00',
          cliente: {
            nome: 'Maria',
            sobrenome: 'Santos',
          },
        },
      ],
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useDebounce as jest.Mock).mockReturnValue({ debouncedValue: '' });

    (useGetProjetosBySearch as jest.Mock).mockReturnValue({
      data: mockProjetos,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });

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
  });

  it('should render all form fields', () => {
    render(<ProjetosConsultarScreen />);

    expect(screen.getByText('Nome')).toBeTruthy();
    expect(screen.getByText('Cliente')).toBeTruthy();
    expect(screen.getByText('Estado')).toBeTruthy();
    expect(screen.getByTestId('button-consultar')).toBeTruthy();
  });

  it('should update nome input when typing', () => {
    const { getByTestId } = render(<ProjetosConsultarScreen />);

    fireEvent.changeText(getByTestId('input-nome'), 'Projeto Teste');

    expect(getByTestId('input-nome').props.value).toBe('Projeto Teste');
  });

  it('should render cliente options', () => {
    render(<ProjetosConsultarScreen />);

    expect(screen.getByText('João Silva')).toBeTruthy();
  });

  it('should render estado options', () => {
    render(<ProjetosConsultarScreen />);

    expect(screen.getByText('São Paulo')).toBeTruthy();
    expect(screen.getByText('Rio de Janeiro')).toBeTruthy();
  });

  it('should call query with filters when submit button is pressed', async () => {
    const { getByTestId } = render(<ProjetosConsultarScreen />);

    fireEvent.changeText(getByTestId('input-nome'), 'Projeto A');
    fireEvent.press(getByTestId('select-cliente-option-0'));
    fireEvent.press(getByTestId('select-estado-option-0'));

    fireEvent.press(getByTestId('button-consultar'));

    await waitFor(() => {
      expect(useGetProjetosBySearch).toHaveBeenCalledWith({
        nome: 'Projeto A',
        clienteId: '1',
        estadoId: '1',
        take: 20,
      });
    });
  });

  it('should render list of projetos', () => {
    render(<ProjetosConsultarScreen />);

    expect(screen.getByTestId('infinite-list')).toBeTruthy();
    expect(screen.getByText('Projeto A')).toBeTruthy();
    expect(screen.getByText('Projeto B')).toBeTruthy();
    expect(screen.getByText('cliente: João Silva')).toBeTruthy();
    expect(screen.getByText('Valor total: R$ 5.000,00')).toBeTruthy();
  });

  it('should display loading state when fetching projetos', () => {
    (useGetProjetosBySearch as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });

    render(<ProjetosConsultarScreen />);

    expect(screen.getByTestId('infinite-list-loading')).toBeTruthy();
  });

  it('should display empty message when no projetos are found', () => {
    (useGetProjetosBySearch as jest.Mock).mockReturnValue({
      data: { pages: [] },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });

    render(<ProjetosConsultarScreen />);

    expect(screen.getByTestId('infinite-list-empty')).toBeTruthy();
    expect(screen.getByText('Nenhum projeto encontrado')).toBeTruthy();
  });

  it('should render projeto without description', () => {
    render(<ProjetosConsultarScreen />);

    const listItem1 = screen.getByTestId('list-item-1');
    expect(listItem1).toBeTruthy();
    expect(screen.getByText('Projeto B')).toBeTruthy();
  });

  it('should initialize with empty filters', () => {
    render(<ProjetosConsultarScreen />);

    expect(useGetProjetosBySearch).toHaveBeenCalledWith({
      nome: undefined,
      clienteId: undefined,
      estadoId: undefined,
      take: 20,
    });
  });
});
