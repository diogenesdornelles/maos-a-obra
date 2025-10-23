import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import ProjectScreen from './../../../../src/app/(platform)/projetos/index';

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

describe('ProjectScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render menu items', () => {
    render(<ProjectScreen />);

    expect(screen.getByTestId('list-menu')).toBeTruthy();
    expect(screen.getByText('Adicionar')).toBeTruthy();
    expect(screen.getByText('Consultar')).toBeTruthy();
  });

  it('should navigate to adicionar screen when clicking Adicionar', () => {
    render(<ProjectScreen />);

    fireEvent.press(screen.getByTestId('menu-item-adicionar'));

    expect(router.push).toHaveBeenCalledWith('/(platform)/projetos/adicionar');
  });

  it('should navigate to consultar screen when clicking Consultar', () => {
    render(<ProjectScreen />);

    fireEvent.press(screen.getByTestId('menu-item-consultar'));

    expect(router.push).toHaveBeenCalledWith('/(platform)/projetos/consultar');
  });
});
