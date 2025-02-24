import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import {
  addShortcutToScreen,
  addDirectCallShortcut,
} from 'react-native-shortcut-custom';
import FavoredConfirmModal from '../Modals/FavoredConfirmModal';
import { isFavorite, toggleFavorite } from '../../services/FavoriteService';
import PermissionService from '../../services/PermissionService';

const HeaderPhoneActions = ({ data, user }) => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);

  const [phone, setPhone] = useState(data);
  const [favorite, setFavorite] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (user?.id && data?.id) {
      fetchData();
    }
  }, [user?.id, data?.id, favorite]);

  useEffect(() => {
    PermissionService.requestPermissions();
  }, []);

  const fetchData = async () => {
    try {
      const fetchFavorite = await isFavorite(user.id, data.id);
      setFavorite(fetchFavorite);
    } catch (error) {
      console.log('Erro ao buscar favorito:', error);
      Alert.alert('Erro', 'Não foi possível carregar os favoritos.');
    }
  };

  const toggleModal = () => setModalVisible((prev) => !prev);

  const confirmSetFavored = async () => {
    try {
      const newState = await toggleFavorite(phone.id);
      setFavorite((prev) => (newState !== null ? newState : prev));
    } catch (error) {
      console.log('Erro ao sincronizar favorito:', error);
    }
    toggleModal();
  };

  const createPhoneShortcut = async () => {
    try {
      const shortcutId = Date.now().toString();
      const iconName =
        data.icon?.split('.').slice(0, -1).join('.') || 'default';

      const response = await addShortcutToScreen({
        id: shortcutId,
        phoneNumber: data.number,
        shortLabel: data.description || data.title,
        longLabel: data.title,
        iconFolderName: 'icons',
        iconName,
      });

      setModalVisible(false);

      setTimeout(() => {
        Alert.alert(
          'Sucesso',
          response.message || 'Atalho criado com sucesso!'
        );
      }, 300);
    } catch (error) {
      console.log('Erro ao criar atalho:', error);

      setModalVisible(false);

      setTimeout(() => {
        Alert.alert('Erro', error.message || 'Erro ao criar atalho.');
      }, 300);
    }
  };

  const handleCall = async () => {
    addDirectCallShortcut({ phoneNumber: phone.number });
  };

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.imageHeader}>
          <Image
            source={{ uri: `asset:/icons/${phone.icon || 'default.png'}` }}
            style={styles.image}
          />
        </View>
        <View style={styles.titleHeader}>
          <Text style={styles.textHeader}>{phone.title}</Text>
        </View>
        <View style={styles.containerActions}>
          <ActionButton
            styles={styles}
            onPress={createPhoneShortcut}
            icon="phone-return-outline"
            text="Criar atalho"
            color={activeColors.info}
          />
          <ActionButton
            styles={styles}
            onPress={handleCall}
            icon="phone"
            text="Ligar"
            color={activeColors.success}
          />
          <ActionButton
            styles={styles}
            onPress={toggleModal}
            icon={favorite ? 'heart' : 'heart-outline'}
            text={favorite ? 'Remover dos favoritos' : 'Favoritar'}
            color={favorite ? activeColors.danger : activeColors.text}
          />
        </View>
      </View>

      <FavoredConfirmModal
        isModalVisible={isModalVisible}
        modalTitle={favorite ? 'Remover dos favoritos' : 'Favoritar contato'}
        modalSubtitle={
          favorite
            ? 'Deseja remover o contato dos favoritos?'
            : 'Deseja marcar o contato como favorito?'
        }
        modalDescription={`${phone.title} - ${phone.number}`}
        onConfirm={confirmSetFavored}
        onCancel={toggleModal}
        isAdding={!favorite}
      />
    </View>
  );
};

const ActionButton = ({ styles, onPress, icon, text, color }) => (
  <View style={styles.containerButton}>
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.actionsHeader}>
        <Icon name={icon} size={28} color={color} />
      </View>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  </View>
);

const createStyles = (colors) =>
  StyleSheet.create({
    header: {
      backgroundColor: colors.accent,
      marginTop: 40,
    },
    imageHeader: {
      alignItems: 'center',
      elevation: 10,
    },
    image: {
      height: 180,
      width: 180,
      marginTop: -40,
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
    containerActions: {
      backgroundColor: 'transparent',
      padding: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
    containerButton: {
      flex: 1,
      minWidth: 100,
      maxWidth: 150,
      alignItems: 'center',
    },
    button: {
      alignItems: 'center',
    },
    actionsHeader: {
      width: 75,
      height: 75,
      backgroundColor: colors.primary,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 5,
    },
    buttonText: {
      color: colors.secondary,
      fontSize: 14,
      textAlign: 'center',
    },
  });

export default HeaderPhoneActions;
