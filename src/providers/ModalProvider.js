import React, { createContext, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
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
      <Modal
        visible={isOpen}
        animationType="fade"
        presentationStyle="formSheet"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.content}>
              <View style={styles.contentHeader}>
                <Text style={styles.contentTitle}>{modalTitle}</Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeIcon}>
                  <Text style={styles.closeIconText}>
                    <Icon
                      name="close"
                      size={30}
                      color={activeColors.text}
                      style={{ marginRight: 5 }}
                    />
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.contentBody}>{modalContent}</View>
              <View style={styles.contentFooter}></View>
            </View>
          </View>
        </View>
      </Modal>
    </ModalContext.Provider>
  );
};

const createStyles = (colors) => {
  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      flex: 1,
      borderRadius: 10,
    },
    content: {
      flex: 1,
      justifyContent: 'space-between',
    },
    contentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.primary,
    },
    contentTitle: {
      fontSize: 22,

      color: colors.text,
      marginHorizontal: 20,
      marginTop: 20,
    },
    contentBody: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    contentFooter: {
      backgroundColor: 'transparent',
    },
    closeIcon: {
      padding: 10,
      marginTop: 10,
    },
    closeIconText: {
      fontSize: 18,
      color: colors.text,
    },
    closeButton: {
      fontSize: 16,
      color: colors.text,
      marginTop: 20,
    },
    closeText: {
      fontSize: 18,
      color: colors.text,
    },
  });
};

export default ModalProvider;
