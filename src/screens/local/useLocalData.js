import { useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getCategories } from '../../services/CategoryService';
import { getStateById } from '../../services/StateService';
import { getPhonesByStateId } from '../../services/PhoneService';
import { UserContext } from '../../context/UserContext';

export const useLocalData = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [phones, setPhones] = useState([]);
  const [originalPhones, setOriginalPhones] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loadingPhone, setLoadingPhone] = useState(true);

  useEffect(() => {
    (async () => {
      setLoadingPhone(true);
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
      setSelectedCategory(fetchedCategories[0]);

      if (user?.state_id) {
        const state = await getStateById(user.state_id);
        navigation.setOptions({ title: state?.name || 'Meu Local' });

        const phoneData = await getPhonesByStateId(state.id);
        setPhones(phoneData);
        setOriginalPhones(phoneData);
      }
      setLoadingPhone(false);
    })();
  }, [user]);

  return {
    categories,
    selectedCategory,
    setSelectedCategory,
    phones,
    searchText,
    setSearchText,
    loadingPhone,
  };
};
