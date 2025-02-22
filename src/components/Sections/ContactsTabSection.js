import React, { useRef, useState, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Contacts from 'react-native-contacts';
import LocalContent from '../Content/LocalContent';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import InputSearch from '../Inputs/InputSearch';
import SkelletonPhoneItem from '../../skeletons/SkelletonPhoneItem';
import SkelletonInputSearch from '../../skeletons/SkelletonInputSearch';
import { useModal } from '../../context/ModalContext';
import PhoneModal from '../Modals/PhoneModal';
import { updatePhone, getPhonesFavoreds } from '../../db/PhoneService';
import EmptyScreen from '../../screens/EmptyScreen';
import ContactCard from '../Cards/ContactCard';
import ContactContent from '../Content/ContactContent';
import ContactModal from '../Modals/ContactModal';
import { useNavigation } from '@react-navigation/native';
import { normalizeText } from '../../utils/Helpers';

const ContactsTabSection = ({ route, navigate }) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [phones, setPhones] = useState([]);
  const [originalContacts, setOriginalContacts] = useState([]);
  const { openModal, closeModal } = useModal();
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
          console.error('Permission request error:', err);
          setLoading(false);
        }
      } else {
        fetchContacts();
      }
    })();
  }, []);

  const fetchContacts = () => {
    Contacts.getAll()
      .then((allContacts) => {
        // console.log('ALLCONTACTS => ', allContacts);
        setContacts(allContacts);
        setOriginalContacts(allContacts);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading contacts:', error);
        setLoading(false);
      });

    // Contacts.getCount().then((count) => {
    //   setSearchPlaceholder(`Search ${count} contacts`);
    // });

    Contacts.checkPermission();
  };

  useEffect(() => {
    (async () => {
      // await loadPhones();
    })();
  }, []);



  const textIncludesInFields = (item, text) => {
    const fieldsToSearch = ['title', 'number', 'ddd', 'description'];
    const normalizedText = normalizeText(text);
    return fieldsToSearch.some((field) =>
      normalizeText(item[field]).includes(normalizedText)
    );
  };

  // const handleSearch = (arrayToSearch, arrayResultSearch,arrayParamsToSearch, text) => {}
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

  const handleConfirm = async (item) => {
    console.log('HANDLECONFIRM => ', item);
    // setLoading(true);
    // try {
    //   await updatePhone(item.id, item);
    //   await loadPhones();
    //   setTimeout(() => {
    //     setLoading(false);
    //     closeModal();
    //   }, 3000);
    // } catch (error) {
    //   setLoading(false);
    //   closeModal();
    //   console.log('ERROR UPDATE PHONE=> ', error);
    // }
  };

  const handleOpenModal = (data) => {
    navigator.navigate('DetailContact', {
      screen: 'DetailContact',
      params: data,
    });
    // openModal({
    //   content: <ContactModal data={data} onConfirm={handleConfirm} />,
    // });
  };

  const handleIconSearch = () => {
    setSearchText('');
    loadPhones();
  };

  const ActionIconSearch = ({ value, loading }) => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        {loading ? (
          <ActivityIndicator
            size={'small'}
            color={activeColors.accent}
            style={{}}
          />
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
            icon={<ActionIconSearch value={searchText} loading={loading} />}
            keyboardType={'name-phone-pad'}
            onChangeText={handleSearch}
            value={searchText}
          />
        )}
      </View>

      {loading ? (
        [1, 2, 3, 4, 5, 6, 7].map((i) => <SkelletonPhoneItem key={i} />)
      ) : (
        <ContactContent data={contacts} user={user} handleEdit={handleOpenModal} />
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
