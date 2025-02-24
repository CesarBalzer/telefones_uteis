import React, { useContext, useEffect, useState } from 'react';
import { Appearance, StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from './config/theme';
import { UserContext } from './context/UserContext';
import CreateStacks from './stacks/screens';
import SkelletonIntro from './skeletons/SkelletonIntro';
import SkelletonState from './skeletons/SkelletonState';
import { ThemeContext } from './context/ThemeContext';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

hide = () => {
  hideNavigationBar();
};
const App = () => {
  // const [theme] = useState({ mode: Appearance.getColorScheme() });
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const changeColor = async () => {
      try {
        const isDarkMode = theme.mode === 'dark';
        const response = await changeNavigationBarColor(
          isDarkMode ? activeColors.secondary : activeColors.primary,
          !isDarkMode
        );
      } catch (error) {
        // console.log('CHANGE NAVIGATION BARCOLOR ERROR=> ', error);
      }
    };

    changeColor();
  }, [theme]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [user]);

  if (loading) {
    if (!user?.welcome) return <SkelletonIntro />;
    if (!user?.state_id) return <SkelletonState />;
  }

  return (
    <View style={{ flex: 1, backgroundColor:activeColors.primary }}>
      <StatusBar
        barStyle={theme.mode !== 'dark' ? 'dark-content' : 'light-content'}
        translucent
        animated={true}
        backgroundColor={activeColors.secondary}
      />
      <NavigationContainer>
        <CreateStacks />
      </NavigationContainer>
    </View>
  );
};

export default App;
