import { SessionProps } from '@/types/auth/auth';
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
