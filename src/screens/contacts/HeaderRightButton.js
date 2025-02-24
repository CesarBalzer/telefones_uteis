import React, { useContext } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../../context/ThemeContext';
import { colors } from '../../config/theme';

const HeaderRightButton = ({ onPress }) => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <View style={styles.content}>
        <Icon name="account-plus" size={24} color={activeColors.text} />
        <Text style={styles.text}>Criar novo</Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    button: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.primary,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      marginLeft: 5,
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default HeaderRightButton;
