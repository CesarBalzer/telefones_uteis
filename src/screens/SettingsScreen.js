import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Switch,
  ScrollView,
  Appearance,
  TextInput,
  Text,
  Alert,
} from 'react-native';
import { parse, isValid, isAfter, subYears, format } from 'date-fns';
import { colors } from '../config/theme';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';
import { getStateById } from '../services/StateService';
import CustomButton from '../components/Buttons/CustomButton';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TextInputMask from 'react-native-text-input-mask';
import { useSync } from '../context/SyncContext';
import { getSync, syncDatabase } from '../services/SyncService';
import { version } from '../../package.json';
import Accordion from '../components/Accordions/AccordionListItem';
import api from '../../api';
import { updateContact } from '../services/ContactService';
import PasswordInput from '../components/Inputs/PasswordInput';
import { isValidDate } from '../utils/Helpers';

const SettingsScreen = () => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const { user, setUser, logout } = useContext(UserContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [usr, setUsr] = useState(user);
  const [state, setState] = useState();
  const [dob, setDob] = useState(
    user?.birthday ? format(new Date(user.birthday), 'dd/MM/yyyy') : ''
  );
  const [isDarkTheme, setIsDarkTheme] = useState(theme.mode === 'dark');
  const { syncStatus, setSyncStatus } = useSync();
  const [sync, setSync] = useState();
  const [loading, setLoading] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState(null);

  const toggleTheme = () => {
    updateTheme();
    setIsDarkTheme((prev) => !prev);
  };

  useEffect(() => {
    Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkTheme(colorScheme === 'dark');
    });
    loadSync();
  }, []);

  useEffect(() => {
    (async () => {
      setUser(usr);
      if (usr?.state_id) {
        const foundState = await getStateById(usr.state_id);
        setState(foundState);
      }
    })();
  }, [usr]);

  const loadSync = async () => {
    const response = await getSync();
    if (response && response.lastSync && response.previousSync) {
      setSync(response);
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      const response = await syncDatabase(setSyncStatus);
      console.log('RESPONSE => ', response.status);
      await loadSync();

      if (response.status === 429) {
        Alert.alert('Aviso', response.response.data.message);
      }
    } catch (error) {
      console.log('ERRO NA SINCRONIZAÇÃO:', error.response.data.message);

      // const errorMessage =
      //   error?.response?.data?.message || // Mensagem da API
      //   error?.message || // Mensagem de erro genérica do Axios
      //   'Erro desconhecido ao sincronizar.';

      // Alert.alert('Erro na Sincronização', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (text) => {
    setDob(text);

    if (text.length === 10) {
      if (isValidDate(text)) {
        const parsedDate = parse(text, 'dd/MM/yyyy', new Date());
        setUsr({ ...usr, birthday: parsedDate });
      } else {
        Alert.alert(
          'Erro',
          'Data de nascimento inválida! Verifique e tente novamente.'
        );
        setDob('');
      }
    }
  };

  const handleUpdate = async () => {
    // console.log('HANDLEUPDATE => ', usr);
    if (usr.password && usr.password !== passwordConfirmation) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    const updatedUser = {
      ...usr,
      password: usr.password || undefined,
      password_confirmation: passwordConfirmation,
    };

    try {
      setLoading(true);
      const response = await api.auth.update(updatedUser);
      console.log('RESPONSE => ', response);
      await updateContact(response.contact.id, response.contact);
      setUser({
        ...user,
        password: null,
        password_confirmation: null,
      });
      setUsr({
        ...usr,
        password: null,
        password_confirmation: null,
      });
      setPasswordConfirmation('');
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
    } catch (error) {
      console.log('ERROR => ', error);
      Alert.alert(
        'Erro',
        'Nao foi possível atualizar suas informações',
        error?.message
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmLogout = () => {
    Alert.alert('Tem certeza?', 'Você realmente deseja sair do aplicativo?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: logout },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Meu Perfil */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Icon name="account" size={24} color={activeColors.accent} />
          <Text style={styles.sectionTitle}>Meu Perfil</Text>
        </View>
        <Accordion title="Editar Perfil" opened={true}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={usr?.name}
            placeholder="Digite seu nome"
            onChangeText={(text) => setUsr({ ...usr, name: text })}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={usr?.email}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) =>
              setUsr({ ...usr, email: text.toLowerCase() })
            }
          />

          <Text style={styles.label}>Aniversário</Text>
          <TextInputMask
            style={styles.input}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={activeColors.placeholder}
            value={dob}
            onChangeText={handleDateChange}
            mask={'[00]/[00]/[0000]'}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Senha</Text>
          <PasswordInput
            placeholder="Digite a nova senha"
            value={usr?.password}
            onChangeText={(text) => setUsr({ ...usr, password: text })}
          />

          <Text style={styles.label}>Repita a senha</Text>
          <PasswordInput
            placeholder="Confirme a nova senha"
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
          />

          <CustomButton
            size="large"
            label="Atualizar Dados"
            type="info"
            onPress={handleUpdate}
            icon={
              <Icon name="account-check" size={20} color={activeColors.light} />
            }
            loading={loading}
          />
        </Accordion>
      </View>

      {/* Configuração de Tema */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Icon name="theme-light-dark" size={24} color={activeColors.accent} />
          <Text style={styles.sectionTitle}>Configuração de Tema</Text>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>
            Modo {isDarkTheme ? 'Escuro' : 'Claro'}
          </Text>
          <View style={{ transform: [{ scale: 1.7 }] }}>
            <Switch
              value={isDarkTheme}
              onValueChange={toggleTheme}
              thumbColor={activeColors.accent}
              trackColor={{
                false: activeColors.primary,
                true: activeColors.primary,
              }}
            />
          </View>
        </View>
      </View>

      {/* Sincronização */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Icon name="sync" size={24} color={activeColors.accent} />
          <Text style={styles.sectionTitle}>Sincronização</Text>
        </View>

        <View style={styles.syncContainer}>
          <Text style={styles.syncLabel}>Última sincronização</Text>
          <Text style={styles.syncInfo}>
            {sync?.lastSync
              ? format(new Date(sync.lastSync), "dd/MM/yyyy 'às' HH:mm")
              : 'Nunca sincronizado'}
          </Text>
        </View>

        <View style={styles.syncContainer}>
          <Text style={styles.syncLabel}>Sincronização anterior</Text>
          <Text style={styles.syncInfo}>
            {sync?.previousSync
              ? format(new Date(sync.previousSync), "dd/MM/yyyy 'às' HH:mm")
              : 'Nenhuma sincronização anterior'}
          </Text>
        </View>

        <CustomButton
          size="large"
          label={loading ? 'Sincronizando...' : 'Sincronizar agora'}
          type="info"
          onPress={handleSync}
          icon={<Icon name="sync" size={20} color={activeColors.light} />}
          loading={loading}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Icon
            name="information-outline"
            size={24}
            color={activeColors.accent}
          />
          <Text style={styles.sectionTitle}>Versão do app</Text>
        </View>

        <View style={styles.syncContainer}>
          <Text style={styles.syncInfo}>{version}</Text>
        </View>
      </View>

      {/* Logout */}
      <View style={styles.card}>
        <CustomButton
          size="large"
          label="Sair do App"
          type="danger"
          onPress={confirmLogout}
          icon={<Icon name="logout" size={20} color={activeColors.light} />}
        />
      </View>
    </ScrollView>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      backgroundColor: colors.primary,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingVertical: 20,
      backgroundColor: colors.primary,
    },
    card: {
      backgroundColor: colors.secondary,
      padding: 20,
      borderRadius: 12,
      marginBottom: 15,
      shadowColor: colors.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 5,
    },
    input: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      marginBottom: 15,
    },
    syncContainer: {
      backgroundColor: colors.secondary,
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
    },
    syncLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 5,
    },
    syncInfo: {
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 6,
      textAlign: 'center',
      fontWeight: '500',
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.secondary,
      padding: 15,
      borderRadius: 12,
    },
    buttonContainer: {
      marginTop: 15,
      alignSelf: 'center',
    },
  });

export default SettingsScreen;
