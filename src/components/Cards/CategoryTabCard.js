import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CategoryTabCard = ({ title, icon, onPress, isActive }) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors, isActive);

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isActive
              ? activeColors.accent
              : activeColors.secondary,
            elevation: isActive ? 5 : 0,
          },
        ]}
      >
        <Icon
          name={'star'}
          size={24}
          color={!isActive ? activeColors.accent : activeColors.secondary}
        />
        <Text
          style={[
            styles.text,
            { color: isActive ? activeColors.primary : activeColors.text },
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const createStyles = (colors, isActive) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#FFFFFF',
      borderRadius: 50,
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginHorizontal: 10,
      marginVertical: 5,
      borderColor: colors.accent,
    },
    activeContainer: {
      backgroundColor: '#FFA500',
    },
    contentContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    activeTitle: {
      color: '#FFFFFF',
    },
  });

  return styles;
};

export default CategoryTabCard;
