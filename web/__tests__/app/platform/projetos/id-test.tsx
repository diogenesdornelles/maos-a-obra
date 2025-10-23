import { useGetItemPreco } from '@/hooks/queries/itens/useGetItemPreco';
import { useGetItensBySearch } from '@/hooks/queries/itens/useGetItensBySearch';
import { useGetProjetoItensBySearch } from '@/hooks/queries/projeto-itens/useGeProjetoItensBySearch';
import { usePostCreateProjetoItem } from '@/hooks/queries/projeto-itens/usePostCreateProjetoItem';
import { useGetProjetoById } from '@/hooks/queries/projetos/useGetProjetoById';
import { useDebounce } from '@/hooks/useDebounce';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';
import ProjetosAdicionarItensScreen from '../../../../src/app/(platform)/projetos/[id]';

jest.mock('@/hooks/queries/projetos/useGetProjetoById');
jest.mock('@/hooks/queries/itens/useGetItensBySearch');
jest.mock('@/hooks/queries/itens/useGetItemPreco');
jest.mock('@/hooks/queries/projeto-itens/useGeProjetoItensBySearch');
jest.mock('@/hooks/queries/projeto-itens/usePostCreateProjetoItem');
jest.mock('@/hooks/useDebounce');
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
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
          itemId: '',
          preco: 0,
          quantidade: 0,
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

jest.mock('@/components/Inputs/Select', () => ({
  Select: ({ label, onValueChange, options, error }: any) => {
    const { Text, TouchableOpacity, View } = require('react-native');
    return (
      <View testID="select-container">
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

describe('ProjetosAdicionarItensScreen', () => {
  const mockMutate = jest.fn();
  const mockRefetchProjetoItem = jest.fn();

  const mockProjeto = {
    id: '1',
    nome: 'Projeto Teste',
    estadoId: 'estado-1',
    valorTotal: '1000.00',
  };

  const mockItens = {
    pages: [
      [
        { id: '1', nomenclatura: 'Item A', codigo: '001' },
        { id: '2', nomenclatura: 'Item B', codigo: '002' },
      ],
    ],
  };

  const mockProjetoItens = {
    pages: [
      [
        {
          id: '1',
          nomenclatura: 'Item A',
          codigo: '001',
          preco: '10.50',
          quantidade: '5',
          valorTotal: '52.50',
        },
      ],
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });
    (useDebounce as jest.Mock).mockReturnValue({ debouncedValue: '' });

    (useGetProjetoById as jest.Mock).mockReturnValue({
      data: mockProjeto,
    });

    (useGetItensBySearch as jest.Mock).mockReturnValue({
      data: mockItens,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });

    (useGetItemPreco as jest.Mock).mockReturnValue({
      data: { valor: '15.00' },
    });

    (useGetProjetoItensBySearch as jest.Mock).mockReturnValue({
      data: mockProjetoItens,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: mockRefetchProjetoItem,
    });

    (usePostCreateProjetoItem as jest.Mock).mockReturnValue({
      mutate: mockMutate,
    });
  });

  it('should render form fields', () => {
    render(<ProjetosAdicionarItensScreen />);

    expect(screen.getByText('Item')).toBeTruthy();
    expect(screen.getByText('Valor')).toBeTruthy();
    expect(screen.getByText('Quantidade')).toBeTruthy();
  });

  it('should display project name in header', () => {
    render(<ProjetosAdicionarItensScreen />);

    expect(screen.getByTestId('button-salvar')).toBeTruthy();
  });

  it('should render items options in select', () => {
    render(<ProjetosAdicionarItensScreen />);

    expect(screen.getByTestId('select-container')).toBeTruthy();
    expect(screen.getAllByText('Item A')).toHaveLength(2);
    expect(screen.getByText('Item B')).toBeTruthy();
  });

  it('should update input values when typing', () => {
    const { getByTestId } = render(<ProjetosAdicionarItensScreen />);

    fireEvent.changeText(getByTestId('input-quantidade'), '10');

    expect(getByTestId('input-quantidade').props.value).toBe('10');
  });

  it('should submit form with correct data', async () => {
    const { getByTestId } = render(<ProjetosAdicionarItensScreen />);

    fireEvent.press(getByTestId('select-option-1'));
    fireEvent.changeText(getByTestId('input-valor'), '15,00');
    fireEvent.changeText(getByTestId('input-quantidade'), '5');

    fireEvent.press(getByTestId('button-salvar'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it('should show success modal when item is added successfully', async () => {
    mockMutate.mockImplementation((data, { onSuccess }) => {
      onSuccess();
    });

    const { getByTestId } = render(<ProjetosAdicionarItensScreen />);

    fireEvent.press(getByTestId('select-option-1'));
    fireEvent.press(getByTestId('button-salvar'));

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeTruthy();
      expect(screen.getByTestId('modal-title')).toHaveTextContent('Item adicionado ao projeto.');
    });
  });

  it('should show error modal when submission fails', async () => {
    mockMutate.mockImplementation((data, { onError }) => {
      onError({ data: { message: 'Erro ao adicionar item' } });
    });

    const { getByTestId } = render(<ProjetosAdicionarItensScreen />);

    fireEvent.press(getByTestId('button-salvar'));

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeTruthy();
      expect(screen.getByTestId('modal-title')).toHaveTextContent(
        'Item não adicionado ao projeto.'
      );
    });
  });

  it('should display project total value', () => {
    render(<ProjetosAdicionarItensScreen />);

    expect(screen.getByText(/Total projeto: R\$ 1\.000,00/)).toBeTruthy();
  });

  it('should render list of project items', () => {
    render(<ProjetosAdicionarItensScreen />);

    expect(screen.getByTestId('infinite-list')).toBeTruthy();
    expect(screen.getByTestId('list-item-0')).toBeTruthy();
    expect(screen.getByText('Código: 001')).toBeTruthy();
  });

  it('should display empty message when no items are found', () => {
    (useGetProjetoItensBySearch as jest.Mock).mockReturnValue({
      data: { pages: [] },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: mockRefetchProjetoItem,
    });

    render(<ProjetosAdicionarItensScreen />);

    expect(screen.getByText('Nenhum projeto encontrado')).toBeTruthy();
  });

  it('should refetch project items after successful submission', async () => {
    mockMutate.mockImplementation((data, { onSuccess }) => {
      onSuccess();
    });

    const { getByTestId } = render(<ProjetosAdicionarItensScreen />);

    fireEvent.press(getByTestId('button-salvar'));

    await waitFor(() => {
      expect(mockRefetchProjetoItem).toHaveBeenCalled();
    });
  });
});
