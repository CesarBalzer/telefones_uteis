import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../../context/ThemeContext';
import { colors } from '../../config/theme';
import CustomButton from '../Buttons/CustomButton';

const SelectDropdownModal = ({
  data,
  emptyTitle,
  onSelect,
  selected,
  select,
  label,
}) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [selectedItem, setSelectedItem] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    setSelectedItem(selected);
  }, [selected]);

  const handleSelect = (item, index) => {
    setSelectedItem(item);
    setIsModalVisible(false);
    onSelect(item, index);
  };

  const getSelectedIndex = () => {
    if (!selectedItem) return 0;
    return data.findIndex((item) => item.id === selectedItem.id);
  };

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={() => {
          setIsModalVisible(true);
          setTimeout(() => {
            const index = getSelectedIndex();
            if (flatListRef.current && index >= 0) {
              flatListRef.current.scrollToIndex({
                index,
                animated: true,
                viewOffset: 20, // 🔥 Ajuste fino para evitar sumir o topo do item
              });
            }
          }, 200);
        }}
        style={styles.dropdownButtonStyle}
      >
        {selectedItem && (
          <Icon
            name={selectedItem.icon?.trim() !== '' ? selectedItem.icon : 'star'}
            style={styles.dropdownButtonIconStyle}
          />
        )}
        <Text style={styles.dropdownButtonTxtStyle}>
          {selectedItem ? selectedItem[select] : emptyTitle}
        </Text>
        <Icon name="chevron-down" style={styles.dropdownButtonArrowStyle} />
      </TouchableOpacity>

      {/* Modal atualizado */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
            <View style={styles.modalBackground} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{label}</Text>

            <FlatList
              ref={flatListRef}
              data={data}
              keyExtractor={(item) => item.id.toString()}
              initialScrollIndex={getSelectedIndex()}
              getItemLayout={(data, index) => ({
                length: 60,
                offset: 60 * index - 7,
                index,
              })}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item, index)}
                  style={{
                    ...styles.dropdownItemStyle,
                    ...(selectedItem?.id === item.id && {
                      backgroundColor: activeColors.accent,
                    }),
                  }}
                >
                  <Icon
                    name={item.icon?.trim() !== '' ? item.icon : 'star'}
                    style={{
                      ...styles.dropdownItemIconStyle,
                      ...(selectedItem?.id === item.id && {
                        color: activeColors.primary,
                      }),
                    }}
                  />
                  <Text
                    style={{
                      ...styles.dropdownItemTxtStyle,
                      ...(selectedItem?.id === item.id && {
                        color: activeColors.primary,
                      }),
                    }}
                  >
                    {item[select]}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <CustomButton
              size="large"
              label="Fechar"
              onPress={() => setIsModalVisible(false)}
              type="outlined"
              // loading={loading}
              icon={
                <Icon name="close" size={25} color={activeColors.accent} />
              }
              style={{marginTop:20}}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (colors) => ({
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.accent,
  },
  dropdownButtonStyle: {
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: colors.text,
  },
  dropdownItemStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 0.4,
    borderBottomColor: colors.accent,
    borderRadius: 10,
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
  closeButton: {
    marginTop: 15,
    backgroundColor: colors.secondary,
    paddingVertical: 25,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    paddingHorizontal: 5,
  },
});

export default SelectDropdownModal;
