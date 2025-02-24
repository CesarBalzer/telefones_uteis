import StorageService from './StorageService';


const AuthService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { access_token, refresh_token, user } = response.data;

      // Salvar tokens e usuário no AsyncStorage
      await StorageService.storeJson('user', user);
      await StorageService.storeJson('access_token', access_token);
      await StorageService.storeJson('refresh_token', refresh_token);

      return user;
    } catch (error) {
      console.log('Erro ao fazer login:', error.response?.data || error);
      throw error;
    }
  },

  logout: async () => {
    await StorageService.remove('user');
    await StorageService.remove('access_token');
    await StorageService.remove('refresh_token');
  },

  refreshAccessToken: async () => {
    try {
      const refresh_token = await StorageService.getJson('refresh_token');
      if (!refresh_token) throw new Error('Nenhum refresh token disponível');

      const response = await api.post('/auth/refresh', { refresh_token });
      const { access_token } = response.data;

      await StorageService.storeJson('access_token', access_token);
      return access_token;
    } catch (error) {
      console.log('Erro ao renovar token:', error.response?.data || error);
      throw error;
    }
  }
};

export default AuthService;
