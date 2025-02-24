import React, { useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { getJson, remove, storeJson } from '../services/StorageService';
import api from '../../api';

const initialState = {
  id: null,
  name: null,
  email: null,
  is_admin: null,
  email_verified_at: null,
  created_at: null,
  updated_at: null,
  birthday: null,
  password: null,
  password_confirmation: null,
  state_id: null,
  country_state_id: null,
  logged: false,
  welcome: false,
  pendingRegistration:null
};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const updateUser = async (newUserData) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, ...newUserData };
      storeJson('user', updatedUser);
      return updatedUser;
    });
  };

  const refreshToken = async () => {
    if (isRefreshing) {
      console.log(
        '🔄 Já está tentando renovar o token. Ignorando nova tentativa.'
      );
      return;
    }

    setIsRefreshing(true);

    try {
      console.log('🔄 Tentando renovar o token...');

      const refresh_token = await getJson('refresh_token');
      // console.log('📂 Refresh Token encontrado:', refresh_token);

      if (!refresh_token) {
        // console.log('⚠️ Nenhum refresh_token encontrado, deslogando usuário.');
        return logout();
      }

      // Adicionamos um timeout de 10 segundos para evitar travamento
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await api.auth.refresh({
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // console.log('📩 Resposta da API para refresh:', response);

      if (response?.access_token) {
        await storeJson('access_token', response.access_token);
        // console.log('✅ Token renovado com sucesso!');
      } else {
        // console.log('⚠️ Nenhum novo access_token retornado pela API.');
      }

      if (response?.refresh_token) {
        await storeJson('refresh_token', response.refresh_token);
      } else {
        await remove('refresh_token');
        console.log('🚫 Refresh Token removido.');
      }

      return response?.access_token || null;
    } catch (error) {
      console.log('❌ Erro ao renovar token:', error);
      if (error.name === 'AbortError') {
        console.log('⏳ Timeout: A requisição de refresh foi abortada.');
      }
      logout();
    } finally {
      setIsRefreshing(false);
      // console.log('🔄 Finalizou tentativa de renovação do token.');
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const storedUser = await getJson('user');

        if (storedUser) {
          // console.log('📂 Dados do usuário carregados:', storedUser);
          setUser({ ...storedUser, logged: true });

          const token = await getJson('access_token');
          if (!token) {
            await refreshToken();
          }
        } else {
          console.log('⚠️ Nenhum usuário salvo encontrado.');
        }
      } catch (error) {
        console.log('❌ Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Verifica periodicamente se o token está expirando e renova automaticamente
  useEffect(() => {
    const interval = setInterval(
      async () => {
        await refreshToken();
      },
      14 * 60 * 1000
    ); // Tenta renovar 1 minuto antes do token expirar (caso dure 15 min)

    return () => clearInterval(interval);
  }, []);

  const logout = async () => {
    console.log('🚪 Deslogando usuário...');
    await remove('access_token');
    await remove('refresh_token');
    updateUser({ logged: false });
  };

  if (loading) return null;

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
