import { getSession } from '@/contexts/authStore';
import { ErrorApi } from '@/types/errorParser';

import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

export class ApiClient {
  private api: AxiosInstance;
  private baseURL: string;

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
        const session = await getSession();

        if (session?.token) {
          config.headers.Authorization = `Bearer ${session.token}`;
        }

        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<ErrorApi>) => {
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

  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete(url);
    return response.data;
  }
}

export const restClient = new ApiClient();
