import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from './context/ThemeContext';
import createStyles from './styles/MainAppStyles';

const MainApp = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bem-vindo ao App!</Text>
    </View>
  );
};

export default MainApp;
