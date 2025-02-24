import React, { useContext, useState } from 'react';
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
} from 'react-native';
import { colors } from '../config/theme';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';
import CustomButton from '../components/Buttons/CustomButton';
import InputField from '../components/Inputs/InputField';
import VersionText from '../components/Texts/VersionText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../api';
import { format, parse } from 'date-fns';
import { generateRandomEmail } from '../utils/Helpers';

const RegisterScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const { setUser } = useContext(UserContext);
  const [usr, setUsr] = useState({
    name: 'Carlos Gutierre',
    email: generateRandomEmail(),
    password: 'Secret.321',
    password_confirmation: 'Secret.321',
    birthday: usr?.birthday
      ? format(new Date(usr.birthday), 'dd/MM/yyyy')
      : '10/02/1982',
  });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setValidationError('');

    if (
      !usr.name ||
      !usr.email ||
      !usr.password ||
      !usr.birthday ||
      usr.password !== usr.password_confirmation
    ) {
      setValidationError('Preencha todos os campos corretamente!');
      setLoading(false);
      return;
    }

    try {
      const response = await api.auth.verificationCode({ email: usr.email });
      setUser({
        pendingRegistration: usr,
      });

      navigation.navigate('EmailVerification', { email: usr.email });
    } catch (error) {
      setValidationError(
        'Erro ao enviar código de verificação. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (text) => {
    if (text.length === 10) {
      try {
        const parsedDate = parse(text, 'dd/MM/yyyy', new Date());
        setUsr({ ...usr, birthday: format(parsedDate, 'dd/MM/yyyy') });
      } catch (error) {
        Alert.alert(
          'Erro',
          'Data de nascimento inválida! Use o formato DD/MM/AAAA.'
        );
        setUsr({ ...usr, birthday: '' });
      }
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
                  ? require('../assets/images/login_dark.png')
                  : require('../assets/images/login_light.png')
              }
              style={styles.image}
            />
          </View>

          <View style={styles.container}>
            <View style={styles.section}>
              <Text style={styles.title}>Registrar</Text>
            </View>

            <View style={styles.section}>
              <InputField
                label="Nome Completo"
                value={usr.name}
                onChange={(text) => setUsr({ ...usr, name: text })}
                icon={
                  <Icon
                    name="account"
                    size={20}
                    color={activeColors.accent}
                    style={{ marginRight: 5 }}
                  />
                }
                error={validationError && !usr.name}
              />
            </View>

            <View style={styles.section}>
              <InputField
                label="E-mail"
                value={usr.email}
                onChange={(text) => setUsr({ ...usr, email: text })}
                inputType="email"
                keyboardType="email-address"
                icon={
                  <Icon
                    name="email"
                    size={20}
                    color={activeColors.accent}
                    style={{ marginRight: 5 }}
                  />
                }
                error={validationError && !usr.email}
              />
            </View>

            <View style={styles.section}>
              <InputField
                label="Senha"
                value={usr.password}
                onChange={(text) => setUsr({ ...usr, password: text })}
                inputType="password"
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

            <View style={styles.section}>
              <InputField
                label="Confirmar Senha"
                value={usr.password_confirmation}
                onChange={(text) =>
                  setUsr({ ...usr, password_confirmation: text })
                }
                inputType="password"
                icon={
                  <Icon
                    name="lock-outline"
                    size={20}
                    color={activeColors.accent}
                    style={{ marginRight: 5 }}
                  />
                }
                error={
                  validationError && usr.password !== usr.password_confirmation
                }
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Data de Nascimento</Text>
              <InputField
                value={usr.birthday}
                onChange={handleDateChange}
                inputType="numeric"
                placeholder="DD/MM/AAAA"
                icon={
                  <Icon
                    name="calendar"
                    size={20}
                    color={activeColors.accent}
                    style={{ marginRight: 5 }}
                  />
                }
              />
              {validationError && !usr.birthday ? (
                <Text style={styles.errorText}>Campo obrigatório</Text>
              ) : null}
            </View>

            {validationError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{validationError}</Text>
              </View>
            ) : null}

            <View style={styles.section}>
              <CustomButton
                size="large"
                label="Continuar"
                type="info"
                onPress={handleSubmit}
                disabled={loading}
                loading={loading}
                icon={
                  <Icon
                    name="account-plus"
                    size={20}
                    color={activeColors.light}
                    style={{ marginRight: 5 }}
                  />
                }
              />
            </View>
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
              Ou registre-se com ...
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
              onPress={() =>
                Alert.alert(
                  'Em construção...',
                  'Essa funcionalidade estará disponível em breve!'
                )
              }
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
              onPress={() =>
                Alert.alert(
                  'Em construção...',
                  'Essa funcionalidade estará disponível em breve!'
                )
              }
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
              marginVertical: 30,
            }}
          >
            <Text style={{ color: activeColors.tint, fontSize: 18 }}>
              Já tem conta?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text
                style={{
                  color: activeColors.accent,
                  fontWeight: 'bold',
                  fontSize: 18,
                }}
              >
                {' '}
                Ir para o login
              </Text>
            </TouchableOpacity>
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
  containerImage: { justifyContent: 'center', alignItems: 'center' },
  image: {
    marginTop: 80,
    height: 50,
    width: 50,
    transform: [{ rotate: '-5deg' }],
  },
  container: { paddingHorizontal: 20 },
  section: { paddingVertical: 10 },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: colors.tint,
    textAlign: 'center',
  },
  errorContainer: { alignItems: 'center', marginBottom: 10 },
  errorText: { color: colors.danger, fontSize: 14 },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.accent,
    marginVertical: 10,
  },
});

export default RegisterScreen;
