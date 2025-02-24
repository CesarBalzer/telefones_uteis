import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import { useContext } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EmptyScreen = ({ navigation, route }) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: activeColors.primary,
      }}
    >
      <Icon
        name="folder-heart-outline"
        size={180}
        color={activeColors.accent}
        style={{ marginRight: 5 }}
      />
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
  );
};

export default EmptyScreen;
