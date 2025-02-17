import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
  Text,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../config/theme';
import { ThemeContext } from '../context/ThemeContext';
import HeaderRightButton from './contacts/HeaderRightButton';
import ContactsList from './contacts/ContactsList';
import ImportContactsOptions from './contacts/ImportContactsOptions';
import useContacts from '../hooks/useContacts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ContactsScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);

  const [hasPermission, setHasPermission] = useState(null);

  const {
    contacts,
    paginatedContacts,
    fetchContacts,
    importContacts,
    showOptions,
    setShowOptions,
  } = useContacts();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        hasPermission ? <HeaderRightButton onPress={importContacts} /> : null,
    });

    const checkPermissionAndFetchContacts = async () => {
      const permissionGranted = await requestContactsPermission();
      setHasPermission(permissionGranted);

      if (permissionGranted) {
        await fetchContacts();
      }
    };

    const unsubscribe = navigation.addListener(
      'focus',
      checkPermissionAndFetchContacts
    );

    return unsubscribe;
  }, [navigation, importContacts, fetchContacts, hasPermission]);

  const requestContactsPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        );
        if (!granted) {
          const response = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              title: 'Permissão Necessária',
              message:
                'Precisamos acessar seus contatos para exibir sua lista e importar informações. Por favor, conceda a permissão.',
              buttonPositive: 'Permitir',
            }
          );

          if (response !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Permissão Negada',
              'Para usar todos os recursos do aplicativo, é necessário permitir o acesso aos contatos. Deseja abrir as configurações para conceder a permissão?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Abrir Configurações', onPress: openAppSettings },
              ]
            );
            return false;
          }
        }
        return true;
      } catch (error) {
        console.error('Erro ao verificar permissão:', error);
        return false;
      }
    }
    return true;
  };

  const openAppSettings = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir as configurações.');
    });
  };

  return (
    <View style={styles.container}>
      {hasPermission === false ? (
        <View style={styles.permissionContainer}>
          <Icon
            size={120}
            name="account-off-outline"
            color={activeColors.warning}
          />
          <Text style={styles.permissionTitle}>Permissão Necessária</Text>
          <Text style={styles.permissionText}>
            Para acessar seus contatos, vá até as configurações do dispositivo e
            conceda a permissão.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={openAppSettings}
          >
            <Text style={styles.permissionButtonText}>Abrir Configurações</Text>
          </TouchableOpacity>
        </View>
      ) : hasPermission && contacts.length === 0 ? (
        <View style={styles.noContactsContainer}>
          <Text style={styles.noContactsText}>
            Nenhum contato encontrado. Importe seus contatos para o aplicativo.
          </Text>
          <TouchableOpacity
            style={styles.importButton}
            onPress={() => importContacts(true)}
          >
            <Text style={styles.importButtonText}>Importar Contatos</Text>
          </TouchableOpacity>
        </View>
      ) : hasPermission && contacts.length > 0 ? (
        showOptions ? (
          <ImportContactsOptions
            setShowOptions={setShowOptions}
            fetchContacts={fetchContacts}
            importContacts={importContacts}
          />
        ) : (
          <ContactsList contacts={paginatedContacts || []} />
        )
      ) : null}
    </View>
  );
};

const createStyles = (colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  permissionContainer: {
    alignItems: 'center',
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: 15,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 15,
  },
  permissionButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  noContactsContainer: {
    alignItems: 'center',
  },
  noContactsText: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  importButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  importButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ContactsScreen;
