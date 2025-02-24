import React, { useContext } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { colors } from '../../config/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const IconSearch = ({ value, loading, onPress }) => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);

  return (
    <View style={styles.center}>
      {loading ? (
        <ActivityIndicator size="small" color={activeColors.text} />
      ) : value ? (
        <TouchableOpacity onPress={onPress}>
          <Icon
            name="close"
            size={30}
            color={activeColors.danger}
            style={styles.icon}
          />
        </TouchableOpacity>
      ) : (
        <Icon
          name="magnify"
          size={30}
          color={activeColors.text}
          style={styles.icon}
        />
      )}
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      marginRight: 5,
    },
  });

export default IconSearch;
