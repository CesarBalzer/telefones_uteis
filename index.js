import React, { useState, useEffect, useCallback } from 'react';
import { AppRegistry, View, Text, Button, StyleSheet } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';
import SplashScreen from './src/components/Splashs/SplashScreen';
import ThemeProvider from './src/providers/ThemeProvider';
import ModalProvider from './src/providers/ModalProvider';
import UserProvider from './src/providers/UserProvider';
import { AuthProvider } from './src/context/AuthContext';
import { SyncProvider } from './src/context/SyncContext';
import { createTables, isDatabaseInitialized } from './src/services/db-service';
import { colors } from './src/config/theme';

const MainApp = () => {
  const activeColors = colors['light'];
  const styles = createStyles(activeColors);

  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  const initializeDatabase = useCallback(async () => {
    try {
      const databaseInitialized = await isDatabaseInitialized();
      setDbError(false);
      if (!databaseInitialized) {
        await createTables();
      }
    } catch (error) {
      console.log('❌ Erro ao criar tabelas:', error);
      setDbError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeDatabase();
  }, [initializeDatabase]);

  if (dbError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Erro ao inicializar o app!</Text>
        <Text style={styles.errorText}>
          Não foi possível inicializar o app devido a um erro inesperado no
          banco local.
        </Text>
        <Button title="Tentar Novamente" onPress={initializeDatabase} />
      </View>
    );
  }

  if (showSplash || loading) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <ThemeProvider>
      <ModalProvider>
        <AuthProvider>
          <SyncProvider>
            <UserProvider>
              <App />
            </UserProvider>
          </SyncProvider>
        </AuthProvider>
      </ModalProvider>
    </ThemeProvider>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary,
    },
    errorTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 10,
    },
    errorText: {
      marginBottom: 20,
      color: colors.danger,
    },
  });

AppRegistry.registerComponent(appName, () => MainApp);
