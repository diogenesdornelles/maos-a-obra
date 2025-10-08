import { render } from '@testing-library/react-native';
import React from 'react';
import Home from '../../src/app/(platform)/home';

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  router: {
    push: mockPush,
    replace: mockReplace,
  },
  Stack: {
    Screen: ({ options }: any) => {
      return null;
    },
  },
}));

const mockSignOut = jest.fn();
jest.mock('@/contexts/authStore', () => ({
  signOut: mockSignOut,
}));

jest.mock('lucide-react-native', () => {
  const { Text } = require('react-native');
  return {
    Calculator: () => <Text>Calculator Icon</Text>,
    FileText: () => <Text>FileText Icon</Text>,
    LayoutDashboard: () => <Text>LayoutDashboard Icon</Text>,
    LogOut: () => <Text>LogOut Icon</Text>,
    MapPin: () => <Text>MapPin Icon</Text>,
    Search: () => <Text>Search Icon</Text>,
    User: () => <Text>User Icon</Text>,
    Users: () => <Text>Users Icon</Text>,
  };
});

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar todos os 8 itens do menu', () => {
    const { getByText } = render(<Home />);

    const menuItems = [
      'Projetos',
      'Estimativas',
      'Perfil',
      'Clientes',
      'Consultas',
      'Relatórios',
      'Endereços',
      'Logout',
    ];

    menuItems.forEach((item) => {
      expect(getByText(item)).toBeTruthy();
    });
  });
});
