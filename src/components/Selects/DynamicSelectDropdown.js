import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../../context/ThemeContext';
import { colors } from '../../config/theme';

const DynamicSelectDropdown = ({
  data,
  emptyTitle,
  onSelect,
  selected,
  select,
  label,
}) => {
  // console.log('SELECTED => ', selected);
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [selectedItem, setSelectedItem] = useState();
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    setSelectedItem(selected);
  }, [selected]);

  const handleSelect = (item, index) => {
    setSelectedItem(item);
    setIsOpened(false);
    onSelect(item, index);
  };

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={() => setIsOpened(!isOpened)}
        style={styles.dropdownButtonStyle}
      >
        {selectedItem && (
          <Icon
            name={selectedItem.icon}
            style={styles.dropdownButtonIconStyle}
          />
        )}
        <Text style={styles.dropdownButtonTxtStyle}>
          {selectedItem ? selectedItem[select] : emptyTitle}
        </Text>
        <Icon
          name={isOpened ? 'chevron-up' : 'chevron-down'}
          style={styles.dropdownButtonArrowStyle}
        />
      </TouchableOpacity>
      {isOpened && (
        <View style={styles.dropdownMenuStyle}>
          {data.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelect(item, index)}
              style={{
                ...styles.dropdownItemStyle,
                ...(selectedItem &&
                  selectedItem.id == item.id && {
                    backgroundColor: activeColors.secondary,
                  }),
              }}
            >
              <Icon
                name={item && item.icon !== '' ? item.icon : 'star'}
                style={styles.dropdownItemIconStyle}
              />
              <Text style={styles.dropdownItemTxtStyle}>
                {selectedItem && selectedItem.id == item.id
                  ? selectedItem[select]
                  : item[select]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
const createStyles = (colors) => {
  const styles = StyleSheet.create({
    label: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.accent,
    },
    dropdownButtonStyle: {
      height: 50,
      // backgroundColor: colors.secondary,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: `${colors.tertiary}30`,
    },
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: 18,
      color: colors.text,
    },
    dropdownButtonArrowStyle: {
      fontSize: 28,
      color: colors.tertiary,
    },
    dropdownButtonIconStyle: {
      fontSize: 20,
      marginRight: 8,
      color: colors.tertiary,
    },
    dropdownMenuStyle: {
      backgroundColor: colors.secondary,
      borderRadius: 10,
    },
    dropdownItemStyle: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: colors.text,
    },
    dropdownItemIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
  });
  return styles;
};

export default DynamicSelectDropdown;
