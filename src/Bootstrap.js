import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button } from 'react-native';
import SplashScreen from './components/Splashs/SplashScreen';
import { createTables, isDatabaseInitialized } from './services/db-service';
import createStyles from './styles/MainAppStyles';

const Bootstrap = ({ onFinish }) => {
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
      <View style={createStyles().container}>
        <Text style={createStyles().errorTitle}>Erro ao inicializar o banco!</Text>
        <Text style={createStyles().errorText}>
          Não foi possível criar as tabelas do banco de dados.
        </Text>
        <Button title="Tentar Novamente" onPress={initializeDatabase} />
      </View>
    );
  }

  if (loading) {
    return <SplashScreen onFinish={onFinish} />;
  }

  return null;
};

export default Bootstrap;
