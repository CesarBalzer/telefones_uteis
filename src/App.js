import React, { useContext, useEffect, useState } from 'react';
import { Appearance, StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from './config/theme';
import { UserContext } from './context/UserContext';
import CreateStacks from './stacks/screens';
import SkelletonIntro from './skeletons/SkelletonIntro';
import SkelletonState from './skeletons/SkelletonState';

const App = () => {
  const [theme] = useState({ mode: Appearance.getColorScheme() });
  let activeColors = colors[theme.mode];
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  // console.log('USER => ', user);

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
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle={theme.mode !== 'dark' ? 'dark-content' : 'light-content'}
        backgroundColor={activeColors.secondary}
      />
      <NavigationContainer>
        <CreateStacks />
      </NavigationContainer>
    </View>
  );
};

export default App;
