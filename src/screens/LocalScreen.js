import React, { useContext, useState, useRef } from 'react';
import { colors } from '../config/theme';
import { ThemeContext } from '../context/ThemeContext';
import { View, ScrollView, RefreshControl } from 'react-native';
import { StyleSheet } from 'react-native';
import LocalTabSection from '../components/Sections/LocalTabSection';
import Bottomsheet from '../components/Sheets/Bottomsheet';

const MyLocalScreen = ({ route, navigation }) => {
  // console.log('ROUTE MY LOCAL SCREEN=> ', route);
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ flexGrow: 1 }}>
        <LocalTabSection route={route} />
        {/* <Bottomsheet /> */}
      </View>
    </ScrollView>
  );
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

export default MyLocalScreen;
