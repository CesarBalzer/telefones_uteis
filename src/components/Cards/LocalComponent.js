import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  addDirectCallShortcut,
  getAssetIcons,
} from 'react-native-shortcut-custom';

const LocalComponent = ({ data, onEdit }) => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [imagePaths, setImagePaths] = useState([]);

  useEffect(() => {
    fetchIcons();
  }, []);

  const fetchIcons = async () => {
    try {
      const files = await getAssetIcons();
      setImagePaths(files);
    } catch {
      console.log('Não foi possível listar os ícones.');
    }
  };

  const handleEdit = (id) => {
    onEdit && onEdit(id);
  };

  const checkAndRequestCallPermission = async () => {
    if (Platform.OS !== 'android') return true;

    const message =
      'Precisamos da permissão para fazer chamadas através dos atalhos.';

    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CALL_PHONE
      );

      if (!granted) {
        const response = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          {
            title: 'Permissão Necessária',
            message,
            buttonPositive: 'Permitir',
          }
        );

        if (response !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permissão negada!',
            `${message} Deseja abrir as configurações para conceder a permissão?`,
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
      console.log('Erro ao verificar permissão:', error);
      Alert.alert('Erro', 'Erro ao verificar permissão.');
      return false;
    }
  };

  const handleCall = async () => {
    const hasAllPermissions = await checkAndRequestCallPermission();

    if (!hasAllPermissions) {
      return;
    }
    addDirectCallShortcut({ phoneNumber: data.number });
  };

  const openAppSettings = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir as configurações.');
    });
  };

  const FavoredIcon = () => (
    <View style={styles.favoredIcon}>
      <Icon size={10} name="star" color={activeColors.text} />
    </View>
  );

  return (
    <TouchableOpacity
      style={styles.containerItem}
      onPress={() => handleEdit(data)}
      activeOpacity={0.7} // Melhora o feedback ao tocar
    >
      <View style={styles.container}>
        {data?.favored === 1 && <FavoredIcon />}
        <View style={styles.containerImage}>
          <Image
            source={{
              uri: data?.icon
                ? `asset:/icons/${data.icon}`
                : `asset:/icons/default.png`,
            }}
            style={styles.image}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text
            style={[styles.title, { color: activeColors.text }]}
            numberOfLines={1}
          >
            {data.title}
          </Text>
          <Text
            style={[styles.number, { color: activeColors.accent }]}
            numberOfLines={1}
          >
            {data?.ddd ? `( ${data.ddd} ) ${data.number}` : data.number}
          </Text>
          <Text
            style={[styles.description, { color: activeColors.tertiary }]}
            numberOfLines={2}
          >
            {data.description}
          </Text>
        </View>
        <View style={styles.containerActions}>
          <TouchableOpacity onPress={handleCall} style={styles.callButton}>
            <Icon name={'phone'} size={36} color={activeColors.success} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    containerItem: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      marginHorizontal: 10,
      marginVertical: 5,
      overflow: 'hidden',
    },
    container: {
      backgroundColor: colors.secondary,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    containerImage: {
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 10,
    },
    containerActions: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 3,
    },
    number: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 5,
    },
    description: {
      fontSize: 12,
      lineHeight: 14,
      maxHeight: 40,
      color: colors.tertiary,
    },
    favoredIcon: {
      position: 'absolute',
      top: 5,
      left: 5,
      backgroundColor: colors.danger,
      width: 15,
      height: 15,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopLeftRadius: 10,
      borderBottomEndRadius: 10,
    },
    callButton: {
      width: 50,
      height: 50,
      backgroundColor: colors.secondary,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
      shadowColor: colors.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  });

export default LocalComponent;
