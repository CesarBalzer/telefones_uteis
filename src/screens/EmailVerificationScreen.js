import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { colors } from '../config/theme';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';
import { useSync } from '../context/SyncContext';
import CustomButton from '../components/Buttons/CustomButton';
import VersionText from '../components/Texts/VersionText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../api';
import { syncDatabase, syncUserData } from '../services/SyncService';
import { storeJson } from '../services/StorageService';

const EmailVerificationScreen = ({ navigation, route }) => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const { user, setUser } = useContext(UserContext);
  const { setSyncStatus } = useSync();

  const email = user.pendingRegistration?.email || route.params?.email;
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleVerifyCode = async () => {
    if (loading) return;
    setLoading(true);
    setValidationError('');

    const fullCode = code.join('');

    if (fullCode.length !== 6) {
      setValidationError('Digite os 6 números do código enviado!');
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
      console.log('🔑 Registrando usuário...');
      const response = await api.auth.register({
        ...user.pendingRegistration,
        code: fullCode,
      });

      if (response.access_token) {
        await storeJson('access_token', response.access_token);
      }
      if (response.refresh_token) {
        await storeJson('refresh_token', response.refresh_token);
      }

      setUser({
        ...user,
        logged: true,
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        email_verified_at: response.user.email_verified_at,
        created_at: response.user.created_at,
        updated_at: response.user.updated_at,
        pendingRegistration: null,
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

    // try {
    //   const registerResponse = await api.auth.register({
    //     ...user.pendingRegistration,
    //     code: fullCode,
    //   });

    //   if (registerResponse.access_token) {
    //     await syncUserData(registerResponse.user, setUser, setSyncStatus);
    //   }

    //   // navigation.replace('Home');
    // } catch (error) {
    //   setValidationError('Erro ao concluir o cadastro. Tente novamente.');
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleResendCode = async () => {
    try {
      const response = await api.auth.verificationCode({ email });
      if (response.success) {
        Alert.alert(
          'Código Reenviado',
          'Um novo código foi enviado para o seu e-mail.'
        );
      } else {
        Alert.alert(
          'Erro',
          'Não foi possível reenviar o código. Tente novamente.'
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao solicitar um novo código.');
    }
  };

  const handleInputChange = (text, index) => {
    if (!/^[0-9]?$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index) => {
    if (index > 0 && code[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.containerImage}>
            <Image
              source={
                theme === 'dark'
                  ? require('../assets/images/apple.png')
                  : require('../assets/images/apple.png')
              }
              style={styles.image}
            />
          </View>

          <View style={styles.container}>
            <View style={styles.section}>
              <Text style={styles.title}>Verificação de E-mail</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.description}>
                Digite os <Text style={styles.bold}>6 números</Text> do código
                enviado para:
                <Text style={styles.emailText}> {email}</Text>
              </Text>
            </View>

            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={styles.codeInput}
                  value={digit}
                  onChangeText={(text) => handleInputChange(text, index)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace') handleBackspace(index);
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                />
              ))}
            </View>

            {validationError ? (
              <Text style={styles.errorText}>{validationError}</Text>
            ) : null}

            <View style={styles.section}>
              <CustomButton
                size="large"
                label="Confirmar Código"
                type="primary"
                onPress={handleVerifyCode}
                disabled={loading}
                loading={loading}
                icon={
                  <Icon
                    name="check-circle-outline"
                    size={20}
                    color={activeColors.light}
                    style={{ marginRight: 5 }}
                  />
                }
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.hintText}>Não recebeu o código?</Text>
              <TouchableOpacity onPress={handleResendCode}>
                <Text style={styles.resendText}>Reenviar Código</Text>
              </TouchableOpacity>
            </View>
          </View>

          <VersionText />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (colors) => ({
  safeContainer: { backgroundColor: colors.primary, flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingBottom: 40 },
  containerImage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: {
    marginTop: 10,
    height: 150,
    width: 190,
    transform: [{ rotate: '-5deg' }],
  },
  container: { paddingHorizontal: 20, flex: 1 },
  section: { paddingVertical: 10 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.tint,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: colors.tint,
    textAlign: 'center',
    marginBottom: 15,
  },
  emailText: { fontWeight: 'bold', color: colors.accent },
  bold: { fontWeight: 'bold' },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 10,
    fontSize: 24,
    color: colors.text,
    marginHorizontal: 5,
  },
  hintText: {
    textAlign: 'center',
    color: colors.tint,
    marginVertical: 20,
    fontSize: 16,
  },
  resendText: {
    color: colors.accent,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EmailVerificationScreen;
