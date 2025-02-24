import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';

export default function InputSearch({
  label,
  value,
  icon,
  inputType,
  onChangeText,
  keyboardType,
  fieldButtonLabel,
  fieldButtonFunction,
  style,
  disabled = false,
  ...restProps
}) {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: disabled ? activeColors.disabledBackground : activeColors.background,
        padding: 8,
        borderRadius: 8,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <TextInput
        {...restProps}
        editable={!disabled}
        placeholderTextColor={disabled ? activeColors.disabledText : activeColors.text}
        placeholder={label}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        style={[
          style,
          {
            flex: 1,
            paddingVertical: 0,
            color: disabled ? activeColors.disabledText : activeColors.text,
            fontSize: !!label ? 18 : 14,
            fontWeight: !!label ? '600' : '300',
          },
        ]}
      />
      {icon}
      <TouchableOpacity
        onPress={!disabled ? fieldButtonFunction : null}
        disabled={disabled}
        style={{ marginLeft: 8 }}
      >
        <Text
          style={{
            color: disabled ? activeColors.disabledText : activeColors.accent,
            fontWeight: '700',
          }}
        >
          {fieldButtonLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
