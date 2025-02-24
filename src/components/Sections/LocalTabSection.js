import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CardItem from '../Cards/CardItem';
import LocalContent from '../Content/LocalContent';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import SkelletonPhoneItem from '../../skeletons/SkelletonPhoneItem';
import SkelletonInputSearch from '../../skeletons/SkelletonInputSearch';
import { useModal } from '../../context/ModalContext';
import PhoneModal from '../Modals/PhoneModal';
import { UserContext } from '../../context/UserContext';
import { FlatList } from 'react-native-gesture-handler';
import { getCategories } from '../../services/CategoryService';
import { getStateById } from '../../services/StateService';
import {
  updatePhone,
  getPhoneById,
  getPhonesByStateId,
  getContactsAndPhones,
} from '../../services/PhoneService';
import { normalizeText } from '../../utils/Helpers';
import LocalSearch from '../../screens/local/LocalSearch';

const LocalTabSection = () => {
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
    const loadData = async () => {
      setLoadingPhone(true);
      try {
        const cats = await loadCategories();
        const state = await loadState(user);
        await loadPhonesByStateId(cats, state);
      } catch (error) {
        console.log('❌ Erro ao carregar dados iniciais:', error);
      } finally {
        setLoadingPhone(false);
      }
    };
    loadData();
  }, [user]);

  const loadCategories = useCallback(async () => {
    const categs = await getCategories();
    if (categs && categs.length > 0) {
      setCategories(categs);
      setSelectedCategory(categs[0]);
    }
    return categs[0];
  });

  const loadState = useCallback(async (usr) => {
    if (usr && usr.state_id) {
      const foundState = await getStateById(usr.state_id);
      setSelectedState(foundState);
      navigate.setOptions({
        title:
          foundState && foundState.name ? `${foundState.name}` : 'Meu Local',
      });
      return foundState;
    }
  });

  const loadPhonesByStateId = async (cats, state) => {
    try {
      const phons = await getPhonesByStateId(state.id);
      // console.log('PHONS => ', phons);
      setOriginalPhones(phons);
      const filter = phons.filter((item) => item.category_id === cats.id);
      setPhones(filter);
    } catch (error) {
      console.log('ERROR => ', error);
    } finally {
      setLoadingPhone(false);
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
      // console.log('SETPHONES => ');
      setPhones([]);
      return;
    }
    const filtered = originalPhones.filter((item) =>
      textIncludesInFields(item, text)
    );
    setPhones(filtered);
  };

  const handleReset = async () => {
    setSearchText('');
    setLoadingPhone(true);
    await loadPhonesByStateId(selectedCategory, {
      id: user.state_id,
    });
    setLoadingPhone(false);
  };

  const handleConfirm = async (item) => {
    // console.log('HANDLECONFIRM => ', item);
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
      content: <PhoneModal data={data} onConfirm={handleConfirm} user={user} />,
    });
  };

  const getItemLayout = (data, index) => ({
    length: 120,
    offset: 134 * index,
    index,
  });

  return (
    <View style={{ backgroundColor: activeColors.secondary }}>
      <View style={styles.containerCardsCategories}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={categoriesScrollViewRef}
          renderItem={({ item, index }) => (
            <CardItem
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
          <View style={{ backgroundColor: activeColors.primary }}>
            <SkelletonInputSearch />
          </View>
        ) : (
          <LocalSearch
            value={searchText}
            setValue={() => {
              setSearchText('');
            }}
            onChange={handleSearch}
            onReset={handleReset}
            loading={loadingPhone}
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
    containerSearch: {
      backgroundColor: colors.primary,
      paddingBottom: 10,
    },
    containerCardsCategories: {
      paddingVertical: 5,
      backgroundColor: colors.primary,
    },
    sectionTitle: {
      marginTop: 25,
      marginLeft: 25,
      marginBottom: 25,
    },
  });
  return styles;
};

export default LocalTabSection;
