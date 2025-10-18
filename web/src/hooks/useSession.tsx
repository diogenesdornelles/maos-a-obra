import { usersApi } from '@/api/usuarioApi';
import { useStoreSession } from '@/contexts/authStore';
import { SessionProps } from '@/types/auth/auth';
import { jwtDecode } from 'jwt-decode';
import { deleteToken, getToken, saveToken } from './useStorage';

export function useSession() {
  const isTokenExpired = (exp: number): boolean => {
    const now = Date.now();
    const expiresAt = exp * 1000;
    return now >= expiresAt;
  };

  async function validateToken(token?: string) {
    if (!token) return null;

    try {
      const decoded = jwtDecode<SessionProps>(token);

      if (decoded?.exp && isTokenExpired(decoded.exp)) {
        return null;
      }

      return decoded;
    } catch {
      return null;
    }
  }

  async function signIn(token?: string) {
    const setToken = useStoreSession.getState().setToken;
    const setSession = useStoreSession.getState().setSession;

    if (!token) return;

    const decoded = await validateToken(token);

    if (decoded) {
      await saveToken(token);
      setToken(token);
      setSession(decoded);
    } else {
      await deleteToken();
      setToken(undefined);
      setSession(undefined);
    }
  }

  async function signOut() {
    const setToken = useStoreSession.getState().setToken;
    const setSession = useStoreSession.getState().setSession;

    await deleteToken();
    setToken(undefined);
    setSession(undefined);
  }

  function getSession() {
    const session = useStoreSession.getState().session;
    const token = useStoreSession.getState().token;

    return { token, ...session };
  }

  async function restoreSession() {
    const setToken = useStoreSession.getState().setToken;
    const setSession = useStoreSession.getState().setSession;

    const token = await getToken();
    if (!token) return;

    try {
      const decoded = await validateToken(token);

      if (!decoded) {
        throw new Error('Invalid token on restore');
      }

      await usersApi.getMe();

      setToken(token);
      setSession(decoded);
    } catch (e) {
      console.error('Failed to restore session:', e);
      await deleteToken();
      setToken(undefined);
      setSession(undefined);
    }
  }

  return { validateToken, signIn, signOut, getSession, restoreSession };
}
