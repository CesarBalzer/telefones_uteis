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
  let activeColors = colors[theme.mode];
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

  const FavoredIcon = () => {
    return (
      <View
        style={{
          position: 'absolute',
          backgroundColor: activeColors.info,
          width: 15,
          height: 15,
          justifyContent: 'center',
          alignItems: 'center',
          borderTopLeftRadius: 10,
          borderBottomEndRadius: 10,
        }}
      >
        <Icon size={10} name="star" color={activeColors.light} />
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.containerItem}
      onPress={() => handleEdit(data)}
    >
      <View style={styles.container}>
        <>{data && data.favored === 1 ? <FavoredIcon /> : ''}</>
        <View style={styles.containerImage}>
          {data?.icon ? (
            <Image
              source={{ uri: `asset:/icons/${data.icon}` }}
              style={styles.image}
            />
          ) : (
            <Image
              source={{ uri: `asset:/icons/default.png` }}
              style={styles.image}
            />
          )}
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
            {data && data.ddd ? `( ${data.ddd} ) ${data.number}` : data.number}
          </Text>
          <Text
            style={[styles.description, { color: activeColors.tertiary }]}
            numberOfLines={2}
          >
            {data.description}
          </Text>
        </View>
        <View style={styles.containerActions}>
          <TouchableOpacity onPress={handleCall}>
            <View style={styles.buttonCall}>
              <Icon name={'phone'} size={36} color={activeColors.success} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors) => {
  const styles = StyleSheet.create({
    containerItem: { backgroundColor: colors.primary },
    container: {
      backgroundColor: colors.secondary,
      borderRadius: 10,
      flexDirection: 'row',
      marginHorizontal: 10,
      marginVertical: 5,
    },
    containerImage: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 50,
      height: 50,
      marginLeft: 10,
    },
    containerActions: {
      flexDirection: 'row',
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer: {
      padding: 10,
      justifyContent: 'center',
      flex: 1,
    },
    title: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 3,
    },
    number: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 5,
      color: colors,
    },
    description: {
      fontSize: 12,
      color: 'red',
      flexWrap: 'wrap',
      overflow: 'hidden',
      lineHeight: 12,
      maxHeight: 36,
    },
    buttonCall: {
      width: 50,
      height: 50,
      backgroundColor: colors.primary,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 5,
    },
  });
  return styles;
};

export default LocalComponent;
