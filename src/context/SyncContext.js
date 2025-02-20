import { createContext, useState, useContext } from 'react';

const SyncContext = createContext();

export const SyncProvider = ({ children }) => {
  const [syncStatus, setSyncStatus] = useState({
    isSyncing: false,
    isSuccess: false,
    isError: false,
  });

  return (
    <SyncContext.Provider value={{ syncStatus, setSyncStatus }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => useContext(SyncContext);
