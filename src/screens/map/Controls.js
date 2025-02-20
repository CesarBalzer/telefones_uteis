import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { colors } from '../../config/theme';
import CustomButton from '../../components/Buttons/CustomButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Controls = ({ adjustZoom }) => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);

  return (
    <View style={styles.zoomControls}>
      <CustomButton
        type="invert"
        size="small"
        shape="circle"
        onPress={() => adjustZoom(-0.2)}
        iconPosition="left"
        icon={<Icon name="minus" size={32} color={activeColors.text} />}
      />
      <CustomButton
        type="invert"
        size="small"
        shape="circle"
        onPress={() => adjustZoom(0.2)}
        iconPosition="left"
        icon={<Icon name="plus" size={32} color={activeColors.text} />}
      />
    </View>
  );
};

const createStyles = (colors) => {
  return StyleSheet.create({
    zoomControls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
  });
};

export default Controls;
