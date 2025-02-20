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
  Alert,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../Buttons/CustomButton';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import InputField from '../Inputs/InputField';
// import DataSets from '../../data/DataSets';
import DynamicSelectDropdown from '../Selects/DynamicSelectDropdown';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import {
  addShortcutToScreen,
  getAssetIcons,
  addDirectCallShortcut,
} from 'react-native-shortcut-custom';
import { getCategories } from '../../db/CategoryService';
import { getStates } from '../../db/StateService';

const PhoneModal = ({ data, onConfirm }) => {
  console.log('PHONE MODAL => ', data);
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [phone, setPhone] = useState(data);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [imagePaths, setImagePaths] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight =
    Platform.OS === 'ios'
      ? Dimensions.get('window').height
      : require('react-native-extra-dimensions-android').get(
          'REAL_WINDOW_HEIGHT'
        );
  const [isFavored, setIsFavored] = useState(data.favored);

  useEffect(() => {
    fetchIcons();
  }, []);

  useEffect(() => {
    if (JSON.stringify(phone) !== JSON.stringify(data)) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [phone]);

  // useEffect(() => {
  //   const filteredCategories = categories.filter(
  //     (item) => item.id === data.category_id
  //   );
  //   filteredCategories.length
  //     ? setSelectedCategory(filteredCategories[0])
  //     : setSelectedCategory(null);

  //   const filteredStates = states.filter((item) => item.id === data.state_id);
  //   filteredStates.length
  //     ? setSelectedState(filteredStates[0])
  //     : setSelectedState(null);
  // }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleChange = async (evt) => {
    // console.log('HANDLE CHANGE => ', evt);
    setIsFavored((prev) => !prev);
    setPhone({ ...phone, favored: !!evt ? 1 : 0 });
  };

  const handleRemove = async () => {
    const hasAllPermissions = await checkAndRequestPermissions();

    if (!hasAllPermissions) {
      return;
    }
    toggleModal();
  };

  const confirmRemove = () => {
    // console.log('CONFIRM REMOVE => ', phone);
    toggleModal();
  };

  const confirmCancel = () => {
    toggleModal();
  };

  const handleConfirm = (obj) => {
    console.log('HANDLE CONFIRM => ', obj);
    setLoading(true);
    onConfirm && onConfirm(obj);
  };

  const fetchIcons = async () => {
    try {
      const files = await getAssetIcons();
      setImagePaths(files);

      const fetchCategories = await getCategories();
      console.log('FETCH CATEGORIES => ', fetchCategories);
      setCategories(fetchCategories);

      // const fetchStates = await getStates();
      // setStates(fetchStates);
    } catch {
      Alert.alert('Erro', 'Não foi possível listar os ícones.');
    }
  };

  const checkAndRequestPermissions = async () => {
    if (Platform.OS !== 'android') return true;

    const permissions = [
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
      'com.android.launcher.permission.INSTALL_SHORTCUT',
    ];

    const messages = {
      [PermissionsAndroid.PERMISSIONS.CALL_PHONE]:
        'Precisamos da permissão para fazer chamadas através dos atalhos.',
      [PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS]:
        'Precisamos da permissão para editar seus contatos.',
      'com.android.launcher.permission.INSTALL_SHORTCUT':
        'Precisamos da permissão para criar atalhos na tela inicial.',
    };

    try {
      const results = await PermissionsAndroid.requestMultiple(permissions);
      for (const permission of permissions) {
        if (results[permission] !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permissão negada!',
            `${messages[permission]} Deseja abrir as configurações para conceder a permissão?`,
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Abrir Configurações', onPress: openAppSettings },
            ]
          );
          return false;
        }
      }

      return true;
    } catch (error) {
      console.log('Erro ao verificar permissões:', error);
      Alert.alert('Erro', 'Erro ao verificar permissões.');
      return false;
    }
  };

  const createPhoneShortcut = async () => {
    const hasAllPermissions = await checkAndRequestPermissions();

    if (!hasAllPermissions) {
      return;
    }

    console.log('CREATE PHONE SHORTCUT => ', data);

    const removeFileExtension = (filename) => {
      return filename.split('.').slice(0, -1).join('.');
    };

    try {
      const shortcutId = Date.now().toString();
      const iconName = removeFileExtension(data.icon || 'default');

      const result = await addShortcutToScreen({
        id: shortcutId,
        phoneNumber: data.number,
        shortLabel: data.description || data.title,
        longLabel: data.title,
        iconFolderName: 'icons',
        iconName: iconName,
      });

      setModalVisible(false);
      Alert.alert('Sucesso', 'Atalho criado com sucesso!');
      console.log('RESULT => ', result);
    } catch (error) {
      console.log('Erro ao criar atalho:', error);
      Alert.alert('Erro', 'Erro ao criar atalho.');
    }
  };

  const openAppSettings = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir as configurações.');
    });
  };

  const handleCall = async () => {
    const hasAllPermissions = await checkAndRequestPermissions();

    if (!hasAllPermissions) {
      return;
    }
    addDirectCallShortcut({ phoneNumber: phone.number });
  };

  return (
    <ScrollView>
      <View style={{ flex: 1, justifyContent: 'space-between', marginTop: 0 }}>
        <View style={styles.header}>
          <View style={styles.imageHeader}>
            {phone?.icon ? (
              <Image
                source={{ uri: `asset:/icons/${phone.icon}` }}
                style={styles.image}
              />
            ) : (
              <Image
                // source={require(`../../assets/icons/default.png`)}
                source={{ uri: `asset:/icons/default.png` }}
                style={styles.image}
              />
            )}
          </View>
          <View style={styles.titleHeader}>
            <Text style={styles.textHeader}>{phone.title}</Text>
          </View>
          <View
            style={{
              backgroundColor: 'transparent',
              padding: 20,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <View>
              <TouchableOpacity
                style={{ alignItems: 'center' }}
                onPress={createPhoneShortcut}
              >
                <View style={styles.actionsHeader}>
                  <Icon
                    name={'phone-return-outline'}
                    size={28}
                    color={activeColors.info}
                  />
                </View>
                <Text style={{ color: activeColors.secondary, paddingTop: 5 }}>
                  Criar atalho
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={{ alignItems: 'center' }}
                onPress={handleCall}
              >
                <View style={styles.actionsHeader}>
                  <Icon name={'phone'} size={28} color={activeColors.success} />
                </View>
                <Text style={{ color: activeColors.secondary, paddingTop: 5 }}>
                  Ligar
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={{ alignItems: 'center' }}
                onPress={handleRemove}
              >
                <View style={styles.actionsHeader}>
                  <Icon
                    name={'phone-remove'}
                    size={28}
                    color={activeColors.danger}
                  />
                </View>
                <Text style={{ color: activeColors.secondary, paddingTop: 5 }}>
                  Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.sectionPhone}>
            <View style={styles.phone}>
              <InputField
                label={'DDD'}
                keyboardType="numeric"
                onChange={(text) => setPhone({ ...phone, ddd: text })}
                // onChange={(text) => handleChange(phone.number, 'ddd', text)}
                value={phone.ddd}
                icon={
                  <Icon
                    name="earth"
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
                flex: 2,
                marginLeft: 30,
              }}
            >
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
                    style={{ marginRight: 5 }}
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
                  style={{ marginRight: 5 }}
                />
              }
              multiline={true}
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
            onPress={() => handleConfirm(phone)}
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
                style={{
                  borderRadius: 10,
                }}
                icon={
                  <Icon
                    name="close"
                    size={28}
                    color={activeColors.primary}
                    style={{ marginRight: 5 }}
                  />
                }
              />
              <CustomButton
                label="Confirmar"
                onPress={confirmRemove}
                type={'success'}
                loading={loading}
                style={{
                  borderRadius: 10,
                }}
                icon={
                  <Icon
                    name="check"
                    size={28}
                    color={activeColors.primary}
                    style={{ marginRight: 5 }}
                  />
                }
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
    header: {
      backgroundColor: colors.accent,
      borderRadius: 10,
      marginTop: 40,
      marginHorizontal: 20,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 10,
    },
    imageHeader: {
      alignItems: 'center',
      elevation: 10,
    },
    image: {
      height: 80,
      width: 80,
      marginTop: -40,
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 1,
      // backgroundColor: 'transparent',
    },
    titleHeader: {
      alignItems: 'center',
      padding: 20,
    },
    textHeader: {
      color: colors.secondary,
      fontSize: 18,
      fontWeight: '600',
    },
    actionsHeader: {
      width: 50,
      height: 50,
      backgroundColor: colors.primary,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 5,
      elevation: 10,
      shadowColor: colors.text,
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
    },
    body: { marginTop: 20, flex: 1, alignContent: 'flex-start' },
    sectionPhone: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginHorizontal: 30,
      marginVertical: 20,
    },
    phone: { flex: 1 },
    section: {
      backgroundColor: 'transparent',
      marginHorizontal: 30,
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
      // width: '80%',
    },
    modalHeader: {
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.secondary,
      paddingBottom: 10,
    },
    titleText: {
      fontSize: 22,
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
      textAlign: 'center',
    },
    descriptionTiny: {
      marginTop: 20,
      marginBottom: 10,
      fontSize: 14,
      color: colors.danger,
      fontWeight: 'bold',
      textTransform: 'uppercase',
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

export default PhoneModal;
