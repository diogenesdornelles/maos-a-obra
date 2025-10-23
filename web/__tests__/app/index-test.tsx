import { useSession } from '@/hooks/useSession';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import InitialScreen from './../../src/app/index';

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

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => {
    const { View } = require('react-native');
    return <View testID="safe-area-view">{children}</View>;
  },
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ onPress, children }: any) => {
    const { TouchableOpacity } = require('react-native');
    return (
      <TouchableOpacity
        testID={`button-${children.props.children.toLowerCase()}`}
        onPress={onPress}>
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

describe('InitialScreen', () => {
  const mockGetSession = jest.fn();
  const mockRestoreSession = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useSession as jest.Mock).mockReturnValue({
      getSession: mockGetSession,
      restoreSession: mockRestoreSession,
    });
  });

  it('should show loading state initially', () => {
    mockRestoreSession.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<InitialScreen />);

    expect(screen.getByText('Carregando...')).toBeTruthy();
  });

  it('should navigate to home when session exists', async () => {
    mockRestoreSession.mockResolvedValue(undefined);
    mockGetSession.mockReturnValue({ token: 'valid-token' });

    render(<InitialScreen />);

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/(platform)/home');
    });
  });

  it('should show login and register buttons when no session exists', async () => {
    mockRestoreSession.mockResolvedValue(undefined);
    mockGetSession.mockReturnValue(null);

    render(<InitialScreen />);

    await waitFor(() => {
      expect(screen.getByText('Mãos à obra')).toBeTruthy();
      expect(screen.getByText('Login')).toBeTruthy();
      expect(screen.getByText('Registrar')).toBeTruthy();
    });
  });

  it('should navigate to login when clicking Login button', async () => {
    mockRestoreSession.mockResolvedValue(undefined);
    mockGetSession.mockReturnValue(null);

    render(<InitialScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('button-login')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('button-login'));

    expect(router.push).toHaveBeenCalledWith('/(auth)/login');
  });

  it('should navigate to signUp when clicking Registrar button', async () => {
    mockRestoreSession.mockResolvedValue(undefined);
    mockGetSession.mockReturnValue(null);

    render(<InitialScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('button-registrar')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('button-registrar'));

    expect(router.push).toHaveBeenCalledWith('/(auth)/signUp');
  });

  it('should handle session restore error gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockRestoreSession.mockRejectedValue(new Error('Restore failed'));
    mockGetSession.mockReturnValue(null);

    render(<InitialScreen />);

    await waitFor(() => {
      expect(screen.getByText('Login')).toBeTruthy();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error restoring session:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it('should show title "Mãos à obra"', async () => {
    mockRestoreSession.mockResolvedValue(undefined);
    mockGetSession.mockReturnValue(null);

    render(<InitialScreen />);

    await waitFor(() => {
      expect(screen.getByText('Mãos à obra')).toBeTruthy();
    });
  });
});
