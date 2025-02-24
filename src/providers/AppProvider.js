import React from 'react';
import ThemeProvider from './ThemeProvider';
import ModalProvider from './ModalProvider';
import UserProvider from './UserProvider';
import { AuthProvider } from '../context/AuthContext';
import { SyncProvider } from '../context/SyncContext';

const AppProvider = ({ children }) => (
  <ThemeProvider>
    <ModalProvider>
      <AuthProvider>
        <SyncProvider>
          <UserProvider>{children}</UserProvider>
        </SyncProvider>
      </AuthProvider>
    </ModalProvider>
  </ThemeProvider>
);

export default AppProvider;
