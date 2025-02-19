import React, { useContext, useEffect, useState } from 'react';
import { colors } from '../config/theme';
import { ThemeContext } from '../context/ThemeContext';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Alert, // Importe o Alert do React Native
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CustomButton from '../components/Buttons/CustomButton';
import InputField from '../components/Inputs/InputField';
import VersionText from '../components/Texts/VersionText';
import { UserContext } from '../context/UserContext';

const LoginScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const { user, setUser } = useContext(UserContext);
  const [usr, setUsr] = useState({
    email: 'cesar.balzer@codesign.ag',
    password: 'Secret.321',
  });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  // useEffect(() => {
  //   (async () => {
  //     const _usr = await getUser();
  //     console.log('_USR => ', _usr);
  //     if (_usr) setUsr(_usr);
  //   })();
  // }, []);

  const handleSubmit = async () => {
    setLoading(true);
    if (!usr.email || !usr.password) {
      setValidationError('Preencha os campos corretamente!');
      setLoading(false);
      return;
    }
    setUser({ ...user, logged: true });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={styles.containerImage}>
          <Image source={require('../images/login.png')} style={styles.image} />
        </View>

        <View style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.title}>Login</Text>
          </View>
          <View style={styles.section}>
            <InputField
              label={'E-mail'}
              value={usr?.email}
              onChange={(text) => setUsr({ ...usr, email: text })}
              inputType="email"
              icon={
                <Icon
                  name="email"
                  size={20}
                  color={activeColors.tertiary}
                  style={{ marginRight: 5 }}
                />
              }
              keyboardType="email-address"
              error={validationError && !usr.email}
            />
          </View>
          <View style={styles.section}>
            <InputField
              label={'Senha'}
              value={usr?.password}
              onChange={(text) => setUsr({ ...usr, password: text })}
              inputType="password"
              fieldButtonLabel={'Forgot?'}
              fieldButtonFunction={() => {}}
              icon={
                <Icon
                  name="lock-outline"
                  size={20}
                  color={activeColors.tertiary}
                  style={{ marginRight: 5 }}
                />
              }
              error={validationError && !usr.password}
            />
          </View>
          {validationError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{validationError}</Text>
            </View>
          ) : null}
          <View style={styles.section}>
            <CustomButton
              label={'Login'}
              onPress={handleSubmit}
              disabled={loading}
              loading={loading}
            />
          </View>

          <View style={styles.section}>
            <Text
              style={{
                textAlign: 'center',
                color: activeColors.tint,
                marginBottom: 30,
              }}
            >
              Or, login with ...
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 30,
            }}
          >
            <TouchableOpacity
              onPress={() => {}}
              style={{
                backgroundColor: activeColors.secondary,
                borderRadius: 10,
                paddingHorizontal: 30,
                paddingVertical: 10,
              }}
            >
              <Icon name="google" size={24} color={activeColors.danger} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                backgroundColor: activeColors.secondary,
                borderRadius: 10,
                paddingHorizontal: 30,
                paddingVertical: 10,
              }}
            >
              <Icon name="facebook" size={24} color={activeColors.info} />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 30,
            }}
          >
            <Text style={{ color: activeColors.tint }}>New to the app? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{ color: activeColors.accent, fontWeight: '700' }}>
                {' '}
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <VersionText />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (colors) => {
  const styles = StyleSheet.create({
    safeContainer: {
      backgroundColor: colors.primary,
      flex: 1,
      justifyContent: 'space-between',
    },
    containerImage: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      marginTop: 10,
      height: 150,
      width: 130,
      transform: [{ rotate: '-5deg' }],
    },
    container: { paddingHorizontal: 50, flex: 2 },
    section: {
      paddingVertical: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: '500',
      color: colors.tint,
      textAlign: 'center',
    },
    errorContainer: {
      alignItems: 'center',
      marginBottom: 10,
    },
    errorText: {
      color: colors.danger,
      fontSize: 14,
    },
  });
  return styles;
};

export default LoginScreen;
