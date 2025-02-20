import React, { useContext, useState, useRef } from 'react';
import { colors } from '../config/theme';
import { ThemeContext } from '../context/ThemeContext';
import { View, ScrollView, RefreshControl } from 'react-native';
import { StyleSheet } from 'react-native';
import StatesTabSection from '../components/Sections/StatesTabSection';

const HomeScreens = ({ navigation, route }) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return <StatesTabSection />;
};
const createStyles = (colors) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    sectionTitle: {
      marginTop: 25,
      marginLeft: 25,
      marginBottom: 25,
    },
  });
  return styles;
};

export default HomeScreens;
