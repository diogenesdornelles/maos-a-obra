import { deleteToken, getToken, saveToken } from '@/hooks/useStorage';
import { SessionProps } from '@/types/auth/auth';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';

export interface StoreSession {
  session?: SessionProps;
  token?: string;
  setToken: (token?: string) => void;
  setSession: (sessionStorage?: SessionProps) => void;
}

export const useStoreSession = create<StoreSession>()((set) => ({
  session: undefined,
  token: undefined,
  setToken: (token?: string) => set(() => ({ token })),
  setSession: (sessionStorage?: SessionProps) => set(() => ({ session: sessionStorage })),
}));

const isTokenExpired = (exp: number): boolean => {
  const now = Date.now();
  const expiresAt = exp * 1000;
  return now >= expiresAt;
};

export function validateToken(token?: string) {
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

export async function signIn(token?: string) {
  const setToken = useStoreSession.getState().setToken;
  const setSession = useStoreSession.getState().setSession;

  const decoded = validateToken(token);
  if (decoded) {
    await saveToken(token);
    setToken(token);
    setSession(decoded);
  }
}

export async function signOut() {
  const setToken = useStoreSession.getState().setToken;
  const setSession = useStoreSession.getState().setSession;

  await deleteToken();
  setToken(undefined);
  setSession(undefined);
}

export function getSession() {
  const session = useStoreSession.getState().session;
  const token = useStoreSession.getState().token;

  return { token, ...session };
}

export async function restoreSession() {
  const setToken = useStoreSession.getState().setToken;
  const setSession = useStoreSession.getState().setSession;

  const token = await getToken();
  if (!token) return;

  try {
    const decoded = validateToken(token);
    if (!decoded) {
      throw new Error('Invalid token on restore');
    } else {
      setToken(token);
      setSession(decoded);
    }
  } catch (e) {
    console.error(e);
    await deleteToken();
    setToken(undefined);
    setSession(undefined);
  }
}
