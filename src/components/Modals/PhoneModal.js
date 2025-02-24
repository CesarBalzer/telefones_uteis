import React, { useState, useContext, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../Buttons/CustomButton';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import InputField from '../Inputs/InputField';
import SelectDropdownModal from '../Selects/SelectDropdownModal';
import { getAssetIcons } from 'react-native-shortcut-custom';
import { getCategories } from '../../services/CategoryService';
import { getStates } from '../../services/StateService';
import HeaderPhoneActions from '../Headers/HeaderPhoneActions';

const PhoneModal = ({ data, onConfirm, user }) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);

  const [phone, setPhone] = useState(data);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [imagePaths, setImagePaths] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const files = await getAssetIcons();
      setImagePaths(files);

      const fetchCategories = await getCategories();
      setCategories(fetchCategories);

      const fetchStates = await getStates();
      setStates(fetchStates);
    } catch (error) {
      console.log('ERROR => ', error);
      Alert.alert('Erro', error.message);
    }
  };

  // 🔥 Atualizar categoria e estado selecionados após carregar os dados
  useEffect(() => {
    if (categories.length > 0 && phone.category_id) {
      const foundCategory = categories.find(cat => cat.id === phone.category_id);
      setSelectedCategory(foundCategory || null);
    }

    if (states.length > 0 && phone.state_id) {
      const foundState = states.find(state => state.id === phone.state_id);
      setSelectedState(foundState || null);
    }
  }, [categories, states, phone]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <HeaderPhoneActions data={data} user={user} />

        <View style={styles.body}>
          <View style={styles.sectionPhone}>
            <View style={styles.phone}>
              <InputField
                label={'DDD'}
                keyboardType="numeric"
                onChange={(text) => setPhone({ ...phone, ddd: text })}
                value={phone.ddd}
                icon={
                  <Icon name="earth" size={20} color={activeColors.tertiary} />
                }
              />
            </View>

            <View style={styles.phoneNumber}>
              <InputField
                label={'Número'}
                keyboardType="numeric"
                onChange={(text) => setPhone({ ...phone, number: text })}
                value={phone.number || ''}
                icon={
                  <Icon
                    name="phone-dial-outline"
                    size={20}
                    color={activeColors.tertiary}
                  />
                }
              />
            </View>
          </View>

          <View style={styles.section}>
            <InputField
              label={'Título'}
              value={phone.title || ''}
              onChange={(text) => setPhone({ ...phone, title: text })}
              icon={
                <Icon
                  name="text-short"
                  size={20}
                  color={activeColors.tertiary}
                />
              }
              multiline
            />
          </View>

          <View style={styles.section}>
            <InputField
              label={'Descrição'}
              value={phone.description || ''}
              onChange={(text) => setPhone({ ...phone, description: text })}
              icon={
                <Icon
                  name="text-long"
                  size={20}
                  color={activeColors.tertiary}
                />
              }
              keyboardType="email-address"
              multiline
            />
          </View>

          <View style={styles.section}>
            <SelectDropdownModal
              data={categories}
              onSelect={(selectedItem) => setSelectedCategory(selectedItem)}
              selected={selectedCategory}
              select="name"
              label={'Categoria de números'}
              emptyTitle={'Selecione uma categoria'}
              disabled={categories.length === 0}
            />
          </View>

          <View style={styles.section}>
            <SelectDropdownModal
              data={states}
              onSelect={(selectedItem) => setSelectedState(selectedItem)}
              selected={selectedState}
              select="name"
              label={'Estado do Brasil'}
              emptyTitle={'Selecione um estado'}
              disabled={states.length === 0}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
    },
    scrollContainer: {
      flexGrow: 1,
      width: '100%',
      marginBottom:20
    },
    body: {
      flex: 1,
      width: '100%',
      marginTop:20,
      paddingHorizontal: 20,
      backgroundColor: colors.primary,
    },
    sectionPhone: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 20,
    },
    phone: {
      flex: 1,
    },
    phoneNumber: {
      flex: 2,
      marginLeft: 15,
    },
    section: {
      width: '100%',
      marginVertical: 20,
    },
  });

export default PhoneModal;
