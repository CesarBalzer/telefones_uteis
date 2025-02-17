import React, { useState, useContext, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import Modal from 'react-native-modal';
import CustomButton from '../components/Buttons/CustomButton';
import HeaderDetailContact from './HeaderDetailContact';
import { deleteContact, openExistingContact, updateContact } from 'react-native-contacts';
import { colors } from '../config/theme';

const DetailContact = ({ route }) => {
  const { params } = route.params || {};
  const data = params || {};
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="chevron-left" size={28} color={activeColors.primary} />
            <Text style={{ color: activeColors.primary }}>Voltar</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, []);

  const handleRemoveContact = async () => {
    try {
      await deleteContact(contact);
      navigate.goBack();
    } catch (error) {
      console.log('Error deleting contact:', error);
    }
  };

  const handleEditContact = async () => {
    try {
      const response = await openExistingContact(contact);
      if (response) {
        await updateContact(response);
        setContact(response);
      }
    } catch (error) {
      console.log('Error editing contact:', error);
    }
  };

  const renderSection = (icon, title, content) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name={icon} size={24} color={activeColors.tertiary} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {content.length > 0 ? (
        content.map((item, idx) => (
          <Text key={idx} style={styles.sectionContent}>
            {item}
          </Text>
        ))
      ) : (
        <Text style={styles.sectionContent}>Não disponível</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <HeaderDetailContact
        phone={contact}
        onEdit={handleEditContact}
        onRemove={handleRemoveContact}
      />

      {renderSection('account', 'Nome Completo', [
        `${contact.givenName || ''} ${contact.middleName || ''} ${contact.familyName || ''}`.trim(),
      ])}
      {renderSection('briefcase-outline', 'Empresa', [contact.company || 'Não disponível'])}
      {renderSection('card-account-details-outline', 'Cargo', [contact.jobTitle || 'Não disponível'])}
      {renderSection('email-outline', 'E-mails', contact.emailAddresses?.map(e => e.email) || [])}
      {renderSection('phone-outline', 'Telefones', contact.phoneNumbers?.map(p => p.number) || [])}
      {renderSection('web', 'URLs', contact.urlAddresses?.map(u => u.url) || [])}
      {renderSection('note-outline', 'Notas', [contact.note || 'Sem notas'])}

      <Modal isVisible={modalOptions.visible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirmação</Text>
          <Text style={styles.modalMessage}>Tem certeza que deseja excluir este contato?</Text>
          <View style={styles.modalActions}>
            <CustomButton label="Cancelar" onPress={() => setModalOptions({ visible: false })} />
            <CustomButton label="Confirmar" onPress={handleRemoveContact} type="danger" />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const createStyles = colors =>
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
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    modalMessage: {
      fontSize: 16,
      color: colors.text,
      marginVertical: 10,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
    },
  });

export default DetailContact;
