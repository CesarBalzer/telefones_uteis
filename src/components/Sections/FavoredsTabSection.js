import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import LocalContent from '../Content/LocalContent';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import InputSearch from '../Search/InputSearch';
import SkelletonPhoneItem from '../../skeletons/SkelletonPhoneItem';
import SkelletonInputSearch from '../../skeletons/SkelletonInputSearch';
import { useModal } from '../../context/ModalContext';
import PhoneModal from '../Modals/PhoneModal';
import FavoriteService from '../../services/FavoriteService';
import EmptyScreen from '../../screens/favorites/EmptyScreen';
import { getAll } from 'react-native-contacts';
import { normalizeText } from '../../utils/Helpers';
import { UserContext } from '../../context/UserContext';
import IconSearch from '../Search/IconSearch';
import PermissionService from '../../services/PermissionService';

const FavoredsTabSection = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const { openModal, closeModal } = useModal();
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);

  const [loading, setLoading] = useState(false);
  const [loadingPhone, setLoadingPhone] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [phones, setPhones] = useState([]);
  const [originalPhones, setOriginalPhones] = useState([]);

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
            loadFavorites();
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


  const loadFavorites = useCallback(async () => {
    try {
      setLoadingPhone(true);

      const permission = await PermissionService.requestPermissions();

      if (!permission) {
        return;
      }

      const dbFavorites = await FavoriteService.getFavoritesByUserId(user.id);
      const favoritesContacts = dbFavorites.flatMap(({ phone }) => ({
        active: 1,
        category_id: 1,
        description: phone.description,
        favored: 1,
        icon: phone.icon,
        id: phone.id,
        number: phone.number,
        state_id: phone.state_id,
        title: phone.title,
      }));

      const allContacts = await getAll();
      const phoneContacts = allContacts
        .filter(({ isStarred }) => isStarred)
        .flatMap(({ displayName, phoneNumbers }) =>
          phoneNumbers.map(({ id, number, thumbnailPath }) => ({
            active: 1,
            category_id: 1,
            description: '',
            favored: 1,
            icon: thumbnailPath,
            id: parseInt(id),
            number,
            state_id: 0,
            title: displayName,
          }))
        );

      const mergedFavorites = [...favoritesContacts, ...phoneContacts].sort(
        (a, b) => a.title.localeCompare(b.title)
      );

      setPhones(mergedFavorites);
      setOriginalPhones(mergedFavorites);
    } catch (error) {
      console.log('ERROR => ', error);
    } finally {
      setLoadingPhone(false);
    }
  }, [user.id]);

  const textIncludesInFields = (item, text) => {
    const normalizedText = normalizeText(text);
    return ['title', 'number', 'ddd', 'description'].some((field) =>
      normalizeText(item[field] || '').includes(normalizedText)
    );
  };

  const handleSearch = (text) => {
    setSearchText(text);
    setPhones(
      text
        ? originalPhones.filter((item) => textIncludesInFields(item, text))
        : originalPhones
    );
  };

  const handleConfirm = async (item) => {
    setLoading(true);
    try {
      await FavoriteService.removeFavorite(1, item.id);
      await loadFavorites();
    } catch (error) {
      console.log('ERROR REMOVE FAVORITE => ', error);
    } finally {
      setLoading(false);
      closeModal();
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

  return (
    <View style={styles.container}>
      <View style={styles.containerSearch}>
        {loading ? (
          <SkelletonInputSearch />
        ) : (
          <InputSearch
            selectionColor={activeColors.tint}
            label="Pesquisar..."
            icon={
              <IconSearch
                value={searchText}
                loading={loadingPhone}
                onPress={handleIconSearch}
              />
            }
            keyboardType="name-phone-pad"
            onChangeText={handleSearch}
            value={searchText}
          />
        )}
      </View>

      {loadingPhone ? (
        Array.from({ length: 7 }, (_, i) => <SkelletonPhoneItem key={i} />)
      ) : phones.length ? (
        <LocalContent data={phones} handleEdit={handleOpenModal} />
      ) : (
        <EmptyScreen />
      )}
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    containerSearch: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 15,
      paddingVertical: 15,
      paddingHorizontal: 10,
      marginHorizontal: 10,
      backgroundColor: `${colors.primary}`,
      borderColor: colors.accent,
      borderWidth: 1,
      borderRadius: 10,
    },
  });

export default FavoredsTabSection;
