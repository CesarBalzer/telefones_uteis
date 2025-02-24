import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CardItem = ({ title, onPress, isActive }) => {
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
              : `${activeColors.secondary}90`,
            elevation: isActive ? 10 : 0,
          },
        ]}
      >
        <Icon
          name={'star'}
          size={24}
          color={isActive ? activeColors.light : `${activeColors.accent}99`}
        />
        <Text
          style={{
            color: isActive ? activeColors.light : `${activeColors.accent}99`,
          }}
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
      minWidth: 130,
      backgroundColor: colors.primary,
      borderRadius: 50,
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginHorizontal: 10,
      marginVertical: 5,
      borderColor: colors.accent,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return styles;
};

export default CardItem;
