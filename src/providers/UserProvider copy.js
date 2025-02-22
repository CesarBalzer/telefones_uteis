import React, { useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import StorageService from '../services/StorageService';

const initialState = {
  name: null,
  email: null,
  birthday: null,
  password: null,
  state_id: null,
  country_state_id: null,
  logged: false,
  welcome: false,
};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const userStorage = await StorageService.getJson('user');
      if (userStorage) {
        setUser(userStorage);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      StorageService.storeJson('user', user);
    }
  }, [user]);

  const login = async (userData) => {
    setUser(userData);
    await StorageService.storeJson('user', userData);
  };

  const logout = async () => {
    const newState = { ...initialState, logged: false };
    setUser(newState);
    await StorageService.storeJson('user', newState);
  };

  const getUser = async () => {
    const userStorage = await StorageService.getJson('user');
    if (userStorage) {
      setUser(userStorage);
    }
    return userStorage;
  };

  const saveUser = async (userData) => {
    setUser(userData);
    await StorageService.storeJson('user', userData);
  };

  const resetUser = async () => {
    setUser(initialState);
    await StorageService.storeJson('user', initialState);
  };

  if (loading) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{ user, setUser, saveUser, resetUser, getUser, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
