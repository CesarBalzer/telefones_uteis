import React, { useState, useContext, useEffect } from 'react';
import {
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Dimensions,
  Platform,
  Switch,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../components/Buttons/CustomButton';
import { colors } from '../config/theme';
import { ThemeContext } from '../context/ThemeContext';
import InputField from '../components/Inputs/InputField';
import DataSets from '../data/DataSets';
import DynamicSelectDropdown from '../components/Selects/DynamicSelectDropdown';
import Modal from 'react-native-modal';
import Avatar from '../components/Avatars/Avatar';
import HeaderDetailContact from './HeaderDetailContact';
import { useNavigation } from '@react-navigation/native';
import { updateContact } from 'react-native-contacts';
import { Masks } from 'react-native-mask-input';

const DetailContact = ({ route }) => {
  const { params } = route.params || {};
  const data = params || {};
  // console.log('DATA => ', data);
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [phone, setPhone] = useState({});
  const [categories, setCategories] = useState(DataSets.categories);
  const [selectedCategory, setSelectedCategory] = useState();
  const [states, setStates] = useState(DataSets.states);
  const [selectedState, setSelectedState] = useState();
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const navigate = useNavigation();
  const [isFavored, setIsFavored] = useState(data?.favored);
  const [isModalVisible, setModalVisible] = useState(false);
  const markups = [
    { id: 1, name: 'Celular', value: 'mobile' },
    { id: 2, name: 'Trabalho', value: 'work' },
    { id: 3, name: 'Casa', value: 'home' },
    { id: 4, name: 'Principal', value: 'default' },
    { id: 5, name: 'Comercial', value: 'comercial' },
    { id: 6, name: 'Outros', value: 'other' },
  ];

  console.log('PHONE => ', phone);
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight =
    Platform.OS === 'ios'
      ? Dimensions.get('window').height
      : require('react-native-extra-dimensions-android').get(
          'REAL_WINDOW_HEIGHT'
        );

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    if (JSON.stringify(phone) !== JSON.stringify(data)) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [phone]);

  useEffect(() => {
    const requestContactsPermission = async () => {
      if (Platform.OS === 'android') {
        const hasPermission = await checkContactsPermission();
        if (hasPermission) {
          // fetchContacts();
        } else {
          setLoading(false);
        }
      }
    };

    requestContactsPermission();
    return () => {};
  }, []);

  const checkContactsPermission = async () => {
    try {
      const writePermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app needs access to your contacts to write.',
        }
      );

      const readPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app needs access to your contacts to read.',
        }
      );

      return (
        writePermission === PermissionsAndroid.RESULTS.GRANTED &&
        readPermission === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.error('Permission request error:', err);
      return false;
    }
  };

  useEffect(() => {
    const filteredCategories = categories.filter(
      (item) => item.id === data.category_id
    );
    filteredCategories.length
      ? setSelectedCategory(filteredCategories[0])
      : setSelectedCategory(null);

    const filteredStates = states.filter((item) => item.id === data.state_id);
    filteredStates.length
      ? setSelectedState(filteredStates[0])
      : setSelectedState(null);

    setPhone(data);

    navigate.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigate.goBack()}>
          <View
            style={{
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon
              name={'chevron-left'}
              size={28}
              color={activeColors.primary}
            />
            <Text style={{ color: activeColors.primary }}>Voltar</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, []);

  const handleChange = async (evt) => {
    // console.log('HANDLE CHANGE => ', evt);
    setIsFavored((prev) => !prev);
    setPhone({ ...phone, favored: !!evt ? 1 : 0 });
  };

  const handleRemove = () => {
    toggleModal();
  };

  const confirmRemove = () => {
    // console.log('CONFIRM REMOVE => ', phone);
    toggleModal();
  };

  const confirmCancel = () => {
    toggleModal();
  };

  const handleConfirm = async () => {
    console.log('HANDLE CONFIRM => ', phone);
    setLoading(true);
    try {
      await updateContact(phone);
      navigate.navigate('Main', {
        screen: 'Contacts',
      });
    } catch (error) {
      console.log('ERROR => ', error);
    }
    setLoading(false);
    // onConfirm && onConfirm(obj);
  };

  const handlePhoneNumberChange = (text, index, label) => {
    console.log('HANDLE PHONE NUMBER CHANGE => ', text, index, label);

    const updatedPhoneNumbers = [...phone.phoneNumbers];
    updatedPhoneNumbers[index].number = text;
    updatedPhoneNumbers[index].label = label;
    setPhone({ ...phone, phoneNumbers: updatedPhoneNumbers });
  };

  const handleEmailAddressChange = (text, index, label) => {
    const updatedEmailAddresses = [...phone.emailAddresses];
    updatedEmailAddresses[index].email = text;
    updatedEmailAddresses[index].label = label;
    setPhone({ ...phone, emailAddresses: updatedEmailAddresses });
  };

  const addNewPhone = () => {
    setPhone({
      ...phone,
      phoneNumbers: [...phone.phoneNumbers, { number: '', label: '' }],
    });
  };

  const addNewEmail = () => {
    setPhone({
      ...phone,
      phoneNumbers: [...phone.emailAddresses, { email: '', label: '' }],
    });
  };

  const removePhone = (idx) => {
    const updatedPhoneNumbers = phone.phoneNumbers.filter(
      (_, index) => index !== idx
    );
    setPhone({ ...phone, phoneNumbers: updatedPhoneNumbers });
  };

  const removeEmail = (idx) => {
    const updatedEmailAddresses = phone.emailAddresses.filter(
      (_, index) => index !== idx
    );
    setPhone({ ...phone, emailAddresses: updatedEmailAddresses });
  };

  return (
    <ScrollView>
      <View style={{ flex: 1, justifyContent: 'space-between', marginTop: 0 }}>
        <HeaderDetailContact phone={phone} />

        <View style={styles.section}>
          <InputField
            label={'Nome'}
            value={`${phone.givenName || ''} ${phone.familyName || ''}`}
            onChange={(text) => setPhone({ ...phone, displayName: text })}
            icon={
              <Icon
                name="text-short"
                size={20}
                color={activeColors.tertiary}
                style={{ marginRight: 5 }}
              />
            }
            multiline={true}
          />
        </View>

        <View style={styles.body}>
          {phone &&
            phone?.phoneNumbers &&
            phone.phoneNumbers.map((item, idx) => (
              <View style={styles.sectionPhone} key={idx}>
                <View
                  style={{
                    backgroundColor: 'transparent',
                    flex: 2,
                    marginLeft: 10,
                  }}
                >
                  
                  <InputField
                    label={'Número'}
                    keyboardType="numeric"
                    onChange={(text) =>
                      handlePhoneNumberChange(text, idx, item.label)
                    }
                    // mask={Masks.BRL_PHONE}
                    value={item.number || ''}
                    icon={
                      <Icon
                        name="phone-dial-outline"
                        size={20}
                        color={activeColors.tertiary}
                        style={{ marginRight: 5 }}
                      />
                    }
                  />
                </View>

                <View
                  style={{
                    backgroundColor: 'transparent',
                    flex: 1,
                    marginHorizontal: 10,
                    paddingTop: 10,
                  }}
                >
                  <DynamicSelectDropdown
                    data={markups}
                    onSelect={(selectedItem, index) => {
                      const label = selectedItem.value;
                      handlePhoneNumberChange(item.number, idx, label);
                    }}
                    selected={item}
                    select="name"
                    label={'Marcador'}
                    emptyTitle={'Selecione um marcador'}
                  />
                </View>

                <TouchableOpacity onPress={() => removePhone(idx)}>
                  <Text>Remover</Text>
                </TouchableOpacity>
              </View>
            ))}

          <View style={styles.sectionPhone}>
            <TouchableOpacity onPress={addNewPhone}>
              <Text>+ Adicionar novo número</Text>
            </TouchableOpacity>
          </View>

          {phone &&
            phone.emailAddresses &&
            phone.emailAddresses.map((item, idx) => (
              <View style={styles.sectionPhone} key={idx}>
                <View
                  style={{
                    backgroundColor: 'transparent',
                    flex: 2,
                    marginLeft: 1,
                  }}
                >
                  <InputField
                    label={'Endereço de Email'}
                    keyboardType="email-address"
                    onChange={(text) => handleEmailAddressChange(text, idx)}
                    value={item.email || ''}
                    icon={
                      <Icon
                        name="email"
                        size={20}
                        color={activeColors.tertiary}
                        style={{ marginRight: 5 }}
                      />
                    }
                  />

                  <View
                    style={{
                      backgroundColor: 'transparent',
                      flex: 1,
                      marginHorizontal: 10,
                      paddingTop: 10,
                    }}
                  >
                    <DynamicSelectDropdown
                      data={markups}
                      onSelect={(selectedItem, index) => {
                        const label = selectedItem.value;
                        handleEmailAddressChange(item.number, idx, label);
                      }}
                      selected={item.label}
                      select="name"
                      label={'Marcador'}
                      emptyTitle={'Selecione um marcador'}
                    />
                  </View>

                  <TouchableOpacity onPress={() => removeEmail(idx)}>
                    <Text>Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

          <View style={styles.sectionPhone}>
            <TouchableOpacity onPress={addNewEmail}>
              <Text>+ Adicionar novo e-mail</Text>
            </TouchableOpacity>
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
                  style={{ marginRight: 5 }}
                />
              }
              keyboardType="email-address"
              multiline={true}
            />
          </View>

          <View style={styles.section}>
            <DynamicSelectDropdown
              data={categories}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
                setSelectedCategory(selectedItem);
              }}
              selected={selectedCategory}
              select="name"
              label={'Categoria de números'}
              emptyTitle={'Selecione uma categoria'}
            />
          </View>
          <View style={styles.section}>
            <DynamicSelectDropdown
              data={states}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
                setSelectedState(selectedItem);
              }}
              selected={selectedState}
              select="name"
              label={'Estado do Brasil'}
              emptyTitle={'Selecione um estado'}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.switchContainer}>
              <View style={styles.switchLabel}>
                <Icon
                  size={20}
                  name="star"
                  color={phone.favored ? activeColors.info : activeColors.light}
                />
                <Text
                  style={[
                    styles.swithText,
                    { fontWeight: phone.favored ? 'bold' : 400 },
                  ]}
                >
                  {!phone.favored ? 'Marcar como favorito' : 'Favorito'}
                </Text>
              </View>
              <View style={styles.swithToggle}>
                <Switch
                  style={{ marginLeft: 10 }}
                  value={phone.favored ? true : false}
                  onValueChange={(e) => handleChange(e)}
                  thumbColor={
                    theme.mode !== 'dark'
                      ? activeColors.secondary
                      : activeColors.tertiary
                  }
                  // thumbColor={isDarkTheme ? '#fff' : activeColors.tertiary}
                  ios_backgroundColor={activeColors.primary}
                  trackColor={{
                    false: activeColors.primary,
                    true: activeColors.accent,
                  }}
                ></Switch>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <CustomButton
            label={'ATUALIZAR'}
            onPress={handleConfirm}
            type={'success'}
            disabled={!enabled}
            loading={loading}
            style={{
              borderRadius: 10,
            }}
            icon={
              <Icon
                name="file-refresh-outline"
                size={28}
                color={activeColors.primary}
                style={{ marginRight: 5 }}
              />
            }
          />
        </View>
        <Modal
          isVisible={isModalVisible}
          deviceWidth={deviceWidth}
          deviceHeight={deviceHeight}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.titleText}>Remover contato</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.subtitleText}>
                Tem certeza que deseja remover o contato{'\n'}
              </Text>
              <Text style={styles.descriptionText}>
                {phone.number}
                {' - '}
                {phone.title}?
              </Text>
              <Text style={styles.descriptionTiny}>
                Esta ação é irreversível!
              </Text>
            </View>
            <View style={styles.modalFooter}>
              <CustomButton
                label="Cancelar"
                onPress={confirmCancel}
                type={'danger'}
                loading={loading}
              />
              <CustomButton
                label="Confirmar"
                onPress={confirmRemove}
                type={'success'}
                loading={loading}
              />
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const createStyles = (colors) => {
  const styles = StyleSheet.create({
    body: {
      paddingVertical: 1,
      flex: 1,
      alignContent: 'flex-start',
    },
    sectionPhone: {
      flexDirection: 'column',
      marginHorizontal: 10,
      borderWidth: 1,
      borderColor: `${colors.accent}65`,
      borderRadius: 10,
      padding: 10,
      marginVertical: 10,
    },
    phone: {},
    section: {
      backgroundColor: 'transparent',
      marginHorizontal: 20,
      marginVertical: 10,
    },
    footer: { marginBottom: 40, marginHorizontal: 20, marginTop: 20 },
    modalContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      padding: 20,
      width: '80%',
    },
    modalHeader: {
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.secondary,
      paddingBottom: 10,
    },
    titleText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    modalBody: {
      marginBottom: 20,
    },
    subtitleText: {
      fontSize: 16,
      color: colors.text,
    },
    descriptionText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: 'bold',
    },
    descriptionTiny: {
      paddingVertical: 20,
      fontSize: 12,
      color: colors.danger,
      fontWeight: 'bold',
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    switchContainer: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    switchLabel: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    swithText: {
      fontSize: 18,
      color: colors.accent,
      paddingLeft: 9,
    },
    swithTextOn: {
      fontWeight: 'bold',
    },
    swithToggle: {},
  });
  return styles;
};

export default DetailContact;
