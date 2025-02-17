import React, { useState, useContext, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import Modal from 'react-native-modal';
import CustomButton from '../components/Buttons/CustomButton';
import HeaderDetailContact from './HeaderDetailContact';
import Contacts from 'react-native-contacts';
import { colors } from '../config/theme';
import {
  addDirectCallShortcut,
  addShortcutToScreen,
} from 'react-native-shortcut-custom';

const DetailContact = ({ route }) => {
  const { params } = route.params || {};
  const data = params || {};
  console.log('DATA => ', data);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigation();
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [contact, setContact] = useState(data);
  const [modalOptions, setModalOptions] = useState({ visible: false });

  useEffect(() => {
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

  const showModal = (title, subtitle, confirmAction) => {
    setModalOptions({
      titleText: title,
      subtitleText: subtitle,
      descriptionTiny: '* ATENÇÃO, Esta ação é irreversível!!',
      cancel: () => setModalOptions({ visible: false }),
      confirm: confirmAction,
      visible: true,
    });
  };

  const renderSection = (icon, title, content) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name={icon} size={24} color={activeColors.tertiary} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionContent}>{content || 'Não disponível'}</Text>
    </View>
  );

  const renderSectionWithRemoval = (
    icon,
    title,
    attributeName,
    items,
    labelKey = 'label',
    valueKey = 'number'
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name={icon} size={24} color={activeColors.tertiary} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {items.length > 0 ? (
        items.map((item, idx) => (
          <View key={idx} style={styles.sectionItem}>
            <Text style={styles.sectionContent}>
              {item[valueKey]} {item[labelKey] ? `(${item[labelKey]})` : ''}
            </Text>
            {/* <TouchableOpacity
              onPress={() => handleRemoveAttribute(idx, attributeName, title)}
            >
              <Icon name="delete" size={24} color={activeColors.danger} />
            </TouchableOpacity> */}
          </View>
        ))
      ) : (
        <Text style={styles.sectionContent}>
          Nenhum {title.toLowerCase()} disponível
        </Text>
      )}
    </View>
  );

  const handleRemoveAttribute = (idx, attributeName, attributeLabel) => {
    showModal(
      `Remover ${attributeLabel}?`,
      `Tem certeza que deseja remover este ${attributeLabel.toLowerCase()}?`,
      () => confirmRemoveAttribute(idx, attributeName)
    );
  };

  const validateContactData = (contact) => {
    if (!contact.recordID || !contact.rawContactId) {
      throw new Error('Contatos inválidos: recordID ou rawContactId ausente.');
    }
    if (!contact.phoneNumbers || contact.phoneNumbers.length === 0) {
      console.warn(
        'Nenhum número de telefone encontrado. O contato será salvo sem números.'
      );
    }
    return true;
  };

  const confirmRemoveAttribute = async (idx, attributeName) => {
    try {
      const freshContact = await Contacts.getContactById(contact.recordID);
      validateContactData(freshContact);

      const updatedAttributes = freshContact[attributeName].filter(
        (_, index) => index !== idx
      );

      freshContact[attributeName] = updatedAttributes;

      await Contacts.updateContact(freshContact);
      setContact(freshContact);
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
    } finally {
      setModalOptions({ visible: false });
    }
  };

  const createDirectCallShortcut = async (number) => {
    try {
      const result = await addDirectCallShortcut({
        phoneNumber: '190',
      });
      console.log(result.message);
    } catch (error) {
      console.error('Failed to create direct call shortcut:', error);
    }
  };

  const checkAndRequestPermissions = async () => {
    if (Platform.OS !== 'android') return true;

    const permissions = [
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
      'com.android.launcher.permission.INSTALL_SHORTCUT', // CREATE_SHORTCUT pode ser substituído por essa string específica
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

    try {
      const shortcutId = Date.now().toString();

      // Adiciona o atalho
      const result = await addShortcutToScreen({
        id: shortcutId,
        phoneNumber: data.phoneNumbers[0].number,
        shortLabel: data.familyName,
        longLabel: data.givenName,
        iconFolderName: 'icons',
        iconName: 'default',
      });

      setModalVisible(false);
      Alert.alert('Sucesso', 'Atalho criado com sucesso!');
      console.log('RESULT => ', result);
    } catch (error) {
      console.log('Erro ao criar atalho:', error);
      Alert.alert('Erro', 'Erro ao criar atalho.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <HeaderDetailContact
        phone={contact}
        onEdit={async () => {
          console.log('CONTACT => ', contact);
          const response = await Contacts.openExistingContact(contact);
          console.log('RESPONSE => ', response);
          if (response) {
            await Contacts.updateContact(response);
            setContact(response);
          }
        }}
        onRemove={() =>
          showModal(
            'Remover contato',
            `Tem certeza que deseja remover o contato ${contact.displayName}?`,
            async () => {
              await Contacts.deleteContact(contact);
              navigate.goBack();
            }
          )
        }
        onCall={createDirectCallShortcut}
        onShortcut={createPhoneShortcut}
      />
      {renderSection(
        'account',
        'Nome Completo',
        `${contact.prefix || ''} ${contact.givenName || ''} ${contact.middleName || ''} ${contact.familyName || ''} ${contact.suffix || ''}`.trim()
      )}
      {renderSectionWithRemoval(
        'phone-outline',
        'Telefones',
        'phoneNumbers',
        contact.phoneNumbers || [],
        'label',
        'number'
      )}
      {renderSectionWithRemoval(
        'map-marker-outline',
        'Endereços',
        'postalAddresses',
        contact.postalAddresses || [],
        'label',
        'formattedAddress'
      )}
      {renderSectionWithRemoval(
        'email-outline',
        'E-mails',
        'emailAddresses',
        contact.emailAddresses || [],
        'label',
        'email'
      )}
      {renderSection('briefcase-outline', 'Empresa', contact.company)}
      {renderSection('domain', 'Departamento', contact.department)}
      {renderSection('card-account-details-outline', 'Cargo', contact.jobTitle)}
      {renderSection('note-outline', 'Notas', contact.note)}
      {renderSectionWithRemoval(
        'web',
        'Sites',
        'urlAddresses',
        contact.urlAddresses || [],
        'label',
        'url'
      )}
      {renderSectionWithRemoval(
        'message-text-outline',
        'IM Addresses',
        'imAddresses',
        contact.imAddresses || [],
        'label',
        'value'
      )}
      {renderSection(
        'star-outline',
        'Favorito',
        contact.isStarred ? 'Sim' : 'Não'
      )}

      <Modal isVisible={modalOptions.visible}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.titleText}>{modalOptions.titleText}</Text>
          </View>
          <Text style={styles.descriptionText}>
            {modalOptions.subtitleText}
          </Text>
          <Text style={styles.descriptionTiny}>
            {modalOptions.descriptionTiny}
          </Text>
          <View style={styles.modalFooter}>
            <CustomButton
              label="Cancelar"
              onPress={modalOptions.cancel}
              type={'danger'}
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
              onPress={modalOptions.confirm}
              type={'success'}
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
    </ScrollView>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    section: {
      padding: 15,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginLeft: 10,
      color: colors.text,
    },
    sectionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 5,
    },
    sectionContent: {
      fontSize: 16,
      color: colors.textSecondary,
      marginVertical: 2,
    },
    modalContent: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      padding: 20,
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
    subtitleText: {
      fontSize: 16,
      color: colors.text,
    },
    descriptionText: {
      fontSize: 16,
      color: colors.text,
      // fontWeight: 'bold',
      textAlign: 'center',
    },
    descriptionTiny: {
      marginTop: 20,
      marginBottom: 30,
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
  });

export default DetailContact;
