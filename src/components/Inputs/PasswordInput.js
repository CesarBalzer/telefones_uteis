import React, { useContext, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../../context/ThemeContext';
import { colors } from '../../config/theme';

const PasswordInput = ({ value, onChangeText, placeholder }) => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={activeColors.placeholder}
        secureTextEntry={!isPasswordVisible}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
      >
        <Icon
          name={isPasswordVisible ? 'eye-off' : 'eye'}
          size={24}
          color={activeColors.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginBottom: 15,
    },
    input: {
      flex: 1,
      padding: 12,
      fontSize: 16,
      color: colors.text,
    },
    iconContainer: {
      padding: 10,
    },
  });

export default PasswordInput;
