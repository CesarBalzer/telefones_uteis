import React, { useContext } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../../context/ThemeContext';
import { colors } from '../../config/theme';
import MaskInput from 'react-native-mask-input';

const InputField = ({
  icon,
  label,
  placeholder,
  value,
  onChange,
  inputType,
  keyboardType,
  mask,
  ...restProps
}) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {icon ?? ''}
        <MaskInput
          {...restProps}
          style={styles.input}
          mask={mask}
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          secureTextEntry={inputType === 'password' ? true : false}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
};
const createStyles = (colors) => {
  const styles = StyleSheet.create({
    container: {
      // marginVertical: 10,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.accent,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: `${colors.tertiary}30`,
      width: '100%',
    },
    input: {
      fontSize: 20,
      flex: 1,
      color: colors.text,
    },
    icon: {
      marginRight: 10,
    },
  });
  return styles;
};

export default InputField;
