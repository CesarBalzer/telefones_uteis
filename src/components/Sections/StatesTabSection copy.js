import React, { useRef, useState, useContext, useEffect } from 'react';
import { View, FlatList, Animated, StyleSheet } from 'react-native';
import CategoryLocalCard from '../Cards/CategoryLocalCard';
import LocalContent from '../Content/LocalContent';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import InputSearch from '../Inputs/InputSearch';
import { useModal } from '../../context/ModalContext';
import { useNavigation } from '@react-navigation/native';
import StateCard from '../../screens/states/StateCard';
import { UserContext } from '../../context/UserContext';
import { getCategories } from '../../db/CategoryService';
import { getStates, getStateById } from '../../db/StateService';
import { getPhones, getPhonesByStateId } from '../../db/PhoneService';
import PhoneModal from '../Modals/PhoneModal';
import { normalizeText } from '../../utils/Helpers';

const StatesTabSection = ({ route }) => {
  const { theme } = useContext(ThemeContext);
  const { user, setUser } = useContext(UserContext);
  // console.log('USER => ', user);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [selectedCategory, setSelectedCategory] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [phones, setPhones] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { openModal } = useModal();
  const navigate = useNavigation();

  const [hideStates, setHideStates] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const cats = await loadCategories();
      await loadStates();
      await loadPhones(cats);
    })();
  }, [user]);

  const loadCategories = async () => {
    const categs = await getCategories();
    if (categs.length > 0) {
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
    setLoading(true);

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
      setLoading(false);
    }, 500);
  };

  const handleCategoryPress = (data) => {
    if (selectedCategory.id === data.id) return;
    setLoading(true);
    setSelectedCategory(data);

    const filter = phones.filter(
      (item) => item.category_id == data.id && item.state_id == selectedState.id
    );

    setTimeout(() => {
      setFilteredData(filter);
      setLoading(false);
    }, 500);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY > 50) setHideStates(true);
        else setHideStates(false);
      },
    }
  );

  return (
    <View style={styles.container}>
      {!hideStates && (
        <Animated.View
          style={[styles.containerCardsStates]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={states}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <StateCard
                title={item.name}
                onPress={() => handleStatePress(item)}
                isActive={item.id === selectedState?.id}
              />
            )}
          />
        </Animated.View>
      )}

      <View style={styles.containerSearch}>
        <InputSearch
          selectionColor={activeColors.tint}
          label="Pesquisar..."
          icon={<Icon name="magnify" size={30} color={activeColors.tertiary} />}
          onChangeText={setSearchText}
          value={searchText}
        />
      </View>

      <View style={styles.containerCardsCategories}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CategoryLocalCard
              title={item.name}
              onPress={() => handleCategoryPress(item)}
              isActive={item.id === selectedCategory?.id}
            />
          )}
        />
      </View>

      <Animated.FlatList
        data={phones}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <LocalContent data={[item]} handleEdit={openModal} />
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
};

const createStyles = (colors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    containerCardsStates: {
      marginTop: 0,
      paddingVertical: 10,
      backgroundColor: `${colors.accent}35`,
    },
    containerCardsCategories: {
      paddingVertical: 10,
      marginTop: 15,
      backgroundColor: `${colors.tint}35`,
    },
    containerSearch: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 15,
      paddingVertical: 15,
      paddingHorizontal: 10,
      marginHorizontal: 10,
      backgroundColor: `${colors.primary}`,
      borderColor: colors.accent,
      borderWidth: 1,
      borderRadius: 10,
    },
  });
};

export default StatesTabSection;
