import React, { useContext, useEffect, useState } from 'react';
import { Appearance, StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { colors } from './config/theme';
import Main from './routers/Main';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import StatesScreen from './screens/StatesScreen';
// import WelcomeScreen from './screens/WelcomeScreen';
import { UserContext } from './context/UserContext';
import AppIntro from './components/Intro/AppIntro';
import { createStacks } from './stacks/screens';

// const Stack = createStackNavigator();
const MainStack = createStackNavigator();

const { renderIntroScreen,renderStatesScreen,renderMainScreen } = createStacks(MainStack);

const App = () => {
  const [theme, setTheme] = useState({ mode: Appearance.getColorScheme() });
  const { user, getUser } = useContext(UserContext);
  console.log('USER => ', user);
  const [initialRouteName, setInitialRouteName] = useState('');
  const { welcome, state_id } = user || {};

  useEffect(() => {
    // (async () => {
    //   console.log('USER => ', user);
    //   let newUser = user;
    //   if (!user) {
    //     const usr = await getUser();
    //     newUser = usr;
    //     console.log('USR => ', usr);
    //   }
    //   console.log('NEWUSER => ', newUser);
    //   if (!newUser.welcome) {
    //     console.log('INTRO => ', newUser);
    //     handleInitialRoute('Intro');
    //   }
    //   if (!newUser.state_id) {
    //     console.log('STATE => ', newUser);
    //     handleInitialRoute('States');
    //   }
    //   console.log('MAIN => ', newUser);
    //   handleInitialRoute('Main', user);
    // })();
  }, []);

  const handleInitialRoute = (screen) => {
    setTimeout(() => {
      setInitialRouteName(screen);
    }, 300);
  };

  let activeColors = colors[theme.mode];

  const screenOptions = {
    headerBackTitle: 'Voltar',
    headerBackTitleStyle: {
      fontWeight: '600',
    },
    headerStyle: {
      backgroundColor: activeColors.accent,
      elevation: 0,
      shadowColor: 'transparent',
      shadowRadius: 0,
      shadowOffset: {
        height: 0,
      },
    },
    headerTitleStyle: {
      fontSize: 22,
      color: activeColors.secondary,
    },
    headerTintColor: activeColors.accent,
    headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
    cardStyleInterpolator:
      Platform.OS == 'android'
        ? CardStyleInterpolators.forRevealFromBottomAndroid
        : CardStyleInterpolators.forHorizontalIOS,
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle={theme.mode !== 'dark' ? 'dark-content' : 'light-content'}
        backgroundColor={activeColors.secondary}
      />
      <NavigationContainer>
        <MainStack.Navigator
          initialRouteName={initialRouteName}
          screenOptions={screenOptions}
        >
          {!welcome && renderIntroScreen()}
          {!state_id && renderStatesScreen()}
          {renderMainScreen()}

        </MainStack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default App;
