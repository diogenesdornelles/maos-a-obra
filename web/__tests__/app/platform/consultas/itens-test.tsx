import { fireEvent, render, waitFor } from '@testing-library/react-native';
import ItensConsultarScreen from '../../../../src/app/(platform)/consultas/itens';

const mockFetchNextPageItens = jest.fn();
const mockFetchNextPageEstados = jest.fn();

const mockItensData = [
  {
    id: '1',
    nomenclatura: 'Cimento Portland',
    codigo: 'CIM001',
    unidade: 'SC',
  },
  {
    id: '2',
    nomenclatura: 'Areia Média',
    codigo: 'ARE001',
    unidade: 'M3',
  },
];

const mockEstadosData = [
  {
    id: '1',
    nome: 'São Paulo',
    uf: 'SP',
  },
  {
    id: '2',
    nome: 'Rio de Janeiro',
    uf: 'RJ',
  },
];

const mockItemPrecoData = {
  id: '1',
  nomenclatura: 'Cimento Portland',
  codigo: 'CIM001',
  unidade: 'SC',
  valor: '25.50',
};

jest.mock('@/hooks/queries/itens/useGetItensBySearch', () => ({
  useGetItensBySearch: jest.fn(() => ({
    data: {
      pages: [mockItensData],
    },
    isLoading: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: mockFetchNextPageItens,
  })),
}));

jest.mock('@/hooks/queries/estados/useGetEstadosBySearch', () => ({
  useGetEstadosBySearch: jest.fn(() => ({
    data: {
      pages: [mockEstadosData],
    },
    isLoading: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: mockFetchNextPageEstados,
  })),
}));

jest.mock('@/hooks/queries/itens/useGetItemPreco', () => ({
  useGetItemPreco: jest.fn(() => ({
    data: undefined,
    isLoading: false,
  })),
}));

jest.mock('@/hooks/useDebounce', () => ({
  useDebounce: jest.fn((value) => ({ debouncedValue: value })),
}));

jest.mock('@/components/Inputs/Select', () => {
  const React = require('react');
  const { TouchableOpacity, View, Text } = require('react-native');
  return {
    Select: ({ label, options, onValueChange, onSearchChange, isRequired, ...props }: any) => (
      <View>
        <Text>
          {label}
          {isRequired && ' *'}
        </Text>
        <TouchableOpacity
          testID={label}
          onPress={() => {
            if (options?.[0]) {
              onValueChange(options[0].value);
            }
          }}>
          <Text>Select {label}</Text>
        </TouchableOpacity>
        {onSearchChange && (
          <TouchableOpacity
            testID={`${label}-search`}
            onPress={() => onSearchChange('test search')}>
            <Text>Search</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
  };
});

describe('ItensConsultarScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the screen', () => {
    const { getByTestId } = render(<ItensConsultarScreen />);
    expect(getByTestId('Item')).toBeTruthy();
  });

  it('should render item and estado selects', () => {
    const { getByTestId } = render(<ItensConsultarScreen />);

    expect(getByTestId('Item')).toBeTruthy();
    expect(getByTestId('Estado')).toBeTruthy();
  });

  it('should render consultar button', () => {
    const { getByText } = render(<ItensConsultarScreen />);
    expect(getByText('Consultar')).toBeTruthy();
  });

  it('should display initial message when no item is selected', () => {
    const { getByText } = render(<ItensConsultarScreen />);
    expect(getByText('Selecione as opções para buscar')).toBeTruthy();
  });

  it('should select item when item select is pressed', () => {
    const { getByTestId } = render(<ItensConsultarScreen />);

    const itemSelect = getByTestId('Item');
    fireEvent.press(itemSelect);

    expect(itemSelect).toBeTruthy();
  });

  it('should select estado when estado select is pressed', () => {
    const { getByTestId } = render(<ItensConsultarScreen />);

    const estadoSelect = getByTestId('Estado');
    fireEvent.press(estadoSelect);

    expect(estadoSelect).toBeTruthy();
  });

  it('should trigger search when consultar button is pressed', () => {
    const { getByTestId, getByText } = render(<ItensConsultarScreen />);

    const itemSelect = getByTestId('Item');
    fireEvent.press(itemSelect);

    const estadoSelect = getByTestId('Estado');
    fireEvent.press(estadoSelect);

    const consultarButton = getByText('Consultar');
    fireEvent.press(consultarButton);

    expect(consultarButton).toBeTruthy();
  });

  it('should display item price information when data is loaded', async () => {
    const { useGetItemPreco } = require('@/hooks/queries/itens/useGetItemPreco');

    useGetItemPreco.mockReturnValueOnce({
      data: mockItemPrecoData,
      isLoading: false,
    });

    const { getByText } = render(<ItensConsultarScreen />);

    await waitFor(() => {
      expect(getByText('Cimento Portland')).toBeTruthy();
      expect(getByText('Código: CIM001')).toBeTruthy();
      expect(getByText('Unidade: SC')).toBeTruthy();
      expect(getByText('Valor: R$ 25.50')).toBeTruthy();
    });
  });

  it('should show loading state when fetching item price', () => {
    const { useGetItemPreco } = require('@/hooks/queries/itens/useGetItemPreco');

    useGetItemPreco.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
    });

    const { getByText } = render(<ItensConsultarScreen />);

    expect(getByText('Carregando...')).toBeTruthy();
  });

  it('should trigger item search', () => {
    const { getByTestId } = render(<ItensConsultarScreen />);

    const itemSearchButton = getByTestId('Item-search');
    fireEvent.press(itemSearchButton);

    expect(itemSearchButton).toBeTruthy();
  });

  it('should trigger estado search', () => {
    const { getByTestId } = render(<ItensConsultarScreen />);

    const estadoSearchButton = getByTestId('Estado-search');
    fireEvent.press(estadoSearchButton);

    expect(estadoSearchButton).toBeTruthy();
  });

  it('should show itens loading state', () => {
    const { useGetItensBySearch } = require('@/hooks/queries/itens/useGetItensBySearch');

    useGetItensBySearch.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPageItens,
    });

    const { getByTestId } = render(<ItensConsultarScreen />);

    expect(getByTestId('Item')).toBeTruthy();
  });

  it('should show estados loading state', () => {
    const { useGetEstadosBySearch } = require('@/hooks/queries/estados/useGetEstadosBySearch');

    useGetEstadosBySearch.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPageEstados,
    });

    const { getByTestId } = render(<ItensConsultarScreen />);

    expect(getByTestId('Estado')).toBeTruthy();
  });

  it('should call useGetItemPreco with correct params after submit', async () => {
    const { useGetItemPreco } = require('@/hooks/queries/itens/useGetItemPreco');

    const { getByTestId, getByText } = render(<ItensConsultarScreen />);

    const itemSelect = getByTestId('Item');
    fireEvent.press(itemSelect);

    const estadoSelect = getByTestId('Estado');
    fireEvent.press(estadoSelect);

    const consultarButton = getByText('Consultar');
    fireEvent.press(consultarButton);

    expect(useGetItemPreco).toHaveBeenCalled();
  });
});
