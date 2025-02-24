import React, { useContext, useState } from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  HeaderStyleInterpolators,
} from '@react-navigation/stack';
import AppIntro from '../components/Intro/AppIntro';
import MapStatesScreen from '../screens/MapStatesScreen';
import Main from '../routers/Main';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DetailContact from '../screens/contacts/DetailContact';
import { UserContext } from '../context/UserContext';
import { Appearance, Platform } from 'react-native';
import { colors } from '../config/theme';
import EmailVerificationScreen from '../screens/EmailVerificationScreen';

const MainStack = createStackNavigator();

const CreateStacks = () => {
  const [theme] = useState({ mode: Appearance.getColorScheme() });
  let activeColors = colors[theme.mode];
  const { user } = useContext(UserContext);
  // console.log('SCREENS  => ', user);
  if (!user) return null;

  const screenOptions = {
    headerBackTitle: 'Voltar',
    headerBackTitleStyle: { fontWeight: '600' },
    headerStyle: {
      backgroundColor: activeColors.secondary,
      elevation: 0,
      shadowColor: 'transparent',
      shadowRadius: 0,
      shadowOffset: { height: 0 },
    },
    headerTitleStyle: { fontSize: 22, color: activeColors.text },
    headerTintColor: activeColors.accent,
    headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
    cardStyleInterpolator:
      Platform.OS === 'android'
        ? CardStyleInterpolators.forRevealFromBottomAndroid
        : CardStyleInterpolators.forHorizontalIOS,
  };

  return (
    <MainStack.Navigator screenOptions={screenOptions}>
      {!user.welcome ? (
        <MainStack.Screen
          name="Intro"
          component={AppIntro}
          options={{ headerShown: false }}
        />
      ) : !user.logged ? (
        <>
          <MainStack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name="EmailVerification"
            component={EmailVerificationScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : !user.state_id ? (
        <MainStack.Screen
          name="States"
          component={MapStatesScreen}
          options={{ headerShown: true, title: 'Escolher estado' }}
        />
      ) : (
        <>
          <MainStack.Screen
            name="Main"
            component={Main}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name="DetailContact"
            component={DetailContact}
            options={{ headerShown: true, title: '' }}
          />
        </>
      )}
    </MainStack.Navigator>
  );
};

export default CreateStacks;
