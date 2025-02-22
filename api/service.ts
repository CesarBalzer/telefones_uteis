import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { Auth } from './modules';
import { get, remove, store } from '../src/services/StorageService';

interface PromiseCallbacks {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export default class Service {
  client: AxiosInstance;
  auth!: Auth;

  private isRefreshing = false;
  private failedQueue: PromiseCallbacks[] = [];
  private unauthenticatedCallbacks: (() => void)[] = [];

  constructor(baseURL: string) {
    this.client = axios.create({ baseURL });
    this.configureInterceptors(this.client);
    this.initializeModules(this.client);
  }

  private async handleUnauthorized(): Promise<void> {
    console.log('🔴 Sessão Expirada');
    await remove('access_token');
    await remove('refresh_token');

    if (this.unauthenticatedCallbacks.length > 0) {
      this.unauthenticatedCallbacks.forEach((callback) => callback());
      this.unauthenticatedCallbacks = [];
    }
  }

  private async refreshToken(): Promise<string | null> {
    if (this.isRefreshing) {
      console.log('🔄 Já está tentando renovar o token. Aguardando...');
      return new Promise<string | null>((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      console.log('🔄 Tentando renovar o token...');
      const refreshToken = await get('refresh_token');

      if (!refreshToken) {
        console.log('⚠️ Nenhum refresh token encontrado. Deslogando usuário.');
        await this.handleUnauthorized();
        return null;
      }

      console.log('📂 Enviando refresh_token para API:', refreshToken);

      const response = await this.client.post<RefreshTokenResponse>(
        '/api/refresh',
        {
          refresh_token: refreshToken,
        }
      );

      console.log('📩 Resposta da API de refresh:', response.data);

      if (!response.data?.access_token) {
        console.log(
          '⚠️ A API não retornou um novo access_token. Deslogando usuário.'
        );
        await this.handleUnauthorized();
        return null;
      }

      await store('access_token', response.data.access_token);
      await store('refresh_token', response.data.refresh_token);

      console.log('✅ Token atualizado com sucesso!');

      this.failedQueue.forEach((prom) =>
        prom.resolve(response.data.access_token)
      );
      this.failedQueue = [];

      return response.data.access_token;
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as AxiosError;
        errorMessage = JSON.stringify(
          axiosError.response?.data || errorMessage
        );
      }

      console.error('❌ Erro ao renovar token:', errorMessage);

      this.failedQueue.forEach((prom) => prom.reject(error));
      this.failedQueue = [];

      console.log('🚪 Deslogando usuário...');
      await this.handleUnauthorized();
      return null;
    } finally {
      this.isRefreshing = false;
      console.log('🔄 Finalizou a tentativa de renovação do token.');
    }
  }

  private configureInterceptors(instance: AxiosInstance): void {
    instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await get('access_token');

        console.log(
          `🔐 Adicionando token à requisição: ${token ? 'SIM' : 'NÃO'}`
        );

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        console.error(
          '❌ Erro na requisição:',
          error.response?.status,
          error.response?.data
        );

        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log('⚠️ Tentando renovar token para refazer a requisição.');

          originalRequest._retry = true;

          const newToken = await this.refreshToken();
          if (newToken) {
            console.log('🔄 Reenviando requisição com novo token...');
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private initializeModules(client: AxiosInstance): void {
    this.auth = new Auth(client);
  }

  public onUnauthenticated(callback: () => void): void {
    this.unauthenticatedCallbacks.push(callback);
  }
}
