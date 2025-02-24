import { Alert, PermissionsAndroid, Linking, Platform } from 'react-native';

const PERMISSIONS = [
  PermissionsAndroid.PERMISSIONS.CALL_PHONE,
  PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
  'com.android.launcher.permission.INSTALL_SHORTCUT',
];

const requestPermissions = async () => {
  if (Platform.OS !== 'android') return true;

  try {
    const results = await PermissionsAndroid.requestMultiple(PERMISSIONS);
    const allGranted = PERMISSIONS.every(
      (perm) => results[perm] === PermissionsAndroid.RESULTS.GRANTED
    );

    if (!allGranted) {
      showPermissionDeniedAlert();
    }

    return allGranted;
  } catch (error) {
    console.log('Erro ao verificar permissões:', error);
    return false;
  }
};

const showPermissionDeniedAlert = () => {
  Alert.alert(
    'Permissão negada!',
    'A permissão é necessária para esta funcionalidade.',
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Abrir Configurações', onPress: openAppSettings },
    ]
  );
};

const openAppSettings = () => {
  Linking.openSettings().catch(() => {
    Alert.alert('Erro', 'Não foi possível abrir as configurações.');
  });
};

export default {
  requestPermissions,
  openAppSettings,
};
