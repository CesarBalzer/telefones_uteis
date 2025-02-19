import React, { useContext, useMemo } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const StateCard = ({ title, onPress, isActive }) => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];

  const styles = useMemo(
    () => createStyles(activeColors, isActive),
    [activeColors, isActive]
  );

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Icon
        name="star"
        size={24}
        color={isActive ? activeColors.secondary : activeColors.accent}
      />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const createStyles = (colors, isActive) =>
  StyleSheet.create({
    container: {
      minWidth: 130,
      borderRadius: 50,
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginHorizontal: 6,
      marginVertical: 1,
      backgroundColor: isActive ? colors.accent : colors.secondary,
      elevation: isActive ? 5 : 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 14,
      fontWeight: '600',
      color: isActive ? colors.primary : colors.text,
      marginTop: 5,
    },
  });

export default StateCard;
