import React, { useState, useEffect } from 'react';
import { AppRegistry, LogBox, View, Text, Button } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';
import SplashScreen from './src/components/Splashs/SplashScreen';
import ThemeProvider from './src/providers/ThemeProvider';
import ModalProvider from './src/providers/ModalProvider';
import UserProvider from './src/providers/UserProvider';
import { createTables, isDatabaseInitialized } from './src/db/db-service';
import { AuthProvider } from './src/context/AuthContext';
import { SyncProvider } from './src/context/SyncContext';

const MainApp = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  LogBox.ignoreLogs([
    'Warning: componentWillMount',
    '`new NativeEventEmitter()`',
    'EventEmitter.removeListener',
    'ViewPropTypes will be removed from React Native',
    'Sending `onAnimatedValueUpdate`',
  ]);

  const initializeDatabase = async () => {
    try {
      const databaseInitialized = await isDatabaseInitialized();
      setDbError(false);
      if (!databaseInitialized) {
        console.log('🔄 Criando tabelas do banco de dados...');
        await createTables();
        console.log('✅ Tabelas criadas com sucesso!');
      }
    } catch (error) {
      console.error('❌ Erro ao criar tabelas:', error);
      setDbError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeDatabase();
  }, []);

  if (dbError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Erro ao inicializar o banco!
        </Text>
        <Text style={{ marginBottom: 20 }}>
          Não foi possível criar as tabelas do banco de dados.
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

AppRegistry.registerComponent(appName, () => MainApp);
