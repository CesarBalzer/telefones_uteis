import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../config/theme';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';
import EmptyData from '../assets/svgs/EmptyData';

const EmptyScreen = ({ navigation, route }) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'gray',
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: activeColors.primary,
        }}
      >
        <EmptyData />
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: activeColors.accent,
            marginBottom: 20,
          }}
        >
          Sem favoritos no momento
        </Text>
      </View>
    </View>
  );
};

export default EmptyScreen;
