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
  console.log('DATA => ', data);
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
  const [isFavored, setIsFavored] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const markups = [
    { id: 1, name: 'Celular', value: 'mobile' },
    { id: 2, name: 'Trabalho', value: 'work' },
    { id: 3, name: 'Casa', value: 'home' },
    { id: 4, name: 'Principal', value: 'default' },
    { id: 5, name: 'Comercial', value: 'comercial' },
    { id: 6, name: 'Outros', value: 'other' },
  ];

  // console.log('PHONE => ', phone);

  useEffect(() => {
    // console.log('PHONE EFFECT => ', phone);
    // console.log('DATA   EFFECT=> ', params);
    setEnabled(JSON.stringify(phone) !== JSON.stringify(params));
  }, [phone]);

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
    // setIsFavored((prev) => !prev);
    setPhone({ ...phone, isStarred: evt });
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
      // await updateContact(phone);
      // navigate.navigate('Main', {
      //   screen: 'Contacts',
      // });
    } catch (error) {
      console.log('ERROR => ', error);
    }
    setLoading(false);
    // onConfirm && onConfirm(obj);
  };

  const handlePhoneNumberChange = (number, index, label) => {
    // console.log('HANDLE PHONE NUMBER CHANGE => ', text, index, label);

    const updatedPhoneNumbers = [...phone.phoneNumbers];
    updatedPhoneNumbers[index].number = number//.replace(/[0-9]/g, '');
    updatedPhoneNumbers[index].label = label;
    setPhone({ ...phone, phoneNumbers: updatedPhoneNumbers });
  };

  const handleEmailAddressChange = (email, index, label) => {
    const updatedEmailAddresses = [...phone.emailAddresses];
    updatedEmailAddresses[index].email = email;
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
            value={phone?.givenName}
            // value={`${phone.givenName || ''} ${phone.familyName || ''}`}
            onChange={(text) => setPhone({ ...phone, givenName: text })}
            icon={
              <Icon
                name="text-short"
                size={20}
                color={activeColors.tertiary}
                style={{ marginRight: 5 }}
              />
            }
            style={{ width: '50%' }}
          />
          <InputField
            label={'Nome do meio'}
            value={phone?.middleName}
            // value={`${phone.givenName || ''} ${phone.familyName || ''}`}
            onChange={(text) => setPhone({ ...phone, middleName: text })}
            icon={
              <Icon
                name="text-short"
                size={20}
                color={activeColors.tertiary}
                style={{ marginRight: 5 }}
              />
            }
            style={{ width: '50%' }}
          />
          <InputField
            label={'Sobrenome'}
            value={phone?.familyName}
            // value={`${phone.givenName || ''} ${phone.familyName || ''}`}
            onChange={(text) => setPhone({ ...phone, familyName: text })}
            icon={
              <Icon
                name="text-short"
                size={20}
                color={activeColors.tertiary}
                style={{ marginRight: 5 }}
              />
            }
            style={{ width: '50%' }}
          />
          {/* <InputField
            label={'Mostrando como'}
            value={phone?.displayName}
            // value={`${phone.givenName || ''} ${phone.familyName || ''}`}
            // onChange={(text) => setPhone({ ...phone, displayName: text })}
            style={{ width: '50%' }}
          /> */}
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
                    selected={markups.find(markup => markup.value === item.label)}
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
                      selected={markups.find(markup => markup.value === item.label)}
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
              label={'Prefixo'}
              value={phone?.prefix}
              // value={`${phone.givenName || ''} ${phone.familyName || ''}`}
              onChange={(text) => setPhone({ ...phone, prefix: text })}
              icon={
                <Icon
                  name="text-short"
                  size={20}
                  color={activeColors.tertiary}
                  style={{ marginRight: 5 }}
                />
              }
              style={{ width: '50%' }}
            />
            <InputField
              label={'Nota'}
              value={phone?.note}
              // value={`${phone.givenName || ''} ${phone.familyName || ''}`}
              onChange={(text) => setPhone({ ...phone, note: text })}
              icon={
                <Icon
                  name="text-short"
                  size={20}
                  color={activeColors.tertiary}
                  style={{ marginRight: 5 }}
                />
              }
              style={{ width: '50%' }}
            />
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
            <View style={styles.switchContainer}>
              <View style={styles.switchLabel}>
                <Icon
                  size={20}
                  name="star"
                  color={
                    phone.isStarred ? activeColors.info : activeColors.light
                  }
                />
                <Text
                  style={[
                    styles.swithText,
                    { fontWeight: phone.isStarred ? 'bold' : 400 },
                  ]}
                >
                  {!phone.isStarred ? 'Marcar como favorito' : 'Favorito'}
                </Text>
              </View>
              <View style={styles.swithToggle}>
                <Switch
                  style={{ marginLeft: 10 }}
                  value={phone.isStarred}
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
