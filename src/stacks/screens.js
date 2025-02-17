import React from 'react';
import AppIntro from '../components/Intro/AppIntro';
import StatesScreen from '../screens/StatesScreen';
import Main from '../routers/Main';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DetailContact from '../screens/DetailContact';

export const createStacks = (MainStack) => {
  return {
    renderIntroScreen: () => {
      return (
        <MainStack.Screen
          name="Intro"
          component={AppIntro}
          options={{
            headerShown: false,
          }}
        />
      );
    },
    renderStatesScreen: () => {
      return (
        <MainStack.Screen
          name="States"
          component={StatesScreen}
          options={{
            headerShown: true,
            title: 'Estados',
          }}
        />
      );
    },
    renderMainScreen: () => {
      return (
        <MainStack.Group>
          <MainStack.Screen
            name="Main"
            component={Main}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            options={{ headerShown: true, title: '' }}
            name="Login"
            component={LoginScreen}
          />
          <MainStack.Screen
            options={{ headerShown: true, title: '' }}
            name="Register"
            component={RegisterScreen}
          />
          <MainStack.Screen
            options={{ headerShown: true, title: 'Estados' }}
            name="States"
            component={StatesScreen}
          />
          <MainStack.Screen
            options={{
              headerShown: true,
              headerBackTitle: 'Voltar',
              headerBackTitleStyle: { color: '#fff' },
              title: '',
            }}
            name="DetailContact"
            component={DetailContact}
          />
        </MainStack.Group>
      );
    },
  };
};
