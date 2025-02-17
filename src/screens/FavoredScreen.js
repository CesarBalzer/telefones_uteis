import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../config/theme';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';
import FavoredsTabSection from '../components/Sections/FavoredsTabSection';

const FavoredScreen = ({ navigation, route }) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  return <FavoredsTabSection route={route} />;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: activeColors.primary,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: activeColors.tertiary,
          marginBottom: 20,
        }}
      >
        Sem favoritos no momento
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Local')}
        style={{
          backgroundColor: activeColors.accent,
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 5,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: activeColors.primary,
          }}
        >
          Explorar no meu local
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FavoredScreen;
