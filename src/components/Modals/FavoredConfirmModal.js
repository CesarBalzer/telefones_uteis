import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../Buttons/CustomButton';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';

const FavoredConfirmModal = ({
  isModalVisible,
  modalTitle,
  modalSubtitle,
  modalDescription,
  onConfirm,
  onCancel,
  loading,
  isAdding = true, // Define se está adicionando ou removendo dos favoritos
  themeOption = 'primary', // Alterna entre primary/accent para fundo
}) => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors, themeOption);

  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight =
    Platform.OS === 'ios'
      ? Dimensions.get('window').height
      : require('react-native-extra-dimensions-android').get(
          'REAL_WINDOW_HEIGHT'
        );

  // Escolher ícone com base na ação (Adicionar/Remover)
  const iconName = isAdding ? 'heart-plus' : 'heart-remove';
  const iconColor = isAdding ? activeColors.success : activeColors.danger;

  return (
    <Modal
      isVisible={isModalVisible}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      style={styles.modalContainer}
      animationIn="fadeIn"
      animationOut="fadeOut"
    >
      <View style={styles.modalContent}>
        <StatusBar translucent backgroundColor="transparent" />

        {/* Botão de Fechar */}
        <TouchableOpacity onPress={onCancel} style={styles.closeIcon}>
          <Icon name="close" size={30} color={activeColors.text} />
        </TouchableOpacity>

        {/* Título no topo */}
        <View style={styles.header}>
          <Text style={styles.titleText}>{modalTitle}</Text>
        </View>

        {/* Ícone grande no centro */}
        <View style={styles.iconContainer}>
          <Icon name={iconName} size={120} color={iconColor} />
        </View>

        {/* Descrição abaixo do ícone */}
        <View style={styles.textContainer}>
          <Text style={styles.subtitleText}>{modalSubtitle}</Text>
          <Text style={styles.descriptionText}>{modalDescription}</Text>
        </View>

        {/* Rodapé com Botões */}
        <View style={styles.modalFooter}>
          <CustomButton
            size="large"
            label="Cancelar"
            onPress={onCancel}
            type="danger"
            loading={loading}
            icon={<Icon name="close" size={28} color={activeColors.primary} />}
          />
          <CustomButton
            size="large"
            label="Confirmar"
            onPress={onConfirm}
            type="success"
            loading={loading}
            icon={<Icon name="check" size={28} color={activeColors.primary} />}
          />
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors, themeOption) =>
  StyleSheet.create({
    modalContainer: {
      margin: 0,
      flex: 1,
      justifyContent: 'center',
    },
    modalContent: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: colors[themeOption], // Escolher entre primary ou accent
      borderRadius: 0,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    closeIcon: {
      position: 'absolute',
      top: 15,
      right: 15,
      zIndex: 10,
    },
    header: {
      width: '100%',
      alignItems: 'center',
      paddingTop: 50,
    },
    titleText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
    },
    iconContainer: {
      flex: 1, // Ocupa o centro da tela
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: {
      flex:1,
      alignItems: 'center',
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    subtitleText: {
      fontSize: 18,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 10,
    },
    descriptionText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalFooter: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 20,
    },
  });

export default FavoredConfirmModal;
