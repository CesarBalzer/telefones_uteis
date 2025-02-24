import React, { useRef, useState, useContext, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import LocalContent from '../Content/LocalContent';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import SkelletonPhoneItem from '../../skeletons/SkelletonPhoneItem';
import { useModal } from '../../context/ModalContext';
import { useNavigation } from '@react-navigation/native';
import CardItem from '../Cards/CardItem';
import { UserContext } from '../../context/UserContext';
import { getCategories } from '../../services/CategoryService';
import { getStateById, getStates } from '../../services/StateService';
import {
  editPhone,
  getPhoneById,
  getPhones,
  getPhonesByStateId,
} from '../../services/PhoneService';
import PhoneModal from '../Modals/PhoneModal';
import { normalizeText } from '../../utils/Helpers';
import LocalSearch from '../../screens/local/LocalSearch';
import SkelletonInputSearch from '../../skeletons/SkelletonInputSearch';

const CountryTabSection = () => {
  const { theme } = useContext(ThemeContext);
  const { user, setUser } = useContext(UserContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [loading, setLoading] = useState(false);
  const [loadingPhone, setLoadingPhone] = useState(false);
  const [categories, setCategories] = useState([]);
  const categoriesScrollViewRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [states, setStates] = useState([]);
  const statesScrollViewRef = useRef(null);
  const [selectedState, setSelectedState] = useState();
  const [phones, setPhones] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const { openModal, closeModal } = useModal();
  const navigate = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      setLoadingPhone(true);
      try {
        const cats = await loadCategories();
        await loadStates();
        await loadPhones(cats);
      } catch (error) {
        console.log('❌ Erro ao carregar dados iniciais:', error);
      } finally {
        setLoadingPhone(false);
      }
    };

    loadData();
  }, [user]);

  const loadCategories = async () => {
    const categs = await getCategories();
    if (categs && categs.length > 0) {
      setCategories(categs);
      setSelectedCategory(categs[0]);
    }
    return categs;
  };

  const loadStates = async () => {
    const sts = await getStates();
    setStates(sts);

    if (user && user.country_state_id) {
      const foundState = await getStateById(user.country_state_id);
      setSelectedState(foundState);
      navigate.setOptions({
        title: foundState && foundState.name ? `${foundState.name}` : 'Brasil',
      });

      setTimeout(() => {
        const index = sts.findIndex(
          (item) => item.id === user.country_state_id
        );

        if (index !== -1) {
          handleScroll(index);
        }
      }, 500);
    }
  };

  const loadPhones = async (cats) => {
    const phons = await getPhones();
    setPhones(phons);

    if (user && user.state_id) {
      const foundPhones = await getPhonesByStateId(user.state_id);
      const foundPhonesByCategory = foundPhones.filter(
        (item) => item.category_id == cats[0].id
      );
      setFilteredData(foundPhonesByCategory);
      setOriginalData(foundPhonesByCategory);
    }
  };

  const handleStatePress = (data) => {
    setLoadingPhone(true);

    const filteredPhonesStates = phones.filter(
      (item) => item.state_id === data.id
    );
    const filteredPhonesCategories = filteredPhonesStates.filter(
      (item) => item.category_id === selectedCategory.id
    );

    setFilteredData(filteredPhonesCategories);
    setOriginalData(filteredPhonesCategories);
    setSelectedState(data);

    setUser({ ...user, country_state_id: data.id });

    navigate.setOptions({ title: data.name });

    const index = states.findIndex((item) => item.id === data.id);

    if (index !== -1) {
      handleScroll(index);
    }

    setTimeout(() => {
      setLoadingPhone(false);
    }, 500);
  };

  const handleScroll = (idx) => {
    if (!statesScrollViewRef.current) return;

    setTimeout(() => {
      try {
        statesScrollViewRef.current.scrollToIndex({
          animated: true,
          index: idx,
        });
      } catch (error) {
        console.log('Erro ao rolar para o estado:', error);
      }
    }, 300);
  };

  const handleCategoryPress = (data) => {
    console.log(
      'HANDLECATEGORYPRESS => ',
      data,
      selectedCategory,
      selectedState
    );

    if (!data) return;

    if (selectedCategory?.id === data.id) return;

    setLoadingPhone(true);
    setSelectedCategory(data);

    const stateId = selectedState?.id ?? user?.state_id;

    const filter = phones.filter(
      (item) =>
        item.category_id == data.id && stateId && item.state_id == stateId
    );

    setTimeout(() => {
      setFilteredData(filter);
      setLoadingPhone(false);
    }, 500);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (!text) {
      setFilteredData(originalData);
      return;
    }

    const filtered = originalData.filter((item) =>
      textIncludesInFields(item, text)
    );

    setFilteredData(filtered);
  };

  const textIncludesInFields = (item, text) => {
    const fieldsToSearch = ['title', 'number', 'ddd', 'description'];
    const normalizedText = normalizeText(text);
    return fieldsToSearch.some((field) =>
      normalizeText(item[field]).includes(normalizedText)
    );
  };

  const handleConfirm = async (data) => {
    console.log('HANDLE CONFIRM => ', data);
    try {
      const updatePhone = await editPhone(data.id, data);
      console.log('UPDATEPHONE => ', updatePhone);

      const phon = await getPhoneById(data.id);
      console.log('PHON => ', phon);

      const old = filteredData.filter((item) => item.id != data.id);
      old.push(phon);

      console.log('OLD => ', old);
      setFilteredData(old);
      const foundState = await getStateById(item.state_id);
      console.log('FOUNDSTATE => ', foundState);

      await loadPhones(selectedCategory);
    } catch (error) {
      console.log('ERROR => ', error);
    }
  };

  const handleOpenModal = (data) => {
    // console.log('HANDLE OPEN MODAL => ', data);
    openModal({
      content: <PhoneModal data={data} onConfirm={handleConfirm} user={user} />,
    });
  };

  const handleReset = async () => {
    setSearchText('');
    setLoadingPhone(true);
    setFilteredData(originalData);
    setLoadingPhone(false);
  };

  const getItemLayoutPhones = (data, index) => ({
    length: 120,
    offset: 134 * index,
    index,
  });

  return (
    <View style={{ backgroundColor: activeColors.secondary }}>
      <View style={styles.containerCardsStates}>
        {states && states.length ? (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={statesScrollViewRef}
            data={states}
            keyExtractor={(item) => item.id.toString()}
            getItemLayout={(data, index) => ({
              length: 120,
              offset: 134 * index,
              index,
            })}
            renderItem={({ item }) => (
              <CardItem
                key={item.id}
                title={item.name}
                onPress={() => handleStatePress(item)}
                isActive={item.id === selectedState?.id}
              />
            )}
          />
        ) : (
          <View />
        )}
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
          getItemLayout={getItemLayoutPhones}
          ListEmptyComponent={<View />}
        />
      </View>
      {loadingPhone ? (
        [1, 2, 3, 4, 5, 6, 7].map((i) => <SkelletonPhoneItem key={i} />)
      ) : (
        <View style={{ backgroundColor: 'yellowgreen' }}>
          <LocalContent data={filteredData} handleEdit={handleOpenModal} />
        </View>
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
    containerCardsStates: {
      marginTop: 0,
      paddingVertical: 10,
      backgroundColor: colors.primary,
    },
    containerCardsCategories: {
      // marginVertical: 10,
      // paddingVertical: 5,
      backgroundColor: colors.primary,
    },
    containerSearch: {
      backgroundColor: colors.primary,
      paddingBottom: 5,
    },
    sectionTitle: {
      marginTop: 25,
      marginLeft: 25,
      marginBottom: 25,
    },
  });
  return styles;
};

export default CountryTabSection;
