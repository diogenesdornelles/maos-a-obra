import { useStoreSession } from '@/contexts/authStore';
import { deleteToken, getToken } from '@/hooks/useStorage';
import { ErrorApi } from '@/types/errorParser';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { router } from 'expo-router';
import { Alert } from 'react-native';

export class ApiClient {
  private api: AxiosInstance;
  private baseURL: string;
  private isRefreshing = false;

  constructor() {
    this.baseURL = process.env.EXPO_PUBLIC_BASE_URL || '';

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      async (config) => {
        let token = useStoreSession.getState().token;

        if (!token) {
          token = (await getToken()) || undefined;
          if (token) {
            useStoreSession.getState().setToken(token);
          }
        }

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError<ErrorApi>) => {
        if (error.response?.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;

          try {
            await deleteToken();
            useStoreSession.getState().setToken(undefined);
            useStoreSession.getState().setSession(undefined);

            Alert.alert(
              'Sessão Expirada',
              'Sua sessão expirou ou você não tem permissão para acessar este recurso. Por favor, faça login novamente.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    router.dismissAll();
                    router.replace('/');
                  },
                  style: 'default',
                },
              ],
              { 
                cancelable: false
              }
            );
          } catch (logoutError) {
            console.error('Error during logout:', logoutError);
            router.dismissAll();
            router.replace('/');
          } finally {
            this.isRefreshing = false;
          }
        }

        if (error.response) {
          return Promise.reject({
            status: error.response.status,
            data: error.response.data as ErrorApi,
          });
        }

        if (error.request) {
          return Promise.reject({
            message: 'No response from server',
            request: error.request,
          });
        }

        return Promise.reject({ message: error.message });
      }
    );
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.api.get(url);
    return response.data;
  }

  async post<T>(url: string, data: any): Promise<T> {
    const response = await this.api.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data: any): Promise<T> {
    const response = await this.api.put(url, data);
    return response.data;
  }

  async patch<T>(url: string, data: any): Promise<T> {
    const response = await this.api.patch(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete(url);
    return response.data;
  }
}

export const restClient = new ApiClient();