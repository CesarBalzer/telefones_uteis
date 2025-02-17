import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';
import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { colors } from '../../config/theme';

const CustomButton = ({
  label,
  onPress,
  style,
  icon,
  iconPosition = 'left', // Valores: 'left', 'right', 'top', 'bottom'
  type = 'default',
  size = 'normal', // Valores: 'small', 'normal', 'large', 'big'
  shape = 'rounded', // Valores: 'square', 'circle', 'rounded'
  disabled = false,
  loading = false,
  ...rest
}) => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const isHorizontal = iconPosition === 'left' || iconPosition === 'right';
  const flexDirection = isHorizontal ? 'row' : 'column';

  const styles = createStyles(
    activeColors,
    type,
    size,
    shape,
    disabled,
    isHorizontal
  );

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={onPress}
      style={[styles.container, style]}
      {...rest}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={styles.primary} />
        </View>
      ) : (
        <View style={[styles.content, { flexDirection }]}>
          {(iconPosition === 'top' || iconPosition === 'left') && icon && (
            <View style={styles.icon}>{icon}</View>
          )}
          <Text style={styles.text}>{label || ''}</Text>
          {(iconPosition === 'bottom' || iconPosition === 'right') && icon && (
            <View style={styles.icon}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (colors, type, size, shape, disabled, isHorizontal) => {
  let backgroundColor,
    textColor,
    borderColor,
    loadingColor,
    paddingVertical,
    paddingHorizontal,
    width,
    height,
    fontSize,
    borderRadius;

  switch (type) {
    case 'danger':
      backgroundColor = colors.danger;
      textColor = colors.light;
      break;
    case 'warning':
      backgroundColor = colors.warning;
      textColor = colors.secondary;
      break;
    case 'info':
      backgroundColor = colors.info;
      textColor = colors.secondary;
      break;
    case 'invert':
      backgroundColor = colors.light;
      textColor = colors.primary;
      break;
    case 'success':
      backgroundColor = colors.success;
      textColor = colors.light;
      break;
    case 'outlined':
      backgroundColor = 'transparent';
      borderColor = colors.primary;
      textColor = colors.secondary;
      borderWidth = 1;
      break;
    default:
      backgroundColor = colors.accent;
      textColor = colors.secondary;
  }

  if (disabled) {
    backgroundColor = `${colors.tertiary}30`;
    textColor = `${colors.tertiary}60`;
  }

  loadingColor = type === 'outlined' ? colors.primary : colors.light;

  switch (size) {
    case 'small':
      width = 40;
      height = 40;
      paddingVertical = 6;
      paddingHorizontal = 10;
      fontSize = 12;

      break;
    case 'large':
      width = 70;
      height = 70;
      paddingVertical = 14;
      paddingHorizontal = 20;
      fontSize = 18;

      break;
    case 'big':
      width = 90;
      height = 90;
      paddingVertical = 18;
      paddingHorizontal = 25;
      fontSize = 20;

      break;
    case 'normal':
    default:
      width = 50;
      height = 50;
      paddingVertical = 10;
      paddingHorizontal = 15;
      fontSize = 14;
  }

  switch (shape) {
    case 'square':
      borderRadius = 0;
      break;
    case 'circle':
      borderRadius = Math.max(width, height) / 2;
      break;
    case 'rounded':
    default:
      borderRadius = 10;
  }

  return StyleSheet.create({
    container: {
      backgroundColor,
      paddingVertical,
      paddingHorizontal,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius,
      borderColor,
      borderWidth: type === 'outlined' ? 1 : 0,
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      marginHorizontal: isHorizontal ? 5 : 0,
      marginVertical: !isHorizontal ? 5 : 0,
    },
    text: {
      textAlign: 'center',
      fontWeight: '700',
      fontSize,
      color: textColor,
    },
    loadingContainer: {
      paddingHorizontal: 10,
    },
    loadingColor: {
      color: colors.light,
    },
  });
};

export default CustomButton;
