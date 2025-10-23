import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import ClientesConsultarScreen from '../../../../src/app/(platform)/clientes/consultar';

const mockFetchNextPage = jest.fn();

const mockClientesData = [
  {
    id: '1',
    nome: 'João',
    sobrenome: 'Silva',
    cpf: '12345678901',
    email: 'joao@example.com',
    telefone: '11987654321',
    endereco: {
      logradouro: 'Rua Teste',
      bairro: {
        nome: 'Bairro Teste',
      },
    },
  },
  {
    id: '2',
    nome: 'Maria',
    sobrenome: 'Santos',
    cnpj: '12345678000190',
    email: 'maria@example.com',
  },
];

jest.mock('@/hooks/queries/clients/useGetClientesBySearch', () => ({
  useGetClientesBySearch: jest.fn(() => ({
    data: {
      pages: [mockClientesData],
    },
    isLoading: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: mockFetchNextPage,
  })),
}));

jest.mock('@/components/InfiniteList', () => {
  const React = require('react');
  const { View, Text, FlatList } = require('react-native');
  return {
    InfiniteList: ({ data, renderItem, emptyMessage, isLoading, ...props }: any) => {
      if (isLoading) {
        return <Text testID="loading">Carregando...</Text>;
      }
      if (!data || data.length === 0) {
        return <Text testID="empty-message">{emptyMessage}</Text>;
      }
      return (
        <FlatList
          testID="infinite-list"
          data={data}
          renderItem={({ item }: { item: any }) => renderItem(item)}
          keyExtractor={(item: any) => item.id}
        />
      );
    },
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

describe('ClientesConsultarScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the screen', () => {
    render(<ClientesConsultarScreen />);
    expect(screen.getByTestId('Nome')).toBeTruthy();
  });

  it('should render all filter input fields', () => {
    render(<ClientesConsultarScreen />);

    expect(screen.getByTestId('Nome')).toBeTruthy();
    expect(screen.getByTestId('CPF')).toBeTruthy();
    expect(screen.getByTestId('CNPJ')).toBeTruthy();
    expect(screen.getByTestId('Email')).toBeTruthy();
  });

  it('should render search button', () => {
    render(<ClientesConsultarScreen />);
    expect(screen.getByText('Consultar')).toBeTruthy();
  });

  it('should render list of clients', () => {
    render(<ClientesConsultarScreen />);

    expect(screen.getByText('João Silva')).toBeTruthy();
    expect(screen.getByText('Maria Santos')).toBeTruthy();
  });

  it('should display client CPF when available', () => {
    render(<ClientesConsultarScreen />);

    expect(screen.getByText('CPF: 12345678901')).toBeTruthy();
  });

  it('should display client CNPJ when available', () => {
    render(<ClientesConsultarScreen />);

    expect(screen.getByText('CNPJ: 12345678000190')).toBeTruthy();
  });

  it('should display client email when available', () => {
    render(<ClientesConsultarScreen />);

    expect(screen.getByText('Email: joao@example.com')).toBeTruthy();
    expect(screen.getByText('Email: maria@example.com')).toBeTruthy();
  });

  it('should display client phone when available', () => {
    render(<ClientesConsultarScreen />);

    expect(screen.getByText('Telefone: 11987654321')).toBeTruthy();
  });

  it('should display client address when available', () => {
    render(<ClientesConsultarScreen />);

    expect(screen.getByText('Logradouro: Rua Teste')).toBeTruthy();
  });

  it('should update nome input value', () => {
    render(<ClientesConsultarScreen />);

    const nomeInput = screen.getByTestId('Nome');
    fireEvent.changeText(nomeInput, 'João');

    expect(nomeInput.props.value).toBe('João');
  });

  it('should update cpf input value', () => {
    render(<ClientesConsultarScreen />);

    const cpfInput = screen.getByTestId('CPF');
    fireEvent.changeText(cpfInput, '12345678901');

    expect(cpfInput.props.value).toBe('12345678901');
  });

  it('should update cnpj input value', () => {
    render(<ClientesConsultarScreen />);

    const cnpjInput = screen.getByTestId('CNPJ');
    fireEvent.changeText(cnpjInput, '12345678000190');

    expect(cnpjInput.props.value).toBe('12345678000190');
  });

  it('should update email input value', () => {
    render(<ClientesConsultarScreen />);

    const emailInput = screen.getByTestId('Email');
    fireEvent.changeText(emailInput, 'test@example.com');

    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('should trigger search when consultar button is pressed', () => {
    const { useGetClientesBySearch } = require('@/hooks/queries/clients/useGetClientesBySearch');

    render(<ClientesConsultarScreen />);

    const nomeInput = screen.getByTestId('Nome');
    fireEvent.changeText(nomeInput, 'João');

    const consultarButton = screen.getByText('Consultar');
    fireEvent.press(consultarButton);

    expect(useGetClientesBySearch).toHaveBeenCalled();
  });

  it('should show empty message when no clients found', () => {
    const { useGetClientesBySearch } = require('@/hooks/queries/clients/useGetClientesBySearch');

    useGetClientesBySearch.mockReturnValueOnce({
      data: { pages: [[]] },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
    });

    render(<ClientesConsultarScreen />);

    expect(screen.getByText('Nenhum cliente encontrado')).toBeTruthy();
  });

  it('should show loading state', () => {
    const { useGetClientesBySearch } = require('@/hooks/queries/clients/useGetClientesBySearch');

    useGetClientesBySearch.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
    });

    render(<ClientesConsultarScreen />);

    expect(screen.getByTestId('loading')).toBeTruthy();
  });

  it('should filter clients by multiple criteria', async () => {
    render(<ClientesConsultarScreen />);

    fireEvent.changeText(screen.getByTestId('Nome'), 'João');
    fireEvent.changeText(screen.getByTestId('CPF'), '12345678901');
    fireEvent.changeText(screen.getByTestId('Email'), 'joao@example.com');

    const consultarButton = screen.getByText('Consultar');
    fireEvent.press(consultarButton);

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeTruthy();
    });
  });
});
