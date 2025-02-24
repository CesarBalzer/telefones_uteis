import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Contacts from 'react-native-contacts';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import InputSearch from '../Search/InputSearch';
import SkelletonPhoneItem from '../../skeletons/SkelletonPhoneItem';
import SkelletonInputSearch from '../../skeletons/SkelletonInputSearch';
import ContactContent from '../Content/ContactContent';
import { useNavigation } from '@react-navigation/native';
import { normalizeText } from '../../utils/Helpers';
import IconSearch from '../Search/IconSearch';

const ContactsTabSection = ({ route, navigate }) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [originalContacts, setOriginalContacts] = useState([]);
  const navigator = useNavigation();

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              title: 'Contacts',
              message: 'This app would like to view your contacts.',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            fetchContacts();
          } else {
            setLoading(false);
          }
        } catch (err) {
          console.log('Permission request error:', err);
          setLoading(false);
        }
      } else {
        fetchContacts();
      }
    })();
  }, []);

  const fetchContacts = useCallback(async () => {
    Contacts.getAll()
      .then((allContacts) => {
        setContacts(allContacts);
        setOriginalContacts(allContacts);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error loading contacts:', error);
        setLoading(false);
      });
    Contacts.checkPermission();
  });

  const textIncludesInFields = (item, text) => {
    const fieldsToSearch = ['title', 'number', 'ddd', 'description'];
    const normalizedText = normalizeText(text);
    return fieldsToSearch.some((field) =>
      normalizeText(item[field]).includes(normalizedText)
    );
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (!text) {
      setContacts(originalContacts);
      return;
    }
    const filtered = originalContacts.filter((item) =>
      textIncludesInFields(item, text)
    );
    setContacts(filtered);
  };

  const handleOpenModal = (data) => {
    navigator.navigate('DetailContact', {
      screen: 'DetailContact',
      params: data,
    });
  };

  const handleIconSearch = () => {
    setSearchText('');
    loadPhones();
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerSearch}>
        {loading ? (
          <>
            <SkelletonInputSearch />
          </>
        ) : (
          <InputSearch
            selectionColor={activeColors.tint}
            label={'Pesquisar...'}
            icon={<IconSearch value={searchText} loading={loadingPhone} onPress={handleIconSearch} />}
            keyboardType={'name-phone-pad'}
            onChangeText={handleSearch}
            value={searchText}
          />
        )}
      </View>

      {loading ? (
        [1, 2, 3, 4, 5, 6, 7].map((i) => <SkelletonPhoneItem key={i} />)
      ) : (
        <ContactContent
          data={contacts}
          user={user}
          handleEdit={handleOpenModal}
        />
      )}
    </View>
  );
};

const createStyles = (colors) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    containerSearch: {
      marginTop: 15,
      paddingVertical: 15,
      paddingHorizontal: 10,
      marginHorizontal: 10,
      backgroundColor: colors.primary,
      borderColor: colors.accent,
      borderWidth: 1,
      borderRadius: 10,
    },
  });
  return styles;
};

export default ContactsTabSection;
