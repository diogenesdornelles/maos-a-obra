import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// import { getStoredSession } from '../../contexts/AuthContext/useStorage';

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
        // const session = await getStoredSession();
        const session = { token: 'teste' };

        if (session?.token) {
          config.headers.Authorization = `Bearer ${session.token}`;
        }

        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => Promise.reject(error)
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
