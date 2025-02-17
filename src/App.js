import React, { useContext, useEffect, useState } from 'react';
import { Appearance, Platform, StatusBar, View } from 'react-native';
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
import LoadingIndicator from './components/Modals/LoadingIndicator';
import SkelletonIntro from './skeletons/SkelletonIntro';
import SkelletonState from './skeletons/SkelletonState';

// const Stack = createStackNavigator();
const MainStack = createStackNavigator();
const { renderIntroScreen, renderStatesScreen, renderMainScreen } =
  createStacks(MainStack);

const App = () => {
  const [theme, setTheme] = useState({ mode: Appearance.getColorScheme() });
  // console.log('THEME => ', theme);
  const { user } = useContext(UserContext);
  console.log('APP - USER => ', Platform.OS, user, theme);
  const [initialRouteName, setInitialRouteName] = useState('');
  const { welcome, state_id } = user || {};
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [user]);

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

  if (loading) {
    if (!user?.welcome) {
      return <SkelletonIntro />;
    }
    if (!user?.state_id) {
      return <SkelletonState />;
    }
  }

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
          {user && !user?.welcome && renderIntroScreen()}

          {user && !user?.state_id ? renderStatesScreen() : renderMainScreen()}
        </MainStack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default App;
