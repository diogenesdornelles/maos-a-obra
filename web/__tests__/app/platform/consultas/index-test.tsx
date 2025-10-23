import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import ConsultasScreen from '../../../../src/app/(platform)/consultas/index';

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
  ShoppingBasket: 'ShoppingBasket',
}));

describe('ConsultasScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the screen', () => {
    const { getByTestId } = render(<ConsultasScreen />);
    expect(getByTestId('list-menu')).toBeTruthy();
  });

  it('should render itens menu option', () => {
    render(<ConsultasScreen />);

    expect(screen.getByText('Itens')).toBeTruthy();
  });

  it('should navigate to itens screen when itens button is pressed', () => {
    const { getByTestId } = render(<ConsultasScreen />);

    const itensButton = getByTestId('menu-item-Itens');
    fireEvent.press(itensButton);

    expect(router.push).toHaveBeenCalledWith('/(platform)/consultas/itens');
  });

  it('should render itens menu item', () => {
    const { getByTestId } = render(<ConsultasScreen />);

    expect(getByTestId('menu-item-Itens')).toBeTruthy();
  });
});
