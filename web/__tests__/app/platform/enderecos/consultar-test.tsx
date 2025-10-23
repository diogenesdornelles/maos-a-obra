import { useGetEnderecosBySearch } from '@/hooks/queries/enderecos/useGetEnderecosBySearch';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import EnderecosConsultarScreen from './../../../../src/app/(platform)/enderecos/consultar';

jest.mock('@/hooks/queries/enderecos/useGetEnderecosBySearch');
jest.mock('expo-router', () => ({
  Stack: {
    Screen: ({ options }: any) => null,
  },
}));

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

jest.mock('@/components/ui/button', () => ({
  Button: ({ onPress, children }: any) => {
    const { TouchableOpacity } = require('react-native');
    return (
      <TouchableOpacity testID="button-consultar" onPress={onPress}>
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
  InfiniteList: ({
    data,
    renderItem,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    onLoadMore,
    emptyMessage,
  }: any) => {
    const { Text, TouchableOpacity, View, ActivityIndicator } = require('react-native');

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
        {isFetchingNextPage && (
          <View testID="infinite-list-fetching">
            <ActivityIndicator />
          </View>
        )}
        {hasNextPage && (
          <TouchableOpacity testID="load-more-button" onPress={onLoadMore}>
            <Text>Carregar mais</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
}));

describe('EnderecosConsultarScreen', () => {
  const mockFetchNextPage = jest.fn();

  const mockEnderecosData = {
    pages: [
      [
        {
          id: '1',
          logradouro: 'Rua das Flores',
          numero: '123',
          cep: '12345-678',
          complemento: 'Apto 101',
          bairro: {
            id: '1',
            nome: 'Centro - São Paulo',
            uf: 'SP',
          },
        },
        {
          id: '2',
          logradouro: 'Av. Paulista',
          numero: '1000',
          cep: '01310-100',
          complemento: null,
          bairro: {
            id: '2',
            nome: 'Bela Vista - São Paulo',
            uf: 'SP',
          },
        },
      ],
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useGetEnderecosBySearch as jest.Mock).mockReturnValue({
      data: mockEnderecosData,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
    });
  });

  it('should render all form fields', () => {
    render(<EnderecosConsultarScreen />);

    expect(screen.getByText('Logradouro')).toBeTruthy();
    expect(screen.getByText('CEP')).toBeTruthy();
    expect(screen.getByText('Número')).toBeTruthy();
    expect(screen.getByTestId('button-consultar')).toBeTruthy();
  });

  it('should update input values when typing', () => {
    const { getByTestId } = render(<EnderecosConsultarScreen />);

    const logradouroInput = getByTestId('input-logradouro');
    const cepInput = getByTestId('input-cep');
    const numeroInput = getByTestId('input-número');

    fireEvent.changeText(logradouroInput, 'Rua das Flores');
    fireEvent.changeText(cepInput, '12345-678');
    fireEvent.changeText(numeroInput, '123');

    expect(logradouroInput.props.value).toBe('Rua das Flores');
    expect(cepInput.props.value).toBe('12345-678');
    expect(numeroInput.props.value).toBe('123');
  });

  it('should call useGetEnderecosBySearch with filters when submit button is pressed', async () => {
    const { getByTestId } = render(<EnderecosConsultarScreen />);

    fireEvent.changeText(getByTestId('input-logradouro'), 'Rua das Flores');
    fireEvent.changeText(getByTestId('input-cep'), '12345-678');
    fireEvent.changeText(getByTestId('input-número'), '123');

    fireEvent.press(getByTestId('button-consultar'));

    await waitFor(() => {
      expect(useGetEnderecosBySearch).toHaveBeenCalledWith({
        logradouro: 'Rua das Flores',
        cep: '12345-678',
        numero: '123',
        take: 20,
      });
    });
  });

  it('should render list of enderecos when data is available', () => {
    render(<EnderecosConsultarScreen />);

    expect(screen.getByTestId('infinite-list')).toBeTruthy();
    expect(screen.getByText('Centro')).toBeTruthy();
    expect(screen.getByText('Logradouro: Rua das Flores, 123')).toBeTruthy();
    expect(screen.getAllByText('Cidade: São Paulo, SP')).toHaveLength(2);
    expect(screen.getByText('CEP: 12345-678')).toBeTruthy();
  });

  it('should display loading state when fetching data', () => {
    (useGetEnderecosBySearch as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
    });

    render(<EnderecosConsultarScreen />);

    expect(screen.getByTestId('infinite-list-loading')).toBeTruthy();
  });

  it('should display empty message when no data is found', () => {
    (useGetEnderecosBySearch as jest.Mock).mockReturnValue({
      data: { pages: [] },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
    });

    render(<EnderecosConsultarScreen />);

    expect(screen.getByTestId('infinite-list-empty')).toBeTruthy();
    expect(screen.getByText('Nenhum endereço encontrado')).toBeTruthy();
  });

  it('should call fetchNextPage when load more button is pressed', () => {
    (useGetEnderecosBySearch as jest.Mock).mockReturnValue({
      data: mockEnderecosData,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: true,
      fetchNextPage: mockFetchNextPage,
    });

    const { getByTestId } = render(<EnderecosConsultarScreen />);

    fireEvent.press(getByTestId('load-more-button'));

    expect(mockFetchNextPage).toHaveBeenCalled();
  });

  it('should show fetching indicator when loading more data', () => {
    (useGetEnderecosBySearch as jest.Mock).mockReturnValue({
      data: mockEnderecosData,
      isLoading: false,
      isFetchingNextPage: true,
      hasNextPage: true,
      fetchNextPage: mockFetchNextPage,
    });

    render(<EnderecosConsultarScreen />);

    expect(screen.getByTestId('infinite-list-fetching')).toBeTruthy();
  });

  it('should render multiple enderecos correctly', () => {
    render(<EnderecosConsultarScreen />);

    expect(screen.getByTestId('list-item-0')).toBeTruthy();
    expect(screen.getByTestId('list-item-1')).toBeTruthy();
    expect(screen.getByText('Centro')).toBeTruthy();
    expect(screen.getByText('Bela Vista')).toBeTruthy();
  });

  it('should render endereco without complemento', () => {
    render(<EnderecosConsultarScreen />);

    const listItem1 = screen.getByTestId('list-item-1');
    expect(listItem1).toBeTruthy();

    expect(screen.getByText('Logradouro: Av. Paulista, 1000')).toBeTruthy();
  });

  it('should initialize with empty filters', () => {
    render(<EnderecosConsultarScreen />);

    expect(useGetEnderecosBySearch).toHaveBeenCalledWith({
      logradouro: '',
      cep: '',
      numero: '',
      take: 20,
    });
  });
});
