import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import EnderecosScreen from './../../../../src/app/(platform)/enderecos/index';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
  Stack: {
    Screen: ({ options }: any) => null,
  },
}));

jest.mock('lucide-react-native', () => ({
  CirclePlus: 'CirclePlus',
  Search: 'Search',
}));

jest.mock('@/components/ListMenu', () => ({
  ListMenu: ({ dataMenu }: any) => {
    const { TouchableOpacity, Text, View } = require('react-native');
    return (
      <View testID="list-menu">
        {dataMenu.map((item: any, index: number) => (
          <TouchableOpacity
            key={index}
            testID={`menu-item-${item.label.toLowerCase()}`}
            onPress={item.onPress}>
            <Text>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  },
}));

describe('EnderecosScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render menu items', () => {
    render(<EnderecosScreen />);

    expect(screen.getByTestId('list-menu')).toBeTruthy();
    expect(screen.getByText('Adicionar')).toBeTruthy();
    expect(screen.getByText('Consultar')).toBeTruthy();
  });

  it('should navigate to adicionar screen when clicking Adicionar', () => {
    render(<EnderecosScreen />);

    fireEvent.press(screen.getByTestId('menu-item-adicionar'));

    expect(router.push).toHaveBeenCalledWith('/(platform)/enderecos/adicionar');
  });

  it('should navigate to consultar screen when clicking Consultar', () => {
    render(<EnderecosScreen />);

    fireEvent.press(screen.getByTestId('menu-item-consultar'));

    expect(router.push).toHaveBeenCalledWith('/(platform)/enderecos/consultar');
  });
});
