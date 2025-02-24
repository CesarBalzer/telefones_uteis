import React, { useContext, useState } from 'react';
import { colors } from '../config/theme';
import { ThemeContext } from '../context/ThemeContext';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../components/Buttons/CustomButton';
import InputField from '../components/Inputs/InputField';
import VersionText from '../components/Texts/VersionText';
import { UserContext } from '../context/UserContext';
import { syncDatabase } from '../services/SyncService';
import api from '../../api';
import { storeJson } from '../services/StorageService';
import { useSync } from '../context/SyncContext';

const LoginScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const { user, setUser } = useContext(UserContext);
  const [usr, setUsr] = useState({
    email: 'carlos_hbz9m877@teste.com',
    password: 'Secret.123',
  });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { setSyncStatus } = useSync();

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setValidationError('');

    if (!usr.email || !usr.password) {
      setValidationError('Preencha os campos corretamente!');
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      console.log('⏳ Tempo limite atingido! Abortando requisição...');
      controller.abort();
      setValidationError('Tempo limite atingido. Tente novamente.');
      setLoading(false);
    }, 15000);

    try {
      // console.log('🔑 Autenticando usuário...');
      const response = await api.auth.login(usr.email, usr.password, {
        signal: controller.signal,
      });
      // console.log('RESPONSE => ', response);
      // console.log('✅ Usuário autenticado:');
      if (response.access_token) {
        await storeJson('access_token', response.access_token);
      }
      if (response.refresh_token) {
        await storeJson('refresh_token', response.refresh_token);
      }

      // console.log('✅ Usuário autenticado e tokens armazenados!');

      setUser({
        ...user,
        logged: true,
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        email_verified_at: response.user.email_verified_at,
        created_at: response.user.created_at,
        updated_at: response.user.updated_at,
      });

      clearTimeout(timeout);

      let syncSuccess = false;
      const syncTimeout = setTimeout(() => {
        // console.log('⏳ Sincronização demorando muito! Abortando...');
        syncSuccess = true;
        setValidationError('Sincronização falhou. Tente novamente.');
        setLoading(false);
      }, 20000); // Timeout de 20 segundos para sincronização

      while (!syncSuccess) {
        try {
          // console.log('🔄 Iniciando sincronização...');
          await syncDatabase(setSyncStatus);
          // console.log('✅ Sincronização concluída com sucesso!');
          syncSuccess = true;
          clearTimeout(syncTimeout);
        } catch (syncError) {
          console.log('❌ Erro na sincronização:', syncError);
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    } catch (error) {
      console.log('❌ Erro ao fazer login:', error);
      if (error.name === 'AbortError') {
        setValidationError('A conexão demorou muito e foi cancelada.');
      } else {
        setValidationError('Erro ao autenticar. Verifique suas credenciais.');
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.containerImage}>
            <Image
              source={
                theme == 'dark'
                  ? require('../assets/images/login_dark.png')
                  : require('../assets/images/login_light.png')
              }
              style={styles.image}
            />
          </View>

          <View style={styles.container}>
            <View style={styles.section}>
              <Text style={styles.title}>Login</Text>
            </View>
            <View style={styles.section}>
              <InputField
                label={'E-mail'}
                value={usr?.email}
                onChange={(text) => setUsr({ ...usr, email: text })}
                inputType="email"
                icon={
                  <Icon
                    name="email"
                    size={20}
                    color={activeColors.accent}
                    style={{ marginRight: 5 }}
                  />
                }
                keyboardType="email-address"
                error={validationError && !usr.email}
              />
            </View>
            <View style={styles.section}>
              <InputField
                label={'Senha'}
                value={usr?.password}
                onChange={(text) => setUsr({ ...usr, password: text })}
                inputType="password"
                fieldButtonLabel={'Esqueceu a senha?'}
                fieldButtonFunction={() => {}}
                icon={
                  <Icon
                    name="lock-outline"
                    size={20}
                    color={activeColors.accent}
                    style={{ marginRight: 5 }}
                  />
                }
                error={validationError && !usr.password}
              />
            </View>
            {validationError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{validationError}</Text>
              </View>
            ) : null}
            <View style={styles.section}>
              <CustomButton
                size="large"
                label={'Login'}
                type="info"
                onPress={handleSubmit}
                disabled={loading}
                loading={loading}
                icon={
                  <Icon
                    name="login"
                    size={20}
                    color={activeColors.light}
                    style={{ marginRight: 5 }}
                  />
                }
              />
            </View>

            <View style={styles.section}>
              <Text
                style={{
                  textAlign: 'center',
                  color: activeColors.tint,
                  marginBottom: 20,
                  fontSize: 16,
                }}
              >
                Ou, faça login com ...
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginBottom: 30,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Em contrução...',
                    'Ainda estamos desenvolvendo essa funcionalidade, em breve estará disponível, aguardem!'
                  );
                }}
                style={{
                  backgroundColor: activeColors.secondary,
                  borderRadius: 10,
                  paddingHorizontal: 30,
                  paddingVertical: 10,
                }}
              >
                <Icon name="google" size={24} color={activeColors.danger} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Em contrução...',
                    'Ainda estamos desenvolvendo essa funcionalidade, em breve estará disponível, aguardem!'
                  );
                }}
                style={{
                  backgroundColor: activeColors.secondary,
                  borderRadius: 10,
                  paddingHorizontal: 30,
                  paddingVertical: 10,
                }}
              >
                <Icon name="facebook" size={24} color={activeColors.info} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 30,
              }}
            >
              <Text style={{ color: activeColors.tint, fontSize: 18 }}>
                Ainda não tem conta?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text
                  style={{
                    color: activeColors.accent,
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}
                >
                  {' '}
                  Registre-se
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <VersionText />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (colors) => {
  const styles = StyleSheet.create({
    safeContainer: {
      backgroundColor: colors.primary,
      flex: 1,
      justifyContent: 'space-between',
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingBottom: 40,
    },
    containerImage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      marginTop: 50,
      height: 100,
      width: 150,
      transform: [{ rotate: '15deg' }],
    },
    container: { paddingHorizontal: 20, flex: 2 },
    section: {
      paddingVertical: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: '500',
      color: colors.tint,
      textAlign: 'center',
    },
    errorContainer: {
      alignItems: 'center',
      marginBottom: 10,
    },
    errorText: {
      color: colors.danger,
      fontSize: 14,
    },
  });
  return styles;
};

export default LoginScreen;
