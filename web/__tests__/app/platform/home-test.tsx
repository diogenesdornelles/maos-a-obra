import { useSession } from '@/hooks/useSession';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import Home from './../../../src/app/(platform)/home';

jest.mock('@/hooks/useSession');
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
  Stack: {
    Screen: ({ options }: any) => null,
  },
}));

jest.mock('lucide-react-native', () => ({
  Calculator: 'Calculator',
  FileText: 'FileText',
  LayoutDashboard: 'LayoutDashboard',
  LogOut: 'LogOut',
  MapPin: 'MapPin',
  Search: 'Search',
  User: 'User',
  Users: 'Users',
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

jest.mock('@/components/Modal', () => ({
  Modal: ({ isOpen, title, footerButtons }: any) => {
    const { Text, View } = require('react-native');
    if (!isOpen) return null;
    return (
      <View testID="modal">
        <Text testID="modal-title">{title}</Text>
        {footerButtons}
      </View>
    );
  },
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ onPress, children }: any) => {
    const { TouchableOpacity } = require('react-native');
    return (
      <TouchableOpacity testID="button-close-modal" onPress={onPress}>
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

describe('Home', () => {
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useSession as jest.Mock).mockReturnValue({
      signOut: mockSignOut,
    });
  });

  it('should render all menu items', () => {
    render(<Home />);

    expect(screen.getByTestId('list-menu')).toBeTruthy();
    expect(screen.getByText('Projetos')).toBeTruthy();
    expect(screen.getByText('Estimativas')).toBeTruthy();
    expect(screen.getByText('Perfil')).toBeTruthy();
    expect(screen.getByText('Clientes')).toBeTruthy();
    expect(screen.getByText('Consultas')).toBeTruthy();
    expect(screen.getByText('Relatórios')).toBeTruthy();
    expect(screen.getByText('Endereços')).toBeTruthy();
    expect(screen.getByText('Logout')).toBeTruthy();
  });

  it('should navigate to projetos when clicking Projetos', () => {
    render(<Home />);

    fireEvent.press(screen.getByTestId('menu-item-projetos'));

    expect(router.push).toHaveBeenCalledWith('/(platform)/projetos');
  });

  it('should navigate to perfil when clicking Perfil', () => {
    render(<Home />);

    fireEvent.press(screen.getByTestId('menu-item-perfil'));

    expect(router.push).toHaveBeenCalledWith('/(platform)/me');
  });

  it('should navigate to clientes when clicking Clientes', () => {
    render(<Home />);

    fireEvent.press(screen.getByTestId('menu-item-clientes'));

    expect(router.push).toHaveBeenCalledWith('/(platform)/clientes');
  });

  it('should navigate to consultas when clicking Consultas', () => {
    render(<Home />);

    fireEvent.press(screen.getByTestId('menu-item-consultas'));

    expect(router.push).toHaveBeenCalledWith('/(platform)/consultas');
  });

  it('should navigate to enderecos when clicking Endereços', () => {
    render(<Home />);

    fireEvent.press(screen.getByTestId('menu-item-endereços'));

    expect(router.push).toHaveBeenCalledWith('/(platform)/enderecos');
  });

  it('should open modal when clicking Estimativas', () => {
    render(<Home />);

    fireEvent.press(screen.getByTestId('menu-item-estimativas'));

    expect(screen.getByTestId('modal')).toBeTruthy();
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Em breve...');
  });

  it('should open modal when clicking Relatórios', () => {
    render(<Home />);

    fireEvent.press(screen.getByTestId('menu-item-relatórios'));

    expect(screen.getByTestId('modal')).toBeTruthy();
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Em breve...');
  });

  it('should close modal when clicking Fechar button', () => {
    const { queryByTestId } = render(<Home />);

    fireEvent.press(screen.getByTestId('menu-item-estimativas'));
    expect(screen.getByTestId('modal')).toBeTruthy();

    fireEvent.press(screen.getByTestId('button-close-modal'));
    expect(queryByTestId('modal')).toBeNull();
  });

  it('should call signOut and navigate to home when clicking Logout', async () => {
    render(<Home />);

    fireEvent.press(screen.getByTestId('menu-item-logout'));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(router.replace).toHaveBeenCalledWith('/');
    });
  });
});
