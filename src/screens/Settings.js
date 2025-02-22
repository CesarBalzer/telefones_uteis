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
import { getStateById } from '../db/StateService';
import CustomButton from '../components/Buttons/CustomButton';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TextInputMask from 'react-native-text-input-mask';
import { useSync } from '../context/SyncContext';
import { syncDatabase } from '../services/SyncService';

const isValidDate = (dateString) => {
  if (!dateString || dateString.length !== 10) return false;

  const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());

  if (!isValid(parsedDate)) return false;
  if (isAfter(parsedDate, new Date())) return false;
  if (isAfter(parsedDate, subYears(new Date(), 10))) return false;

  return true;
};

const SettingsScreen = () => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const { user, setUser, logout } = useContext(UserContext);
  const [usr, setUsr] = useState(user);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [state, setState] = useState();
  const [dob, setDob] = useState(
    user?.birthday ? format(new Date(user.birthday), 'dd/MM/yyyy') : ''
  );
  const navigation = useNavigation();
  const [isDarkTheme, setIsDarkTheme] = useState(theme.mode === 'dark');
  const { syncStatus, setSyncStatus } = useSync();

  const toggleTheme = () => {
    updateTheme();
    setIsDarkTheme((prev) => !prev);
  };

  useEffect(() => {
    Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkTheme(colorScheme === 'dark');
    });
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

  const handleState = () => {
    navigation.navigate('States');
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

  const handleSync = async () => {
    try {
      console.log('🔄 Iniciando sincronização...');
      const sync = await syncDatabase(setSyncStatus);
      console.log('✅ Sincronização concluída com sucesso!');
    } catch (syncError) {
      console.log('❌ Erro na sincronização:', syncError);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={[{ backgroundColor: activeColors.primary }, styles.container]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>Meu Perfil</Text>

      <View style={styles.section}>
        <Text style={styles.label}>
          <Icon name="account" size={20} color={activeColors.accent} />
          Nome
        </Text>
        <TextInput
          style={styles.input}
          value={usr?.name}
          placeholder="Digite seu nome"
          onChangeText={(text) => setUsr({ ...usr, name: text })}
        />

        <Text style={styles.label}>
          {' '}
          <Icon name="email-outline" size={20} color={activeColors.accent} />
          Email
        </Text>
        <TextInput
          style={styles.input}
          value={usr?.email}
          placeholder="seu@email.com"
          onChangeText={(text) => setUsr({ ...usr, email: text.toLowerCase() })}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="off"
        />

        <Text style={styles.label}>
          <Icon
            name="cake-variant-outline"
            size={20}
            color={activeColors.accent}
          />
          Aniversário
        </Text>
        <TextInputMask
          style={styles.input}
          placeholder="DD/MM/AAAA"
          value={dob}
          onChangeText={handleDateChange}
          mask={'[00]/[00]/[0000]'}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.sectionTitle}>
        <Icon name="theme-light-dark" size={20} color={activeColors.accent} />
        Configuração de Tema
      </Text>

      <View style={styles.sectionRow}>
        <Text style={styles.label}>
          Modo {isDarkTheme ? 'Escuro' : 'Claro'}
        </Text>
        <Switch
          value={isDarkTheme}
          onValueChange={toggleTheme}
          thumbColor={
            isDarkTheme ? activeColors.primary : activeColors.tertiary
          }
          trackColor={{
            false: activeColors.primary,
            true: activeColors.accent,
          }}
        />
      </View>

      <Text style={styles.sectionTitle}>
        <Icon name="map-marker-outline" size={20} color={activeColors.accent} />{' '}
        Localização
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>Estado</Text>
        <Text style={styles.input}>{state?.name || 'Não selecionado'}</Text>

        <View style={styles.buttonContainer}>
          <CustomButton
            size="large"
            label="Mudar meu estado"
            onPress={handleState}
            icon={
              <Icon
                name="home-map-marker"
                size={20}
                color={activeColors.light}
              />
            }
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        <Icon name="map-marker-outline" size={20} color={activeColors.accent} />{' '}
        Sincronização
      </Text>

      <View style={styles.section}>
        <View style={styles.buttonContainer}>
          <CustomButton
            size="large"
            label="Sincronizar agora"
            type="info"
            onPress={handleSync}
            icon={<Icon name="sync" size={20} color={activeColors.light} />}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.buttonContainer}>
          <CustomButton
            size="large"
            label="Sair do app"
            type="success"
            onPress={logout}
            icon={<Icon name="logout" size={20} color={activeColors.light} />}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingBottom: 30,
    },
    section: {
      backgroundColor: `${colors.accent}15`,
      padding: 15,
      borderRadius: 12,
      marginVertical: 10,
    },
    sectionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: `${colors.accent}15`,
      padding: 15,
      borderRadius: 12,
      marginVertical: 10,
    },
    sectionTitle: {
      color: colors.accent,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 5,
    },
    input: {
      backgroundColor: `${colors.tertiary}10`,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      borderWidth: 1,
      borderColor: `${colors.tertiary}30`,
      color: colors.text,
      marginBottom: 15,
    },
    buttonContainer: {
      marginTop: 10,
      alignSelf: 'center',
    },
  });

export default SettingsScreen;
