import { useContext, useState } from 'react';
import { Appearance } from 'react-native';
import {
  createNativeStackNavigator,
  HeaderStyleInterpolators,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeNavigation from '../navigation/HomeNavigation';
import LoginScreen from '../screens/LoginScreen';
import { UserContext } from '../context/UserContext';
import Main from '../routers/Main';
import RegisterScreen from '../screens/RegisterScreen';
import StatesScreen from '../screens/StatesScreen';
import { colors } from '../config/theme';

const AppNavigation = ({ initialRoute }) => {
  const Stack = createNativeStackNavigator();
  const [theme, setTheme] = useState({ mode: Appearance.getColorScheme() });
  const { user, resetUser } = useContext(UserContext);

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
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={screenOptions}
        >
          <Stack.Screen
            name="Intro"
            component={AppIntro}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            options={{ headerShown: true, title: 'Estados' }}
            name="States"
            component={StatesScreen}
          />
          <Stack.Screen
            options={{ headerShown: true, title: '' }}
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            options={{ headerShown: true, title: '' }}
            name="Register"
            component={RegisterScreen}
          />
          {/* <Stack.Screen
            name="Main"
            component={Main}
            options={{ headerShown: false }}
          /> */}
          <Stack.Screen name="Home" component={HomeNavigation} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default AppNavigation;
