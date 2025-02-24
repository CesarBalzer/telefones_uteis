import React, { useContext, useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import Contacts from 'react-native-contacts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ContactCard from '../components/Cards/ContactCard';
import { colors } from '../config/theme';
import { ThemeContext } from '../context/ThemeContext';
import InputSearch from '../components/Search/InputSearch';
import SkelletonInputSearch from '../skeletons/SkelletonInputSearch';
import SkelletonPhoneItem from '../skeletons/SkelletonPhoneItem';
import { useNavigation } from '@react-navigation/native';
import { cleanName, clearString } from '../utils/Helpers';
import HeaderRightButton from './contacts/HeaderRightButton';
import useContacts from '../hooks/useContacts';

const ContactsScreen = ({ route, navigation }) => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const previousContactsHash = useRef('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigator = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const { importContacts } = useContacts();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        hasPermission ? <HeaderRightButton onPress={addNewContact} /> : null,
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
  }, [navigation, fetchContacts, hasPermission]);

  const requestContactsPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const readGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        );

        const writeGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS
        );

        if (!readGranted || !writeGranted) {
          const response = await PermissionsAndroid.requestMultiple(
            [
              PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
              PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
            ],
            {
              title: 'Permissões Necessárias',
              message:
                'Precisamos de acesso para ler e escrever seus contatos.',
              buttonPositive: 'Permitir',
            }
          );

          if (
            response[PermissionsAndroid.PERMISSIONS.READ_CONTACTS] !==
              PermissionsAndroid.RESULTS.GRANTED ||
            response[PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS] !==
              PermissionsAndroid.RESULTS.GRANTED
          ) {
            Alert.alert(
              'Permissões negadas!',
              'Para usar todos os recursos do app, é necessário permitir o acesso completo aos contatos. Deseja abrir as configurações para conceder as permissões?',
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
        console.log('Erro ao verificar permissões:', error);
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

  const hashContacts = (contactsArray) =>
    contactsArray
      .map((contact) => `${contact.recordID}-${contact.value}`)
      .join('|');

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const allContacts = await Contacts.getAll();
      const formattedContacts = allContacts.map((item) => ({
        ...item,
        value: clearString(`${item.givenName || ''} ${item.familyName || ''}`),
        key: item.recordID.toString(),
      }));

      const currentHash = hashContacts(formattedContacts);
      if (currentHash !== previousContactsHash.current) {
        setContacts(formattedContacts);
        previousContactsHash.current = currentHash;
      }
    } catch (error) {
      console.log('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedAndGroupedContacts = useMemo(() => {
    const sorted = contacts.sort((a, b) =>
      cleanName(`${a.givenName} ${a.familyName}`).localeCompare(
        cleanName(`${b.givenName} ${b.familyName}`),
        'pt-br',
        { sensitivity: 'base' }
      )
    );

    return sorted.reduce((acc, contact) => {
      const firstLetter = contact.value.charAt(0).toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(contact);
      return acc;
    }, {});
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    if (!searchTerm) return sortedAndGroupedContacts;

    const filtered = {};
    Object.entries(sortedAndGroupedContacts).forEach(([key, value]) => {
      const filteredData = value.filter((contact) =>
        contact.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredData.length > 0) filtered[key] = filteredData;
    });
    return filtered;
  }, [sortedAndGroupedContacts, searchTerm]);

  const renderItem = ({ item }) =>
    typeof item === 'string' ? (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderLabel}>{item}</Text>
      </View>
    ) : (
      <ContactCard data={item} onEdit={handleNavigate} />
    );

  const handleNavigate = (data) => {
    navigator.navigate('DetailContact', {
      screen: 'DetailContact',
      params: data,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchContacts();
    setRefreshing(false);
  };

  const ActionIconSearch = ({ value, loading }) => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        {loading ? (
          <ActivityIndicator size={30} color={activeColors.accent} style={{}} />
        ) : value == '' ? (
          <Icon
            name="magnify"
            size={30}
            color="#666"
            style={{ marginRight: 5 }}
          />
        ) : (
          <TouchableOpacity onPress={handleIconSearch}>
            <Icon
              name="close"
              size={30}
              color="#666"
              style={{ marginRight: 5 }}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const addNewContact = async () => {
    await Contacts.openContactForm({});
    fetchContacts();
  };

  const handleIconSearch = () => {
    setSearchTerm('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerSearch}>
        {loading ? (
          <SkelletonInputSearch />
        ) : (
          <InputSearch
            selectionColor={activeColors.tint}
            label="Pesquisar..."
            icon={<ActionIconSearch value={searchTerm} loading={loading} />}
            keyboardType="name-phone-pad"
            onChangeText={setSearchTerm}
            value={searchTerm}
          />
        )}
      </View>
      {loading ? (
        [1, 2, 3, 4, 5, 6, 7].map((i) => <SkelletonPhoneItem key={i} />)
      ) : (
        <FlatList
          style={{ marginTop: 15 }}
          data={Object.entries(filteredContacts).reduce(
            (acc, [key, value]) => [...acc, key, ...value],
            []
          )}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.key || index.toString()}
          contentContainerStyle={styles.flatListContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const createStyles = (colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  containerSearch: {
    marginTop: 15,
    padding: 15,
    marginHorizontal: 10,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 10,
  },
  sectionHeaderContainer: {
    height: 40,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  sectionHeaderLabel: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  flatListContent: {
    flexGrow: 1,
  },
  headerButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
  },
  headerButtonText: {
    color: colors.accent,
    marginLeft: 5,
  },
});

export default ContactsScreen;
