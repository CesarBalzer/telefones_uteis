import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LocalContent from '../Content/LocalContent';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import InputSearch from '../Inputs/InputSearch';
import SkelletonPhoneItem from '../../skeletons/SkelletonPhoneItem';
import SkelletonInputSearch from '../../skeletons/SkelletonInputSearch';
import { useModal } from '../../context/ModalContext';
import PhoneModal from '../Modals/PhoneModal';
import FavoriteService from '../../db/FavoriteService';
import EmptyScreen from '../../screens/EmptyScreen';
import { getAll } from 'react-native-contacts';
import { normalizeText } from '../../utils/Helpers';

const FavoredsTabSection = ({ route }) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [loading, setLoading] = useState(false);
  const [loadingPhone, setLoadingPhone] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [phones, setPhones] = useState([]);
  const [originalPhones, setOriginalPhones] = useState([]);
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoadingPhone(true);
      
      const userId = 1; // Substituir pelo ID do usuário logado
      const dbFavorites = await FavoriteService.getFavoritesByUserId(userId);
      const allContacts = await getAll();
      const starredContacts = allContacts.filter(
        (contact) => contact.isStarred
      );

      const phoneContacts = starredContacts
        .map((contact) => {
          return contact.phoneNumbers.map((phone) => ({
            active: 1,
            category_id: 1,
            description: '',
            favored: 1,
            icon: phone.thumbnailPath,
            id: parseInt(phone.id),
            number: phone.number,
            state_id: 0,
            title: contact.displayName,
          }));
        })
        .flat();

      const mergedFavorites = [...dbFavorites, ...phoneContacts];

      setPhones(mergedFavorites);
      setOriginalPhones(mergedFavorites);
      
    } catch (error) {
      console.log('ERROR => ', error);
    } finally {
      setLoadingPhone(false);
    }
  };

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
      setPhones(originalPhones);
      return;
    }
    const filtered = originalPhones.filter((item) =>
      textIncludesInFields(item, text)
    );
    setPhones(filtered);
  };

  const handleConfirm = async (item) => {
    console.log('HANDLECONFIRM => ', item);
    setLoading(true);
    try {
      await FavoriteService.removeFavorite(1, item.id);
      await loadFavorites();
      setTimeout(() => {
        setLoading(false);
        closeModal();
      }, 1000);
    } catch (error) {
      setLoading(false);
      closeModal();
      console.log('ERROR REMOVE FAVORITE => ', error);
    }
  };

  const handleOpenModal = (data) => {
    openModal({
      content: <PhoneModal data={data} onConfirm={handleConfirm} />,
    });
  };

  const handleIconSearch = () => {
    setSearchText('');
    loadFavorites();
  };

  const ActionIconSearch = ({ value, loading }) => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        {loading ? (
          <ActivityIndicator
            size={'small'}
            color={activeColors.accent}
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
          <SkelletonInputSearch />
        ) : (
          <InputSearch
            selectionColor={activeColors.tint}
            label={'Pesquisar...'}
            icon={<ActionIconSearch value={searchText} loading={loadingPhone} />}
            keyboardType={'name-phone-pad'}
            onChangeText={handleSearch}
            value={searchText}
          />
        )}
      </View>

      {loadingPhone ? (
        [1, 2, 3, 4, 5, 6, 7].map((i) => <SkelletonPhoneItem key={i} />)
      ) : phones && phones.length ? (
        <LocalContent data={phones} handleEdit={handleOpenModal} />
      ) : (
        <EmptyScreen />
      )}
    </View>
  );
};

const createStyles = (colors) => {
  return StyleSheet.create({
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
};

export default FavoredsTabSection;
