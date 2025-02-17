import React, { useRef, useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CategoryLocalCard from '../Cards/CategoryLocalCard';
import LocalContent from '../Content/LocalContent';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import InputSearch from '../Inputs/InputSearch';
import SkelletonPhoneItem from '../../skeletons/SkelletonPhoneItem';
import SkelletonInputSearch from '../../skeletons/SkelletonInputSearch';
import { useModal } from '../../context/ModalContext';
import PhoneModal from '../Modals/PhoneModal';
import { UserContext } from '../../context/UserContext';
import { FlatList } from 'react-native-gesture-handler';
import { getCategories } from '../../db/CategoryService';
import { getStateById } from '../../db/StateService';
import {
  updatePhone,
  getPhoneById,
  getPhonesByStateId,
} from '../../db/PhoneService';
import { normalizeText } from '../../utils/Helpers';

const MyLocalTabSection = ({ route }) => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [loading, setLoading] = useState(false);
  const [loadingPhone, setLoadingPhone] = useState(false);

  const [categories, setCategories] = useState([]);
  const categoriesScrollViewRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedState, setSelectedState] = useState();

  const [searchText, setSearchText] = useState('');

  const [originalPhones, setOriginalPhones] = useState([]);
  const [phones, setPhones] = useState([]);
  const { openModal, closeModal } = useModal();
  const navigate = useNavigation();

  useEffect(() => {
    (async () => {
      setLoadingPhone(true);
      const cats = await loadCategories();
      const state = await loadStates(user);
      await loadPhonesByStateId(cats, state);
      setLoadingPhone(false);
    })();
  }, [user]);

  const loadCategories = async () => {
    const categs = await getCategories();
    if (categs && categs.length > 0) {
      setCategories(categs);
      setSelectedCategory(categs[0]);
    }
    return categs[0];
  };

  const loadStates = async (usr) => {
    if (usr && usr.state_id) {
      const foundState = await getStateById(usr.state_id);
      setSelectedState(foundState);
      navigate.setOptions({
        title:
          foundState && foundState.name ? `${foundState.name}` : 'Meu Local',
      });
      return foundState;
    }
  };

  const loadPhonesByStateId = async (cats, state) => {
    try {
      const phons = await getPhonesByStateId(state.id);
      setOriginalPhones(phons);
      // console.log('PHONS => ', phons);
      const filter = phons.filter((item) => item.category_id == cats.id);
      setPhones(filter);
    } catch (error) {
      console.log('ERROR => ', error);
    }
  };

  const handleCategoryPress = (data) => {
    if (selectedCategory.id === data.id) return;

    setLoadingPhone(true);
    const filter = originalPhones.filter((item) => item.category_id == data.id);
    setPhones(filter);
    setSelectedCategory(data);

    setTimeout(() => {
      setLoadingPhone(false);
    }, 500);
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
    try {
      await updatePhone(item.id, item);
      await getPhoneById(item.id);
      const foundState = await getStateById(item.state_id);
      await loadPhonesByStateId(selectedCategory, foundState);
      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      closeModal();
      console.log('ERROR => ', error);
    }
  };

  const handleOpenModal = (data) => {
    openModal({
      content: <PhoneModal data={data} onConfirm={handleConfirm} />,
    });
  };

  const getItemLayout = (data, index) => ({
    length: 120,
    offset: 134 * index,
    index,
  });

  const handleIconSearch = () => {
    setSearchText('');
    loadPhonesByStateId();
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

  return (
    <View>
      <View style={styles.containerCardsCategories}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={categoriesScrollViewRef}
          renderItem={({ item, index }) => (
            <CategoryLocalCard
              key={index}
              title={item.name}
              onPress={() => handleCategoryPress(item)}
              isActive={item.id === selectedCategory?.id}
            />
          )}
          data={categories}
          keyExtractor={(item, index) => item.id.toString()}
          getItemLayout={getItemLayout}
          ListEmptyComponent={<View />}
        />
      </View>

      <View style={styles.containerSearch}>
        {loading ? (
          <>
            <SkelletonInputSearch />
          </>
        ) : (
          <InputSearch
            selectionColor={activeColors.tint}
            label={'Pesquisar...'}
            icon={
              <ActionIconSearch value={searchText} loading={loadingPhone} />
            }
            keyboardType={'name-phone-pad'}
            onChangeText={handleSearch}
            value={searchText}
          />
        )}
      </View>
      {loadingPhone ? (
        [1, 2, 3, 4, 5, 6, 7].map((i) => <SkelletonPhoneItem key={i} />)
      ) : (
        <LocalContent data={phones} handleEdit={handleOpenModal} />
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
    containerCardsCategories: {
      paddingVertical: 5,
      backgroundColor: `${colors.tint}35`,
    },
    containerSearch: {
      marginTop: 15,
      paddingVertical: 15,
      paddingHorizontal: 10,
      marginHorizontal: 10,
      backgroundColor: `${colors.primary}`,
      borderColor: colors.accent,
      borderWidth: 1,
      borderRadius: 10,
    },
    sectionTitle: {
      marginTop: 25,
      marginLeft: 25,
      marginBottom: 25,
    },
  });
  return styles;
};

export default MyLocalTabSection;
