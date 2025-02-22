import React, { useState, useContext, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import HeaderDetailContact from './HeaderDetailContact';
import { colors } from '../config/theme';
import {
  addDirectCallShortcut,
  addShortcutToScreen,
} from 'react-native-shortcut-custom';
import PermissionService from '../services/PermissionService';

const DetailContact = ({ route }) => {
  const { params } = route.params || {};
  const data = params || {};
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const navigate = useNavigation();
  const [contact, setContact] = useState(data);

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

  useEffect(() => {
    PermissionService.requestPermissions();
  }, []);

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
          </View>
        ))
      ) : (
        <Text style={styles.sectionContent}>
          Nenhum {title.toLowerCase()} disponível
        </Text>
      )}
    </View>
  );

  const createDirectCallShortcut = async (number) => {
    try {
      if (!number) return;
      const result = await addDirectCallShortcut({
        phoneNumber: number,
      });
      console.log(result.message);
    } catch (error) {
      console.error('Failed to create direct call shortcut:', error);
    }
  };

  const createPhoneShortcut = async () => {
    try {
      const shortcutId = Date.now().toString();

      let contactName =
        data.givenName?.trim() ||
        data.displayName?.trim() ||
        'Contato sem Nome';

      if (!data.phoneNumbers || data.phoneNumbers.length === 0) {
        console.log('Nenhum número encontrado para o contato.');
        Alert.alert('Erro', 'O contato não possui um número de telefone.');
        return;
      }

      let phoneNumber = data.phoneNumbers[0].number.trim();
      if (!phoneNumber.startsWith('+')) {
        phoneNumber = `+55${phoneNumber.replace(/\D/g, '')}`;
      }

      let iconName = data.hasThumbnail ? data.thumbnailPath : 'default';

      console.log('Criando atalho para:', contactName, phoneNumber, iconName);

      const result = await addShortcutToScreen({
        id: shortcutId,
        phoneNumber: phoneNumber,
        shortLabel: contactName,
        longLabel: contactName,
        iconFolderName: 'icons',
        iconName: iconName,
      });

      setTimeout(() => {
        Alert.alert('Sucesso', 'Atalho criado com sucesso!');
      }, 500);
    } catch (error) {
      console.log('Erro ao criar atalho:', error);
      setTimeout(() => {
        Alert.alert('Erro', 'Erro ao criar atalho.');
      }, 500);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <HeaderDetailContact
        phone={contact}
        onCall={createDirectCallShortcut}
        onShortcut={createPhoneShortcut}
      />
      <View style={{ backgroundColor: activeColors.primary, marginTop: 20 }}>
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
        {renderSection(
          'card-account-details-outline',
          'Cargo',
          contact.jobTitle
        )}
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
      </View>
    </ScrollView>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.accent,
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
  });

export default DetailContact;
