import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import ClientesScreen from '../../../../src/app/(platform)/clientes/index';

jest.mock('@/components/ListMenu', () => {
  const React = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');
  return {
    ListMenu: ({ dataMenu, ...props }: any) => (
      <View testID="list-menu">
        {dataMenu.map((item: any, index: number) => (
          <TouchableOpacity key={index} testID={`menu-item-${item.label}`} onPress={item.onPress}>
            <Text>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
  };
});

jest.mock('lucide-react-native', () => ({
  CirclePlus: 'CirclePlus',
  Search: 'Search',
}));

describe('ClientesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the screen', () => {
    const { getByTestId } = render(<ClientesScreen />);
    expect(getByTestId('list-menu')).toBeTruthy();
  });

  it('should render menu with two options', () => {
    render(<ClientesScreen />);

    expect(screen.getByText('Adicionar')).toBeTruthy();
    expect(screen.getByText('Consultar')).toBeTruthy();
  });

  it('should navigate to adicionar screen when adicionar button is pressed', () => {
    const { getByTestId } = render(<ClientesScreen />);

    const adicionarButton = getByTestId('menu-item-Adicionar');
    fireEvent.press(adicionarButton);

    expect(router.push).toHaveBeenCalledWith('/(platform)/clientes/adicionar');
  });

  it('should navigate to consultar screen when consultar button is pressed', () => {
    const { getByTestId } = render(<ClientesScreen />);

    const consultarButton = getByTestId('menu-item-Consultar');
    fireEvent.press(consultarButton);

    expect(router.push).toHaveBeenCalledWith('/(platform)/clientes/consultar');
  });

  it('should render adicionar menu item', () => {
    const { getByTestId } = render(<ClientesScreen />);

    expect(getByTestId('menu-item-Adicionar')).toBeTruthy();
  });

  it('should render consultar menu item', () => {
    const { getByTestId } = render(<ClientesScreen />);

    expect(getByTestId('menu-item-Consultar')).toBeTruthy();
  });
});
