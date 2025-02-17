import React, { useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import StorageService from '../services/StorageService';

const UserProvider = ({ children }) => {
  const initiaState = {
    name: null,
    email: null,
    birthday: null,
    password: null,
    state_id: null,
    logged: false,
    welcome: false,
  };
  const [user, setUser] = useState();

  useEffect(() => {
    (async () => {
      const userStorage = await StorageService.getJson('user');
      if (userStorage) {
        setUser(userStorage);
      } else {
        setUser(initiaState);
      }
    })();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    await StorageService.storeJson('user', userData);
  };

  const logout = async () => {
    const newState = { ...user, logged: false, password: null, state_id: null };
    setUser(newState);
    await StorageService.storeJson('user', newState);
  };

  const getUser = async () => {
    const userStorage = await StorageService.getJson('user');
    // console.log('USER STORAGE => ', userStorage);
    if (userStorage) {
      setUser(userStorage);
    }
    return userStorage;
  };

  const saveUser = async (userData) => {
    setUser(userData);
    await StorageService.storeJson('user', userData);
    setUser(userData);
  };

  const resetUser = async (userData) => {
    setUser(initiaState);
    await StorageService.storeJson('user', initiaState);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, saveUser, resetUser, getUser, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
