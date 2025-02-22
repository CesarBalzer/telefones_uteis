import React, { createContext, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, StatusBar } from 'react-native';
import { colors } from '../config/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../context/ThemeContext';
import { ModalContext } from '../context/ModalContext';

const ModalProvider = ({ children }) => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);

  const [modalContent, setModalContent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const openModal = ({ title, content }) => {
    setModalTitle(title);
    setModalContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setModalTitle('');
    setModalContent(null);
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen, openModal, closeModal }}>
      {children}
      <Modal visible={isOpen} animationType="fade" transparent={false}>
        <View style={styles.modalOverlay}>
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={styles.closeIcon}>
              <Icon name="close" size={48} color={activeColors.primary} />
            </TouchableOpacity>

            <View style={styles.content}>
              <Text style={styles.contentTitle}>{modalTitle}</Text>
              <View style={styles.contentBody}>{modalContent}</View>
            </View>
          </View>
        </View>
      </Modal>
    </ModalContext.Provider>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: colors.primary,
    },
    modalContent: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: colors.accent,
      borderRadius: 0,
      padding: 0,
      margin: 0,
    },
    closeIcon: {
      position: 'absolute',
      top: 15,
      right: 15,
      zIndex: 10,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    contentTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
    },
    contentBody: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default ModalProvider;
