import React, { useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserContext } from './context/UserContext';
import SplashScreen from './components/Splashs/SplashScreen';
import AppNavigation from './navigation/AppNavigation';

const App = () => {
  const [theme, setTheme] = useState({ mode: Appearance.getColorScheme() });
  const { user, resetUser } = useContext(UserContext);
  console.log('USER => ', user);
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      // setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const initialRoute = () => {
    if (user && user.welcome) return 'Home';
    if (isFirstTime) return 'Intro';

    return 'Login';
  };

  if (isLoading)
    return <SplashScreen onFinish={() =>  setIsLoading(false)} />;
  return <AppNavigation initialRoute={initialRoute} />;
};

export default App;
