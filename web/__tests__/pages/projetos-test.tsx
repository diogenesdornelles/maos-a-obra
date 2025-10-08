import ProjectScreen from '@/app/(platform)/projetos';
import { render } from '@testing-library/react-native';
import React from 'react';

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
    CirclePlus: () => <Text>CirclePlus Icon</Text>,
    Search: () => <Text>Search Icon</Text>,
  };
});

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar todos os 2 itens do menu', () => {
    const { getByText } = render(<ProjectScreen />);

    const menuItems = ['Adicionar', 'Consultar'];

    menuItems.forEach((item) => {
      expect(getByText(item)).toBeTruthy();
    });
  });
});
